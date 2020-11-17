import { program } from 'commander';
import { invoke } from './invoke';
import { warm } from './warm';
import { logs } from './logs';

const faasCommand = (): void => {
  const cli = program.command('faas').description('Operation for faas');
  cli
    .command('warm')
    .description('Warm up faas')
    .option('-r, --region [region]', 'region of function', 'ap-guangzhou')
    .option('-n, --name [name]', 'function name')
    .option('-ns, --namespace [namespace]', 'namespace', 'default')
    .option('-q, --qualifier [qualifier]', 'function version', '$LATEST')
    .action((options) => {
      warm({
        type: 'function',
        ...options,
      });
    });

  cli
    .command('invoke')
    .description('Invoke faas')
    .option('-r, --region [region]', 'region of function', 'ap-guangzhou')
    .option('-n, --name [name]', 'function name')
    .option('-ns, --namespace [namespace]', 'namespace', 'default')
    .option('-q, --qualifier [qualifier]', 'function version', '$LATEST')
    .option('-e, --event [event]', 'event json for invoking function')
    .option('-o, --output', 'output invoke result to invoke.log file', false)
    .action((options) => {
      invoke(options);
    });

  cli
    .command('logs')
    .description('Get faas logs')
    .option('-r, --region [region]', 'region of function', 'ap-guangzhou')
    .option('-n, --name [name]', 'function name')
    .option('-ns, --namespace [namespace]', 'namespace', 'default')
    .option('-q, --qualifier [qualifier]', 'function version', '$LATEST')
    .option('-l, --limit [limit]', 'get function logs count')
    .option('-o, --output', 'output invoke result to invoke.log file', false)
    .action((options) => {
      logs(options);
    });
};

export { invoke, warm, logs, faasCommand };
