import * as models from './models.js';
import * as api from '../../bin/library.js';

const welcome = async (req, res, next) => {
    try {
        const locale = req.headers['accept-language'] ? req.headers['accept-language'].split(',')[1].split(';')[0]: 'en-US';
        console.log(locale);
        const data = models.fetchWelcomeData(locale);
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
