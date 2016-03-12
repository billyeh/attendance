module.exports = {
  entry: './src/App.js',
  output: {
    path: './static',
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      {
        exclude: /node_modules/, 
        loader: 'babel-loader?presets[]=es2015&presets[]=react',
      },
      {
        include: /\.json$/,
        loader: 'json-loader'
      },
      {
        include: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  }
}

