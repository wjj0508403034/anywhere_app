'use strict';

const Anywhere = require("./anywhere");
const RestClient = require("./../rest-client/rest-client");

function headers() {
  return {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Access-Token": Anywhere.Config.token.accessToken
  };
}

module.exports = {

  query: function(boName) {
    return RestClient.get(Anywhere.Config.apiUrl(boName), headers());
  },

  get: function(boName, boId) {
    return RestClient.get(Anywhere.Config.apiUrl(`${boName}/${boId}`), headers());
  },

  delete: function(boName, boId) {
    return RestClient.delete(Anywhere.Config.apiUrl(`${boName}/${boId}`), headers());
  },

  post: function(boName, data) {
    return RestClient.post(Anywhere.Config.apiUrl(boName), data, headers());
  }
};