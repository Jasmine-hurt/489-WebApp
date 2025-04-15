var express = require('express');
var router = express.Router();
const { User } = require('../db')

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
  const { password } = req.body;
  const email = req.body.email.toLowerCase();

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
      email: user.email,
      isAdmin: user.isAdmin
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
  const { name, password, confirmPassword } = req.body;
  const email = req.body.email.toLowerCase();

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

// render forgot password form
router.get('/forgot', (req, res) => {
  res.render('forgotPassword');
});

const { v4: uuidv4 } = require('uuid');
const { sendMail } = require('../utils/mailsend');

// handle forgot passsword form submission
router.post('/forgot', async (req, res) => {
  const email = req.body.email.toLowerCase();
  const user = await User.findOne({ where: { email } });

  if (!user) {
    req.flash('error', 'No user with that email.');
    return res.redirect('/auth/forgot');
  }

  // generates unique token used in the reset link
  // https://www.npmjs.com/package/uuid
  const token = uuidv4();
  const expires = Date.now() + 15 * 60 * 1000;

  await user.update({ resetToken: token, resetTokenExpires: new Date(expires) });

  const resetLink = `http://localhost:3000/auth/reset/${token}`;
  sendMail(email, 'Password Reset', `
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}">${resetLink}</a>
    <p>This link expires in 15 minutes.</p>
  `);

  req.flash('success', 'Reset link sent to your email.');
  res.redirect('/auth/login');
});

// render reset password form if token is valid and not expired
router.get('/reset/:token', async (req, res) => {
  const user = await User.findOne({
    where: {
      resetToken: req.params.token,

      // https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#operators
      resetTokenExpires: { [require('sequelize').Op.gt]: new Date() }
    }
  });

  if (!user) {
    req.flash('error', 'Token expired or invalid.');
    return res.redirect('/auth/forgot');
  }

  res.render('resetPassword', { token: req.params.token });
});

// new password submission and update
router.post('/reset/:token', async (req, res) => {
  const { password, confirmPassword } = req.body;

  const user = await User.findOne({
    where: {
      resetToken: req.params.token,
      resetTokenExpires: { [require('sequelize').Op.gt]: new Date() }
    }
  });

  if (!user) {
    req.flash('error', 'Token expired or invalid.');
    return res.redirect('/auth/forgot');
  }

  if (password !== confirmPassword) {
    req.flash('error', 'Passwords do not match.');
    return res.redirect(`/auth/reset/${req.params.token}`);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await user.update({
    password: hashedPassword,
    resetToken: null,
    resetTokenExpires: null
  });

  req.flash('success', 'Password has been reset. You can now log in.');
  res.redirect('/auth/login');
});

module.exports = router;