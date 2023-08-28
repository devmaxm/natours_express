const mongoose = require('mongoose')
const Tour = require('./tourModel')

const reviewSchema = mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, `Review can't be empty.`]
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        tour: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'tours',
            required: [true, 'Review must belong to a tour']
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: [true, 'Review must belong to a user']
        },

    },
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
)

reviewSchema.pre(/^find/, function (next) {
    this.populate({path: 'user', select: 'fullName photo'})
    next()
})

reviewSchema.statics.calculateAverageRatings = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: {tour: tourId}
        },
        {
            $group: {
                _id: 'tour',
                avgRating: {$avg: '$rating'},
                nRating: {$sum: 1}
            }
        }
    ])
    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsAverage: stats[0].avgRating,
            ratingsQuantity: stats[0].nRating
        })
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsAverage: 0,
            ratingsQuantity: 0
        })
    }
}

reviewSchema.post('save', function () {
    this.constructor.calculateAverageRatings(this.tour)
    return this.populate({path: 'user', select: 'fullName photo'})
})

reviewSchema.post(/^findOneAnd/, async function (doc) {
    await doc.constructor.calculateAverageRatings(doc.tour);
});

const Review = mongoose.model('reviews', reviewSchema)

module.exports = Review