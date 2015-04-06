module.exports = {

  loggedIn: function(req, res, next) {
    if (!req.user) {
      res.status(401).end();
    } else {
      next();
    }
  }

};