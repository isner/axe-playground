/* global axe */

var opts = {};

axe.a11yCheck('html', opts, function (res) {
  var out = [];
  res.violations.forEach(function (v) {
    out.push(v.id);
  });
  console.log('Failed rules : ', out);
  console.log('Violations   : ', res.violations);
});
