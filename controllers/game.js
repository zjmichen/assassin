var Game = require('../models/Game');
var User = require('../models/User');

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

          res.send("Player " + req.body.playerId + " joined game " + game._id);
        });
      });
    });
  }

};