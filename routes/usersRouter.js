const {Router} = require('express')
const authController = require('../controllers/authController')
const usersController = require('../controllers/usersController')

const usersRouter = Router()

usersRouter.route('/signup').post(authController.signup)
usersRouter.route('/login').post(authController.login)
usersRouter.route('/me')
    .get(authController.authProtect, authController.currentUser)
    .put(
        authController.authProtect,
        usersController.uploadUserPhoto,
        usersController.resizePhoto,
        usersController.updateUser
    )

usersRouter.route('/reset-password').put(authController.authProtect, usersController.resetPassword)
usersRouter.route('/forgot-password').post(usersController.forgotPassword)
usersRouter.route('/forgot-password/:token').put(usersController.resetForgottenPassword)


module.exports = usersRouter