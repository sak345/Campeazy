const mongoose = require('mongoose')
const { Schema } = mongoose
const mailSender = require('../utilities/sendEmail')
const User = require('./user')

const otpSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})


const sendVerificationEmail = async (userId, otp) => {
    const user = await User.findById(userId)
    const message = `<h3>Hello, ${user.username}! </h3> <h4>Welcome to Campeazy, <br>Your email verification code is: <b>${otp}</b></h4> <p>This code will expire in 2 minutes.</p> <br> <p>Don't share this code or email with anyone. If you didn't request verification, you can safely ignore this.</p>`
    const mailResponse = await mailSender(user.email, "Campeazy email verification", message, "Please use this code to verify your email address.")
    return mailResponse
}


otpSchema.pre('save', async function (next) {
    if (this.isNew) {
        const mailResponse = sendVerificationEmail(this.userId, this.otp)
        if (!mailResponse.mailSent) {
            return next(mailResponse.error)
        }
    }
    next();
})


module.exports = mongoose.model('OTP', otpSchema)