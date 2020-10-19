const express = require('express');
const { espiSchedule } = require('../components/scheduler/scheduler');
const router = express.Router();

router.get('/', async (req, res, _next) => {
    try {
        const { date, day } = req.query;
        const data = JSON.parse(await espiSchedule(date));
        const resource = day ? { [day]: data[day] } : data;
        res.status(200).json(resource);
    } catch (e) {
        console.error(e);
        res.status(500).json({error: e});
    }
});

module.exports = router;
