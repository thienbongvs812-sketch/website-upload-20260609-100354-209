(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var activeSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === activeSlide);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === activeSlide);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(activeSlide + 1);
    }, 5200);
  }

  var filterInput = document.querySelector('[data-card-filter]');
  var filterCards = Array.prototype.slice.call(document.querySelectorAll('[data-search]'));
  var emptyState = document.querySelector('[data-empty-state]');

  if (filterInput && filterCards.length) {
    filterInput.addEventListener('input', function () {
      var value = filterInput.value.trim().toLowerCase();
      var visible = 0;

      filterCards.forEach(function (card) {
        var text = (card.getAttribute('data-search') || '').toLowerCase();
        var matched = !value || text.indexOf(value) !== -1;
        card.style.display = matched ? '' : 'none';
        if (matched) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle('is-open', visible === 0);
      }
    });
  }

  var searchInput = document.querySelector('[data-site-search]');
  var searchResults = document.querySelector('[data-search-results]');

  function renderSearchResults(items) {
    if (!searchResults) {
      return;
    }

    if (!items.length) {
      searchResults.innerHTML = '';
      searchResults.classList.remove('is-open');
      return;
    }

    searchResults.innerHTML = items.map(function (item) {
      return '<a class="search-result" href="' + item.url + '">' +
        '<strong>' + escapeHtml(item.title) + '</strong>' +
        '<span>' + escapeHtml(item.year + ' · ' + item.region + ' · ' + item.type) + '</span>' +
        '</a>';
    }).join('');

    searchResults.classList.add('is-open');
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  if (searchInput && searchResults && window.SiteSearchData) {
    searchInput.addEventListener('input', function () {
      var value = searchInput.value.trim().toLowerCase();

      if (!value) {
        renderSearchResults([]);
        return;
      }

      var matched = window.SiteSearchData.filter(function (item) {
        return item.search.indexOf(value) !== -1;
      }).slice(0, 12);

      renderSearchResults(matched);
    });
  }
})();
