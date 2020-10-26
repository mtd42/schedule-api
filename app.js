import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';

import * as server from './bin/server';
import { router } from './bin/router';

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

router(app);

app.use((req, res) => {
    res.status(404).json('Url not found');
    res.end();
});
