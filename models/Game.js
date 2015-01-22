var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GameSchema = Schema({
  state: { type: String, default: 'pending' },
  players: [{ type: Schema.Types.ObjectId, ref: 'Player' }]
});

GameSchema.static('create', function(playerIds, done) {
  var game = new Game({players: playerIds});
  game.save(function(err) {
    done(err, game);
  });
});

GameSchema.method('addPlayer', function(player, done) {
  if (this.state === 'pending') {
    this.players.push(player);
    this.save(done);
  } else {
    done('Game in progress');
  }
});

GameSchema.method('start', function(done) {
  if (this.state === 'pending') {
    this.state = 'playing';
    this.save(done);
  } else {
    done('Game has already started');
  }
});

GameSchema.method('end', function(done) {
  this.state = 'done';
  this.save(done);
});

mongoose.model('Game', GameSchema);
var Game = mongoose.model('Game');

Game.schema.path('state').validate(function(val) {
  return /pending|playing|done/.test(val);
}, 'Invalid game state');

module.exports = Game;