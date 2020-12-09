/*
Author: Author: Hong Viet
Team: Team Seven
Course: COMP229 - Fall 2020
Purpose: Team Project - Survey Site
*/ 

// Installed third party packages
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

//module for authentication
let session = require('express-session');
let passport = require('passport');
let passportLocal = require('passport-local');
let localstrategy = passportLocal.Strategy;
let flash = require('connect-flash');
// Database Setup
let mongoose = require('mongoose');
let DB = require('./db');

// Point mongoose to the DB URI
mongoose.connect(DB.URI, {useNewUrlParser: true, useUnifiedTopology: true});

// 
let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection Error:'));
mongoDB.once('open', () => {
  console.log('Connected to MongoDB...');
})


// Routes
let indexRouter = require('../routes/index');
let usersRouter = require('../routes/users');
let surveysRouter = require('../routes/survey');


let app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views')); 
app.set('view engine', 'ejs'); // express -e

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

//setup express session
app.use(session({
  secret:"SomeSecrect",
  saveUninitialized: false,
  resave:false
}))

//initialize flash
app.use(flash());

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//passport user configuration

//create a user instance
let userModel = require('../models/user');
let User  = userModel.User;

//implement a User Authentication strategy
passport.use(User.createStrategy());

//Serialize and deserialize the user info
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/survey-list', surveysRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', 
  { title: 'Error'});
});

module.exports = app;
