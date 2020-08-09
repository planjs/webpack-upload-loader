import { getOptions, interpolateName } from 'loader-utils';
import * as validateOptions from 'schema-utils';
import * as ora from 'ora';
import * as colors from 'colors';

import * as schema from './options.json';

interface UploadParams {
  fileName: string;
  resourcePath: string;
  source: string;
}

interface webpackUploadLoaderOptions {
  esModule?: boolean;
  include?: string[];
  exclude?: string[];
  upload?: (params: UploadParams) => Promise<string>;
  debug?: boolean;
}

function includeArr(arr: string[], p: string) {
  return arr.map(p => new RegExp(p, 'gi')).some(v => v.test(p));
}

function webpackUploadLoader(source, map, meta) {
  const callback = this.async();

  const options = (getOptions(this) || {}) as webpackUploadLoaderOptions;

  validateOptions(schema as any, options, {
    name: 'Upload Loader',
    baseDataPath: 'options',
  });

  const { esModule = true, include, exclude, debug = false, upload } = options;

  const { resourcePath, rootContext } = this;

  const fileName = interpolateName(this, '[contenthash].[ext][query]', {
    context: resourcePath,
    content: source,
  });

  const defaultReturn = () => {
    callback(null, source, map, meta);
  };

  if (exclude && includeArr(exclude, resourcePath)) {
    return defaultReturn();
  }

  if (include && includeArr(include, resourcePath)) {
    console.log(resourcePath, fileName);
    const spinner = ora(
      `uploading file: ${colors.green(`${fileName}`)} local: ${resourcePath.replace(
        rootContext,
        ''
      )}`
    ).start();
    upload
      .call(this, {
        fileName,
        resourcePath,
        source,
      })
      .then(url => {
        spinner.succeed(`uploaded to: ${url}`);
        callback(
          null,
          `${esModule ? 'export default' : 'module.exports ='} ${JSON.stringify(url)};`,
          map,
          meta
        );
      })
      .catch(err => {
        spinner.clear();
        this.emitError(`${resourcePath} upload error: ${err?.toString()}`);
      });
  } else {
    defaultReturn();
  }
}

export default webpackUploadLoader;
