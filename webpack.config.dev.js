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
        exclude: /node_modules/,
        loader: 'url-loader'
      }
    ]
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  plugins: [
    // JS
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor'],
      minChunks: Infinity
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),

    // CSS
    new ExtractTextPlugin('[name].css'),

    // HTML
    new HtmlWebpackPlugin({
      template: 'src/index.ejs'
    })
  ],
  postcss: function () {
    return [precss, autoprefixer];
  },
  devServer: {
    proxy: {
      '/': {
        target: {
          host: "localhost",
          port: 9000,
          protocol: "http"
        }
      }
    },
  },
  devtool: 'source-map'
};
