var eightTrack = require('eight-track');
var expect = require('chai').expect;
var express = require('express');

express().use(function beforeHandler (req, res, next) {
  // Record the request
  console.log(req.method, req.url);

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
