class AppError extends Error {
    statusCode


    constructor(message, statusCode) {
        super(message);

        this.message = message;
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    }

    static UnauthorizedError() {
        return new AppError('Unauthorized', 403)
    }
}

module.exports = AppError