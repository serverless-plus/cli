import { Capi } from '@tencent-sdk/capi';
import { Credential, Instance, GetInstanceRequest } from '../../typings';
import { request } from '../../apis';

class Sls {
  capi: Capi;
  constructor({ secretId, secretKey, token, region = 'ap-guangzhou' }: Credential) {
    this.capi = new Capi({
      SecretId: secretId,
      SecretKey: secretKey,
      Token: token,
      Region: region,
      ServiceType: 'sls',
      RequestClient: 'slsplus_instance',
      Version: '2020-02-05',
    });
  }

  async getInstance({
    app,
    stage = 'dev',
    name,
  }: GetInstanceRequest): Promise<Instance | undefined> {
    try {
      const { Body } = await request(this.capi, {
        Action: 'GetInstance',
        Body: JSON.stringify({
          stageName: stage,
          appName: app,
          instanceName: name,
        }),
      });

      return JSON.parse(JSON.parse(Body).body).instance;
    } catch (e) {
      console.log(e);
      return undefined;
    }
  }
}

export { Sls };
