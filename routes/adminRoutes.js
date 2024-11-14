const express = require('express')
const router = express.Router()
const {
    registerGet,
    registerPost,
    uploads
} = require('../controllers/adminController')

router.route('/').get(registerGet).post(uploads,registerPost)  

module.exports = router 