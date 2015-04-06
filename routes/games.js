var express = require('express');
var router = express.Router();
var GameController = require('../controllers/GameController');
var AuthController = require('../controllers/AuthController');

router.post('/', AuthController.loggedIn, GameController.create);
router.post('/:gameId/players', AuthController.loggedIn, GameController.addPlayer);

router.get('/:gameId/assignments', 
  [AuthController.loggedIn, GameController.userInGame], GameController.getAssignments);

module.exports = router;
