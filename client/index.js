
var classes = require('component-classes');
var query = require('component-query');

var HIDDEN_CLASS = 'hidden';
var RULE = 'rule';
var CHECK = 'check';

var fixture         = query('#fixture');
var typeRadios      = query.all('input[name="type"]');
var ruleTypeRadio   = query('#rule-type');
var checkTypeRadio  = query('#check-type');
var presetAreas     = query.all('.presets');
var ruleSelect      = query('#rule-presets');
var checkSelect     = query('#check-presets');
var applyPresetBtn  = query('#apply-preset');
var markupArea      = query('#markup');
var renderBtn       = query('#render');
var configArea      = query('#config-textarea');
var analyzeBtn      = query('#analyze');
var resultsTextbox  = query('#axe-results');

var selectedType = RULE;

/**
 * Initialize expandable areas.
 */

require('./areas')();

/**
 * Map example snippets to fixture presets.
 */

var examples = {
  rule: {
    'accesskeys': require('../examples/rules/accesskeys.js'),
    'area-alt': require('../examples/rules/area-alt.js'),
    'aria-allowed-attr': require('../examples/rules/aria-allowed-attr.js'),
    'aria-required-attr': require('../examples/rules/aria-required-attr.js'),
    'aria-required-children': require('../examples/rules/aria-required-children.js'),
    'aria-required-parent': require('../examples/rules/aria-required-parent.js'),
    'aria-roles': require('../examples/rules/aria-roles.js'),
    'aria-valid-attr-value': require('../examples/rules/aria-valid-attr-value.js'),
    'aria-valid-attr': require('../examples/rules/aria-valid-attr.js'),
    'audio-caption': require('../examples/rules/audio-caption.js'),
    'blink': require('../examples/rules/blink.js'),
    'button-name': require('../examples/rules/button-name.js'),
    'bypass': require('../examples/rules/bypass.js'),
    'checkboxgroup': require('../examples/rules/checkboxgroup.js'),
    'color-contrast': require('../examples/rules/color-contrast.js'),
    'data-table': require('../examples/rules/data-table.js'),
    'definition-list': require('../examples/rules/definition-list.js'),
    'dlitem': require('../examples/rules/dlitem.js'),
    'document-title': require('../examples/rules/document-title.js'),
    'duplicate-id': require('../examples/rules/duplicate-id.js'),
    'empty-heading': require('../examples/rules/empty-heading.js'),
    'frame-title': require('../examples/rules/frame-title.js'),
    'heading-order': require('../examples/rules/heading-order.js'),
    'html-lang': require('../examples/rules/html-lang.js'),
    'image-alt': require('../examples/rules/image-alt.js'),
    'input-image-alt': require('../examples/rules/input-image-alt.js'),
    'label-title-only': require('../examples/rules/label-title-only.js'),
    'label': require('../examples/rules/label.js'),
    'layout-table': require('../examples/rules/layout-table.js'),
    'link-name': require('../examples/rules/link-name.js'),
    'list': require('../examples/rules/list.js'),
    'listitem': require('../examples/rules/listitem.js'),
    'marquee': require('../examples/rules/marquee.js'),
    'meta-refresh': require('../examples/rules/meta-refresh.js'),
    'meta-viewport': require('../examples/rules/meta-viewport.js'),
    'object-alt': require('../examples/rules/object-alt.js'),
    'radiogroup': require('../examples/rules/radiogroup.js'),
    'region': require('../examples/rules/region.js'),
    'scope': require('../examples/rules/scope.js'),
    'server-side-image-map': require('../examples/rules/server-side-image-map.js'),
    'skip-link': require('../examples/rules/skip-link.js'),
    'tabindex': require('../examples/rules/tabindex.js'),
    'valid-lang': require('../examples/rules/valid-lang.js'),
    'video-caption': require('../examples/rules/video-caption.js'),
    'video-description': require('../examples/rules/video-description.js')
  },
  check: {
    'cell-no-header': require('../examples/checks/cell-no-header.js'),
    'headers-visible-text': require('../examples/checks/headers-visible-text.js'),
    'th-single-row-column': require('../examples/checks/th-single-row-column.js')
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
      selectedType = RULE;
    } else if (checkTypeRadio.checked) {
      selectedType = CHECK;
    }
    var area = query('.presets.' + selectedType);
    classes(area).remove(HIDDEN_CLASS);
  });
});

/**
 * Clicks on the 'Apply Selected Preset' button:
 *  - Update the Edit HTML textarea
 * 	- Re-render the fixture
 *  - Analyze the fixture and update the results
 */

applyPresetBtn.addEventListener('click', function () {
  var selectEl = selectedType == CHECK ? checkSelect : ruleSelect;
  var val = selectEl.value;
  fixture.innerHTML = examples[selectedType][val];
  markupArea.value = fixture.innerHTML;
  analyze();
});

/**
 * Clicks on the 'Render Markup' button:
 *  - Re-render the fixture using the current markup
 *  - Analyze the fixture and update the results
 */

renderBtn.addEventListener('click', function () {
  var html = markupArea.value;
  fixture.innerHTML = html;
  analyze();
});

/**
 * Clicks on the 'Analyze' button run axe on the existing fixture.
 */

analyzeBtn.addEventListener('click', function () {
  analyze();
});

/**
 * Set and apply default axe options.
 */

var defaultOpts = {
  runOnly: {
    type: 'tag',
    values: ['wcag2a', 'wcag2aa', 'best-practice']
  },
  checks: {
    'duplicate-img-label': { enabled: true },
    'skip-link': { enabled: true }
  }
};

configArea.value = JSON.stringify(defaultOpts, null, 2);

/**
 * Apply default values to HTML and Render Fixture areas.
 */

var selectedRuleEl = document.querySelector('#rule-presets option[default-selected]');
if (selectedRuleEl) {
  fixture.innerHTML = examples.rule[selectedRuleEl.value];
}
else {
  fixture.innerHTML = examples.rule.accesskeys;
}
markupArea.innerHTML = safeTags(fixture.innerHTML);

/**
 * Run axe on the text fixture.
 */

window.analyze = function () {
  var optsVal = configArea.value;
  var opts = (optsVal.length && JSON.parse(optsVal)) || {};

  axe.run('#fixture', opts, (err, res) => {
    if (err) {
      throw err;
    }
    var str = JSON.stringify(res.violations, null, 2);
    resultsTextbox.innerHTML = safeTags(str);
    window.scrollTo(0, 0);
  })
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
