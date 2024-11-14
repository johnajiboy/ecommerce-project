const express = require('express')
const router = express.Router()
const {
    shop,
    products,
    registerGet,
    registerPost,
    loginGet,
    loginPost,
    addToCart,
    removeFromCart,
    emptyCart
} = require('../controllers/defaultController')
const isUser = require('../misc/auth')

router.get('/', products)
router.get('/shop', isUser, shop)
router.get('/products', products)
router.route('/login').get(loginGet).post(loginPost)
router.route('/signup').get(registerGet).post(registerPost)
router.get('/add-to-cart/:id', addToCart)
router.get('/remove-from-cart/:id', removeFromCart)
router.get('/empty-cart', emptyCart)

module.exports = router