const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const path = require('path');

// webpack.config.js
module.exports = (env, argv) => ({
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, './dist-webpack')
  },
  resolve: {
    extensions: ['.tsx', '.jsx', '.ts', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: "automatic" }],
              '@babel/preset-typescript'
            ],
            plugins: argv.mode !== 'production' ? [require('react-refresh/babel')] : []
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: "automatic" }]
            ],
            plugins: argv.mode !== 'production' ? [require('react-refresh/babel')] : []
          }
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.svg$/,
        type: 'asset'
      }
    ]
  },
  devServer: {
    port: 8081,
    hot: true
  },
  devtool:
    argv.mode === 'production'
      ? false
      : 'eval-nosources-cheap-module-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.webpack.html'
    }),
    argv.mode !== 'production' && new ReactRefreshWebpackPlugin(),
    new MiniCssExtractPlugin()
  ],
  optimization: {
    minimizer: [
      '...',
      new CssMinimizerPlugin(),
    ]
  },

  experiments: {
    futureDefaults: true,
    css: false,
  },
  node: {
    global: false,
  },
})
