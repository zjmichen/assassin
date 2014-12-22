var Invite = require('../models/Invite');


module.exports = {

  accept: function(req, res) {
    Invite.findById(req.params.inviteId, function(err, invite) {
      if (err) { return res.status(500).send(err); }
      if (!invite) {return res.status(404).end(); }
      if (!req.accepts('json')) { return res.status(406).end(); }

      if(invite.accepted) {
        res.send(invite);
      } else {
        invite.accepted = true;
        invite.save(function(err) {
          if (err) { return res.status(500).send(err); }

          res.send(invite);
        });
      }
    });
  }

};