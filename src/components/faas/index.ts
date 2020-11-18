import { Capi } from '@tencent-sdk/capi';
import chalk from 'chalk';
import {
  Credential,
  WarmOptions,
  InvokeOptions,
  InvokeResponse,
  LogsOptions,
  TencentFaasLog,
} from '../../typings';
import { GetEvent } from './events';
import { TAPI } from '../../apis';

const { request } = TAPI;

class Faas {
  capi: Capi;
  constructor({ secretId, secretKey, token, region = 'ap-guangzhou' }: Credential) {
    this.capi = new Capi({
      SecretId: secretId,
      SecretKey: secretKey,
      Token: token,
      Region: region,
      ServiceType: 'scf',
      RequestClient: 'slsplus_faas',
      Version: '2018-04-16',
    });
  }

  async invoke({
    name,
    namespace = 'default',
    qualifier = '$LATEST',
    type = 'RequestResponse',
    context,
  }: InvokeOptions): Promise<InvokeResponse> {
    const { Result } = await request(this.capi, {
      Action: 'Invoke',
      FunctionName: name,
      Qualifier: qualifier,
      Namespace: namespace,
      InvocationType: type,
      ClientContext: context,
    });

    return JSON.parse(Result?.RetMsg);
  }

  async warmUp({
    name,
    namespace = 'default',
    qualifier = '$LATEST',
  }: WarmOptions): Promise<boolean> {
    try {
      await this.invoke({
        name,
        qualifier,
        namespace,
        context: JSON.stringify(GetEvent),
      });
      return true;
    } catch (e) {
      chalk.yellow(`\n[Warning] Faas invoke fail: ${e.message}`);
    }
    return false;
  }

  async getLogs({
    name,
    namespace = 'default',
    qualifier = '$LATEST',
    limit = 15,
    reqId,
  }: LogsOptions): Promise<TencentFaasLog[]> {
    const { Data } = await request(this.capi, {
      Action: 'GetFunctionLogs',
      FunctionName: name,
      Qualifier: qualifier,
      Namespace: namespace,
      Offset: 0,
      Limit: limit,
      FunctionRequestId: reqId,
    });
    return Data;
  }
}

export { Faas };
