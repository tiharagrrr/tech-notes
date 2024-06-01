const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController') 
const loginLimiter = require('../middleware/loginLimiter')

router.route('/')
    .post(loginLimiter, )

router.route('/refresh')
    .get()

router.route('/login')
    .post()

module.exports = router