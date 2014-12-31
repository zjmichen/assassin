var express = require('express');
var router = express.Router();
var MailController = require('../controllers/MailController');

// router.post('/:inviteId/accept', InviteController.accept);
router.post('/newsletter/signup', MailController.newsletterSignup);

module.exports = router;
