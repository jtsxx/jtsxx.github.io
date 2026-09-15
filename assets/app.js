(function () {
  var step = 0;
  var screens = Array.prototype.slice.call(document.querySelectorAll('.screen'));
  var stepBtns = Array.prototype.slice.call(document.querySelectorAll('.step-btn'));
  var camVideo = document.querySelector('[data-cam-video]');
  var camTs = document.querySelector('[data-cam-ts]');
  var camToggle = document.querySelector('[data-cam-toggle]');
  var tsTimer = null;

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function tickTs() {
    if (!camTs) return;
    var d = new Date();
    camTs.textContent =
      d.getFullYear() + '-' +
      pad(d.getMonth() + 1) + '-' +
      pad(d.getDate()) + '  ' +
      pad(d.getHours()) + ':' +
      pad(d.getMinutes()) + ':' +
      pad(d.getSeconds());
  }

  function syncCam(active) {
    if (!camVideo) return;
    if (active) {
      tickTs();
      if (!tsTimer) tsTimer = setInterval(tickTs, 1000);
      var playPromise = camVideo.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () { /* autoplay may be blocked until gesture */ });
      }
      if (camToggle) {
        camToggle.textContent = camVideo.paused ? '▶' : '❚❚';
        camToggle.setAttribute('aria-label', camVideo.paused ? 'Play dashcam preview' : 'Pause dashcam preview');
      }
    } else {
      if (tsTimer) {
        clearInterval(tsTimer);
        tsTimer = null;
      }
      camVideo.pause();
    }
  }

  function go(n) {
    if (n < 0 || n >= screens.length) return;
    step = n;
    screens.forEach(function (s, i) {
      s.classList.toggle('active', i === step);
    });
    stepBtns.forEach(function (b, i) {
      b.classList.toggle('active', i === step);
    });
    syncCam(step === 3);
  }

  stepBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      go(parseInt(btn.getAttribute('data-step'), 10));
    });
  });

  document.querySelectorAll('[data-next]').forEach(function (btn) {
    btn.addEventListener('click', function () { go(step + 1); });
  });
  document.querySelectorAll('[data-prev]').forEach(function (btn) {
    btn.addEventListener('click', function () { go(step - 1); });
  });
  document.querySelectorAll('[data-restart]').forEach(function (btn) {
    btn.addEventListener('click', function () { go(0); });
  });

  function selectGroup(selector, item) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.classList.remove('selected');
    });
    item.classList.add('selected');
  }

  document.querySelectorAll('.veh-card').forEach(function (card) {
    card.addEventListener('click', function () { selectGroup('.veh-card', card); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectGroup('.veh-card', card);
      }
    });
  });

  document.querySelectorAll('.playlist').forEach(function (pl) {
    pl.addEventListener('click', function () { selectGroup('.playlist', pl); });
    pl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectGroup('.playlist', pl);
      }
    });
  });

  if (camToggle && camVideo) {
    camToggle.addEventListener('click', function () {
      if (camVideo.paused) {
        camVideo.play();
        camToggle.textContent = '❚❚';
        camToggle.setAttribute('aria-label', 'Pause dashcam preview');
      } else {
        camVideo.pause();
        camToggle.textContent = '▶';
        camToggle.setAttribute('aria-label', 'Play dashcam preview');
      }
    });
  }

  // If view mode is already active (deep-link / restore), sync once
  if (document.querySelector('.screen[data-screen="3"].active')) {
    syncCam(true);
  }
})();
