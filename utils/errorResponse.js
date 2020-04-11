class ErrorResponse extends Error {
    constructor(message, statusCode){
        super(message); // calling constructor Error class
        this.statusCode = statusCode;
    }
}

module.exports = ErrorResponse;