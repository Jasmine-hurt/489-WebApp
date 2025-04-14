const express = require('express');
const router = express.Router();
const { User } = require('../db');

// admin panel with all users
router.get('/remove', async (req, res) => {
  if (!req.session.user?.isAdmin) {
    return res.status(403).send('Access denied');
  }

  const users = await User.findAll({ where: { isAdmin: false } });
  res.render('adminRemoveAccount', { users });
});

// delete user
router.post('/remove/:userID', async (req, res) => {
  if (!req.session.user?.isAdmin) {
    return res.status(403).send('Access denied');
  }

  try {
    await User.destroy({ where: { userID: req.params.userID, isAdmin: false } });
    req.flash('success', 'User deleted successfully.');
  } catch (err) {
    req.flash('error', 'Failed to delete user.');
    console.error(err);
  }

  res.redirect('/admin/remove');
});

module.exports = router;