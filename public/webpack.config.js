var path = require('path');
var webpack = require('webpack');

module.exports = {
    // or devtool: 'eval' to debug issues with compiled output:
    devtool: 'source-map',
    entry: [
        // necessary for hot reloading with IE:
        'eventsource-polyfill',
        // listen to code updates emitted by hot middleware:
        'webpack-hot-middleware/client',
        // your code:
        './src/index'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        chunkFilename: '[id].chunk.js',
        publicPath: '/dist/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        loaders: [{
            test: /\.js$/,
            loaders: ['babel'],
            include: path.join(__dirname, 'src')
        }, {
            test: /\.css$/,
            loaders: ['style', 'css'],
            include: path.join(__dirname, 'assets')
        }, {
            test: /\.(jpe?g|png|gif|svg)(?:\?.*|)$/i,
            loaders: [
                'file?hash=sha512&digest=hex&name=[hash].[ext]',
                'image-webpack'
            ]
        }]
    }
};
