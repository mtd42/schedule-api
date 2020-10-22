import * as infos from '../../package.json';

const fetchWelcomeData = () => {
    const obj = {
        message: 'Welcome to schedule-api',
        version: infos.default.version,
        date: new Date(new Date() - 3600 * 1000 * 3).toISOString().split('T')[0].split('-').reverse().join('/'),
    };
    return obj;
};

export {
    fetchWelcomeData,
};
