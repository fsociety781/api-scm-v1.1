const express = require('express');
const router = express.Router();

const AuthController = require('../../controller/authController');
const authMiddleware = require('../../middleware/authMidlleware');

router.post('/login', AuthController.login);
router.post('/logout', authMiddleware,AuthController.logout);

module.exports = router;