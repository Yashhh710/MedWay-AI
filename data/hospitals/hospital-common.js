function goBackAndClose() {
    // Navigate back to map page and attempt to close current tab.
    // Use a brief timeout to allow navigation to start before closing.
    if (document.referrer && document.referrer.indexOf(window.location.host) !== -1) {
        // If we came from within the same site, go back in history.
        history.back();
    } else {
        // Direct navigation to explore page.
        window.location.href = '../../explore.html';
    }
    // Attempt to close the tab after a short delay.
    setTimeout(() => {
        try {
            window.close();
        } catch (e) {
            // Closing may fail if the page wasn't opened via window.open(); ignore.
        }
    }, 200);
}

document.addEventListener('DOMContentLoaded', () => {
  // Lazy-load images that don't explicitly set loading
  document.querySelectorAll('img').forEach(img => {
    try { if(!img.getAttribute('loading')) img.loading = 'lazy'; } catch(e){}
    if(!img.alt) {
      const t = img.getAttribute('data-title') || img.getAttribute('title');
      if(t) img.alt = t;
    }
  });

  // Standardize modal overlays
  document.querySelectorAll('.modal-overlay').forEach(mod => {
    if(!mod.hasAttribute('role')) mod.setAttribute('role','dialog');
    if(!mod.hasAttribute('aria-modal')) mod.setAttribute('aria-modal','true');
    if(!mod.hasAttribute('aria-hidden')) mod.setAttribute('aria-hidden', mod.classList.contains('active') ? 'false' : 'true');
    const close = mod.querySelector('.close-btn');
    if(close) {
      if(!close.id) close.id = 'modalClose_' + Math.random().toString(36).slice(2,8);
      if(!close.hasAttribute('aria-label')) close.setAttribute('aria-label','Close dialog');
    }
  });

  // Keyboard handling: close modals with Escape
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => {
        m.classList.remove('active');
        m.setAttribute('aria-hidden','true');
      });
    }
  });

  // When any modal opens, move focus to its close button
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(m => {
      if(m.attributeName === 'class') {
        const target = m.target;
        if(target.classList && target.classList.contains('modal-overlay') && target.classList.contains('active')) {
          const close = target.querySelector('.close-btn');
          if(close) close.focus();
        }
      }
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(m => observer.observe(m, { attributes: true }));
});
