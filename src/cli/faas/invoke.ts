import ora from 'ora';
import chalk from 'chalk';
import { join } from 'path';
import fse from 'fs-extra';
import assert from 'assert';
import { Faas } from '../../components/faas';
import { InvokeOptions } from '../../typings';
import { fileExist } from '../../utils';
import { getCredential } from '../constants';

interface CliInvokeOptions extends InvokeOptions {
  output?: boolean;
}

async function invoke(options: CliInvokeOptions): Promise<void> {
  const credential = getCredential();
  if (credential) {
    const faas = new Faas(credential);
    const spinner = ora();
    try {
      assert(options.name, '[OPTIONS] name is required');
      spinner.start(
        `Invoking functtion ${options.name}, qualifier ${options.qualifier}, namespace ${options.namespace}`,
      );
      const { context: inputEvent } = options;
      let eventJson = '';
      if (inputEvent) {
        try {
          eventJson = JSON.stringify(JSON.parse(inputEvent));
        } catch (e) {
          const eventJsonPath = join(process.cwd(), inputEvent);
          try {
            if (fileExist(eventJsonPath)) {
              const eventFileContent = fse.readFileSync(eventJsonPath, 'utf-8');
              try {
                JSON.parse(eventFileContent);
                eventJson = fse.readFileSync(eventJsonPath, 'utf-8');
              } catch (er) {
                spinner.fail(
                  `[OPTIONS] Invalid event parameter, need json file path or json string`,
                );
              }
            }
          } catch (err) {
            spinner.fail(`[OPTIONS] Invalid event parameter, need json file path or json string`);
          }
        }
      } else {
        eventJson = '{}';
      }
      options.context = eventJson;
      const res = await faas.invoke(options);
      spinner.succeed('Invoke success');
      if (options.output) {
        let content = `${new Date().toISOString()}: ${JSON.stringify(res)}`;
        const opPath = join(process.cwd(), 'invoke.log');
        if (fileExist(opPath)) {
          const oldContent = fse.readFileSync(opPath, 'utf-8');
          content = `${oldContent}\n${content}`;
        }
        fse.outputFileSync(opPath, content);
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

export { invoke };
