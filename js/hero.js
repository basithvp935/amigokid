/* =========================================================
   AMIGO Kid: hero shoe slider
   A shoe floats over soft clouds in front of a giant word.
   Every 2 seconds the shoe and word swap cleanly: the old ones
   leave first, then the new ones arrive, so nothing overlaps.
   It pauses while hovered or focused, and when off screen.
   Shoes come from PRODUCTS in js/data.js (those with `hero`).
   ========================================================= */
(function () {
  'use strict';

  const stage = document.getElementById('heroStage');
  if (!stage) return;

  const { PRODUCTS, TAGS } = window.AMIGO;
  const shoes = PRODUCTS.filter(p => p.hero);
  if (!shoes.length) return;

  const GAP = 2000;          // ms each shoe rests before the next one arrives
  const SWAP = 950;          // ms for the whole swap
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const shoeWrap = stage.querySelector('.hs-shoes');
  const wordEl = stage.querySelector('.hs-word');
  const nameEl = stage.querySelector('.hs-name');
  const catEl = stage.querySelector('.hs-cat');
  const dotsEl = stage.querySelector('.hs-dots');

  /* ---------- Clouds ----------
     Each cloud is a soft shape roughened by an SVG noise filter
     (see #cloud-a/b/c in index.html), with a shaded underside. */
  function cloud(layer, x, y, w, h, kind, filter) {
    const c = document.createElement('span');
    c.className = `hs-cloud ${kind}`;
    // h is the cloud's height on a 1400px-wide hero; keep that shape at every size
    c.style.cssText = `left:${x}%;top:${y}%;--w:${w}%;aspect-ratio:${(w * 14 / h).toFixed(2)};--f:url(#${filter})`;
    c.innerHTML = '<i class="shade"></i><i class="light"></i>';
    layer.appendChild(c);
  }
  (function buildSky() {
    const far = stage.querySelector('.hs-sky.far');
    const near = stage.querySelector('.hs-sky.near');
    const bank = stage.querySelector('.hs-bank');
    cloud(far, -4, 4, 20, 90, 'far', 'cloud-a');
    cloud(far, 26, -2, 13, 70, 'far', 'cloud-b');
    cloud(far, 66, 2, 18, 84, 'far', 'cloud-c');
    cloud(far, 86, 18, 16, 74, 'far', 'cloud-a');
    cloud(near, -8, 46, 22, 110, 'mid', 'cloud-b');
    cloud(near, 84, 40, 22, 120, 'mid', 'cloud-c');
    cloud(bank, -8, 30, 40, 150, 'bank', 'cloud-a');
    cloud(bank, 26, 44, 34, 130, 'bank', 'cloud-c');
    cloud(bank, 56, 26, 40, 160, 'bank', 'cloud-b');
    cloud(bank, 86, 38, 30, 140, 'bank', 'cloud-a');
    // the cloud the shoe floats above
    const pillow = stage.querySelector('.hs-pillow');
    cloud(pillow, 0, 34, 46, 90, 'pillow', 'cloud-b');
    cloud(pillow, 30, 10, 44, 120, 'pillow', 'cloud-a');
    cloud(pillow, 56, 30, 44, 96, 'pillow', 'cloud-c');
  })();

  /* ---------- Slides ---------- */
  shoeWrap.innerHTML = shoes.map((s, i) => `
    <figure class="hs-shoe${i === 0 ? ' is-on' : ''}" style="--tilt:${s.hero.tilt || -8}deg">
      <div class="bob"><img src="${esc(s.hero.image)}" alt="${esc(s.name)}" ${i ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async"></div>
    </figure>`).join('');
  dotsEl.innerHTML = shoes.map((s, i) => `<button type="button" class="hs-dot${i === 0 ? ' is-on' : ''}" data-i="${i}" aria-label="Show ${esc(s.name)}"></button>`).join('');

  const slides = [...shoeWrap.children];
  const dots = [...dotsEl.children];
  let current = 0, timer = 0, playing = !reduceMotion, visible = true, busy = false;

  function wordHTML(word) {
    return [...word].map((ch, i) => `<span style="--k:${i}">${esc(ch)}</span>`).join('');
  }

  function setWord(word, animate) {
    const old = wordEl.querySelector('.w');
    const next = document.createElement('span');
    next.className = 'w';
    next.style.setProperty('--len', word.length);
    next.innerHTML = wordHTML(word);
    if (!animate) {
      if (old) old.remove();
      next.classList.add('is-in');
      wordEl.appendChild(next);
      return;
    }
    if (old) { old.classList.remove('is-in'); old.classList.add('is-out'); setTimeout(() => old.remove(), 420); }
    // the new word starts once the old one has cleared
    setTimeout(() => {
      wordEl.appendChild(next);
      requestAnimationFrame(() => requestAnimationFrame(() => next.classList.add('is-in')));
    }, old ? 300 : 0);
  }

  function setText(i) {
    const s = shoes[i];
    [nameEl, catEl].forEach(el => el.classList.remove('is-in'));
    void nameEl.offsetWidth;
    nameEl.textContent = s.name;
    catEl.textContent = s.tags.map(t => TAGS[t]).filter(Boolean).slice(0, 2).join(' · ');
    [nameEl, catEl].forEach(el => el.classList.add('is-in'));
    dots.forEach((d, k) => { d.classList.toggle('is-on', k === i); d.setAttribute('aria-current', k === i); });
  }

  function go(i) {
    if (i === current || busy) return;
    busy = true;
    const prev = slides[current];
    prev.classList.remove('is-on'); prev.classList.add('is-out');
    slides[i].classList.add('is-on');
    setWord(shoes[i].hero.word, !reduceMotion);
    current = i;
    setText(i);
    setTimeout(() => { prev.classList.remove('is-out'); busy = false; schedule(); }, reduceMotion ? 0 : SWAP);
  }

  function schedule() {
    clearTimeout(timer);
    if (playing && visible && !document.hidden && shoes.length > 1) {
      timer = setTimeout(() => go((current + 1) % shoes.length), GAP);
    }
  }

  function setPlaying(on) {
    playing = on;
    stage.classList.toggle('is-paused', !on);
    schedule();
  }

  // Pauses while a visitor hovers over the hero or moves through it with the keyboard
  let held = false;
  const hold = on => { if (reduceMotion || held === on) return; held = on; setPlaying(!on); };
  stage.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') hold(true); });
  stage.addEventListener('pointerleave', () => hold(false));
  stage.addEventListener('focusin', () => hold(true));
  stage.addEventListener('focusout', e => { if (!stage.contains(e.relatedTarget)) hold(false); });
  dotsEl.addEventListener('click', e => {
    const d = e.target.closest('[data-i]');
    if (d) go(Number(d.dataset.i));
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(es => { visible = es[0].isIntersecting; schedule(); }, { threshold: .2 }).observe(stage);
  }
  document.addEventListener('visibilitychange', schedule);

  /* ---------- Depth: shoe, word and clouds drift with the pointer ---------- */
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const loop = () => {
      cx += (tx - cx) * .07; cy += (ty - cy) * .07;
      stage.style.setProperty('--mx', cx.toFixed(3));
      stage.style.setProperty('--my', cy.toFixed(3));
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > .001 ? requestAnimationFrame(loop) : 0;
    };
    stage.addEventListener('pointermove', e => {
      const r = stage.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width * 2 - 1;
      ty = (e.clientY - r.top) / r.height * 2 - 1;
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    stage.addEventListener('pointerleave', () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); });
  }

  setWord(shoes[0].hero.word, false);
  setText(0);
  setPlaying(playing);
  requestAnimationFrame(() => stage.classList.add('is-ready'));
})();
