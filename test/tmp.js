var eightTrack = require('eight-track');
var expect = require('chai').expect;
var express = require('express');

express().use(function beforeHandler (req, res, next) {
  // Record the request
  console.log('[icomoon.io]', req.method, req.url);

  // Add a randomizer to guarantee cache miss
  // DEV: This makes sure it isn't eight-track getting in the way
  req.headers.hai = Math.random();

  // Continue
  next();
}).use(eightTrack({
  url: 'https://icomoon.io',
  fixtureDir: __dirname + '/test_files/icomoon-http',
  // normalizeFn: function (req) {
  //   // Normalize the headers
  //   // delete req.headers;
  //   return req;
  // }
})).listen(1337);

express().use(function beforeHandler (req, res, next) {
  // Record the request
  console.log('[i.icomoon.io]', req.method, req.url);

  // Add a randomizer to guarantee cache miss
  // DEV: This makes sure it isn't eight-track getting in the way
  req.headers.hai = Math.random();

  // Continue
  next();
}).use(eightTrack({
  url: 'https://i.icomoon.io',
  fixtureDir: __dirname + '/test_files/i-icomoon-http',
  // normalizeFn: function (req) {
  //   // Normalize the headers
  //   // delete req.headers;
  //   return req;
  // }
})).listen(1338);

express().use(function beforeHandler (req, res, next) {
  // Record the request
  console.log('[perxis.com]', req.method, req.url);

  // Add a randomizer to guarantee cache miss
  // DEV: This makes sure it isn't eight-track getting in the way
  req.headers.hai = Math.random();

  // Continue
  next();
}).use(eightTrack({
  url: 'http://perxis.com',
  fixtureDir: __dirname + '/test_files/perxis-http',
  // normalizeFn: function (req) {
  //   // Normalize the headers
  //   // delete req.headers;
  //   return req;
  // }
})).listen(1339);
