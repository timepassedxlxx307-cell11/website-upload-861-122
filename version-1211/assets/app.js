(function () {
  var mobileButton = document.querySelector('[data-menu-toggle]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');

  if (mobileButton && mobilePanel) {
    mobileButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  function createResultItem(item) {
    var link = document.createElement('a');
    link.className = 'search-result-item';
    link.href = './' + item.url;

    var image = document.createElement('img');
    image.src = item.cover;
    image.alt = item.title;
    image.loading = 'lazy';

    var copy = document.createElement('div');
    var title = document.createElement('strong');
    title.textContent = item.title;
    var meta = document.createElement('span');
    meta.textContent = item.region + ' · ' + item.type + ' · ' + item.year;

    copy.appendChild(title);
    copy.appendChild(meta);
    link.appendChild(image);
    link.appendChild(copy);
    return link;
  }

  function bindSearch(form) {
    var input = form.querySelector('[data-search-input]');
    var results = form.querySelector('[data-search-results]');
    var dataset = window.BIKAN_SEARCH_INDEX || [];

    if (!input || !results) {
      return;
    }

    function render() {
      var query = input.value.trim().toLowerCase();
      results.replaceChildren();

      if (!query) {
        results.classList.remove('is-open');
        return;
      }

      var matches = dataset.filter(function (item) {
        return item.searchText.indexOf(query) !== -1;
      }).slice(0, 10);

      matches.forEach(function (item) {
        results.appendChild(createResultItem(item));
      });

      if (!matches.length) {
        var empty = document.createElement('div');
        empty.className = 'search-result-item';
        empty.textContent = '没有找到匹配影片';
        results.appendChild(empty);
      }

      results.classList.add('is-open');
    }

    input.addEventListener('input', render);
    input.addEventListener('focus', render);
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var query = input.value.trim().toLowerCase();
      if (!query) {
        return;
      }
      var first = dataset.find(function (item) {
        return item.searchText.indexOf(query) !== -1;
      });
      if (first) {
        window.location.href = './' + first.url;
      }
    });
    document.addEventListener('click', function (event) {
      if (!form.contains(event.target)) {
        results.classList.remove('is-open');
      }
    });
  }

  document.querySelectorAll('[data-search-form]').forEach(bindSearch);

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    start();
  }

  document.querySelectorAll('[data-filter-panel]').forEach(function (panel) {
    var scope = panel.parentElement;
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]'));
    var empty = scope.querySelector('[data-empty-state]');
    var keywordInput = panel.querySelector('[data-local-search]');
    var typeSelect = panel.querySelector('[data-filter-type]');
    var yearSelect = panel.querySelector('[data-filter-year]');
    var resetButton = panel.querySelector('[data-filter-reset]');
    var chips = Array.prototype.slice.call(panel.querySelectorAll('[data-filter-chip]'));
    var activeChip = '';

    function cardText(card) {
      return [
        card.getAttribute('data-title') || '',
        card.getAttribute('data-region') || '',
        card.getAttribute('data-type') || '',
        card.getAttribute('data-year') || '',
        card.getAttribute('data-genre') || ''
      ].join(' ').toLowerCase();
    }

    function applyFilters() {
      var keyword = keywordInput ? keywordInput.value.trim().toLowerCase() : '';
      var type = typeSelect ? typeSelect.value : '';
      var year = yearSelect ? yearSelect.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var text = cardText(card);
        var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
        var matchType = !type || (card.getAttribute('data-type') || '') === type;
        var matchYear = !year || (card.getAttribute('data-year') || '') === year;
        var matchChip = !activeChip || text.indexOf(activeChip.toLowerCase()) !== -1;
        var matched = matchKeyword && matchType && matchYear && matchChip;
        card.hidden = !matched;
        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.hidden = visible !== 0;
      }
    }

    if (keywordInput) {
      keywordInput.addEventListener('input', applyFilters);
    }
    if (typeSelect) {
      typeSelect.addEventListener('change', applyFilters);
    }
    if (yearSelect) {
      yearSelect.addEventListener('change', applyFilters);
    }
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var value = chip.getAttribute('data-filter-chip') || '';
        activeChip = activeChip === value ? '' : value;
        chips.forEach(function (item) {
          item.classList.toggle('is-active', item === chip && activeChip);
        });
        applyFilters();
      });
    });
    if (resetButton) {
      resetButton.addEventListener('click', function () {
        if (keywordInput) {
          keywordInput.value = '';
        }
        if (typeSelect) {
          typeSelect.value = '';
        }
        if (yearSelect) {
          yearSelect.value = '';
        }
        activeChip = '';
        chips.forEach(function (chip) {
          chip.classList.remove('is-active');
        });
        applyFilters();
      });
    }
  });
})();

function initMoviePlayer(source) {
  var video = document.querySelector('[data-player]');
  var overlay = document.querySelector('[data-player-overlay]');
  var playToggle = document.querySelector('[data-play-toggle]');
  var muteToggle = document.querySelector('[data-mute-toggle]');
  var fullscreenToggle = document.querySelector('[data-fullscreen-toggle]');
  var errorBox = document.querySelector('[data-player-error]');
  var hlsInstance = null;

  if (!video || !source) {
    return;
  }

  function showError() {
    if (errorBox) {
      errorBox.hidden = false;
      errorBox.textContent = '播放加载失败，请刷新页面重试';
    }
  }

  function hideError() {
    if (errorBox) {
      errorBox.hidden = true;
      errorBox.textContent = '';
    }
  }

  function attachSource() {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      hideError();
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, hideError);
      hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
        if (!data || !data.fatal) {
          return;
        }
        if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
          hlsInstance.startLoad();
          return;
        }
        if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
          hlsInstance.recoverMediaError();
          return;
        }
        showError();
      });
      return;
    }

    showError();
  }

  function setPlayingState() {
    if (playToggle) {
      playToggle.textContent = video.paused ? '播放' : '暂停';
    }
    if (overlay) {
      overlay.classList.toggle('is-hidden', !video.paused);
    }
  }

  function startPlay() {
    hideError();
    var result = video.play();
    if (result && typeof result.catch === 'function') {
      result.catch(showError);
    }
  }

  function togglePlay() {
    if (video.paused) {
      startPlay();
    } else {
      video.pause();
    }
  }

  attachSource();

  if (overlay) {
    overlay.addEventListener('click', startPlay);
  }

  video.addEventListener('click', togglePlay);
  video.addEventListener('play', setPlayingState);
  video.addEventListener('pause', setPlayingState);
  video.addEventListener('loadedmetadata', hideError);

  if (playToggle) {
    playToggle.addEventListener('click', togglePlay);
  }

  if (muteToggle) {
    muteToggle.addEventListener('click', function () {
      video.muted = !video.muted;
      muteToggle.textContent = video.muted ? '取消静音' : '静音';
    });
  }

  if (fullscreenToggle) {
    fullscreenToggle.addEventListener('click', function () {
      var target = video.parentElement || video;
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (target.requestFullscreen) {
        target.requestFullscreen();
      }
    });
  }

  window.addEventListener('pagehide', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
