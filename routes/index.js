var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/legal', function(req, res) {
  res.render('legal', { title: 'Legal' });
});

router.get('/app', function(req, res) {
  res.render('app/base');
});

module.exports = router;
