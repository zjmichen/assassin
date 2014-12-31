$(document).ready(function() {
  $('#frmEmail').submit(function(evt) {
    evt.preventDefault();
    var email = evt.currentTarget.email.value;

    $.post('/mail/newsletter/signup', {
      email: email
    }, function(result) {
      $('#emailModal button').attr('disabled', 'disabled');

      $('#emailModal .modal-body').html('<p>Thanks! You\'ll be notified when Assassin is ready!</p>');
      window.setTimeout(function() {
        $('#emailModal').modal('hide');
      }, 2000);
    });
  });
});