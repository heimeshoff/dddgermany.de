const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');

const parts = require('./lib/parts');

const PATHS = {
  app: path.join(__dirname, 'app'),
  style: [
    path.join(__dirname, 'node_modules', 'material-ui'),
    path.join(__dirname, 'app', 'main.css')
  ],
  build: path.join(__dirname, 'build'),
  resources: path.join(__dirname, 'resources')
};

const common = {
  entry: {
    style: PATHS.style,
    app: PATHS.app
  },
  output: {
    path: PATHS.build,
    publicPath: '/dddgermany.de/',
    filename: '[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({ title: 'Deutsche Domain Driven Design Community' }),
    new FaviconsWebpackPlugin( path.join(PATHS.app,'img/logo.png'))
  ]
};

var config;
switch(process.env.npm_lifecycle_event) {
  case 'build':
    config = merge(
      common,
      parts.clean(path.join(PATHS.build, '*')),
      {
        devtool: 'source-map',
        output: {
          path: PATHS.build,
          filename: '[name].[chunkhash].js',
          chunkFilename: '[chunkhash].js'
        }
      },
      parts.setFreeVariable('process.env.NODE_ENV','production'),
      parts.extractBundle({
        name: 'vendor',
        entries: ['react']
      }),
      parts.minify(),
      parts.extractCSS(PATHS.style),
      parts.purifyCSS([PATHS.app]),
      parts.copy(PATHS.resources)
    );
    break;
  default:
    config = merge(
        common,
        {
        devtool: 'eval-source-map'
        },
        parts.setupCSS(PATHS.app),
        parts.devServer({
          host: process.env.HOST,
          port: process.env.PORT
        }))
}

module.exports = validate(config);
