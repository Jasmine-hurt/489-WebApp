var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { sequelize, Flashcard, User } = require('./db');
require('./models/User');
require('./models/Deck');
require('./models/Flashcard');
require('dotenv').config();

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
const decksRouter = require('./routes/decks');
const flashcardsRouter = require('./routes/flashcards');
const gamesRouter = require('./routes/games');
const adminRouter = require('./routes/admin');
const studyGuideRouter = require('./routes/studyGuides');

var app = express();

const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'secret_session_key',
  resave: false,
  saveUninitialized: true
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success');
  res.locals.error_msg = req.flash('error');
  res.locals.isAdmin = req.session.user?.isAdmin || false;
  res.locals.session = req.session;
  next();
});

app.use('/decks', decksRouter);
app.use('/flashcards', flashcardsRouter);
app.use('/admin', adminRouter);
app.use('/studyGuides', studyGuideRouter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/games', gamesRouter);

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
sequelize.sync(/*{ force: true }*/).then(async ()=> {
  console.log("Sequelize Sync Completed...")
  
  // hash admin password
  const hashedPassword = await bcrypt.hash("admin", 10);

  await User.findOrCreate({
    where: {
      email: "admin@wsu.edu"
    },
    defaults: {
      name: "Admin",
      password: hashedPassword,
      isAdmin: true
    }
  });

  //const { User, Deck, Flashcard } = require('./db');
});

module.exports = app;
