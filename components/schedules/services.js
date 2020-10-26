import * as models from './models.js';
import * as api from '../../bin/library.js';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

const getSchedulesByWeeks = (req, res, next) => {
    try {
        const scheduleWeeksData = models.scheduleWeeks();
        req.state = 'ok';
        req.resource = Object.assign({}, {
            weeks: scheduleWeeksData,
            links: {
                prev: process.env.API_URL,
                self: `${process.env.API_URL}${req.url}`,
                method: req.method.toLowerCase(),
            },
            metadata: {
                date: moment().format('LLL'),
                requestId: uuidv4(),
            },
        });
    } catch (err) {
        api.handleError(req, err);
    }
    next();
};

const getSchedulesByIdWeek = async (req, res, next) => {
    try {
        const { idWeek } = req.params;
        const scheduleDocumentData = await models.findScheduleByIdWeek(idWeek);
        req.state = 'ok';
        req.resource = Object.assign({}, {
            ...scheduleDocumentData,
            links: {
                self: `${process.env.API_URL}${req.url}`,
                method: req.method.toLowerCase(),
            },
            metadata: {
                date: moment().format('LLL'),
                requestId: uuidv4(),
            },
        });
    } catch (err) {
        api.handleError(req, err);
    }
    next();
};

export {
    getSchedulesByWeeks,
    getSchedulesByIdWeek,
};
