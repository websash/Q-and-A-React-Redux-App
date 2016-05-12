const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanPlugin = require('clean-webpack-plugin')
const pkg = require('./package.json')
const TARGET = process.env.npm_lifecycle_event

const common = {
  entry: {
    app: './app/index.js'
  },
  output: {
    path: 'build',
    filename: '[name].js',
    publicPath: '/'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules|build/,
      loader: 'babel',
      query: {
        cacheDirectory: true,
        presets: ['es2015', 'react', 'stage-1']
      }
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'app/index.ejs',
      favicon: 'app/static/favicon.ico',
      inject: false
    })
  ]
}

if (TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,
      stats: 'errors-only',
      host: process.env.HOST || '0.0.0.0',
      port: process.env.PORT
    },
    module: {
      loaders: [{
        test: /\.css$/,
        loaders: ['style', 'css'],
        exclude: /node_modules|build/
      }]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  })
}

if (TARGET === 'build' || TARGET === 'start:prod') {
  module.exports = merge(common, {
    entry: {
      app: './app/index.js',
      react: ['react', 'react-dom'],
      vendor: Object.keys(pkg.dependencies).filter(d =>
        d !== 'react' && d !== 'react-dom'
      ),
      style: './app/styles/main.css'
    },
    output: {
      path: 'build',
      filename: '[name].[chunkhash].js',
      chunkFilename: '[chunkhash].js',
      publicPath: '/'
    },
    module: {
      loaders: [{
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css'),
        exclude: /node_modules|build/
      }]
    },
    plugins: [
      new CleanPlugin('build', {verbose: false}),
      new ExtractTextPlugin('[name].[chunkhash].css'),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.CommonsChunkPlugin({
        names: ['react', 'vendor', 'manifest']
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  })
}
