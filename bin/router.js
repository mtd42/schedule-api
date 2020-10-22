import { schedulesRoutes } from '../components/schedules/routes';
import { welcomeRoutes } from '../components/welcome/routes';

const router = (app) => {
    welcomeRoutes(app);
    schedulesRoutes(app);
};

export {
    router,
};
