/* global axe, axeXPath */

var opts = {};

axe.a11yCheck('html', opts, function (res) {
  console.log('Failed "none" checks: ',
    res.violations[0].nodes[0].none);
});

// axeXPath.a11yCheckAsString('html', opts, function (res) {
//   console.log('alaska-jsa11y: ', JSON.parse(res).violations);
// });
