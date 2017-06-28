'use strict';


const Default_Scope = "BusinessData_R,BusinessData_RW";

function Configuration(options) {
  this.clientId = options.clientId;
  this.clientSecret = options.clientSecret;
  this.scope = options.scope || Default_Scope;
  this.anywhereDomain = options["domain_anywhere"] || "go.sapanywhere.com";
  this.openApiDomain = options["domain_openapi"] || "api.sapanywhere.com";
  this.installUrl = options.installUrl;
  this.applicationUrl = options.applicationUrl;
}

Configuration.prototype.authorizeUrl = function(redirect_uri) {
  return `https://${this.anywhereDomain}/oauth2/authorize?client_id=${this.clientId}&scope=${this.scope}&redirect_uri=${redirect_uri}`;
};

Configuration.prototype.tokenUrl = function() {
  return `https://${this.anywhereDomain}/oauth2/token`;
};

Configuration.prototype.apiUrl = function(path) {
  return `https://${this.openApiDomain}/v1/${path}`;
};

Configuration.prototype.setToken = function(token) {
  this.token = token;
};

module.exports = Configuration;