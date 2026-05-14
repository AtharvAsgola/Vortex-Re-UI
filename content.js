
const applyTheme = (theme, customHex = null) => {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = document.querySelector('#theme-toggle i');

    if (theme === 'custom' && customHex) {
        const rgb = parseInt(customHex.slice(1), 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = (rgb >> 0) & 0xff;
        const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

        const clamp = val => Math.min(255, Math.max(0, Math.round(val)));
        const adjust = (r, g, b, amount) => `rgba(${clamp(r + amount)}, ${clamp(g + amount)}, ${clamp(b + amount)}, 0.8)`;

        document.documentElement.style.setProperty('--bg-primary', customHex);

        if (luma < 128) {
            document.documentElement.style.setProperty('--bg-secondary', adjust(r, g, b, 15));
            document.documentElement.style.setProperty('--card-bg', adjust(r, g, b, 25));
            document.documentElement.style.setProperty('--text-main', '#ffffff', 'important');
            document.documentElement.style.setProperty('--text-dim', 'rgba(255,255,255,0.7)');
            document.documentElement.style.setProperty('--border', 'rgba(255,255,255,0.1)');
            document.documentElement.style.setProperty('--border-hover', 'rgba(255,255,255,0.2)');
            document.documentElement.style.setProperty('--accent', `rgb(${clamp(r + 60)},${clamp(g + 60)},${clamp(b + 60)})`);
            document.documentElement.style.setProperty('--logo-color', `rgb(${clamp(r + 80)},${clamp(g + 80)},${clamp(b + 80)})`);
            document.documentElement.style.setProperty('--btn-text', '#ffffff');
        } else {
            document.documentElement.style.setProperty('--bg-secondary', adjust(r, g, b, -15));
            document.documentElement.style.setProperty('--card-bg', adjust(r, g, b, -25));
            document.documentElement.style.setProperty('--text-main', '#000000', 'important');
            document.documentElement.style.setProperty('--text-dim', 'rgba(0,0,0,0.7)');
            document.documentElement.style.setProperty('--border', 'rgba(0,0,0,0.1)');
            document.documentElement.style.setProperty('--border-hover', 'rgba(0,0,0,0.2)');
            document.documentElement.style.setProperty('--accent', `rgb(${clamp(r - 60)},${clamp(g - 60)},${clamp(b - 60)})`);
            document.documentElement.style.setProperty('--logo-color', `rgb(${clamp(r - 80)},${clamp(g - 80)},${clamp(b - 80)})`);
            document.documentElement.style.setProperty('--btn-text', '#ffffff');
        }
        if (icon) icon.className = 'fas fa-palette';
    } else {
        document.documentElement.style.removeProperty('--bg-primary');
        document.documentElement.style.removeProperty('--bg-secondary');
        document.documentElement.style.removeProperty('--card-bg');
        document.documentElement.style.removeProperty('--accent');
        document.documentElement.style.removeProperty('--logo-color');
        document.documentElement.style.removeProperty('--text-main');
        document.documentElement.style.removeProperty('--text-dim');
        document.documentElement.style.removeProperty('--border');
        document.documentElement.style.removeProperty('--border-hover');
        document.documentElement.style.removeProperty('--btn-text');

        if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
};

// Initialize theme on page load immediately to prevent flashing
const savedTheme = localStorage.getItem('vortex-theme') || 'dark';
const savedCustomColor = localStorage.getItem('vortex-custom-color') || '#6366f1';
applyTheme(savedTheme, savedCustomColor);

// Listen for messages from the popup!
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'setTheme') {
        localStorage.setItem('vortex-theme', request.theme);
        applyTheme(request.theme, localStorage.getItem('vortex-custom-color') || '#6366f1');
        sendResponse({ success: true });
    } else if (request.action === 'setCustomColor') {
        localStorage.setItem('vortex-theme', 'custom');
        localStorage.setItem('vortex-custom-color', request.hex);
        applyTheme('custom', request.hex);
        sendResponse({ success: true });
    } else if (request.action === 'getThemeStatus') {
        sendResponse({
            theme: localStorage.getItem('vortex-theme') || 'dark',
            customHex: localStorage.getItem('vortex-custom-color') || '#6366f1'
        });
    }
});

const injectThemeToggle = () => {
    let navbar = document.querySelector('.navbar-actions');
    // Only inject the toggle button if the navbar exists (e.g. not on login page)
    if (!navbar || document.getElementById('theme-toggle')) return;

    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'theme-toggle';
    toggleBtn.className = 'btn-signout-sm';

    // Set initial icon based on current theme
    const currentTheme = document.documentElement.getAttribute('data-theme');
    toggleBtn.innerHTML = `<i class="fas fa-${currentTheme === 'custom' ? 'palette' : (currentTheme === 'light' ? 'sun' : 'moon')}"></i>`;
    toggleBtn.style.position = 'relative';

    navbar.prepend(toggleBtn);

    // Simple click to toggle between dark and light
    toggleBtn.addEventListener('click', e => {
        let newTheme;
        const theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'custom') {
            newTheme = 'dark';
        } else {
            newTheme = theme === 'dark' ? 'light' : 'dark';
        }
        localStorage.setItem('vortex-theme', newTheme);
        applyTheme(newTheme, localStorage.getItem('vortex-custom-color') || '#6366f1');
    });
};

const observer = new MutationObserver(() => injectThemeToggle());
observer.observe(document.body, { childList: true, subtree: true });
injectThemeToggle();

const injectLeaveButton = () => {
    if (!window.location.pathname.includes('/play')) return;

    const overlay = document.getElementById('overlay');
    if (!overlay || document.getElementById('leave-game-btn')) return;

    const leaveBtn = document.createElement('button');
    leaveBtn.id = 'leave-game-btn';
    leaveBtn.innerText = 'Leave Game';

    leaveBtn.addEventListener('mousedown', e => e.stopPropagation());
    leaveBtn.addEventListener('click', e => {
        e.stopPropagation();
        window.location.href = 'https://vortex.towerstats.com/home';
    });

    overlay.appendChild(leaveBtn);
};

const overlayObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.attributeName === 'style') {
            injectLeaveButton();
        }
    });
});

const overlayEl = document.getElementById('overlay');
if (overlayEl) {
    overlayObserver.observe(overlayEl, { attributes: true });
}

injectLeaveButton();

const ensurePatienceNote = () => {
    const overlay = document.getElementById('overlay');
    if (!overlay) return;

    let note = document.getElementById('patience-note');
    if (!note) {
        note = document.createElement('div');
        note.id = 'patience-note';
        note.innerText = 'May take a moment to be able to click to play again. Thank you for your patience.';
        note.style.cssText = 'font-size: 0.9rem; color: rgba(255,255,255,0.7); margin-top: 20px; font-weight: 500; display: none; text-align: center; pointer-events: none;';
        overlay.appendChild(note);
    }
};

setInterval(ensurePatienceNote, 1000);

let patienceTimer;
document.addEventListener('pointerlockchange', () => {
    const overlay = document.getElementById('overlay');
    const note = document.getElementById('patience-note');

    if (document.pointerLockElement) {
        if (overlay) overlay.style.display = 'none';
        if (note) note.style.display = 'none';
        clearTimeout(patienceTimer);
    } else {
        if (overlay) overlay.style.display = 'flex';
        if (note) {
            note.style.display = 'block';
            clearTimeout(patienceTimer);
            patienceTimer = setTimeout(() => {
                if (note) note.style.display = 'none';
            }, 5000);
        }
    }
}, false);

document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        const chatInput = document.getElementById('chat-input');
        if (!chatInput) return;

        const isChatFocused = document.activeElement === chatInput || chatInput.contains(document.activeElement);

        if (isChatFocused) {
            const range = document.createRange();
            range.selectNodeContents(chatInput);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            e.preventDefault();
        } else {
            e.preventDefault();
        }
    }
});

const handleProfilePage = () => {
    if (!window.location.pathname.includes('/profile')) return;

    const actionContainer = document.getElementById('profile-actions');
    if (actionContainer) {
        actionContainer.style.display = 'flex';
        actionContainer.style.gap = '10px';
        actionContainer.style.marginTop = '10px';
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.classList.add('btn-signout-sm');
    }
};

const profileObserver = new MutationObserver(() => handleProfilePage());
profileObserver.observe(document.body, { childList: true, subtree: true });
handleProfilePage();