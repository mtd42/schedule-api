import * as infos from '../../package.json';
import moment from 'moment';

const fetchWelcomeData = () => {
    const obj = {
        message: 'Welcome to the open-api espi-schedule-api',
        version: infos.default.version,
        author: infos.default.author,
        github: infos.default.homepage,
        endpoints: {
            schedules: `${process.env.API_URL}/schedules`,
        },
        date: moment().format('MMMM Do YYYY, h:mm:ss a'),
    };
    return obj;
};

export {
    fetchWelcomeData,
};
