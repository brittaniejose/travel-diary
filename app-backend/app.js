var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
const cors = require('cors');
const fileUpload = require('express-fileupload');


const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
};


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/usersRoutes');
const tripRouter = require('./routes/tripRoutes');
const entryRouter = require('./routes/entryRoutes');

var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));
app.use(fileUpload({
    createParentPath: true
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/trips', tripRouter);
app.use('/entries', entryRouter);



module.exports = app;
