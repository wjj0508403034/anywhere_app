'use strict';

const Anywhere = require("./anywhere");
const RestClient = require("./../rest-client/rest-client");

function headers() {
  return {
    "Accept": "application/json",
    "Access-Token": Anywhere.Config.token.accessToken
  };
}

module.exports = {

  query: function(boName) {
    return RestClient.get(Anywhere.Config.apiUrl(boName), headers())
      .then(function(data) {
        return Promise.resolve(data);
      }).catch(function(err) {
        return Promise.reject(err);
      });
  }
};