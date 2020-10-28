import * as models from './models.js';
import * as api from '../../bin/library.js';

const getSchedulesByWeeks = (req, res, next) => {
    try {
        const scheduleWeeksData = models.scheduleWeeks();
        req.state = 'ok';
        req.resource = scheduleWeeksData;
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
        req.resource = { ...scheduleDocumentData };
    } catch (err) {
        api.handleError(req, err);
    }
    next();
};

export {
    getSchedulesByWeeks,
    getSchedulesByIdWeek,
};
