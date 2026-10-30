var sections = Array.prototype.slice.call(document.querySelectorAll('main section'));
var list = document.getElementById('lesson-list');
var prevBtn = document.getElementById('prev-btn');
var nextBtn = document.getElementById('next-btn');
var position = document.getElementById('position');
var themeBtn = document.getElementById('theme-toggle');
var progressFill = document.getElementById('progress-fill');
var current = 0;
var navButtons = [];

// Lesson switching: show one section at a time.
sections.forEach(function (section, index) {
  var item = document.createElement('li');
  var button = document.createElement('button');
  button.type = 'button';
  button.textContent = section.getAttribute('data-title');
  button.addEventListener('click', function () {
    show(index);
  });
  item.appendChild(button);
  list.appendChild(item);
  navButtons.push(button);
});

function show(index) {
  current = index;
  sections.forEach(function (section, i) {
    section.hidden = i !== index;
  });
  navButtons.forEach(function (button, i) {
    if (i === index) {
      button.setAttribute('aria-current', 'true');
    } else {
      button.removeAttribute('aria-current');
    }
  });
  navButtons[index].scrollIntoView({ block: 'nearest', inline: 'nearest' });
  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === sections.length - 1;
  position.textContent = 'Lesson ' + (index + 1) + ' of ' + sections.length;
  progressFill.style.width = ((index + 1) / sections.length) * 100 + '%';
  if (location.hash !== '#' + sections[index].id) {
    history.replaceState(null, '', '#' + sections[index].id);
  }
  window.scrollTo(0, 0);
}

prevBtn.addEventListener('click', function () {
  if (current > 0) {
    show(current - 1);
  }
});

nextBtn.addEventListener('click', function () {
  if (current < sections.length - 1) {
    show(current + 1);
  }
});

function indexFromHash() {
  var id = location.hash.slice(1);
  for (var i = 0; i < sections.length; i++) {
    if (sections[i].id === id) {
      return i;
    }
  }
  return 0;
}

window.addEventListener('hashchange', function () {
  show(indexFromHash());
});

// Theme toggle: light by default, choice remembered when storage is available.
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  themeBtn.textContent = theme === 'dark' ? 'Light theme' : 'Dark theme';
}

var savedTheme = 'light';
try {
  if (localStorage.getItem('theme') === 'dark') {
    savedTheme = 'dark';
  }
} catch (e) {}
applyTheme(savedTheme);

themeBtn.addEventListener('click', function () {
  var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try {
    localStorage.setItem('theme', next);
  } catch (e) {}
});

show(indexFromHash());
