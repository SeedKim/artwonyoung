(function() {
  try {
    var navToggle = document.querySelector('.nav-toggle');
    var navOverlay = document.querySelector('#navOverlay');
    var navPanel = document.querySelector('#navPanel');

    function openNav() {
      if (navOverlay) navOverlay.classList.add('open');
      if (navPanel) navPanel.classList.add('open');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeNav() {
      if (navOverlay) navOverlay.classList.remove('open');
      if (navPanel) navPanel.classList.remove('open');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    if (navToggle) navToggle.addEventListener('click', function() {
      if (navPanel && navPanel.classList.contains('open')) closeNav(); else openNav();
    });
    if (navOverlay) navOverlay.addEventListener('click', closeNav);

    var path = window.location.pathname || '';
    var filename = path.split('/').pop() || 'index.html';
    if (filename === '') filename = 'index.html';
    var mobileCta = document.querySelector('.mobile-cta');
    if (mobileCta && (filename === 'contact.html' || filename === 'contact')) mobileCta.style.display = 'none';
  } catch (e) {
    if (typeof console !== 'undefined' && console.error) console.error('main.js', e);
  }
})();
