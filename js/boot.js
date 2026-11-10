/* Runs before the page paints. Marks JS as available, so scroll
   animations only hide content when they are able to reveal it. */
document.documentElement.classList.add('js');
