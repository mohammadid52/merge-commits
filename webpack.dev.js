const common = require('./webpack.common.js');
const {merge} = require('webpack-merge');
const webpack = require('webpack');

const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap(merge(common, {
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
  },
  watchOptions: {
    ignored: /node_modules/
  }
}));
