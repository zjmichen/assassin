const express = require('express');
const path = require('path');
const logger = require('morgan');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const webpack = require('webpack');
const wpConfig = require('../webpack.config');
const wpDevMiddleware = require('webpack-dev-middleware');
const wpHotMiddleware = require('webpack-hot-middleware');

const compiler = webpack(wpConfig);
const mongoose = require('mongoose');
const debug = require('debug')('src:server');

const routes = require('./routes/index');
const auth = require('./routes/auth');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

if (app.get('env') === 'production') {
  mongoose.connect(process.env.MONGO_URI, function(err) {
    if (err) return debug(err);
  });
} else {
  // configure webpack dev server with hot module replacement
  const webpack = require('webpack');
  const wpConfig = require('../webpack.config');
  const wpDevMiddleware = require('webpack-dev-middleware');
  const wpHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(wpConfig);
  
  app.use(wpDevMiddleware(compiler, {
    noInfo: true,
    publicPath: wpConfig.output.publicPath
  }));
  app.use(wpHotMiddleware(compiler));

  // db setup
  mongoose.connect('mongodb://localhost/dev');
}

mongoose.Promise = global.Promise;

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
