/* eslint-env mocha */

import sinon from 'sinon';
import 'sinon-as-promised';
import chai from 'chai';
chai.should();
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import mongoose from 'mongoose';
mongoose.models = {};
import User from '../src/models/User';

describe('User', () => {

  afterEach((done) => {
    User.findOne.restore();
    // User.prototype.save.restore();
    done();
  });

  describe('findByEmail', () => {
    it('should find a user with an email', () => {
      const user = {
        id: 1345234,
        profile: { emails: ['test@example.com'] }
      };

      sinon.stub(User, 'findOne').resolves(user);
      sinon.stub(User.prototype, 'save').resolves();

      return User.findByEmail('test@example.com')
        .should.eventually.have.property('id', 1345234);
    });
  });

});