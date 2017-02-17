
var express = require('express');

var app = module.exports = express();

var PORT = 3000;

app.set('view engine', 'pug');

app.use('/build', express.static(__dirname + '/build'));

app.use(require('./routes/home'));
app.use(require('./routes/rule'));

if (!module.parent) {
  app.listen(PORT, function () {
    console.log();
    console.log('  axe-playground running');
    console.log('  listening on port %d', PORT);
    console.log();
  });
}
