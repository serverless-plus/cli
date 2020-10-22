#!/usr/bin/env node

import { program } from 'commander';
import { cloneCommand } from './clone';
import { parseCommand } from './parse';
import { faasCommand } from './faas';

import pkg from '../../package.json';

async function run() {
  program.storeOptionsAsProperties(false).passCommandToAction(false);
  program.version(
    `Slsplus CLI Version: ${pkg.version}`,
    '-v, --version',
    'output the current version',
  );

  // inject sub commands
  cloneCommand();
  parseCommand();
  faasCommand();

  program.on('--help', () => {
    console.log('');
    console.log('Example call:');
    console.log('  $ slsplus --help');
  });

  program.parse(process.argv);
}

run();
