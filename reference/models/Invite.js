var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InviteSchema = Schema({
  game: { type: Schema.Types.ObjectId, ref: 'Game' },
  player: { type: Schema.Types.ObjectId, ref: 'Player' },
  email: { type: String, validator: validEmail },
  acceptCode: { type: String, default: createCode },
  accepted: { type: Boolean, default: false },
  expires: { type: Date, default: tomorrow }
});

InviteSchema.static('createFromUsers', function(users, game, done) {
  Invite.create(users.map(function(user) {
    return {
      email: user.email,
      game: game._id,
      player: user._id
    };
  }), function(err, invites) {
    // convert list of args into an array
    done(err, invites);
  });
});

function tomorrow() {
  var t = new Date();
  t.setDate(t.getDate() + 1);
  return t;
}

function createCode() {

}

function validEmail(str) {
  return /@/.test(str);
}

mongoose.model('Invite', InviteSchema);
var Invite = mongoose.model('Invite');

module.exports = Invite;