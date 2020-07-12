const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;
/*
    console.log(req.headers);
{
  'content-type': 'application/json',
  authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlOTJjMTViMjNhYTgxMTI4MGVjNjRlMCIsImlhdCI6MTU4NjY5NDUxNCwiZXhwIjoxNTg5Mjg2NTE0fQ.EGj_FoRjaAc42KUoUVviNfJYxgmPo_5a3ZJlEeGPJig',
  'user-agent': 'PostmanRuntime/7.24.1',
  accept: '',
  'postman-token': 'c30cc1e0-8761-4f20-935f-30211ccd4897',
  host: 'localhost:5000',
  'accept-encoding': 'gzip, deflate, br',
  connection: 'keep-alive',
  'content-length': '460',
  cookie: 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlOTJjMTViMjNhYTgxMTI4MGVjNjRlMCIsImlhdCI6MTU4NjY5NDUxNCwiZXhwIjoxNTg5Mjg2NTE0fQ.EGj_FoRjaAc42KUoUVviNfJYxgmPo_5a3ZJlEeGPJig'
}

*/
    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ){
        // set token from bearer token in header
        token = req.headers.authorization.split(' ')[1];      
    }
    // set token from cookie
    // else if (req.cookies.token){
    //     token = req.cookies.token
    // }

    // make sure token exists
    if(!token){
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {      
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id);
        
        next();
    } catch (err) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
});

// Grant access specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)){
            return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403));
        }
        next();
    }
} 