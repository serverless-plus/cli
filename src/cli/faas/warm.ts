import ora from 'ora';
import chalk from 'chalk';
import assert from 'assert';
import { Faas } from '../../components/faas';
import { getCredential } from '../constants';
import { WarmOptions } from '../../typings';

async function warm(options: WarmOptions): Promise<void> {
  const credential = getCredential();
  if (credential) {
    const spinner = ora();
    try {
      assert(options.name, '[OPTIONS] name is required');
      spinner.start(
        `Warming up functtion ${options.name}, qualifier ${options.qualifier}, namespace ${options.namespace}`,
      );
      const faas = new Faas({
        ...credential,
        region: options.region,
      });
      const isWarmUped = await faas.warmUp(options);
      if (isWarmUped) {
        spinner.succeed('Warm up success');
      } else {
        spinner.stop();
      }
    } catch (e) {
      spinner.fail(e.message);
    }
  } else {
    console.log(chalk.red(`Missing credential information!`));
  }
}

export { warm };
