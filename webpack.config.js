'use strict';

const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

// const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/')
// const phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
// const pixi = path.join(phaserModule, 'build/custom/pixi.js')
// const p2 = path.join(phaserModule, 'build/custom/p2.js')

module.exports = {
  mode: 'none',
  entry: {
    game: [
      'babel-polyfill',
      path.resolve(__dirname, 'game/index.js'),
    ],
    // vendor: ['pixi', 'p2', 'phaser', 'webfontloader']
  },

  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '.',
    filename: '[name].bundle.js'
  },

  module: {
    rules: [
      {
        test: [ /\.vert$/, /\.frag$/ ],
        use: 'raw-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
        include: path.join(__dirname, 'game'),
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      }
      // {
      //   test: /p2\.js/,
      //   use: ['expose-loader?p2'],
      // },
      // {
      //   test: /phaser-split\.js/,
      //   use: ['expose-loader?Phaser'],
      // },
      // {
      //   test: /pixi\.js/,
      //   use: ['expose-loader?PIXI'],
      // },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
        'CANVAS_RENDERER': JSON.stringify(true),
        'WEBGL_RENDERER': JSON.stringify(true)
    }),
    new HtmlWebpackPlugin(),
  ],
  devServer: {
    port: 8080,
    contentBase: './build',
    watchContentBase: true,
    hot: true,
    historyApiFallback: true,
  },
  // resolve: {
  //   alias: {
  //     'phaser': phaser,
  //     'pixi': pixi,
  //     'p2': p2,
  //   },
  // },

};
