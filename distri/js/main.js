// ==========================================================================
// Script Javascript / JQuery para el Módulo 4 - Control de Eventos del Modal
// ==========================================================================

$(document).ready(function() {

  var $btnAbrirModal = $('#btnAbrirModal');

  // 1. Evento: cuando el modal comienza a abrirse (show.bs.modal)
  // El botón que activa el modal se inhabilita y cambia de color
  $('#registroModal').on('show.bs.modal', function(e) {
    console.log('[EVENTO MODAL 1/4] show.bs.modal: El modal comienza a abrirse.');
    $btnAbrirModal.prop('disabled', true)
                  .removeClass('btn-primary')
                  .addClass('btn-secondary');
  });

  // 2. Evento: cuando el modal se terminó de abrir (shown.bs.modal)
  $('#registroModal').on('shown.bs.modal', function(e) {
    console.log('[EVENTO MODAL 2/4] shown.bs.modal: El modal se terminó de abrir por completo.');
    $('#modalNombre').trigger('focus');
  });

  // 3. Evento: cuando el modal comienza a ocultarse (hide.bs.modal)
  $('#registroModal').on('hide.bs.modal', function(e) {
    console.log('[EVENTO MODAL 3/4] hide.bs.modal: El modal comienza a ocultarse.');
  });

  // 4. Evento: cuando el modal se terminó de ocultar (hidden.bs.modal)
  // El botón que activa el modal se vuelve a activar y pasa al color original
  $('#registroModal').on('hidden.bs.modal', function(e) {
    console.log('[EVENTO MODAL 4/4] hidden.bs.modal: El modal se terminó de ocultar por completo.');
    $btnAbrirModal.prop('disabled', false)
                  .removeClass('btn-secondary')
                  .addClass('btn-primary');
  });

  // Manejo de confirmación al enviar el formulario del modal
  $('#formRegistroModal').on('submit', function(e) {
    e.preventDefault();
    var nombre = $('#modalNombre').val();

    $('#registroModal').modal('hide');

    $('#alertContainer').html(
      '<div class="alert alert-success alert-dismissible fade show shadow-sm" role="alert">' +
        '<strong><span class="oi oi-circle-check mr-1"></span> ¡Excelente!</strong> ' +
        $('<div>').text(nombre).html() + ', tus datos fueron procesados. Podés abrir la consola (F12) para ver los 4 eventos registrados.' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
          '<span aria-hidden="true">&times;</span>' +
        '</button>' +
      '</div>'
    );

    this.reset();
  });

});
