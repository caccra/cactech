/* ── PRELOADER ── */
const preloader = document.getElementById('preloader');
if (preloader) {
  setTimeout(() => preloader.classList.add('done'), 1150);
}

document.addEventListener('DOMContentLoaded', () => {

  /* ── THEME ── */
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon   = document.getElementById('theme-icon');
  const html        = document.documentElement;
  const saved       = localStorage.getItem('cactech-theme');

  const LOGO_DARK  = 'assets/images/logo.png';
  const LOGO_LIGHT = 'assets/images/logo.png';
  const applyTheme = (isLight, animate = false) => {
    isLight ? html.setAttribute('data-theme','light') : html.removeAttribute('data-theme');
    themeIcon.textContent = isLight ? '🌙' : '☀️';
    document.querySelectorAll('.logo-img').forEach(img => {
      if (animate) {
        img.style.opacity = '0';
        setTimeout(() => {
          img.src = isLight ? LOGO_LIGHT : LOGO_DARK;
          img.style.opacity = '1';
        }, 180);
      } else {
        img.src = isLight ? LOGO_LIGHT : LOGO_DARK;
      }
    });
  };
  applyTheme(saved === 'light');
  themeToggle.addEventListener('click', () => {
    const nowLight = html.getAttribute('data-theme') !== 'light';
    localStorage.setItem('cactech-theme', nowLight ? 'light' : 'dark');
    applyTheme(nowLight, true);
  });

  /* ── SCROLL PROGRESS BAR ── */
  const progressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const total = document.body.scrollHeight - window.innerHeight;
    progressBar.style.width = (window.scrollY / total * 100) + '%';
  }, { passive: true });

  /* ── HEADER SCROLL ── */
  const header = document.getElementById('header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── MOBILE MENU ── */
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navLinks  = document.getElementById('nav-links');
  mobileBtn.addEventListener('click', () => {
    const open = navLinks.classList.toggle('active');
    mobileBtn.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('active');
    mobileBtn.classList.remove('open');
    document.body.style.overflow = '';
  }));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      mobileBtn.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  /* ── CUSTOM CURSOR ── */
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (cursor && follower && window.matchMedia('(pointer:fine)').matches) {
    let mx = 0, my = 0, fx = 0, fy = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });
    const tick = () => {
      fx += (mx - fx) * 0.1;
      fy += (my - fy) * 0.1;
      follower.style.left = fx + 'px';
      follower.style.top  = fy + 'px';
      requestAnimationFrame(tick);
    };
    tick();
    document.querySelectorAll('a,button,.work-card,.testimonial-card,.process-step,.svc-item,.cta-contact-card,.tech-category').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('ch'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('ch'));
    });
  }

  /* ── ACTIVE NAV TRACKING ── */
  const navItems = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');
  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
      }
    });
  }, { threshold: 0.35, rootMargin: '-80px 0px -80px 0px' });
  sections.forEach(s => sectionObs.observe(s));

  /* ── BACK TO TOP ── */
  const backBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    backBtn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ── FLOATING CONTACT WIDGET ── */
  const floatTrigger  = document.getElementById('float-trigger');
  const contactFloat  = document.getElementById('contact-float');
  if (floatTrigger && contactFloat) {
    floatTrigger.addEventListener('click', e => {
      e.stopPropagation();
      const open = contactFloat.classList.toggle('open');
      floatTrigger.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', e => {
      if (!contactFloat.contains(e.target)) {
        contactFloat.classList.remove('open');
        floatTrigger.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && contactFloat.classList.contains('open')) {
        contactFloat.classList.remove('open');
        floatTrigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── HERO MOUSE SPOTLIGHT ── */
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    heroSection.addEventListener('mousemove', e => {
      const r = heroSection.getBoundingClientRect();
      heroSection.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100) + '%');
      heroSection.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100) + '%');
    });
  }

  /* ── HERO CANVAS PARTICLES ── */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, pts = [], animId;
    const CYAN = '0,229,255';

    const resize = () => { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    for (let i = 0; i < 70; i++) pts.push({
      x:  Math.random() * (W || 1200),
      y:  Math.random() * (H || 800),
      vx: (Math.random() - .5) * .5,
      vy: (Math.random() - .5) * .5,
      r:  Math.random() * 1.5 + .4,
      a:  Math.random() * .5 + .08
    });

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${CYAN},${p.a})`;
        ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${CYAN},${(1 - d / 130) * .12})`;
            ctx.lineWidth = .6;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(animId); else draw();
    });
  }

  /* ── HERO WORD CYCLE ── */
  const wordEl = document.getElementById('word-cycle');
  if (wordEl) {
    const words = ['Convert.', 'Scale Fast.', 'Dominate.', 'Thrive.', 'Win Online.'];
    let wi = -1;
    setInterval(() => {
      wordEl.style.opacity   = '0';
      wordEl.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        wi = (wi + 1) % words.length;
        wordEl.textContent     = words[wi];
        wordEl.style.opacity   = '1';
        wordEl.style.transform = 'translateY(0)';
      }, 280);
    }, 2800);
  }

  /* ── SERVICE ACCORDION ── */
  document.querySelectorAll('.svc-header').forEach(hdr => {
    hdr.addEventListener('click', () => {
      const item   = hdr.closest('.svc-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.svc-item').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.svc-header').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        hdr.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── MAGNETIC BUTTONS ── */
  document.querySelectorAll('.btn-magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * 0.3;
      const dy = (e.clientY - (r.top  + r.height / 2)) * 0.3;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  /* ── SCROLL ANIMATIONS (IntersectionObserver) ── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  const fadeObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in-view'); fadeObs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.scroll-fade').forEach(el => {
    prefersReducedMotion ? el.classList.add('in-view') : fadeObs.observe(el);
  });

  /* ── STAT COUNTERS ── */
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const max = parseInt(el.dataset.target, 10);
      const sfx = el.dataset.suffix || '';
      const t0  = performance.now();
      const dur = 1400;
      const tick = now => {
        const prog  = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - prog, 3);
        el.textContent = Math.round(eased * max) + sfx;
        if (prog < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

  /* ── STAT BARS ── */
  const barObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in-view'); barObs.unobserve(e.target); }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.stat-block').forEach(el => barObs.observe(el));

  /* ── TECH TAGS STAGGER ── */
  const techObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.tech-tags span').forEach((tag, i) => {
          tag.style.transitionDelay = (i * 40) + 'ms';
          tag.classList.add('in-view');
        });
        techObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.tech-category').forEach(el => techObs.observe(el));

  /* ── NEWSLETTER ── */
  window.handleNewsletterSubmit = e => {
    e.preventDefault();
    const btn   = e.target.querySelector('.newsletter-btn');
    const input = e.target.querySelector('.newsletter-input');
    btn.textContent       = '✓';
    input.value           = '';
    input.placeholder     = 'Thanks for subscribing!';
    setTimeout(() => { btn.textContent = '→'; input.placeholder = 'your@email.com'; }, 3500);
  };

  /* ── FAQ ACCORDION ── */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── SMOOTH SCROLL FOR ANCHOR LINKS ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = document.getElementById('header')?.offsetHeight || 80;
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
