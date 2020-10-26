#!/usr/bin/env node

import { program } from 'commander';
import { initialize } from './initialize';
import { configCommand } from './config';
import { cloneCommand } from './clone';
import { parseCommand } from './parse';
import { faasCommand } from './faas';
import { appCommand } from './app';

// eslint-disable-next-line
const { version } = require('../../package.json');

async function run() {
  // init environment
  await initialize();

  program.storeOptionsAsProperties(false).passCommandToAction(false);
  program.version(`Slsplus CLI Version: ${version}`, '-v, --version', 'output the current version');

  // inject sub commands
  configCommand();
  cloneCommand();
  parseCommand();
  faasCommand();
  appCommand();

  program.on('--help', () => {
    console.log('');
    console.log('Example call:');
    console.log('  $ slsplus --help');
  });

  program.parse(process.argv);
}

run();
