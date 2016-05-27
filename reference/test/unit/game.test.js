var Game = require('../../models/Game');
var User = require('../../models/User');
var mongoose = require('mongoose');
var should = require('chai').should();



describe('Game', function() {

  before(function(done) {
    mongoose.connect('mongodb://localhost/test', done);
  });

  after(function(done) {
    mongoose.disconnect(done);
  });


  describe('#create', function() {
    var playerIds;

    beforeEach(function(done) {
      playerIds = [
        new User()._id,
        new User()._id,
        new User()._id
      ];

      done();
    });

    afterEach(function(done) {
      User.findById(playerIds).remove().exec();
      done();
    });

    it('should create a game in pending state', function(done) {
      Game.create(playerIds, function(err, game) {
        should.not.exist(err);
        game.state.should.equal('pending');
        done();
      });
    });

    it('should not create a game with fewer than 3 players', function(done) {
      var fewerPlayers = [playerIds[0], playerIds[1]];

      Game.create(fewerPlayers, function(err, game) {
        should.exist(err);
        err.message.should.equal('Not enough players');
        done();
      });
    });

  });

  describe('#start', function() {
    var game;

    beforeEach(function(done) {
      game = new Game();
      done();
    });

    afterEach(function(done) {
      Game.findById(game._id).remove().exec(done);
    });

    it('should change the game state to "playing"', function(done) {
      game.state.should.equal('pending');
      game.start(function(err, game) {
        should.not.exist(err);
        game.state.should.equal('playing');
        done();
      });
    });

    it('should not change a finished game', function(done) {
      game.state = "done";
      game.save(function(err) {
        should.not.exist(err);
        game.start(function(err, game) {
          should.exist(err);
          err.message.should.equal("Cannot start finished game");
          done();
        });
      });
    });
  });

  describe('#stop', function() {
    var game;

    beforeEach(function(done) {
      game = new Game();
      done();
    });

    afterEach(function(done) {
      Game.findById(game._id).remove().exec(done);
    });

    it('should change the game state to "done"', function(done) {
      game.state = "playing";
      game.save(function(err) {
        should.not.exist(err);
        game.stop(function(err, game) {
          should.not.exist(err);
          game.state.should.equal("done");
          done();
        });
      });
    });

    it('should not change the state of a pending game', function(done) {
      game.stop(function(err, game) {
        should.exist(err);
        err.message.should.equal("Cannot stop pending game");
        done();
      });
    });
  });

});










