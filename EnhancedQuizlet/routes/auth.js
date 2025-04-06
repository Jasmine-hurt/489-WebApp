var express = require('express');
var router = express.Router();
const User = require('../models/User')

// https://www.npmjs.com/package/bcrypt
const bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource resource');
});

router.get('/login', (req, res) => {
  res.render('login');
});

// for logging in, checks if user is found with email inputted and correct passwords
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    // check if user is in the database
    if (!user) {
      req.flash('error', 'No user found with that email.');
      return res.redirect('/auth/login');
    }

    // checking passwords
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      req.flash('error', 'Incorrect password.');
      return res.redirect('/auth/login');
    }

    req.session.user = {
      id: user.userID,
      name: user.name,
      email: user.email
    };

    req.flash('success', 'Login successful!');
    res.redirect('/home');

  } catch (error) {
    console.error(error);
    req.flash('error', 'Internal server error.');
    res.redirect('/auth/login');
  }
});

// renders views/signup.ejs
router.get('/signup', (req, res) => {
  res.render('signup');
});

// for creating a new account
router.post('/signup', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // password validation
  if (password !== confirmPassword) {
    req.flash('error', "Passwords don't match.");
    return res.redirect('/auth/signup');
  }

  // email validation
  if (!email.includes('@')) {
    req.flash('error', 'Email must be valid.');
    return res.redirect('/auth/signup');
  }

  // checking if email is already used
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      req.flash('error', "Email already in use.");
      return res.redirect('/auth/signup');
    }

    // this is better than storing password in plain text
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword }); 
    req.flash('success', 'Account created! Please log in.');
    res.redirect('/auth/login');

  } catch (err) {
    console.error(err);
    req.flash('error', "Something went wrong while signing up.");
    res.redirect('/auth/signup');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      req.flash('error', 'Failed to log out.');
      return res.redirect('/home');
    }
    res.redirect('/auth/login');
  });
});

module.exports = router;