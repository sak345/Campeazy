const User = require('../models/user')

module.exports.renderSignupForm = (req, res) => {
    res.render('users/signUp')
}

module.exports.createNewUser = async (req, res, next) => {
    const { username, email, password } = req.body
    const user = new User({ username, email })

    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', "You've been successfully registered to Campeazy community!")
        res.redirect(`/verify/${user._id}`)
    })

}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    const redirectUrl = res.locals.returnTo || '/campgrounds'
    req.flash('success', 'Welcome back! We hope you have a great experience exploring campgrounds.');
    delete req.session.returnTo;
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('err', "You're already logged out!")
        const redirectUrl = res.locals.returnTo || '/campgrounds'
        return res.redirect(redirectUrl)
    }
    req.logout(function (err) {
        if (err) {
            next(err);
        }
        req.flash('success', 'Logged out! Have a good day ;)')
        res.redirect('/campgrounds')
    })

}