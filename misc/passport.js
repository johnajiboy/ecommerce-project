const localStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')

module.exports = (passport) => {
    passport.use(new localStrategy({ passReqToCallback: true }, async (req, username, password, done) => {
        await User.findOne({ username: username }, async (err, user) => {
            if (err) {
                console.log(err)
                return done(null, false)
            }
            if (!user) {
                console.log('user not found')
                return done(null, false, req.flash('error-message', 'user not found'))
            }
            await bcrypt.compare(password, user.password, (err, isMatch) => {
                if (isMatch) {
                    return done(null, user)
                } else {
                    console.log('incorrect password')
                    return done(null, false, req.flash('error-message', 'incorrect password'))
                }
            })
        })
    }))
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}
