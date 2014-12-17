var app = require('../app');
var should = require('chai').should();
var request = require('superagent');
var browser = require('zombie').create;
var agent = request.agent(app);
var fixtures = require('./fixtures');
var User = require('../models/User');
var mongoose = require('mongoose');

describe('user pages', function() {

  before(function(done) {
    mongoose.connect('mongodb://localhost/test');
    var user = new User(fixtures.testUser);
    agent.post('http://localhost:3000/sessions')
      .send({user: user})
      .end(done);
  });

  it('should show the user login page', function(done) {
    browser.visit('/', function(err) {
      should.not.exist(err);
      browser.assert.success();
      browser.assert.text('title', 'Dashboard | Assassin');
    });
  });

});