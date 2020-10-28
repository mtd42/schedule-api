import jsdom from 'jsdom';
import Axios from 'axios';
import moment from 'moment';
import { messageError } from '../../bin/library';

const fetchScheduleData = async (date) => {
    const { data } = await Axios.get(`https://edtmobiliteng.wigorservices.net//WebPsDyn.aspx?action=posEDTBEECOME&serverid=C&Tel=mathieu.dorville&date=${date}`);
    const dom = new jsdom.JSDOM(data);
    if (data.length === 328) {
        throw messageError('badParams', 'Oops ! Il y a eu une erreur lors de la récupération des données, veuillez relancer la requête.');
    }

    const dom_profs = dom.window.document.getElementsByClassName('TCProf');
    const arr_profs = Object.values(dom_profs);
    const finalProfs = [];
    arr_profs.forEach((e) => {
        const tmp = e.textContent.split('I2 G2')[0];
        if (tmp !== '' && tmp !== 'I2 ALT 20/21 EPSI BDX') {
            finalProfs.push(tmp.toUpperCase());
        } else {
            finalProfs.push('Pas de prof'.toUpperCase());
        }
    });

    const data_hours = dom.window.document.getElementsByClassName('TChdeb');
    const hours = Object.values(data_hours).map((e) => e.textContent.split(' - '));

    const dom_rooms = dom.window.document.getElementsByClassName('TCSalle');
    const rooms = Object.values(dom_rooms).map((e) => e.textContent.split('Salle:')[1]);

    const classes = dom.window.document.getElementsByClassName('TCase');
    const arr_classes = Object.values(classes);

    const finalClasses = [];
    arr_classes.forEach((e) => {
        if (e.attributes.length === 3) {
            finalClasses.push(e.textContent.toUpperCase());
        }
    });

    const schedule = finalProfs.map((_e, i) => Object.assign(
        {},
        { startAt: hours[i][0] },
        { endAt: hours[i][1] },
        { professorName: finalProfs[i] },
        { className: finalClasses[i]},
        { classRoom: rooms[i] },
    ),
    );

    let previous_value = null;
    const pos = [0];
    schedule.forEach((e, i, a) => {
        const current_value = parseInt(schedule[i].startAt.split(':')[0], 10);
        if (current_value < previous_value) pos.push(i);
        previous_value = current_value;
    });

    pos.push(schedule.length);
    const days = pos.map((_e, i) => schedule.slice(pos[i], pos[i + 1]));
    days.pop();

    const weekWithClasses = {
        monday: days[0],
        tuesday: days[1],
        wednesday: days[2],
        thurday: days[3],
        friday: days[4],
    };

    const weekWithoutClasses = {
        monday: [],
        tuesday: [],
        wednesday: [],
        thurday: [],
        friday: [],
    };

    return schedule.length ? { ...weekWithClasses } : { ...weekWithoutClasses };
};

const findMondays = (nbOfMondays) => {
    const start = moment();
    const end = moment().add(45, 'd');
    const arr = [];
    const tmp = start.clone().day(1);
    if ( tmp.isAfter(start, 'd') ) {
        arr.push(tmp.format('MM/DD/YYYY'));
    }
    while (tmp.isBefore(end) ) {
        tmp.add(nbOfMondays, 'days');
        arr.push(tmp.format('MM/DD/YYYY'));
    }
    arr.unshift(moment().format('L'));
    return arr;
};

const scheduleWeeks = () => {
    try {
        const mondays = findMondays(7);
        const data = mondays.map((e, i) => {
            return {
                id: i + 1,
                month: moment.months((moment(mondays[i], 'MM/DD/YYYY').month())),
                startDate: moment(mondays[i], 'MM/DD/YYYY').startOf('week').add(1, 'd').format('L'),
                endDate: moment(mondays[i], 'MM/DD/YYYY').add(4, 'days').format('L'),
                links: {
                    rel: `${process.env.API_URL}/schedules/weeks`,
                    self: `${process.env.API_URL}/schedules/weeks/${i + 1}`,
                },
            };
        });
        return data;
    } catch (e) {
        console.error(e);
    }
};

const findScheduleByIdWeek = async (idWeek) => {
    const mondays = findMondays(7);
    const data = await fetchScheduleData(mondays[idWeek - 1]);
    return data;
};

export {
    scheduleWeeks,
    findScheduleByIdWeek,
};
