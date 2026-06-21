(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealEls = Array.from(document.querySelectorAll('.ss-ref-reveal'));
  if (revealEls.length) {
    if (reduced || !('IntersectionObserver' in window)) {
      revealEls.forEach((el) => el.classList.add('is-in'));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });
      revealEls.forEach((el) => io.observe(el));
    }
  }

  document.querySelectorAll('.ss-seg').forEach((seg) => {
    const tabs = Array.from(seg.querySelectorAll('[role="tab"]'));
    const indicator = seg.querySelector('.ss-seg-ind');
    if (!tabs.length || !indicator) return;

    const move = (tab) => {
      indicator.style.width = `${tab.offsetWidth}px`;
      indicator.style.transform = `translateX(${tab.offsetLeft}px)`;
    };

    const select = (tab, focus = false) => {
      tabs.forEach((item) => {
        const selected = item === tab;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
        const panelId = item.getAttribute('aria-controls');
        if (panelId) {
          const panel = document.getElementById(panelId);
          if (panel) panel.hidden = !selected;
        }
      });
      const scene = tab.dataset.scene;
      const scope = seg.closest('.ss-doc-section') || document;
      if (scene) {
        scope.querySelectorAll('.ss-scene').forEach((node) => node.classList.toggle('on', node.dataset.scene === scene));
      }
      move(tab);
      if (focus) tab.focus();
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        let next = index;
        if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        select(tabs[next], true);
      });
    });

    const current = tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') || tabs[0];
    requestAnimationFrame(() => select(current));
    window.addEventListener('resize', () => {
      const active = tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') || tabs[0];
      move(active);
    }, { passive: true });
  });
})();
