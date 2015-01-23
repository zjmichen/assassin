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

    if (!Array.isArray(req.body.players)) {
      return res.status(400).send(new Error('Bad Request Format'));
    }

    if (req.body.players.length < 2) {
      return res.status(400).send(new Error('Too Few Players'));
    }

    var playerIds = req.body.players;
    playerIds.push(req.user._id);

    User.findOrCreateByEmail(playerIds, function(err, users) {
      Game.create(playerIds, function(err, game) {
        Invite.createFromUsers(users, game, function(err, invites) {
          MailController.sendInvites(invites);

          game.invites = invites;
          res.send(game);
        });
      });
    });


    // game.save(function(err) {
    //   if (err) { return res.status(500).send(err); }

    //   if (req.body.invites) {
    //     // convert emails into users
    //     User.findOrCreateByEmail(req.body.invites, function(err, users) {
    //       if (err) { res.status(500).send(err); }

    //       // create the invites
    //       Invite.create(users.map(function(user) {
    //         return {
    //           email: user.email,
    //           game: game._id,
    //           player: user._id
    //         };
    //       }), function(err, invites) {
    //         if (err) { res.status(500).send(err); }

    //         game.invites = invites;
    //         res.send(game);
    //       });
    //     });
    //   } else {
    //     res.send(game);
    //   }
    // });
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