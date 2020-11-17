import { program } from 'commander';
import { prompt } from 'inquirer';
import YAML from 'js-yaml';
import fse from 'fs-extra';
import chalk from 'chalk';
import { fileExist } from '../../utils';
import { configPath } from '../constants';

const questions = [
  {
    type: 'password',
    mask: '*',
    name: 'secretId',
    message: 'SecretId',
    validate(value: string) {
      if (value) {
        return true;
      }

      return 'Please enter a valid SecretId';
    },
  },
  {
    type: 'password',
    mask: '*',
    name: 'secretKey',
    message: 'SecretKey',
    validate(value: string) {
      if (value) {
        return true;
      }

      return 'Please enter a valid SecretKey';
    },
  },
];

export async function config(): Promise<void> {
  const answers = await prompt(questions);
  let newConfig = {
    tencent: {
      ...answers,
    },
  };
  if (fileExist(configPath)) {
    const oldConfig = YAML.load(fse.readFileSync(configPath, 'utf-8'));
    newConfig = Object.assign(oldConfig || {}, newConfig);
  }
  const content = YAML.dump(newConfig);
  fse.outputFileSync(configPath, content);

  console.log(chalk.green('Config credentials for slsplus cli success.'));
}

const configCommand = (): void => {
  program
    .command('config')
    .description('Config for slsplus cli')
    .action(() => {
      config();
    });
};

export { configCommand };
