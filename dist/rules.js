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

module.exports = [
  'accesskeys',
  'area-alt',
  'aria-allowed-attr',
  'aria-required-attr',
  'aria-required-children',
  'aria-required-parent',
  'aria-roles',
  'aria-valid-attr-value',
  'aria-valid-attr',
  'audio-caption',
  'blink',
  'button-name',
  'bypass-matches',
  'bypass',
  'checkboxgroup',
  'color-contrast',
  'data-table-matches',
  'data-table',
  'definition-list',
  'dlitem',
  'document-title',
  'duplicate-id',
  'empty-heading',
  'frame-title',
  'heading-order',
  'html-lang',
  'image-alt',
  'input-image-alt',
  'label-title-only',
  'label',
  'layout-table-matches',
  'layout-table',
  'link-name',
  'list',
  'listitem',
  'marquee',
  'meta-refresh',
  'meta-viewport',
  'object-alt',
  'radiogroup',
  'region',
  'scope',
  'server-side-image-map',
  'skip-link',
  'tabindex',
  'valid-lang',
  'video-caption',
  'video-description'
];

}, {}]}, {}, {"1":""})