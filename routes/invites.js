var express = require('express');
var router = express.Router();
var InviteController = require('../controllers/InviteController');

router.post('/:inviteId/accept', InviteController.accept);

module.exports = router;
