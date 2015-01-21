process.env.NODE_ENV = 'test';

var app = require('../../app');
var should = require('chai').should();
var request = require('supertest');

describe('/bower_components', function() {
  it('should provide static access to bower components', function(done) {
    request(app).get('/angular/angular.min.js')
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);
        done();
    });
  });
});