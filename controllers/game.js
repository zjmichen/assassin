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
    console.log(req.user);
    var game = new Game({ players: [req.user._id] });
    game.save(function(err) {
      console.log('creating');
      if (err) { return res.status(500).send("Could not create game"); }

      console.log('made a game:');
      console.log(game);
      res.send(game);
    });
  }

};