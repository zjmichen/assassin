var app = require('../app');
var should = require('chai').should();
var request = require('supertest');
var User = require('../models/User');
var Game = require('../models/Game');
var fixtures = require('./fixtures');
var mongoose = require('mongoose');

describe('routes', function() {
  var user, cookies;

  before(function(done) {
    mongoose.connect('mongodb://localhost/test');

    user = new User(fixtures.testUser);
    user.save(done);
  });

  after(function(done) {
    User.remove({}, function() {
      mongoose.disconnect(done);
    });
  });

  describe('/sessions', function() {
    it('should log in a user', function(done) {
      request(app)
        .post('/sessions')
        .set('Accept', 'application/json')
        .send({id: user._id})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          res.body._id.should.equal(user._id.toString());
          cookies = res.headers['set-cookie'].pop().split(';')[0];
          done(err);
        });
    });

    it('should get the current user session', function(done) {
      var req = request(app).get('/sessions');
      req.cookies = cookies;
      req.set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
          should.exist(res.body._id);
          res.body._id.should.equal(user._id.toString());
          done(err);
        });
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
        .set('Accept', 'application/json')
        .send({playerId: user._id.toString()})
        .expect(200)
        .end(function(err, res) {
          should.exist(res.body._id);
          res.body._id.should.equal(game._id.toString());
          done(err);
        });
    });

    it('should create a new game', function(done) {
      request(app)
        .post('/games/')
        .set('Accept', 'application/json')
        .send({playerId: user._id.toString()})
        .expect(200)
        .end(function(err, res) {
          should.exist(res.body.players);
          res.body.players.should.contain(user._id.toString());
          done(err);
        });
    });

  });

});