const common = require('./webpack.config.js');
const {merge} = require('webpack-merge');
const webpack = require('webpack');

const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap(
  merge(common, {
    mode: 'development',
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('development'),
        },
      }),
      // new BundleAnalyzerPlugin(),
    ],
    devServer: {
      watchContentBase: true,
    },
    watch: true,
    watchOptions: {
      aggregateTimeout: 1000,
      poll: 2000,
      ignored: [/node_modules/, 'node_modules'],
    },
  })
);
