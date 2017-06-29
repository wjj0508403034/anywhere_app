'use strict';

const Anywhere = require("./anywhere");


module.exports = {

  routes: function(app) {
    app.get(`${Anywhere.RoutePrefix}/app_link`, Anywhere.verify, function(req, res, next) {
      res.json({
        msg: "Open app link successfully.",
        params: {
          boNamespace: req.query.boNamespace,
          boName: req.query.boName,
          boId: req.query.boId
        }
      });
    });
  }


};