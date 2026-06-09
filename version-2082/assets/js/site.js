(function () {
  var menuButton = document.querySelector(".mobile-menu-button");
  var navLinks = document.querySelector(".nav-links");

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  document.querySelectorAll("img").forEach(function (image) {
    image.addEventListener("error", function () {
      image.classList.add("image-missing");
    });
  });

  var hero = document.querySelector("[data-hero]");

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var current = 0;
    var timer = null;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    function startHero() {
      if (timer || slides.length < 2) {
        return;
      }
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    function stopHero() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        stopHero();
        showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
        startHero();
      });
    });

    hero.addEventListener("mouseenter", stopHero);
    hero.addEventListener("mouseleave", startHero);
    showSlide(0);
    startHero();
  }

  var params = new URLSearchParams(window.location.search);
  var queryFromUrl = params.get("q") || "";
  var filterRoots = Array.prototype.slice.call(document.querySelectorAll("[data-filter-root]"));

  filterRoots.forEach(function (root) {
    var searchInput = root.querySelector(".search-input");
    var selects = Array.prototype.slice.call(root.querySelectorAll(".filter-select"));
    var cards = Array.prototype.slice.call(root.querySelectorAll("[data-card]"));
    var emptyState = root.querySelector("[data-empty-state]");

    if (searchInput && queryFromUrl) {
      searchInput.value = queryFromUrl;
    }

    function normalize(value) {
      return String(value || "").trim().toLowerCase();
    }

    function applyFilters() {
      var query = searchInput ? normalize(searchInput.value) : "";
      var shown = 0;

      cards.forEach(function (card) {
        var text = normalize(card.getAttribute("data-search"));
        var matchesText = !query || text.indexOf(query) !== -1;
        var matchesSelects = selects.every(function (select) {
          var field = select.getAttribute("data-filter-field");
          var selected = normalize(select.value);
          return !selected || normalize(card.getAttribute("data-" + field)) === selected;
        });
        var visible = matchesText && matchesSelects;
        card.hidden = !visible;
        if (visible) {
          shown += 1;
        }
      });

      if (emptyState) {
        emptyState.hidden = shown !== 0;
      }
    }

    if (searchInput) {
      searchInput.addEventListener("input", applyFilters);
    }
    selects.forEach(function (select) {
      select.addEventListener("change", applyFilters);
    });
    applyFilters();
  });
})();
