(() => {
  'use strict';

  const topNav = document.querySelector('.VPNav.wiki-nav');
  const bottomNav = document.querySelector('.ss-ref-page .sidebar');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!topNav && !bottomNav) return;

  const findTopTrigger = () => {
    return document.querySelector('.wiki-hero-bottom')
      || document.querySelector('.ss-doc-section, .ss-feature-section, .ss-faq-section')
      || document.querySelector('.wiki-section')
      || document.querySelector('article.doc h1:not([hidden])')
      || document.querySelector('#VPContent');
  };

  let topFloating = false;
  let topTicking = false;

  const setTopFloating = (value) => {
    if (!topNav || topFloating === value) return;
    topFloating = value;
    topNav.classList.toggle('is-floating', value);
  };

  const updateTopNav = () => {
    topTicking = false;
    if (!topNav) return;

    const trigger = findTopTrigger();
    if (!trigger) {
      setTopFloating(window.scrollY > 96);
      return;
    }

    const top = trigger.getBoundingClientRect().top;
    const vh = window.innerHeight || document.documentElement.clientHeight || 800;
    const activateLine = Math.min(360, Math.max(210, vh * 0.38));
    const resetLine = Math.min(560, Math.max(320, vh * 0.58));

    if (top <= activateLine) {
      setTopFloating(true);
    } else if (top > resetLine || window.scrollY < 24) {
      setTopFloating(false);
    }
  };

  const requestTopUpdate = () => {
    if (!topNav || topTicking) return;
    topTicking = true;
    window.requestAnimationFrame(updateTopNav);
  };

  let bottomHideTimer = 0;
  let bottomPinned = false;
  let bottomVisible = false;

  const setBottomVisible = (value) => {
    if (!bottomNav || bottomVisible === value) return;
    bottomVisible = value;
    bottomNav.classList.toggle('is-visible', value);
  };

  const clearBottomTimer = () => {
    if (bottomHideTimer) {
      window.clearTimeout(bottomHideTimer);
      bottomHideTimer = 0;
    }
  };

  const hideBottomNav = () => {
    if (!bottomNav || bottomPinned || bottomNav.matches(':focus-within')) return;
    setBottomVisible(false);
  };

  const scheduleBottomHide = (delay = 1450) => {
    if (!bottomNav) return;
    clearBottomTimer();
    if (reduceMotion.matches) delay = Math.max(delay, 1850);
    bottomHideTimer = window.setTimeout(hideBottomNav, delay);
  };

  const revealBottomNav = (delay = 1450) => {
    if (!bottomNav) return;
    setBottomVisible(true);
    if (!bottomPinned) scheduleBottomHide(delay);
  };

  const onUserScroll = () => {
    requestTopUpdate();
    if (bottomNav) revealBottomNav();
  };

  window.addEventListener('scroll', onUserScroll, { passive: true });
  window.addEventListener('wheel', () => bottomNav && revealBottomNav(), { passive: true });
  window.addEventListener('touchmove', () => bottomNav && revealBottomNav(), { passive: true });
  window.addEventListener('resize', () => {
    requestTopUpdate();
    if (bottomNav && bottomVisible) scheduleBottomHide(900);
  }, { passive: true });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Tab' && bottomNav) revealBottomNav(2200);
  });
  reduceMotion.addEventListener?.('change', () => {
    requestTopUpdate();
    if (bottomNav && bottomVisible) scheduleBottomHide();
  });

  if (bottomNav) {
    bottomNav.addEventListener('mouseenter', () => {
      bottomPinned = true;
      clearBottomTimer();
      setBottomVisible(true);
    });
    bottomNav.addEventListener('mouseleave', () => {
      bottomPinned = false;
      scheduleBottomHide(900);
    });
    bottomNav.addEventListener('focusin', () => {
      bottomPinned = true;
      clearBottomTimer();
      setBottomVisible(true);
    });
    bottomNav.addEventListener('focusout', () => {
      bottomPinned = false;
      scheduleBottomHide(900);
    });
    bottomNav.addEventListener('click', () => scheduleBottomHide(900));
  }

  const init = () => {
    updateTopNav();
    if (bottomNav) setBottomVisible(false);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
