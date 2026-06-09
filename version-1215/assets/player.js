(function () {
    function bootPlayer() {
        var video = document.getElementById('moviePlayer');

        if (!video) {
            return;
        }

        var source = video.getAttribute('src');
        var shell = video.closest('.player-shell');
        var cover = shell ? shell.querySelector('.player-cover') : null;

        if (!source) {
            return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });

            hls.loadSource(source);
            hls.attachMedia(video);
        }

        function hideCover() {
            if (cover) {
                cover.classList.add('is-hidden');
            }
        }

        function showCover() {
            if (cover && video.paused) {
                cover.classList.remove('is-hidden');
            }
        }

        function playVideo() {
            hideCover();
            var result = video.play();

            if (result && typeof result.catch === 'function') {
                result.catch(function () {
                    video.controls = true;
                    showCover();
                });
            }
        }

        if (cover) {
            cover.addEventListener('click', playVideo);
        }

        video.addEventListener('play', hideCover);
        video.addEventListener('pause', showCover);
        video.addEventListener('ended', showCover);
        video.addEventListener('click', function () {
            if (video.paused) {
                playVideo();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootPlayer);
    } else {
        bootPlayer();
    }
})();
