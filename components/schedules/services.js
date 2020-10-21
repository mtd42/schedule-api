import * as models from './models.js';
import * as api from '../../bin/library.js';

const schedules = async (req, _res, next) => {
    try {
        const { date, day } = req.query;
        const data = JSON.parse(await models.fetchScheduleData(date));
        const resource = day ? { [day]: data[day] } : data;
        req.state = 'ok';
        req.resource = resource;
    } catch (e) {
        api.handle_errors(req, err);
    }
    next();
};

export {
    schedules,
};
