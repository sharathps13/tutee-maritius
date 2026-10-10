/* Tutee Connect — island-style institution directory.
   Reads window.MU_UNIVERSITIES from assets/js/universities-data.js (generated
   from the HEC registers). Rows are built once; filtering only hides, shows and
   reorders them, so nothing is re-rendered while you type or tap. */
(function () {
  'use strict';
  var DATA = (window.MU_UNIVERSITIES || []).slice();
  if (!DATA.length) return;
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Always open the directory at the top. Browsers otherwise restore the last
  // scroll position, which can drop you at the footer when the list is filtered.
  try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) { /* not allowed */ }
  // 'instant' matters: the page has CSS smooth scrolling, which would otherwise animate this jump
  function toTop() { if (!location.hash && window.scrollY !== 0) window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }
  toTop();
  window.addEventListener('load', toTop);
  window.addEventListener('pageshow', toTop);

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function fold(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function region(u) { var p = u.location.split(', '); return p[p.length - 1]; }
  function isPublic(u) { return !/^Private/.test(u.type); }
  function isPartner(u) { return u.awards === 'Partner awards'; }
  function subjects(u) { return u.programs ? u.programs.split(', ') : []; }
  function awardsLine(u) {
    if (isPartner(u)) return 'Teaches toward a degree awarded by a partner university, so the qualification you earn is the partner’s.';
    if (u.awards === 'Own awards (sub-degree)') return 'Awards its own certificates and diplomas (below degree level).';
    return 'Awards its own degrees.';
  }

  var PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-6 8-12a8 8 0 0 0-16 0c0 6 8 12 8 12z"/><circle cx="12" cy="10" r="3"/></svg>';
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var TICK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  var CHEV = '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';

  var list = $('[data-rows]'), shown = $('[data-shown]'), empty = $('[data-empty]');
  var state = { q: '', awards: '', sector: '', subject: '', region: '', sort: 'register' };
  var picks = [];

  // ---- build every row once
  DATA.forEach(function (u, i) {
    u._q = fold([u.name, u.location, u.type, u.awards, u.programs, u.alt].join(' '));
    var li = document.createElement('li');
    li.className = 'row' + (isPartner(u) ? ' partner' : '') + (i < 14 && !REDUCED ? ' intro' : '');
    if (i < 14) li.style.animationDelay = (i * 35) + 'ms';
    var bodyId = 'row-' + u.id;
    li.innerHTML =
      '<div class="row-head" role="button" tabindex="0" aria-expanded="false" aria-controls="' + bodyId + '">' +
        '<span class="row-idx">' + (u.rank < 10 ? '0' : '') + u.rank + '</span>' +
        '<span class="row-name"><b data-name>' + esc(u.name) + '</b><small>' + PIN + '<span data-loc>' + esc(u.location) + '</span></small></span>' +
        (u.ranked ? '<span class="badge rank" title="THE World University Rankings 2026">THE 1201–1500</span>' : '<span class="badge' + (isPartner(u) ? ' partner' : '') + '">' + (isPartner(u) ? 'Partner awards' : 'Own awards') + '</span>') +
        '<span class="subj-count">' + subjects(u).length + ' subject' + (subjects(u).length === 1 ? '' : 's') + '</span>' +
        '<button type="button" class="pick" aria-pressed="false" aria-label="Add ' + esc(u.name) + ' to compare">' + TICK + '</button>' +
        CHEV +
      '</div>' +
      '<div class="row-body" id="' + bodyId + '"><div><div class="row-inner">' +
        '<p>' + esc(u.type) + '. ' + awardsLine(u) + '</p>' +
        '<div class="subjects">' + subjects(u).map(function (s) { return '<span>' + esc(s) + '</span>'; }).join('') + '</div>' +
        '<div class="row-actions"><button type="button" class="enquire" data-enquire>Enquire ' + ARROW + '</button><button type="button" class="ghost" data-compare-toggle aria-pressed="false">Add to compare</button></div>' +
      '</div></div></div>';
    u._el = li; u._name = $('[data-name]', li); u._loc = $('[data-loc]', li);
    li._u = u;
    list.appendChild(li);
  });

  // ---- filter controls
  var subjCount = {};
  DATA.forEach(function (u) { subjects(u).forEach(function (s) { subjCount[s] = (subjCount[s] || 0) + 1; }); });
  var subjSel = $('[data-subject]');
  Object.keys(subjCount).sort(function (a, b) { return subjCount[b] - subjCount[a] || a.localeCompare(b); }).forEach(function (s) {
    var o = document.createElement('option'); o.value = s; o.textContent = s + ' (' + subjCount[s] + ')'; subjSel.appendChild(o);
  });
  var regCount = {};
  DATA.forEach(function (u) { var r = region(u); regCount[r] = (regCount[r] || 0) + 1; });
  var regSel = $('[data-region]');
  Object.keys(regCount).sort(function (a, b) { return regCount[b] - regCount[a] || a.localeCompare(b); }).forEach(function (r) {
    var o = document.createElement('option'); o.value = r; o.textContent = r + ' (' + regCount[r] + ')'; regSel.appendChild(o);
  });

  function highlight(text) {
    if (!state.q) return esc(text);
    var f = fold(text), q = fold(state.q.trim()), i = q ? f.indexOf(q) : -1;
    if (i < 0) return esc(text);
    return esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + q.length)) + '</mark>' + esc(text.slice(i + q.length));
  }

  var lastOrder = '';
  function apply() {
    var q = fold(state.q.trim()), count = 0;
    var vis = DATA.filter(function (u) {
      var ok = !(q && u._q.indexOf(q) < 0) &&
        !(state.awards === 'own' && isPartner(u)) && !(state.awards === 'partner' && !isPartner(u)) &&
        !(state.sector === 'public' && !isPublic(u)) && !(state.sector === 'private' && isPublic(u)) &&
        !(state.subject && subjects(u).indexOf(state.subject) < 0) &&
        !(state.region && region(u) !== state.region);
      u._el.hidden = !ok;
      if (ok) count++;
      return ok;
    });
    // highlight only touches text nodes of matching rows
    DATA.forEach(function (u) { if (!u._el.hidden) { u._name.innerHTML = highlight(u.name); u._loc.innerHTML = highlight(u.location); } });
    var order = DATA.slice();
    if (state.sort === 'az') order.sort(function (a, b) { return a.name.localeCompare(b.name); });
    else if (state.sort === 'subjects') order.sort(function (a, b) { return subjects(b).length - subjects(a).length || a.rank - b.rank; });
    else order.sort(function (a, b) { return a.rank - b.rank; });
    var key = order.map(function (u) { return u.rank; }).join(',');
    if (key !== lastOrder) { order.forEach(function (u) { list.appendChild(u._el); }); lastOrder = key; }
    shown.textContent = String(count);
    empty.classList.toggle('hidden', vis.length > 0);
  }

  $$('[data-filter]').forEach(function (g) {
    var key = g.getAttribute('data-filter');
    g.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      $$('button', g).forEach(function (x) { x.classList.toggle('on', x === b); });
      state[key] = b.getAttribute('data-value');
      apply();
    });
  });
  var search = $('[data-search]'), t = 0;
  if (search) search.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { state.q = search.value; apply(); }, 100); });
  subjSel.addEventListener('change', function () { state.subject = subjSel.value; apply(); });
  regSel.addEventListener('change', function () { state.region = regSel.value; apply(); });
  $('[data-sort]').addEventListener('change', function (e) { state.sort = e.target.value; apply(); });
  $$('[data-reset]').forEach(function (b) {
    b.addEventListener('click', function () {
      state.q = state.awards = state.sector = state.subject = state.region = '';
      if (search) search.value = '';
      subjSel.value = ''; regSel.value = '';
      $$('[data-filter]').forEach(function (g) { $$('button', g).forEach(function (x, i) { x.classList.toggle('on', i === 0); }); });
      apply();
    });
  });

  // ---- rows: open/close, enquire, compare picks
  function toggleRow(li, force) {
    var open = force == null ? !li.classList.contains('open') : force;
    li.classList.toggle('open', open);
    $('.row-head', li).setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  function enquire(names) {
    try { localStorage.setItem('selectedUniversity', names.join(', ')); } catch (err) { /* storage unavailable */ }
    var target = $('[data-contact-href]');
    var href = target ? target.getAttribute('data-contact-href') : 'island.html#contact';
    var a = document.createElement('a'); a.href = href; document.body.appendChild(a); a.click(); // lets the page-wave transition run
  }
  list.addEventListener('click', function (e) {
    var li = e.target.closest('.row');
    if (!li) return;
    var u = li._u;
    if (e.target.closest('.pick') || e.target.closest('[data-compare-toggle]')) { togglePick(u); return; }
    if (e.target.closest('[data-enquire]')) { enquire([u.name]); return; }
    if (e.target.closest('.row-head')) toggleRow(li);
  });
  list.addEventListener('keydown', function (e) {
    var head = e.target.closest && e.target.closest('.row-head');
    if (head && e.target === head && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); toggleRow(head.parentNode); }
  });

  var tray = $('[data-tray]'), trayPicks = $('[data-tray-picks]');
  function syncPicks() {
    DATA.forEach(function (u) {
      var on = picks.indexOf(u) > -1;
      $('.pick', u._el).setAttribute('aria-pressed', on ? 'true' : 'false');
      var g = $('[data-compare-toggle]', u._el);
      g.setAttribute('aria-pressed', on ? 'true' : 'false');
      g.textContent = on ? 'In compare' : 'Add to compare';
    });
    trayPicks.innerHTML = picks.map(function (u, i) { return '<span><em>' + esc(u.name) + '</em><button type="button" data-unpick="' + i + '" aria-label="Remove ' + esc(u.name) + '">×</button></span>'; }).join('') +
      (picks.length < 3 ? '<span style="opacity:.6"><em>' + (3 - picks.length) + ' more can be added</em></span>' : '');
    tray.classList.toggle('show', picks.length > 0);
    $('[data-compare-open]').disabled = picks.length < 2;
  }
  function togglePick(u) {
    var i = picks.indexOf(u);
    if (i > -1) picks.splice(i, 1);
    else { if (picks.length >= 3) picks.shift(); picks.push(u); }
    syncPicks();
  }
  trayPicks.addEventListener('click', function (e) { var b = e.target.closest('[data-unpick]'); if (b) { picks.splice(+b.getAttribute('data-unpick'), 1); syncPicks(); } });
  $('[data-tray-clear]').addEventListener('click', function () { picks = []; syncPicks(); });
  $('[data-tray-enquire]').addEventListener('click', function () { if (picks.length) enquire(picks.map(function (u) { return u.name; })); });

  // ---- comparison sheet
  var sheet = $('[data-sheet]'), table = $('[data-compare]'), lastFocus = null;
  function openSheet() {
    if (picks.length < 2) return;
    var rows = [
      ['Location', function (u) { return esc(u.location); }],
      ['Type', function (u) { return esc(u.type); }],
      ['Who awards it', function (u) { return esc(u.awards); }],
      ['Subjects', function (u) { return '<div class="subjects">' + subjects(u).map(function (s) { return '<span>' + esc(s) + '</span>'; }).join('') + '</div>'; }],
      ['Ranking', function (u) { return u.ranked ? 'THE World University Rankings 2026: 1201–1500' : 'Not ranked'; }]
    ];
    table.innerHTML = '<thead><tr><th></th>' + picks.map(function (u) { return '<th>' + esc(u.name) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r) { return '<tr><th>' + r[0] + '</th>' + picks.map(function (u) { return '<td>' + r[1](u) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody>';
    lastFocus = document.activeElement;
    sheet.hidden = false;
    $('.sheet-head .round-btn', sheet).focus();
  }
  function closeSheet() { sheet.hidden = true; if (lastFocus) lastFocus.focus(); }
  $('[data-compare-open]').addEventListener('click', openSheet);
  $$('[data-sheet-close]', sheet).forEach(function (b) { b.addEventListener('click', closeSheet); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) closeSheet(); });

  // arriving from the landing page's "find your fit" with a subject already chosen
  try {
    var handed = localStorage.getItem('dirSubject');
    if (handed) { localStorage.removeItem('dirSubject'); if (subjCount[handed]) { state.subject = handed; subjSel.value = handed; } }
  } catch (err) { /* storage unavailable */ }

  syncPicks();
  apply();
})();
