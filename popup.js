document.addEventListener('DOMContentLoaded', () => {
    const btnDark = document.getElementById('btn-dark');
    const btnLight = document.getElementById('btn-light');
    const customColor = document.getElementById('custom-color');
    
    const toggleFriends = document.getElementById('toggle-friends');
    const rangeGrid = document.getElementById('range-grid');
    const valGrid = document.getElementById('val-grid');
    const rangeText = document.getElementById('range-text');
    const valText = document.getElementById('val-text');
    const toggleHover = document.getElementById('toggle-hover');
    const toggleClick = document.getElementById('toggle-click');

    const defaultSettings = {
        theme: 'dark',
        customHex: '#6366f1',
        showFriends: true,
        gridSize: 140,
        textSize: 16,
        hoverAnim: true,
        clickAnim: true
    };

    const updateActiveButton = (theme) => {
        btnDark.classList.toggle('active', theme === 'dark');
        btnLight.classList.toggle('active', theme === 'light');
    };

    chrome.storage.local.get(defaultSettings, (settings) => {
        updateActiveButton(settings.theme);
        customColor.value = settings.customHex;
        
        toggleFriends.checked = settings.showFriends;
        
        rangeGrid.value = settings.gridSize;
        valGrid.textContent = `${settings.gridSize}px`;
        
        rangeText.value = settings.textSize;
        valText.textContent = `${settings.textSize}px`;
        
        toggleHover.checked = settings.hoverAnim;
        toggleClick.checked = settings.clickAnim;
    });

    const updateSetting = (key, value) => {
        chrome.storage.local.set({ [key]: value });
    };

    btnDark.addEventListener('click', () => {
        updateActiveButton('dark');
        updateSetting('theme', 'dark');
    });

    btnLight.addEventListener('click', () => {
        updateActiveButton('light');
        updateSetting('theme', 'light');
    });

    customColor.addEventListener('input', (e) => {
        updateActiveButton('custom');
        updateSetting('theme', 'custom');
        updateSetting('customHex', e.target.value);
    });

    toggleFriends.addEventListener('change', (e) => {
        updateSetting('showFriends', e.target.checked);
    });

    rangeGrid.addEventListener('input', (e) => {
        valGrid.textContent = `${e.target.value}px`;
        updateSetting('gridSize', parseInt(e.target.value, 10));
    });

    rangeText.addEventListener('input', (e) => {
        valText.textContent = `${e.target.value}px`;
        updateSetting('textSize', parseInt(e.target.value, 10));
    });

    toggleHover.addEventListener('change', (e) => {
        updateSetting('hoverAnim', e.target.checked);
    });

    toggleClick.addEventListener('change', (e) => {
        updateSetting('clickAnim', e.target.checked);
    });
});
