(function () {
    var toggle = document.querySelector('.mobile-toggle');
    var panel = document.querySelector('.mobile-panel');

    if (toggle && panel) {
        toggle.addEventListener('click', function () {
            var opened = panel.hasAttribute('hidden');
            if (opened) {
                panel.removeAttribute('hidden');
            } else {
                panel.setAttribute('hidden', '');
            }
            toggle.setAttribute('aria-expanded', String(opened));
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var next = hero.querySelector('[data-hero-next]');
        var prev = hero.querySelector('[data-hero-prev]');
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === current);
            });
        }

        function play() {
            clearInterval(timer);
            timer = setInterval(function () {
                show(current + 1);
            }, 5000);
        }

        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                play();
            });
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
                play();
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                show(index);
                play();
            });
        });

        play();
    }

    function filterCards(input, scope) {
        var grid = scope.querySelector('.filter-grid');
        var empty = scope.querySelector('.empty-tip');
        if (!input || !grid) {
            return;
        }
        var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
        function apply() {
            var value = input.value.trim().toLowerCase();
            var visible = 0;
            cards.forEach(function (card) {
                var haystack = (card.getAttribute('data-filter') || '').toLowerCase();
                var matched = !value || haystack.indexOf(value) !== -1;
                card.hidden = !matched;
                if (matched) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.hidden = visible !== 0;
            }
        }
        input.addEventListener('input', apply);
        apply();
    }

    Array.prototype.slice.call(document.querySelectorAll('.local-filter')).forEach(function (input) {
        filterCards(input, document);
    });

    var searchInput = document.getElementById('search-page-input');
    if (searchInput) {
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q') || '';
        var status = document.getElementById('search-status-text');
        searchInput.value = q;
        filterCards(searchInput, document);
        if (status && q.trim()) {
            status.textContent = '搜索：' + q.trim();
        }
        searchInput.addEventListener('input', function () {
            if (status) {
                status.textContent = searchInput.value.trim() ? '搜索：' + searchInput.value.trim() : '热门影片';
            }
        });
    }
})();
