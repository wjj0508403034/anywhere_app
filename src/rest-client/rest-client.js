'use strict';

const URL = require('url');
const Https = require("https");
const Http = require("http");
const Querystring = require('querystring');


function execute(url, options, payload) {
  let httpAgent = url.protocol === "https:" ? Https : Http;
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
        let result = resData.join('');
        try {
          result = JSON.parse(result);
        } catch (err) {
          console.warn("Parse Json failed", err);
        }
        reslove(result);
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

function buildReqOptions(url, method, headers) {
  return {
    hostname: url.hostname,
    port: url.port,
    path: url.path,
    method: method,
    rejectUnauthorized: false,
    headers: headers || {}
  };
}

module.exports = {

  get: function(urlString, headers) {
    let url = URL.parse(urlString);
    let reqOptions = buildReqOptions(url, "GET", headers);
    return execute(url, reqOptions);
  },

  post: function(urlString, payload, headers, options) {
    let url = URL.parse(urlString);
    let reqOptions = buildReqOptions(url, "POST", headers);

    let postData = null;
    if (payload) {
      postData = Querystring.stringify(payload);
      reqOptions.headers["Content-Length"] = Buffer.byteLength(postData);
    }

    return execute(url, reqOptions, postData);
  }
};