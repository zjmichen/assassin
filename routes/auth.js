var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/facebook', passport.authenticate('facebook', {scope: 'email'}));
router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/'
}));

module.exports = router;