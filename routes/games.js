var express = require('express');
var router = express.Router();
var GameController = require('../controllers/GameController');

router.post('/', GameController.create);
router.post('/:gameId', GameController.addPlayer);

router.get('/:gameId/assignments', GameController.getAssignments);

module.exports = router;
