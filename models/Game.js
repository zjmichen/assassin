var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GameSchema = Schema({
  state: { type: String, default: 'pending' },
  players: [{ type: Schema.Types.ObjectId, ref: 'Player' }]
});

GameSchema.static('create', function(playerIds, done) {
  if (playerIds.length < 3) {
    return done(new Error("Not enough players"));
  }

  var game = new Game({players: playerIds});
  game.save(function(err) {
    done(err, game);
  });
});

GameSchema.method('start', function(done) {
  if (this.state === 'done') {
    return done(new Error("Cannot start finished game"));
  }

  this.state = 'playing';
  this.save(done);
});

GameSchema.method('stop', function(done) {
  if (this.state === 'pending') {
    return done(new Error("Cannot stop pending game"));
  }

  this.state = 'done';
  this.save(done);
});


mongoose.model('Game', GameSchema);
var Game = mongoose.model('Game');

Game.schema.path('state').validate(function(val) {
  return /pending|playing|done/.test(val);
}, 'Invalid game state');

module.exports = Game;