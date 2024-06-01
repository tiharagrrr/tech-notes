const rateLimit = require('express-rate-limit')
const {logEvents} = require('./logger')

const loginLimiter = rateLimit({
    windowMs: 60*1000,
    max:5, // limit each IP to 5 requests per windowMs (1 minute)
    message:
        {
            message: 'Too many login attempts, please try again after 1 minute'
        },
    handler: (req, res, next , options) => {
        logEvents(`Too many requests: ${options.message.message}\t${req.method}\t${req.url}\t$
        {req.headers.origin}`, 'errorLog.log' )
        res.status(options.stausCode).send(options.message)
    },
    standardHeaders: true, // include headers with error response
    legacyHeaders: false //disable the X-RateLimit headers
})

module.exports = loginLimiter