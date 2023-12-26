const otpGenerator = require('otp-generator')
const OTP = require('../models/otp')
const User = require('../models/user');


module.exports.renderVerificationPage = async (req, res, next) => {
    const user = await User.findById(req.params.id)
    const otp = await OTP.findOne({ email: user.email })
    res.render('users/verification', { user, otp })
}

module.exports.sendOTP = async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id)
    if (user.verified) {
        req.flash('err', "Your email has been already verified.")
        return res.redirect('/campgrounds')
    }
    const ifOTPAlreadySent = await OTP.findOne({ userId: id })
    if (ifOTPAlreadySent) {
        return next()
    }
    let otp = otpGenerator.generate(6, { specialChars: false });
    let ifOTPAlreadyExists = await OTP.findOne({ otp })
    while (ifOTPAlreadyExists) {
        otp = otpGenerator.generate(6, { specialChars: false })
        ifOTPAlreadyExists = await OTP.findOne({ otp })
    }

    const otpObject = await OTP.create({ userId: user._id, email: user.email, otp })
    if (otpObject) {
        setTimeout(async () => {
            await OTP.findByIdAndDelete(otpObject._id)
        }, 120000)
    }
    // req.flash('success', 'Code has been sent successfully!')
    // res.redirect(`/verify/${id}`)
    next();
}

module.exports.verifyOTP = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    const { digit1, digit2, digit3, digit4, digit5, digit6 } = req.body;
    const otp = `${digit1}${digit2}${digit3}${digit4}${digit5}${digit6}`;
    const existingOTP = await OTP.findOne({ userId: id, otp })
    if (!existingOTP) {
        req.flash('err', 'Invalid code!')
        return res.redirect(`/verify/${id}`)
    }
    await OTP.findOneAndRemove({ userId: id, otp })
    user.verified = true;
    await user.save();
    req.flash('success', "You're email has been successfully verified!")
    res.redirect('/campgrounds');
}