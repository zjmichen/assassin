var app = require('../../app');
var should = require('chai').should();
var request = require('supertest');
var fixtures = require('.././fixtures');
var mongoose = require('mongoose');
var User = require('../../models/User');
var Game = require('../../models/Game');
var Assignment = require('../../models/Assignment');

describe('/assignments', function() {
  var user, game, assignment, cookies;

  before(function(done) {
    mongoose.connect('mongodb://localhost/test');

    user = new User(fixtures.testUser);
    user.save(function(err) {
      request(app)
        .post('/sessions')
        .set('Accept', 'application/json')
        .send({id: user._id})
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          cookies = res.headers['set-cookie'].pop().split(';')[0];
          done(err);
        });
    });
  });

  after(function(done) {
    mongoose.disconnect(done);
  });

  beforeEach(function(done) {
    user2 = new User(fixtures.testUser2);
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

  afterEach(function(done) {
    Assignment.remove({}, done);
  });

  it('should fetch an assignment', function(done) {
    var req = request(app).get('/assignments/' + assignment._id);
    req.cookies = cookies;
    req.set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
      res.body._id.should.equal(assignment._id.toString());
      done();
    });
  });

  describe('/report', function() {
    it('should mark the assignment as completed', function(done) {
      var req = request(app).post('/assignments/' + assignment._id + '/report')
      req.cookies = cookies;
      req.set('Accept', 'application/json')
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

        var req = request(app).post('/assignments/' + assignment._id + '/confirm');
        req.cookies = cookies;
        req.set('Accept', 'application/json')
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

  describe('/reject', function() {
    it('should mark a completed assignment as not completed', function(done) {
      assignment.completed = true;
      assignment.save(function(err) {
        should.not.exist(err);

        var req = request(app).post('/assignments/' + assignment._id + '/reject')
        req.cookies = cookies;
        req.set('Accept', 'application/json')
          .expect(200)
          .end(function(err) {
            should.not.exist(err);
            Assignment.findById(assignment._id, function(err, assignment) {
              should.not.exist(err);
              assignment.confirmed.should.equal(false);
              assignment.completed.should.equal(false);
              done();
            });
          });
      });
    });
  });

});