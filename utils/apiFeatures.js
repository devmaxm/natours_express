class APIFeatures {
    constructor(query, queryString) {
        this.query = query
        this.queryString = queryString
    }

    filter() {
        const query = {...this.queryString}
        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach(field => delete query[field])
        const queryString = JSON.stringify(query).replace(/\b(gte|gt|lte|lt)\b/g, el => `$${el}`)
        this.query.find(JSON.parse(queryString))
        return this
    }

    sort() {
        if (this.queryString.sort) {
            this.query.sort(this.queryString.sort)
        } else {
            this.query.sort('createdAt')
        }
        return this
    }

    fields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ')
            this.query.select(fields)
        } else {
            this.query.select('-__v')
        }
        return this
    }

    paginate() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 4
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this
    }
}

module.exports = APIFeatures