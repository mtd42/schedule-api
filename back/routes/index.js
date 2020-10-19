const express = require('express');
const router = express.Router();
const scheduleData = require('../database/cron-schedule.json');

router.get('/', async function(_req, res, _next) {
    res.render('index', {
        lundi: scheduleData.lundi,
        mardi: scheduleData.mardi,
        mercredi: scheduleData.mercredi,
        jeudi: scheduleData.jeudi,
        vendredi: scheduleData.vendredi,
    });
});

module.exports = router;
