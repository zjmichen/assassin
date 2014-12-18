var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
  profile: Object
});



mongoose.model('User', UserSchema);
var User = mongoose.model('User');
module.exports = User;