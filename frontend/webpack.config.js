const path = require('path');

module.exports = {
  entry: './ts/main_editor.tsx',
  mode: 'development',
  output: {
    filename: 'main_editor.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};