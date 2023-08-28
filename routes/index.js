const {Router} = require('express')
const toursRouter = require('./toursRouter')
const usersRouter = require('./usersRouter')
const reviewsRouter = require('./reviewsRouter')
const bookingRouter = require('./bookingRouter')

const router = Router()

router.use('/tours', toursRouter)
router.use('/users', usersRouter)
router.use('/reviews', reviewsRouter)
router.use('/booking', bookingRouter)


module.exports = router