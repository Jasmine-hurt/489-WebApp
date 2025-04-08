var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  res.render('games');
});

router.get('/tapToReveal', (req, res) => {
	res.render('tapToReveal');
});

module.exports = router;