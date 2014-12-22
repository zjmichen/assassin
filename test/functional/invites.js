var app = require('../../app');
var should = require('chai').should();
var request = require('supertest');
var fixtures = require('.././fixtures');
var mongoose = require('mongoose');
var Invite = require('../../models/Invite');
var User = require('../../models/User');

describe('/invites', function() {
  var invite, user;

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
      invite = new Invite({
        email: user.email
      });

      invite.save(done);
    });
  });

  afterEach(function(done) {
    Invite.remove({}, done);
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
  });
});
