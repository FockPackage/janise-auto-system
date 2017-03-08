var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var ChoiceUIOptions = require('@choiceform/ember-choice-ui').options;
var { cssModules, outputPaths, nodeAssets } = ChoiceUIOptions;

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    app: { intl: 'assets/i18n' },
    outputPaths,
    cssModules,
    nodeAssets: Object.assign({}, nodeAssets, {
      swiper: {
        srcDir: 'dist',
        import: [
          'css/swiper.min.css',
          {
            path: 'js/swiper.min.js',
            outputFile: 'assets/swiper.js',
            sourceMap: 'js/maps/swiper.min.js.map'
          }
        ]
      },
      imagesloaded: {
       import: [
         {
           path: 'imagesloaded.pkgd.js'
         }
       ]
     }
   }),

   // 允许注入的环境变量名称
    dotEnv: {
      clientAllowedKeys: ['API_HOST'],
      path: {
        development: './.env',
        production: './.env.production'
      }
    }
  });

  //swiper
  app.import(`./vendor/shims/swiper.js`, {outputFile: 'assets/swiper.js'});

  // device
  app.import('bower_components/device.js/lib/device.min.js');
  app.import('./vendor/shims/device.js');
  app.import('./vendor/shims/imagesloaded.js');

  //mobileScroll
  app.import(`./vendor/mobiscroll/css/mobiscroll.custom-3.0.1.min.css`,
    { outputFile: 'assets/mobiscroll.css' });
  app.import(`./vendor/mobiscroll/js/mobiscroll.custom-3.0.1.min.js`,
    { outputFile: 'assets/mobiscroll.js' });
  app.import(`./vendor/shims/mobiscroll.js`, { outputFile: 'assets/mobiscroll.js' });

  return app.toTree();
};
