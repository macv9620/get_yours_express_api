const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const cors = require('cors')



require('dotenv').config()

const itemsRouter = require('./routes/items');
const categoriesRouter = require('./routes/categories');
const brandsRouter = require('./routes/brands');
const statusRouter = require('./routes/status');

const app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/items', itemsRouter);
app.use('/categories', categoriesRouter);
app.use('/brands', brandsRouter);
app.use('/status', statusRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // json the error page
  res.status(err.status || 500);
  res.json('error');
});

module.exports = app;
