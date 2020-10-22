import ora from 'ora';
import chalk from 'chalk';
import { join } from 'path';
import fse from 'fs-extra';
import assert from 'assert';
import { program } from 'commander';
import { Faas } from '../components/faas';
import { Credential, InvokeOptions, WarmOptions } from '../typings';

function getCredential(): Credential | null {
  const { TENCENT_SECRET_ID, TENCENT_SECRET_KEY } = process.env;
  if (TENCENT_SECRET_ID && TENCENT_SECRET_KEY) {
    return {
      secretId: TENCENT_SECRET_ID,
      secretKey: TENCENT_SECRET_KEY,
    };
  }
  return null;
}

async function warm(options: WarmOptions): Promise<void> {
  const credential = getCredential();
  if (credential) {
    const faas = new Faas(credential);
    const spinner = ora();
    try {
      assert(options.name, '[OPTIONS] name is required');
      if (options.type === 'app') {
        assert(options.app, '[OPTIONS] app is required');
        spinner.start(
          `Warming up application ${options.app}, stage ${options.stage}, name ${options.name}`,
        );
        await faas.warmUpByApp(options);
      } else {
        spinner.start(
          `Warming up functtion ${options.name}, qualifier ${options.qualifier}, namespace ${options.namespace}`,
        );
        await faas.warmUp(options);
      }
      spinner.succeed('Warm up success');
    } catch (e) {
      spinner.fail(e.message);
    }
  } else {
    console.log(chalk.red(`Missing credential information!`));
  }
}

interface CliInvokeOptions extends InvokeOptions {
  output?: boolean;
}

async function invoke(options: CliInvokeOptions): Promise<void> {
  const credential = getCredential();
  if (credential) {
    const faas = new Faas(credential);
    const spinner = ora();
    try {
      assert(options.name, '[OPTIONS] fname is required');
      spinner.start(
        `Invoking functtion ${options.name}, qualifier ${options.qualifier}, namespace ${options.namespace}`,
      );
      const res = await faas.invoke(options);
      spinner.succeed('Invoke success');
      if (options.output) {
        const opPath = join(process.cwd(), 'invoke.log');
        fse.outputFileSync(opPath, `${new Date().toISOString()}: ${JSON.stringify(res)}`);
        console.log(chalk.green(`\Output invoke reault to file path ${opPath}\n`));
      } else {
        console.log(chalk.green('\nInvoke Result:\n'));
        console.log(chalk.yellow(JSON.stringify(res, null, 2)));
      }
    } catch (e) {
      spinner.fail(e.message);
    }
  } else {
    console.log(chalk.red(`Missing credential information!`));
  }
}

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
    .option('-f, --fname [fname]', 'function name')
    .option('-n, --namespace [namespace]', 'namespace', 'default')
    .option('-q, --qualifier [qualifier]', 'function version', '$LATEST')
    .option('-e, --event [event]', 'event json for invoking function')
    .option('-o, --output', 'output invoke result to invoke.log file', false)
    .action((options) => {
      invoke({
        name: options.fname,
        namespace: options.namespace,
        qualifier: options.qualifier,
        context: options.event || JSON.stringify({}),
        output: options.output,
      });
    });
};

export { invoke, warm, faasCommand };
