import * as infos from '../../package.json';
import moment from 'moment';

const fetchWelcomeData = () => {
    const obj = {
        message: 'Welcome to the OPEN API for the espi-schedule',
        version: infos.default.version,
        author: infos.default.author,
        github: infos.default.homepage,
        endpoints: {
            schedules: `${process.env.API_URL}/schedules`,
        },
        date: moment().format('LLL'),
    };
    return obj;
};

export {
    fetchWelcomeData,
};
