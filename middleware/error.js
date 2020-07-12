const ErrorResponse = require('../utils/errorResponse');

// custom error handler
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // log to console for dev
    console.log(err);

    // Mongoose bad object Id
    if (err.name === 'CastError'){
        const message = `Resource not found`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoogse Duplicate Key eg same bootcamp name
    if (err.code === 11000){
        const message = 'Duplicate Field Value Entered';
        error = new ErrorResponse(message, 400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError'){
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success : false,
        error: error.message || 'Server Error'
    });
}

module.exports = errorHandler;