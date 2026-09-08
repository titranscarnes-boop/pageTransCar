document.addEventListener('DOMContentLoaded', function () {

  var header = document.getElementById('siteHeader');
  var topBtn = document.getElementById('topBtn');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  /* ---- Scroll spy setup (must exist before onScroll runs) ---- */
  var sections = Array.from(document.querySelectorAll('section[id]'));
  var navAnchors = Array.from(navLinks.querySelectorAll('a[href^="#"]'));

  function updateActiveLink() {
    var current = '';
    var scrollPos = window.scrollY + 140;
    sections.forEach(function (section) {
      if (scrollPos >= section.offsetTop) {
        current = section.id;
      }
    });
    navAnchors.forEach(function (a) {
      var target = a.getAttribute('href').replace('#', '');
      var isActive = target === current;
      a.classList.toggle('active', isActive);
      if (isActive) {
        a.setAttribute('aria-current', 'page');
      } else {
        a.removeAttribute('aria-current');
      }
    });
  }

  /* ---- Header solid on scroll + back-to-top visibility ---- */
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    header.classList.toggle('scrolled', y > 60);
    topBtn.classList.toggle('visible', y > 480);
    updateActiveLink();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  topBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---- Mobile nav toggle ---- */
  var navBackdrop = document.getElementById('navBackdrop');

  function openNav() {
    navLinks.classList.add('open');
    navBackdrop.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
  }

  function closeNav() {
    navLinks.classList.remove('open');
    navBackdrop.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  navToggle.addEventListener('click', function () {
    if (navLinks.classList.contains('open')) {
      closeNav();
    } else {
      openNav();
    }
  });

  navBackdrop.addEventListener('click', closeNav);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  /* ---- Hero slider ---- */
  var slides = Array.from(document.querySelectorAll('.hero-slide'));
  var dotsWrap = document.getElementById('heroDots');
  var current = 0;
  var slideTimer;

  slides.forEach(function (_, i) {
    var dot = document.createElement('button');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', function () { goToSlide(i); });
    dotsWrap.appendChild(dot);
  });
  var dots = Array.from(dotsWrap.children);

  function goToSlide(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function nextSlide() {
    goToSlide((current + 1) % slides.length);
  }

  function startSlider() {
    clearInterval(slideTimer);
    slideTimer = setInterval(nextSlide, 5500);
  }
  startSlider();

  /* ---- Formulario de contacto (abre el correo con el mensaje listo) ---- */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('cfName').value.trim();
      var email = document.getElementById('cfEmail').value.trim();
      var subject = document.getElementById('cfSubject').value;
      var message = document.getElementById('cfMessage').value.trim();

      if (!name || !email || !message) return;

      var body =
        'Nombre: ' + name + '\n' +
        'Correo: ' + email + '\n\n' +
        message;

      var mailtoUrl =
        'mailto:comercial@transcarnes.com' +
        '?subject=' + encodeURIComponent(subject + ' - ' + name) +
        '&body=' + encodeURIComponent(body);

      window.location.href = mailtoUrl;
    });
  }

  /* ---- Reveal on scroll ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

});
