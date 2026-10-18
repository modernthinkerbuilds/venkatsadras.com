// venkatsadras.com — tiny progressive enhancements. Every page works without this file.
(function () {
  // Mobile menu
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Agent flows: light up one step at a time
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  Array.prototype.forEach.call(document.querySelectorAll('.flow'), function (flow) {
    var steps = flow.querySelectorAll('li');
    if (!steps.length) return;
    if (reduce) { steps[0].classList.add('on'); return; }
    var k = 0;
    steps[0].classList.add('on');
    setInterval(function () {
      steps[k].classList.remove('on');
      k = (k + 1) % steps.length;
      steps[k].classList.add('on');
    }, 1100);
  });

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
