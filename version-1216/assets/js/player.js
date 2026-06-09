import { H as Hls } from './hls.js';

document.querySelectorAll('[data-player]').forEach(function (player) {
  const video = player.querySelector('video');
  const cover = player.querySelector('[data-cover]');
  const playButton = player.querySelector('[data-play]');
  const url = player.dataset.m3u8;
  let hls = null;

  function prepare() {
    if (!video || !url || video.dataset.ready === '1') {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
    } else if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(url);
      hls.attachMedia(video);
    } else {
      video.src = url;
    }

    video.dataset.ready = '1';
  }

  function play() {
    if (!video) {
      return;
    }

    prepare();
    player.classList.add('is-playing');
    video.controls = true;

    const started = video.play();
    if (started && typeof started.catch === 'function') {
      started.catch(function () {});
    }
  }

  if (cover) {
    cover.addEventListener('click', play);
  }

  if (playButton) {
    playButton.addEventListener('click', play);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });
  }
});
