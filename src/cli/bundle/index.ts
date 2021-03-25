import { program } from 'commander';
import { bundler } from './bundler';

const bundleCommand = (): void => {
  program
    .command('bundle')
    .description('Bundle your project into one file')
    .requiredOption('-i, --input <input>', 'Entry file')
    .option('-f, --file <file>', 'Output filename')
    .option('-d, --dir <dir>', 'Output directory')
    // .option('-ts, --ts', 'Whether entry file is typescript')
    .action((options) => {
      bundler(options);
    });
};

export { bundleCommand };
