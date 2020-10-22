import ora from 'ora';
import chalk from 'chalk';
import assert from 'assert';
import { Faas } from '../../components/faas';
import { getCredential } from '../constants';
import { WarmOptions } from '../../typings';

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

export { warm };
