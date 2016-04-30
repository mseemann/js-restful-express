const utils = require('./utils');


const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');


const ENV = process.env.ENV = process.env.NODE_ENV = 'test';


module.exports = {

  devtool: 'inline-source-map',

  resolve: {
    extensions: ['', '.ts', '.js'],
    absPath: utils.absPath('src'),
  },

  module: {

    preLoaders: [
      {
        test: /\.ts$/,
        loader: 'tslint-loader',
        exclude: [utils.absPath('node_modules')]
      },
      {
        test: /\.js$/,
        loader: 'source-map-loader',
      }
    ],

    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        query: {
          compilerOptions: {
            // Remove TypeScript helpers to be injected
            // below by DefinePlugin
            removeComments: true
          }
        },
        exclude: [/\.e2e\.ts$/]
      }
    ],


    postLoaders: [
      {
        test: /\.(js|ts)$/, loader: 'istanbul-instrumenter-loader',
        include: utils.absPath('src'),
        exclude: [
          /\.(spec)\.ts$/,
          /node_modules/
        ]
      }
    ]
  },

  tslint: {
    emitErrors: false,
    failOnHint: false,
    resourcePath: 'src'
  },


  node: {
    global: 'window',
    process: false,
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  }

};
