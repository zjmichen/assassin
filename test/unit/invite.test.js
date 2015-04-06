var Invite = require('../../models/Invite');
var User = require('../../models/User');
var Game = require('../../models/Game');
var mongoose = require('mongoose');
var should = require('chai').should();

describe('Invite', function() {
  var user1, user2, game;

  before(function(done) {
    mongoose.connect('mongodb://localhost/test', done);
  });

  after(function(done) {
    mongoose.disconnect(done);
  });

  beforeEach(function(done) {
    game = new Game();
    user1 = new User({email: "user1@example.com"});
    user2 = new User({email: "user2@example.com"});
    done();
  });

  describe('#createFromUsers', function() {
    it('should create invites given some users', function(done) {
      Invite.createFromUsers([user1, user2], game, function(err, invites) {
        should.not.exist(err);
        invites.length.should.equal(2);
        done();
      });
    });
  });

});