const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanPlugin = require('clean-webpack-plugin')
const pkg = require('./package.json')
const TARGET = process.env.npm_lifecycle_event

const common = {
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
  }
}

if (TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    entry: [
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
      './app/index.js'
    ],
    output: {
      path: path.join(__dirname, 'build'),
      filename: '[name].js',
      publicPath: '/'
    },
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
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ]
  })
}

if (TARGET === 'build') {
  module.exports = merge(common, {
    entry: {
      app: './app/index.js',
      react: ['react', 'react-dom'],
      vendor: Object.keys(pkg.dependencies)
        .filter(d => d !== 'react' && d !== 'react-dom'),
      style: './app/styles/main.css'
    },
    output: {
      path: path.join(__dirname, 'build'),
      filename: '[name].[chunkhash].js',
      chunkFilename: '[chunkhash].js',
      publicPath: '../build'
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
      new webpack.optimize.OccurenceOrderPlugin(),
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
      }),
      function () {
        this.plugin('done', function (stats) {
          const assets = stats.toJson().assetsByChunkName

          const appScripts = Object.keys(assets)
            .filter(k => k !== 'style').map(k => `/${assets[k]}`)

          const appStyle = `/${Object.keys(assets)
            .filter(k => k === 'style').map(k => assets[k])[0]
            .find(asset => /\.css$/.test(asset))}`

          require('fs').writeFileSync(
            path.join(__dirname, 'build', 'assets.json'),
            JSON.stringify({appStyle, appScripts}, null, 2))
        })
      }
    ]
  })
}
