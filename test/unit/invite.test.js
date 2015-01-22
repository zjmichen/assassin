var Invite = require('../../models/Invite');
var User = require('../../models/User');
var Game = require('../../models/Game');
var mongoose = require('mongoose');
var should = require('chai').should();

describe('Invite', function() {
  var user1, user2, game;

  beforeEach(function(done) {
    game = new Game();
    user1 = new User();
    user2 = new User();
    done();
  });

  describe('#createFromUsers', function() {
    it('should create invites given some users', function(done) {
      console.log('about to create');
      Invite.createFromUsers([user1, user2], game, function(err, users) {
        console.log('created');
        should.not.exist(err);
        users.length.should.equal(2);
        done();
      });
    });
  });

});