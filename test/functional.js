var app = require('../app');
var should = require('chai').should();
var request = require('supertest');
var User = require('../models/User');
var Game = require('../models/Game');
var fixtures = require('./fixtures');
var mongoose = require('mongoose');

describe('routes', function() {
  var user;

  before(function(done) {
    mongoose.connect('mongodb://localhost/test');
    user = new User(fixtures.testUser);
    user.save(done);
  });

  after(function(done) {
    mongoose.disconnect(done);
  });

  describe('/sessions', function() {
    it('should add a session and log in a user', function(done) {
      request(app)
        .post('/sessions')
        .send({user: user})
        .expect('Logged in')
        .expect(200)
        .end(done);
    });
  });

  describe('/games', function() {
    var game;

    before(function(done) {
      game = new Game(fixtures.testGame);
      game.save(done);
    });

    it('should add a player to a game', function(done) {
      request(app)
        .post('/games/' + game._id.toString())
        .send({playerId: user._id.toString()})
        .expect(200)
        .expect('Player ' + user._id + ' joined game ' + game._id)
        .end(done);
    });

    it('should create a new game', function(done) {
      request(app)
        .post('/games/')
        .send({playerId: user._id.toString()})
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          Game.findById(res.id, function(err, game) {
            should.not.exist(err);
            should.exist(game);
            game.should.not.equal(undefined);
            game.players.should.contain(user._id.toString());
            done();
          });
        });
    });

  });

});