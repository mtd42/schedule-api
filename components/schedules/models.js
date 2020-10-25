import jsdom from 'jsdom';
import Axios from 'axios';
import moment from 'moment';

const fetchScheduleData = async (date) => {
    return new Promise(async (resolve) => {
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

        const emploi_du_temps = final_prof.map((_e, i, _a) => Object.assign(
            {},
            { heure: heures[i] },
            { nom_prof: final_prof[i] },
            { nom_cours: final_cours[i]},
            { salle: salles[i] },
        ),
        );

        let previous_value = null;
        const pos = [0];
        emploi_du_temps.forEach((e, i, a) => {
            const current_value = parseInt(emploi_du_temps[i].heure.split(':')[0], 10);
            if (current_value < previous_value) pos.push(i);
            previous_value = current_value;
        });

        pos.push(emploi_du_temps.length);
        const days = pos.map((_e, i, _a) => emploi_du_temps.slice(pos[i], pos[i + 1]));
        days.pop();

        const week = {
            lundi: days[0],
            mardi: days[1],
            mercredi: days[2],
            jeudi: days[3],
            vendredi: days[4],
        };
        resolve(emploi_du_temps.length ? week : null);
    });
};

const findMondays = async (nbOfMondays) => {
    return new Promise((resolve) => {
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
        resolve(arr);
    });
};

const scheduleWeeks = async (filter) => {
    const mondays = await findMondays(7);
    const resource = await Promise.all(mondays.map((monday) => fetchScheduleData(monday)));
    if (filter) {
        const data = resource.map((e, i) => {
            return {
                month: moment.months((moment(mondays[i], 'MM/DD/YYYY').month())),
                week_start: mondays[i],
                week_end: moment(mondays[i], 'MM/DD/YYYY').add(4, 'days').format('L'),
                schedule_for_this_week: e ? `${process.env.API_URL}/schedules/${i + 1}` : 'Semaine en entreprise',
            };
        });
        return Object.assign({}, {count: data.length, schedules: data});
    }
    return Object.assign({}, resource);
};

export {
    scheduleWeeks,
};
