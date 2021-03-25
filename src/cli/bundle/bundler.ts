import { join } from 'path';
import { rollup, InputOptions, OutputOptions } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';

import { spinner } from '../../spinner';
import { cwdDir } from '../../utils';

import { DEFAULT_BUNDLE_FILE } from './constants';

export interface BundleOptions {
  input: string;
  file?: string;
  dir?: string;
  sourcemap?: boolean;
  // ts?: boolean;
}

export async function bundler(options: BundleOptions) {
  spinner.start(`Start bundle project...`);
  if (!options.input) {
    spinner.fail(`Entry file is required.`);
    return;
  }
  const inputFile = options.input;
  const inputFilePath = join(cwdDir, inputFile);
  const inputOptions: InputOptions = {
    input: inputFilePath,
    // ignore warning
    onwarn: () => {
      return;
    },
    plugins: [
      commonjs({ extensions: ['.js', '.ts'] }),
      nodeResolve({
        // prefer module in user's package.json
        preferBuiltins: false,
      }),
      json(),
    ],
  };

  const bundle = await rollup(inputOptions);

  const outputOptions: OutputOptions = {
    format: 'cjs',
    sourcemap: options.sourcemap === true,
  };
  if (options.dir) {
    const outputDir = join(cwdDir, options.dir);
    outputOptions.dir = outputDir;
  } else {
    let outputFile = DEFAULT_BUNDLE_FILE;
    if (options.file) {
      outputFile = options.file;
    }
    const outputFilePath = join(cwdDir, outputFile);
    outputOptions.file = outputFilePath;
  }
  await bundle.write(outputOptions);

  spinner.succeed('Build success');
}
