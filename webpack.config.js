var webpack = require('webpack');

var babelPresets = ['es2015', 'react', 'stage-2'];
var plugins = [];

if (process.env.NODE_ENV === 'production') {
  plugins = [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin()
  ];
} else {
  babelPresets = ['es2015', 'react', 'react-hmre', 'stage-2'];
}

module.exports = {
  entry: ['./src/app/main.jsx'],
  output: {
    filename: 'app.js',
    path: __dirname + '/src/public',
    publicPath: '/'
  },
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
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  devtool: 'source-map',
  plugins: plugins
};