var express = require('express');
var router = express.Router();
var GameController = require('../controllers/game');

router.post('/', GameController.create);
router.post('/:gameId', GameController.addPlayer);

module.exports = router;
