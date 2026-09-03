const CURRENT_VERSION = '3.0.0';

document.addEventListener('DOMContentLoaded', () => {
    const footer = document.querySelector('.textOnTheRight');
    if (footer) footer.textContent = 'Math Practice ' + CURRENT_VERSION;

    document.title = document.title.replace(/\s*[\d.]+$/, '').trim() + ' ' + CURRENT_VERSION;
});
