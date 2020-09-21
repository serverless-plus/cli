#!/usr/bin/env node

import { program } from 'commander';
import { clone, parse } from './index';

import pkg from '../../package.json';

async function main() {
  program.version(
    `Slsplus CLI Version: ${pkg.version}`,
    '-v, --version',
    'output the current version',
  );
  program
    .command('clone <source> [destination]')
    .description('clone a repository into a newly created directory')
    .action((source, destination) => {
      clone(source, destination);
    });

  program
    .command('parse')
    .description(
      'parse serverless config file with costomize and environment variables replacement',
    )
    .option('-i, --input [input]', 'source serverless config file path')
    .option('-o, --output', 'whether output parse result to input serverless config file', false)
    .option(
      '-O, --output-path [outputPath]',
      'output parse result to target serverless config file path',
    )
    .option('-r, --root [rootDir]', 'root directory for parse command running')
    .option('-rv, --replace-vars [replaceVars]', 'json string of variables need to be replaced')
    .action((options) => {
      parse({
        rootDir: options.rootDir,
        input: options.input,
        output: options.output,
        outputPath: options.outputPath,
        replaceVars: options.replaceVars,
      });
    });

  program.on('--help', () => {
    console.log('');
    console.log('Example call:');
    console.log('  $ slsplus --help');
  });

  program.parse(process.argv);
}

main();
