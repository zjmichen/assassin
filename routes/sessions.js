var express = require('express');
var router = express.Router();
var User = require('../models/User');

router.post('/', function(req, res) {
  User.findById(req.body.id, function(err, user) {
    if (err) { return res.status(500).end(); }

    if (!user) { return res.status(404).end(); }

    req.login(user, function(err) {
      if (req.accepts('json')) {
        res.send(user);
      } else {
        res.status(406).end();
      }
    });
  });
});

router.get('/', function(req, res) {
  if (!req.user) {
    return res.status(401).end();
  }

  if (req.accepts('json')) {
    res.send(req.user);
  } else {
    res.status(406).end();
  }
});

module.exports = router;
