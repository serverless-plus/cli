import YAML from 'js-yaml';
import fse from 'fs-extra';
import chalk from 'chalk';
import { configPath, getCredential } from './constants';

async function initialize(): Promise<void> {
  try {
    const configs = YAML.load(fse.readFileSync(configPath, 'utf-8'));
    process.env.TENCENT_SECRET_ID = configs.tencent.secretId;
    process.env.TENCENT_SECRET_KEY = configs.tencent.secretKey;
  } catch (e) {
    const credentials = getCredential();
    if (!credentials) {
      console.log(
        chalk.yellow(`[Warning] Missing Global credentials, run "slsplus config" to config.`),
      );
    }
  }
}

export { initialize };
