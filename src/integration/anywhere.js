'use strict';

const AppConfig = require("./../config/app-config");
const Signature = require("./signature");
const ErrorCodes = require("./../errors/error-codes");
const Token = require("./token");
const RestClient = require("./../rest-client/rest-client");
const AnywhereConfig = require("./config");

const Default_Headers = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

const anywhereConfig = new AnywhereConfig({
  clientId: "ndRF0KqdCNm9KWmoEyDCSg1oLsXIoGE4",
  clientSecret: "t8XtTeMIkWmxTt_Ha1EFF64vkUfwBH3S",
  installUrl: `http://localhost:${AppConfig.Port}/anywhere/install`,
  applicationUrl: `http://localhost:${AppConfig.Port}/anywhere`
});


function verifyAnywhereSignature(hmac, timestamp) {
  return new Signature(anywhereConfig.clientId, anywhereConfig.clientSecret, timestamp).equals(hmac);
}

function getToken(payload) {
  return RestClient.post(anywhereConfig.tokenUrl(), payload, Default_Headers).then(function(data) {
    if (data["error"]) {
      return Promise.reject(data);
    }
    return Promise.resolve(new Token(data));
  }).catch(function(err) {
    return Promise.reject(err);
  });
}

module.exports = {
  Config: anywhereConfig,
  OAuth2Token: null,
  verify: function(req, res, next) {
    if (req.query && req.query.hmac && req.query.timestamp) {
      if (!verifyAnywhereSignature(req.query.hmac, req.query.timestamp)) {
        next(ErrorCodes.SAP_Verify_Signature_Failed);
        return;
      }

      req.verify_signature = true;
    }
    next();
  },
  verifySignature: verifyAnywhereSignature,
  getTokenByCode: function(code, redirect_uri) {
    return getToken({
      client_id: anywhereConfig.clientId,
      client_secret: anywhereConfig.clientSecret,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirect_uri
    });
  },

  getTokenByRefreshToken: function(refreshToken, redirect_uri) {
    return getToken({
      client_id: anywhereConfig.clientId,
      client_secret: anywhereConfig.clientSecret,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      redirect_uri: redirect_uri
    });
  },

  api: function(path) {
    return RestClient.get(anywhereConfig.apiUrl(path), {
      "Accept": "application/json",
      "Access-Token": anywhereConfig.token.accessToken
    }).then(function(data) {
      return Promise.resolve(data);
    }).catch(function(err) {
      return Promise.reject(err);
    });
  }
};