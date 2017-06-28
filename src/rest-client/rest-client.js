'use strict';

const URL = require('url');
const Https = require("https");
const Http = require("http");
const Querystring = require('querystring');


function execute(httpAgent, options, payload) {
  return new Promise(function(reslove, reject) {
    const req = httpAgent.request(options, (res) => {
      let resData = [];
      console.log(`STATUS: ${res.statusCode}`);
      console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        resData.push(chunk);
        console.log(`BODY: ${chunk}`);
      });
      res.on('end', () => {
        console.log('No more data in response.');
        reslove(JSON.parse(resData.join('')));
      });
    });

    req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
      reject(e);
    });

    if (payload) {
      req.write(payload);
    }

    req.end();
  });
}

module.exports = {

  post: function(urlString, payload, headers, options) {
    let url = URL.parse(urlString);
    let reqOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.path,
      method: "POST",
      rejectUnauthorized: false,
      headers: headers
    };


    let postData = null;
    if (payload) {
      postData = Querystring.stringify(payload);
      reqOptions.headers["Content-Length"] = Buffer.byteLength(postData);
    }

    let httpAgent = url.protocol === "https:" ? Https : Http;

    return execute(httpAgent, reqOptions, postData);
  }
};