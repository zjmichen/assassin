var express = require('express');
var router = express.Router();
var User = require('../models/User');
var AuthController = require('../controllers/AuthController');

router.post('/', function(req, res) {
  if (!req.accepts('json')) { return res.status(406).end(); }
  User.findById(req.body.id, function(err, user) {
    if (err) { return res.status(500).end(); }
    if (!user) { return res.status(404).end(); }

    req.login(user, function(err) {
      res.send(user);
    });
  });
});

router.get('/', AuthController.loggedIn, function(req, res) {
  if (!req.accepts('json')) { return res.status(406).end(); }

  res.send(req.user);
});

module.exports = router;
