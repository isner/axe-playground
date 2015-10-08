/* global axe, axeXPath */

var opts = {
  reporter: 'v1',
  runOnly: {
    type: 'tag',
    values: ['wcag2a', 'wcag2aa']
  },
  checks: {
    'rowspan': { enabled: false },
    'headers-visible-text': { enabled: false }
  }
};

opts = {};

axe.a11yCheck('html', opts, function (res) {
  console.log('Violations   : ', res.violations);
});

axeXPath.a11yCheckAsString('html', opts, function (res) {
  console.log('alaska-jsa11y: ', JSON.parse(res).violations);
});
