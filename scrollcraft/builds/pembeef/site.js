/* PEMBEEF: Rinderpfad, Kopfleiste, nächster Liefertermin. Bewegung liefert die Engine. */
(function () {
  'use strict';
  ScrollCraft.mount(document.body);

  var ids = ['hof', 'wir', 'weide', 'bekommen', 'kuhhperation', 'reservieren'];
  var papers = { wir: 1, bekommen: 1, kuhhperation: 1 };
  var trail = document.querySelector('.trail');
  var bar = document.querySelector('.bar');
  var links = ids.map(function (id) { return document.querySelector('.trail a[data-st="' + id + '"]'); });
  var secs = ids.map(function (id) { return document.getElementById(id); });
  var tops = [];

  function measure() {
    var max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    tops = secs.map(function (s) { return s.getBoundingClientRect().top + scrollY; });
    links.forEach(function (a, i) {
      a.parentNode.style.setProperty('--y', Math.min(1, tops[i] / max).toFixed(4));
    });
  }

  function frame() {
    var max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    var y = scrollY;
    trail.style.setProperty('--trail-p', Math.min(1, y / max).toFixed(4));
    var here = 0;
    tops.forEach(function (t, i) { if (t <= y + innerHeight * 0.45) here = i; });
    links.forEach(function (a, i) {
      a.classList.toggle('is-here', i === here);
      a.classList.toggle('is-past', i < here);
      if (i === here) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
    });
    bar.classList.toggle('is-paper', !!papers[ids[here]]);
    var grounds = { hof: 'transparent', wir: '#f2eada', weide: '#1c2416', bekommen: '#e7dcc4', kuhhperation: '#f2eada', reservieren: '#2a3622' };
    bar.style.setProperty('--bar-bg', grounds[ids[here]]);
    bar.classList.toggle('is-solid', here > 0);
  }

  var raf = 0;
  function onScroll() { if (!raf) raf = requestAnimationFrame(function () { raf = 0; frame(); }); }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', function () { measure(); frame(); });
  addEventListener('load', function () { setTimeout(function () { measure(); frame(); }, 400); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { setTimeout(function () { measure(); frame(); }, 200); });
  setTimeout(function () { measure(); frame(); }, 150);

  /* Nächster Liefertermin. Fehlt die API oder antwortet nicht, steht ein ehrlicher Satz da. */
  var v = document.getElementById('termin-v');
  var s = document.getElementById('termin-s');
  var box = document.getElementById('termin');
  var meta = document.querySelector('meta[name="pembeef-api"]');
  var base = ((meta && meta.content) || '').replace(/\/$/, '');
  var fmt = function (iso, opts) {
    var d = new Date(iso + 'T12:00:00');
    return d.toLocaleDateString('de-AT', opts);
  };
  function show(state, a, b) { box.dataset.state = state; v.textContent = a; s.textContent = b || ''; }

  if (!base) {
    show('offline', 'Termin folgt', 'Den nächsten Termin nennen wir dir gern per WhatsApp.');
  } else {
    var ctl = new AbortController();
    var to = setTimeout(function () { ctl.abort(); }, 6000);
    fetch(base + '/api/public/next-delivery', { signal: ctl.signal, headers: { Accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (d) {
        clearTimeout(to);
        if (!d) { show('none', 'Noch kein Termin', 'Der nächste Termin ist noch nicht festgelegt. Schreib uns, wir sagen Bescheid.'); return; }
        var when = fmt(d.orderDate, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        var by = fmt(d.reservationDeadline, { day: 'numeric', month: 'long' });
        show(d.isOrderable ? 'open' : 'closed', when,
          d.isOrderable ? 'Reservieren bis ' + by + '.' : 'Die Reservierung für diesen Termin ist geschlossen. Frag nach dem nächsten.');
      })
      .catch(function () {
        clearTimeout(to);
        show('error', 'Termin gerade nicht abrufbar', 'Frag uns direkt per WhatsApp, wir antworten gern.');
      });
  }
})();
