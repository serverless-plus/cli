#!/usr/bin/env node

const { program } = require('commander');
const pkg = require('../package.json');
const { clone } = require('../dist/cli/clone');

async function main() {
  program
    .version(`Coding CLI Version: ${pkg.version}`, '-v, --version', 'output the current version')
    .command('clone <source> [destination]')
    .description('clone a repository into a newly created directory')
    .action((source, destination) => {
      clone(source, destination);
    });

  program.on('--help', () => {
    console.log('');
    console.log('Example call:');
    console.log('  $ coding --help');
  });

  program.parse(process.argv);
}

main();
