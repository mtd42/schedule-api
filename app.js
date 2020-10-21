import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cron from 'node-cron';
import fs from 'fs';

import * as server from './bin/server';
import { router } from './bin/router';
import { fetchScheduleData } from './components/schedules/models';

const app = express();
const log = morgan('dev');

server.run(app);

app.disable('etag');
app.disable('x-powered-by');

app.use(bodyParser.urlencoded({
    extended: true,
    mergeParams: true,
}));

app.use(bodyParser.json());

app.use(log);

cron.schedule('* * * * *', async () => {
    const scheduleData = await fetchScheduleData('11/01/2020');
    fs.writeFileSync('./database/cron-schedule.json', scheduleData);
});

router(app);

app.use((req, res) => {
    res.status(404).json('Url not found');
    res.end();
});
