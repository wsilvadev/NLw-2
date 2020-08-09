const Database = require("./database/db");
const createProffy = require("./database/createProffy");

const {
  getSubject,
  subjects,
  weekdays,
  convertTimeToMinutes,
} = require("./utils/format");

function pageLanding(req, res) {
  return res.render("index.html");
}

async function pageStudy(req, res) {
  const filters = req.query;

  if (!filters.subject || !filters.weekday || !filters.time) {
    return res.render("study.html", { filters, subjects, weekdays });
  }
  const timeToMinutes = convertTimeToMinutes(filters.time);

  const query = `
  SELECT classes.*, proffys.*
  FROM proffys
  JOIN classes ON (classes.proffy_id = proffys.id)
  WHERE EXISTS (
        SELECT class_schedule.*
  FROM class_schedule
  WHERE class_schedule.class_id = classes.id
  AND class_schedule.weekday = ${filters.weekday}
  AND class_schedule.time_from <= ${timeToMinutes}
  AND class_schedule.time_to > ${timeToMinutes}
  )
  AND classes.subject = "${filters.subject}"
`;

  try {
    const db = await Database;
    const proffys = await db.all(query);
    proffys.map((proffy) => {
      proffy.subject = getSubject(proffy.subject);
    });

    return res.render("study.html", { proffys, subjects, filters, weekdays });
  } catch (err) {
    console.log(err);
  }
}

function pageGiveClasses(req, res) {
  return res.render("give-classes.html", { subjects, weekdays });
}

async function saveClasses(req, res) {
  const proffyValue = {
    name: req.body.name,
    avatar: req.body.avatar,
    whatsapp: req.body.whatsapp,
    bio: req.body.bio,
  };
  const classValue = {
    subject: req.body.subject,
    cost: req.body.cost,
  };
  const classScheduleValues = req.body.weekday.map((weekday, position) => {
    return {
      weekday,
      time_from: convertTimeToMinutes(req.body.time_from[position]),
      time_to: convertTimeToMinutes(req.body.time_to[position]),
    };
  });
  try {
    const db = await Database;
    await createProffy(db, { proffyValue, classValue, classScheduleValues });
    let queryString = "?subject=" + req.body.subject;
    queryString += "&weekday=" + req.body.weekday[0];
    queryString += "&time=" + req.body.time_from[0];

    return res.redirect("/study" + queryString);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  pageLanding,
  pageStudy,
  pageGiveClasses,
  saveClasses,
};