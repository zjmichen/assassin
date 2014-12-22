var app = require('../../app');
var should = require('chai').should();
var request = require('supertest');
var fixtures = require('.././fixtures');
var mongoose = require('mongoose');
var User = require('../../models/User');
var Game = require('../../models/Game');
var Assignment = require('../../models/Assignment');

describe('/assignments', function() {
  var user, game, assignment;

  before(function(done) {
    mongoose.connect('mongodb://localhost/test');
    done();
  });

  after(function(done) {
    mongoose.disconnect(done);
  });

  beforeEach(function(done) {
    user = new User(fixtures.testUser);
    user2 = new User(fixtures.testUser2);
    user.save(function(err) {
      user2.save(function(err) {
        game = new Game();
        game.save(function(err) {
          assignment = new Assignment({
            game: game._id,
            assassin: user._id,
            target: user2._id
          });
          assignment.save(done);
        });
      });
    });
  });

  afterEach(function(done) {
    Assignment.remove({}, done);
  });

  describe('/report', function() {
    it('should mark the assignment as completed', function(done) {
      request(app)
        .post('/assignments/' + assignment._id + '/report')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err) {
          should.not.exist(err);
          Assignment.findById(assignment._id, function(err, assignment) {
            should.not.exist(err);
            assignment.completed.should.equal(true);
            done();
          });
        });
    });
  });

  describe('/confirm', function() {
    it('should mark a completed assignment as confirmed', function(done) {
      assignment.completed = true;
      assignment.save(function(err) {
        should.not.exist(err);

        request(app)
          .post('/assignments/' + assignment._id + '/confirm')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err) {
            should.not.exist(err);
            Assignment.findById(assignment._id, function(err, assignment) {
              should.not.exist(err);
              assignment.confirmed.should.equal(true);
              done();
            });
          });
      });
    });
  });

});