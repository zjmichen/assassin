var Game = require('../models/Game');
var User = require('../models/User');
var Assignment = require('../models/Assignment');
var Invite = require('../models/Invite');

module.exports = {

  addPlayer: function(req, res) {
    Game.findById(req.params.gameId, function(err, game) {
      if (err) { return res.status(500).send(err); }
      if (!game) { return res.status(404).send("Game not found"); }

      User.findById(req.body.playerId, function(err, player) {
        if (err) { return res.status(500).send(err); }
        if (!player) { return res.status(404).send("Player not found"); }

        game.addPlayer(player, function(err) {
          if (err) { return res.status(500).send(err); }

          if (req.accepts('json')) {
            res.send(game);
          } else {
            res.status(406).end();
          }
        });
      });
    });
  },

  create: function(req, res) {
    var game = new Game();
    game.players.push(req.body.playerId);
    game.save(function(err) {
      if (err) { return res.status(500).send(err); }

      if (req.body.invites) {
        // convert emails into users
        User.findOrCreateByEmail(req.body.invites, function(err, users) {
          if (err) { res.status(500).send(err); }

          // create the invites
          Invite.create(users.map(function(user) {
            return {
              email: user.email,
              game: game._id,
              player: user._id
            };
          }), function(err, invites) {
            if (err) { res.status(500).send(err); }

            game.invites = invites;
            res.send(game);
          });
        });
      } else {
        res.send(game);
      }
    });
  },

  getAssignments: function(req, res) {
    Assignment.find({game: req.params.gameId}, function(err, assignments) {
      if (err) { return res.status(500).send(err); }

      if (req.accepts('json')) {
        res.send({
          gameId: req.params.gameId,
          assignments: assignments
        });
      } else {
        res.status(406).end();
      }
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
  }

};