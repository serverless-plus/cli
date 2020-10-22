import { join } from 'path';
import { homedir } from 'os';
import { Credential } from '../typings';

const configPath = join(homedir(), '.slsplus.conf');

const getCredential = (): Credential | null => {
  const { SLS_SECRET_ID, SLS_SECRET_KEY } = process.env;
  if (SLS_SECRET_ID && SLS_SECRET_KEY) {
    return {
      secretId: SLS_SECRET_ID,
      secretKey: SLS_SECRET_KEY,
    };
  }
  return null;
};

export { configPath, getCredential };
