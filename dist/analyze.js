/* global axe */

var axeRes;

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
 * Execute `#a11yCheck` on the target node.
 */

axe.a11yCheck(target, axeConfig, function (res) {
  var el = document.querySelector('#axe-results');
  var str = JSON.stringify(res.violations, null, 2);
  axeRes = str;
  el.innerHTML = safeTags(str);
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
