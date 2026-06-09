(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
            return;
        }
        document.addEventListener("DOMContentLoaded", fn);
    }

    function setupNavigation() {
        var toggle = document.querySelector(".nav-toggle");
        var menu = document.querySelector(".mobile-nav");
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener("click", function () {
            menu.classList.toggle("is-open");
        });
    }

    function setupHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
        if (slides.length < 2) {
            return;
        }
        var index = 0;
        var timer = null;

        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                show(i);
                start();
            });
        });
        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        start();
    }

    function textOf(card) {
        return [
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-type"),
            card.getAttribute("data-year"),
            card.getAttribute("data-genre"),
            card.textContent
        ].join(" ").toLowerCase();
    }

    function setupSearch() {
        var input = document.getElementById("movie-search");
        var cards = Array.prototype.slice.call(document.querySelectorAll(".searchable-grid .movie-card"));
        if (!input || cards.length === 0) {
            return;
        }
        function filter() {
            var query = input.value.trim().toLowerCase();
            cards.forEach(function (card) {
                var visible = query === "" || textOf(card).indexOf(query) !== -1;
                card.classList.toggle("is-filtered-out", !visible);
            });
        }
        input.addEventListener("input", filter);
    }

    function setupPlayer() {
        var video = document.getElementById("player-video");
        var button = document.getElementById("player-start");
        var source = window.playerSource;
        if (!video || !button || !source) {
            return;
        }
        var loaded = false;
        var hls = null;

        function playVideo() {
            var result = video.play();
            if (result && typeof result.catch === "function") {
                result.catch(function () {
                    button.classList.remove("is-hidden");
                });
            }
        }

        function attach() {
            if (loaded) {
                return;
            }
            loaded = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
                video.addEventListener("loadedmetadata", playVideo, { once: true });
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({ enableWorker: true });
                hls.loadSource(source);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, playVideo);
                return;
            }
            video.src = source;
            video.addEventListener("loadedmetadata", playVideo, { once: true });
        }

        function start() {
            button.classList.add("is-hidden");
            attach();
            if (loaded && video.readyState > 0) {
                playVideo();
            }
        }

        button.addEventListener("click", start);
        video.addEventListener("click", function () {
            if (video.paused) {
                start();
            }
        });
        window.addEventListener("beforeunload", function () {
            if (hls) {
                hls.destroy();
            }
        });
    }

    ready(function () {
        setupNavigation();
        setupHero();
        setupSearch();
        setupPlayer();
    });
})();
