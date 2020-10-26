import ora from 'ora';
import chalk from 'chalk';
import assert from 'assert';
import { Sls } from '../../components/sls';
import { getCredential } from '../constants';
import { WarmOptions } from '../../typings';

async function warm(options: WarmOptions): Promise<void> {
  const credential = getCredential();
  if (credential) {
    const spinner = ora();
    try {
      assert(options.name, '[OPTIONS] name is required');
      assert(options.app, '[OPTIONS] app is required');
      spinner.start(
        `Warming up application ${options.app}, stage ${options.stage}, name ${options.name}`,
      );
      const sls = new Sls({
        ...credential,
        region: options.region,
      });
      const isWarmUped = await sls.warmUp(options);

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
