(function () {
    var menuButton = document.querySelector('.menu-toggle');
    var mobileMenu = document.querySelector('.mobile-menu');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function () {
            var open = mobileMenu.classList.toggle('is-open');
            menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    var hero = document.querySelector('.hero-carousel');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var previous = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var active = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }

            active = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === active);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === active);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(active + 1);
            }, 5000);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                start();
            });
        });

        if (previous) {
            previous.addEventListener('click', function () {
                show(active - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(active + 1);
                start();
            });
        }

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        start();
    }

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    var urlParams = new URLSearchParams(window.location.search);
    var query = urlParams.get('q') || '';
    var searchInput = document.getElementById('searchInput');

    if (searchInput) {
        searchInput.value = query;
    }

    var filters = {
        category: '',
        year: '',
        region: ''
    };

    function updateSearchGrid() {
        var grid = document.getElementById('searchGrid');
        if (!grid) {
            return;
        }

        var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
        var term = normalize(searchInput ? searchInput.value : query);
        var visible = 0;

        cards.forEach(function (card) {
            var text = normalize(card.getAttribute('data-search'));
            var matchText = !term || text.indexOf(term) !== -1;
            var matchCategory = !filters.category || card.getAttribute('data-category') === filters.category;
            var matchYear = !filters.year || card.getAttribute('data-year') === filters.year;
            var matchRegion = !filters.region || card.getAttribute('data-region') === filters.region;
            var show = matchText && matchCategory && matchYear && matchRegion;

            card.hidden = !show;
            if (show) {
                visible += 1;
            }
        });

        var empty = document.querySelector('.empty-state');
        if (empty) {
            empty.hidden = visible !== 0;
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', updateSearchGrid);
        updateSearchGrid();
    }

    Array.prototype.slice.call(document.querySelectorAll('.filter-button')).forEach(function (button) {
        button.addEventListener('click', function () {
            var key = button.getAttribute('data-filter');
            var value = button.getAttribute('data-value') || '';

            filters[key] = value;

            Array.prototype.slice.call(document.querySelectorAll('.filter-button[data-filter="' + key + '"]')).forEach(function (peer) {
                peer.classList.toggle('is-active', peer === button);
            });

            updateSearchGrid();
        });
    });

    Array.prototype.slice.call(document.querySelectorAll('[data-local-filter]')).forEach(function (input) {
        var targetId = input.getAttribute('data-local-filter');
        var grid = document.getElementById(targetId);
        var empty = document.querySelector('.empty-state');

        input.addEventListener('input', function () {
            var value = normalize(input.value);
            var visible = 0;

            if (!grid) {
                return;
            }

            Array.prototype.slice.call(grid.querySelectorAll('.movie-card')).forEach(function (card) {
                var text = normalize(card.getAttribute('data-search'));
                var show = !value || text.indexOf(value) !== -1;
                card.hidden = !show;
                if (show) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.hidden = visible !== 0;
            }
        });
    });
})();
