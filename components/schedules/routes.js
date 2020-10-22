import * as api from '../../bin/controller';
import * as services from './services';

const schedules = (app) => {
    app.route('/schedules').get(
        services.schedules,
        api.controller,
    );
};

const schedulesByWeek = (app) => {
    app.route('/schedules/:id_week').get(
        services.schedulesByWeek,
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
