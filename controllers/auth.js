module.exports = {

  deny: function(req, res) {
    res.status(403).send("Forbidden");
  },

  addSession: function(req, res) {
    console.log(req.body);
    req.login(req.body.user, function(err) {
      if (err) { return res.status(500).send(err); }
      res.send("Logged in");
    });
  }

};