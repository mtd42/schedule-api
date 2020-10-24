import * as infos from '../../package.json';
import moment from 'moment';

const fetchWelcomeData = (locale) => {
    const traduction = {
        message: {
            ['en-US']: 'Welcome to the OPEN API epsi-schedule-api',
            ['fr']: 'Bienvenue sur l\'open api espi-schedule-api',
        },
    };
    const obj = {
        message: traduction.message[locale],
        version: infos.default.version,
        author: infos.default.author,
        github: infos.default.homepage,
        endpoints: {
            schedules: `${process.env.API_URL}/schedules`,
        },
        date: moment().locale(locale).format('LLL'),
    };
    return obj;
};

export {
    fetchWelcomeData,
};
