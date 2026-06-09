function setupMoviePlayer(videoId, buttonId, sourceUrl) {
  var video = document.getElementById(videoId);
  var button = document.getElementById(buttonId);
  var hls = null;

  if (!video || !sourceUrl) {
    return;
  }

  function revealButton() {
    if (button) {
      button.classList.remove("is-hidden");
    }
  }

  function hideButton() {
    if (button) {
      button.classList.add("is-hidden");
    }
  }

  function playVideo() {
    hideButton();
    var attempt = video.play();
    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(revealButton);
    }
  }

  function loadWithNativeHls() {
    if (video.getAttribute("src") !== sourceUrl) {
      video.setAttribute("src", sourceUrl);
    }
    playVideo();
  }

  function loadWithHls() {
    if (!hls) {
      hls = new Hls();
      hls.loadSource(sourceUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, playVideo);
    } else {
      playVideo();
    }
  }

  function start() {
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      loadWithNativeHls();
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      loadWithHls();
      return;
    }
    loadWithNativeHls();
  }

  if (button) {
    button.addEventListener("click", start);
  }

  video.addEventListener("click", function () {
    if (video.paused) {
      start();
    } else {
      video.pause();
    }
  });

  video.addEventListener("play", hideButton);
  video.addEventListener("pause", revealButton);
}
