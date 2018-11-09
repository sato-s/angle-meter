module.exports = {
  devtool: "source-map",
  performance: { hints: false },
  output: {
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
    ]
  },
}
