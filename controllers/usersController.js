const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const User = require('../models/userModel')
const {generateAuthResponse} = require('../controllers/authController')
const crypto = require('crypto')
const sendMail = require('../utils/email')
const multer = require('multer')
const sharp = require('sharp')

const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError('File must be an image', 400), false)
    }
}

const filterObject = (obj, ...allowedFields) => {
    const result = {}
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) result[el] = obj[el]
    })

    return result
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

const uploadUserPhoto = upload.single('photo')

const resizePhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next()

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`

    await sharp(req.file.buffer)
        .resize(500, 500).toFormat('jpeg')
        .toFile(`public/img/users/${req.file.filename}`)
    next()
})

const updateUser = catchAsync(async (req, res, next) => {
    if (req.password) {
        return next(new AppError('This route is not for password update. Please visit /users/reset-password', 500))
    }
    const userData = filterObject(req.body, 'fullName', 'email')
    if (req.file) userData.photo = req.file.filename

    const updatedUser = await User.findByIdAndUpdate(req.user.id, userData, {
        new: true,
        runValidators: true
    })

    return res.status(201).json({
        status: 'success',
        data: {
            data: updatedUser
        }
    })
})

const resetPassword = catchAsync(async (req, res, next) => {
    const {oldPassword, newPassword, newPasswordConfirm} = req.body
    const user = await User.findById(req.user.id)
    if (!oldPassword || !newPassword || !newPasswordConfirm) {
        next(new AppError('Please fill all required fills', 400))
    }

    if (!await user.correctPassword(oldPassword, user.password)) {
        return next(new AppError('Your current password is wrong', 401))
    }

    if (newPassword !== newPasswordConfirm) {
        return next(new AppError('New password mismatch', 400))
    }

    user.password = newPassword
    await user.save()

    generateAuthResponse(res, user, 200)
})

const forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email})
    if (!user) {
        return next(new AppError('User with this email does not exist', 404))
    }
    const resetToken = user.createResetToken()
    await user.save({validationBefore: false})

    const resetURL = `${req.protocol}://${req.get('host')}/api/users/forgot-password/${resetToken}`;
    const message = `Forgot your password? Submit a PUT request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
    try {
        await sendMail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        })
        return res.status(200).json({
            status: 'success',
            message: 'Reset password link sent to your email.'
        })
    } catch (e) {
        return next(new AppError('There was an error sending the email. Try again later', 500))
    }

})

const resetForgottenPassword = catchAsync(async (req, res, next) => {
    const {password, passwordConfirm} = req.body
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()}
    })

    if (!user) {
        return next(new AppError('Token invalid or expired', 400))
    }

    if (password !== passwordConfirm) {
        return next(new AppError('Password mismatch', 400))
    }

    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    user.password = password
    await user.save()
    generateAuthResponse(res, user, 200)
})

module.exports = {
    updateUser,
    resetPassword,
    forgotPassword,
    resetForgottenPassword,
    uploadUserPhoto,
    resizePhoto
}