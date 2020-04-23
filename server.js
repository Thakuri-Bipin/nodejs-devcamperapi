const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
// const logger = require('./middleware/logger');


//load env vars
dotenv.config({ path: './config/config.env' });

//connnect to database 
connectDB();


//route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');


const app = express();

//body parser
app.use(express.json());

// cookie parser
app.use(cookieParser());

//Dev logging middleware
// app.use(logger);
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//file uploading
app.use(fileupload());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

//mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

//using errorhandler middleware after effective for bootcamps
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));

 app.get('/', (req,res) => {
     res.writeHead(200, {
        'Content-Type' : 'text/plain'
     });
     res.write('NodeJs API Working....');
     res.end();
 });

// handle unhandled promise rejections like db login failed
process.on('unhandledRejection', (err, Promise) => {
    console.log(`Error: ${err.message}`.red);
    //close server and exit process
    server.close(() => process.exit(1));
})
