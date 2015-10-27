/* global axe, axeXPath */

var axeRes, alaskaRes;

/**
 * Define the configuration object.
 * @type {Object}
 */

var axeConfig = axeConfig || {};

/**
 * Extend the configuration object
 * with default values.
 */

// axeConfig.reporter = 'v1';
axeConfig.runOnly = {
  type: 'tag',
  values: ['wcag2a', 'wcag2aa']
};

/**
 * Specify target css selector.
 * @type {String}
 */

var target = 'main';

/**
 * Execute axe-core#a11yCheck on the target node.
 */

axe.a11yCheck(target, axeConfig, function (res) {
  var el = document.querySelector('#axe-results');
  var str = JSON.stringify(res, null, 2);
  axeRes = str;
  el.innerHTML = safeTags(str);
});

/**
 * Execute alaska's axe version on the target node.
 */

axeXPath.a11yCheckAsString(target, axeConfig, function (res) {
  var el = document.querySelector('#alaska-results');
  var heading = document.querySelector('.alaska-heading');
  var violations = JSON.parse(res).violations;
  var str = JSON.stringify(violations, null, 2);
  alaskaRes = str;
  el.innerHTML = safeTags(str);

  if (isEqual(axeRes, alaskaRes)) {
    heading.innerHTML += ' (same as aXe)';
  }
});

/**
 * Converts HTML chars for printing in HTML.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function safeTags(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function isEqual(str1, str2) {
  return str1 == str2;
}
