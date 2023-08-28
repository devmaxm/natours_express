const express = require('express')
const tourController = require('../controllers/tourController')
const authController = require('../controllers/authController')

const reviewsRouter = require('../routes/reviewsRouter')

const tourRouter = express.Router()

tourRouter.use('/:tourId/reviews', reviewsRouter)

tourRouter.route('/top-5').get(tourController.topFiveToursMiddleware, tourController.getAllTours)
tourRouter.route('/stats').get(tourController.getTourStats)
tourRouter.route('/plan/:year').get(tourController.getMonthlyPlan)
tourRouter.route('/within/:distance/center/:latlng/unit/:unit').get(tourController.getTourWithin)

tourRouter
    .route('/')
    .post(
        authController.rolesProtect('admin'),
        tourController.uploadTourImages,
        tourController.resizeTourImages,
        tourController.createTour
    )
    .get(tourController.getAllTours)

tourRouter
    .route('/:id')
    .delete(
        authController.rolesProtect('admin'),
        tourController.deleteTour
    )
    .put(
        authController.rolesProtect('admin'),
        tourController.uploadTourImages,
        tourController.resizeTourImages,
        tourController.updateTour
    )
    .get(tourController.getOneTour)

module.exports = tourRouter