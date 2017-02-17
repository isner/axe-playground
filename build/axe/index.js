(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var classes = require('component-classes');
var query = require('component-query');
var data = require('dataset');

var HIDDEN_CLASS = 'hidden';
var SHOW = 'Show ';
var HIDE = 'Hide ';

module.exports = initAreas;

/**
 * Finds all area-trigger anchors and their corresponding areas.
 * Then binds events handlers to toggle area visibility and
 * insert text content into the trigger.
 *
 * Requires that anchors have the following 3 attributes:
 * 	 1. class="area-trigger"
 * 	 2. data-area="[id_of_expandable_area]"
 * 	 3. data-text="[trigger's_visible_text]"
 * 	    (ex: a value of "Names" will toggle "Show Names" and "Hide Names")
 */

function initAreas() {
  var triggers = query.all('.area-trigger');

  [].slice.call(triggers).forEach(function (trigger) {
    var text = data(trigger, 'text');
    var textSpan = document.createElement('span');
    textSpan.innerHTML = text;

    var stateSpan = document.createElement('span');
    classes(stateSpan).add('state');
    stateSpan.innerHTML = SHOW;

    trigger.appendChild(stateSpan);
    trigger.appendChild(textSpan);

    var areaId = data(trigger, 'area');
    var area = document.getElementById(areaId);
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', areaId);
    bindEvents(trigger, area);
  });
}

function bindEvents(trigger, area) {
  trigger.addEventListener('click', function () {
    var state = classes(area).toggle(HIDDEN_CLASS).has(HIDDEN_CLASS);
    var stateEl = query('span.state', trigger);
    stateEl.innerHTML = state ? SHOW : HIDE;
    trigger.setAttribute('aria-expanded', !state);
  });
}

},{"component-classes":51,"component-query":53,"dataset":54}],2:[function(require,module,exports){
'use strict';

var classes = require('component-classes');
var query = require('component-query');

var HIDDEN_CLASS = 'hidden';
var RULE = 'rule';
var CHECK = 'check';

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
var resultsTextbox = query('#axe-results');

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
    'accesskeys': require('../examples/rules/accesskeys.html'),
    'area-alt': require('../examples/rules/area-alt.html'),
    'aria-allowed-attr': require('../examples/rules/aria-allowed-attr.html'),
    'aria-required-attr': require('../examples/rules/aria-required-attr.html'),
    'aria-required-children': require('../examples/rules/aria-required-children.html'),
    'aria-required-parent': require('../examples/rules/aria-required-parent.html'),
    'aria-roles': require('../examples/rules/aria-roles.html'),
    'aria-valid-attr-value': require('../examples/rules/aria-valid-attr-value.html'),
    'aria-valid-attr': require('../examples/rules/aria-valid-attr.html'),
    'audio-caption': require('../examples/rules/audio-caption.html'),
    'blink': require('../examples/rules/blink.html'),
    'button-name': require('../examples/rules/button-name.html'),
    'bypass': require('../examples/rules/bypass.html'),
    'checkboxgroup': require('../examples/rules/checkboxgroup.html'),
    'color-contrast': require('../examples/rules/color-contrast.html'),
    'data-table': require('../examples/rules/data-table.html'),
    'definition-list': require('../examples/rules/definition-list.html'),
    'dlitem': require('../examples/rules/dlitem.html'),
    'document-title': require('../examples/rules/document-title.html'),
    'duplicate-id': require('../examples/rules/duplicate-id.html'),
    'empty-heading': require('../examples/rules/empty-heading.html'),
    'frame-title': require('../examples/rules/frame-title.html'),
    'heading-order': require('../examples/rules/heading-order.html'),
    'html-lang': require('../examples/rules/html-lang.html'),
    'image-alt': require('../examples/rules/image-alt.html'),
    'input-image-alt': require('../examples/rules/input-image-alt.html'),
    'label-title-only': require('../examples/rules/label-title-only.html'),
    'label': require('../examples/rules/label.html'),
    'layout-table': require('../examples/rules/layout-table.html'),
    'link-name': require('../examples/rules/link-name.html'),
    'list': require('../examples/rules/list.html'),
    'listitem': require('../examples/rules/listitem.html'),
    'marquee': require('../examples/rules/marquee.html'),
    'meta-refresh': require('../examples/rules/meta-refresh.html'),
    'meta-viewport': require('../examples/rules/meta-viewport.html'),
    'object-alt': require('../examples/rules/object-alt.html'),
    'radiogroup': require('../examples/rules/radiogroup.html'),
    'region': require('../examples/rules/region.html'),
    'scope': require('../examples/rules/scope.html'),
    'server-side-image-map': require('../examples/rules/server-side-image-map.html'),
    'skip-link': require('../examples/rules/skip-link.html'),
    'tabindex': require('../examples/rules/tabindex.html'),
    'valid-lang': require('../examples/rules/valid-lang.html'),
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
 * Clicks on the 'Analyze' button run aXe on the existing fixture.
 */

analyzeBtn.addEventListener('click', function () {
  analyze();
});

/**
 * Set and apply default aXe options.
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
} else {
  fixture.innerHTML = examples.rule.accesskeys;
}
markupArea.innerHTML = safeTags(fixture.innerHTML);

/**
 * Run aXe on the text fixture.
 */

window.analyze = function () {
  var optsVal = configArea.value;
  var opts = optsVal.length && JSON.parse(optsVal) || {};

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
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

},{"../examples/checks/cell-no-header.html":3,"../examples/checks/headers-visible-text.html":4,"../examples/checks/th-single-row-column.html":5,"../examples/rules/accesskeys.html":6,"../examples/rules/area-alt.html":7,"../examples/rules/aria-allowed-attr.html":8,"../examples/rules/aria-required-attr.html":9,"../examples/rules/aria-required-children.html":10,"../examples/rules/aria-required-parent.html":11,"../examples/rules/aria-roles.html":12,"../examples/rules/aria-valid-attr-value.html":13,"../examples/rules/aria-valid-attr.html":14,"../examples/rules/audio-caption.html":15,"../examples/rules/blink.html":16,"../examples/rules/button-name.html":17,"../examples/rules/bypass.html":18,"../examples/rules/checkboxgroup.html":19,"../examples/rules/color-contrast.html":20,"../examples/rules/data-table.html":21,"../examples/rules/definition-list.html":22,"../examples/rules/dlitem.html":23,"../examples/rules/document-title.html":24,"../examples/rules/duplicate-id.html":25,"../examples/rules/empty-heading.html":26,"../examples/rules/frame-title.html":27,"../examples/rules/heading-order.html":28,"../examples/rules/html-lang.html":29,"../examples/rules/image-alt.html":30,"../examples/rules/input-image-alt.html":31,"../examples/rules/label-title-only.html":32,"../examples/rules/label.html":33,"../examples/rules/layout-table.html":34,"../examples/rules/link-name.html":35,"../examples/rules/list.html":36,"../examples/rules/listitem.html":37,"../examples/rules/marquee.html":38,"../examples/rules/meta-refresh.html":39,"../examples/rules/meta-viewport.html":40,"../examples/rules/object-alt.html":41,"../examples/rules/radiogroup.html":42,"../examples/rules/region.html":43,"../examples/rules/scope.html":44,"../examples/rules/server-side-image-map.html":45,"../examples/rules/skip-link.html":46,"../examples/rules/tabindex.html":47,"../examples/rules/valid-lang.html":48,"../examples/rules/video-caption.html":49,"../examples/rules/video-description.html":50,"./areas":1,"component-classes":51,"component-query":53}],3:[function(require,module,exports){
module.exports = "<table><thead><tr><td>First</td><td>Last</td></tr></thead><tbody><tr><td>Jerry</td><td>Seinfeld</td></tr></tbody></table>";

},{}],4:[function(require,module,exports){
module.exports = "<table><thead><tr><th scope=\"col\">First</th><th scope=\"col\" style=\"display: none;\">Last</th></tr></thead><tbody><tr><td>Jerry</td><td>Seinfeld</td></tr></tbody></table>";

},{}],5:[function(require,module,exports){
module.exports = "<table><thead><tr><th scope=\"col\" rowspan=\"2\">ID</th><th scope=\"col\" rowspan=\"2\">DOB</th><th scope=\"col\">First</th><th scope=\"col\">Last</th></tr><tr><th scope=\"col\" colspan=\"2\">Name</th></tr></thead><tbody><tr><td>1</th><td>04/13/1949</th><td>Christopher</th><td>Hitchens</th></tr><tr><td>2</th><td>04/09/1967</th><td>Sam</th><td>Harris</th></tr></tbody></table>";

},{}],6:[function(require,module,exports){
module.exports = "<div> <label><span>N<u>a</u>me</span> <input type=\"text\" name=\"name\" accesskey=\"a\"/></label></div><div> <label><span><u>E</u>mail</span> <input type=\"email\" name=\"email\" accesskey=\"e\"/></label></div><div> <button accesskey=\"a\">C<u>a</u>ncel</button></div>";

},{}],7:[function(require,module,exports){
module.exports = "<img src=\"/build/axe/images/solar-system.jpg\" alt=\"Solar System\" width=\"472\" height=\"800\" usemap=\"#map\"><map id=\"map\" name=\"map\"><area shape=\"rect\" coords=\"115,158,276,192\" href=\"http://en.wikipedia.org/wiki/Mercury_%28planet%29\" alt=\"Mercury\"><area shape=\"rect\" coords=\"115,193,276,234\" href=\"http://en.wikipedia.org/wiki/Venus\" alt=\"Venus\"><area shape=\"rect\" coords=\"118,235,273,280\" href=\"http://en.wikipedia.org/wiki/Earth\"><area shape=\"rect\" coords=\"119,280,272,323\" href=\"http://en.wikipedia.org/wiki/Mars\" alt=\"Mars\"><area shape=\"rect\" coords=\"119,324,322,455\" href=\"http://en.wikipedia.org/wiki/Jupiter\" alt=\"Jupiter\"><area shape=\"rect\" coords=\"118,457,352,605\" href=\"http://en.wikipedia.org/wiki/Saturn\" alt=\"Saturn\"><area shape=\"rect\" coords=\"119,606,308,666\" href=\"http://en.wikipedia.org/wiki/Uranus\" alt=\"Uranus\"><area shape=\"rect\" coords=\"117,664,305,732\" href=\"http://en.wikipedia.org/wiki/Neptune\" alt=\"Neptune\"></map>";

},{}],8:[function(require,module,exports){
module.exports = " <label><span>Name</span> <input type=\"text\" aria-expanded=\"false\"></label>";

},{}],9:[function(require,module,exports){
module.exports = " <label><span>Name</span> <input type=\"text\" role=\"combobox\"></label>";

},{}],10:[function(require,module,exports){
module.exports = "<div role=\"list\"><div>One</div><div>Two</div></div>";

},{}],11:[function(require,module,exports){
module.exports = "<div><div role=\"listitem\">One</div><div role=\"listitem\">Two</div></div>";

},{}],12:[function(require,module,exports){
module.exports = "<div role=\"peanut\">My role is invalid!</div><div role=\"window\">My role is abstract!</div>";

},{}],13:[function(require,module,exports){
module.exports = " <label><span>Name</span> <input type=\"text\" aria-describedby=\"false\"></label>";

},{}],14:[function(require,module,exports){
module.exports = "<button aria-cancel=\"true\">Cancel</button>";

},{}],15:[function(require,module,exports){
module.exports = "<audio controls=\"true\"><source src=\"\" type=\"audio/mp4\"></audio>";

},{}],16:[function(require,module,exports){
module.exports = "<p><blink>Buy Now!</blink></p>";

},{}],17:[function(require,module,exports){
module.exports = "<button type=\"button\"></button>";

},{}],18:[function(require,module,exports){
module.exports = "";

},{}],19:[function(require,module,exports){
module.exports = "<div>Numbers</div><div> <input id=\"inputOne\" type=\"checkbox\" name=\"numbers\" checked=\"true\"> <label for=\"inputOne\">One</label></div><div> <input id=\"inputTwo\" type=\"checkbox\" name=\"numbers\"> <label for=\"inputTwo\">Two</label></div><div> <input id=\"inputThree\" type=\"checkbox\" name=\"numbers\"> <label for=\"inputThree\">Three</label></div>";

},{}],20:[function(require,module,exports){
module.exports = "<style>\n  div.contrast {\n    background-color: #eee;\n    color: #ccc;\n    padding: 0.5em;\n    text-align: center;\n  }\n</style><div class=\"contrast\"><p>Misty</p></div>";

},{}],21:[function(require,module,exports){
module.exports = "<table><thead><tr><td rowspan=\"2\">Species</td><td colspan=\"2\">Info</td></tr><tr><th>Name</th><th>Age</th></tr></thead><tbody><tr><td>Gorilla</td><td>Koko</td><td>44</td></tr><tr><td>Human</td><td>Matt</td><td>33</td></tr></tbody></table>";

},{}],22:[function(require,module,exports){
module.exports = "<dl><h4>Fun Words</h4><dt>Gumption</dt><dd>Shrewd or spirited initiative and resourcefulness.</dd><dt>Gravitas</dt><dd>Dignity, seriousness, or solemnity of manner.</dd></dl>";

},{}],23:[function(require,module,exports){
module.exports = "<h4>Fun Words</h4><div><dt>Gumption</dt><dd>Shrewd or spirited initiative and resourcefulness.</dd><dt>Gravitas</dt><dd>Dignity, seriousness, or solemnity of manner.</dd></div>";

},{}],24:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18}],25:[function(require,module,exports){
module.exports = "<p id=\"para\">First paragraph.</p><p id=\"para\">Second paragraph.</p>";

},{}],26:[function(require,module,exports){
module.exports = "<h3> <span style=\"display: none;\">Heading Text</span></h3>";

},{}],27:[function(require,module,exports){
module.exports = "<iframe src=\"generic-frame-content.html\"></iframe>";

},{}],28:[function(require,module,exports){
module.exports = "<h3>Level 3</h3><h5>Level 5</h5>";

},{}],29:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18}],30:[function(require,module,exports){
module.exports = "<img src=\"/build/axe/images/solar-system.jpg\" style=\"height: 200px;\"/>";

},{}],31:[function(require,module,exports){
module.exports = "<input type=\"image\" src=\"/build/axe/images/cancel-button.png\" style=\"height: 60px;\"/>";

},{}],32:[function(require,module,exports){
module.exports = "<div> <label>Name</label> <input type=\"text\" title=\"Name\"/></div><div> <label id=\"emailLabel\">Email</label> <input type=\"email\" aria-describedby=\"emailLabel\"/></div>";

},{}],33:[function(require,module,exports){
module.exports = "<span>Name</span> <input type=\"text\"/>";

},{}],34:[function(require,module,exports){
module.exports = "<table role=\"presentation\" summary=\"A layout table\"><caption>A layout table</caption><tr><th>This</th><th>table</th></tr><tr><td>is only</td><td>for</td></tr><tr><td>layout</td><td>purposes</td></tr></table>";

},{}],35:[function(require,module,exports){
module.exports = "<div><a href=\"http://www.google.com\"></a></div><div style=\"background-color: #00274d; padding: 10px; text-align: center;\"> <a href=\"http://www.deque.com\"><img src=\"/build/axe/images/deque.png\" alt=\"Deque\"/> <span class=\"sr\">Deque<span></a></div>";

},{}],36:[function(require,module,exports){
module.exports = "<ul><h3>Numbers</h3><li>One</li><li>Two</li><li>Three</li></ul>";

},{}],37:[function(require,module,exports){
module.exports = "<h3>Numbers</h3><div class=\"list\"><li>One</li><li>Two</li><li>Three</li></div>";

},{}],38:[function(require,module,exports){
module.exports = "<marquee>Performing Tonight!</marquee>";

},{}],39:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18}],40:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18}],41:[function(require,module,exports){
module.exports = "<object type=\"image/png\" data=\"/build/axe/images/deque.png\" style=\"background-color: #00274d; padding: 10px; text-align: center;\"></object>";

},{}],42:[function(require,module,exports){
module.exports = "<div>Numbers</div><div> <input id=\"inputOne\" type=\"radio\" name=\"numbers\" checked=\"true\"> <label for=\"inputOne\">One</label></div><div> <input id=\"inputTwo\" type=\"radio\" name=\"numbers\"> <label for=\"inputTwo\">Two</label></div><div> <input id=\"inputThree\" type=\"radio\" name=\"numbers\"> <label for=\"inputThree\">Three</label></div>";

},{}],43:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18}],44:[function(require,module,exports){
module.exports = "<table><thead><tr><th scope=\"column\">Gear</th><td scope=\"col\">Quantity</td></tr></thead><tbody><tr><td>Crampons</td><td>3</td></tr><tr><td>Ice Axes</td><td>12</td></tr></tbody></table>";

},{}],45:[function(require,module,exports){
module.exports = " <a href=\"#\"><img src=\"/build/axe/images/solar-system.jpg\" alt=\"Solar system\" ismap/></a>";

},{}],46:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18}],47:[function(require,module,exports){
module.exports = "<div> <a href=\"#\">Link 1 (ok)</a></div><div> <a tabindex=\"0\">Link 2 (ok)</a></div><div> <a href=\"#\" tabindex=\"1\">Link 3 (not ok)</a></div>";

},{}],48:[function(require,module,exports){
module.exports = "<p lang=\"xx\">Ceci n'est pas une langue</p>";

},{}],49:[function(require,module,exports){
module.exports = "<video width=\"300\" height=\"200\"><source src=\"/build/axe/images/sample-clip.ogg\" type=\"video/ogg\"><track src=\"\" kind=\"descriptions\" srclang=\"en\" label=\"english_description\"></video>";

},{}],50:[function(require,module,exports){
module.exports = "<video width=\"300\" height=\"200\"><source src=\"/build/axe/images/sample-clip.ogg\" type=\"video/ogg\"><track src=\"\" kind=\"captions\" srclang=\"en\" label=\"english_captions\"></video>";

},{}],51:[function(require,module,exports){
/**
 * Module dependencies.
 */

try {
  var index = require('indexof');
} catch (err) {
  var index = require('component-indexof');
}

/**
 * Whitespace regexp.
 */

var re = /\s+/;

/**
 * toString reference.
 */

var toString = Object.prototype.toString;

/**
 * Wrap `el` in a `ClassList`.
 *
 * @param {Element} el
 * @return {ClassList}
 * @api public
 */

module.exports = function(el){
  return new ClassList(el);
};

/**
 * Initialize a new ClassList for `el`.
 *
 * @param {Element} el
 * @api private
 */

function ClassList(el) {
  if (!el || !el.nodeType) {
    throw new Error('A DOM element reference is required');
  }
  this.el = el;
  this.list = el.classList;
}

/**
 * Add class `name` if not already present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.add = function(name){
  // classList
  if (this.list) {
    this.list.add(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = index(arr, name);
  if (!~i) arr.push(name);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Remove class `name` when present, or
 * pass a regular expression to remove
 * any which match.
 *
 * @param {String|RegExp} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.remove = function(name){
  if ('[object RegExp]' == toString.call(name)) {
    return this.removeMatching(name);
  }

  // classList
  if (this.list) {
    this.list.remove(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = index(arr, name);
  if (~i) arr.splice(i, 1);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Remove all classes matching `re`.
 *
 * @param {RegExp} re
 * @return {ClassList}
 * @api private
 */

ClassList.prototype.removeMatching = function(re){
  var arr = this.array();
  for (var i = 0; i < arr.length; i++) {
    if (re.test(arr[i])) {
      this.remove(arr[i]);
    }
  }
  return this;
};

/**
 * Toggle class `name`, can force state via `force`.
 *
 * For browsers that support classList, but do not support `force` yet,
 * the mistake will be detected and corrected.
 *
 * @param {String} name
 * @param {Boolean} force
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.toggle = function(name, force){
  // classList
  if (this.list) {
    if ("undefined" !== typeof force) {
      if (force !== this.list.toggle(name, force)) {
        this.list.toggle(name); // toggle again to correct
      }
    } else {
      this.list.toggle(name);
    }
    return this;
  }

  // fallback
  if ("undefined" !== typeof force) {
    if (!force) {
      this.remove(name);
    } else {
      this.add(name);
    }
  } else {
    if (this.has(name)) {
      this.remove(name);
    } else {
      this.add(name);
    }
  }

  return this;
};

/**
 * Return an array of classes.
 *
 * @return {Array}
 * @api public
 */

ClassList.prototype.array = function(){
  var className = this.el.getAttribute('class') || '';
  var str = className.replace(/^\s+|\s+$/g, '');
  var arr = str.split(re);
  if ('' === arr[0]) arr.shift();
  return arr;
};

/**
 * Check if class `name` is present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.has =
ClassList.prototype.contains = function(name){
  return this.list
    ? this.list.contains(name)
    : !! ~index(this.array(), name);
};

},{"component-indexof":52,"indexof":52}],52:[function(require,module,exports){
module.exports = function(arr, obj){
  if (arr.indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
},{}],53:[function(require,module,exports){
function one(selector, el) {
  return el.querySelector(selector);
}

exports = module.exports = function(selector, el){
  el = el || document;
  return one(selector, el);
};

exports.all = function(selector, el){
  el = el || document;
  return el.querySelectorAll(selector);
};

exports.engine = function(obj){
  if (!obj.one) throw new Error('.one callback required');
  if (!obj.all) throw new Error('.all callback required');
  one = obj.one;
  exports.all = obj.all;
  return exports;
};

},{}],54:[function(require,module,exports){
module.exports=dataset;

/*global document*/


// replace namesLikeThis with names-like-this
function toDashed(name) {
  return name.replace(/([A-Z])/g, function(u) {
    return "-" + u.toLowerCase();
  });
}

var fn;

if (typeof document !== "undefined" && document.head && document.head.dataset) {
  fn = {
    set: function(node, attr, value) {
      node.dataset[attr] = value;
    },
    get: function(node, attr) {
      return node.dataset[attr];
    },
    del: function (node, attr) {
      delete node.dataset[attr];
    }
  };
} else {
  fn = {
    set: function(node, attr, value) {
      node.setAttribute('data-' + toDashed(attr), value);
    },
    get: function(node, attr) {
      return node.getAttribute('data-' + toDashed(attr));
    },
    del: function (node, attr) {
      node.removeAttribute('data-' + toDashed(attr));
    }
  };
}

function dataset(node, attr, value) {
  var self = {
    set: set,
    get: get,
    del: del
  };

  function set(attr, value) {
    fn.set(node, attr, value);
    return self;
  }

  function del(attr) {
    fn.del(node, attr);
    return self;
  }

  function get(attr) {
    return fn.get(node, attr);
  }

  if (arguments.length === 3) {
    return set(attr, value);
  }
  if (arguments.length == 2) {
    return get(attr);
  }

  return self;
}

},{}]},{},[2]);
