(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function () {
        var toggle = document.querySelector(".mobile-toggle");
        var nav = document.querySelector(".nav-links");
        if (toggle && nav) {
            toggle.addEventListener("click", function () {
                nav.classList.toggle("is-open");
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
        var current = 0;

        function activate(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                activate(index);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                activate(current + 1);
            }, 5200);
        }

        var filterPanel = document.querySelector(".filter-panel");
        if (filterPanel) {
            var searchInput = filterPanel.querySelector("[data-filter-search]");
            var typeSelect = filterPanel.querySelector("[data-filter-type]");
            var genreSelect = filterPanel.querySelector("[data-filter-genre]");
            var yearSelect = filterPanel.querySelector("[data-filter-year]");
            var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card[data-title]"));

            function normalize(text) {
                return String(text || "").toLowerCase().trim();
            }

            function applyFilters() {
                var keyword = normalize(searchInput && searchInput.value);
                var typeValue = normalize(typeSelect && typeSelect.value);
                var genreValue = normalize(genreSelect && genreSelect.value);
                var yearValue = normalize(yearSelect && yearSelect.value);

                cards.forEach(function (card) {
                    var haystack = normalize([
                        card.getAttribute("data-title"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-type"),
                        card.getAttribute("data-genre"),
                        card.getAttribute("data-tags"),
                        card.getAttribute("data-year")
                    ].join(" "));
                    var matched = true;
                    if (keyword && haystack.indexOf(keyword) === -1) {
                        matched = false;
                    }
                    if (typeValue && normalize(card.getAttribute("data-type-category")) !== typeValue) {
                        matched = false;
                    }
                    if (genreValue && normalize(card.getAttribute("data-genre-category")) !== genreValue) {
                        matched = false;
                    }
                    if (yearValue && normalize(card.getAttribute("data-year")) !== yearValue) {
                        matched = false;
                    }
                    card.classList.toggle("hidden-by-filter", !matched);
                });
            }

            [searchInput, typeSelect, genreSelect, yearSelect].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", applyFilters);
                    control.addEventListener("change", applyFilters);
                }
            });
        }
    });
})();
