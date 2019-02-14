module.exports = {
  devtool: "source-map",
  performance: { hints: false },
  entry: './index.js',
  output: {
    filename: 'anglemeter.js',
    library: 'anglemeter',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        use: {
          loader: 'babel-loader',
        },
        exclude: /(node_modules|bower_components)/,
      },
      {
        test: /\.svg$/,
        use: {
          loader: 'url-loader'
        },
        exclude: /(node_modules|bower_components)/,
      }
    ]
  },
}
