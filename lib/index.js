
/**
 * Dependencies.
 */

var classes = require('component/classes');
var query = require('component/query');

/**
 * Constants.
 */

var RULES = 'examples/rules/';
var CHECKS = 'examples/checks/';
var HIDDEN_CLASS = 'hidden';

/**
 * Element references.
 */

var fixture = query('#fixture');
var typeRadios = query.all('input[name="type"]');
var ruleTypeRadio = query('#rule-type');
var checkTypeRadio = query('#check-type');
var presetAreas = query.all('.presets');
var ruleSelect = query('#rule-presets');
var checkSelect = query('#check-presets');
var applyPresetBtn = query('#apply-preset');
var markupArea = query('#markup');
var renderBtn = query('#render');
var configArea = query('#config-textarea');
var analyzeBtn = query('#analyze');
var fixture = query('#fixture');
var resultsTextbox = query('#axe-results');

/**
 * Initialize state variables.
 */

var selectedType = 'rule';

/**
 * Map example snippets to fixture presets.
 */

var examples = {
  rule: {
    'accesskeys': require('../examples/rules/accesskeys.html'),
    'area-alt': require('../examples/rules/area-alt.html'),
    'aria-allowed-attr': require('../examples/rules/aria-allowed-attr.html'),
    'aria-required-attr': require('../examples/rules/aria-required-attr.html'),
    'aria-required-children': require('../examples/rules/aria-required-children.html'),
    'aria-required-parent': require('../examples/rules/aria-required-parent.html'),
    'aria-roles': require('../examples/rules/aria-roles.html'),
    'aria-valid-attr-value': require('../examples/rules/aria-valid-attr-value.html'),
    'aria-valid-attr': require('../examples/rules/aria-valid-attr.html'),
    // 'audio-caption': require('../examples/rules/audio-caption.html'),
    'blink': require('../examples/rules/blink.html'),
    'button-name': require('../examples/rules/button-name.html'),
    'video-caption': require('../examples/rules/video-caption.html'),
    'video-description': require('../examples/rules/video-description.html')
  },
  check: {
    'cell-no-header': require('../examples/checks/cell-no-header.html'),
    'headers-visible-text': require('../examples/checks/headers-visible-text.html'),
    'th-single-row-column': require('../examples/checks/th-single-row-column.html')
  }
};

/**
 * Removes preset options that don't have snippets.
 */

var ruleOptions = query.all('option', ruleSelect);
var checkOptions = query.all('option', checkSelect);

[].slice.call(ruleOptions).forEach(function (optionEl) {
  if (!examples.rule[optionEl.value]) {
    ruleSelect.removeChild(optionEl);
  }
});

[].slice.call(checkOptions).forEach(function (optionEl) {
  if (!examples.check[optionEl.value]) {
    checkSelect.removeChild(optionEl);
  }
});

/**
 * 'change' events on the 'Type' radios toggle
 * the corresponding 'Name' select lists.
 */

[].slice.call(typeRadios).forEach(function (radio) {
  radio.addEventListener('change', function (e) {
    [].slice.call(presetAreas).forEach(function (area) {
      classes(area).add(HIDDEN_CLASS);
    });
    var val;
    if (ruleTypeRadio.checked) {
      selectedType = 'rule';
    } else if (checkTypeRadio.checked) {
      selectedType = 'check';
    }
    var area = query('.presets.' + selectedType);
    classes(area).remove(HIDDEN_CLASS);
  });
});

/**
 * Clicks on the 'Apply Preset' button re-render the fixture
 * and update the HTML view.
 */

applyPresetBtn.addEventListener('click', function () {
  var selectEl = selectedType == 'check' ? checkSelect : ruleSelect;
  var val = selectEl.value;
  fixture.innerHTML = examples[selectedType][val];
  markupArea.value = fixture.innerHTML;
  // markupArea.innerHTML = safeTags(fixture.innerHTML);
});

/**
 * Clicks on the 'Render' button render the fixture
 * using the current value of the 'Edit HTML' field.
 */

renderBtn.addEventListener('click', function () {
  var html = markupArea.value;
  fixture.innerHTML = html;
});

/**
 * Clicks on the 'Analyze' button run aXe on the existing fixture.
 */

analyzeBtn.addEventListener('click', function () {
  analyze();
});

/**
 * Set and apply default aXe options.
 */

var defaultOpts = {
  type: 'tag',
  values: ['wcag2a', 'wcag2aa']
};

configArea.value = JSON.stringify(defaultOpts, null, 2);

/**
 * Apply default values to HTML and Render Fixture areas.
 */

fixture.innerHTML = examples.rule.accesskeys;
markupArea.innerHTML = safeTags(fixture.innerHTML);

/**
 * Run `#a11yCheck` on the text fixture.
 */

window.analyze = function (target, opts) {
  var optsVal = configArea.value;
  opts = opts || JSON.parse(optsVal);

  axe.a11yCheck('#fixture', opts, function (res) {
    var str = JSON.stringify(res.violations, null, 2);
    resultsTextbox.innerHTML = safeTags(str);
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
