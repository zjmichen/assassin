var app = require('../app');
var should = require('chai').should();
var request = require('supertest');
var User = require('../models/User');
var fixtures = require('./fixtures');
var mongoose = require('mongoose');

describe('auth routes', function() {
  var user;

  before(function(done) {
    mongoose.connect('mongodb://localhost/test');
    user = new User(fixtures.testUser);
    done();
  });

  after(function(done) {
    mongoose.disconnect(done);
  });

  describe('/sessions', function() {
    it('should add a session and log in a user', function(done) {
      request(app)
        .post('/sessions')
        .send({user: user})
        .expect('Logged in')
        .expect(200)
        .end(done);
    });
  });

});