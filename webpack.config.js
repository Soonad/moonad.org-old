const path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader')

module.exports = {
  entry: './src/index.ts',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  mode: 'development',
  devtool: 'source-map',
  module: {rules: [
    {
      test: /\.tsx?$/,
      loader: 'awesome-typescript-loader'
    },
    {
      test: /\.(png|svg|jpg|gif)$/,
      use: [
        'file-loader',
      ],
    },
  ]},
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'docs')
  },
  plugins: [
      new CheckerPlugin()
  ],
  watch: true
};
