'use strict';

const express = require('express');
const BodyParser = require('body-parser')
const AppConfig = require("./config/app-config");
const IntegrationRoutes = require("./integration/routes");
const app = express();

app.listen(AppConfig.Port);
app.use(BodyParser.json())

IntegrationRoutes(app);


app.use(function(req, res, next) {
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