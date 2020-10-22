import * as api from '../../bin/controller';
import * as services from './services';

const welcome = (app) => {
    app.route('/').get(
        services.welcome,
        api.controller,
    );
};

const welcomeRoutes = (app) => {
    welcome(app);
};

export {
    welcomeRoutes,
};
