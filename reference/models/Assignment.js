var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AssignmentSchema = Schema({
  game: { type: Schema.Types.ObjectId, ref: 'Game' },
  assassin: { type: Schema.Types.ObjectId, ref: 'Player' },
  target: { type: Schema.Types.ObjectId, ref: 'Player' },
  completed: { type: Boolean, default: false },
  confirmed: { type: Boolean, default: false }
});

mongoose.model('Assignment', AssignmentSchema);
var Assignment = mongoose.model('Assignment');

module.exports = Assignment;