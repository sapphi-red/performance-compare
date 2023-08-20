const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const path = require('path');

const generateSwcOptions = (syntax, isProd) => ({
  jsc: {
    parser: {
      syntax,
      jsx: true,
      dynamicImport: true,
      privateMethod: true,
      functionBind: true,
      classPrivateProperty: true,
      exportDefaultFrom: true,
      exportNamespaceFrom: true,
      decorators: true,
      decoratorsBeforeExport: true,
      importMeta: true,
    },
    transform: {
      react: {
        runtime: "automatic",
        development: !isProd,
        refresh: !isProd,
      },
    },
  },
})

// webpack.config.js
module.exports = (env, argv) => ({
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, './dist-webpack-swc')
  },
  resolve: {
    extensions: ['.tsx', '.jsx', '.ts', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'swc-loader',
          options: generateSwcOptions('typescript', argv.mode === 'production'),
        },
        exclude: /node_modules/
      },
      {
        test: /\.jsx?$/,
        use: {
          loader: 'swc-loader',
          options: generateSwcOptions('ecmascript', argv.mode === 'production'),
        },
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
    port: 8082,
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
    minimize: argv.mode === 'production',
    minimizer: [
      new TerserPlugin({ minify: TerserPlugin.swcMinify }),
      new CssMinimizerPlugin(),
    ],
  },

  experiments: {
    futureDefaults: true,
    css: false,
  },
  node: {
    global: false,
  },
})
