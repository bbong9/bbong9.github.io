(() => {
  'use strict';

  const nav = document.querySelector('.VPNav.wiki-nav');
  if (!nav) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let floating = false;
  let ticking = false;

  const findTrigger = () => {
    return document.querySelector('.wiki-hero-bottom')
      || document.querySelector('.wiki-section')
      || document.querySelector('article.doc h1')
      || document.querySelector('#VPContent');
  };

  const setFloating = (value) => {
    if (floating === value) return;
    floating = value;
    nav.classList.toggle('is-floating', value);
  };

  const update = () => {
    ticking = false;
    const trigger = findTrigger();
    if (!trigger) {
      setFloating(window.scrollY > 96);
      return;
    }

    const top = trigger.getBoundingClientRect().top;
    const vh = window.innerHeight || document.documentElement.clientHeight || 800;
    const activateLine = Math.min(360, Math.max(210, vh * 0.38));
    const resetLine = Math.min(560, Math.max(320, vh * 0.58));

    if (top <= activateLine) {
      setFloating(true);
    } else if (top > resetLine || window.scrollY < 24) {
      setFloating(false);
    }
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  reduceMotion.addEventListener?.('change', requestUpdate);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', update, { once: true });
  } else {
    update();
  }
})();
