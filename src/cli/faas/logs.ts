import ora from 'ora';
import chalk from 'chalk';
import { join } from 'path';
import fse from 'fs-extra';
import assert from 'assert';
import { Faas } from '../../components/faas';
import { LogsOptions } from '../../typings';
import { fileExist } from '../../utils';
import { getCredential } from '../constants';

interface LogsCmdOptions extends LogsOptions {
  output?: boolean;
}

async function logs(options: LogsCmdOptions): Promise<void> {
  const credential = getCredential();

  if (credential) {
    const faas = new Faas(credential);
    const spinner = ora();
    try {
      assert(options.name, '[OPTIONS] name is required');
      spinner.start(
        `Getting log for functtion ${options.name}, qualifier ${options.qualifier}, namespace ${options.namespace}`,
      );
      const res = await faas.getLogs(options);
      spinner.succeed('Log success');
      if (options.output) {
        let content = '';
        res.forEach((item) => {
          content += `${item.StartTime} [reqId: ${item.RequestId}] ${JSON.stringify(item)}`;
        });
        const opPath = join(process.cwd(), 'run.log');
        if (fileExist(opPath)) {
          const oldContent = fse.readFileSync(opPath, 'utf-8');
          content = `${oldContent}\n${content}`;
        }
        fse.outputFileSync(opPath, content);
        console.log(chalk.green(`\Output log to file path ${opPath}\n`));
      } else {
        res.forEach((item) => {
          console.log(chalk.green(chalk.bold(`\n${item.StartTime}\n`)));
          console.log(chalk.yellow(`${item.Log}\n`));
          console.log(chalk.gray(`======================================`));
        });
      }
    } catch (e) {
      spinner.fail(e.message);
    }
  } else {
    console.log(chalk.red(`Missing credential information!`));
  }
}

export { logs };
