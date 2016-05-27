process.env.NODE_ENV = 'test';

var app = require('../../app');
var should = require('chai').should();
var request = require('supertest');
var User = require('../../models/User');
var Game = require('../../models/Game');
var Assignment = require('../../models/Assignment');
var Invite = require('../../models/Invite');
var fixtures = require('.././fixtures');
var mongoose = require('mongoose');

describe('/games', function() {
  var user, game, cookies;

  before(function(done) {
    mongoose.connect('mongodb://localhost/test');

    user = new User(fixtures.testUser);
    user.save(function(err) {
      request(app)
        .post('/sessions')
        .set('Accept', 'application/json')
        .send({id: user._id})
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          cookies = res.headers['set-cookie'].pop().split(';')[0];

          game = new Game({
            players: [user._id]
          });
          game.save(done);
        });
    });
  });

  after(function(done) {
    User.remove({}, function() {
      Game.remove({}, function() {
        mongoose.disconnect(done);
      });
    });
  });

  describe('POST /games', function() {
    var userEmails = ['user1@example.com', 'user2@example.com'];
    var users = [
      new User({email: userEmails[0]}),
      new User({email: userEmails[1]})
    ];

    it('should create a new game with emails', function(done) {
      var req = request(app).post('/games');
        req.cookies = cookies;
        req.set('Accept', 'application/json')
        .send({ invites: userEmails })
        .expect(200)
        .end(function(err, res) {
          if (res.error) {
            throw new Error(res.error.text);
          }

          should.exist(res.body.players);
          res.body.players.length.should.equal(3);
          res.body.players.should.contain(user._id.toString());
          done();
        });
    });

    it('should create a new game with user ids', function(done) {
      var req = request(app).post('/games');
        req.cookies = cookies;
        req.set('Accept', 'application/json')
        .send({ players: [users[0]._id, users[1]._id] })
        .expect(200)
        .end(function(err, res) {
          if (res.error) {
            throw new Error(res.error.text);
          }

          should.exist(res.body.players);
          res.body.players.length.should.equal(3);
          res.body.players.should.contain(user._id.toString());
          done();
        });
    });

    it('should not create a game with less than three players', function(done) {
      var req = request(app).post('/games');
        req.cookies = cookies;
        req.set('Accept', 'application/json')
        .send({ invites: [userEmails[0]] })
        .expect(400)
        .end(done);
    });
  });

});
