var expect = require('chai').expect;
var request = require('supertest');

describe('Browse', function() {
  describe('GET /browse/data', function() {
    var server;
    beforeEach(function () {
      server = require('../index').listen();
    });
    afterEach(function () {
      server.close();
    });

    it('should respond with JSON', function(){
      request(server)
        .get('/browse/data')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
          if (err) return done(err);
          done();
        });
    });
  });
});
