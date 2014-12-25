$(document).ready(function() {
  $('#frmEmail').submit(function(evt) {
    evt.preventDefault();
    var email = evt.currentTarget.email.value;

    $.post('/users?emailSignup=1', {
      email: email
    }, function(result) {
      $('#emailModal').modal('hide');
    });
  });
});