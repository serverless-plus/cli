import { program } from 'commander';
import { invoke } from './invoke';
import { warm } from './warm';
import { logs } from './logs';

const faasCommand = (): void => {
  const cli = program.command('faas');
  cli
    .command('warm')
    .description('Warm up faas')
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
    .command('warm-app')
    .description('Warm up serverless application')
    .option('-n, --name [name]', 'name config in serverless.yml')
    .option('-a, --app [app]', 'app name')
    .option('-s, --stage [stage]', 'app stage', 'dev')
    .action((options) => {
      warm({
        type: 'app',
        ...options,
      });
    });

  cli
    .command('invoke')
    .description('Invoke faas')
    .option('-n, --name [name]', 'function name')
    .option('-ns, --namespace [namespace]', 'namespace', 'default')
    .option('-q, --qualifier [qualifier]', 'function version', '$LATEST')
    .option('-e, --event [event]', 'event json for invoking function')
    .option('-o, --output', 'output invoke result to invoke.log file', false)
    .action((options) => {
      invoke({
        name: options.name,
        namespace: options.namespace,
        qualifier: options.qualifier,
        context: options.event || JSON.stringify({}),
        output: options.output,
      });
    });

  cli
    .command('logs')
    .description('Get faas logs')
    .option('-n, --name [name]', 'function name')
    .option('-ns, --namespace [namespace]', 'namespace', 'default')
    .option('-q, --qualifier [qualifier]', 'function version', '$LATEST')
    .option('-l, --limit [limit]', 'get function logs count')
    .option('-o, --output', 'output invoke result to invoke.log file', false)
    .action((options) => {
      logs({
        name: options.name,
        namespace: options.namespace,
        qualifier: options.qualifier,
        limit: options.limit,
        output: options.output,
      });
    });
};

export { invoke, warm, logs, faasCommand };
