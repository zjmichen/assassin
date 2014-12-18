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

    it('should not add a player to a game in progress', function(done) {
      game.state = 'playing';
      game.addPlayer(user, function(err) {
        err.should.equal('Game in progress');
        done();
      });
    });
  });

  describe('#start', function() {
    it('should change the game state to "playing"', function(done) {
      game.state.should.equal('pending');
      game.start(function(err) {
        should.not.exist(err);
        game.state.should.equal('playing');
        done();
      });
    });

    it('should error if the game is not pending', function(done) {
      game.state.should.equal('pending');
      game.start(function(err) {
        should.not.exist(err);
        game.start(function(err) {
          err.should.equal('Game has already started');
          done();
        });
      });
    });
  });

  describe('#end', function() {
    it('should change the game state to "done"', function(done) {
      game.state = 'playing';
      game.end(function(err) {
        should.not.exist(err);
        game.state.should.equal('done');
        done();
      });
    });
  });

});