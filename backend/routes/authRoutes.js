const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  login,
  logout,
  register,
  getCurrentAdmin
} = require('../controllers/authController');

router.post('/login', login);
router.post('/logout', auth, logout);
router.post('/register', register);
router.get('/auth/check', auth, getCurrentAdmin);

module.exports = router;
