/* Tutee Connect — Study in Mauritius, island edition.
   Interactions and animated canvas backgrounds for island.html and
   island-institutions.html. External file (not inline) so the site's CSP
   `script-src 'self'` holds. Lead-form behaviour mirrors assets/js/main.js §9
   and posts to the same /api/enquiry Netlify function. */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.remove('no-js');
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function onVisible(el, cb, opts) {
    if (!('IntersectionObserver' in window)) { cb(true); return null; }
    var io = new IntersectionObserver(function (entries) { entries.forEach(function (e) { cb(e.isIntersecting, e); }); }, opts || { threshold: 0 });
    io.observe(el);
    return io;
  }
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  /* ---------------------------------------------------------- nav */
  function initNav() {
    var nav = $('[data-nav]'), toggle = $('[data-nav-toggle]');
    if (!nav) return;
    var links = $$('[data-nav-links] a[href^="#"]');
    var sections = links.map(function (a) { return $(a.getAttribute('href')); });
    var ticking = false;
    function update() {
      ticking = false;
      var y = window.scrollY;
      nav.classList.toggle('scrolled', y > 24);
      var current = -1;
      sections.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < window.innerHeight * .4) current = i; });
      links.forEach(function (a, i) { a.classList.toggle('active', i === current); });
    }
    update();
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    if (toggle) {
      toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      });
      $$('[data-nav-links] a').forEach(function (a) {
        a.addEventListener('click', function () { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); });
      });
    }
  }

  /* ---------------------------------------------------------- reveal + counters */
  function initReveal() {
    var els = $$('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  function initCounters() {
    $$('[data-count]').forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      if (REDUCED || !target) return;
      var io = onVisible(el, function (vis) {
        if (!vis) return;
        if (io) io.disconnect();
        var start = performance.now(), dur = 1400;
        (function step(now) {
          var t = Math.min(1, (now - start) / dur);
          el.textContent = String(Math.round(target * ease(t)));
          if (t < 1) requestAnimationFrame(step);
        })(start);
      }, { threshold: .6 });
    });
  }

  /* ---------------------------------------------------------- ripples + parallax */
  function initRipple() {
    document.addEventListener('pointerdown', function (e) {
      var host = e.target.closest && e.target.closest('[data-ripple], .enquire');
      if (!host || REDUCED) return;
      var r = host.getBoundingClientRect(), size = Math.max(r.width, r.height) * 2.2;
      var s = document.createElement('span');
      s.className = 'ripple';
      s.style.width = s.style.height = size + 'px';
      s.style.left = (e.clientX - r.left - size / 2) + 'px';
      s.style.top = (e.clientY - r.top - size / 2) + 'px';
      host.appendChild(s);
      setTimeout(function () { s.remove(); }, 750);
    });
  }

  function initParallax() {
    if (REDUCED) return;
    $$('[data-parallax]').forEach(function (el) {
      var k = parseFloat(el.getAttribute('data-parallax')) || .2, active = true;
      onVisible(el.parentElement, function (v) { active = v; });
      window.addEventListener('scroll', function () {
        if (active) el.style.transform = 'translate3d(0,' + (window.scrollY * k).toFixed(1) + 'px,0)';
      }, { passive: true });
    });
  }

  /* ---------------------------------------------------------- bottles: the message comes out of the bottle */
  function initBottles() {
    var root = $('[data-bottles]'), stage = $('[data-msg-stage]');
    if (!root || !stage) return;
    var btns = $$('.bottle-btn', root), note = $('[data-note]', stage), hint = $('[data-msg-hint]', stage);
    var title = $('[data-note-title]', note), text = $('[data-note-text]', note), num = $('[data-note-num]', note);
    var open = -1, busy = false;
    function wait(ms) { return new Promise(function (r) { setTimeout(r, REDUCED ? 0 : ms); }); }
    function setU(from, to, ms) {
      return new Promise(function (res) {
        if (REDUCED) { note.style.setProperty('--u', to); res(); return; }
        var t0 = performance.now();
        (function step(now) {
          var t = Math.min(1, (now - t0) / ms), k = to > from ? 1 - Math.pow(1 - t, 3) : t * t;
          note.style.setProperty('--u', (from + (to - from) * k).toFixed(4));
          if (t < 1) requestAnimationFrame(step); else res();
        })(t0);
      });
    }
    function reset(b) { b.classList.remove('open', 'uncorked', 'emptied'); b.setAttribute('aria-pressed', 'false'); }

    async function pull(i) {
      if (busy || i === open) return;
      busy = true;
      var b = btns[i];
      if (open > -1) { await setU(1, 0, 320); note.hidden = true; reset(btns[open]); }
      open = i;
      b.setAttribute('aria-pressed', 'true');
      b.classList.add('open');
      await wait(380);
      b.classList.add('uncorked');
      await wait(260);

      // what the note will look like, so the scroll can fly straight to it
      title.textContent = b.getAttribute('data-title');
      text.textContent = b.getAttribute('data-text');
      num.textContent = 'Message ' + (i + 1) + ' of ' + btns.length;
      note.style.setProperty('--u', 0);
      note.hidden = false;
      stage.style.minHeight = note.offsetHeight + 'px';
      if (hint) hint.style.opacity = '0';
      var nr = note.getBoundingClientRect(), sv = b.querySelector('svg').getBoundingClientRect();
      var x0 = sv.left + sv.width / 2, y0 = sv.top + sv.height * .16;
      var x1 = nr.left + nr.width / 2, y1 = nr.top + nr.height / 2;
      var sy = Math.max(1, nr.height / 54);

      b.classList.add('emptied');
      if (!REDUCED) {
        var fly = document.createElement('div');
        fly.className = 'fly-scroll';
        document.body.appendChild(fly);
        var anim = fly.animate([
          { transform: 'translate(' + x0 + 'px,' + (y0 + 26) + 'px) scale(.5)', opacity: 0 },
          { transform: 'translate(' + x0 + 'px,' + (y0 - 34) + 'px) scale(1) rotate(-8deg)', opacity: 1, offset: .28 },
          { transform: 'translate(' + ((x0 + x1) / 2) + 'px,' + (Math.min(y0, y1) - 60) + 'px) scale(1.2) rotate(8deg)', offset: .62 },
          { transform: 'translate(' + x1 + 'px,' + y1 + 'px) scale(1.3,' + sy.toFixed(2) + ') rotate(0deg)', opacity: 1 }
        ], { duration: 1050, easing: 'cubic-bezier(.45,0,.2,1)', fill: 'forwards' });
        await anim.finished;
        fly.remove();
      }
      await setU(0, 1, 750);
      busy = false;
    }

    // clicking the open bottle again: the note rolls up, flies back into the neck and the cork goes back on
    async function putBack() {
      if (busy || open < 0) return;
      busy = true;
      var b = btns[open];
      var nr = note.getBoundingClientRect(), sv = b.querySelector('svg').getBoundingClientRect();
      var x1 = nr.left + nr.width / 2, y1 = nr.top + nr.height / 2;
      var x0 = sv.left + sv.width / 2, y0 = sv.top + sv.height * .16;
      await setU(1, 0, 520);
      note.hidden = true;
      if (!REDUCED) {
        var fly = document.createElement('div');
        fly.className = 'fly-scroll';
        document.body.appendChild(fly);
        var anim = fly.animate([
          { transform: 'translate(' + x1 + 'px,' + y1 + 'px) scale(1.2) rotate(0deg)', opacity: 1 },
          { transform: 'translate(' + ((x0 + x1) / 2) + 'px,' + (Math.min(y0, y1) - 60) + 'px) scale(1.1) rotate(-10deg)', offset: .45 },
          { transform: 'translate(' + x0 + 'px,' + (y0 - 34) + 'px) scale(.9) rotate(6deg)', opacity: 1, offset: .75 },
          { transform: 'translate(' + x0 + 'px,' + (y0 + 26) + 'px) scale(.45) rotate(0deg)', opacity: 0 }
        ], { duration: 950, easing: 'cubic-bezier(.45,0,.2,1)', fill: 'forwards' });
        await anim.finished;
        fly.remove();
      }
      b.classList.remove('emptied');
      await wait(300);
      b.classList.remove('uncorked');
      await wait(380);
      b.classList.remove('open');
      b.setAttribute('aria-pressed', 'false');
      stage.style.minHeight = '';
      if (hint) hint.style.opacity = '';
      open = -1;
      busy = false;
    }

    // hovering a bottle (mouse users) opens it, same as a click; a short pause stops a quick sweep across the row from opening every bottle
    var canHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var hoverI = -1, hoverT = 0;
    // moving the mouse off the open bottle puts its message back (it stays out while the pointer is on the note itself)
    var overNote = false, closeT = 0;
    function tryClose() {
      if (open < 0 || hoverI === open || overNote) return;
      if (busy) { closeT = setTimeout(tryClose, 150); return; }
      putBack();
    }
    if (canHover) {
      note.addEventListener('mouseenter', function () { overNote = true; clearTimeout(closeT); });
      note.addEventListener('mouseleave', function () { overNote = false; clearTimeout(closeT); closeT = setTimeout(tryClose, 400); });
    }
    function tryHover() { if (hoverI < 0 || hoverI === open) return; if (busy) { hoverT = setTimeout(tryHover, 150); return; } pull(hoverI); }

    btns.forEach(function (b, i) {
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () { clearTimeout(hoverT); if (i === open) putBack(); else pull(i); });
      if (canHover) {
        b.addEventListener('mouseenter', function () { hoverI = i; clearTimeout(hoverT); hoverT = setTimeout(tryHover, 160); });
        b.addEventListener('mouseleave', function () { if (hoverI === i) hoverI = -1; clearTimeout(hoverT); clearTimeout(closeT); closeT = setTimeout(tryClose, 400); });
      }
    });
  }

  /* ---------------------------------------------------------- 02 route: a tide line drawn by your scroll */
  function initTide() {
    var tide = $('[data-tide]');
    if (!tide) return;
    var svg = $('.tide-svg', tide), line = $('[data-tide-line]', tide), ghost = $('[data-tide-ghost]', tide), boat = $('[data-tide-boat]', tide);
    var stops = $$('.tstop', tide), dots = stops.map(function (st) { return $('.tdot', st); });
    var table = [], total = 0, dotLen = [], curL = 0, targetL = 0, raf = 0;

    function layout() {
      var tr = tide.getBoundingClientRect(), w = tr.width, h = tr.height;
      svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      var pts = dots.map(function (d) { var r = d.getBoundingClientRect(); return { x: r.left + r.width / 2 - tr.left, y: r.top + r.height / 2 - tr.top }; });
      var sway = w > 860 ? Math.min(90, w * .07) : 16;
      var d = 'M' + pts[0].x + ' 0 C' + pts[0].x + ' ' + (pts[0].y * .5) + ' ' + pts[0].x + ' ' + (pts[0].y * .5) + ' ' + pts[0].x + ' ' + pts[0].y;
      for (var i = 1; i < pts.length; i++) {
        var a = pts[i - 1], b = pts[i], dy = b.y - a.y, s = i % 2 ? sway : -sway;
        d += ' C' + (a.x + s) + ' ' + (a.y + dy * .45) + ' ' + (b.x + s) + ' ' + (b.y - dy * .45) + ' ' + b.x + ' ' + b.y;
      }
      var last = pts[pts.length - 1];
      d += ' C' + last.x + ' ' + (last.y + 40) + ' ' + last.x + ' ' + (h - 20) + ' ' + last.x + ' ' + h;
      line.setAttribute('d', d); ghost.setAttribute('d', d);
      total = line.getTotalLength();
      line.style.strokeDasharray = total + ' ' + total;
      table = [];
      for (var k = 0, n = 240; k <= n; k++) { var L = total * k / n; table.push([L, line.getPointAtLength(L).y]); }
      dotLen = pts.map(function (p) { return lenAtY(p.y); });
      measure(); curL = targetL; paint();
    }
    function lenAtY(y) {
      if (!table.length) return 0;
      if (y <= table[0][1]) return 0;
      for (var i = 1; i < table.length; i++) {
        if (table[i][1] >= y) { var a = table[i - 1], b = table[i], t = (y - a[1]) / Math.max(1e-6, b[1] - a[1]); return a[0] + (b[0] - a[0]) * t; }
      }
      return total;
    }
    function measure() {
      var tr = tide.getBoundingClientRect();
      targetL = lenAtY(window.innerHeight * .58 - tr.top);
      stops.forEach(function (st) { if (st.getBoundingClientRect().top < window.innerHeight * .85) st.classList.add('near'); });
    }
    function paint() {
      line.style.strokeDashoffset = (total - curL).toFixed(1);
      var p = line.getPointAtLength(Math.max(0, curL)), q = line.getPointAtLength(Math.min(total, curL + 2));
      var ang = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI - 90;
      boat.style.transform = 'translate(' + p.x.toFixed(1) + 'px,' + p.y.toFixed(1) + 'px) rotate(' + (ang * .35).toFixed(1) + 'deg)';
      boat.style.opacity = curL > 4 && curL < total - 4 ? '1' : '0';
      stops.forEach(function (st, i) { st.classList.toggle('passed', curL >= dotLen[i] - 2); });
    }
    function tick() {
      raf = 0;
      var d = targetL - curL;
      if (Math.abs(d) > .5 && !REDUCED) { curL += d * .16; raf = requestAnimationFrame(tick); } else curL = targetL;
      paint();
    }
    function onScroll() { measure(); if (!raf) raf = requestAnimationFrame(tick); }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () { requestAnimationFrame(layout); });
    if ('ResizeObserver' in window) new ResizeObserver(function () { layout(); }).observe(tide);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
    layout();
  }

  /* ---------------------------------------------------------- 04 register: find your fit */
  function initFit() {
    var root = $('[data-fit]');
    if (!root) return;
    var chips = $$('.fit-chip', root), count = $('[data-fit-count]', root), label = $('[data-fit-label]', root), names = $('[data-fit-names]', root), link = $('[data-fit-link]', root);
    var shown = 0;
    function esc(t) { return t.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }
    function pick(c) {
      chips.forEach(function (x) { x.classList.toggle('on', x === c); });
      var n = +c.getAttribute('data-n'), list = JSON.parse(c.getAttribute('data-names')), subj = c.getAttribute('data-subject');
      var from = shown, t0 = performance.now();
      (function step(now) { var t = REDUCED ? 1 : Math.min(1, (now - t0) / 500); shown = Math.round(from + (n - from) * t); count.textContent = shown; if (t < 1) requestAnimationFrame(step); })(t0);
      label.textContent = (n === 1 ? 'institution teaches ' : 'institutions teach ') + subj;
      names.innerHTML = list.map(function (x, i) { return '<li style="animation-delay:' + i * 60 + 'ms">' + esc(x) + '</li>'; }).join('') + (n > list.length ? '<li class="more" style="animation-delay:180ms">and ' + (n - list.length) + ' more</li>' : '');
      link.firstChild.textContent = 'See all ' + n + ' in the directory ';
      link.setAttribute('data-subject', subj);
    }
    chips.forEach(function (c) { c.addEventListener('click', function () { pick(c); }); });
    // hand the chosen subject to the directory page
    link.addEventListener('click', function () { try { localStorage.setItem('dirSubject', link.getAttribute('data-subject') || ''); } catch (e) { /* storage unavailable */ } });
    if (chips[0]) pick(chips[0]);
  }

  /* ---------------------------------------------------------- 05 reviews: spotlight + drifting notes */
  function initSpotlight() {
    var spot = $('[data-spotlight]');
    if (!spot) return;
    var notes = [], seen = {};
    $$('.lantern').forEach(function (l) { var k = l.getAttribute('data-r'); if (!seen[k]) { seen[k] = 1; notes[+k] = l; } });
    var q = $('[data-spot-quote]', spot), nm = $('[data-spot-name]', spot), role = $('[data-spot-role]', spot), av = $('[data-spot-av]', spot), count = $('[data-spot-count]', spot);
    var cur = 0, timer = 0, n = notes.length;
    function pad(x) { return (x < 10 ? '0' : '') + x; }
    function show(i) {
      cur = (i + n) % n;
      var l = notes[cur];
      spot.classList.add('swap');
      setTimeout(function () {
        q.textContent = l.getAttribute('data-q'); nm.textContent = l.getAttribute('data-n');
        role.textContent = l.getAttribute('data-role'); av.textContent = l.getAttribute('data-i');
        count.textContent = pad(cur + 1) + ' / ' + pad(n);
        spot.classList.remove('swap');
      }, REDUCED ? 0 : 320);
    }
    function auto() { clearInterval(timer); if (!REDUCED) timer = setInterval(function () { show(cur + 1); }, 6500); }
    $('[data-spot-prev]', spot).addEventListener('click', function () { show(cur - 1); auto(); });
    $('[data-spot-next]', spot).addEventListener('click', function () { show(cur + 1); auto(); });
    document.addEventListener('click', function (e) { var l = e.target.closest && e.target.closest('.lantern'); if (l) { show(+l.getAttribute('data-r')); auto(); spot.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'center' }); } });
    onVisible(spot, function (v) { if (v) auto(); else clearInterval(timer); });
  }

  /* ---------------------------------------------------------- 06 FAQ: a deck of question cards */
  function initDeck() {
    var deck = $('[data-deck]');
    if (!deck) return;
    var cards = $$('.qcard', deck), n = cards.length, top = 0;
    var list = $$('[data-deck-list] button');
    function layout() {
      cards.forEach(function (c, i) {
        var k = (i - top + n) % n; // 0 = top of the pile
        c.style.zIndex = String(n - k);
        c.style.transform = k === 0 ? '' : 'translateY(' + (k * 16) + 'px) scale(' + (1 - k * .05) + ') rotate(' + (k % 2 ? 3 : -3) * Math.min(k, 2) / 2 + 'deg)';
        c.style.opacity = k > 3 ? '0' : '1';
        c.setAttribute('aria-hidden', k === 0 ? 'false' : 'true');
        if (k !== 0) c.classList.remove('flipped');
      });
      list.forEach(function (b, i) { b.classList.toggle('on', i === top); });
    }
    function go(i, dir) {
      var leaving = cards[top];
      if (!REDUCED && i !== top) {
        leaving.style.transition = 'transform .5s cubic-bezier(.5,0,.75,0), opacity .5s ease';
        leaving.style.transform = 'translate(' + (dir < 0 ? 120 : -120) + '%, -6%) rotate(' + (dir < 0 ? 18 : -18) + 'deg)';
        leaving.style.opacity = '0';
        setTimeout(function () { leaving.style.transition = ''; top = (i + n) % n; layout(); }, 380);
      } else { top = (i + n) % n; layout(); }
    }
    function flip() { cards[top].classList.toggle('flipped'); }
    $('[data-deck-next]').addEventListener('click', function () { go(top + 1, 1); });
    $('[data-deck-prev]').addEventListener('click', function () { go(top - 1, -1); });
    $('[data-deck-flip]').addEventListener('click', flip);
    list.forEach(function (b, i) { b.addEventListener('click', function () { if (i !== top) go(i, i > top ? 1 : -1); else flip(); }); });

    // tap to flip, swipe to deal the next card
    var sx = 0, sy = 0, dx = 0, down = false, moved = false;
    deck.addEventListener('pointerdown', function (e) { var c = e.target.closest('.qcard'); if (c !== cards[top]) return; down = true; moved = false; sx = e.clientX; sy = e.clientY; dx = 0; c.classList.add('dragging'); });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      dx = e.clientX - sx;
      if (Math.abs(dx) > 6) moved = true;
      if (moved) cards[top].style.transform = 'translateX(' + dx + 'px) rotate(' + dx / 18 + 'deg)';
    });
    window.addEventListener('pointerup', function () {
      if (!down) return;
      down = false;
      var c = cards[top]; c.classList.remove('dragging');
      if (!moved) { flip(); return; }
      if (Math.abs(dx) > 90) go(top + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1); else layout();
    });
    deck.setAttribute('tabindex', '0');
    deck.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { go(top + 1, 1); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { go(top - 1, -1); e.preventDefault(); }
      if (e.key === 'Enter' || e.key === ' ') { flip(); e.preventDefault(); }
    });
    layout();
  }

  /* ---------------------------------------------------------- 06 contact: the postcard signs itself and flips when sent */
  function initDesk() {
    var form = $('[data-desk]');
    if (!form) return;
    var name = $('#f-name', form), email = $('#f-email', form), phone = $('#f-phone', form);
    var tideEl = $('[data-tide-fill]', form), count = $('[data-desk-count]', form), send = $('.desk-send', form);
    var bf = {}; $$('[data-bf]', form).forEach(function (el) { bf[el.getAttribute('data-bf')] = { el: el, def: el.textContent, last: '' }; });
    function say(key, val) {
      var b = bf[key], txt = val || b.def;
      if (txt === b.last) return;
      b.last = txt; b.el.textContent = txt; b.el.classList.toggle('set', !!val);
      if (val && !REDUCED) { b.el.classList.remove('flash'); void b.el.offsetWidth; b.el.classList.add('flash'); }
    }
    // the dark fill spreads from wherever the option was pressed
    $$('.opt', form).forEach(function (o) {
      o.addEventListener('pointerdown', function (e) {
        var r = o.getBoundingClientRect(), sp = $('span', o);
        sp.style.setProperty('--x', (e.clientX - r.left) + 'px'); sp.style.setProperty('--y', (e.clientY - r.top) + 'px');
      });
    });
    function check() {
      var lvl = $('input[name="study_level"]:checked', form), itk = $('input[name="intake"]:checked', form);
      var nm = name.value.trim();
      var ok = {
        name: nm.length >= 2,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()),
        phone: /^[0-9]{7,15}$/.test(phone.value.replace(/\D/g, ''))
      };
      say('name', ok.name ? nm.split(/\s+/)[0] : '');
      say('level', lvl ? lvl.getAttribute('data-say') : '');
      say('intake', itk ? itk.getAttribute('data-say') : '');
      name.closest('.fl').classList.toggle('ok', ok.name);
      email.closest('.fl').classList.toggle('ok', ok.email);
      phone.closest('.fl').classList.toggle('ok', ok.phone);
      var n = (ok.name ? 1 : 0) + (ok.email ? 1 : 0) + (ok.phone ? 1 : 0) + (lvl ? 1 : 0) + (itk ? 1 : 0);
      count.textContent = n; tideEl.style.setProperty('--p', n / 5);
      send.classList.toggle('ready', n === 5);
    }
    form.addEventListener('input', check);
    form.addEventListener('change', check);
    form.addEventListener('reset', function () { setTimeout(check, 0); });
    $('[data-desk-again]', form).addEventListener('click', function () {
      form.reset(); form.classList.remove('sent');
      setTimeout(function () { name.focus({ preventScroll: true }); }, 500);
    });
    // the Mauritius clip only plays while the desk is on screen
    var vid = $('[data-desk-video]', form);
    if (vid && !REDUCED) onVisible(form, function (v) {
      if (v) { if (vid.preload === 'none') { vid.preload = 'auto'; vid.load(); } var pr = vid.play(); if (pr && pr.catch) pr.catch(function () {}); }
      else vid.pause();
    }, { rootMargin: '200px 0px' });
    check();
  }

  /* ---------------------------------------------------------- animated canvas backgrounds */
  var painters = {
    // Sunlight caustics on a lagoon floor: a cheap iterative pattern on a small buffer, scaled up smoothly.
    caustics: function (cv, ctx) {
      var img = null, W = 0, H = 0;
      var alpha = parseFloat(cv.getAttribute('data-alpha') || '0.7');
      return {
        lowres: 12, // backing store is 1/12 of the display size; the browser smooths the upscale
        resize: function (w, h) {
          W = cv.width; H = cv.height;
          img = ctx.createImageData(W, H);
        },
        draw: function (t) {
          var d = img.data, time = t * .0003 + 23, ar = (W / H) * .6;
          for (var y = 0; y < H; y++) {
            var py = (y / H) * 10.05 - 250;
            for (var x = 0; x < W; x++) {
              var px = (x / W) * 10.05 * ar - 250;
              var ix = px, iy = py, c = 1;
              for (var n = 0; n < 3; n++) {
                var tt = time * (1 - (3.5 / (n + 1)));
                var nx = px + Math.cos(tt - ix) + Math.sin(tt + iy);
                var ny = py + Math.sin(tt - iy) + Math.cos(tt + ix);
                ix = nx; iy = ny;
                var a = px * Math.sin(ix + tt) * 200, b = py * Math.cos(iy + tt) * 200;
                c += 1 / Math.sqrt(a * a + b * b);
              }
              c /= 3; c = 1.17 - Math.pow(c, 1.4);
              var v = Math.pow(Math.abs(c), 8);
              var o = (y * W + x) * 4;
              d[o] = d[o + 1] = d[o + 2] = 255; d[o + 3] = v * 255 * alpha;
            }
          }
          ctx.putImageData(img, 0, 0);
        },
        fps: 24
      };
    },

    // Bioluminescent plankton that drifts and lights up / scatters around the pointer.
    plankton: function (cv, ctx) {
      var parts = [], mouse = { x: -999, y: -999 }, sprite = document.createElement('canvas');
      sprite.width = sprite.height = 32;
      var sc = sprite.getContext('2d'), g = sc.createRadialGradient(16, 16, 0, 16, 16, 16);
      g.addColorStop(0, 'rgba(190,255,248,1)'); g.addColorStop(.35, 'rgba(111,216,207,.6)'); g.addColorStop(1, 'rgba(31,181,176,0)');
      sc.fillStyle = g; sc.fillRect(0, 0, 32, 32);
      window.addEventListener('pointermove', function (e) { var r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; }, { passive: true });
      document.addEventListener('pointerleave', function () { mouse.x = mouse.y = -999; });
      return {
        resize: function (w, h) {
          var n = Math.min(150, Math.round(w * h / 9000));
          parts = [];
          for (var i = 0; i < n; i++) parts.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .2, vy: -Math.random() * .25 - .05, r: Math.random() * 2.2 + .8, ph: Math.random() * 6.28, glow: 0 });
        },
        draw: function (t, w, h) {
          ctx.clearRect(0, 0, w, h);
          ctx.globalCompositeOperation = 'lighter';
          for (var i = 0; i < parts.length; i++) {
            var p = parts[i], dx = p.x - mouse.x, dy = p.y - mouse.y, dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 130) { var f = (130 - dist) / 130; p.vx += dx / dist * f * .35; p.vy += dy / dist * f * .35; p.glow = Math.min(1, p.glow + f * .2); }
            p.glow *= .97; p.vx *= .96; p.vy = p.vy * .96 - .004;
            p.x += p.vx + Math.sin(t * .0006 + p.ph) * .15; p.y += p.vy;
            if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
            if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10;
            var tw = .35 + .3 * Math.sin(t * .002 + p.ph) + p.glow * .8, s = p.r * (4 + p.glow * 5);
            ctx.globalAlpha = Math.max(0, Math.min(1, tw));
            ctx.drawImage(sprite, p.x - s, p.y - s, s * 2, s * 2);
          }
          ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
        },
        fps: 60
      };
    },

    // Depth contours, like a nautical chart, slowly shifting; the pointer raises a seamount under it.
    contours: function (cv, ctx) {
      var perm = new Uint8Array(512), cell = 18, cols = 0, rows = 0, vals = null, mouse = { x: -9999, y: -9999, sx: -9999, sy: -9999 };
      for (var i = 0; i < 256; i++) perm[i] = i;
      for (i = 255; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t0 = perm[i]; perm[i] = perm[j]; perm[j] = t0; }
      for (i = 0; i < 256; i++) perm[i + 256] = perm[i];
      function fade(t) { return t * t * (3 - 2 * t); }
      function hash(x, y) { return perm[(perm[x & 255] + y) & 511] / 255; }
      function noise(x, y) {
        var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = fade(xf), v = fade(yf);
        var a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
        return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
      }
      window.addEventListener('pointermove', function (e) { var r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; }, { passive: true });
      var LEVELS = 14;
      return {
        resize: function (w, h) { cols = Math.ceil(w / cell) + 1; rows = Math.ceil(h / cell) + 1; vals = new Float32Array(cols * rows); },
        draw: function (t, w, h) {
          if (mouse.sx < -9000) { mouse.sx = mouse.x; mouse.sy = mouse.y; }
          mouse.sx += (mouse.x - mouse.sx) * .08; mouse.sy += (mouse.y - mouse.sy) * .08;
          var tt = t * .00004, x, y, k;
          for (y = 0; y < rows; y++) for (x = 0; x < cols; x++) {
            var px = x * cell, py = y * cell;
            var n = noise(px * .0032 + tt, py * .0032 - tt * .6) * .7 + noise(px * .008 - tt * 1.3, py * .008 + tt) * .3;
            var dx = px - mouse.sx, dy = py - mouse.sy;
            n += .42 * Math.exp(-(dx * dx + dy * dy) / 26000);
            vals[y * cols + x] = n;
          }
          ctx.clearRect(0, 0, w, h);
          ctx.lineJoin = 'round';
          for (var L = 1; L < LEVELS; L++) {
            var iso = L / LEVELS * 1.3;
            ctx.beginPath();
            for (y = 0; y < rows - 1; y++) for (x = 0; x < cols - 1; x++) {
              var i0 = y * cols + x, a = vals[i0], b = vals[i0 + 1], c = vals[i0 + cols + 1], d = vals[i0 + cols];
              var idx = (a > iso ? 8 : 0) | (b > iso ? 4 : 0) | (c > iso ? 2 : 0) | (d > iso ? 1 : 0);
              if (idx === 0 || idx === 15) continue;
              var X = x * cell, Y = y * cell;
              var top = X + cell * (iso - a) / (b - a), right = Y + cell * (iso - b) / (c - b);
              var bot = X + cell * (iso - d) / (c - d), left = Y + cell * (iso - a) / (d - a);
              switch (idx) {
                case 1: case 14: ctx.moveTo(X, left); ctx.lineTo(bot, Y + cell); break;
                case 2: case 13: ctx.moveTo(bot, Y + cell); ctx.lineTo(X + cell, right); break;
                case 3: case 12: ctx.moveTo(X, left); ctx.lineTo(X + cell, right); break;
                case 4: case 11: ctx.moveTo(top, Y); ctx.lineTo(X + cell, right); break;
                case 5: ctx.moveTo(X, left); ctx.lineTo(top, Y); ctx.moveTo(bot, Y + cell); ctx.lineTo(X + cell, right); break;
                case 6: case 9: ctx.moveTo(top, Y); ctx.lineTo(bot, Y + cell); break;
                case 7: case 8: ctx.moveTo(X, left); ctx.lineTo(top, Y); break;
                case 10: ctx.moveTo(top, Y); ctx.lineTo(X + cell, right); ctx.moveTo(X, left); ctx.lineTo(bot, Y + cell); break;
              }
            }
            var major = L % 4 === 0;
            ctx.strokeStyle = major ? 'rgba(255,214,140,.30)' : 'rgba(214,246,241,.16)';
            ctx.lineWidth = major ? 1.6 : 1;
            ctx.stroke();
          }
        },
        fps: 30
      };
    },

    // Bubbles rising through a reef; the pointer nudges them and pops any it touches.
    bubbles: function (cv, ctx) {
      var bs = [], pops = [], mouse = { x: -999, y: -999 }, W = 0, H = 0;
      window.addEventListener('pointermove', function (e) { var r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; }, { passive: true });
      function make(y) { var r = 3 + Math.pow(Math.random(), 2) * 16; return { x: Math.random() * W, y: y == null ? H + r + Math.random() * 200 : y, r: r, v: .35 + r * .045 + Math.random() * .3, ph: Math.random() * 6.28, vx: 0 }; }
      function pop(b) { for (var k = 0; k < 7; k++) { var an = k / 7 * 6.28; pops.push({ x: b.x, y: b.y, vx: Math.cos(an) * (1 + b.r * .08), vy: Math.sin(an) * (1 + b.r * .08), life: 1 }); } pops.push({ ring: true, x: b.x, y: b.y, r: b.r, life: 1 }); }
      return {
        resize: function (w, h) { W = w; H = h; var n = Math.min(70, Math.round(w * h / 22000)); bs = []; for (var i = 0; i < n; i++) bs.push(make(Math.random() * h)); },
        draw: function (t, w, h) {
          ctx.clearRect(0, 0, w, h);
          for (var i = 0; i < bs.length; i++) {
            var b = bs[i], dx = b.x - mouse.x, dy = b.y - mouse.y, d = Math.sqrt(dx * dx + dy * dy);
            if (d < b.r + 4) { pop(b); bs[i] = make(); continue; }
            if (d < b.r + 70) b.vx += (dx / d) * .25;
            b.vx *= .94;
            b.y -= b.v; b.x += Math.sin(t * .002 + b.ph) * .35 + b.vx;
            if (b.y < -b.r - 10) { bs[i] = make(); continue; }
            ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 6.283);
            ctx.fillStyle = 'rgba(214,246,241,.06)'; ctx.fill();
            ctx.strokeStyle = 'rgba(214,246,241,.45)'; ctx.lineWidth = 1.2; ctx.stroke();
            ctx.beginPath(); ctx.arc(b.x - b.r * .35, b.y - b.r * .35, b.r * .28, 0, 6.283);
            ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fill();
          }
          for (i = pops.length - 1; i >= 0; i--) {
            var p = pops[i]; p.life -= .045;
            if (p.life <= 0) { pops.splice(i, 1); continue; }
            ctx.globalAlpha = p.life;
            if (p.ring) { ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (2 - p.life), 0, 6.283); ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 1.5; ctx.stroke(); }
            else { p.x += p.vx; p.y += p.vy; ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, 6.283); ctx.fillStyle = '#fff'; ctx.fill(); }
          }
          ctx.globalAlpha = 1;
        },
        fps: 60
      };
    },

    // Sun glints: soft, small points of light on the water, kept clear of the text column.
    sparkle: function (cv, ctx) {
      var glints = [], density = parseFloat(cv.getAttribute('data-density') || '1'), xMin = parseFloat(cv.getAttribute('data-xmin') || '0');
      function spawn(w, h) { var x0 = w > 860 ? xMin : 0; return { x: w * (x0 + Math.random() * (1 - x0)), y: h * (.55 + Math.random() * .4), life: 0, max: 30 + Math.random() * 50, s: .6 + Math.random() * 1.2 }; }
      return {
        resize: function (w, h) { glints = []; var n = Math.round(w * h / 30000 * density); for (var i = 0; i < n; i++) { var g = spawn(w, h); g.life = Math.random() * g.max; glints.push(g); } },
        draw: function (t, w, h) {
          ctx.clearRect(0, 0, w, h);
          for (var i = 0; i < glints.length; i++) {
            var g = glints[i]; g.life++;
            if (g.life > g.max) { glints[i] = spawn(w, h); continue; }
            var a = Math.sin(g.life / g.max * Math.PI);
            ctx.globalAlpha = a * .7;
            var grd = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.s * 5);
            grd.addColorStop(0, 'rgba(255,250,225,1)'); grd.addColorStop(1, 'rgba(255,250,225,0)');
            ctx.fillStyle = grd;
            ctx.fillRect(g.x - g.s * 5, g.y - g.s * 5, g.s * 10, g.s * 10);
            ctx.globalAlpha = a * .45;
            ctx.fillStyle = '#fffbe8';
            ctx.fillRect(g.x - g.s * 6, g.y - .5, g.s * 12, 1);
          }
          ctx.globalAlpha = 1;
        },
        fps: 30
      };
    }
  };

  function initCanvases() {
    $$('canvas[data-bg]').forEach(function (cv) {
      var make = painters[cv.getAttribute('data-bg')];
      var ctx = cv.getContext && cv.getContext('2d');
      if (!make || !ctx) return;
      var p = make(cv, ctx), w = 0, h = 0, running = false, raf = 0, last = 0;
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      function size() {
        var r = cv.getBoundingClientRect();
        w = Math.max(1, Math.round(r.width)); h = Math.max(1, Math.round(r.height));
        if (p.lowres) { cv.width = Math.max(24, Math.ceil(w / p.lowres)); cv.height = Math.max(16, Math.ceil(h / p.lowres)); }
        else { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
        p.resize(w, h);
        if (!running) p.draw(performance.now(), w, h);
      }
      function loop(now) {
        if (!running) return;
        raf = requestAnimationFrame(loop);
        if (now - last < 1000 / (p.fps || 30)) return;
        last = now;
        p.draw(now, w, h);
      }
      size();
      if ('ResizeObserver' in window) new ResizeObserver(size).observe(cv);
      else window.addEventListener('resize', size);
      if (REDUCED) return;
      var inView = false;
      function sync() {
        var layer = cv.closest('.layer');
        var want = inView && !document.hidden && (!layer || layer.classList.contains('live'));
        if (want && !running) { running = true; raf = requestAnimationFrame(loop); }
        else if (!want && running) { running = false; cancelAnimationFrame(raf); }
      }
      onVisible(cv, function (vis) { inView = vis; sync(); });
      document.addEventListener('visibilitychange', sync);
      document.addEventListener('stage:change', sync);
    });
  }


  /* ---------------------------------------------------------- STAGE: one fixed, morphing background */
  var SCENES = {
    lagoon: '<span class="mesh m1"></span><span class="mesh m2"></span><span class="mesh m3"></span><span class="mesh m4"></span><span class="spot"></span><span class="grain"></span>',
    chart: '<canvas data-bg="contours"></canvas><span class="coords">20°17′S · 57°33′E · MAURITIUS</span><span class="grain"></span>',
    shore: '<span class="leak l1"></span><span class="leak l2"></span><div class="leaves"><span class="leaf f1"></span><span class="leaf f2"></span><span class="leaf f3"></span></div><span class="grain"></span>',
    reef: '<div class="rays"></div><canvas data-bg="bubbles"></canvas>',
    dunes: '<div class="halo"></div>' +
      '<div class="dune d1"><svg viewBox="0 0 1440 300" preserveAspectRatio="none"><path d="M0 120 C200 40 420 30 640 110 S1100 200 1440 80 V300 H0Z" fill="#f2c6b4"/></svg></div>' +
      '<div class="dune d2"><svg viewBox="0 0 1440 300" preserveAspectRatio="none"><path d="M0 160 C260 70 520 120 760 150 S1180 60 1440 140 V300 H0Z" fill="#eab09c"/></svg></div>' +
      '<div class="dune d3"><svg viewBox="0 0 1440 300" preserveAspectRatio="none"><path d="M0 170 C300 110 560 200 860 160 S1260 110 1440 170 V300 H0Z" fill="#e39f86"/></svg></div><span class="grain"></span>',
    lanterns: '<div class="lt-stars"></div><div class="lt-moon"></div><div class="lt-sea"></div><div data-lanterns></div>',
    horizon: '<div class="h-sun"></div><div class="cloud c1"></div><div class="cloud c2"></div><div class="cloud c3"></div>' +
      '<div class="jet"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg></div><div class="h-sea"></div><span class="grain"></span>'
  };

  function initStage() {
    var sections = $$('[data-stage]');
    if (!sections.length) return;
    var stage = document.createElement('div');
    stage.className = 'stage'; stage.setAttribute('aria-hidden', 'true');
    var names = [], layers = {}, cur = {}, target = {};
    sections.forEach(function (s) { var n = s.getAttribute('data-stage'); if (names.indexOf(n) < 0) names.push(n); });
    names.forEach(function (n) {
      var el = document.createElement('div');
      el.className = 'layer layer-' + n; el.innerHTML = SCENES[n] || '';
      stage.appendChild(el); layers[n] = el; cur[n] = 0; target[n] = 0;
    });
    var lw = $('[data-lanterns]', stage);
    if (lw) {
      var h = '';
      for (var li = 0; li < 14; li++) h += '<span class="lantern-glow" style="left:' + (4 + Math.random() * 92).toFixed(1) + '%;animation-delay:-' + (Math.random() * 22).toFixed(1) + 's;animation-duration:' + (18 + Math.random() * 12).toFixed(1) + 's;scale:' + (.6 + Math.random() * .7).toFixed(2) + '"></span>';
      lw.innerHTML = h;
    }
    document.body.insertBefore(stage, document.body.firstChild);
    names.forEach(function (n) { cur[n] = target[n] = 0; });

    // Which scene(s) fill the middle of the screen right now? Blend between them in proportion.
    function measure() {
      var vh = window.innerHeight, b0 = vh * .1, b1 = vh * .9, total = 0, w = {};
      names.forEach(function (n) { w[n] = 0; });
      sections.forEach(function (s) {
        var r = s.getBoundingClientRect();
        var ov = Math.max(0, Math.min(r.bottom, b1) - Math.max(r.top, b0));
        if (ov > 0) { w[s.getAttribute('data-stage')] += ov; total += ov; }
      });
      if (total === 0) {
        // Above the first scene (hero) or below the last (footer): hold the nearest one.
        var first = sections[0].getBoundingClientRect().top > vh * .5;
        w[(first ? sections[0] : sections[sections.length - 1]).getAttribute('data-stage')] = total = 1;
      }
      names.forEach(function (n) { target[n] = w[n] / total; });
    }

    var raf = 0, lastT = 0;
    function tick(now) {
      raf = 0;
      var dt = lastT ? Math.min(100, now - lastT) : 16; lastT = now;
      var k = REDUCED ? 1 : 1 - Math.exp(-dt / 180); // time-based easing: same feel at any frame rate
      var moving = false, changed = false;
      names.forEach(function (n) {
        var d = target[n] - cur[n];
        if (Math.abs(d) > .002) { cur[n] += d * k; moving = true; } else cur[n] = target[n];
        layers[n].style.opacity = cur[n].toFixed(3);
        var live = cur[n] > .01;
        if (live !== layers[n].classList.contains('live')) { layers[n].classList.toggle('live', live); changed = true; }
      });
      if (changed) document.dispatchEvent(new CustomEvent('stage:change'));
      if (moving) raf = requestAnimationFrame(tick); else lastT = 0;
    }
    function kick() { measure(); if (!raf) raf = requestAnimationFrame(tick); }
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);
    kick();

    // Pointer: a lagging spotlight on the lagoon, gentle parallax on the shore and dunes.
    if (REDUCED) return;
    var mx = window.innerWidth / 2, my = window.innerHeight * .4, sx = mx, sy = my, praf = 0;
    function follow() {
      sx += (mx - sx) * .09; sy += (my - sy) * .09;
      stage.style.setProperty('--sx', sx.toFixed(1) + 'px');
      stage.style.setProperty('--sy', sy.toFixed(1) + 'px');
      stage.style.setProperty('--px', ((mx / window.innerWidth) * 2 - 1).toFixed(3));
      stage.style.setProperty('--py', ((my / window.innerHeight) * 2 - 1).toFixed(3));
      praf = (Math.abs(mx - sx) + Math.abs(my - sy) > .5) ? requestAnimationFrame(follow) : 0;
    }
    window.addEventListener('pointermove', function (e) { mx = e.clientX; my = e.clientY; if (!praf) praf = requestAnimationFrame(follow); }, { passive: true });
  }

  /* ---------------------------------------------------------- section dots */
  function initCompass(secs) {
    var n = secs.length, SVGNS = 'http://www.w3.org/2000/svg';
    function ang(i) { return -90 - i * (90 / (n - 1)); }           // up (first) -> left (last)
    var nav = document.createElement('nav');
    nav.className = 'cmp'; nav.setAttribute('aria-label', 'Sections');
    var ticks = '';
    for (var t = 0; t < 48; t++) {
      var a = t * 7.5 * Math.PI / 180, maj = t % 12 === 0, r1 = maj ? 42 : 47;
      ticks += '<line' + (maj ? ' class="maj"' : '') + ' x1="' + (60 + Math.cos(a) * r1).toFixed(2) + '" y1="' + (60 + Math.sin(a) * r1).toFixed(2) + '" x2="' + (60 + Math.cos(a) * 51).toFixed(2) + '" y2="' + (60 + Math.sin(a) * 51).toFixed(2) + '"/>';
    }
    var html = '<svg class="cmp-arc" aria-hidden="true"><path data-cmp-arc/></svg><ol class="cmp-list">';
    secs.forEach(function (s, i) {
      if (!s.id) s.id = 'section-' + (i + 1);
      html += '<li><a class="cmp-item" href="#' + s.id + '" data-i="' + i + '" style="--i:' + i + '" aria-label="' + s.getAttribute('data-label') + '">' + (i < 10 ? '0' : '') + i + '</a></li>';
    });
    html += '</ol><button type="button" class="cmp-disc" aria-expanded="false" aria-label="Sections menu">' +
      '<svg class="cmp-face" viewBox="0 0 120 120" aria-hidden="true"><g class="cmp-ticks">' + ticks + '</g>' +
      '<circle class="cmp-track" cx="60" cy="60" r="56"/><circle class="cmp-prog" cx="60" cy="60" r="56" transform="rotate(-90 60 60)" data-cmp-prog/>' +
      '<text class="cmp-n" x="60" y="33" text-anchor="middle">N</text></svg>' +
      '<span class="cmp-needle" aria-hidden="true" data-cmp-needle><svg viewBox="0 0 22 92"><path d="M11 2 L19 46 L11 46 Z" fill="#ff6a4d"/><path d="M11 2 L3 46 L11 46 Z" fill="#ff8f75"/><path d="M11 90 L19 46 L11 46 Z" fill="#e8f1ee"/><path d="M11 90 L3 46 L11 46 Z" fill="#fff"/></svg></span>' +
      '<span class="cmp-core" aria-hidden="true"><b data-cmp-num>00</b></span><span class="cmp-label" aria-hidden="true" data-cmp-label></span></button>' +
      '<span class="cmp-peek" aria-hidden="true"><b data-cmp-peek-n>00</b><span data-cmp-peek-t></span></span>';
    nav.innerHTML = html;
    document.body.appendChild(nav);

    var disc = $('.cmp-disc', nav), items = $$('.cmp-item', nav), needle = $('[data-cmp-needle]', nav);
    var prog = $('[data-cmp-prog]', nav), num = $('[data-cmp-num]', nav), lab = $('[data-cmp-label]', nav);
    var peekN = $('[data-cmp-peek-n]', nav), peekT = $('[data-cmp-peek-t]', nav), arc = $('[data-cmp-arc]', nav);
    var C = 2 * Math.PI * 56; prog.style.strokeDasharray = C.toFixed(1); prog.style.strokeDashoffset = C.toFixed(1);

    function layout() {
      var R = parseFloat(getComputedStyle(nav).getPropertyValue('--R')) || 210;
      items.forEach(function (it, i) {
        var a = ang(i) * Math.PI / 180;
        it.style.setProperty('--x', (Math.cos(a) * R).toFixed(1) + 'px');
        it.style.setProperty('--y', (Math.sin(a) * R).toFixed(1) + 'px');
      });
      arc.setAttribute('d', 'M 0 ' + (-R) + ' A ' + R + ' ' + R + ' 0 0 0 ' + (-R) + ' 0');
    }
    layout();

    // needle: a damped spring, kicked by scroll speed, so it swings and settles like a real compass
    var target = 0, rot = 0, vel = 0, running = false, cur = -1, hoverI = -1, lastY = window.scrollY, peekT0;
    function spin() {
      if (REDUCED) { rot = target; vel = 0; }
      else { vel += (target - rot) * 0.07; vel *= 0.84; rot += vel; }
      needle.style.transform = 'rotate(' + rot.toFixed(2) + 'deg)';
      if (Math.abs(vel) > 0.02 || Math.abs(target - rot) > 0.05) requestAnimationFrame(spin); else running = false;
    }
    function kick() { if (!running) { running = true; requestAnimationFrame(spin); } }
    function point(i) { target = ang(i) + 90; kick(); }
    function show(i) {
      num.textContent = (i < 10 ? '0' : '') + i;
      lab.textContent = secs[i].getAttribute('data-label');
    }

    function update() {
      ticking = false;
      var mid = window.innerHeight / 2, on = 0;
      secs.forEach(function (s, i) { if (s.getBoundingClientRect().top <= mid) on = i; });
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      prog.style.strokeDashoffset = (C * (1 - p)).toFixed(1);
      var dy = window.scrollY - lastY; lastY = window.scrollY;
      if (!REDUCED && hoverI < 0) { vel += Math.max(-6, Math.min(6, dy * 0.05)); kick(); }
      if (on !== cur) {
        var first = cur === -1; cur = on;
        items.forEach(function (it, i) { it.classList.toggle('on', i === on); it.classList.toggle('past', i < on); });
        disc.setAttribute('aria-label', 'Sections menu. Now at: ' + secs[on].getAttribute('data-label'));
        if (hoverI < 0) { point(on); show(on); }
        if (!first) {
          peekN.textContent = (on < 10 ? '0' : '') + on; peekT.textContent = secs[on].getAttribute('data-label');
          nav.classList.add('peek'); clearTimeout(peekT0);
          peekT0 = setTimeout(function () { nav.classList.remove('peek'); }, 1700);
        }
      }
    }
    var ticking = false;
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', layout);

    function setOpen(v) {
      nav.classList.toggle('open', v); nav.classList.remove('hint', 'peek');
      disc.setAttribute('aria-expanded', v ? 'true' : 'false');
      if (!v) { hoverI = -1; point(cur); show(cur); }
    }
    disc.addEventListener('click', function () { setOpen(!nav.classList.contains('open')); if (nav.classList.contains('open')) items[cur].focus({ preventScroll: true }); });
    items.forEach(function (it, i) {
      function aim() { hoverI = i; point(i); show(i); }
      it.addEventListener('mouseenter', aim); it.addEventListener('focus', aim);
      it.addEventListener('mouseleave', function () { hoverI = -1; point(cur); show(cur); });
      it.addEventListener('click', function () { setTimeout(function () { setOpen(false); }, 120); });
    });
    document.addEventListener('pointerdown', function (e) { if (nav.classList.contains('open') && !nav.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (!nav.classList.contains('open')) return;
      if (e.key === 'Escape') { setOpen(false); disc.focus(); }
      var k = items.indexOf(document.activeElement);
      if (k > -1 && (e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'ArrowRight')) {
        e.preventDefault(); var d = (e.key === 'ArrowDown' || e.key === 'ArrowLeft') ? 1 : -1;
        items[(k + d + n) % n].focus({ preventScroll: true });
      }
    });
    update();
    rot = target; needle.style.transform = 'rotate(' + rot + 'deg)';
    // a gentle ping once the visitor leaves the hero, so they notice it's clickable
    var hinted = false;
    window.addEventListener('scroll', function () { if (!hinted && cur > 0) { hinted = true; nav.classList.add('hint'); } }, { passive: true });
  }

  function initDots() {
    var secs = $$('section[data-label]');
    if (secs.length < 3) return;
    if (document.body.classList.contains('home')) return initCompass(secs);
    var nav = document.createElement('nav');
    nav.className = 'dots'; nav.setAttribute('aria-label', 'Sections');
    secs.forEach(function (s, i) {
      if (!s.id) s.id = 'section-' + (i + 1);
      var a = document.createElement('a');
      a.href = '#' + s.id; a.innerHTML = '<span>' + s.getAttribute('data-label') + '</span>';
      a.setAttribute('aria-label', s.getAttribute('data-label'));
      nav.appendChild(a);
    });
    document.body.appendChild(nav);
    var links = $$('a', nav), ticking = false;
    function update() {
      ticking = false;
      var mid = window.innerHeight / 2, on = 0;
      secs.forEach(function (s, i) { if (s.getBoundingClientRect().top <= mid) on = i; });
      links.forEach(function (a, i) { a.classList.toggle('on', i === on); });
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ---------------------------------------------------------- page-to-page wave */
  function initWipe() {
    var logo = $('.nav-logo img');
    var wipe = document.createElement('div');
    wipe.className = 'wipe'; wipe.setAttribute('aria-hidden', 'true');
    wipe.innerHTML = logo ? '<img alt="" src="' + logo.getAttribute('src') + '">' : '';
    document.body.appendChild(wipe);

    var arriving = false;
    try { arriving = sessionStorage.getItem('tc-wipe') === '1'; sessionStorage.removeItem('tc-wipe'); } catch (e) { /* storage unavailable */ }
    if (arriving && !REDUCED) {
      wipe.classList.add('leave');
      requestAnimationFrame(function () { requestAnimationFrame(function () { wipe.classList.add('go'); }); });
      setTimeout(function () { wipe.className = 'wipe'; }, 900);
    }

    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank') return;
      var url;
      try { url = new URL(a.href, location.href); } catch (err) { return; }
      if (url.origin !== location.origin || url.protocol.indexOf('http') !== 0 && url.protocol !== 'file:') return;
      if (url.pathname === location.pathname) return; // same page: let the anchor scroll smoothly
      if (REDUCED) return;
      e.preventDefault();
      try { sessionStorage.setItem('tc-wipe', '1'); } catch (err) { /* storage unavailable */ }
      wipe.className = 'wipe cover';
      setTimeout(function () { location.href = url.href; }, 560);
    });
    // Coming back with the browser's Back button can restore a covered page from cache.
    window.addEventListener('pageshow', function (e) { if (e.persisted) wipe.className = 'wipe'; });
  }

  /* ---------------------------------------------------------- lead form */
  var ENQUIRY_ENDPOINT = '/api/enquiry';
  function enquiryPage() { try { return location.host + location.pathname; } catch (e) { return ''; } }

  function initForms() {
    $$('form[data-lead-form]').forEach(function (form) {
      var btn = $('[data-submit-btn]', form);
      var btnLabel = btn ? btn.innerHTML : '';
      var okBox = $('[data-form-success]', form), errBox = $('[data-form-error]', form);
      function status(state, msg) {
        if (okBox) okBox.classList.toggle('hidden', state !== 'success');
        if (errBox) {
          errBox.classList.toggle('hidden', state !== 'error');
          if (state === 'error' && msg) { var t = $('[data-form-error-text]', errBox) || errBox; t.textContent = msg; }
        }
      }
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        status('idle');
        var data = {};
        new FormData(form).forEach(function (v, k) { data[k] = v; });
        if (String(data.name || '').trim().length < 2) { status('error', 'Please enter your full name.'); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || '')) { status('error', 'Please enter a valid email address.'); return; }
        if (!/^[0-9]{7,15}$/.test(String(data.phone_number || '').replace(/\D/g, ''))) { status('error', 'Please enter a valid phone number (7-15 digits).'); return; }
        data.phone = (data.country_code || '') + ' ' + (data.phone_number || '');
        delete data.country_code; delete data.phone_number;
        data.page = enquiryPage();
        if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
        fetch(ENQUIRY_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
          .then(function (r) { return r.json().catch(function () { return { success: false }; }); })
          .then(function (res) {
            if (res && res.success) { if (form.hasAttribute('data-desk')) { var de = $('[data-desk-email]', form); if (de) de.textContent = data.email ? ' at ' + data.email : ''; form.classList.add('sent'); } else { status('success'); form.reset(); setTimeout(function () { status('idle'); }, 6000); } }
            else status('error', (res && res.message) || 'Something went wrong. Please try again.');
          })
          .catch(function () { status('error', 'Network error. Please check your connection and try again.'); })
          .then(function () { if (btn) { btn.disabled = false; btn.innerHTML = btnLabel; } });
      });
    });

    // An institution picked on the directory page pre-fills the enquiry.
    try {
      var picked = localStorage.getItem('selectedUniversity');
      if (picked) {
        localStorage.removeItem('selectedUniversity');
        $$('[data-destination-input]').forEach(function (i) { i.value = picked; });
        $$('[data-destination-label]').forEach(function (l) { l.textContent = picked; });
        $$('[data-picked-wrap]').forEach(function (w) { w.classList.remove('hidden'); });
      }
    } catch (err) { /* storage unavailable */ }
  }

  function initYear() { $$('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); }); }

  function init() {
    initNav(); initReveal(); initCounters(); initRipple(); initParallax();
    initStage(); initDots(); initWipe();
    initTide(); initBottles(); initFit(); initSpotlight(); initDeck(); initDesk(); initCanvases(); initForms(); initYear();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
