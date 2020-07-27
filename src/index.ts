import { getOptions } from 'loader-utils';
import * as validateOptions from 'schema-utils';
import schema from './options.json';

function webpackUploadLoader(source, map, meta) {
  const options = getOptions(this) || {};

  validateOptions(schema, options, {
    name: 'webpack upload loader',
  });
  console.log(source);
}

export default webpackUploadLoader;
