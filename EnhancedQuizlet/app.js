var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { sequelize } = require('./db');
require('./models/User');
require('./models/Deck');
require('./models/Flashcard');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
const decksRouter = require('./routes/decks');
const flashcardsRouter = require('./routes/flashcards');

var app = express();

const session = require('express-session');
const flash = require('connect-flash');

app.use(session({
  secret: 'secret_session_key',
  resave: false,
  saveUninitialized: true
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success');
  res.locals.error_msg = req.flash('error');
  res.locals.session = req.session;
  next();
});

app.use('/decks', decksRouter);
app.use('/flashcards', flashcardsRouter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);

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
  res.render('error');
});

// force clears the database upon starting, remove it if needed
sequelize.sync(/*{ force: true }*/).then(()=> {
  console.log("Sequelize Sync Completed...")
})

module.exports = app;
