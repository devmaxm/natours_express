const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const {JWT_EXPIRES_IN, JWT_ACCESS_SECRET, JWT_COOKIE_EXPIRES_IN} = require('../envVariables')

const generateAuthResponse = (res, user, status) => {
    const token = jwt.sign({id: user.id}, JWT_ACCESS_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    })

    user.password = undefined

    const cookieOptions = {
        expires: new Date(
            Date.now() + JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: false
    };
    res.cookie('jwt', token, cookieOptions)
    return res.status(status).json({
        status: 'success',
        data: {
            user,
            token
        }
    })
}

const isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JWT_ACCESS_SECRET
            );
            const currentUser = await User.findById(decoded.id);

            if (!currentUser) {
                return next();
            }

            if (currentUser.changedPasswordAfter(decoded.iat)) {
                return next();
            }

            res.locals.user = currentUser;
            return next();
        } catch (err) {
            return next();
        }
    }
    next();
};

const signup = catchAsync(async (req, res, next) => {
    const {fullName, email, password, passwordConfirm} = req.body
    if (await User.findOne({email})) {
        return next(new AppError('User is already exist', 401))
    }
    if (password !== passwordConfirm) {
        return next(new AppError('Password mismatch', 401))
    }
    const newUser = await User.create({
        fullName, email, password
    })

    generateAuthResponse(res, newUser, 201)
})

const login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body
    if (!email || !password) {
        return next(new AppError('Please send email and password', 401))
    }
    const user = await User.findOne({email})
    if (!user || !await user.correctPassword(password, user.password)) {
        return next(new AppError('Invalid data send', 401))
    }

    generateAuthResponse(res, user, 200)
})

const currentUser = catchAsync(async (req, res, next) => {
    generateAuthResponse(res, req.user, 200)
})

const authProtect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1]
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt
    }

    const decode = jwt.verify(token, JWT_ACCESS_SECRET)
    if (!decode) {
        return next(AppError.UnauthorizedError())
    }
    const candidate = await User.findById(decode.id)
    if (!candidate) {
        return next(AppError.UnauthorizedError())
    }

    if (candidate.changedPasswordAfter(decode.iat)) {
        return next(new AppError('User recently changed password! Please login again.', 401))
    }

    req.user = candidate
    res.locals.user = candidate;
    next()
})

const rolesProtect = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            next(new AppError('You have not access to this resource', 403))
        }
        next()
    }
}

module.exports = {
    generateAuthResponse,
    signup,
    login,
    currentUser,
    authProtect,
    rolesProtect,
    isLoggedIn
}