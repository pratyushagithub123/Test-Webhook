var createError = require('http-errors');
var express = require('express');
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`
});
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const responseMiddleWare = require("./middlewares/response.middleware");
const cors = require("./middlewares/cors.middleware");
var app = express();
app.use(cors.allowCrossDomainRequests);
//for swagger Api docs 
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(responseMiddleWare);
app.use(express.static(path.join(__dirname, 'public')));

var appRouter =  require("./routes/v1");

app.use('/', appRouter.configRouter);
app.use('/server', appRouter.serverRouter);
app.use('/part', appRouter.partRouter);
app.use('/serverpart', appRouter.serverPartsRouter);
app.use('/normalizeservers', appRouter.normalizeServerRouter);
app.use('/normalizeparts', appRouter.normalizePartRouter);

// swagger api routes
app.use('/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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

module.exports = app;
