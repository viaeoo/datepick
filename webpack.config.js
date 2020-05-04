const path = require('path');
const webpack = require('webpack');
const getPackageJson = require('./script/getPackageJson');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const {
  version,
  name,
  license,
  repository,
  author,
} = getPackageJson('version', 'name', 'license', 'repository', 'author');

const banner = `
  ${name} v${version}
  ${repository.url}

  Copyright (c) ${author.replace(/ *\<[^)]*\> */g, ' ')}

  This source code is licensed under the ${license} license found in the
  LICENSE file in the root directory of this source tree.
`;

let outputFile;

if (process.env.NODE_ENV === 'production') {
  outputFile = `${name}.min.js`;
} else {
  outputFile = `${name}.js`;
}

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './src/datepick.js',
  output: {
    filename: outputFile,
    path: path.resolve(__dirname, 'dist'),
    library: name.replace(/^./, name[0].toUpperCase()),
    libraryExport: 'default',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          'babel-loader',
          'eslint-loader',
        ],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('autoprefixer'),
              ],
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
        use: [
          'url-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: [
      '.js',
      'jsx',
      '.ts',
      '.tsx',
    ],
  },
  devServer: {
    host: '127.0.0.1',
    port: 9000,
    hot: true,
    inline: true,
    watchContentBase: true,
    clientLogLevel: 'none',
  },
  plugins: [
    new webpack.BannerPlugin(banner),
    new webpack.ProvidePlugin({
      Hammer: 'hammerjs',
    }),
    new MiniCssExtractPlugin({ filename: process.env.NODE_ENV === 'production' ? `${name}.min.css` : `${name}.css` }),
    new StyleLintPlugin(),
  ],
};