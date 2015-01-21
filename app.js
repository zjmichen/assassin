var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('./models/User');

var routes = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var sessions = require('./routes/sessions');
var games = require('./routes/games');
var invites = require('./routes/invites');
var assignments = require('./routes/assignments');
var mail = require('./routes/mail');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret:'asdf'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.use('/', routes);
app.use('/users', users);
app.use('/auth', auth);
app.use('/sessions', sessions);
app.use('/games', games);
app.use('/invites', invites);
app.use('/assignments', assignments);
app.use('/mail', mail);

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.SITE_URL + '/auth/facebook/callback'
}, function(accessToken, refreshToken, profile, done) {
  var email = profile.emails[0].value;
  User.findOrCreate({
    profile: profile,
    email: email
  }, function(err, user) {
    if (err) { return done(err); }
    done(null, user);
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    if (err) { return done(err); }
    done(null, user);
  });
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  console.log('Starting in dev environment');
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });

  mongoose.connect('mongodb://localhost/dev');
} else if (app.get('env') === 'production') {
  mongoose.connect(process.env.MONGO_URI, function(err) {
    if (err) { return console.log(err); }

    console.log("Connected to mongo at " + process.env.MONGO_URI);
  });
} else {
  console.log('Starting in other environment');
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;