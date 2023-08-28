const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");


const getAll = Model => catchAsync(
    async (req, res, next) => {
        const query = new APIFeatures(Model.find(), req.query)
            .filter()
            .sort()
            .fields()
            .paginate()

        const doc = await query.query

        return res.status(201).json({
            status: 'success',
            result: doc.length,
            data: {
                data: doc
            }
        })
    }
)

const getOne = (Model, populateOptions) => catchAsync(
    async (req, res, next) => {
        const query = Model.findById(req.params.id)
        if (populateOptions) query.populate = query.populate(populateOptions)

        const doc = await query
        if (!doc) {
            return next(new AppError('Document with this ID does not exist', 404))
        }

        return res.status(200).json({
            status: 'success',
            data: {
                data: doc
            }
        })
    }
)

const createOne = Model => catchAsync(
    async (req, res, next) => {
        const doc = await Model.create(req.body)

        return res.status(201).json({
            status: 'success',
            data: {
                data: doc
            }
        })
    }
)

const deleteOne = Model => catchAsync(
    async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id)
        if (!doc) {
            return next(new AppError('Document with this ID does not exist', 404))
        }

        return res.status(204).json({
            status: 'success',
            data: {
                data: doc
            }
        })
    }
)

const updateOne = Model => catchAsync(
    async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        })
        if (!doc) {
            return next(new AppError('Document with this ID does not exist', 404))
        }
        return res.status(200).json({
            status: 'success',
            data: {
                data: doc
            }
        })
    }
)

module.exports = {
    getAll,
    getOne,
    createOne,
    deleteOne,
    updateOne
}
