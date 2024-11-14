module.exports = {
    PORT: process.env.PORT || 3000,
    MongoUrl: process.env.DB_URL || 'mongodb://localhost/ecommerce',
    globalVariables: (req, res, next) => {
        res.locals.success_message = req.flash("success-message")
        res.locals.error_message = req.flash("error-message")
        res.locals.username = req.flash("username")
        res.locals.email = req.flash("email")
        res.locals.messages = require('express-messages')
        res.locals.session = req.session

        next()
    }
}