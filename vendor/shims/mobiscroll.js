(function() {
  function vendorModule() {
    'use strict';

    return { 'default': self['mobiscroll'] };
  }

  define('mobiscroll', [], vendorModule);
})();
