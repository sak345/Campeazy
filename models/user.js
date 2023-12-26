const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide a valid email'],
        unique: true
    },
    verified: {
        type: Boolean,
        default: false
    }
})

userSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('User', userSchema)