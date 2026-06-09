(function () {
  function setupPlayer(player) {
    const video = player.querySelector('video');
    const button = player.querySelector('[data-play]');
    const cover = player.querySelector('[data-cover]');
    const source = player.getAttribute('data-stream');
    let loaded = false;
    let hls = null;

    function loadVideo() {
      if (loaded || !video || !source) {
        return;
      }
      loaded = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    function startVideo() {
      loadVideo();
      player.classList.add('is-playing');
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener('click', startVideo);
    }
    if (cover) {
      cover.addEventListener('click', startVideo);
    }
    if (video) {
      video.addEventListener('click', function () {
        if (!loaded) {
          startVideo();
        }
      });
      video.addEventListener('play', function () {
        player.classList.add('is-playing');
      });
    }
    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  document.querySelectorAll('[data-player]').forEach(setupPlayer);
})();
