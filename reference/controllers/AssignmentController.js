var Assignment = require('../models/Assignment');

module.exports = {

  get: function(req, res) {
    if (!req.accepts('json')) { return res.status(406).end(); }
    Assignment.findById(req.params.assignmentId, function(err, assignment) {
      if (err) { return res.status(500).send(err); }
      if (!assignment) { return res.status(404).end(); }
      res.send(assignment);
    });
  },

  report: function(req, res) {
    if (!req.accepts('json')) { return res.status(406).end(); }
    Assignment.findById(req.params.assignmentId, function(err, assignment) {
      if (err) { return res.status(500).send(err); }
      if (!assignment) { return res.status(404).end(); }

      if (assignment.completed === false) {
        assignment.completed = true;
        assignment.save(function(err) {
          if (err) { res.status(500).send(err); }

          res.send(assignment);
        });
      } else {
        res.send(assignment);
      }
    });
  },

  confirm: function(req, res) {
    if (!req.accepts('json')) { return res.status(406).end(); }
    Assignment.findById(req.params.assignmentId, function(err, assignment) {
      if (err) { return res.status(500).send(err); }
      if (!assignment) { return res.status(404).end(); }

      if (assignment.completed === true && assignment.confirmed === false) {
        assignment.confirmed = true;
        assignment.save(function(err) {
          if (err) { res.status(500).send(err); }

          res.send(assignment);
        });
      } else {
        res.send(assignment);
      }
    });
  },

  reject: function(req, res) {
    if (!req.accepts('json')) { return res.status(406).end(); }
    Assignment.findById(req.params.assignmentId, function(err, assignment) {
      if (err) { return res.status(500).send(err); }
      if (!assignment) { return res.status(404).end(); }

      if (assignment.completed === true && assignment.confirmed === false) {
        assignment.completed = false;
        assignment.save(function(err) {
          if (err) { res.status(500).send(err); }

          res.send(assignment);
        });
      } else {
        res.send(assignment);
      }
    });
  },

  ownsAssignment: function(req, res, next) {
    Assignment.findById(req.params.assignmentId, function(err, assignment) {
      if (err) { return res.status(500).send(err); }
      if (!assignment) { return res.status(404).end(); }

      if (assignment.assassin.toString() !== req.user._id.toString()) {
        res.status(403).end();
      } else {
        next();
      }
    });
  }

};