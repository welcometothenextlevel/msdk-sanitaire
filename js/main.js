/* M-SDK Sanitaire — interactions */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---- année ---- */
  var y = $('#year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---- header collé ---- */
  var header = $('.header');
  var onScroll = function () {
    header.classList.toggle('is-stuck', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- apparition au défilement ---- */
  var reveals = $$('.reveal');
  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---- visionneuse photos ---- */
  var lb      = $('#lightbox');
  var lbImg   = $('#lb-img');
  var lbCap   = $('#lb-cap');
  var buttons = $$('#gallery button');
  var index   = 0;
  var lastFocus = null;

  function show(i) {
    index = (i + buttons.length) % buttons.length;
    var b = buttons[index];
    lbImg.src = b.dataset.src;
    lbImg.alt = $('img', b).alt;
    lbCap.textContent = b.dataset.cap || '';
  }
  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    $('.lb-close', lb).focus();
  }
  function close() {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  buttons.forEach(function (b, i) {
    b.addEventListener('click', function () { open(i); });
  });
  if (lb) {
    $('.lb-close', lb).addEventListener('click', close);
    $('.lb-prev',  lb).addEventListener('click', function () { show(index - 1); });
    $('.lb-next',  lb).addEventListener('click', function () { show(index + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowLeft')  show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
    /* balayage tactile */
    var x0 = null;
    lb.addEventListener('touchstart', function (e) { x0 = e.changedTouches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 55) show(index + (dx < 0 ? 1 : -1));
      x0 = null;
    }, { passive: true });
  }

  /* ---- sélecteur de problème du héros ----
     Préremplit le formulaire avec le problème choisi et y amène le visiteur,
     pour qu'il n'ait plus qu'à laisser son numéro. */
  var picks = $$('.quickpick button');
  picks.forEach(function (b) {
    b.addEventListener('click', function () {
      var problem = b.dataset.problem || '';
      var card = $('#form-card');
      var sel  = $('#f-obj');
      var msg  = $('#f-msg');

      if (sel) {
        var wanted = /radiateur|chauffage/i.test(problem) ? 'Chauffage' : 'Dépannage / réparation';
        for (var i = 0; i < sel.options.length; i++) {
          if (sel.options[i].text === wanted) { sel.selectedIndex = i; break; }
        }
      }
      if (msg && !msg.value.trim()) { msg.value = problem + ' — '; }

      var target = document.getElementById('devis');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      if (card) {
        card.classList.add('is-flagged');
        window.setTimeout(function () { card.classList.remove('is-flagged'); }, 2200);
      }
      window.setTimeout(function () {
        if (msg) { msg.focus(); msg.setSelectionRange(msg.value.length, msg.value.length); }
      }, 700);
    });
  });

  /* ---- formulaire de devis ---- */
  var form = $('#quote-form');
  var card = $('#form-card');

  var MSG = {
    nom:      'Merci d’indiquer votre nom.',
    tel:      'Merci d’indiquer un numéro de téléphone valable.',
    email:    'Cette adresse e-mail semble incomplète.',
    localite: 'Merci d’indiquer votre localité.',
    objet:    'Merci de choisir la nature de la demande.',
    message:  'Décrivez la situation en quelques mots (20 caractères minimum).'
  };

  function setError(field, msg) {
    var box = $('[data-err-for="' + field.id + '"]');
    if (box) box.textContent = msg || '';
    if (msg) field.setAttribute('aria-invalid', 'true');
    else     field.removeAttribute('aria-invalid');
    return !msg;
  }

  function validate(field) {
    var v = (field.value || '').trim();
    switch (field.name) {
      case 'nom':      return setError(field, v.length >= 2 ? '' : MSG.nom);
      case 'localite': return setError(field, v.length >= 2 ? '' : MSG.localite);
      case 'objet':    return setError(field, v ? '' : MSG.objet);
      case 'message':  return setError(field, v.length >= 20 ? '' : MSG.message);
      case 'tel':
        return setError(field, v.replace(/[^\d]/g, '').length >= 9 ? '' : MSG.tel);
      case 'email':
        if (!v) return setError(field, '');
        return setError(field, /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : MSG.email);
      default: return true;
    }
  }

  if (form) {
    $$('input, select, textarea', form).forEach(function (f) {
      if (f.name === 'societe') return;
      f.addEventListener('blur', function () { validate(f); });
      f.addEventListener('input', function () {
        if (f.hasAttribute('aria-invalid')) validate(f);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      /* piège à robots */
      if (form.societe && form.societe.value) return;

      var fields = $$('input, select, textarea', form).filter(function (f) { return f.name !== 'societe'; });
      var ok = true;
      var first = null;
      fields.forEach(function (f) {
        if (!validate(f)) { ok = false; if (!first) first = f; }
      });

      if (!ok) { first.focus(); first.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }

      /* DÉMO — aucune donnée n’est transmise.
         Pour la mise en production, remplacez ce bloc par un envoi vers
         le service de réception choisi (Web3Forms, Formspree, etc.). */
      var btn = $('#submit-btn');
      btn.disabled = true;
      btn.textContent = 'Envoi en cours…';

      window.setTimeout(function () {
        card.classList.add('is-sent');
        card.scrollIntoView({ block: 'center', behavior: 'smooth' });
        $('#form-ok').focus && $('#form-ok').focus();
      }, 650);
    });
  }
})();
