const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cron = require('node-cron');
const fs = require('fs');

const indexRouter = require('./back/routes/index');
const scheduleRouter = require('./back/routes/schedule');
const { espiSchedule } = require('./back/components/scheduler/scheduler');

const app = express();

app.set('views', path.join(__dirname, '/front/views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/front/public')));

app.use(function(req, res, next) {
  req.headers['if-none-match'] = 'no-match-for-this';
  next();    
});

cron.schedule('* * * * *', async () => {
  const scheduleData = await espiSchedule('11/08/2020');
  fs.writeFileSync('./back/database/cron-schedule.json', scheduleData);
});

app.use('/', indexRouter);
app.use('/schedule', scheduleRouter);

app.use((_req, _res, next) => {
  next(createError(404));
});

app.use((err, req, res, _next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
