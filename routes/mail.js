var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController');
var MailController = require('../controllers/MailController');

// router.post('/:inviteId/accept', InviteController.accept);
router.post('/newsletter/signup', 
    UserController.findOrCreateByEmail, 
    MailController.newsletterSignup);

module.exports = router;
