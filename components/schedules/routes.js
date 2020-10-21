import * as api from '../../bin/controller';
import * as services from './services';

const schedules = (app) => {
    app.route('/schedules').get(
        services.schedules,
        api.controller,
    );
};

const schedulesRoutes = (app) => {
    schedules(app);
};

export {
    schedulesRoutes,
};
