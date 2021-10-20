const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: path.join(__dirname, './'),
  entry: path.resolve(__dirname, './src', 'index.tsx'),
  output: {
    path: path.join(__dirname, '/public'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  mode: 'production',
  node: {fs: 'empty'},
  optimization: {
    usedExports: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'body',
      templateContent: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="X-UA-Compatible" content="ie=edge" />
          <!-- Links href and meta tags content are defined from the app based on the clientKey (iconoclast/project curate)  -->
          <link rel="icon" type="image/png" sizes="32x32" id="favicon32x32" />
          <link rel="icon" type="image/png" sizes="16x16" id="favicon16x16" />
          <link rel="shortcut icon" id="faviconDefault" />
          <link rel="manifest" id="manifest" />

          <link rel="apple-touch-icon" sizes="180x180" id="appleTouchIcon" />
          <link rel="mask-icon" id="maskIcon" color="#1c2c42" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700;800&display=swap"
            rel="stylesheet"
          />
          <meta name="apple-mobile-web-app-title" />
          <meta name="application-name" />
          <meta name="msapplication-TileColor" content="#2b5797" />
          <meta name="msapplication-TileImage" />
          <meta name="msapplication-config" />
          <meta name="theme-color" content="#ffffff" />
          <title></title>
        </head>
        <body>
          <div id="app" class="container font-open"></div>
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        </body>
      </html>
      `,
    }),
  ],
  resolve: {
    plugins: [
      new TsconfigPathsPlugin({
        /* options: see below */
      }),
    ],
    extensions: ['.mjs', '.ts', '.tsx', '.js', '.json'],
    mainFields: ['module', 'main'],
    modules: [
      path.resolve('./src'),
      path.resolve('./frontend'),
      path.resolve('./node_modules'),
    ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: '/node_modules/',
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
              plugins: [require('tailwindcss'), require('autoprefixer')],
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
