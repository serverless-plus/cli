import { sleep } from '@ygkit/request';
import { CodingCI } from '../../src';

describe('Coding CI', () => {
  const ci = new CodingCI({
    secretId: process.env.TENCENT_SECRET_ID as string,
    secretKey: process.env.TENCENT_SECRET_KEY as string,
  });

  const credentialEnvs = [
    {
      Name: 'TENCENT_SECRET_ID',
      Value: process.env.TENCENT_SECRET_ID as string,
      Sensitive: true,
    },
    {
      Name: 'TENCENT_SECRET_KEY',
      Value: process.env.TENCENT_SECRET_KEY as string,
      Sensitive: true,
    },
  ];

  let projectId: number;
  let gitJobId: number;
  let buildId: number;

  it('[createProjectWithTemplate] should create project with template success', async () => {
    const req = await ci.createProjectWithTemplate({
      name: 'slsplus-cli-test',
      alias: 'slsplus-cli-test',
      description: 'ci test',
    });
    expect(req).toEqual({
      ProjectId: expect.any(Number),
      RequestId: expect.any(String),
    });

    projectId = req.ProjectId;
  });

  it('[createCodingCIJob] should create project job success', async () => {
    const req = await ci.createCodingCIJob({
      jobName: 'slsplus-cli-test-git',
      projectId,
      envs: credentialEnvs,
      parseOptions: {
        slsOptions: {
          org: 'orgDemo',
          app: 'appDemo',
          stage: 'dev',
          component: 'express',
          name: 'expressDemoUsingGit',
          inputs: {
            src: { src: './', exclude: ['.env', 'node_modules/**'] },
            apigatewayConf: { protocols: ['http', 'https'] },
          },
        },
        layerOptions: {
          org: 'orgDemo',
          app: 'appDemo',
          stage: 'dev',
          runtime: 'Nodejs10.15',
        },
      },
      needDeployLayer: true,
      useGit: true,
      gitBranch: 'dev',
    });
    expect(req).toEqual({
      Data: {
        Id: expect.any(Number),
      },
      RequestId: expect.any(String),
    });

    gitJobId = req.Data.Id;
  });

  it('[triggerCodingCIBuild] should trigger ci build success', async () => {
    const req = await ci.triggerCodingCIBuild({
      jobId: gitJobId,
      envs: [
        {
          Name: 'CODE_URL',
          Value: process.env.CODE_URL_GIT as string,
          Sensitive: false,
        },
      ],
    });
    expect(typeof req.RequestId).toBe('string');
    expect(typeof req.Data.Build.Id).toBe('number');
    expect(req.Data.Build.JobId).toBe(gitJobId);

    buildId = req.Data.Build.Id;
  });

  it('[describeCodingCIBuildStage] should get build stage result success', async () => {
    // wait for ci start
    await sleep(1000);
    const req = await ci.describeCodingCIBuildStage(buildId);
    expect(req).toEqual({
      Data: {
        StageJsonString: expect.any(String),
      },
      RequestId: expect.any(String),
    });
  });

  it('[describeCodingCIBuildLog] should get build log result success', async () => {
    // wait for ci start
    await sleep(1000);
    const req = await ci.describeCodingCIBuildLog(buildId);
    expect(req).toEqual({
      Data: {
        Log: expect.any(String),
        MoreData: expect.any(Boolean),
        TextDelivered: expect.any(Number),
        TextSize: expect.any(Number),
      },
      RequestId: expect.any(String),
    });
  });
});
