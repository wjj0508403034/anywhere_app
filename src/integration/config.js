'use strict';


const Default_Scope = "BusinessData_R,BusinessData_RW";
const Default_Anywhere_Domain = "go.sapanywhere.com";
const Default_Api_Domain = "api.sapanywhere.com";

function Configuration(options) {
  this.clientId = options.clientId;
  this.clientSecret = options.clientSecret;
  this.scope = options.scope || Default_Scope;
  this.anywhereDomain = options["domain_anywhere"] || Default_Anywhere_Domain;
  this.openApiDomain = options["domain_openapi"] || Default_Api_Domain;
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