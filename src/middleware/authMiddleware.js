const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const authMiddleWare = (req, res, next) => {
    console.log("headers", req.headers)
    console.log('checkToken', req.headers.token)
    const token = req.headers.token.split(' ')[1]
    console.log('token', token)
    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, user) {
        if (err) {
            console.log("err", err)
            return res.status(404).json({
                message: "The authentication failed",
                status: 'ERROR'
            })
        }
        if (user.role == "admin") {
            next()
        } else if (user.role == "instructor") {
            if (req.path.includes('/attendance')) {
                next();
            } else {
                return res.status(403).json({
                    message: "Access denied: Instructors can only access attendance functions",
                    status: 'ERROR'
                });
            }
        } else {
            return res.status(404).json({
                message: "Access denied",
                status: 'ERROR'
            })
        }
    });
}

const authUserMiddleWare = (req, res, next) => {
    console.log('checkToken', req.headers)
    const token = req.headers.token.split(' ')[1]
    const userId = req.params.id
    console.log('token', token)
    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, user) {
        if (err) {
            return res.status(404).json({
                message: "The authentication failed",
                status: 'ERROR'
            })
        }
        if (user.role == "admin" || user?.id === userId) {
            next()
        } else if (user.role == "instructor") {
            if (req.path.includes('/attendance')) {
                next();
            } else {
                return res.status(403).json({
                    message: "Access denied: Instructors can only access attendance functions",
                    status: 'ERROR'
                });
            }
        } else {
            return res.status(404).json({
                message: "Access denied",
                status: 'ERROR'
            })
        }
    });
}

module.exports = {
    authMiddleWare,
    authUserMiddleWare
}