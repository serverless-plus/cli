import { Capi } from '@tencent-sdk/capi';
import {
  Credential,
  WarmOptions,
  InvokeOptions,
  InvokeResponse,
  LogsOptions,
  TencentFaasLog,
} from '../../typings';
import { request } from '../../apis';
import { Sls } from '../sls';
import { GetEvent } from './events';

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
    await this.invoke({
      name,
      qualifier,
      namespace,
      context: JSON.stringify(GetEvent),
    });
    return true;
  }

  async warmUpByApp({ app = '', stage = 'dev', name }: WarmOptions): Promise<boolean> {
    // 1. get instance
    const sls = new Sls({
      secretId: this.capi.options.SecretId,
      secretKey: this.capi.options.SecretKey,
      token: this.capi.options.Token,
      region: this.capi.options.Region,
    });

    const instance = await sls.getInstance({
      app,
      stage,
      name,
    });

    const functionName = instance?.state?.lambdaArn as string;
    const qualifier = instance?.state?.lastVersion as string;
    const region = instance?.state?.region;
    const namespace = instance?.state[region]?.namespace;

    // 2. invoke function for warming up
    await this.invoke({
      name: functionName,
      qualifier,
      namespace,
      context: JSON.stringify(GetEvent),
    });
    return true;
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
