
module.exports = function(config) {
  var testWebpackConfig = require('./webpack.test.js');

  config.set({

     basePath: '',

     frameworks: ['jasmine'],

     exclude: [ ],

     files: [ { pattern: './config/spec-bundle.js', watched: false } ],

     preprocessors: { './config/spec-bundle.js': ['coverage', 'webpack', 'sourcemap'] },

     webpack: testWebpackConfig,

     coverageReporter: {
        dir : 'coverage/',
        reporters: [
           { type: 'text-summary' },
           { type: 'json' },
           { type: 'html' },
           { type: 'lcov' }
        ]
     },

     webpackServer: { noInfo: true },

     reporters: ['mocha', 'coverage', 'coveralls' ],

     port: 9876,

     colors: true,

     logLevel: config.LOG_INFO,

     autoWatch: false,

     browsers: ['PhantomJS'],

     singleRun: true
  });

};
