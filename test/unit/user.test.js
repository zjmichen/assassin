var User = require('../../models/User');
var mongoose = require('mongoose');
var should = require('chai').should();

describe('User', function() {
  var user;

  before(function(done) {
    mongoose.connect('mongodb://localhost/test', done);
  });

  after(function(done) {
    mongoose.disconnect(done);
  });

  beforeEach(function(done) {
    user = new User({ email: 'test@example.com' });
    user.save(function(err) {
      done(err);
    });
  });

  afterEach(function(done) {
    User.remove({}, done);
  });

  describe('findOrCreate', function() {
    it('should create a new user with the info given', function(done) {
      User.findOrCreate({
        email: 'newUser@example.com', 
        profile: {testData: 'asdf'}
      }, function(err, user) {
        should.not.exist(err);
        user.email.should.equal('newUser@example.com');
        user.profile.testData.should.equal('asdf');
        done();
      });
    });
  });

  describe('findOrCreateByEmail', function() {

    it('should find existing users', function(done) {
      User.findOrCreateByEmail(['test@example.com'], function(err, users) {
        should.exist(users);
        should.exist(users[0]);
        users[0].email.should.equal('test@example.com');
        done(err);
      });
    });

    it('should create nonexistant users', function(done) {
      User.findOrCreateByEmail(['test2@example.com'], function(err, users) {
        should.exist(users);
        should.exist(users[0]);
        users[0].email.should.equal('test2@example.com');
        done(err);
      });
    });

    it('should both create nonexistant and return existing users', function(done) {
      var emails = ['test@example.com', 'test2@example.com', 'test3@example.com'];
      User.findOrCreateByEmail(emails, function(err, users) {
        should.exist(users);
        users.length.should.equal(3);
        users[0].email.should.equal('test@example.com');
        users[1].email.should.equal('test2@example.com');
        users[2].email.should.equal('test3@example.com');
        done(err);
      });
    });

  });
});
