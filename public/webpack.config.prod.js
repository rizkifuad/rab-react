var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var dotenv = require('dotenv')

dotenv.load({path: '../.env'})

module.exports = {
    devtool: 'source-map',
    entry: [
        './src/index'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        chunkFilename: '[id].chunk.js',
        publicPath: '/dist/'
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'ROOT_API': JSON.stringify(process.env.ROOT_API)
          'ROOT_URL': JSON.stringify(process.env.ROOT_URL)
        }
      }),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new ExtractTextPlugin('styles.css'),
      new webpack.DefinePlugin({
        'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        })
    ],
    module: {
        loaders: [{
            test: /\.js$/,
            loaders: ['babel'],
            include: path.join(__dirname, 'src')
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap'),
        }, {
            test: /\.(jpe?g|png|gif|svg)(?:\?.*|)$/i,
            loaders: [
                'file?hash=sha512&digest=hex&name=[hash].[ext]',
                'image-webpack'
            ]
        }]
    },
};
