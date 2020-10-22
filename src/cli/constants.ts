import { join } from 'path';
import { homedir } from 'os';
import { Credential } from '../typings';

const configPath = join(homedir(), '.slsplus.conf');

const getCredential = (): Credential | null => {
  const { TENCENT_SECRET_ID, TENCENT_SECRET_KEY } = process.env;
  if (TENCENT_SECRET_ID && TENCENT_SECRET_KEY) {
    return {
      secretId: TENCENT_SECRET_ID,
      secretKey: TENCENT_SECRET_KEY,
    };
  }
  return null;
};

export { configPath, getCredential };
