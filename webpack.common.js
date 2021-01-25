const path = require('path');

module.exports = {
  context: path.join(__dirname, './'),
  entry: path.resolve(__dirname, './src', 'index.tsx'),
  output: {
    path: path.join(__dirname, '/public'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  mode: 'production',
  optimization: {
    usedExports: true,
  },
  resolve: {
    extensions: ['.mjs', '.ts', '.tsx', '.js', '.json'],
    mainFields: ['module', 'main'],
    modules: [path.resolve('./src'), path.resolve('./frontend'), path.resolve('./node_modules')],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loaders: 'ts-loader',
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        loader: 'json-loader',
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: 'babel-loader',
        query: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: [
            '@babel/plugin-proposal-class-properties',
            'babel-plugin-transform-async-to-promises',
          ],
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.css$/,
        // TODO: Need to recheck.
        // exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                require('tailwindcss'),
                require('autoprefixer'),
                // require('@tailwindcss/ui'),
              ],
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: 'style-loader',
          },
          'cache-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.(png|jpe?g|svg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              outputPath: 'media',
              publicPath: 'media',
            },
          },
        ],
      },
    ],
  },
  
};
