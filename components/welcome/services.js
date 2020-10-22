import * as models from './models.js';
import * as api from '../../bin/library.js';

const welcome = async (req, res, next) => {
    try {
        const data = models.fetchWelcomeData();
        req.state = 'ok';
        req.resource = Object.assign({}, data);
    } catch (e) {
        api.handle_errors(req, err);
    }
    next();
};

export {
    welcome,
};
