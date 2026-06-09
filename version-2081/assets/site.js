(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileMenu = document.querySelector("[data-mobile-menu]");

    if (menuButton && mobileMenu) {
      menuButton.addEventListener("click", function () {
        mobileMenu.classList.toggle("open");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var current = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    var searchInputs = Array.prototype.slice.call(document.querySelectorAll("[data-search-input]"));

    searchInputs.forEach(function (input) {
      var selector = input.getAttribute("data-search-container");
      var container = selector ? document.querySelector(selector) : null;
      var cards = container ? Array.prototype.slice.call(container.querySelectorAll("[data-search]")) : [];

      input.addEventListener("input", function () {
        var value = input.value.trim().toLowerCase();

        cards.forEach(function (card) {
          var haystack = card.getAttribute("data-search") || "";
          card.classList.toggle("hidden", value && haystack.indexOf(value) === -1);
        });
      });
    });

    var params = new URLSearchParams(window.location.search);
    var query = params.get("q");
    var searchBox = document.getElementById("siteSearch");

    if (query && searchBox) {
      searchBox.value = query;
      searchBox.dispatchEvent(new Event("input"));
    }
  });
})();
