const HtmlPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const proxy = {};
const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
  entry: './src/main.js',
  output: {
    filename: mode === 'production' ? '[chunkhash].js' : '[name].js',
    path: path.resolve('dist'),
  },
  mode,
  devServer: {
    proxy,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: { cacheDirectory: true },
      },
      {
        test: /\.html$/,
        loader: 'raw-loader',
      },
      {
        test: /\.(jpe?g|png|gif|svg|eot|ttf|woff|woff2)$/i,
        loader: 'file-loader',
        options: {
          name: '[hash:8].[ext]',
          outputPath: 'reosurces',
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new HtmlPlugin({
      title: 'Ymap',
      template: './src/index.html',
      filename: 'index.html'
    }),
    new CleanWebpackPlugin(),
  ],
};
