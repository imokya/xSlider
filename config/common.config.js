const { resolve } = require('./utils.config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin') 
const ManifestWebpackPlugin = require('../plugins/manifest-webpack-plugin')
const config = require('../src/config')

module.exports = {

  entry: {
    app: resolve('../src/main.js')
  },

  output: {
    path: resolve('../dist'),
    filename: 'js/[name].js',
    publicPath: config.publicPath
  },

  resolve: {
    alias: {
      '@': resolve('../src')
    },
    extensions: ['.js', '.json', '.styl', '.stylus']
  },

  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      { test: /\.html$/, exclude: /node_modules/, loader: 'html-loader' },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              context: 'src',
              name: '[path][name].[ext]?v='+config.version,
              emitFile: false,
              limit: 8192
            }
          }
        ],
      }
    ]
  },

  plugins: [
    new ManifestWebpackPlugin({
      disable: false,
      source: '../src/img',
      output: '../src'
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin([
      { from: 'src/img', to: 'img' }
    ]),
    new HtmlWebpackPlugin({
      config: config,
      minify: {
        collapseWhitespace: true,
        preserveLineBreaks: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      },
      inject: false,
      template: 'src/index.ejs'
    })
  ],

  stats: 'minimal'

}
