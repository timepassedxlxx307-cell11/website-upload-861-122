(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function text(value) {
        return String(value || "").toLowerCase().trim();
    }

    function initNavigation() {
        var toggle = document.querySelector(".nav-toggle");
        if (!toggle) {
            return;
        }
        toggle.addEventListener("click", function () {
            document.body.classList.toggle("nav-open");
        });
    }

    function initHero() {
        var slider = document.querySelector("[data-hero-slider]");
        if (!slider) {
            return;
        }
        var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
        if (slides.length < 2) {
            return;
        }
        var index = 0;
        window.setInterval(function () {
            slides[index].classList.remove("is-active");
            index = (index + 1) % slides.length;
            slides[index].classList.add("is-active");
        }, 5200);
    }

    function filterCards(cards, query, type) {
        var visible = 0;
        cards.forEach(function (card) {
            var haystack = text(card.getAttribute("data-search-text"));
            var cardType = text(card.getAttribute("data-type"));
            var matchedQuery = !query || haystack.indexOf(query) !== -1;
            var matchedType = !type || cardType === type;
            var show = matchedQuery && matchedType;
            card.classList.toggle("is-hidden", !show);
            if (show) {
                visible += 1;
            }
        });
        return visible;
    }

    function initCatalogFilters() {
        var forms = Array.prototype.slice.call(document.querySelectorAll("[data-catalog-filter]"));
        forms.forEach(function (form) {
            var input = form.querySelector("input");
            var select = form.querySelector("select");
            var grid = form.closest("main").querySelector(".catalog-grid");
            if (!grid) {
                return;
            }
            var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));
            function apply() {
                filterCards(cards, text(input && input.value), text(select && select.value));
            }
            if (input) {
                input.addEventListener("input", apply);
            }
            if (select) {
                select.addEventListener("change", apply);
            }
        });
    }

    function initSearchPage() {
        var form = document.querySelector("[data-search-page]");
        if (!form) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var input = form.querySelector("input[name='q']");
        var select = form.querySelector("select[name='type']");
        var grid = document.querySelector("#search-results");
        var empty = document.querySelector("[data-empty-state]");
        var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));
        if (input && params.get("q")) {
            input.value = params.get("q");
        }
        if (select && params.get("type")) {
            select.value = params.get("type");
        }
        function apply() {
            var visible = filterCards(cards, text(input && input.value), text(select && select.value));
            if (empty) {
                empty.classList.toggle("is-visible", visible === 0);
            }
        }
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            apply();
        });
        if (input) {
            input.addEventListener("input", apply);
        }
        if (select) {
            select.addEventListener("change", apply);
        }
        apply();
    }

    ready(function () {
        initNavigation();
        initHero();
        initCatalogFilters();
        initSearchPage();
    });
})();
