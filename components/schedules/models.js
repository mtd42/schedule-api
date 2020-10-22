import jsdom from 'jsdom';
import Axios from 'axios';

import moment from 'moment';
import jsonSchedule from '../../database/schedule-weeks.json';

const fetchScheduleData = async (date) => {
    const today_date = new Date(new Date() - 3600 * 1000 * 3).toISOString().split('T')[0].split('-').reverse().join('/');
    const valid_date = date === '' ? today_date : date;
    const html = await Axios.get(`https://edtmobiliteng.wigorservices.net//WebPsDyn.aspx?action=posEDTBEECOME&serverid=C&Tel=mathieu.dorville&date=${valid_date}`);

    const dom = new jsdom.JSDOM(html.data);
    const profs = dom.window.document.getElementsByClassName('TCProf');
    const arr_profs = Object.values(profs);
    const final_prof = [];
    arr_profs.forEach((e) => {
        const tmp = e.textContent.split('I2 G2')[0];
        if (tmp !== '' && tmp !== 'I2 ALT 20/21 EPSI BDX') {
            final_prof.push(tmp.toUpperCase());
        } else {
            final_prof.push('Pas de prof'.toUpperCase());
        }
    });

    const data_heures = dom.window.document.getElementsByClassName('TChdeb');
    const heures = Object.values(data_heures).map((e) => e.textContent);

    const dom_salles = dom.window.document.getElementsByClassName('TCSalle');
    const salles = Object.values(dom_salles).map((e) => e.textContent.split('Salle:')[1]);

    const cours = dom.window.document.getElementsByClassName('TCase');
    const arr_cours = Object.values(cours);
    const final_cours = [];
    arr_cours.forEach((e) => {
        if (e.attributes.length === 3) {
            final_cours.push(e.textContent.toUpperCase());
        }
    });

    const emploi_du_temp = final_prof.map((_e, i, _a) => Object.assign(
        {},
        { heure: heures[i] },
        { nom_prof: final_prof[i] },
        { nom_cours: final_cours[i]},
        { salle: salles[i] },
    ),
    );

    let previous_value = null;
    const pos = [0];
    emploi_du_temp.forEach((e, i, a) => {
        const current_value = parseInt(emploi_du_temp[i].heure.split(':')[0], 10);
        if (current_value < previous_value) pos.push(i);
        previous_value = current_value;
    });

    pos.push(emploi_du_temp.length);
    const days = pos.map((_e, i, _a) => emploi_du_temp.slice(pos[i], pos[i + 1]));
    days.pop();

    const test = {
        lundi: days[0],
        mardi: days[1],
        mercredi: days[2],
        jeudi: days[3],
        vendredi: days[4],
    };

    return emploi_du_temp.length ? test : {};
};

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}

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
    return arr;
};

const findScheduleWeeks = async () => {
    try {
        const mondays = findMondays(7);
        const arr = [];
        await asyncForEach(mondays, async (item) => {
            const a = await fetchScheduleData(item);
            if (Object.keys(a).length !== 0) {
                arr.push(item);
            }
        });
        return arr;
    } catch (e) {
        console.error(e);
    }
};

const scheduleWeeks = async () => {
    const resource = await findScheduleWeeks();
    const data = resource.map((e, i) => {
        return {week: e, url: `http://localhost:3000/schedules/${i}`};
    });
    return Object.assign({}, {count: data.length, results: data});
};

const findScheduleDocument = async () => {
    try {
        const mondays = findMondays(7);
        const arr = [];
        await asyncForEach(mondays, async (item) => {
            const a = await fetchScheduleData(item);
            arr.push(a);
        });
        return arr.filter((e) => Object.keys(e).length !== 0);
    } catch (e) {
        console.error(e);
    }
};

const scheduleDocument = async () => {
    const resource = await findScheduleDocument();
    return Object.assign({}, resource);
};

export {
    fetchScheduleData,
    findMondays,
    findScheduleWeeks,
    scheduleWeeks,
    scheduleDocument,
};
