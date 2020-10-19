const jsdom = require('jsdom');
const { default: Axios } = require('axios');
const beautify = require('js-beautify').js;

const scheduleComponent = async (date) => {
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
        { nom_prof: final_prof[i] },
        { nom_cours: final_cours[i]},
        { heure: heures[i] },
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
    const scheduleData = beautify(JSON.stringify(test), { indent_size: 2, space_in_empty_paren: true });
    return scheduleData;
};

module.exports = {
    scheduleComponent,
};
