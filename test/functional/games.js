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
  var user, game;

  before(function(done) {
    mongoose.connect('mongodb://localhost/test');

    user = new User(fixtures.testUser);
    user.save(function(err) {
      game = new Game(fixtures.testGame);
      game.save(done);
    });
  });

  after(function(done) {
    User.remove({}, function() {
      Game.remove({}, function() {
        mongoose.disconnect(done);
      });
    });
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

  it('should create invites for a new game', function(done) {
    request(app)
      .post('/games')
      .set('Accept', 'application/json')
      .send({
        playerId: user._id.toString(),
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
      request(app)
        .get('/games/' + game._id + '/assignments')
        .set('Accept', 'application/json')
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
