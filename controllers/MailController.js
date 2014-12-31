var User = require('../models/User');

module.exports = {

  newsletterSignup: function(req, res) {
    if (!req.accepts('json')) { res.status(406).end(); }
    User.findOne({email: req.body.email}, function(err, user) {
      if (err) { return res.status(500).send(err); }
      if (!user) {
        return res.status(404).end();
      }

      console.log(user);

      if (user.receiveNewsletter === false) {
        user.receiveNewsletter = true;
        user.save(function(err) {
          if (err) { return res.status(500).send(err); }

          console.log(user);
          res.end();
        });
      } else {
        res.status(304).end();
      }
    });
  }

};