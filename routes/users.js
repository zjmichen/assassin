var express = require('express');
var router = express.Router();
var User = require('../models/User');

router.post('/', function(req, res) {
  if (!req.accepts('json')) { return res.status(406).end(); }
  if (!req.body.email) { return res.status(400).end(); }

  var emails = [req.body.email];
  User.findOrCreateByEmail(emails, function(err, users) {
    if (err) { return res.status(500).send(err); }

    res.json(user);
  });
});

module.exports = router;
