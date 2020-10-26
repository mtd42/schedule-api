import * as api from '../../bin/controller';
import * as services from './services';

const schedules = (app) => {
    app.route('/schedules/weeks').get(
        services.getSchedulesByWeeks,
        api.controller,
    );
};

const schedulesByWeek = (app) => {
    app.route('/schedules/weeks/:idWeek').get(
        services.getSchedulesByIdWeek,
        api.controller,
    );
};

const schedulesRoutes = (app) => {
    schedules(app);
    schedulesByWeek(app);
};

export {
    schedulesRoutes,
};
