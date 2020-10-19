const express = require('express');
const router = express.Router();
const schedule_data = require('../database/cron-schedule.json')

router.get('/', async function(req, res, next) {
    console.log(req.query.date);
    
    res.render('index', { 
        lundi : schedule_data.lundi, 
        mardi: schedule_data.mardi, 
        mercredi: schedule_data.mercredi, 
        jeudi: schedule_data.jeudi, 
        vendredi: schedule_data.vendredi  
        });
});

module.exports = router;
