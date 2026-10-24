// venkatsadras.com — small progressive enhancements. Every page works without this file.
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var narrow = window.matchMedia && window.matchMedia('(max-width: 860px)').matches;

  // Mobile menu: the button reads "Close" while open; Escape and a tap outside close it.
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    var label = toggle.querySelector('span') || toggle;
    function setMenu(open) {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      label.textContent = open ? 'Close' : 'Menu';
    }
    toggle.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); toggle.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
    });
  }

  // Flows: the steps light up once, in order, when the list scrolls into view.
  // Hover or focus pauses; Replay runs it again. On a phone it stays a plain list.
  Array.prototype.forEach.call(document.querySelectorAll('.flow'), function (flow) {
    var steps = flow.querySelectorAll('li');
    if (!steps.length || reduce || narrow) return;
    var replay = flow.parentNode.querySelector('.replay');
    var timer = null, k = -1, paused = false, played = false;

    function clear() { Array.prototype.forEach.call(steps, function (s) { s.classList.remove('on'); }); }
    function tick() {
      if (paused) return;
      if (k >= 0) steps[k].classList.remove('on');
      k += 1;
      if (k >= steps.length) { timer = null; played = true; if (replay) replay.hidden = false; return; }
      steps[k].classList.add('on');
      timer = setTimeout(tick, 1100);
    }
    function run() {
      if (timer) clearTimeout(timer);
      clear(); k = -1; paused = false; played = false;
      if (replay) replay.hidden = true;
      tick();
    }
    function resume() { if (paused && !played) { paused = false; timer = setTimeout(tick, 400); } }
    flow.addEventListener('mouseenter', function () { paused = true; });
    flow.addEventListener('mouseleave', resume);
    flow.addEventListener('focusin', function () { paused = true; });
    flow.addEventListener('focusout', resume);
    if (replay) replay.addEventListener('click', run);

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { io.disconnect(); run(); } });
      }, { threshold: 0.4 });
      io.observe(flow);
    } else {
      run();
    }
  });

  // The map video: muted and looping, so it may start on its own once it is in view.
  if (!reduce && 'IntersectionObserver' in window) {
    Array.prototype.forEach.call(document.querySelectorAll('video.map'), function (v) {
      var vo = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
          else v.pause();
        });
      }, { threshold: 0.5 });
      vo.observe(v);
    });
  }

  // Search + series filter on lists that opt in with [data-filterable]
  var list = document.querySelector('[data-filterable]');
  if (!list) return;
  var input = document.querySelector('.search');
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  var none = document.querySelector('[data-no-match]');
  var series = 'all';

  function norm(s) { return (s || '').toLowerCase(); }
  function apply() {
    var q = norm(input && input.value).trim();
    var shown = 0;
    Array.prototype.forEach.call(list.children, function (li) {
      var okSeries = series === 'all' || li.getAttribute('data-series') === series;
      var okText = !q || norm(li.textContent).indexOf(q) !== -1;
      var show = okSeries && okText;
      li.hidden = !show;
      if (show) shown++;
    });
    if (none) none.hidden = shown !== 0 || list.children.length === 0;
  }
  if (input) input.addEventListener('input', apply);
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      series = chip.getAttribute('data-series');
      chips.forEach(function (c) { c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
      apply();
    });
  });
  // Deep link: /writing/?q=judge or ?series=where-do-we-eat
  var params = new URLSearchParams(location.search);
  if (params.get('q') && input) input.value = params.get('q');
  if (params.get('series')) {
    var match = chips.filter(function (c) { return c.getAttribute('data-series') === params.get('series'); })[0];
    if (match) match.click();
  }
  apply();
})();
