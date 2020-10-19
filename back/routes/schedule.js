const express = require('express');
const { scheduleComponent } = require('../components/scheduleComponent/scheduleComponent');
const router = express.Router();

router.get('/', async (req, res, _next) => {
    try {
        const { date, day } = req.query;
        const data = JSON.parse(await scheduleComponent(date));
        const resource = day ? { [day]: data[day] } : data;
        res.status(200).json(resource);
    } catch (e) {
        console.error(e);
        res.status(500).json({error: e});
    }
});

module.exports = router;
