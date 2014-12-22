var app = require('../../app');
var should = require('chai').should();
var request = require('supertest');
var User = require('../../models/User');
var mongoose = require('mongoose');
var fixtures = require('../fixtures');

describe('/sessions', function() {
  var user, cookies;

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

  it('should log in a user', function(done) {
    request(app)
      .post('/sessions')
      .set('Accept', 'application/json')
      .send({id: user._id})
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        res.body._id.should.equal(user._id.toString());
        cookies = res.headers['set-cookie'].pop().split(';')[0];
        done(err);
      });
  });

  it('should get the current user session', function(done) {
    var req = request(app).get('/sessions');
    req.cookies = cookies;
    req.set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        should.exist(res.body._id);
        res.body._id.should.equal(user._id.toString());
        done(err);
      });
  });
});
