'use strict';

const express = require('express');
const AppConfig = require("./config/app-config");
const IntegrationRoutes = require("./integration/routes");
const app = express();

app.listen(AppConfig.Port);


IntegrationRoutes(app);


app.use(function(req, res, next) {
  res.json({
    msg: "Hello World!"
  });
});

app.use(function(err, req, res, next) {
  if (typeof err === "object") {
    res.json(err);
    return;
  }


  res.write(err);
  res.end();
});