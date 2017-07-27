'use strict';

const express = require('express');
const BodyParser = require('body-parser')
const AppConfig = require("./config/app-config");
const IntegrationRoutes = require("./integration/routes");
const Logger = require("./logger/logger").getLogger("index");
const app = express();
const path = require("path");

app.set("views", path.join(__dirname, "ui-web/views"));
app.set('view engine', 'html');

app.use('/static', express.static(path.join(__dirname, "ui-web/static")))

app.listen(AppConfig.Port);
Logger.info(null, `Port: ${AppConfig.Port}`);

app.use(BodyParser.json())

IntegrationRoutes(app);


app.use(function(req, res, next) {
  //res.render("index", { msg: "xxx" });
  res.json({
    msg: "Hello World!"
  });
});

app.use(function(err, req, res, next) {
  if (err instanceof Error) {
    res.write(`${err.message}\n${err.stack}`);
    res.end();
    return;
  }

  if (typeof err === "object") {
    res.json(err);
    return;
  }


  res.write(err);
  res.end();
});

Logger.info(null, `Anywhere app start up successfully.`);