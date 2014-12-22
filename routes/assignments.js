var express = require('express');
var router = express.Router();
var AssignmentController = require('../controllers/AssignmentController');

router.post('/:assignmentId/report', AssignmentController.report);
router.post('/:assignmentId/confirm', AssignmentController.confirm);

module.exports = router;
