const express = require('express');

const router = express.Router();

const registerController = require('../controllers/auth/register');
const registerOTPController = require('../controllers/auth/registerOTP');
const loginController = require('../controllers/auth/login');
const logoutController = require('../controllers/auth/logout');
const refreshTokenController = require('../controllers/auth/refreshToken');
const forgotPasswordRequestController = require('../controllers/auth/forgotPasswordRequest');
const forgotPasswordOTPController = require('../controllers/auth/forgotPasswordOTP');
const forgotPasswordChangeController = require('../controllers/auth/forgotPasswordChange');
const refreshOTPController = require('../controllers/auth/refreshOTP');

router.post('/register', ...registerController);
router.post('/register/otp', ...registerOTPController);
router.post('/login', ...loginController);
router.post('/logout', ...logoutController);
router.post('/refresh-token', ...refreshTokenController);
router.post('/forgot-password/request', ...forgotPasswordRequestController);
router.post('/forgot-password/otp', ...forgotPasswordOTPController);
router.post('/forgot-password/change', ...forgotPasswordChangeController);
router.post('/otp/refresh', ...refreshOTPController);

module.exports = router;
