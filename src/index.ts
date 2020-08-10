import { getOptions, interpolateName } from 'loader-utils';
import * as validateOptions from 'schema-utils';
import * as ora from 'ora';
import * as colors from 'colors';
import * as mime from 'mime-types';
import * as path from 'path';

import * as schema from './options.json';

interface UploadParams {
  fileName: string;
  resourcePath: string;
  source: string;
  mimetype: string;
}

interface webpackUploadLoaderOptions {
  esModule?: boolean;
  include?: string[];
  exclude?: string[];
  mimetype?: string | boolean;
  upload?: (params: UploadParams) => Promise<string>;
  debug?: boolean;
}

function includeArr(arr: string[], p: string) {
  return arr.map(p => new RegExp(p, 'gi')).some(v => v.test(p));
}

function getMimetype(mimetype: string | boolean, resourcePath: string): string {
  if (typeof mimetype === 'boolean') {
    if (mimetype) {
      const resolvedMimeType = mime.contentType(path.extname(resourcePath));

      if (!resolvedMimeType) {
        return '';
      }

      return resolvedMimeType.replace(/;\s+charset/i, ';charset');
    }

    return '';
  }

  if (typeof mimetype === 'string') {
    return mimetype;
  }

  const resolvedMimeType = mime.contentType(path.extname(resourcePath));

  if (!resolvedMimeType) {
    return '';
  }

  return resolvedMimeType.replace(/;\s+charset/i, ';charset');
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

  const defaultCallback = () => {
    callback(null, source, map, meta);
  };

  if (exclude && includeArr(exclude, resourcePath)) {
    return defaultCallback();
  }

  if (include && includeArr(include, resourcePath)) {
    const mimetype = getMimetype(options.mimetype, resourcePath);
    const fileName = interpolateName(this, '[contenthash].[ext][query]', {
      context: resourcePath,
      content: source,
    });
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
        mimetype,
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
    defaultCallback();
  }
}

export default webpackUploadLoader;
