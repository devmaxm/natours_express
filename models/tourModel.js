const mongoose = require('mongoose')
const slugify = require('slugify')

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: true
        },
        duration: {
            type: Number,
            required: [true, 'A tour must have a duration']
        },
        slug: String,
        maxGroupSize: {
            type: Number,
            required: [true, 'A tour must have a group size']
        },
        ratingsAverage: {
            type: Number,
            default: 0,
            set: val => Math.round(val * 10) / 10
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required: [true, 'A tour must have a price']
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficulty']
        },
        summary: {
            type: String,
            trim: true
        },
        description: {
            type: String,
            required: [true, 'A tour must have a description']
        },
        imageCover: {
            type: String,
            required: [true, 'A tour must have an image cover']
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },
        startDates: [Date],
        startLocation: {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
        },
        locations: [
            {
                type: {
                    type: String,
                    default: 'Point',
                    enum: ['Point']
                },
                coordinates: [Number],
                address: String,
                description: String,
            }
        ],
        guides: [
            {

                type: mongoose.Schema.ObjectId,
                ref: 'users'
            }
        ]
    },
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
)

tourSchema.index({ startLocation: '2dsphere' });

tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

tourSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt'
    });

    next();
});

tourSchema.virtual('reviews', {
    ref: "reviews",
    foreignField: 'tour',
    localField: '_id'
})

const Tour = mongoose.model("tours", tourSchema)

module.exports = Tour
