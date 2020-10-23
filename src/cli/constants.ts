import { join } from 'path';
import { homedir } from 'os';
import { Credential } from '../typings';

const configPath = join(homedir(), '.slsplus.conf');

const getCredential = (): Credential | null => {
  const { TENCENT_SECRET_ID, TENCENT_SECRET_KEY, TENCENT_SECRET_TOKEN } = process.env;
  if (TENCENT_SECRET_ID && TENCENT_SECRET_KEY) {
    return {
      secretId: TENCENT_SECRET_ID,
      secretKey: TENCENT_SECRET_KEY,
      token: TENCENT_SECRET_TOKEN,
    };
  }
  return null;
};

export { configPath, getCredential };
