(function () {
  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      const isOpen = mobileNav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const prev = hero.querySelector('[data-hero-prev]');
    const next = hero.querySelector('[data-hero-next]');
    let current = 0;
    let timer = null;

    const show = function (index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    };

    const start = function () {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5000);
    };

    const stop = function () {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    };

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        const index = Number(dot.getAttribute('data-hero-dot')) || 0;
        show(index);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  const filterInput = document.querySelector('[data-filter-input]');
  const filterScope = document.querySelector('[data-filter-scope]');

  if (filterInput && filterScope) {
    const cards = Array.from(filterScope.querySelectorAll('[data-card]'));

    filterInput.addEventListener('input', function () {
      const query = filterInput.value.trim().toLowerCase();

      cards.forEach(function (card) {
        const haystack = card.getAttribute('data-search') || '';
        card.classList.toggle('is-hidden', Boolean(query) && !haystack.includes(query));
      });
    });
  }
})();
