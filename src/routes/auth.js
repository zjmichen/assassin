import express from 'express';
import passport from 'passport';
import auth from '../lib/auth';
import { Strategy as FacebookStrategy } from 'passport-facebook';

const router = express.Router();

passport.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:3000/auth/callback'
  },
  auth.facebookVerify
));

router.post('/login', function(req, res) {
  res.render('index');
});

module.exports = router;
