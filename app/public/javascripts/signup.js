$(document).ready(function() {
  $('#frmEmail').submit(function(evt) {
    evt.preventDefault();
    var email = evt.currentTarget.email.value;

    $.post('/mail/newsletter/signup', {
      email: email
    }, function(result) {
      $('#btnSignup').attr('disabled', 'disabled');

      $('#emailModal .modal-body').html('<p>You will be summoned when Assassin is ready.</p>');
      window.setTimeout(function() {
        $('#emailModal').modal('hide');
      }, 2000);
    });
  });
});