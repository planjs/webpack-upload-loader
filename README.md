# webpack-upload-loader

The `webpack-upload-loader` resolves `import`/`require()` on a file into a remote address

## Getting Started

To begin, you'll need to install `webpack-upload-loader`:

```console
$ npm install webpack-upload-loader --save-dev
```

Import (or `require`) the target file(s) in one of the bundle's files:

**file.js**

```js
import img from './assets/logo.png';
```

Then add the loader to your `webpack` config. For example:

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'webpack-upload-loader',
          },
        ],
      },
    ],
  },
};
```

> ℹ️ The current loader must be executed before `file-loader` and `url-loader`

## Options

### `esModule`

Type: `Boolean`
Default: `true`

By default, `webpack-upload-loader` generates JS modules that use the ES modules syntax.
There are some cases in which using ES modules is beneficial, like in the case of [module concatenation](https://webpack.js.org/plugins/module-concatenation-plugin/) and [tree shaking](https://webpack.js.org/guides/tree-shaking/).

You can enable a CommonJS module syntax using:

**webpack.config.js**

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: true,
            },
          },
        ],
      },
    ],
  },
};
```
