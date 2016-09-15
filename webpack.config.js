const path = require('path');
const webpack = require('webpack');
const WebpackMd5Hash = require('webpack-md5-hash');
const ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const precss = require('precss');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    vendor: './src/vendor.js',
    main: './src/index.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: [
            require.resolve('babel-preset-es2015')
          ]
        }
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        loader: 'ng-cache?-url'
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss-loader!sass')
      },
      {
        test: /\.(ttf|eot|svg|jpg|gif|png|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'file-loader'
      }
    ]
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js'
  },
  plugins: [
    // JS
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor'],
      minChunks: Infinity
    }),
    new WebpackMd5Hash(),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      topojson: 'topojson',
      chroma: 'chroma-js'
    }),
    new ngAnnotatePlugin({
      include: /\.js$/,
      add: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      include: /\.js$/,
      compress: {
        warnings: false,
        drop_debugger: false
      }
    }),

    // CSS
    new ExtractTextPlugin('[name].[chunkhash].css'),

    // HTML
    new HtmlWebpackPlugin({
      template: 'src/index.ejs'
    })
  ],
  postcss: function () {
    return [precss, autoprefixer];
  }
};
