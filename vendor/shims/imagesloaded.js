(function() {
  function vendorModule() {
    'use strict';

    return { 'default': self['imagesLoaded'] };
  }

  define('imagesLoaded', [], vendorModule);
})();
