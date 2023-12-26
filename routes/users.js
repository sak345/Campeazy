const express = require('express')
const router = express.Router()
const passport = require('passport')
const catchAsync = require('../utilities/catchAsyncError')
const { notLoggedIn, storeReturnTo, validateUser } = require('../middlewares')
const userController = require('../controllers/users')
const otpController = require('../controllers/otp')

//handle a signup request
router.route('/signUp')
    .get(notLoggedIn, userController.renderSignupForm)
    .post(notLoggedIn, validateUser, catchAsync(userController.createNewUser))

//handle a login request
router.route('/login')
    .get(notLoggedIn, userController.renderLoginForm)
    .post(notLoggedIn, storeReturnTo, passport.authenticate('local', {
        failureFlash: { type: 'err', message: 'Username or password is incorrect.' },
        failureRedirect: '/login'
    }), userController.login)

router.route('/verify/:id')
    .get(catchAsync(otpController.sendOTP), otpController.renderVerificationPage)
    .post(catchAsync(otpController.verifyOTP))

//handle a logout request
router.get('/logout', userController.logout)

module.exports = router;