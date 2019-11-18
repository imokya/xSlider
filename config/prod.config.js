const TerserJSPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const commonConfig = require('./common.config')
const merge = require('webpack-merge')

const prodConfig = {

  mode: 'production',

  module: {
    rules: [
      {
        test: /\.styl$/i,
        use: [
          MiniCssExtractPlugin.loader, 
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
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/style.css'
      //chunkFilename: 'css/[id].css'
    })
  ],

  optimization: {
    minimizer: [
      new TerserJSPlugin(), 
      new OptimizeCSSAssetsPlugin()
    ],
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all'
        }
      }
    }
  }

}

module.exports = merge(commonConfig, prodConfig)