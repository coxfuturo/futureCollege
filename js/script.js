// ============================================================
// FUTURECOLLEGE — Enhanced JavaScript
// Preserves all existing functionality, adds new interactions
// ============================================================

// ============================================================
// HEADER: STICKY BEHAVIOR & SCROLL CLASS
// ============================================================
(function () {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 80) {
      header.style.boxShadow = '0 2px 16px rgba(13,27,42,.10)';
    } else {
      header.style.boxShadow = '0 1px 0 #e4e9f2';
    }
    lastScroll = currentScroll;
  }, { passive: true });
})();

// ============================================================
// ALL COURSES DROPDOWN (PRESERVED + ENHANCED)
// ============================================================
(function () {
  const courseBtn = document.getElementById('courseBtn');
  const courseMenu = document.getElementById('courseMenu');
  const courseSearchInput = document.getElementById('courseSearchInput');
  const courseList = document.getElementById('courseList');

  if (!courseBtn || !courseMenu) return;

  // Toggle dropdown
  courseBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    const isOpen = courseMenu.classList.toggle('active');
    courseBtn.classList.toggle('open', isOpen);
    if (isOpen) courseSearchInput && courseSearchInput.focus();
  });

  // Close when clicking outside
  document.addEventListener('click', function (e) {
    if (!courseBtn.contains(e.target) && !courseMenu.contains(e.target)) {
      courseMenu.classList.remove('active');
      courseBtn.classList.remove('open');
    }
  });

  // Prevent closing when clicking inside
  courseMenu.addEventListener('click', function (e) {
    e.stopPropagation();
  });

  // Live search filter
  if (courseSearchInput && courseList) {
    courseSearchInput.addEventListener('input', function () {
      const query = this.value.toLowerCase().trim();
      const items = courseList.querySelectorAll('li');
      items.forEach(function (li) {
        const text = li.textContent.toLowerCase();
        li.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }
})();

// ============================================================
// MOBILE DRAWER (NEW)
// ============================================================
(function () {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const closeBtn = document.getElementById('drawerCloseBtn');

  if (!menuBtn || !drawer || !overlay) return;

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  menuBtn.addEventListener('click', openDrawer);
  overlay.addEventListener('click', closeDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  // Close on ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });
})();

// ============================================================
// HERO SLIDER (ENHANCED — auto-play + indicators)
// ============================================================
(function () {
  const slides = document.querySelectorAll('.hero-slide');
  const indicators = document.querySelectorAll('.hero-indicator');
  if (!slides.length) return;

  let currentSlide = 0;
  let sliderInterval = null;

  function goToSlide(idx) {
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide] && indicators[currentSlide].classList.remove('active');

    currentSlide = (idx + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    indicators[currentSlide] && indicators[currentSlide].classList.add('active');
  }

  function startAutoSlide() {
    sliderInterval = setInterval(function () {
      goToSlide(currentSlide + 1);
    }, 5000);
  }

  function resetAutoSlide() {
    clearInterval(sliderInterval);
    startAutoSlide();
  }

  // Indicator clicks
  indicators.forEach(function (btn, idx) {
    btn.addEventListener('click', function () {
      goToSlide(idx);
      resetAutoSlide();
    });
  });

  // Initialize
  goToSlide(0);
  startAutoSlide();
})();

// ============================================================
// HERO SEARCH PILLS (TAB SWITCHING)
// ============================================================
(function () {
  const pills = document.querySelectorAll('.search-pill-btn');
  const heroSearchInput = document.getElementById('heroSearchInput');
  if (!pills.length) return;

  const placeholders = {
    colleges: 'Search colleges by name, location or type...',
    courses: 'Search courses like B.Tech, MBA, MBBS...',
    exams: 'Search entrance exams like JEE, NEET, CAT...',
    rankings: 'Search rankings like NIRF, QS World...',
  };

  pills.forEach(function (btn) {
    btn.addEventListener('click', function () {
      pills.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      const type = btn.getAttribute('data-search-type');
      if (heroSearchInput && placeholders[type]) {
        heroSearchInput.placeholder = placeholders[type];
        heroSearchInput.focus();
      }
    });
  });
})();

// ============================================================
// HERO QUICK FILTER CHIPS → navigate to listing
// ============================================================
(function () {
  const chips = document.querySelectorAll('.hero-filter-chip');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      const filter = chip.getAttribute('data-filter') || '';
      window.location.href = 'pages/colleges.html?stream=' + filter;
    });
  });
})();

// ============================================================
// HERO SEARCH SUBMIT
// ============================================================
(function () {
  const heroSearchBar = document.getElementById('heroSearchBar');
  const heroSearchInput = document.getElementById('heroSearchInput');
  const heroSearchSubmit = document.getElementById('heroSearchSubmit');
  const headerSearchInput = document.getElementById('headerSearchInput');

  function doSearch(query) {
    if (!query.trim()) return;
    window.location.href = 'pages/colleges.html?q=' + encodeURIComponent(query.trim());
  }

  if (heroSearchSubmit) {
    heroSearchSubmit.addEventListener('click', function () {
      doSearch(heroSearchInput ? heroSearchInput.value : '');
    });
  }

  if (heroSearchInput) {
    heroSearchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') doSearch(this.value);
    });
  }

  if (headerSearchInput) {
    headerSearchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') doSearch(this.value);
    });
  }
})();

// ============================================================
// COLLEGE CARD STREAM FILTER TABS
// ============================================================
(function () {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const collegeCards = document.querySelectorAll('.college-card[data-stream]');
  if (!filterTabs.length) return;

  filterTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      filterTabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');

      const stream = tab.getAttribute('data-stream');

      collegeCards.forEach(function (card) {
        if (stream === 'all' || card.getAttribute('data-stream') === stream) {
          card.style.display = '';
          card.style.animation = 'fadeInUp .3s ease both';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();

// ============================================================
// ENGINEERING COURSE TABS (PRESERVED)
// ============================================================
(function () {
  const tabButtons = document.querySelectorAll('.tab-btn');
  if (!tabButtons.length) return;

  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const target = btn.getAttribute('data-tab');

      document.querySelectorAll('.tab-btn').forEach(function (b) {
        b.classList.remove('active');
      });

      document.querySelectorAll('.course-content').forEach(function (content) {
        content.classList.remove('active');
      });

      btn.classList.add('active');
      const targetEl = document.getElementById(target);
      if (targetEl) targetEl.classList.add('active');
    });
  });
})();

// ============================================================
// COLLEGE CARD WISHLIST TOGGLE (PRESERVED)
// ============================================================
(function () {
  document.querySelectorAll('.college-wishlist-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      btn.classList.toggle('active');
      const icon = btn.querySelector('i');
      if (!icon) return;
      if (btn.classList.contains('active')) {
        icon.classList.remove('ri-heart-line');
        icon.classList.add('ri-heart-fill');
      } else {
        icon.classList.remove('ri-heart-fill');
        icon.classList.add('ri-heart-line');
      }
    });
  });
})();

// ============================================================
// ANIMATE ON SCROLL (INTERSECTION OBSERVER)
// ============================================================
(function () {
  const animateEls = document.querySelectorAll('.animate-on-scroll');
  if (!animateEls.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  animateEls.forEach(function (el) { observer.observe(el); });
})();

// ============================================================
// SUBNAV LINK ACTIVE STATE ON CLICK
// ============================================================
(function () {
  const subnavLinks = document.querySelectorAll('.subnav-link');
  subnavLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      subnavLinks.forEach(function (l) { l.classList.remove('active'); });
      link.classList.add('active');
    });
  });
})();