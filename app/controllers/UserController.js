var User = require('../models/User');

module.exports = {

  findOrCreateByEmail: function(req, res, next) {
    if (!req.body.email && !req.params.email) {
      return res.status(400).json(new Error('Must provide an email'));
    }

    var email = req.params.email || req.body.email;
    req.data = req.data || {};

    User.findOne({email: email}, function(err, user) {
      if (err) { return res.status(500).json(err); }
      if (!user) {
        user = new User({email: email});
        user.save(function(err) {
          if (err) { return res.status(500).json(err); }

          req.data.user = user;
          next();
        });
      } else {
        req.data.user = user;
        next();
      }
    });
  }

};