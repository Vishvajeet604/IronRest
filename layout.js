// Shared menu, footer, dark mode and back-to-top button for every page
(function () {
  var theme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-bs-theme', theme);
  var user = null;
  try { user = JSON.parse(localStorage.getItem('session')); } catch (e) {}
  var auth = user
    ? '<span class="navbar-text text-white me-lg-2">Hi, ' + String(user.name).split(' ')[0].replace(/[^\w.-]/g, '') + '</span><button id="logout" class="btn btn-nest">Logout</button>'
    : '<a href="login.html" class="btn btn-outline-light">Login</a><a href="signup.html" class="btn btn-nest">Join now</a>';
  var pages = [['index.html','Home'],['programs.html','Programs'],['plans.html','Plans'],['bmi.html','BMI'],['contact.html','Contact']];
  var cur = location.pathname.split('/').pop() || 'index.html';
  var links = pages.map(function (p) {
    return '<li class="nav-item"><a class="nav-link' + (p[0] === cur ? ' active' : '') + '" href="' + p[0] + '">' + p[1] + '</a></li>';
  }).join('');
  var nav = '<nav class="navbar navbar-expand-lg sticky-top nest-nav"><div class="container">' +
    '<a class="navbar-brand" href="index.html">IronNest</a>' +
    '<button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#menu" aria-label="Menu"><span class="navbar-toggler-icon"></span></button>' +
    '<div class="collapse navbar-collapse" id="menu"><ul class="navbar-nav mx-auto">' + links + '</ul>' +
    '<div class="d-grid d-lg-flex gap-2 mt-2 mt-lg-0"><button id="theme" class="btn btn-outline-secondary text-white">Dark mode</button>' +
    auth + '</div></div></div></nav>';
  var foot = '<footer class="bg-ink text-white-50 pt-5 pb-3"><div class="container"><div class="row g-4">' +
    '<div class="col-md-4"><h5 class="text-white">IronNest</h5><p>Your neighbourhood gym for real results. Open every day, including Sundays.</p></div>' +
    '<div class="col-6 col-md-4"><h5 class="text-white">Pages</h5>' + pages.map(function (p) { return '<a class="d-block text-white-50 text-decoration-none" href="' + p[0] + '">' + p[1] + '</a>'; }).join('') + '</div>' +
    '<div class="col-6 col-md-4"><h5 class="text-white">Visit us</h5><p class="mb-1">Mon to Sat: 5 AM to 11 PM</p><p class="mb-1">Sunday: 6 AM to 1 PM</p><p>hello@ironnest.in</p></div>' +
    '</div><hr><small class="d-block text-center">&copy; ' + new Date().getFullYear() + ' IronNest Fitness. Photos from Unsplash.</small></div></footer>' +
    '<button id="top" class="btn btn-nest" aria-label="Back to top">Top</button>';
  document.addEventListener('DOMContentLoaded', function () {
    var n = document.getElementById('nav'), f = document.getElementById('foot');
    if (n) n.outerHTML = nav;
    if (f) f.outerHTML = foot;
    var t = document.getElementById('theme');
    function label() { t.textContent = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'Light mode' : 'Dark mode'; }
    label();
    t.addEventListener('click', function () {
      var d = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-bs-theme', d); localStorage.setItem('theme', d); label();
    });
    var lo = document.getElementById('logout');
    if (lo) lo.addEventListener('click', function () { localStorage.removeItem('session'); location.href = 'index.html'; });
    var top = document.getElementById('top');
    window.addEventListener('scroll', function () { top.style.display = window.scrollY > 300 ? 'block' : 'none'; });
    top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  });
})();
