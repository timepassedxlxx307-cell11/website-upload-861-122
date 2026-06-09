(function () {
  function getImagePath(movie) {
    return './' + movie.cover;
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function makeCard(movie) {
    var href = './movie/' + movie.id + '.html';
    var image = getImagePath(movie);
    var text = movie.oneLine || movie.summary || '';
    var chips = (movie.genreTerms || []).slice(0, 3).map(function (name) {
      return '<span class="chip">' + escapeHtml(name) + '</span>';
    }).join('');

    return [
      '<article class="movie-card">',
      '  <a class="poster" href="' + href + '" aria-label="' + escapeHtml(movie.title) + '">',
      '    <img class="cover-img" src="' + image + '" alt="' + escapeHtml(movie.title) + '" loading="lazy" data-cover-image>',
      '    <span class="poster-fallback">' + escapeHtml(movie.title) + '</span>',
      '    <span class="play-hover">▶</span>',
      '  </a>',
      '  <div class="card-body">',
      '    <div class="card-meta"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span></div>',
      '    <h3><a href="' + href + '">' + escapeHtml(movie.title) + '</a></h3>',
      '    <p>' + escapeHtml(text.slice(0, 58)) + (text.length > 58 ? '…' : '') + '</p>',
      '    <div class="card-tags">' + chips + '</div>',
      '  </div>',
      '</article>'
    ].join('\n');
  }

  function initSearch() {
    var input = document.querySelector('[data-search-input]');
    var type = document.querySelector('[data-search-type]');
    var region = document.querySelector('[data-search-region]');
    var year = document.querySelector('[data-search-year]');
    var results = document.querySelector('[data-search-results]');
    var info = document.querySelector('[data-search-info]');

    if (!input || !results || !window.MOVIE_INDEX) {
      return;
    }

    function readParams() {
      var params = new URLSearchParams(window.location.search);
      var keyword = params.get('q');

      if (keyword) {
        input.value = keyword;
      }
    }

    function apply() {
      var keyword = input.value.trim().toLowerCase();
      var typeValue = type ? type.value : '';
      var regionValue = region ? region.value : '';
      var yearValue = year ? year.value : '';
      var matched = window.MOVIE_INDEX.filter(function (movie) {
        var haystack = [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.tags, movie.oneLine].join(' ').toLowerCase();

        if (keyword && haystack.indexOf(keyword) === -1) {
          return false;
        }

        if (typeValue && movie.type !== typeValue) {
          return false;
        }

        if (regionValue && movie.region !== regionValue) {
          return false;
        }

        if (yearValue && movie.year !== yearValue) {
          return false;
        }

        return true;
      }).slice(0, 120);

      if (info) {
        info.textContent = matched.length ? '已显示 ' + matched.length + ' 条匹配结果' : '没有找到匹配影片';
      }

      results.innerHTML = matched.map(makeCard).join('\n');

      Array.prototype.slice.call(results.querySelectorAll('[data-cover-image]')).forEach(function (img) {
        img.addEventListener('error', function () {
          img.classList.add('is-missing');
        });
      });
    }

    readParams();

    [input, type, region, year].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });

    apply();
  }

  document.addEventListener('DOMContentLoaded', initSearch);
})();
