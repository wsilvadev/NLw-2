const subjects = [
  "Artes",
  "Biologia",
  "Ciências",
  "Educação física",
  "Física",
  "Geografia",
  "História",
  "Matematica",
  "Português",
  "Quimica",
  "Inglês",
];
const weekdays = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];
function convertTimeToMinutes(time) {
  const [hour, minutes] = time.split(":");
  return Number(hour * 60 + minutes);
}

function getSubject(subjectNumber) {
  const position = +subjectNumber - 1;
  return subjects[position];
}
module.exports = {
  subjects,
  weekdays,
  getSubject,
  convertTimeToMinutes,
};
