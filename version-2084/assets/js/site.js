(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (menuButton && mobileNav) {
        menuButton.addEventListener("click", function () {
            mobileNav.classList.toggle("open");
        });
    }

    var carousel = document.querySelector("[data-hero-carousel]");

    if (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
        var prev = carousel.querySelector("[data-hero-prev]");
        var next = carousel.querySelector("[data-hero-next]");
        var dotsBox = carousel.querySelector("[data-hero-dots]");
        var current = 0;
        var timer = null;

        function renderDots() {
            if (!dotsBox) {
                return;
            }

            dotsBox.innerHTML = "";

            slides.forEach(function (_, index) {
                var dot = document.createElement("button");
                dot.type = "button";
                dot.setAttribute("aria-label", "切换到第" + (index + 1) + "部");
                if (index === current) {
                    dot.classList.add("active");
                }
                dot.addEventListener("click", function () {
                    showSlide(index);
                    restart();
                });
                dotsBox.appendChild(dot);
            });
        }

        function showSlide(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === current);
            });
            renderDots();
        }

        function restart() {
            if (timer) {
                clearInterval(timer);
            }
            timer = setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener("click", function () {
                showSlide(current - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                showSlide(current + 1);
                restart();
            });
        }

        renderDots();
        restart();
    }

    var searchGrid = document.querySelector("[data-search-grid]");
    var searchInput = document.getElementById("search-input");
    var searchTitle = document.querySelector("[data-search-title]");
    var chips = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));

    if (searchGrid) {
        var cards = Array.prototype.slice.call(searchGrid.querySelectorAll(".movie-card"));
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get("q") || "";

        if (searchInput) {
            searchInput.value = initialQuery;
        }

        function normalize(value) {
            return String(value || "").trim().toLowerCase();
        }

        function filterCards(query) {
            var keyword = normalize(query);
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute("data-title"),
                    card.getAttribute("data-category"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-year"),
                    card.getAttribute("data-tags"),
                    card.textContent
                ].join(" "));
                var matched = keyword === "" || haystack.indexOf(keyword) !== -1;
                card.classList.toggle("is-hidden", !matched);
                if (matched) {
                    visible += 1;
                }
            });

            if (searchTitle) {
                searchTitle.textContent = keyword ? "搜索结果" : "全部影片";
            }
        }

        if (searchInput) {
            searchInput.addEventListener("input", function () {
                filterCards(searchInput.value);
            });
        }

        chips.forEach(function (chip) {
            chip.addEventListener("click", function () {
                chips.forEach(function (item) {
                    item.classList.remove("active");
                });
                chip.classList.add("active");
                var value = chip.getAttribute("data-filter") || "";
                if (searchInput) {
                    searchInput.value = value;
                }
                filterCards(value);
            });
        });

        filterCards(initialQuery);
    }
}());
