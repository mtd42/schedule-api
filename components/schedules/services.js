// import * as models from './models.js';
import * as api from '../../bin/library.js';
import scheduleWeeks from '../../database/schedule-weeks.json';
import scheduleDocument from '../../database/schedule-document.json';


const schedules = async (req, res, next) => {
    try {
        const scheduleWeeksData = scheduleWeeks;
        req.state = 'ok';
        req.resource = scheduleWeeksData;
    } catch (e) {
        api.handle_errors(req, err);
    }
    next();
};

const schedulesByWeek = async (req, res, next) => {
    try {
        const { id_week } = req.params;
        const scheduleDocumentData = scheduleDocument[id_week];
        req.state = 'ok';
        req.resource = scheduleDocumentData;
    } catch (e) {
        api.handle_errors(req, err);
    }
    next();
};

export {
    schedules,
    schedulesByWeek,
};
