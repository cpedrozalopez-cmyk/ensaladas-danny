/*
 * Ensaladas Danny · comportamiento del sitio
 *
 * PARA LANZAR EL NEGOCIO: cambia demo a false y llena los tres datos reales.
 *   whatsapp: número con indicativo, solo dígitos (ej. '573001234567')
 *   instagram / tiktok: enlace completo al perfil
 * Con demo en true los botones solo muestran un aviso y no contactan a nadie.
 */
var CONFIG = {
  demo: true,
  whatsapp: '',
  instagram: '',
  tiktok: ''
};

(function () {
  var esReal = !CONFIG.demo && /^\d{10,15}$/.test(CONFIG.whatsapp);
  if (esReal) document.documentElement.classList.add('es-real');

  var form = document.getElementById('armador');
  var mensaje = document.getElementById('mensaje');
  var dialog = document.getElementById('demo');
  var demoTexto = document.getElementById('demo-texto');
  var demoMensaje = document.getElementById('demo-mensaje');
  var MENSAJE_GENERAL = 'Hola, Danny. Quiero pedir una ensalada de frutas. ¿Qué opciones tienen hoy?';
  var REDES = { instagram: 'Instagram', tiktok: 'TikTok' };

  function valor(nombre) {
    var el = form.querySelector('input[name="' + nombre + '"]:checked');
    return el ? el.value : '';
  }

  function armarMensaje() {
    var gustos = form.gustos.value.trim();
    var texto = 'Hola, Danny. Quiero una ensalada ' + valor('idea') + ', ' + valor('aderezo') + '.';
    if (gustos) texto += '\nPreferencias: ' + gustos + '.';
    texto += '\n¿Qué frutas tienen hoy y cuánto cuesta el domicilio a mi barrio?';
    return texto;
  }

  function actualizar() { mensaje.textContent = armarMensaje(); }
  form.addEventListener('input', actualizar);
  form.addEventListener('change', actualizar);
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  actualizar();

  function abrirDemo(texto, msg) {
    demoTexto.textContent = texto;
    demoMensaje.hidden = !msg;
    demoMensaje.textContent = msg || '';
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else alert(texto);
  }

  // Botones de pedido por WhatsApp
  document.querySelectorAll('.js-pedir').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var msg = btn.dataset.conMensaje ? armarMensaje() : MENSAJE_GENERAL;
      if (esReal) {
        window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
        return;
      }
      abrirDemo('Este botón todavía no abre WhatsApp ni envía datos. Cuando el negocio esté activo, aquí se abrirá el chat de Ensaladas Danny con este mensaje:', msg);
    });
  });

  // Botones de redes sociales
  document.querySelectorAll('.js-social').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var red = btn.dataset.red;
      if (!CONFIG.demo && CONFIG[red]) {
        window.open(CONFIG[red], '_blank', 'noopener');
        return;
      }
      abrirDemo('Cuando el negocio esté activo, este botón abrirá el perfil de Ensaladas Danny en ' + REDES[red] + '. Por ahora es una demostración y no lleva a ninguna cuenta.');
    });
  });

  // "Quiero esta" en las tarjetas: elige la idea y baja al armador
  document.querySelectorAll('.js-elegir').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var radio = form.querySelector('input[name="idea"][value="' + btn.dataset.idea + '"]');
      if (radio) { radio.checked = true; actualizar(); }
      document.getElementById('armador').scrollIntoView({ block: 'center' });
      if (radio) radio.focus({ preventScroll: true });
    });
  });

  // Cerrar el aviso al tocar fuera de él
  dialog.addEventListener('click', function (e) {
    var r = dialog.getBoundingClientRect();
    var fuera = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    if (e.target === dialog && fuera) dialog.close();
  });

  // En celular, la barra fija se esconde cuando el armador o el cierre ya muestran su botón
  var barra = document.querySelector('.sticky-cta');
  if ('IntersectionObserver' in window && barra) {
    var visibles = new Set();
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) { en.isIntersecting ? visibles.add(en.target) : visibles.delete(en.target); });
      barra.classList.toggle('oculta', visibles.size > 0);
    }, { threshold: 0.35 });
    document.querySelectorAll('.preview, .cta-final').forEach(function (el) { io.observe(el); });
  }
})();
