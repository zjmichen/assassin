import User from '../models/User';

export default {
  facebookVerify: (accessToken, refreshToken, profile, next) => {
    User.findOrCreate(profile)
      .then(next)
      .done();
  }
};