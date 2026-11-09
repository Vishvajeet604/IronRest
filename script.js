// ---------- Animated counters (home page) ----------
var nums = document.querySelectorAll('.num');
if (nums.length) {
  var run = function (el) {
    var to = +el.dataset.to, cur = 0, step = Math.max(1, Math.ceil(to / 60));
    var t = setInterval(function () {
      cur = Math.min(to, cur + step);
      el.textContent = cur.toLocaleString('en-IN') + (to >= 100 ? '+' : '');
      if (cur >= to) clearInterval(t);
    }, 25);
  };
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
  });
  nums.forEach(function (n) { io.observe(n); });
}

// ---------- Program filter (programs page) ----------
var filters = document.getElementById('filters');
if (filters) {
  filters.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    filters.querySelectorAll('button').forEach(function (x) { x.className = 'btn btn-outline-secondary me-1 mb-2'; });
    b.className = 'btn btn-nest me-1 mb-2';
    document.querySelectorAll('#programList > div').forEach(function (c) {
      c.style.display = (b.dataset.filter === 'all' || c.dataset.cat === b.dataset.filter) ? '' : 'none';
    });
  });
}

// ---------- Remember chosen plan, prefill signup ----------
document.querySelectorAll('.pick').forEach(function (a) {
  a.addEventListener('click', function () { try { localStorage.setItem('plan', a.dataset.plan); } catch (e) {} });
});
var planSel = document.querySelector('#signupForm #plan');
if (planSel) { try { var p = localStorage.getItem('plan'); if (p) planSel.value = p; } catch (e) {} }

// ---------- BMI + calories + water (bmi page) ----------
var bmiForm = document.getElementById('bmiForm');
if (bmiForm) {
  bmiForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var h = +document.getElementById('h').value, w = +document.getElementById('w').value, age = +document.getElementById('age').value;
    var box = document.getElementById('result'); box.classList.add('show');
    if (!h || !w || !age || h < 100 || h > 250 || w < 30 || w > 250 || age < 14 || age > 90) {
      box.textContent = 'Enter a height of 100 to 250 cm, a weight of 30 to 250 kg and an age of 14 to 90.'; return;
    }
    var m = h / 100, bmi = w / (m * m), cat, plan;
    if (bmi < 18.5) { cat = 'Underweight'; plan = 'Quarterly plan with a diet chart'; }
    else if (bmi < 25) { cat = 'Normal'; plan = 'Monthly plan'; }
    else if (bmi < 30) { cat = 'Overweight'; plan = 'Half-yearly plan with Zumba and yoga'; }
    else { cat = 'Obese'; plan = 'Yearly plan with a personal trainer'; }
    var male = document.getElementById('sex').value === 'm';
    var bmr = 10 * w + 6.25 * h - 5 * age + (male ? 5 : -161);
    var kcal = Math.round(bmr * +document.getElementById('act').value + +document.getElementById('goal').value);
    var lo = (18.5 * m * m).toFixed(1), hi = (24.9 * m * m).toFixed(1);
    box.innerHTML = '<strong>BMI ' + bmi.toFixed(1) + ' (' + cat + ')</strong>' +
      '<ul class="mt-3 mb-0"><li>Healthy weight range for your height: ' + lo + ' to ' + hi + ' kg</li>' +
      '<li>Daily calories for your goal: about ' + kcal + ' kcal</li>' +
      '<li>Daily water: about ' + (w * 0.035).toFixed(1) + ' litres</li>' +
      '<li>Suggested plan: ' + plan + ' (<a href="plans.html">see plans</a>)</li></ul>';
  });
}

// ---------- Form validation (login, signup, contact) ----------
function wire(id, okText) {
  var form = document.getElementById(id); if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;
    form.querySelectorAll('input,select,textarea').forEach(function (f) {
      if (f.checkValidity()) f.classList.remove('is-invalid'); else { f.classList.add('is-invalid'); valid = false; }
    });
    document.getElementById('msg').textContent = valid ? okText : '';
    if (valid) form.reset();
  });
}
wire('contactForm', 'Thank you! We will contact you within 24 hours.');

// ---------- Demo accounts saved in this browser (no server) ----------
function getUsers() { try { return JSON.parse(localStorage.getItem('users')) || []; } catch (e) { return []; } }
function say(text, ok) { var m = document.getElementById('msg'); m.textContent = text; m.className = 'mt-3 ' + (ok ? 'text-success' : 'text-danger'); }
function checkForm(form) {
  var valid = true;
  form.querySelectorAll('input,select').forEach(function (f) {
    if (f.checkValidity()) f.classList.remove('is-invalid'); else { f.classList.add('is-invalid'); valid = false; }
  });
  return valid;
}
function startSession(u) { localStorage.setItem('session', JSON.stringify({ name: u.name, email: u.email })); }

var signupForm = document.getElementById('signupForm');
if (signupForm) signupForm.addEventListener('submit', function (e) {
  e.preventDefault();
  if (!checkForm(signupForm)) return say('', true);
  var u = { name: document.getElementById('name').value.trim(), email: document.getElementById('email').value.trim().toLowerCase(),
            phone: document.getElementById('phone').value, plan: document.getElementById('plan').value, pass: document.getElementById('pass').value };
  var users = getUsers();
  if (users.some(function (x) { return x.email === u.email; })) return say('This email is already registered. Please log in.', false);
  users.push(u); localStorage.setItem('users', JSON.stringify(users)); startSession(u);
  say('Account created. Taking you to the home page...', true);
  setTimeout(function () { location.href = 'index.html'; }, 1000);
});

var loginForm = document.getElementById('loginForm');
if (loginForm) loginForm.addEventListener('submit', function (e) {
  e.preventDefault();
  if (!checkForm(loginForm)) return say('', true);
  var email = document.getElementById('email').value.trim().toLowerCase(), pass = document.getElementById('pass').value;
  var u = getUsers().filter(function (x) { return x.email === email && x.pass === pass; })[0];
  if (!u) return say('Wrong email or password. New here? Create an account first.', false);
  startSession(u); say('Welcome back, ' + u.name + '!', true);
  setTimeout(function () { location.href = 'index.html'; }, 800);
});
