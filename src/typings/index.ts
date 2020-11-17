export * from './ci';
export * from './parse';
export * from './instance';
export * from './faas';
export * from './migrate';

export interface AnyObject {
  [prodName: string]: any;
}

export interface Credential {
  secretId: string;
  secretKey: string;
  token?: string;
  region?: string;
}
