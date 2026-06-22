(() => {
  'use strict';

  const stages = document.querySelectorAll('[data-download-stage]');
  if (!stages.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const activate = (stage) => {
    stage.classList.add('is-in-view');
  };

  if (!('IntersectionObserver' in window) || reduceMotion.matches) {
    stages.forEach(activate);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting || entry.intersectionRatio > 0.18) {
        activate(entry.target);
      }
    });
  }, {
    root: null,
    threshold: [0.18, 0.34, 0.58],
    rootMargin: '0px 0px -10% 0px',
  });

  stages.forEach((stage) => observer.observe(stage));
})();
