var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GameSchema = Schema({
  players: [{ type: Schema.Types.ObjectId, ref: 'Player' }]
});

GameSchema.method('addPlayer', function(player, done) {
  this.players.push(player);
  done(null);
});

mongoose.model('Game', GameSchema);
var Game = mongoose.model('Game');
module.exports = Game;