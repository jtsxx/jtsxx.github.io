(function () {
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-copy');
      var el = document.getElementById(id);
      if (!el) return;
      var text = el.textContent.trim();
      function done() {
        var prev = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(function () { btn.textContent = prev; }, 1400);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () {
          fallbackCopy(text); done();
        });
      } else {
        fallbackCopy(text); done();
      }
    });
  });

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  var form = document.getElementById('waitForm');
  var email = document.getElementById('waitEmail');
  var msg = document.getElementById('waitMsg');
  if (form && email && msg) {
    try {
      var saved = localStorage.getItem('cabai_waitlist_email');
      if (saved) {
        email.value = saved;
        msg.className = 'wait-msg show ok';
        msg.textContent = 'Saved on this device: ' + saved + '. No server signup yet.';
      }
    } catch (e) {}

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var v = (email.value || '').trim();
      if (!v || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
        msg.className = 'wait-msg show warn';
        msg.textContent = 'Enter a valid email.';
        return;
      }
      try {
        localStorage.setItem('cabai_waitlist_email', v);
        msg.className = 'wait-msg show ok';
        msg.textContent = 'Saved locally on this device. Coming soon: real waitlist sync.';
      } catch (err) {
        msg.className = 'wait-msg show warn';
        msg.textContent = 'Could not save locally (storage blocked). Join Telegram for updates instead.';
      }
    });
  }
})();
