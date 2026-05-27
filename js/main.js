(function () {
  let currentSlide = 0;
  let slideInterval;
  let testimonialVisible = false;

  function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav ul');
    if (menuToggle && nav) {
      menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
      });
      nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          nav.classList.remove('active');
          menuToggle.classList.remove('active');
        });
      });
    }
  }

  function initFAQ() {
    document.querySelectorAll('.faq-question').forEach((question) => {
      question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach((item) => {
          item.classList.remove('active');
        });
        if (!isActive) {
          faqItem.classList.add('active');
        }
      });
    });
  }

  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      const name = form.querySelector('[name="name"]');
      const email = form.querySelector('[name="email"]');
      const phone = form.querySelector('[name="phone"]');
      const message = form.querySelector('[name="message"]');
      if (name && name.value.trim() === '') {
        showFieldError(name, window.getTranslation ? window.getTranslation('contact.nameError') : 'Please enter your name');
        isValid = false;
      } else {
        clearFieldError(name);
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email.value.trim())) {
        showFieldError(email, window.getTranslation ? window.getTranslation('contact.emailError') : 'Please enter a valid email');
        isValid = false;
      } else {
        clearFieldError(email);
      }
      const phoneRegex = /^[\d\s\+\-\(\)]{8,}$/;
      if (phone && phone.value.trim() !== '' && !phoneRegex.test(phone.value.trim())) {
        showFieldError(phone, window.getTranslation ? window.getTranslation('contact.phoneError') : 'Please enter a valid phone number');
        isValid = false;
      } else {
        clearFieldError(phone);
      }
      if (message && message.value.trim() === '') {
        showFieldError(message, window.getTranslation ? window.getTranslation('contact.messageError') : 'Please enter your message');
        isValid = false;
      } else {
        clearFieldError(message);
      }
      if (isValid) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success';
        alertDiv.textContent = window.getTranslation
          ? window.getTranslation('contact.successMessage')
          : 'Message sent successfully!';
        form.insertBefore(alertDiv, form.firstChild);
        form.reset();
        setTimeout(() => alertDiv.remove(), 5000);
      }
    });
  }

  function showFieldError(field, errorMsg) {
    field.classList.add('error');
    let errorEl = field.parentElement.querySelector('.form-error');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'form-error';
      field.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = errorMsg;
    errorEl.classList.add('show');
  }

  function clearFieldError(field) {
    field.classList.remove('error');
    const errorEl = field.parentElement.querySelector('.form-error');
    if (errorEl) {
      errorEl.classList.remove('show');
    }
  }

  function initCounters() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    if (statNumbers.length === 0) return;

    let animated = false;

    function animateCounters() {
      if (animated) return;

      const statsSection = document.querySelector('.stats');
      if (!statsSection) return;

      const rect = statsSection.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;

      if (!isVisible) return;
      animated = true;

      statNumbers.forEach((el) => {
        const target = parseFloat(el.getAttribute('data-target'));
        const isDecimal = el.hasAttribute('data-decimal');
        const suffix = el.getAttribute('data-suffix') || '';
        const divisor = parseFloat(el.getAttribute('data-divisor')) || 1;
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const currentValue = eased * target;

          if (isDecimal) {
            el.textContent = currentValue.toFixed(1);
          } else if (divisor > 1) {
            const displayValue = Math.floor(currentValue / divisor);
            el.textContent = displayValue + suffix;
          } else {
            el.textContent = Math.floor(currentValue) + '+';
          }

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            if (isDecimal) {
              el.textContent = target.toFixed(1);
            } else if (divisor > 1) {
              el.textContent = Math.floor(target / divisor) + suffix + '+';
            } else {
              el.textContent = target + '+';
            }
          }
        }

        requestAnimationFrame(update);
      });
    }

    window.addEventListener('scroll', animateCounters, { passive: true });
    animateCounters();
  }

  function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const paths = document.querySelectorAll('.timeline-path');

    function checkReveal() {
      reveals.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;
        if (isVisible) {
          el.classList.add('visible');
        }
      });

      if (paths.length > 0) {
        const timelineRect = paths[0].closest('.values-timeline').getBoundingClientRect();
        const isTimelineVisible = timelineRect.top < window.innerHeight * 0.85 && timelineRect.bottom > 0;
        if (isTimelineVisible) {
          paths.forEach((path) => {
            path.classList.add('animated');
          });
        }
      }
    }

    window.addEventListener('scroll', checkReveal, { passive: true });
    checkReveal();
  }

  function initTestimonials() {
    const wrapper = document.querySelector('.testimonial-wrapper');
    const trackWrapper = document.querySelector('.testimonial-track-wrapper');
    const track = document.querySelector('.testimonial-track');
    if (!wrapper || !trackWrapper || !track) return;

    const cards = track.querySelectorAll('.testimonial-card');
    const dotsContainer = wrapper.querySelector('.testimonial-dots');

    function getVisibleCards() {
      const width = window.innerWidth;
      if (width >= 1200) return 3;
      if (width >= 768) return 2;
      return 1;
    }

    function createDots() {
      if (dotsContainer) {
        dotsContainer.innerHTML = '';
        const visible = getVisibleCards();
        const totalPages = Math.ceil(cards.length / visible);
        for (let i = 0; i < totalPages; i++) {
          const dot = document.createElement('span');
          dot.className = 'dot' + (i === currentSlide ? ' active' : '');
          dot.onclick = () => goToSlide(i);
          dotsContainer.appendChild(dot);
        }
      }
    }

    function updateSlider() {
      const visible = getVisibleCards();
      const cardWidth = trackWrapper.offsetWidth / visible;
      const offset = currentSlide * visible * cardWidth;
      track.style.transform = `translateX(-${offset}px)`;

      if (dotsContainer) {
        dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
          dot.classList.toggle('active', i === currentSlide);
        });
      }
    }

    function goToSlide(index) {
      const visible = getVisibleCards();
      const totalPages = Math.ceil(cards.length / visible);
      currentSlide = Math.max(0, Math.min(index, totalPages - 1));
      updateSlider();
      resetSlideInterval();
    }

    window.slideTestimonials = function (direction) {
      const visible = getVisibleCards();
      const totalPages = Math.ceil(cards.length / visible);
      if (direction > 0) {
        currentSlide = currentSlide >= totalPages - 1 ? 0 : currentSlide + 1;
      } else {
        currentSlide = currentSlide <= 0 ? totalPages - 1 : currentSlide - 1;
      }
      updateSlider();
      resetSlideInterval();
    };

    function startSlideInterval() {
      slideInterval = setInterval(() => {
        window.slideTestimonials(1);
      }, 5000);
    }

    function resetSlideInterval() {
      clearInterval(slideInterval);
      startSlideInterval();
    }

    createDots();
    updateSlider();
    startSlideInterval();

    window.addEventListener('resize', () => {
      createDots();
      updateSlider();
    });
  }

  function initContactMap() {
    const mapElement = document.getElementById('contact-map');
    if (!mapElement || typeof L === 'undefined') return;
    const map = L.map('contact-map').setView([-18.8792, 47.5079], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    L.marker([-18.8792, 47.5079])
      .addTo(map)
      .bindPopup('Le Gourmet<br>12 Rue Colbert, Antananarivo 101')
      .openPopup();
  }

  function initGallery() {
    const filters = document.querySelectorAll('.gallery-filter');
    const items = document.querySelectorAll('.gallery-item');
    if (filters.length === 0 || items.length === 0) return;

    let animating = false;

    items.forEach((item) => {
      item.classList.add('entering');
      item.addEventListener('animationend', function onEnd() {
        item.classList.remove('entering');
        item.removeEventListener('animationend', onEnd);
      });
    });

    filters.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (animating) return;
        const filter = btn.getAttribute('data-filter');
        filters.forEach((f) => f.classList.remove('active'));
        btn.classList.add('active');
        animating = true;
        let delay = 0;
        items.forEach((item) => {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.classList.remove('hidden');
            item.classList.remove('filter-entering');
            void item.offsetWidth;
            item.style.setProperty('--i', delay / 60);
            item.classList.add('filter-entering');
            delay += 60;
          } else {
            item.classList.add('hidden');
            item.classList.remove('filter-entering');
          }
        });
        items.forEach((item) => {
          if (item.classList.contains('filter-entering')) {
            const onFilterEnd = () => {
              item.classList.remove('filter-entering');
              item.removeEventListener('animationend', onFilterEnd);
            };
            item.addEventListener('animationend', onFilterEnd);
          }
        });
        setTimeout(() => { animating = false; }, delay + 500);
      });
    });
  }

  function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (!lightbox || galleryItems.length === 0) return;

    let currentIndex = 0;
    const visibleItems = [];
    const counter = document.createElement('span');
    counter.className = 'lightbox-counter';
    lightbox.appendChild(counter);

    function getVisibleItems() {
      visibleItems.length = 0;
      galleryItems.forEach((item, i) => {
        if (!item.classList.contains('hidden')) {
          visibleItems.push(i);
        }
      });
    }

    function updateCounter() {
      const total = visibleItems.length;
      counter.textContent = total > 0 ? `${currentIndex + 1} / ${total}` : '';
    }

    function openLightbox(index) {
      getVisibleItems();
      const realIndex = visibleItems[index];
      if (realIndex === undefined) return;
      currentIndex = index;
      const img = galleryItems[realIndex].querySelector('img');
      lightboxImg.src = img.src.replace(/w=\d+/, 'w=1200');
      lightboxImg.alt = img.alt || '';
      updateCounter();
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    function navigate(dir) {
      getVisibleItems();
      const newIndex = (currentIndex + dir + visibleItems.length) % visibleItems.length;
      const prevImg = lightboxImg.src;
      openLightbox(newIndex);
      if (prevImg !== lightboxImg.src) {
        lightboxImg.style.animation = 'none';
        void lightboxImg.offsetWidth;
        lightboxImg.style.animation = '';
      }
    }

    galleryItems.forEach((item, i) => {
      item.addEventListener('click', () => {
        getVisibleItems();
        const idx = visibleItems.indexOf(i);
        if (idx !== -1) openLightbox(idx);
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => navigate(-1));
    nextBtn.addEventListener('click', () => navigate(1));

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });
  }

  function initArticle() {
    if (!document.getElementById('article-title')) return;
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'), 10);

    if (isNaN(id) || id < 1 || id > 6) {
      document.getElementById('article-image-section').style.display = 'none';
      document.getElementById('article-body').style.display = 'none';
      document.getElementById('article-prev').classList.add('disabled');
      document.getElementById('article-next').classList.add('disabled');
      return;
    }

    const images = [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=1200&h=600&fit=crop'
    ];

    let retries = 50;
    function doRender() {
      const title = window.getTranslation('blog.post_' + id + '_title');
      if (title.indexOf('blog.post_') === 0 && retries > 0) {
        retries--;
        setTimeout(doRender, 50);
        return;
      }
      const articleTitle = window.getTranslation('blog.post_' + id + '_title');
      const articleDate = window.getTranslation('blog.date_' + id);
      const articleBody = window.getTranslation('blog.post_' + id + '_body');

      document.getElementById('article-title').textContent = articleTitle;
      document.getElementById('article-date').textContent = articleDate;
      document.title = articleTitle + ' — Le Gourmet';

      const img = document.getElementById('article-image');
      img.src = images[id - 1];
      img.alt = articleTitle;
      document.getElementById('article-image-section').style.display = '';

      const bodyEl = document.getElementById('article-body');
      bodyEl.innerHTML = '';
      const paragraphs = articleBody.split(/\n\n+/);
      if (paragraphs.length < 2) {
        const sentences = articleBody.split(/(?<=\.)\s+/);
        paragraphs.length = 0;
        let current = '';
        for (const s of sentences) {
          if ((current + s).length > 300) {
            if (current) paragraphs.push(current.trim());
            current = s;
          } else {
            current += (current ? ' ' : '') + s;
          }
        }
        if (current) paragraphs.push(current.trim());
      }
      paragraphs.forEach(function (p) {
        if (p.trim()) {
          var para = document.createElement('p');
          para.textContent = p.trim();
          bodyEl.appendChild(para);
        }
      });

      var prevLink = document.getElementById('article-prev');
      var nextLink = document.getElementById('article-next');
      if (id > 1) {
        prevLink.href = 'article.html?id=' + (id - 1);
        prevLink.classList.remove('disabled');
      } else {
        prevLink.classList.add('disabled');
        prevLink.removeAttribute('href');
      }
      if (id < 6) {
        nextLink.href = 'article.html?id=' + (id + 1);
        nextLink.classList.remove('disabled');
      } else {
        nextLink.classList.add('disabled');
        nextLink.removeAttribute('href');
      }
    }

    doRender();
  }

  function initChartBars() {
    const bars = document.querySelectorAll('.chart-bars');
    if (bars.length === 0) return;

    function checkBars() {
      bars.forEach(function (barSection) {
        const rect = barSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;
        if (isVisible) {
          barSection.querySelectorAll('.chart-bar-fill').forEach(function (fill) {
            if (!fill.classList.contains('animated')) {
              fill.classList.add('animated');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', checkBars, { passive: true });
    checkBars();
  }

  function initThemeToggle() {
    var btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    var stored = localStorage.getItem('theme');
    if (stored === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      btn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
    btn.addEventListener('click', function () {
      var html = document.documentElement;
      var isDark = html.getAttribute('data-theme') === 'dark';
      if (isDark) {
        html.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        btn.innerHTML = '<i class="fa-solid fa-sun"></i>';
      } else {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        btn.innerHTML = '<i class="fa-solid fa-moon"></i>';
      }
    });
  }

  function init() {
    initMobileMenu();
    initFAQ();
    initContactForm();
    initCounters();
    initRevealAnimations();
    initTestimonials();
    initContactMap();
    initGallery();
    initLightbox();
    initArticle();
    initChartBars();
    initThemeToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();