var User = require('../models/User');

module.exports = {

  newsletterSignup: function(req, res) {
    if (!req.accepts('json')) { res.status(406).end(); }

    if (req.data.user.receiveNewsletter === false) {
      req.data.user.receiveNewsletter = true;
      req.data.user.save(function(err) {
        if (err) { return res.status(500).send(err); }

        res.end();
      });
    } else {
      res.status(304).end();
    }
  },

  sendInvites: function(invites) {

  },

};