var Game = require('../models/Game');
var mongoose = require('mongoose');

describe('Game', function() {

  before(function(done) {
    mongoose.connect('mongodb://localhost/test');
    done();
  });

  beforeEach(function(done) {
    game = new Game();
    game.save(done);
  });

  afterEach(function(done) {
    Game.remove({}, done);
  });

  describe('#addPlayer', function() {
    it('should add a player to the game', function(done) {
      done();
    });
  });

});