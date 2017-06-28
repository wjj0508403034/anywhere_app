'use strict';

const Port = process.env.Port || 8047;
const EndPointNames = {
  Authorize: Symbol(),
  Api: Symbol()
};

const EndPoints = {};
EndPoints[EndPointNames.Authorize] = "https://go-mv.bb.smec.sap.corp/oauth2/";
EndPoints[EndPointNames.Api] = "https://api-mv.bb.smec.sap.corp/v1/";

module.exports = {
  Port: Port,
  Anywhere: {
    ClientId: "aBnF3hX3JhDEy2pBA0nW0FTqp5UELeRG",
    ClientSecret: "oQopLEFW5_5znHEJQETCyEVBsU7aRA1q",
    EndPointNames: EndPointNames,
    getEndPoint: function(name) {
      return EndPoints[name];
    },
    InstallUrl: `http://localhost:${Port}/anywhere/install`,
    ApplicationUrl: `http://localhost:${Port}/anywhere`
  }
};