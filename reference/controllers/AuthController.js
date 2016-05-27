module.exports = {

  loggedIn: function(req, res, next) {
    if (!req.user) {
      console.log(req.path);
      // req.session.nextPath = req.
      res.redirect('/auth/facebook');
      // res.status(401).end();
    } else {
      next();
    }
  }

};