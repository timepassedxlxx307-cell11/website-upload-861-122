(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function setupMenu() {
        var button = document.querySelector(".menu-button");
        var menu = document.querySelector(".mobile-nav");
        if (!button || !menu) {
            return;
        }
        button.addEventListener("click", function () {
            var open = menu.classList.toggle("is-open");
            button.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }

    function setupHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
        var prev = document.querySelector(".hero-prev");
        var next = document.querySelector(".hero-next");
        if (!slides.length) {
            return;
        }
        var index = slides.findIndex(function (slide) {
            return slide.classList.contains("is-active");
        });
        if (index < 0) {
            index = 0;
        }
        function show(target) {
            index = (target + slides.length) % slides.length;
            slides.forEach(function (slide, position) {
                var active = position === index;
                slide.classList.toggle("is-active", active);
                slide.setAttribute("aria-hidden", active ? "false" : "true");
            });
            dots.forEach(function (dot, position) {
                dot.classList.toggle("is-active", position === index);
            });
        }
        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-slide")) || 0);
            });
        });
        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
            });
        }
        window.setInterval(function () {
            show(index + 1);
        }, 5600);
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function setupCatalogTools() {
        var toolbars = Array.prototype.slice.call(document.querySelectorAll("[data-catalog]"));
        toolbars.forEach(function (toolbar) {
            var section = toolbar.parentElement;
            var search = toolbar.querySelector(".movie-search");
            var buttons = Array.prototype.slice.call(toolbar.querySelectorAll(".filter-button"));
            var grid = section ? section.querySelector(".catalog-grid") : null;
            var cards = grid ? Array.prototype.slice.call(grid.querySelectorAll(".movie-card, .wide-card")) : [];
            var filters = {};

            function apply() {
                var query = normalize(search ? search.value : "");
                cards.forEach(function (card) {
                    var haystack = normalize([
                        card.getAttribute("data-title"),
                        card.getAttribute("data-tags"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-type"),
                        card.getAttribute("data-year")
                    ].join(" "));
                    var matchesQuery = !query || haystack.indexOf(query) !== -1;
                    var matchesFilters = Object.keys(filters).every(function (field) {
                        var value = filters[field];
                        if (!value || value === "全部") {
                            return true;
                        }
                        return normalize(card.getAttribute("data-" + field)).indexOf(normalize(value)) !== -1;
                    });
                    card.style.display = matchesQuery && matchesFilters ? "" : "none";
                });
            }

            if (search) {
                search.addEventListener("input", apply);
            }
            buttons.forEach(function (button) {
                button.addEventListener("click", function () {
                    var field = button.getAttribute("data-field") || "type";
                    filters[field] = button.getAttribute("data-value") || "全部";
                    buttons.filter(function (item) {
                        return (item.getAttribute("data-field") || "type") === field;
                    }).forEach(function (item) {
                        item.classList.toggle("is-active", item === button);
                    });
                    apply();
                });
            });
        });
    }

    window.initMoviePlayer = function (source) {
        var video = document.getElementById("playerVideo");
        var overlay = document.getElementById("playerOverlay");
        var button = document.getElementById("playerToggle");
        var shell = document.getElementById("playerShell");
        var status = document.getElementById("playerStatus");
        var hls = null;
        var loaded = false;

        if (!video || !source) {
            return;
        }

        function setStatus(message) {
            if (status) {
                status.textContent = message || "";
            }
        }

        function attach() {
            if (loaded) {
                return;
            }
            loaded = true;
            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
            } else {
                video.src = source;
            }
        }

        function start(event) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            attach();
            var result = video.play();
            if (result && typeof result.catch === "function") {
                result.catch(function () {
                    setStatus("点击视频即可继续播放");
                });
            }
        }

        function toggleFromVideo() {
            if (video.paused) {
                start();
            } else {
                video.pause();
            }
        }

        if (button) {
            button.addEventListener("click", start);
        }
        if (overlay) {
            overlay.addEventListener("click", start);
        }
        if (shell) {
            shell.addEventListener("keydown", function (event) {
                if (event.key === "Enter" || event.key === " ") {
                    start(event);
                }
            });
        }
        video.addEventListener("click", toggleFromVideo);
        video.addEventListener("play", function () {
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
            setStatus("");
        });
        video.addEventListener("pause", function () {
            if (overlay && video.currentTime > 0 && !video.ended) {
                overlay.classList.remove("is-hidden");
            }
        });
        video.addEventListener("ended", function () {
            if (overlay) {
                overlay.classList.remove("is-hidden");
            }
        });
        video.addEventListener("error", function () {
            setStatus("播放暂时不可用，请稍后重试");
        });
        window.addEventListener("beforeunload", function () {
            if (hls) {
                hls.destroy();
            }
        });
    };

    ready(function () {
        setupMenu();
        setupHero();
        setupCatalogTools();
    });
})();
