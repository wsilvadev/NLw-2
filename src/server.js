const express = require("express");
const nunjucks = require("nunjucks");

const {
  pageGiveClasses,
  pageLanding,
  pageStudy,
  saveClasses,
} = require("./pages");

const server = express();

nunjucks.configure("src/views", {
  express: server,
  noCache: true,
});

server
  .use(express.urlencoded({ extended: true }))
  .use(express.static("public"))

  .get("/", pageLanding)
  .get("/study", pageStudy)
  .get("/give-classes", pageGiveClasses)
  .post("/save-classes", saveClasses)

  .listen(3000);
