'use strict';

function Token(options) {
  this.accessToken = options["access_token"];
  this.tokenType = options["token_type"];
  this.refreshToken = options["refresh_token"];
  this.expires = options["expires_in"];
  this.scope = options["scope"];
}

module.exports = Token;