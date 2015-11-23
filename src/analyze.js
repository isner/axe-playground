/* global axe */

/**
 * Get configuration textarea.
 */

var configArea = document.querySelector('#config-textarea');
var analyzeBtn = document.querySelector('#analyze');
var fixture = document.querySelector('#fixture');
var markupArea = document.querySelector('#markup');

analyzeBtn.addEventListener('click', function () {
  analyze();
});

/**
 * Define default configuration object for aXe.
 */

var axeConfig = {
  type: 'tag',
  values: ['wcag2a', 'wcag2aa']
};

/**
 * Use default configuration object to populate the configuration textarea.
 */

configArea.value = JSON.stringify(axeConfig, null, 2);

markupArea.value = fixture.innerHTML;

/**
 * Run `#a11yCheck` on the text fixture.
 */

window.analyze = function (target, opts) {
  var optsVal = configArea.value;
  opts = opts || JSON.parse(optsVal);

  axe.a11yCheck('#fixture', opts, function (res) {
    var el = document.querySelector('#axe-results');
    var str = JSON.stringify(res.violations, null, 2);
    el.innerHTML = safeTags(str);
    window.scrollTo(0, 0);
  });
};

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
