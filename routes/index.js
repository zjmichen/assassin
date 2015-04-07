var express = require('express');
var router = express.Router();
var Auth = require('../controllers/AuthController');
var User = require('../controllers/UserController');
var Game = require('../models/Game');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/legal', function(req, res) {
  res.render('legal', { title: 'Legal' });
});

router.get('/home', Auth.loggedIn, function(req,res) {
  var user = req.user;
  Game.find({players: req.user._id}, function(err, games) {
    if (err) { res.status(500).send(err); }

    user.games = games;
    res.render('home', { user: user });
  });
});

module.exports = router;
