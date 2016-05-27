var webpack = require('webpack');

var babelPresets = ['es2015', 'react', 'stage-2'];
var plugins = [];
var output = {};

if (process.env.NODE_ENV === 'production') {
  plugins = [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin()
  ];

  output = {
    filename: 'app.js',
    path: __dirname + 'src/public/',
    publicPath: '/'
  };
} else {
  babelPresets = ['es2015', 'react', 'react-hmre', 'stage-2'];
  plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ];

  output = {
    filename: 'app.js',
    path: '/',
    publicPath: 'http://localhost:3000/'
  };
}

module.exports = {
  entry: [
    './src/app/main.jsx',
    'webpack-hot-middleware/client'
  ],
  output: output,
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: babelPresets,
          cacheDirectory: true
        }
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  devtool: 'source-map',
  plugins: plugins
};