/**
 * Navbar menu icon
 */

const menuBtn = document.querySelector('.menu');
const navContainer = document.querySelector('.nav');

// bind click event to menu-icon button
menuBtn.addEventListener('click', () => {
  navContainer.classList.toggle('js-menu');
});
