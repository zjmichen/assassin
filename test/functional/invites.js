process.env.NODE_ENV = 'test';

var app = require('../../app');
var should = require('chai').should();
var request = require('supertest');
var fixtures = require('.././fixtures');
var mongoose = require('mongoose');
var Invite = require('../../models/Invite');
var User = require('../../models/User');
var Game = require('../../models/Game');

describe('/invites', function() {
  var invite, user, game;

  before(function(done) {
    mongoose.connect('mongodb://localhost/test');
    done();
  });

  after(function(done) {
    mongoose.disconnect(done);
  });

  beforeEach(function(done) {
    user = new User(fixtures.testUser);
    user.save(function(err) {
      game = new Game();
      game.save(function(err) {
        invite = new Invite({
          game: game._id,
          email: user.email
        });

        invite.save(done);
      });
    });
  });

  afterEach(function(done) {
    Invite.remove({}, function(err) {
      User.remove({}, function(err) {
        Game.remove({}, function(err) {
          done();
        });
      });
    });
  });

  describe('/invites/:inviteId/accept', function() {
    it('should accept an invite', function(done) {
      request(app)
        .post('/invites/' + invite._id + '/accept')
        .set('Accept', 'application/json')
        .send({acceptCode: invite.acceptCode})
        .expect(200)
        .end(function(err) {
          should.not.exist(err);
          Invite.findById(invite._id, function(err, invite) {
            should.not.exist(err);
            invite.accepted.should.equal(true);
            done();
          });
        });
    });

    it('should start the game when all invites are accepted', function(done) {
      var invite2 = new Invite({
        game: game._id,
        email: 'user2@example.com'
      });

      invite2.save(function(err) {
        if (err) { return done(err); }

        request(app)
          .post('/invites/' + invite._id + '/accept')
          .set('Accept', 'application/json')
          .send({acceptCode: invite.acceptCode})
          .expect(200)
          .end(function(err) {
            should.not.exist(err);

            request(app)
              .post('/invites/' + invite2._id + '/accept')
              .set('Accept', 'application/json')
              .send({acceptCode: invite2.acceptCode})
              .expect(200)
              .end(function(err) {
                should.not.exist(err);

                Game.findById(game._id, function(err, game) {
                  game.state.should.equal('playing');
                  done(err);
                });
              });
          });
      });
    });
  });
});
