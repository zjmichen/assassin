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

GameSchema.method('start', function(done) {
  if (this.state === 'pending') {
    this.state = 'playing';
    done(null);
  } else {
    done('Game has already started');
  }
});

GameSchema.method('end', function(done) {
  this.state = 'done';
  done(null);
});

mongoose.model('Game', GameSchema);
var Game = mongoose.model('Game');
module.exports = Game;