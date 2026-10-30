// PID tuner: simulates a simple system and draws its response to a step in the target.
(function () {
  var canvas = document.getElementById('sim-canvas');
  if (!canvas || !canvas.getContext) {
    return;
  }
  var ctx = canvas.getContext('2d');
  var sliders = {
    kp: document.getElementById('sim-kp'),
    ki: document.getElementById('sim-ki'),
    kd: document.getElementById('sim-kd')
  };
  var results = document.getElementById('sim-results');
  var DURATION = 20; // seconds shown
  var STEP = 0.005; // simulation time step
  var data = [];

  // The system: y'' = u - 1.5 y' - y (settles at y = u). The controller output u is
  // P * error + I * (error added up over time) - D * (speed of the output).
  function simulate(kp, ki, kd) {
    var count = Math.round(DURATION / STEP);
    var y = 0;
    var speed = 0;
    var total = 0;
    var out = [];
    for (var i = 0; i <= count; i++) {
      out.push(y);
      var error = 1 - y;
      total += error * STEP;
      var u = kp * error + ki * total - kd * speed;
      speed += (u - 1.5 * speed - y) * STEP;
      y += speed * STEP;
    }
    return out;
  }

  function analyse(values) {
    var lastCount = Math.round(2 / STEP);
    var tail = values.slice(-lastCount);
    var sum = 0;
    var tailPeak = 0;
    var peak = -Infinity;
    var i;
    for (i = 0; i < tail.length; i++) {
      sum += tail[i];
      tailPeak = Math.max(tailPeak, Math.abs(tail[i]));
    }
    for (i = 0; i < values.length; i++) {
      peak = Math.max(peak, values[i]);
    }
    var settled = 0;
    var last = values.length - 1;
    for (i = last; i >= 0; i--) {
      if (Math.abs(values[i] - 1) > 0.02) {
        settled = i === last ? null : (i + 1) * STEP;
        break;
      }
    }
    return {
      unstable: !isFinite(sum) || tailPeak > 5,
      finalError: (1 - sum / tail.length) * 100,
      overshoot: Math.max(0, (peak - 1) * 100),
      settlingTime: settled
    };
  }

  function describe(a) {
    if (a.unstable) {
      return ['The output is growing out of control (the system is unstable). Lower the Integral or Proportional gain, or add some Derivative.'];
    }
    var lines = [];
    if (Math.abs(a.finalError) > 2) {
      lines.push('Final error: ' + Math.abs(a.finalError).toFixed(0) + '% of the target. The output never quite reaches the target. This is steady-state error, and the Integral part removes it.');
    } else {
      lines.push('Final error: about 0%. The output ends on the target.');
    }
    if (a.overshoot > 25) {
      lines.push('Overshoot: ' + a.overshoot.toFixed(0) + '%. The output swings well past the target. Derivative or lower gains can calm it.');
    } else if (a.overshoot > 2) {
      lines.push('Overshoot: ' + a.overshoot.toFixed(0) + '%. A small swing past the target.');
    } else {
      lines.push('Overshoot: none. The output never goes past the target.');
    }
    if (a.settlingTime === null || (Math.abs(a.finalError) > 2 && a.settlingTime === 0)) {
      lines.push('Settling time: the output does not stay within 2% of the target in 20 seconds.');
    } else {
      lines.push('Settling time: ' + a.settlingTime.toFixed(1) + ' s to stay within 2% of the target.');
    }
    return lines;
  }

  function cssColor(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function draw() {
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;
    if (!width || !height || !data.length) {
      return;
    }
    var ratio = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    var left = 36;
    var right = 10;
    var top = 10;
    var bottom = 26;
    var plotW = width - left - right;
    var plotH = height - top - bottom;
    var yMax = 2;
    function px(t) { return left + (t / DURATION) * plotW; }
    function py(v) { return top + plotH - (Math.min(yMax, Math.max(0, v)) / yMax) * plotH; }

    ctx.fillStyle = cssColor('--card');
    ctx.fillRect(0, 0, width, height);
    ctx.font = '12px Inter, system-ui, sans-serif';
    ctx.lineWidth = 1;

    var v;
    var t;
    ctx.fillStyle = cssColor('--muted');
    ctx.strokeStyle = cssColor('--border');
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (v = 0; v <= yMax; v += 0.5) {
      ctx.beginPath();
      ctx.moveTo(left, py(v));
      ctx.lineTo(left + plotW, py(v));
      ctx.stroke();
      ctx.fillText(v.toFixed(1), left - 6, py(v));
    }
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (t = 0; t <= DURATION; t += 5) {
      ctx.fillText(t + ' s', Math.min(px(t), width - 14), top + plotH + 6);
    }

    // Target: dashed line at 1
    ctx.strokeStyle = cssColor('--muted');
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.moveTo(left, py(1));
    ctx.lineTo(left + plotW, py(1));
    ctx.stroke();
    ctx.setLineDash([]);

    // Output: solid line (drawn every 4th point, plenty for the screen)
    ctx.strokeStyle = cssColor('--primary-strong');
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    for (var i = 0; i < data.length; i += 4) {
      var x = px(i * STEP);
      var y = py(data[i]);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }

  function update() {
    var kp = parseFloat(sliders.kp.value);
    var ki = parseFloat(sliders.ki.value);
    var kd = parseFloat(sliders.kd.value);
    ['kp', 'ki', 'kd'].forEach(function (name) {
      document.getElementById('sim-' + name + '-out').textContent = parseFloat(sliders[name].value).toFixed(1);
    });
    data = simulate(kp, ki, kd);
    var lines = describe(analyse(data));
    results.innerHTML = '';
    lines.forEach(function (line) {
      var item = document.createElement('li');
      item.textContent = line;
      results.appendChild(item);
    });
    canvas.setAttribute('aria-label', 'Graph of the system output over 20 seconds compared with the target of 1. ' + lines.join(' '));
    draw();
  }

  ['kp', 'ki', 'kd'].forEach(function (name) {
    sliders[name].addEventListener('input', update);
  });

  Array.prototype.forEach.call(document.querySelectorAll('.sim-presets button'), function (button) {
    button.addEventListener('click', function () {
      sliders.kp.value = button.getAttribute('data-kp');
      sliders.ki.value = button.getAttribute('data-ki');
      sliders.kd.value = button.getAttribute('data-kd');
      update();
    });
  });

  // Redraw when the graph appears or changes size (the lesson is hidden until opened)
  // and when the theme changes.
  if (window.ResizeObserver) {
    new ResizeObserver(draw).observe(canvas);
  } else {
    window.addEventListener('resize', draw);
  }
  if (window.MutationObserver) {
    new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }

  update();
})();
