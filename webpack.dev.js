const common = require('./webpack.common.js');
const {merge} = require('webpack-merge');
// const path = require('path');
const webpack = require('webpack');

module.exports = merge(common, {
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
    watchContentBase: true
  }
});
