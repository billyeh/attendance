var webpack = require('webpack');

module.exports = {
  entry: './src/app/App.js',
  output: {
    path: './static',
    filename: 'bundle.js'
  },
  plugins:[
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress:{
        warnings: true
      }
    })
  ],
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

