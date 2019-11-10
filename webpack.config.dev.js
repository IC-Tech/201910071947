const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.config.common.js')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin= require('html-webpack-plugin')

module.exports = merge(common, {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer()]
            }
          }]
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer()]
            }
          }, 'sass-loader'],
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'IChat',
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['ichat', 'vendor'],
      favicon: './src/public/favicon.ico'
    }),
    new HtmlWebpackPlugin({
      title: 'Offline',
      template: './src/offline.html',
      filename: 'offline.html',
      chunks: [],
      favicon: './src/public/favicon.ico'
    }),
    new HtmlWebpackPlugin({
      title: 'PageNotFound',
      template: './src/404.html',
      filename: '404.html',
      chunks: [],
      favicon: './src/public/favicon.ico'
    }),
    new HtmlWebpackPlugin({
      title: 'IChat',
      template: './src/signin.html',
      filename: 'signin.html',
      chunks: ['signin', 'vendor'],
      favicon: './src/public/favicon.ico'
    }),
    new HtmlWebpackPlugin({
      title: 'Profile',
      template: './src/profile.html',
      filename: 'profile.html',
      chunks: ['profile', 'vendor'],
      favicon: './src/public/favicon.ico'
    }),
    new HtmlWebpackPlugin({
      title: 'Settings',
      template: './src/settings.html',
      filename: 'settings.html',
      chunks: ['settings', 'vendor'],
      favicon: './src/public/favicon.ico'
    })
  ],
  devServer: {
    host: '192.168.8.20'
  }
});
