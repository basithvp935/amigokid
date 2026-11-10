/* =========================================================
   AMIGO Kid: landing page behaviour
   (testimonials, scroll effects, WhatsApp links)
   Content lives in js/data.js
   ========================================================= */
(function () {
  'use strict';

  const { CONFIG, REVIEWS } = window.AMIGO;

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const waLink = msg => `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  $$('[data-wa]').forEach(a => { a.href = waLink(a.dataset.wa); });

  /* ---------- Testimonials ---------- */
  const tSection = $('#reviews');
  if (tSection && REVIEWS.length) {
    const quotes = $('.t-quotes', tSection);
    const people = $('.t-people', tSection);
    const initials = n => n.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();

    quotes.innerHTML = REVIEWS.map((r, i) => `
      <figure class="t-quote${i === 0 ? ' is-on' : ''}" aria-hidden="${i !== 0}">
        <div class="t-stars" aria-label="${r.stars || 5} out of 5 stars">${'<i class="bi bi-star-fill"></i>'.repeat(r.stars || 5)}</div>
        <blockquote>${esc(r.text)}</blockquote>
        <figcaption>
          ${r.shoe ? `<span class="t-shoe"><i class="bi bi-bag-heart" aria-hidden="true"></i> ${esc(r.shoe)}</span>` : ''}
          ${r.sample ? '<span class="t-sample">Sample review</span>' : ''}
        </figcaption>
      </figure>`).join('');

    people.innerHTML = REVIEWS.map((r, i) => `
      <button class="t-person${i === 0 ? ' is-on' : ''}" type="button" data-i="${i}" aria-pressed="${i === 0}">
        <span class="t-avatar" aria-hidden="true">${esc(initials(r.name))}</span>
        <span class="t-who"><b>${esc(r.name)}</b><span>${esc([r.detail, r.place].filter(Boolean).join(' · '))}</span></span>
        <span class="t-bar" aria-hidden="true"></span>
      </button>`).join('');

    const slides = $$('.t-quote', tSection), tabs = $$('.t-person', tSection);
    const HOLD = 6500;
    let cur = 0, timer = 0, inView = false;

    const show = i => {
      cur = (i + slides.length) % slides.length;
      slides.forEach((s, k) => { s.classList.toggle('is-on', k === cur); s.setAttribute('aria-hidden', k !== cur); });
      tabs.forEach((t, k) => { t.classList.toggle('is-on', k === cur); t.setAttribute('aria-pressed', k === cur); });
      $('.t-count', tSection).textContent = `${String(cur + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
      schedule();
    };
    const schedule = () => {
      clearTimeout(timer);
      tabs.forEach(t => t.classList.remove('is-run'));
      if (reduceMotion || !inView || slides.length < 2) return;
      void tabs[cur].offsetWidth;
      tabs[cur].classList.add('is-run');
      timer = setTimeout(() => show(cur + 1), HOLD);
    };

    people.addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (b) show(Number(b.dataset.i)); });
    $('.t-prev', tSection).addEventListener('click', () => show(cur - 1));
    $('.t-next', tSection).addEventListener('click', () => show(cur + 1));
    tSection.style.setProperty('--hold', HOLD + 'ms');
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => { inView = es[0].isIntersecting; schedule(); }, { threshold: .3 }).observe(tSection);
    }
    show(0);
  } else if (tSection) {
    tSection.hidden = true;
  }

  /* ---------- Scroll reveal ---------- */
  $$('[data-stagger]').forEach(group => {
    [...group.children].forEach((el, i) => {
      if (el.matches('[data-reveal]')) el.style.setProperty('--d', (i * 0.09).toFixed(2) + 's');
    });
  });
  const revealEls = $$('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  }

  /* ---------- Scroll effects: progress bar, header, back-to-top ---------- */
  const header = $('#siteHeader');
  const bar = $('#scrollBar');
  const toTop = $('#toTop');
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    header.classList.toggle('scrolled', y > 10);
    toTop.classList.toggle('show', y > 700);
    ticking = false;
  }
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  $('#year').textContent = new Date().getFullYear();
})();
