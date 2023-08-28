require('dotenv').config()

exports.SERVER_PORT = process.env.PORT

exports.DB = process.env.DB
exports.DB_PASSWORD = process.env.DB_PASSWORD

exports.BCRYPT_SALT = process.env.BCRYPT_SALT

exports.STRIPE_PUBLISH_KEY = process.env.STRIPE_PUBLISH_KEY
exports.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

exports.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
exports.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN
exports.JWT_COOKIE_EXPIRES_IN = process.env.JWT_COOKIE_EXPIRES_IN

exports.EMAIL_HOST = process.env.EMAIL_HOST
exports.EMAIL_PORT = process.env.EMAIL_PORT
exports.EMAIL_USER = process.env.EMAIL_USER
exports.EMAIL_PASS = process.env.EMAIL_PASS


exports.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY