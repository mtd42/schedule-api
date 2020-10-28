import * as infos from '../../package.json';

const fetchWelcomeData = () => {
    const obj = {
        message: 'Welcome to the OPEN API for the epsi-schedule',
        version: infos.default.version,
        author: infos.default.author,
        github: infos.default.homepage,
        endpoints: {
            schedules: {
                weeks: `${process.env.API_URL}/schedules/weeks`,
            },
        },
    };
    return obj;
};

export {
    fetchWelcomeData,
};
