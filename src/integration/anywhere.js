'use strict';


const Crypto = require('crypto');
const AppConfig = require("./../config/app-config");
const Token = require("./token");
const RestClient = require("./../rest-client/rest-client");

const AuthorizeEndpoint = AppConfig.Anywhere.getEndPoint(AppConfig.Anywhere.EndPointNames.Authorize);
const ClientId = AppConfig.Anywhere.ClientId;
const ClientSecret = AppConfig.Anywhere.ClientSecret;
const Scope = "BusinessData_R,BusinessData_RW";

const InstallUrl =
  `${AuthorizeEndpoint}authorize?client_id=${ClientId}&scope=${Scope}&redirect_uri=${AppConfig.Anywhere.InstallUrl}`;

const ExchangeTokenByCodeURL = `${AuthorizeEndpoint}token`;


module.exports = {
  InstallUrl: InstallUrl,
  OAuth2Token: null,
  verifySignature: function(hmac, timestamp) {
    let content = `apiKey=${ClientId}&timestamp=${timestamp}`;
    var newHmac = Crypto.createHmac('sha256', ClientSecret)
      .update(content)
      .digest('hex');

    return hmac === newHmac;
  },

  getTokenByCode: function(code) {
    let payload = {
      client_id: ClientId,
      client_secret: ClientSecret,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: AppConfig.Anywhere.InstallUrl
    };

    return RestClient.post("https://go-mv.bb.smec.sap.corp/oauth2/token", payload, {
      'Content-Type': 'application/x-www-form-urlencoded'
    }).then(function(data) {
      if (data["error"]) {
        return Promise.reject(data);
      }
      return Promise.resolve(new Token(data));
    }).catch(function(err) {
      return Promise.reject(err);
    });
  }
};