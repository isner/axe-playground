
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express();

/**
 * Home page.
 */

app.get('/', function (req, res) {
  res.render('axe/index', {
    rules: require('../lib/rules'),
    checks: require('../lib/checks'),
  });
});
