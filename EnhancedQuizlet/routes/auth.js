var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource resource');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  console.log(req.body.username+" - " + req.body.password)
  res.redirect("/home")
});

// renders views/signup.ejs
router.get('/signup', (req, res) => {
  res.render('signup');
});


module.exports = router;
