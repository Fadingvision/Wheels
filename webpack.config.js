var webpack = require('webpack');
var path = require('path');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var projectRoot = path.resolve(__dirname, './');


module.exports = {
    devtool: '#eval-source-map',
    entry: [
        'babel-polyfill',
        path.join(__dirname, './index.js')
    ],
    output: {
        filename: '[name].bundle.js',
        publicPath: '',
        path: path.join(__dirname, './fetch/dist')
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
            minChunks: function(module, count) {
                return module.resource && module.resource.indexOf(path.resolve(__dirname, 'fetch')) === -1;
            }
        })
    ]
}