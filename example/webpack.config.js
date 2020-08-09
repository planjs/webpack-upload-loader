const path = require('path');

module.exports = {
  mode: 'development',
  context: __dirname,
  entry: './example.js',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '',
    filename: 'bundle.js',
  },
  devtool: false,
  module: {
    rules: [
      {
        test: /\.png$/,
        loader: path.resolve(__dirname, '../lib'),
        options: {
          include: [path.resolve('assets/')],
          exclude: [path.resolve('assets/exclude')],
          upload: res => {
            return Promise.resolve('https://www.baidu.com');
          },
        },
      },
      {
        test: /\.png$/,
        loader: 'file-loader',
        options: {
          name: 'exclude/[contenthash].[ext]',
        },
      },
    ],
  },
};
