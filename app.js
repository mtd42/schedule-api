const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cron = require('node-cron');
const fs = require('fs');

const indexRouter = require('./routes/index');
const scheduleRouter = require('./routes/schedule');
const { espiSchedule } = require('./scheduler/scheduler');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

cron.schedule('* * * * *', async () => {
  const scheduleData = await espiSchedule('11/08/2020');
  fs.writeFileSync('./database/cron-schedule.json', scheduleData);
});

app.use('/', indexRouter);
app.use('/schedule', scheduleRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
