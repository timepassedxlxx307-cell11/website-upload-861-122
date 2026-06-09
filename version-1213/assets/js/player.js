(function () {
  function initPlayer(root) {
    var video = root.querySelector('video');
    var layer = root.querySelector('[data-player-layer]');

    if (!video || !layer) {
      return;
    }

    var hlsSource = video.getAttribute('data-m3u8');
    var mp4Source = video.getAttribute('data-mp4');
    var hlsInstance = null;

    function bindSource() {
      if (video.getAttribute('data-bound') === 'true') {
        return;
      }

      video.setAttribute('data-bound', 'true');

      if (window.Hls && window.Hls.isSupported && window.Hls.isSupported() && window.location.protocol !== 'file:') {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hlsInstance.loadSource(hlsSource);
        hlsInstance.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = hlsSource;
      } else {
        video.src = mp4Source;
      }
    }

    function playVideo() {
      bindSource();
      var result = video.play();

      if (result && typeof result.then === 'function') {
        result.then(function () {
          root.classList.add('is-playing');
        }).catch(function () {
          root.classList.remove('is-playing');
          video.setAttribute('controls', 'controls');
        });
      } else {
        root.classList.add('is-playing');
      }
    }

    layer.addEventListener('click', playVideo);

    video.addEventListener('play', function () {
      root.classList.add('is-playing');
    });

    video.addEventListener('pause', function () {
      if (!video.ended) {
        root.classList.remove('is-playing');
      }
    });

    video.addEventListener('ended', function () {
      root.classList.remove('is-playing');
    });

    window.addEventListener('beforeunload', function () {
      if (hlsInstance && hlsInstance.destroy) {
        hlsInstance.destroy();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.slice.call(document.querySelectorAll('[data-movie-player]')).forEach(initPlayer);
  });
})();
