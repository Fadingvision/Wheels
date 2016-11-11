var path    = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var projectRoot = path.resolve(__dirname, './');


module.exports = {
  devtool: 'source-map',  // development
  // devtool: 'cheap-module-source-map',  // development
  entry: {},
  module: {
    preLoaders: [{
      test: /\.js$/,
      loader: 'eslint',
      include: projectRoot,
      exclude: /node_modules/
    }],
    loaders: [
       { test: /\.js$/, exclude: [/app\/lib/, /node_modules/], loader: 'ng-annotate!babel' },
       { test: /\.html$/, loader: 'html-withimg-loader!raw' },
       { test: /\.less$/, exclude: /\.module\.less$/, loader: 'style!css-loader!less-loader' },
       { test: /\.module\.less$/, loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!less-loader' },
       { test: /\.css$/, loader: 'style!css' },
       { test: /\.(png|jpe?g|gif|svg)(\?.*)?$/, loader: 'url?limit=10000&name=./img/[name].[hash:7].[ext]' },
       { test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/, loader: 'url?limit=10000&name=./fonts/[name].[hash:7].[ext]' }
    ]
  },
  eslint: {
    formatter: require('eslint-friendly-formatter')
  },

  resolve: {
    extensions: [],
    // 指定别名，优化webpack的查找速度
    alias: {
      'angular': path.join(__dirname, './node_modules', '/angular/angular')
      // 'angular': path.join(__dirname, './node_modules', '/angular/angular.min') // production
    }
  },
  htmlLoader: {
    ignoreCustomFragments: [/\{\{.*?}}/],
    root: path.resolve(__dirname, 'assets'),
    attrs: ['img:src', 'link:href']
  },
  plugins: [
    // Injects bundles in your index.html instead of wiring all manually.
    // It also adds hash to all injected assets so we don't have problems
    // with cache purging during deployment.
    new HtmlWebpackPlugin({
      template: 'client/index.html',
      inject: 'body',
      hash: true
    }),

    // Automatically move all modules defined outside of application directory to vendor bundle.
    // If you are using more complicated project structure, consider to specify common chunks manually.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        return module.resource && module.resource.indexOf(path.resolve(__dirname, 'client')) === -1;
      }
    })
  ]
};