var express = require('express');
var router = express.Router();
var AuthController = require('../controllers/auth');

router.get('/', AuthController.deny);
router.post('/', AuthController.addSession);

module.exports = router;
