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