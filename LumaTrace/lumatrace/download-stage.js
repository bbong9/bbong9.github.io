(() => {
  'use strict';

  const stages = document.querySelectorAll('[data-download-stage]');
  if (!stages.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let alignFrame = 0;

  const getRect = (element) => element ? element.getBoundingClientRect() : null;
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const alignCatToBottomEdge = (stage) => {
    const cat = stage.querySelector('.download-cat');
    const card = stage.querySelector('.lumatrace-download-card') || stage;
    const button = stage.querySelector('.download-stage-button');
    if (!cat) return;

    const stageRect = getRect(stage);
    const cardRect = getRect(card);
    if (!stageRect || !cardRect || stageRect.bottom <= 0 || stageRect.top >= window.innerHeight) {
      cat.style.setProperty('--download-cat-peek-y', '0px');
      cat.style.setProperty('--download-cat-awake-y', '0px');
      cat.style.setProperty('--download-cat-paw-peek-y', '0px');
      cat.style.setProperty('--download-cat-paw-awake-y', '0px');
      return;
    }

    const style = window.getComputedStyle(stage);
    const catStyle = window.getComputedStyle(cat);
    const bottomOverlap = Number.parseFloat(style.getPropertyValue('--download-cat-bottom-overlap')) || 0;
    const bottomOffset = Number.parseFloat(catStyle.bottom) || 0;
    const targetBottom = Math.min(window.innerHeight, cardRect.bottom);
    const layoutHeight = cat.offsetHeight || cat.getBoundingClientRect().height || 1;
    const baseTop = cardRect.bottom - bottomOffset - layoutHeight;
    const buttonRect = getRect(button);

    if (stage.querySelector('.download-cat-art')) {
      const isShortViewport = window.innerHeight < 720;
      const roomBelowButton = buttonRect ? targetBottom - buttonRect.bottom : targetBottom;
      const hasRoomForPeek = !buttonRect || roomBelowButton > clamp(window.innerHeight * 0.12, 58, 92);
      const peekHeight = isShortViewport
        ? (hasRoomForPeek ? clamp(layoutHeight * 0.12, 36, 52) : 0)
        : clamp(layoutHeight * 0.12, 56, 78);
      const peekTop = peekHeight > 0 ? targetBottom - peekHeight : targetBottom + 8;
      const peekY = peekTop - baseTop;

      const awakeReveal = isShortViewport
        ? (hasRoomForPeek ? clamp(layoutHeight * 0.42, 138, 190) : clamp(layoutHeight * 0.30, 96, 142))
        : clamp(layoutHeight * 0.48, 220, 300);
      const bottomAnchoredTop = targetBottom - awakeReveal + bottomOverlap;
      const buttonGap = isShortViewport
        ? clamp(window.innerHeight * 0.024, 12, 20)
        : clamp(window.innerHeight * 0.038, 34, 58);
      const roomBelowButtonForCat = buttonRect ? targetBottom - buttonRect.bottom : Infinity;
      const buttonSafeTop = buttonRect ? buttonRect.bottom + buttonGap : bottomAnchoredTop;
      const canPlaceBelowButton = roomBelowButtonForCat > awakeReveal + buttonGap * 0.5;
      const awakeTop = canPlaceBelowButton ? Math.max(bottomAnchoredTop, buttonSafeTop) : bottomAnchoredTop;

      cat.style.setProperty('--download-cat-peek-y', `${peekY.toFixed(2)}px`);
      cat.style.setProperty('--download-cat-awake-y', `${(awakeTop - baseTop).toFixed(2)}px`);
      cat.style.setProperty('--download-cat-paw-peek-y', '0px');
      cat.style.setProperty('--download-cat-paw-awake-y', '0px');
      stage.classList.add('is-cat-positioned');
      return;
    }

    const eyes = Array.from(stage.querySelectorAll('.download-cat-eye'));
    const ears = Array.from(stage.querySelectorAll('.download-cat-ear'));
    const paws = Array.from(stage.querySelectorAll('.download-cat-paw'));
    if (!eyes.length || !ears.length || !paws.length) return;

    const localTop = (element, ancestor) => {
      let y = 0;
      let node = element;
      while (node && node !== ancestor && node instanceof HTMLElement) {
        y += node.offsetTop || 0;
        node = node.offsetParent;
      }
      return y;
    };

    const earBaseTop = baseTop + Math.min(...ears.map((ear) => localTop(ear, cat)));
    const pawMetrics = paws.map((paw) => {
      const height = paw.offsetHeight || paw.getBoundingClientRect().height || 0;
      return {
        bottom: baseTop + localTop(paw, cat) + height,
        height,
      };
    });
    const pawBaseBottom = Math.max(...pawMetrics.map((paw) => paw.bottom));
    const pawHeight = Math.max(...pawMetrics.map((paw) => paw.height));

    const peekHeight = clamp(window.innerHeight * 0.058, 46, 78);
    const peekY = targetBottom - peekHeight - earBaseTop;
    const pawPeekLift = targetBottom + bottomOverlap + pawHeight * 0.48 - (pawBaseBottom + peekY);

    const roomBelowButton = buttonRect ? targetBottom - buttonRect.bottom : 0;
    const awakeGap = clamp(window.innerHeight * 0.15, 170, 222);
    const canClimbNearButton = buttonRect && roomBelowButton > layoutHeight * 0.58;
    const awakeTargetTop = canClimbNearButton
      ? buttonRect.bottom + awakeGap
      : targetBottom - clamp(layoutHeight * 0.18, 96, 150);
    const awakeY = awakeTargetTop - earBaseTop;
    const pawAwakePress = targetBottom + bottomOverlap - (pawBaseBottom + awakeY);

    cat.style.setProperty('--download-cat-peek-y', `${peekY.toFixed(2)}px`);
    cat.style.setProperty('--download-cat-awake-y', `${awakeY.toFixed(2)}px`);
    cat.style.setProperty('--download-cat-paw-peek-y', `${pawPeekLift.toFixed(2)}px`);
    cat.style.setProperty('--download-cat-paw-awake-y', `${pawAwakePress.toFixed(2)}px`);
    stage.classList.add('is-cat-positioned');
  };

  const scheduleAlign = () => {
    if (alignFrame) cancelAnimationFrame(alignFrame);
    alignFrame = requestAnimationFrame(() => {
      alignFrame = 0;
      stages.forEach(alignCatToBottomEdge);
    });
  };

  const setAwake = (stage, awake) => {
    stage.classList.toggle('is-cat-awake', awake);
    scheduleAlign();
  };

  const activate = (stage) => {
    stage.classList.add('is-in-view');
    scheduleAlign();
  };

  if (!('IntersectionObserver' in window) || reduceMotion.matches) {
    stages.forEach(activate);
  } else {
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
  }

  stages.forEach((stage) => {
    let sleepTimer = 0;
    const wakeCat = () => {
      if (sleepTimer) window.clearTimeout(sleepTimer);
      sleepTimer = 0;
      if (!stage.classList.contains('is-cat-awake')) {
        setAwake(stage, true);
      }
    };
    const sleepCat = () => {
      if (sleepTimer) window.clearTimeout(sleepTimer);
      sleepTimer = window.setTimeout(() => setAwake(stage, false), 140);
    };

    // Make the whole download card an interaction surface. Previously only a
    // thin invisible bottom zone could wake the cat, so hovering over the paws
    // or the purple card often felt broken.
    stage.addEventListener('pointerenter', wakeCat, { passive: true });
    stage.addEventListener('pointermove', wakeCat, { passive: true });
    stage.addEventListener('pointerleave', sleepCat, { passive: true });
    stage.addEventListener('focusin', wakeCat);
    stage.addEventListener('focusout', sleepCat);
  });

  window.addEventListener('scroll', scheduleAlign, { passive: true });
  window.addEventListener('resize', scheduleAlign, { passive: true });
  window.addEventListener('orientationchange', scheduleAlign, { passive: true });
  window.addEventListener('load', scheduleAlign, { once: true });

  if ('ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver(scheduleAlign);
    stages.forEach((stage) => resizeObserver.observe(stage));
  }

  scheduleAlign();
  setTimeout(scheduleAlign, 360);
})();
