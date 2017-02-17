
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
