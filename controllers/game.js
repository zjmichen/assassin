var Game = require('../models/Game');
var User = require('../models/User');
var Assignment = require('../models/Assignment');

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

      res.send(game);
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
  }

};