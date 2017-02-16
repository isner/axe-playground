
/**
 * Modules dependencies.
 */

var express = require('express');

var app = module.exports = express();

var PORT = 3000;

/**
 * Configure view rendering.
 */

app.set('view engine', 'pug');

/**
 * Specify static, public assets.
 */

app.use('/build', express.static(__dirname + '/build'));

/**
 * Mount routes.
 */

app.use(require('./routes/home'));
app.use(require('./routes/rule'));

/**
 * Start server.
 */

if (!module.parent) {
  app.listen(PORT, function () {
    console.log();
    console.log('  axe-playground running');
    console.log('  listening on port %d', PORT);
    console.log();
  });
}
