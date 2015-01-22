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

    it('should create a new game', function(done) {
      var req = request(app).post('/games');
        req.cookies = cookies;
        req.set('Accept', 'application/json')
        .send({ invites: userEmails })
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          should.exist(res.body.players);
          res.body.players.length.should.equal(3);
          res.body.players.should.contain(user._id);
          done();
        });
    });

    it('should not create a game with less than three players', function(done) {
      var req = request(app).post('/games');
        req.cookies = cookies;
        req.set('Accept', 'application/json')
        .send({ invites: [userEmails[0]] })
        .expect(400)
        .end(function(err, res) {
          should.exist(err);
          done();
        });
    });
  });

  describe.skip('old tests', function() {
    it('should add a player to a game', function(done) {
      var req = request(app).post('/games/' + game._id + '/players')
      req.cookies = cookies;
      req.set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          should.exist(res.body._id);
          res.body._id.should.equal(game._id.toString());
          done();
        });
    });

    it('should create invites for a new game', function(done) {
      var req = request(app).post('/games');
      req.cookies = cookies;
      req.set('Accept', 'application/json')
        .send({
          invites: [
            'a@example.com',
            'b@example.com'
          ]
        })
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          should.exist(res.body._id);

          Invite.find({game: res.body._id}, function(err, invites) {
            should.not.exist(err);
            should.exist(invites);

            invites.length.should.equal(2);
            invites[0].email.should.equal('a@example.com');
            invites[1].email.should.equal('b@example.com');

            done();
          });
        });
    });

    describe('/assignments', function() {
      var assignment, target;

      before(function(done) {
        target = new User();
        assignment = new Assignment();

        target.save(function(err) {
          if (err) { console.error(err); }
          assignment.assassin = user._id;
          assignment.target = target._id;
          assignment.game = game._id;

          assignment.save(done);
        });
      });

      after(function(done) {
        Assignment.remove({}, done);
      });

      it('should list the assignments for a game', function(done) {
        var req = request(app).get('/games/' + game._id + '/assignments')
        req.cookies = cookies;
        req.set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            should.exist(res.body.gameId);
            should.exist(res.body.assignments);
            should.exist(res.body.assignments[0]);
            res.body.assignments[0]._id.should.equal(assignment._id.toString());
            done(err);
          });
      });
    });
  });

});
