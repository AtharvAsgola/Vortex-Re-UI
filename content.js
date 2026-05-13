const injectThemeToggle = () => {
    const navbar = document.querySelector('.navbar-actions');
    if (!navbar || document.getElementById('theme-toggle')) return;

    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'theme-toggle';
    toggleBtn.className = 'btn-signout-sm';
    toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';

    navbar.prepend(toggleBtn);

    const currentTheme = localStorage.getItem('vortex-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateIcon(currentTheme);

    toggleBtn.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('vortex-theme', newTheme);
        updateIcon(newTheme);
    });
};

const updateIcon = (theme) => {
    const icon = document.querySelector('#theme-toggle i');
    if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
};

const observer = new MutationObserver(() => {
    injectThemeToggle();
});

observer.observe(document.body, { childList: true, subtree: true });
injectThemeToggle();

const injectLeaveButton = () => {
    if (!window.location.pathname.includes('/play')) return;

    const overlay = document.getElementById('overlay');
    if (!overlay || document.getElementById('leave-game-btn')) return;

    const leaveBtn = document.createElement('button');
    leaveBtn.id = 'leave-game-btn';
    leaveBtn.innerText = 'Leave Game';

    leaveBtn.addEventListener('mousedown', (e) => {
        e.stopPropagation();
    });

    leaveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.location.href = 'https://vortex.towerstats.com/home';
    });

    overlay.appendChild(leaveBtn);
};

const overlayObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === 'style') {
            const overlay = mutation.target;
            injectLeaveButton();
        }
    });
});

const overlayEl = document.getElementById('overlay');
if (overlayEl) {
    overlayObserver.observe(overlayEl, { attributes: true });
}

document.addEventListener('pointerlockchange', () => {
    const overlay = document.getElementById('overlay');
    if (!overlay) return;

    if (document.pointerLockElement) {
        overlay.style.display = 'none';
    } else {
        overlay.style.display = 'flex';
    }
}, false);

injectLeaveButton();

const ensurePatienceNote = () => {
    const overlay = document.getElementById('overlay');
    if (!overlay) return;

    let note = document.getElementById('patience-note');
    if (!note) {
        note = document.createElement('div');
        note.id = 'patience-note';
        note.innerText = 'May take a moment to be able to click to play again. Thank you for your patience.';
        note.style.cssText = 'font-size: 0.85rem; color: rgba(255,255,255,0.5); margin-top: 15px; font-weight: 400; display: none; text-align: center; pointer-events: none;';
        overlay.appendChild(note);
    }
};

setInterval(ensurePatienceNote, 1000);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const note = document.getElementById('patience-note');
        if (note) {
            note.style.display = 'block';
            setTimeout(() => { note.style.display = 'none'; }, 10000);
        }
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        const chatInput = document.getElementById('chat-input');
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
    if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        const chatInput = document.getElementById('chat-input');
        const isChatFocused = document.activeElement === chatInput || chatInput.contains(document.activeElement);

        if (isChatFocused) {
            const range = document.createRange();
            range.selectNodeContents(chatInput);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            e.preventDefault();
        }
    }
});

document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement) {
        const note = document.getElementById('patience-note');
        if (note) note.style.display = 'none';
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

const profileObserver = new MutationObserver(() => {
    handleProfilePage();
});

profileObserver.observe(document.body, { childList: true, subtree: true });
handleProfilePage();