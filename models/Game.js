var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GameSchema = Schema({
  state: { type: String, default: 'pending' },
  players: [{ type: Schema.Types.ObjectId, ref: 'Player' }]
});

GameSchema.method('addPlayer', function(player, done) {
  if (this.state === 'pending') {
    this.players.push(player);
    done(null);
  } else {
    done('Game in progress');
  }
});

mongoose.model('Game', GameSchema);
var Game = mongoose.model('Game');
module.exports = Game;