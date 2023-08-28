const {Router} = require('express')
const reviewsController = require('../controllers/reviewsController')
const authController = require('../controllers/authController')


const reviewsRouter = Router({mergeParams: true})

reviewsRouter.use(authController.authProtect)

reviewsRouter.route('/')
    .get(reviewsController.getAllReviews)
    .post(
        reviewsController.setIds,
        reviewsController.createReview
    )

reviewsRouter.route('/:id')
    .get(reviewsController.getOneReview)
    .delete(authController.rolesProtect('user', 'admin'), reviewsController.deleteReview)
    .put(authController.rolesProtect('user', 'admin'), reviewsController.updateReview)

module.exports = reviewsRouter