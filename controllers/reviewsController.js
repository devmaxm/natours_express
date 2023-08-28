const Review = require('../models/reviewModel')
const factory = require('./handleFactory')

const setIds = (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId
    if (!req.body.user) req.body.user = req.user.id
    next()
}

const getAllReviews = factory.getAll(Review)

const getOneReview = factory.getOne(Review)

const createReview = factory.createOne(Review)

const deleteReview = factory.deleteOne(Review)

const updateReview = factory.updateOne(Review)

module.exports = {
    createReview,
    deleteReview,
    updateReview,
    getOneReview,
    getAllReviews,
    setIds
}