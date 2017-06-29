'use strict';

const Port = process.env.Port || 8047;
const Domain = process.env.Domain || `10.58.79.116:${Port}`;

module.exports = {
  Port: Port,
  Domain: Domain
};