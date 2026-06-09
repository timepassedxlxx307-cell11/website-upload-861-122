(function () {
  const menuButton = document.querySelector('[data-menu-button]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
    });
  }

  document.querySelectorAll('[data-hero]').forEach(function (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const prev = hero.querySelector('[data-hero-prev]');
    const next = hero.querySelector('[data-hero-next]');
    let current = slides.findIndex(function (slide) {
      return slide.classList.contains('active');
    });

    if (current < 0) {
      current = 0;
    }

    function show(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.dataset.heroDot));
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        show(current + 1);
      }, 5000);
    }
  });

  document.querySelectorAll('[data-card-filter]').forEach(function (input) {
    const section = input.closest('.filter-section') || document;
    const cards = Array.from(section.querySelectorAll('.movie-card'));
    const chips = Array.from(section.querySelectorAll('[data-filter-chip]'));
    let chipValue = '';

    function applyFilter() {
      const query = input.value.trim().toLowerCase();
      cards.forEach(function (card) {
        const text = [
          card.dataset.title,
          card.dataset.region,
          card.dataset.year,
          card.dataset.type,
          card.dataset.genre,
          card.textContent
        ].join(' ').toLowerCase();
        const chipOk = !chipValue || text.indexOf(chipValue.toLowerCase()) !== -1;
        const queryOk = !query || text.indexOf(query) !== -1;
        card.classList.toggle('is-hidden', !(chipOk && queryOk));
      });
    }

    input.addEventListener('input', applyFilter);
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chipValue = chip.dataset.filterChip || '';
        chips.forEach(function (item) {
          item.classList.toggle('active', item === chip);
        });
        applyFilter();
      });
    });
  });
})();
