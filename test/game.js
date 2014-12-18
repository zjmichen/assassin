var Game = require('../models/Game');
var User = require('../models/User');
var mongoose = require('mongoose');
var should = require('chai').should();

describe('Game', function() {
  var game, user;

  before(function(done) {
    mongoose.connect('mongodb://localhost/test');
    done();
  });

  beforeEach(function(done) {
    game = new Game();
    user = new User();
    done();
  });

  describe('#addPlayer', function() {
    it('should add a player to the game', function(done) {
      game.addPlayer(user, function(err) {
        should.not.exist(err);
        game.players.should.contain(user._id);
        done();
      });
    });
  });

});