var Game = require('../models/Game');
var User = require('../models/User');
var Assignment = require('../models/Assignment');
var Invite = require('../models/Invite');
var MailController = require('../controllers/MailController');

module.exports = {

  addPlayer: function(req, res) {
    if (!req.accepts('json')) { res.status(406).end(); }
    Game.findById(req.params.gameId, function(err, game) {
      if (err) { return res.status(500).send(err); }
      if (!game) { return res.status(404).send("Game not found"); }

      User.findById(req.user._id, function(err, player) {
        if (err) { return res.status(500).send(err); }
        if (!player) { return res.status(404).send("Player not found"); }

        game.addPlayer(player, function(err) {
          if (err) { return res.status(500).send(err); }

          res.send(game);
        });
      });
    });
  },

  create: function(req, res) {
    if (!req.accepts('json')) { return res.status(406).end(); }

    var playerIds = req.body.players || [];
    var inviteEmails = req.body.invites || [];
    playerIds.push(req.user._id);

    User.findOrCreateByEmail(inviteEmails, function(err, newUsers) {
      if (err) { return res.send(500).end(); }

      playerIds = playerIds.concat(newUsers.map(function(user) {
        return user._id;
      }));

      Game.create(playerIds, function(err, game) {
        if (err) { return res.status(400).send(err.message); }

        Invite.createFromUsers(newUsers, game, function(err, invites) {
          MailController.sendInvites(invites);
          
          game.invites = invites;
          res.send(game);
        });
      });
    });

  },

  getAssignments: function(req, res) {
    if (!req.accepts('json')) { res.status(406).end(); }
    Assignment.find({game: req.params.gameId}, function(err, assignments) {
      if (err) { return res.status(500).send(err); }

      res.send({
        gameId: req.params.gameId,
        assignments: assignments
      });
    });
  },

  checkIfReady: function(game, next) {
    Invite.find({game: game._id, accepted: false })
        .where('expires').gt(Date.now())
        .exec(function(err, invites) {

      if (err) { return next(err); }

      if (invites.length === 0 && game.state === 'pending') {
        game.start(function(err) {
          next(err, true);
        });
      } else {
        next(null, false);
      }
    });
  },

  userInGame: function(req, res, next) {
    Game.findById(req.params.gameId, function(err, game) {
      if (err) { return res.status(500).send(err); }
      if (!game) { return res.status(404).end(); }

      if (game.players.indexOf(req.user._id) === -1) {
        res.status(403).end();
      } else {
        next();
      }
    });
  }

};