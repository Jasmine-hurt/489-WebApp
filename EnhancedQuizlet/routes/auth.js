var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource resource');
});

router.get('/login', (req, res) => {
  res.render('index');
});

router.post('/login', (req, res) => {
  res.redirect('/');
});

// renders views/signup.ejs
router.get('/signup', (req, res) => {
  res.render('signup');
});


module.exports = router;
