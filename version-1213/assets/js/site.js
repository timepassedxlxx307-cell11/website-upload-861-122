(function () {
  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function initHeader() {
    var header = $('[data-site-header]');
    var toggle = $('[data-menu-toggle]');

    if (!header || !toggle) {
      return;
    }

    toggle.addEventListener('click', function () {
      header.classList.toggle('is-open');
    });
  }

  function initMissingImages() {
    $all('[data-cover-image]').forEach(function (img) {
      img.addEventListener('error', function () {
        img.classList.add('is-missing');
        img.setAttribute('aria-hidden', 'true');
      });
    });
  }

  function initHero() {
    var hero = $('[data-hero]');

    if (!hero) {
      return;
    }

    var slides = $all('[data-hero-slide]', hero);
    var dots = $all('[data-hero-dot]', hero);
    var prev = $('[data-hero-prev]', hero);
    var next = $('[data-hero-next]', hero);
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
        dot.setAttribute('aria-current', i === index ? 'true' : 'false');
      });
    }

    function schedule() {
      clearInterval(timer);
      timer = setInterval(function () {
        show(index + 1);
      }, 5600);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        schedule();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        schedule();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        schedule();
      });
    }

    show(0);
    schedule();
  }

  function initLocalFilter() {
    var panels = $all('[data-local-filter]');

    panels.forEach(function (panel) {
      var input = $('[data-local-search]', panel);
      var type = $('[data-local-type]', panel);
      var year = $('[data-local-year]', panel);
      var scope = document.querySelector(panel.getAttribute('data-local-filter'));
      var empty = $('[data-empty-state]');

      if (!scope || !input) {
        return;
      }

      var cards = $all('[data-card-title]', scope);

      function apply() {
        var keyword = input.value.trim().toLowerCase();
        var typeValue = type ? type.value.trim() : '';
        var yearValue = year ? year.value.trim() : '';
        var visible = 0;

        cards.forEach(function (card) {
          var text = [
            card.getAttribute('data-card-title') || '',
            card.getAttribute('data-card-tags') || '',
            card.getAttribute('data-card-meta') || ''
          ].join(' ').toLowerCase();
          var meta = card.getAttribute('data-card-meta') || '';
          var matched = true;

          if (keyword && text.indexOf(keyword) === -1) {
            matched = false;
          }

          if (typeValue && meta.indexOf(typeValue) === -1) {
            matched = false;
          }

          if (yearValue && meta.indexOf(yearValue) === -1) {
            matched = false;
          }

          card.style.display = matched ? '' : 'none';
          visible += matched ? 1 : 0;
        });

        if (empty) {
          empty.classList.toggle('is-visible', visible === 0);
        }
      }

      [input, type, year].forEach(function (control) {
        if (control) {
          control.addEventListener('input', apply);
          control.addEventListener('change', apply);
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initHeader();
    initMissingImages();
    initHero();
    initLocalFilter();
  });
})();
