import { spawn } from 'child_process';
import ora from 'ora';

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
