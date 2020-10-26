import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
// import cron from 'node-cron';
// import fs from 'fs';
// import beautify from 'js-beautify';

import * as server from './bin/server';
import { router } from './bin/router';
// import { scheduleWeeks } from './components/schedules/models';


const app = express();
const log = morgan('dev');

server.run(app);

app.disable('etag');
app.disable('x-powered-by');

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true,
    mergeParams: true,
}));

app.use(bodyParser.json());

app.use(log);

// cron.schedule('*/4 * * * *', async () => {
//     const scheduleWeeksData = await scheduleWeeks(true);
//     fs.writeFileSync('./database/schedule-weeks.json', beautify(JSON.stringify(scheduleWeeksData), { indent_size: 2, space_in_empty_paren: true }));
// });

// cron.schedule('*/2 * * * *', async () => {
//     const scheduleDocumentData = await scheduleWeeks(false);
//     fs.writeFileSync('./database/schedule-document.json', beautify(JSON.stringify(scheduleDocumentData), { indent_size: 2, space_in_empty_paren: true }));
// });

router(app);

app.use((req, res) => {
    res.status(404).json('Url not found');
    res.end();
});
