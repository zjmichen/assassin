var Invite = require('../models/Invite');
var GameController = require('./GameController');


module.exports = {

  accept: function(req, res) {
    if (!req.accepts('json')) { res.status(406).end(); }
    Invite.findById(req.params.inviteId)
        .populate('game')
        .exec(function(err, invite) {

      if (err) { return res.status(500).send(err); }
      if (!invite) {return res.status(404).end(); }
      if (!req.accepts('json')) { return res.status(406).end(); }

      if(invite.accepted) {
        res.send(invite);
      } else {
        invite.accepted = true;
        invite.save(function(err) {
          if (err) { return res.status(500).send(err); }

          GameController.checkIfReady(invite.game, function(err, isReady) {
            if (err) { return res.status(500).send(err); }
            res.send(invite);
          });

        });
      }
    });
  }

};