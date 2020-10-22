import { spawn } from 'child_process';
import ora from 'ora';
import { program } from 'commander';

export function clone(source: string, dest: string): void {
  const spinner = ora().start('Start cloning git project...\n');
  const cloneParams = ['clone', source];
  if (dest) {
    cloneParams.push(dest);
  }
  const gitClone = spawn(`git`, cloneParams, {
    cwd: process.cwd(),
  });
  let errMsg = '';
  gitClone.stderr.on('data', (data) => {
    errMsg += data.toString();
  });
  gitClone.on('close', (status) => {
    if (status === 0) {
      spinner.succeed(`Clone project success`);
    } else {
      spinner.fail(errMsg);
    }
  });
}

const cloneCommand = (): void => {
  program
    .command('clone <source> [destination]')
    .description('clone a repository into a newly created directory')
    .action((source, destination) => {
      clone(source, destination);
    });
};

export { cloneCommand };
