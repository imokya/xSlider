const { resolve } = require('./utils.config')
const commonConfig = require('./common.config')
const merge = require('webpack-merge')

const devConfig = {

  mode: 'development',
  devtool: 'source-map',

  devServer: {
    contentBase: resolve('../dist')
  },

  module: {
    rules: [
      {
        test: /\.styl$/i,
        use: [
          'style-loader', 
          {
            loader: 'css-loader',
            options: {
              import: true,
              modules: 'global'
            }
          }, 
          'postcss-loader', 
          'stylus-loader'
        ]
      }
    ]
  }

}

module.exports = merge(commonConfig, devConfig)