document.addEventListener('DOMContentLoaded', () => {
    const btnDark = document.getElementById('btn-dark');
    const btnLight = document.getElementById('btn-light');
    const customColor = document.getElementById('custom-color');

    const updateActiveButton = (theme) => {
        btnDark.classList.toggle('active', theme === 'dark');
        btnLight.classList.toggle('active', theme === 'light');
    };

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'getThemeStatus' }, (response) => {
                if (response) {
                    updateActiveButton(response.theme);
                    customColor.value = response.customHex;
                }
            });
        }
    });

    const sendThemeAction = (action, data = {}) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action, ...data });
            }
        });
    };

    btnDark.addEventListener('click', () => {
        updateActiveButton('dark');
        sendThemeAction('setTheme', { theme: 'dark' });
    });

    btnLight.addEventListener('click', () => {
        updateActiveButton('light');
        sendThemeAction('setTheme', { theme: 'light' });
    });

    customColor.addEventListener('input', (e) => {
        updateActiveButton('custom');
        sendThemeAction('setCustomColor', { hex: e.target.value });
    });
});
