/* =============================================
   JESEL — main.js
   ============================================= */

/* ---------- Scroll: header shadow + active nav ---------- */
const header = document.querySelector('.site-header');
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('.nav-list a[href^="#"]');

const onScroll = () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 20);

  // Resaltar sección activa
  let current = '';
  sections.forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    if (top <= 100) current = sec.id;
  });
  navLinks.forEach(a => {
    const isActive = a.getAttribute('href') === '#' + current;
    a.style.color = isActive ? 'var(--ink)' : '';
    const afterEl = a.querySelector('::after');
  });
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Mobile nav ---------- */
const burger = document.querySelector('.burger');
const navList = document.querySelector('.nav-list');
const navCta  = document.querySelector('.nav-cta');

if (burger && navList) {
  burger.addEventListener('click', () => {
    const isOpen = navList.classList.contains('open');
    navList.classList.toggle('open', !isOpen);
    burger.classList.toggle('open', !isOpen);
    burger.setAttribute('aria-expanded', String(!isOpen));
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });

  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navList.classList.contains('open')) {
      navList.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      burger.focus();
    }
  });
}

/* ---------- Smooth scroll con offset del nav ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const offset = 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ---------- Ticker card: rotación de fila activa ---------- */
const tickerRows = document.querySelectorAll('.ticker-row');
if (tickerRows.length) {
  let currentTicker = 0;
  setInterval(() => {
    tickerRows[currentTicker].classList.remove('active');
    currentTicker = (currentTicker + 1) % tickerRows.length;
    tickerRows[currentTicker].classList.add('active');
  }, 1800);
}

/* ---------- Scroll reveal con IntersectionObserver ---------- */
if ('IntersectionObserver' in window) {
  const style = document.createElement('style');
  style.textContent = `
    .reveal { opacity: 0; transform: translateY(16px); transition: opacity .55s ease, transform .55s ease; }
    .reveal.visible { opacity: 1; transform: none; }
  `;
  document.head.appendChild(style);

  const revealTargets = document.querySelectorAll(
    '.service-item, .work-card, .data-col, .method-step, .value-item, .team-discipline'
  );

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 60}ms`;
    obs.observe(el);
  });
}

/* ---------- Formulario ---------- */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const btn = form.querySelector('.submit-btn');
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';

    // Simular llamada async (reemplazar con fetch al endpoint real)
    await new Promise(r => setTimeout(r, 1400));

    btn.textContent = 'Mensaje enviado ✓';
    form.reset();
    showToast('Gracias. Te respondemos en menos de 24 horas.');

    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = original;
    }, 5000);
  });
}

function showToast(msg) {
  const toast = document.querySelector('.toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 5000);
}

/* ---------- Animación de números en stats ---------- */
function animateValue(el, from, to, duration, suffix = '') {
  const start = performance.now();
  const update = now => {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const val = Math.round(from + (to - from) * ease);
    el.textContent = (val > 100 ? '+' : '') + val + suffix;
    if (p < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

if ('IntersectionObserver' in window) {
  const statObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.dataset.val;
      const suffix = el.dataset.suf || '';
      if (raw) {
        animateValue(el, 0, parseInt(raw, 10), 1200, suffix);
        statObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-val]').forEach(el => statObs.observe(el));
}
