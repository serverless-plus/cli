import { program } from 'commander';
import { warm } from './warm';

const appCommand = (): void => {
  const cli = program.command('app').description('Operation for serverless application');

  cli
    .command('warm')
    .description('Warm up serverless application')
    .option('-r, --region [region]', 'region of function', 'ap-guangzhou')
    .option('-n, --name [name]', 'name config in serverless.yml')
    .option('-a, --app [app]', 'app name')
    .option('-s, --stage [stage]', 'app stage', 'dev')
    .action((options) => {
      warm({
        type: 'app',
        ...options,
      });
    });
};

export { appCommand };
