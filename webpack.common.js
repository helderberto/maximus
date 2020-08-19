const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: {
    maximus: path.resolve(__dirname, 'src', 'index.js'),
  },
  output: {
    filename: '[name].js', // maximus.js
    path: path.resolve(__dirname, 'dist'),
    library: 'maximus',
    libraryTarget: 'umd',
  },
  plugins: [new CleanWebpackPlugin()],
}
