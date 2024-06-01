const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../middleware/asyncHandler');

// @desc  Login
//@route POST /auth
//@access Public
const login = asyncHandler(async (req, res) => {

})

// @desc  Refresh token
//@route GET /auth/refresh
//@access Public - because access token has expired
const refresh = (req,res) => {

}

// @desc  logout
//@route POST /auth/logout
//@access Public - just to clear cookie if exists
const logout = (req,res) => {

}

module.exports = {
    login,
    refresh,
    logout
}