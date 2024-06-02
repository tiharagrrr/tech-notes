const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../middleware/asyncHandler');

//@desc  Login
//@route POST /auth
//@access Public
const login = asyncHandler(async (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json({message: 'All fields are required'})
    }

    const foundUser = await User.findOne({username}).exec()

    if (!foundUser || !foundUser.active) {
        return res.status(401).json({message: 'Unauthorized'})
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) {
        return res.status(401).json({message: 'Unauthorized'})
    }

    const accessToken = jwt.sign(
        {
            "UserInfo" : {
                "username": foundUser.username,
                "roles": foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '10s' //just while in development
        }
    )

    const refreshToken = jwt.sign(
        { "username" : foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        {   expiresIn: '1d' }
    )

    //create cookie with refresh token
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //cookie cannot be accessed by client side scripts, accessible only by web server (not thru javascript)
        secure: true ,//cookie can only be sent over https
        sameSite: 'None', //cookie can be sent to any site
        maxAge: 86400000 //1 day , set to match rT
    })

    //send accessToken containing username and roles
    res.json({accessToken})

})

// @desc  Refresh token
//@route GET /auth/refresh
//@access Public - because access token has expired
const refresh = (req,res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({message: 'Unauthorized'})

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({message: 'Forbidden'})

            const foundUser = await User.findOne({username: decoded.username}).exec()

            if (!foundUser) return res.status(401).json({message: 'Unauthorized'})

            const accessToken = jwt.sign(
                {
                    "UserInfo" : {
                        "username": foundUser.username,
                        "roles": foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: '10s' //just while in development
                }
            )

            res.json({accessToken})
        })
    )

}

// @desc  logout
//@route POST /auth/logout
//@access Public - just to clear cookie if exists
const logout = (req,res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //no content
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    })
    res.json({message: 'Cookie cleared'})

}

module.exports = {
    login,
    refresh,
    logout
}