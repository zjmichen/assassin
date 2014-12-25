var express = require('express');
var router = express.Router();
var User = require('../models/User');

router.post('/', function(req, res) {
  if (!req.accepts('json')) { return res.status(406).end(); }
  if (!req.body.email) { return res.status(400).end(); }

  var emails = [req.body.email];
  User.findOrCreateByEmail(emails, function(err, users) {
    if (err) { return res.status(500).send(err); }

    if (req.query.emailSignup) {
      var user = users[0];
      user.receiveNewsletter = true;
      user.save(function(err) {
        if (err) { return res.status(500).send(err); }
        res.json(user);
      });
    } else {
      res.json(user);
    }
  });
});

module.exports = router;
