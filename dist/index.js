(function outer(modules, cache, entries){

  /**
   * Global
   */

  var global = (function(){ return this; })();

  /**
   * Require `name`.
   *
   * @param {String} name
   * @api public
   */

  function require(name){
    if (cache[name]) return cache[name].exports;
    if (modules[name]) return call(name, require);
    throw new Error('cannot find module "' + name + '"');
  }

  /**
   * Call module `id` and cache it.
   *
   * @param {Number} id
   * @param {Function} require
   * @return {Function}
   * @api private
   */

  function call(id, require){
    var m = cache[id] = { exports: {} };
    var mod = modules[id];
    var name = mod[2];
    var fn = mod[0];
    var threw = true;

    try {
      fn.call(m.exports, function(req){
        var dep = modules[id][1][req];
        return require(dep || req);
      }, m, m.exports, outer, modules, cache, entries);
      threw = false;
    } finally {
      if (threw) {
        delete cache[id];
      } else if (name) {
        // expose as 'name'.
        cache[name] = cache[id];
      }
    }

    return cache[id].exports;
  }

  /**
   * Require all entries exposing them on global if needed.
   */

  for (var id in entries) {
    if (entries[id]) {
      global[entries[id]] = require(id);
    } else {
      require(id);
    }
  }

  /**
   * Duo flag.
   */

  require.duo = true;

  /**
   * Expose cache.
   */

  require.cache = cache;

  /**
   * Expose modules
   */

  require.modules = modules;

  /**
   * Return newest require.
   */

   return require;
})({
1: [function(require, module, exports) {

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
    'area-alt': require('../examples/rules/area-alt.html')
  },
  check: {
    'cell-no-header': require('../examples/checks/cell-no-header.html'),
    'headers-visible-text': require('../examples/checks/headers-visible-text.html'),
    'th-single-row-column': require('../examples/checks/th-single-row-column.html')
  }
};

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
  markupArea.innerHTML = safeTags(fixture.innerHTML);
  analyze();
});

/**
 * Clicks on the 'Render' button render the fixture
 * using the current value of the 'Edit HTML' field.
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

}, {"component/classes":2,"component/query":3,"../examples/rules/accesskeys.html":4,"../examples/rules/area-alt.html":5,"../examples/checks/cell-no-header.html":6,"../examples/checks/headers-visible-text.html":7,"../examples/checks/th-single-row-column.html":8}],
2: [function(require, module, exports) {
/**
 * Module dependencies.
 */

var index = require('indexof');

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

}, {"indexof":9}],
9: [function(require, module, exports) {
module.exports = function(arr, obj){
  if (arr.indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
}, {}],
3: [function(require, module, exports) {
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

}, {}],
4: [function(require, module, exports) {
module.exports = '\n<div>\n  <div>\n    <label>\n      <span>N<u>a</u>me</span>\n      <input type="text" name="name" accesskey="a" />\n    </label>\n  <div>\n    <label>\n      <span><u>E</u>mail</span>\n      <input type="email" name="email" accesskey="e" />\n    </label>\n  </div>\n  <div>\n    <button accesskey="a">C<u>a</u>ncel</button>\n  </div>\n</div>\n';
}, {}],
5: [function(require, module, exports) {
module.exports = '\n<div>\n  <img src="solar-system.jpg" alt="Solar System" width="472" height="800"\n  usemap="#map">\n\n  <map id="map" name="map">\n    <area shape="rect" coords="115,158,276,192"\n    href="http://en.wikipedia.org/wiki/Mercury_%28planet%29" alt="Mercury">\n    <area shape="rect" coords="115,193,276,234"\n    href="http://en.wikipedia.org/wiki/Venus" alt="Venus">\n    <!-- Missing alt on this tag -->\n    <area shape="rect" coords="118,235,273,280"\n    href="http://en.wikipedia.org/wiki/Earth">\n    <area shape="rect" coords="119,280,272,323"\n    href="http://en.wikipedia.org/wiki/Mars" alt="Mars">\n    <area shape="rect" coords="119,324,322,455"\n    href="http://en.wikipedia.org/wiki/Jupiter" alt="Jupiter">\n    <area shape="rect" coords="118,457,352,605"\n    href="http://en.wikipedia.org/wiki/Saturn" alt="Saturn">\n    <area shape="rect" coords="119,606,308,666"\n    href="http://en.wikipedia.org/wiki/Uranus" alt="Uranus">\n    <area shape="rect" coords="117,664,305,732"\n    href="http://en.wikipedia.org/wiki/Neptune" alt="Neptune">\n  </map>\n</div>\n';
}, {}],
6: [function(require, module, exports) {
module.exports = '\n<div>\n\n  <h3>Pass</h3>\n  <table>\n    <thead>\n      <tr>\n        <th scope="col">First</th>\n        <th scope="col">Last</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr>\n        <td>Jerry</td>\n        <td>Seinfeld</td>\n      </tr>\n    </tbody>\n  </table>\n\n  <h3>Fail</h3>\n  <table>\n    <thead>\n      <tr>\n        <td>First</td>\n        <td>Last</td>\n      </tr>\n    </thead>\n    <tbody>\n      <tr>\n        <td>Jerry</td>\n        <td>Seinfeld</td>\n      </tr>\n    </tbody>\n  </table>\n\n</div>\n';
}, {}],
7: [function(require, module, exports) {
module.exports = '\n<div>\n\n  <h3>Pass</h3>\n  <table>\n    <thead>\n      <tr>\n        <th scope="col">First</th>\n        <th scope="col">Last</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr>\n        <td>Jerry</td>\n        <td>Seinfeld</td>\n      </tr>\n    </tbody>\n  </table>\n\n  <h3>Fail</h3>\n  <table>\n    <thead>\n      <tr>\n        <th scope="col">First</th>\n        <th scope="col" style="display: none;">Last</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr>\n        <td>Jerry</td>\n        <td>Seinfeld</td>\n      </tr>\n    </tbody>\n  </table>\n\n</div>\n';
}, {}],
8: [function(require, module, exports) {
module.exports = '\n<div>\n\n  <table>\n    <thead>\n      <tr>\n        <th scope="col" rowspan="2">ID</th>\n        <th scope="col" rowspan="2">DOB</th>\n        <th scope="col">First</th>\n        <th scope="col">Last</th>\n      </tr>\n      <tr>\n        <th scope="col" colspan="2">Name</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr>\n        <td>1</th>\n        <td>04/13/1949</th>\n        <td>Christopher</th>\n        <td>Hitchens</th>\n      </tr>\n      <tr>\n        <td>2</th>\n        <td>04/09/1967</th>\n        <td>Sam</th>\n        <td>Harris</th>\n      </tr>\n    </tbody>\n  </table>\n\n</div>\n';
}, {}]}, {}, {"1":""})