/* ════════════════════════════════════════════
   004 — Agencia de Marketing
   Interacciones de la landing page
   ════════════════════════════════════════════ */

(function () {
  'use strict';

  /**
   * Endpoint al que se envía el formulario.
   * Déjalo en null para usar el modo demo (no se envía nada, solo muestra
   * el estado de éxito). Cuando tengas backend, Formspree, HubSpot, etc.,
   * pon aquí la URL y el formulario hará un POST real en JSON.
   */
  var FORM_ENDPOINT = null;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── Año en el footer ─────────────────── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ─── Header con borde al hacer scroll ─── */
  var header = document.getElementById('header');
  var onScroll = function () {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─── Menú móvil ───────────────────────── */
  var menuToggle = document.getElementById('menuToggle');
  var nav = document.getElementById('nav');

  var closeMenu = function () {
    nav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú');
  };

  menuToggle.addEventListener('click', function () {
    var isOpen = nav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });

  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') closeMenu();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ─── Animación de entrada ─────────────── */
  var revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // Escalonado suave entre elementos hermanos que entran a la vez
        el.style.transitionDelay = Math.min(i * 70, 280) + 'ms';
        el.classList.add('is-visible');
        revealObserver.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ─── Contadores de métricas ───────────── */
  var counters = document.querySelectorAll('[data-count]');

  var animateCount = function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (prefersReducedMotion) { el.textContent = target; return; }

    var duration = 1200;
    var start = performance.now();

    var tick = function (now) {
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { countObserver.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
  }

  /* ─── Tabs: reunión / cotización ───────── */
  var tabs = document.querySelectorAll('.tab');
  var form = document.getElementById('contactForm');
  var tipoInput = document.getElementById('tipoSolicitud');
  var submitBtn = document.getElementById('submitBtn');
  var submitLabel = submitBtn.querySelector('.btn__label');
  var successBox = document.getElementById('formSuccess');
  var successMsg = document.getElementById('successMsg');

  var COPY = {
    reunion: {
      button: 'Agendar reunión',
      success: 'Gracias. Te confirmaremos la reunión por email en menos de 24 horas hábiles.'
    },
    cotizacion: {
      button: 'Solicitar cotización',
      success: 'Gracias. Recibirás una propuesta con alcance e inversión en un máximo de 72 horas.'
    }
  };

  var setIntent = function (intent) {
    if (!COPY[intent]) intent = 'reunion';
    tipoInput.value = intent;
    submitLabel.textContent = COPY[intent].button;
    form.setAttribute('aria-labelledby', 'tab-' + intent);

    tabs.forEach(function (tab) {
      var active = tab.dataset.intent === intent;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    });

    document.querySelectorAll('[data-only]').forEach(function (block) {
      var show = block.dataset.only === intent;
      block.hidden = !show;
      // Los campos ocultos no deben validarse ni enviarse
      block.querySelectorAll('input, select, textarea').forEach(function (input) {
        input.disabled = !show;
      });
    });
  };

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () { setIntent(tab.dataset.intent); });
  });

  // Los CTA del hero y del cierre preseleccionan la pestaña correspondiente
  document.querySelectorAll('a[data-intent]').forEach(function (link) {
    link.addEventListener('click', function () { setIntent(link.dataset.intent); });
  });

  setIntent('reunion');

  // Al recargar, el navegador restaura los valores del formulario (incluido el
  // input oculto). Volvemos a sincronizar tomando la pestaña activa como fuente.
  window.addEventListener('pageshow', function () {
    var active = document.querySelector('.tab.is-active');
    setIntent(active ? active.dataset.intent : 'reunion');
  });

  /* ─── Fecha mínima: hoy ────────────────── */
  var fecha = document.getElementById('fecha');
  if (fecha) fecha.min = new Date().toISOString().split('T')[0];

  /* ─── Validación ───────────────────────── */
  var showError = function (name, message) {
    var msgEl = document.querySelector('[data-error-for="' + name + '"]');
    var field = document.getElementById(name);
    if (msgEl) msgEl.textContent = message;
    if (field && field.closest('.field')) {
      field.closest('.field').classList.toggle('has-error', Boolean(message));
    }
  };

  var clearErrors = function () {
    form.querySelectorAll('.error').forEach(function (el) { el.textContent = ''; });
    form.querySelectorAll('.has-error').forEach(function (el) { el.classList.remove('has-error'); });
  };

  var validate = function () {
    clearErrors();
    var errors = [];

    var nombre = document.getElementById('nombre');
    if (nombre.value.trim().length < 3) {
      showError('nombre', 'Escribe tu nombre completo.');
      errors.push(nombre);
    }

    var email = document.getElementById('email');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
      showError('email', 'Ingresa un email válido.');
      errors.push(email);
    }

    var empresa = document.getElementById('empresa');
    if (empresa.value.trim() === '') {
      showError('empresa', 'Indica el nombre de tu empresa.');
      errors.push(empresa);
    }

    var servicio = document.getElementById('servicio');
    if (servicio.value === '') {
      showError('servicio', 'Selecciona el servicio que te interesa.');
      errors.push(servicio);
    }

    var presupuesto = document.getElementById('presupuesto');
    if (tipoInput.value === 'cotizacion' && presupuesto.value === '') {
      showError('presupuesto', 'Selecciona un rango para poder cotizar.');
      errors.push(presupuesto);
    }

    var privacidad = document.getElementById('privacidad');
    if (!privacidad.checked) {
      showError('privacidad', 'Necesitamos tu autorización para contactarte.');
      errors.push(privacidad);
    }

    return errors;
  };

  // Limpia el error del campo en cuanto el usuario lo corrige
  form.addEventListener('input', function (e) {
    if (e.target.id) showError(e.target.id, '');
  });

  /* ─── Envío ────────────────────────────── */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var errors = validate();
    if (errors.length) {
      errors[0].focus();
      return;
    }

    var data = Object.fromEntries(new FormData(form).entries());
    data.enviado_en = new Date().toISOString();

    submitBtn.disabled = true;
    submitLabel.textContent = 'Enviando…';

    var done = function () {
      var intent = tipoInput.value;
      successMsg.textContent = COPY[intent].success;
      form.hidden = true;
      document.querySelector('.tabs').hidden = true;
      successBox.hidden = false;
      successBox.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
    };

    var fail = function () {
      submitBtn.disabled = false;
      submitLabel.textContent = COPY[tipoInput.value].button;
      showError('email', 'No pudimos enviar la solicitud. Escríbenos a hola@004.agency.');
    };

    if (!FORM_ENDPOINT) {
      // Modo demo: sin backend conectado
      console.info('[004] Formulario en modo demo. Datos capturados:', data);
      setTimeout(done, 600);
      return;
    }

    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (res) { return res.ok ? done() : fail(); })
      .catch(fail);
  });

  /* ─── Reiniciar formulario ─────────────── */
  document.getElementById('resetForm').addEventListener('click', function () {
    form.reset();
    clearErrors();
    setIntent('reunion');
    submitBtn.disabled = false;
    successBox.hidden = true;
    form.hidden = false;
    document.querySelector('.tabs').hidden = false;
    document.getElementById('nombre').focus();
  });

})();
