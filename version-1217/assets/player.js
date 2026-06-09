function startMoviePlayer(options) {
    var root = document.querySelector(options.root);
    if (!root) {
        return;
    }
    var video = root.querySelector("video");
    var layer = root.querySelector(".play-layer");
    var source = options.source;
    var hls = null;
    var connected = false;

    function connect() {
        if (connected || !video || !source) {
            return;
        }
        connected = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
        } else {
            video.src = source;
        }
    }

    function start() {
        connect();
        if (layer) {
            layer.classList.add("is-hidden");
        }
        var attempt = video.play();
        if (attempt && typeof attempt.catch === "function") {
            attempt.catch(function () {
                if (layer) {
                    layer.classList.remove("is-hidden");
                }
            });
        }
    }

    if (layer) {
        layer.addEventListener("click", start);
    }

    if (video) {
        video.addEventListener("click", function () {
            if (video.paused) {
                start();
            }
        });
        video.addEventListener("play", function () {
            if (layer) {
                layer.classList.add("is-hidden");
            }
        });
    }

    window.addEventListener("beforeunload", function () {
        if (hls) {
            hls.destroy();
        }
    });
}
