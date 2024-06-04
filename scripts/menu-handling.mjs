// I din menu-handling.mjs-fil
export const toggle = () => {
    const toggleButton = document.getElementById('toggle-menu');
    const menu = document.querySelector('.navbar');

    toggleButton.addEventListener('click', () => {
        menu.classList.toggle('show-menu');
    });
};
