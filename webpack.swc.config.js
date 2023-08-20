const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const generateSwcOptions = (syntax) => ({
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
        refresh: true,
      },
    },
  },
})

// webpack.config.js
module.exports = {
  entry: './src/index.tsx',
  resolve: {
    extensions: ['.tsx', '.jsx', '.ts', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'swc-loader',
          options: generateSwcOptions('typescript'),
        },
        exclude: /node_modules/
      },
      {
        test: /\.jsx?$/,
        use: {
          loader: 'swc-loader',
          options: generateSwcOptions('ecmascript'),
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
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
  devtool: 'eval-nosources-cheap-module-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.webpack.html'
    }),
    new ReactRefreshWebpackPlugin()
  ],

  experiments: {
    futureDefaults: true,
    css: false,
  },
  node: {
    global: false,
  },
}
