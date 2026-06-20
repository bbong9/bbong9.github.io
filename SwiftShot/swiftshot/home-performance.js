(() => {
  const setupHomeReveal = () => {
    document.documentElement.classList.add('swiftshot-home-ready');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupHomeReveal, { once: true });
  } else {
    setupHomeReveal();
  }
})();
