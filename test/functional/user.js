process.env.NODE_ENV = 'test';

var app = require('../../app');
var should = require('chai').should();
var request = require('supertest');
var User = require('../../models/User');
var fixtures = require('.././fixtures');
var mongoose = require('mongoose');

describe('/users', function() {
  var user;

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

  it('should register a new user to receive a newsletter', function(done) {
    request(app)
      .post('/users?emailSignup=1')
      .set('Accept', 'application/json')
      .send({email: 'newUser@example.com'})
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        User.findOne({email: 'newUser@example.com'}, function(err, user) {
          should.not.exist(err);
          should.exist(user);
          user.email.should.equal('newUser@example.com');
          done();
        });
      });
  });

  it('should register an existing user to receive a newsletter', function(done) {
    request(app)
      .post('/users?emailSignup=1')
      .set('Accept', 'application/json')
      .send({email: user.email})
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        User.findOne({email: 'newUser@example.com'}, function(err, user) {
          should.not.exist(err);
          should.exist(user);
          user.email.should.equal(user.email);
          done();
        });
      });
  });
});