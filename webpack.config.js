var webpack = require('webpack');
var path = require('path');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var projectRoot = path.resolve(__dirname, './');


module.exports = {
    devtool: '#eval-source-map',
    entry: path.join(__dirname, './motion/src/motion.js'),
    output: {
        filename: '[name].bundle.js',
        publicPath: '',
        path: path.join(__dirname, './motion/dist/'),
        libraryTarget: 'umd',
        library: 'motion',
        umdNamedDefine: true
    },
    module: {
        loaders: [{
            test: /.js$/,
            exclude: [/node_modules/],
            loader: 'babel'
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            inject: 'body',
            hash: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function(module) {
                return module.resource && module.resource.indexOf(path.resolve(__dirname, 'motion')) === -1;
            }
        })
    ]
}