(function () {
  const mobileToggle = document.querySelector('[data-mobile-toggle]');
  const mobilePanel = document.querySelector('[data-mobile-panel]');

  if (mobileToggle && mobilePanel) {
    mobileToggle.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-img]').forEach(function (img) {
    img.addEventListener('error', function () {
      img.classList.add('image-missing');
    });
  });

  const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
  const dotsBox = document.querySelector('[data-hero-dots]');
  let currentSlide = 0;
  let heroTimer = null;

  function setHero(index) {
    if (!slides.length) {
      return;
    }
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === currentSlide);
    });
    Array.from(document.querySelectorAll('[data-hero-dot]')).forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === currentSlide);
    });
  }

  if (slides.length && dotsBox) {
    slides.forEach(function (_, index) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'hero-dot';
      dot.setAttribute('data-hero-dot', '');
      dot.setAttribute('aria-label', '切换焦点');
      dot.addEventListener('click', function () {
        setHero(index);
      });
      dotsBox.appendChild(dot);
    });
    setHero(0);
    const next = document.querySelector('[data-hero-next]');
    const prev = document.querySelector('[data-hero-prev]');
    if (next) {
      next.addEventListener('click', function () {
        setHero(currentSlide + 1);
      });
    }
    if (prev) {
      prev.addEventListener('click', function () {
        setHero(currentSlide - 1);
      });
    }
    heroTimer = window.setInterval(function () {
      setHero(currentSlide + 1);
    }, 5200);
    document.querySelector('.hero').addEventListener('mouseenter', function () {
      window.clearInterval(heroTimer);
    });
    document.querySelector('.hero').addEventListener('mouseleave', function () {
      heroTimer = window.setInterval(function () {
        setHero(currentSlide + 1);
      }, 5200);
    });
  }

  const filterInput = document.querySelector('[data-card-filter]');
  const cardList = document.querySelector('[data-card-list]');

  if (filterInput && cardList) {
    const cards = Array.from(cardList.querySelectorAll('.movie-card'));
    filterInput.addEventListener('input', function () {
      const keyword = filterInput.value.trim().toLowerCase();
      cards.forEach(function (card) {
        const text = [card.dataset.title, card.dataset.genre, card.dataset.year, card.dataset.region].join(' ').toLowerCase();
        card.style.display = !keyword || text.indexOf(keyword) >= 0 ? '' : 'none';
      });
    });
  }

  const searchPage = document.querySelector('[data-search-page]');
  const searchResults = document.querySelector('[data-search-results]');
  const searchHeading = document.querySelector('[data-search-heading]');
  const searchInput = document.querySelector('[data-search-input]');

  function makeSearchCard(item) {
    const tags = (item.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');
    return '' +
      '<article class="movie-card">' +
        '<a class="poster-wrap" href="' + escapeHtml(item.url) + '">' +
          '<img class="movie-poster" src="' + escapeHtml(item.cover) + '" alt="' + escapeHtml(item.title) + '" loading="lazy" data-img onerror="this.classList.add(\'image-missing\')">' +
          '<span class="card-badge">' + escapeHtml(item.type) + '</span>' +
          '<span class="card-score">' + escapeHtml(item.score) + '</span>' +
        '</a>' +
        '<div class="movie-card-body">' +
          '<a class="movie-title" href="' + escapeHtml(item.url) + '">' + escapeHtml(item.title) + '</a>' +
          '<p class="movie-intro">' + escapeHtml(item.one) + '</p>' +
          '<div class="movie-meta"><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.year) + '</span></div>' +
          '<div class="tag-list">' + tags + '</div>' +
        '</div>' +
      '</article>';
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[char];
    });
  }

  if (searchPage && searchResults && window.movieSearchIndex) {
    const params = new URLSearchParams(window.location.search);
    const keyword = (params.get('q') || '').trim();
    if (searchInput) {
      searchInput.value = keyword;
    }
    if (keyword) {
      const lowered = keyword.toLowerCase();
      const matched = window.movieSearchIndex.filter(function (item) {
        return [item.title, item.region, item.type, item.year, item.genre, (item.tags || []).join(' '), item.one].join(' ').toLowerCase().indexOf(lowered) >= 0;
      }).slice(0, 180);
      if (searchHeading) {
        searchHeading.textContent = '匹配结果';
      }
      searchResults.innerHTML = matched.length ? matched.map(makeSearchCard).join('') : '<p class="empty-text">没有找到相关影片</p>';
    }
  }
})();
