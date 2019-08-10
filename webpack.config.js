const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
  devServer: {
    // Needed for viewing in IE11 on VM
    host: '0.0.0.0'
  },
  entry: './client.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'client.js'),
        ],
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              [
                "@babel/transform-runtime",
                {
                  regenerator: true
                }
              ]
            ],
            presets: [
              [
                "@babel/preset-env",
                {
                  modules: false,
                  targets: {
                    ie: "11"
                  }
                }
              ]
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new OpenBrowserPlugin()
  ]
};
