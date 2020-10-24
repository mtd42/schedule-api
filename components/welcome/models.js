import * as infos from '../../package.json';
import moment from 'moment';

const fetchWelcomeData = () => {
    const obj = {
        message: 'Welcome to schedule-api',
        version: infos.default.version,
        author: infos.default.author,
        homepage: infos.default.homepage,
        date: moment().format('MMMM Do YYYY, h:mm:ss a'),
        endpoints: {
            schedules: `${process.env.API_URL}/schedules`,
        },
    };
    return obj;
};

export {
    fetchWelcomeData,
};
