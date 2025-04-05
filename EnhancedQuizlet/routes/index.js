var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.redirect('/auth/login');
});

router.get('/home', function(requ, res) {
  res.render('home');
});

module.exports = router;
