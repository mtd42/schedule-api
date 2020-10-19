var express = require('express');
const { default: Axios } = require('axios');
var router = express.Router();
const jsdom = require("jsdom");

router.get('/', async function(req, res, next) {
  const html = await Axios.get('https://edtmobiliteng.wigorservices.net//WebPsDyn.aspx?action=posEDTBEECOME&serverid=C&Tel=mathieu.dorville&date=11/01/2020');

  const dom = new jsdom.JSDOM(html.data);
  const profs = dom.window.document.getElementsByClassName('TCProf');
  const arr_profs = Object.values(profs)
  final_prof = []
  arr_profs.forEach((e) => {
     const tmp = e.textContent.split('I2 G2')[0]
     if (tmp !== '' && tmp !== 'I2 ALT 20/21 EPSI BDX') {
         final_prof.push(tmp.toUpperCase())
     } else {
         final_prof.push('Pas de prof'.toUpperCase())
     }
  })
  console.log(final_prof)

  const heures = dom.window.document.getElementsByClassName('TChdeb');
  const arr_heures = Object.values(heures)
  final_heure = arr_heures.map((e) => e.textContent)
  // console.log(final_heure)

  const salles = dom.window.document.getElementsByClassName('TCSalle');
  const arr_salles = Object.values(salles);
  const final_salle = arr_salles.map((e) => e.textContent.split('Salle:')[1])
  // console.log(final_salle)

 const cours = dom.window.document.getElementsByClassName('TCase');
 const arr_cours = Object.values(cours)
 const final_cours = [] 
 arr_cours.forEach((e) => {
     if (e.attributes.length === 3) {
         final_cours.push(e.textContent.toUpperCase())
     }
 })
 // console.log(final_cours)

 const emploi_du_temp = final_prof.map((e, i, a) => Object.assign(
        {}, 
        { nom_prof : final_prof[i] },
        { nom_cours : final_cours[i]},
        { heure: final_heure[i] }, 
        { salle : final_salle[i] }
    )
 )
 // console.log(emploi_du_temp)


 let previous_value = null;
 const pos = [0]
 for (let i = 0; i < emploi_du_temp.length; i++) {
 const current_value = parseInt(emploi_du_temp[i].heure.split(':')[0], 10);
     if (current_value < previous_value) {
     pos.push(i)
     }
 previous_value = current_value;
 }
 pos.push(emploi_du_temp.length)

 let days = pos.map((e, i, a) => {
     return emploi_du_temp.slice(pos[i], pos[i + 1])
 })

 days.pop()

 const test = {
     lundi: days[0],
     mardi: days[1],
     mercredi: days[2],
     jeudi: days[3],
     vendredi: days[4],
 }

  res.render('index', { lundi : test.lundi, mardi: test.mardi, mercredi: test.mercredi, jeudi: test.jeudi, vendredi: test.vendredi  } );
});

module.exports = router;
