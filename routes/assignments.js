var express = require('express');
var router = express.Router();
var AssignmentController = require('../controllers/AssignmentController');
var AuthController = require('../controllers/AuthController');

router.get('/:assignmentId', AuthController.loggedIn, AssignmentController.get);
router.post('/:assignmentId/report', AuthController.loggedIn, AssignmentController.report);
router.post('/:assignmentId/confirm', AuthController.loggedIn, AssignmentController.confirm);
router.post('/:assignmentId/reject', AuthController.loggedIn, AssignmentController.reject);

module.exports = router;
