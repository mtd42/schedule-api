const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cron = require('node-cron');
const fs = require('fs');
const favicon = require('serve-favicon');

const indexRouter = require('./back/routes/index');
const scheduleRouter = require('./back/routes/schedule');
const { scheduleComponent } = require('./back/components/scheduleComponent/scheduleComponent');

const app = express();

app.use(favicon(path.join(__dirname, '/front/public/images/favicon.ico')));
app.set('views', path.join(__dirname, '/front/views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/front/public')));

app.use(function(req, _res, next) {
    req.headers['if-none-match'] = 'no-match-for-this';
    next();
});

cron.schedule('* * * * *', async () => {
    const scheduleData = await scheduleComponent('11/01/2020');
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
