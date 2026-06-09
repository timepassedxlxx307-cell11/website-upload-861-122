(function () {
    function start(video, url) {
        if (!video || !url) {
            return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            if (video.getAttribute("src") !== url) {
                video.setAttribute("src", url);
            }
            video.play().catch(function () {});
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            if (video.__movieHls) {
                video.__movieHls.destroy();
            }
            var hls = new window.Hls();
            video.__movieHls = hls;
            hls.loadSource(url);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                video.play().catch(function () {});
            });
            return;
        }

        if (video.getAttribute("src") !== url) {
            video.setAttribute("src", url);
        }
        video.play().catch(function () {});
    }

    window.MoviePlayerCore = {
        start: start
    };
})();
