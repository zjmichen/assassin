var Game = require('../models/Game');
var User = require('../models/User');
var Assignment = require('../models/Assignment');
var Invite = require('../models/Invite');

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
    if (!req.accepts('json')) { res.status(406).end(); }
    var game = new Game();
    game.players.push(req.user._id);
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