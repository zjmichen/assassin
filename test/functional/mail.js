process.env.NODE_ENV = 'test';

var app = require('../../app');
var should = require('chai').should();
var request = require('supertest');
var fixtures = require('.././fixtures');
var mongoose = require('mongoose');
var User = require('../../models/User');

describe('/mail', function() {
  var user;

  before(function(done) {
    mongoose.connect('mongodb://localhost/test');
    done();
  });

  after(function(done) {
    mongoose.disconnect(done);
  });

  beforeEach(function(done) {
    user = new User(fixtures.testUser);
    user.save(done);
  });

  afterEach(function(done) {
    User.remove({}, done);
  });

  describe('/newsletter/signup', function() {
    it('should sign up an existing user', function(done) {
      request(app)
        .post('/mail/newsletter/signup')
        .set('Accept', 'application/json')
        .send({email: user.email})
        .expect(200)
        .end(function(err, res) {
          should.not.exist(err);
          User.findById(user._id, function(err, foundUser) {
            should.not.exist(err);
            foundUser.email.should.equal(user.email);
            foundUser.receiveNewsletter.should.equal(true);
            done();
          });
        });
    });

    it('should sign up a new user', function(done) {
      request(app)
        .post('/mail/newsletter/signup')
        .set('Accept', 'application/json')
        .send({email: 'newUser@example.com'})
        .expect(200)
        .end(function(err) {
          should.not.exist(err);
          User.findOne({email: 'newUser@example.com'}, function(err, user) {
            should.not.exist(err);
            user.email.should.equal(user.email);
            user.receiveNewsletter.should.equal(true);
            done();
          });
        });

    });
  });

});
