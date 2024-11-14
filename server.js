const express = require('express')
const app = express()
const { PORT, MongoUrl, globalVariables } = require('./config/configurations')
const expressHandlebar = require('express-handlebars')
const path = require('path')
const mongoose = require('mongoose')
const mongoStore = require('connect-mongo')
const passport = require('passport')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

mongoose.connect(MongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database connected successfully')
}).catch((err) => {
    console.log(`Error connecting to Database : ${err}`)
})

app.engine('handlebars', expressHandlebar({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(__dirname))

app.use(cookieParser())
app.use(
    session({
        store: mongoStore.create({
            mongoUrl: MongoUrl
        }),
        secret:
            "ikdssndkjsdfjosjeijoiIIIJAoIJAOIoSOIJOSMpIOI09JIOSJ0D9JSNJNoijJNSONIjnocjPOJE9ew",
        saveUninitialized: true,
        resave: true,
        cookie: { maxAge: 36000000 } //1 Hour Expiration
    })
)

app.use(flash())
app.use(globalVariables)

require('./misc/passport')(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use('/', require('./routes/defaultRoutes'))
app.use('/admin', require('./routes/adminRoutes'))


app.listen(PORT, () => {
    console.log(`Server started on ${PORT} .............`)
})
