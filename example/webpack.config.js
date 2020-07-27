const path = require('path');

module.exports = {
  mode: 'production',
  context: __dirname,
  entry: './example.js',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '',
    filename: 'bundle.js',
  },
  module: {
    rules: [
      { test: /\.png$/, loader: 'file-loader' },
      {
        test: /\.js|.jsx|.ts|.tsx|.scss|.less|.css|.styl?$/,
        loader: path.resolve(__dirname, '../lib'),
        options: {
          include: [],
        },
      },
    ],
  },
};
