const joi = require('@hapi/joi')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const Product = require('../models/products')
const Cart = require('../models/cart')
const cart2 = require('../models/cart2')
const axios = require('axios').default
const passwordList = require('../models/passwordList')


const userSchema = joi.object({
    username: joi.string().alphanum().min(3).max(30),
    email: joi.string().email(),
    password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    confirmpassword: joi.any().valid(joi.ref('password')).required().messages({
        'any.only': 'Passwords must match'
    })
})

module.exports = {
    shop: (req, res) => {
        Product.find().lean().exec((err, product) => {
            if (err) console.log(err)
            // console.log(req.session.cart)
            res.render('shop', {
                product: product,
                cartItems: req.session.cart,
                user: req.user,
            })
        })

    },
    products: (req, res) => {
        Product.find().lean().exec((err, product) => {
            if (err) console.log(err)
            res.render('products', {
                product: product,
                cartItems: req.session.cart,
                user: req.user,
            })
        })
    },
    registerGet: (req, res) => {
        const formData = req.flash('form-data')
        console.log(formData)
        res.render('signup', {
            formData: formData[0]
        })
    },
    registerPost: async (req, res, next) => {
        console.log(req.body)
        const user = await User.findOne({ username: req.body.username })
        if (user) {
                req.flash('error-message', 'username already registered!')
                req.flash('username', req.body.username)
                req.flash('email', req.body.email)
                res.redirect('/signup')
                return
            }
        try {
            const dictionaryRes = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${req.body.password}`)
            if (dictionaryRes.data.length) {
                req.flash('error-message', 'Password is a dictionary word, please enter a new password!')
                req.flash('username', req.body.username)
                req.flash('email', req.body.email)
                res.redirect('/signup')
                return
            }
        }
        catch (err) {
            console.log('this is not a dictionary word')
        }

        try {
            const passwordCompromised = passwordList.find(password => password == req.body.password)
            if (passwordCompromised) {
                req.flash('error-message', 'This password is compromised, please enter a new password')
                req.flash('username', req.body.username)
                req.flash('email', req.body.email)
                return res.redirect('/signup')
            }
        } catch (err) {
            console.log(err)
        }
        try {
            const validate = await userSchema.validateAsync(req.body)
        } catch (err) {
            console.log('no from here')
            req.flash('error-message', err.message)
            req.flash('username', req.body.username)
            req.flash('email', req.body.email)
            return res.redirect('/signup')
        }
        try {
            const newUser = await new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            })
            await bcrypt.genSalt(10, async (err, salt) => {
                await bcrypt.hash(newUser.password, salt, async (err, hash) => {
                    newUser.password = hash
                    await newUser.save(() => {
                        req.flash('success-message', 'signup successful please login.')
                        return res.redirect('/login')
                    })
                })
            })
        }
        catch (err) {
            console.log('error Occured while saving User');
            req.flash('error-message', 'error Occured while saving User')
            req.flash('username', req.body.username)
            req.flash('email', req.body.email)
            return res.redirect('/signup')
        }

    },
    loginGet: (req, res) => {
        res.render('login')
    },
    loginPost: (req, res) => {
        passport.authenticate('local', {
            successRedirect: '/shop',
            failureRedirect: '/login'
        })(req, res)
    },
    addToCart: (req, res) => {
        let productsId = req.params.id
        const cart = new Cart(req.session.cart ? req.session.cart : { items: {} })
        Product.findById(productsId, (err, product) => {
            if (err) {
                console.log(err)
                res.redirect('/')
            }
            cart.add(product, product.id)
            cart2.addToCart(product, 1)
            cart2.saveCart(req)
            // req.session.cart = cart
            res.redirect('/shop')
        })
    },
    removeFromCart: (req, res) => {
        let productsId = req.params.id
        cart2.removeFromCart(productsId)
        cart2.saveCart(req)
        res.redirect('/shop')
    },
    emptyCart: (req, res) => {
        cart2.emptyCart(req)
        res.redirect('/shop')
    }
}