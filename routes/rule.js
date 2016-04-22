
/**
 * Module dependencies.
 */

var rules = require('../lib/rules');
var express = require('express');

var app = module.exports = express();

/**
 * Home page.
 */

app.get('/rule/:rule', function (req, res) {
  var name = req.params.rule;
  if (name && ~rules.indexOf(name)) {
    res.render('axe/index', {
      rules: require('../lib/rules'),
      checks: require('../lib/checks'),
      defaultRule: name
    });
  }
  else {
    res.redirect('/');
  }
});
