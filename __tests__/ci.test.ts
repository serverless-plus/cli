import { sleep } from '@ygkit/request';
import { CodingCI } from '../src';
import {
  createProjectWithTemplateReq,
  createCodingCIJobReq,
  triggerCodingCIBuildReq,
  describeCodingCIBuildStageReq,
  describeCodingCIBuildLogReq,
} from '../src/ci/actions';

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
  let cosJobId: number;
  let gitJobId: number;
  let buildId: number;

  it('[createProjectWithTemplateReq] should get right request data', async () => {
    const req = createProjectWithTemplateReq({
      name: 'slsplus-cli-test',
      alias: 'slsplus-cli-test',
      description: 'slsplus cli test',
    });
    expect(req).toEqual({
      Name: 'slsplus-cli-test',
      DisplayName: 'slsplus-cli-test',
      GitReadmeEnabled: true,
      VcsType: 'git',
      Shared: 0,
      ProjectTemplate: 'DEV_OPS',
      GitIgnore: 'no',
      Description: 'slsplus cli test',
      CreateSvnLayout: false,
      Invisible: false,
      Label: 'SLS',
    });
  });

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

  it('[createCodingCIJobReq] should get right request data', async () => {
    const req = createCodingCIJobReq({
      jobName: 'slsplus-cli-test',
      projectId,
      envs: credentialEnvs,
    });
    expect(req).toEqual({
      ProjectId: projectId,
      Name: 'slsplus-cli-test',
      ExecuteIn: 'CVM',
      TriggerMethodList: ['REF_CHANGE', 'MR_CHANGE'],
      HookType: 'DEFAULT',
      JenkinsFileFromType: 'STATIC',
      JenkinsFileStaticContent:
        "pipeline {\n  agent any\n\n  stages {\n    stage(\"Initializing node.js environment\") {\n      steps {\n        sh 'env'\n        sh 'date'\n        sh 'echo TENCENT_SECRET_ID=$TENCENT_SECRET_ID > .env'\n        sh 'echo TENCENT_SECRET_KEY=$TENCENT_SECRET_KEY >> .env'\n        sh 'echo TENCENT_TOKEN=$TENCENT_TOKEN >> .env'\n        sh 'echo SERVERLESS_PLATFORM_VENDOR=tencent >> .env'\n        sh 'echo SERVERLESS_PLATFORM_STAGE=$SERVERLESS_PLATFORM_STAGE >> .env'\n        sh '''cat > npm.sh << EOF\r\n#! /bin/bash\r\nrootPath=\\\\`pwd\\\\`\r\nfunction read_dir(){\r\n  for file in \\\\`ls \\\\$1\\\\`\r\n  do\r\n    if [ -d \\\\$1'/'\\\\$file ]; then\r\n      if [ \\\\$file != 'node_modules' ]; then\r\n        read_dir \\\\$1'/'\\\\$file\r\n      fi\r\n    else\r\n      if [ \\\\$file = 'package.json' ]; then\r\n        cd \\\\$1\r\n        npm install\r\n        cd \\\\$rootPath\r\n      fi\r\n    fi\r\n  done\r\n}\r\nread_dir \\\\$1\r\nEOF'''\n        sh 'cat npm.sh && ls -la'\n      }\n    }\n\n    stage(\"Installing serverless cli\") {\n      steps {\n        sh 'npm config ls'\n        sh 'npm set registry https://registry.npmjs.org/'\n        sh 'npm install -g serverless'\n        sh 'sls -v'\n      }\n    }\n\n    stage(\"Downloading code\") {\n      steps {\n        sh 'wget $CODE_URL -O code.zip'\n        sh 'ls -l && file code.zip'\n        sh 'unzip -n code.zip && rm code.zip'\n      }\n    }\n\n    stage(\"Installing dependencies\") {\n      steps {\n        sh 'chmod +x ./npm.sh && ./npm.sh `pwd` && rm npm.sh'\n      }\n    }\n\n    stage(\"Deploying serverless project\") {\n      steps {\n        sh 'serverless deploy --debug'\n      }\n    }\n\n  }\n}\n",
      AutoCancelSameRevision: true,
      AutoCancelSameMergeRequest: true,
      TriggerRemind: 'ALWAYS',
      JobFromType: 'SERVERLESS',
      DepotType: 'NONE',
      DepotId: 0,
      EnvList: credentialEnvs,
    });
  });

  it('[createCodingCIJobReq] should get right request data with parseOptions.slsOptions', async () => {
    const req = createCodingCIJobReq({
      jobName: 'slsplus-cli-test',
      projectId,
      envs: credentialEnvs,
      parseOptions: {
        slsOptions: {
          org: 'orgDemo',
          app: 'appDemo',
          stage: 'dev',
          component: 'express',
          name: 'expressDemo',
          inputs: {
            src: './',
          },
        },
      },
    });

    expect(req).toEqual({
      ProjectId: projectId,
      Name: 'slsplus-cli-test',
      ExecuteIn: 'CVM',
      TriggerMethodList: ['REF_CHANGE', 'MR_CHANGE'],
      HookType: 'DEFAULT',
      JenkinsFileFromType: 'STATIC',
      JenkinsFileStaticContent:
        "pipeline {\n  agent any\n\n  stages {\n    stage(\"Initializing node.js environment\") {\n      steps {\n        sh 'env'\n        sh 'date'\n        sh 'echo TENCENT_SECRET_ID=$TENCENT_SECRET_ID > .env'\n        sh 'echo TENCENT_SECRET_KEY=$TENCENT_SECRET_KEY >> .env'\n        sh 'echo TENCENT_TOKEN=$TENCENT_TOKEN >> .env'\n        sh 'echo SERVERLESS_PLATFORM_VENDOR=tencent >> .env'\n        sh 'echo SERVERLESS_PLATFORM_STAGE=$SERVERLESS_PLATFORM_STAGE >> .env'\n        sh '''cat > npm.sh << EOF\r\n#! /bin/bash\r\nrootPath=\\\\`pwd\\\\`\r\nfunction read_dir(){\r\n  for file in \\\\`ls \\\\$1\\\\`\r\n  do\r\n    if [ -d \\\\$1'/'\\\\$file ]; then\r\n      if [ \\\\$file != 'node_modules' ]; then\r\n        read_dir \\\\$1'/'\\\\$file\r\n      fi\r\n    else\r\n      if [ \\\\$file = 'package.json' ]; then\r\n        cd \\\\$1\r\n        npm install\r\n        cd \\\\$rootPath\r\n      fi\r\n    fi\r\n  done\r\n}\r\nread_dir \\\\$1\r\nEOF'''\n        sh 'cat npm.sh && ls -la'\n      }\n    }\n\n    stage(\"Installing serverless cli\") {\n      steps {\n        sh 'npm config ls'\n        sh 'npm set registry https://registry.npmjs.org/'\n        sh 'npm install -g serverless'\n        sh 'sls -v'\n      }\n    }\n\n    stage(\"Downloading code\") {\n      steps {\n        sh 'wget $CODE_URL -O code.zip'\n        sh 'ls -l && file code.zip'\n        sh 'unzip -n code.zip && rm code.zip'\n      }\n    }\n\n    stage(\"Installing dependencies\") {\n      steps {\n        sh 'chmod +x ./npm.sh && ./npm.sh `pwd` && rm npm.sh'\n      }\n    }\n\n    stage(\"Processing serverless config files\") {\n      steps {\n        sh 'npm install -g @slsplus/cli'\n        sh 'slsplus parse --output --auto-create --sls-options=\\'{\"org\":\"orgDemo\",\"app\":\"appDemo\",\"stage\":\"dev\",\"component\":\"express\",\"name\":\"expressDemo\",\"inputs\":{\"src\":\"./\"}}\\' && cat serverless.yml'\n      }\n    }\n\n    stage(\"Deploying serverless project\") {\n      steps {\n        sh 'serverless deploy --debug'\n      }\n    }\n\n  }\n}\n",
      AutoCancelSameRevision: true,
      AutoCancelSameMergeRequest: true,
      TriggerRemind: 'ALWAYS',
      JobFromType: 'SERVERLESS',
      DepotType: 'NONE',
      DepotId: 0,
      EnvList: credentialEnvs,
    });
  });

  it('[createCodingCIJobReq] should get right request data with parseOptions.slsOptions && parseOptions.layerOptions', async () => {
    const req = createCodingCIJobReq({
      jobName: 'slsplus-cli-test',
      projectId,
      envs: credentialEnvs,
      parseOptions: {
        slsOptions: {
          org: 'orgDemo',
          app: 'appDemo',
          stage: 'dev',
          component: 'express',
          name: 'expressDemo',
          inputs: {
            src: './',
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
    });

    expect(req).toEqual({
      ProjectId: projectId,
      Name: 'slsplus-cli-test',
      ExecuteIn: 'CVM',
      TriggerMethodList: ['REF_CHANGE', 'MR_CHANGE'],
      HookType: 'DEFAULT',
      JenkinsFileFromType: 'STATIC',
      JenkinsFileStaticContent:
        "pipeline {\n  agent any\n\n  stages {\n    stage(\"Initializing node.js environment\") {\n      steps {\n        sh 'env'\n        sh 'date'\n        sh 'echo TENCENT_SECRET_ID=$TENCENT_SECRET_ID > .env'\n        sh 'echo TENCENT_SECRET_KEY=$TENCENT_SECRET_KEY >> .env'\n        sh 'echo TENCENT_TOKEN=$TENCENT_TOKEN >> .env'\n        sh 'echo SERVERLESS_PLATFORM_VENDOR=tencent >> .env'\n        sh 'echo SERVERLESS_PLATFORM_STAGE=$SERVERLESS_PLATFORM_STAGE >> .env'\n        sh '''cat > npm.sh << EOF\r\n#! /bin/bash\r\nrootPath=\\\\`pwd\\\\`\r\nfunction read_dir(){\r\n  for file in \\\\`ls \\\\$1\\\\`\r\n  do\r\n    if [ -d \\\\$1'/'\\\\$file ]; then\r\n      if [ \\\\$file != 'node_modules' ]; then\r\n        read_dir \\\\$1'/'\\\\$file\r\n      fi\r\n    else\r\n      if [ \\\\$file = 'package.json' ]; then\r\n        cd \\\\$1\r\n        npm install\r\n        cd \\\\$rootPath\r\n      fi\r\n    fi\r\n  done\r\n}\r\nread_dir \\\\$1\r\nEOF'''\n        sh 'cat npm.sh && ls -la'\n      }\n    }\n\n    stage(\"Installing serverless cli\") {\n      steps {\n        sh 'npm config ls'\n        sh 'npm set registry https://registry.npmjs.org/'\n        sh 'npm install -g serverless'\n        sh 'sls -v'\n      }\n    }\n\n    stage(\"Downloading code\") {\n      steps {\n        sh 'wget $CODE_URL -O code.zip'\n        sh 'ls -l && file code.zip'\n        sh 'unzip -n code.zip && rm code.zip'\n      }\n    }\n\n    stage(\"Installing dependencies\") {\n      steps {\n        sh 'chmod +x ./npm.sh && ./npm.sh `pwd` && rm npm.sh'\n      }\n    }\n\n    stage(\"Processing serverless config files\") {\n      steps {\n        sh 'npm install -g @slsplus/cli'\n        sh 'slsplus parse --output --auto-create --sls-options=\\'{\"org\":\"orgDemo\",\"app\":\"appDemo\",\"stage\":\"dev\",\"component\":\"express\",\"name\":\"expressDemo\",\"inputs\":{\"src\":\"./\"}}\\' && cat serverless.yml'\n        sh 'slsplus parse --output --auto-create --layer-options=\\'{\"org\":\"orgDemo\",\"app\":\"appDemo\",\"stage\":\"dev\",\"runtime\":\"Nodejs10.15\"}\\' && cat layer/serverless.yml'\n      }\n    }\n\n    stage(\"Deploying serverless project\") {\n      steps {\n        sh 'serverless deploy --debug --target=./layer'\n        sh 'serverless deploy --debug'\n      }\n    }\n\n  }\n}\n",
      AutoCancelSameRevision: true,
      AutoCancelSameMergeRequest: true,
      TriggerRemind: 'ALWAYS',
      JobFromType: 'SERVERLESS',
      DepotType: 'NONE',
      DepotId: 0,
      EnvList: credentialEnvs,
    });
  });

  it('[createCodingCIJob] should create project job success', async () => {
    const req = await ci.createCodingCIJob({
      jobName: 'slsplus-cli-test',
      projectId,
      envs: credentialEnvs,
      parseOptions: {
        slsOptions: {
          org: 'orgDemo',
          app: 'appDemo',
          stage: 'dev',
          component: 'express',
          name: 'expressDemo',
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
    });
    expect(req).toEqual({
      Data: {
        Id: expect.any(Number),
      },
      RequestId: expect.any(String),
    });

    cosJobId = req.Data.Id;
  });

  it('[triggerCodingCIBuildReq] should get right request data', async () => {
    const req = triggerCodingCIBuildReq({
      jobId: cosJobId,
      envs: [
        {
          Name: 'CODE_URL',
          Value: process.env.CODE_URL_COS as string,
          Sensitive: false,
        },
      ],
    });
    expect(req).toEqual({
      JobId: cosJobId,
      Revision: 'master',
      ParamList: [
        {
          Name: 'CODE_URL',
          Value: process.env.CODE_URL_COS as string,
          Sensitive: false,
        },
      ],
    });
  });

  it('[triggerCodingCIBuild] should trigger ci build success', async () => {
    const req = await ci.triggerCodingCIBuild({
      jobId: cosJobId,
      envs: [
        {
          Name: 'CODE_URL',
          Value: process.env.CODE_URL_COS as string,
          Sensitive: false,
        },
      ],
    });
    expect(typeof req.RequestId).toBe('string');
    expect(typeof req.Data.Build.Id).toBe('number');
    expect(req.Data.Build.JobId).toBe(cosJobId);

    buildId = req.Data.Build.Id;
  });

  it('[describeCodingCIBuildStageReq] should get right request data', async () => {
    const req = describeCodingCIBuildStageReq(buildId);
    expect(req).toEqual({
      BuildId: buildId,
    });
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

  it('[describeCodingCIBuildLogReq] should get right request data using start default to 0', async () => {
    const req = describeCodingCIBuildLogReq(buildId);
    expect(req).toEqual({
      BuildId: buildId,
      Start: 0,
    });
  });

  it('[describeCodingCIBuildLogReq] should get right request data using config start', async () => {
    const req = describeCodingCIBuildLogReq(buildId, 100);
    expect(req).toEqual({
      BuildId: buildId,
      Start: 100,
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

  // *********** Using Git **************
  it('[createCodingCIJobReq using git] should get right request data', async () => {
    const req = createCodingCIJobReq({
      jobName: 'slsplus-cli-test-git',
      projectId,
      envs: credentialEnvs,
      useGit: true,
      gitBranch: 'dev',
    });
    expect(req).toEqual({
      ProjectId: projectId,
      Name: 'slsplus-cli-test-git',
      ExecuteIn: 'CVM',
      TriggerMethodList: ['REF_CHANGE', 'MR_CHANGE'],
      HookType: 'DEFAULT',
      JenkinsFileFromType: 'STATIC',
      JenkinsFileStaticContent:
        "pipeline {\n  agent any\n\n  stages {\n    stage(\"Initializing node.js environment\") {\n      steps {\n        sh 'env'\n        sh 'date'\n        sh 'echo TENCENT_SECRET_ID=$TENCENT_SECRET_ID > .env'\n        sh 'echo TENCENT_SECRET_KEY=$TENCENT_SECRET_KEY >> .env'\n        sh 'echo TENCENT_TOKEN=$TENCENT_TOKEN >> .env'\n        sh 'echo SERVERLESS_PLATFORM_VENDOR=tencent >> .env'\n        sh 'echo SERVERLESS_PLATFORM_STAGE=$SERVERLESS_PLATFORM_STAGE >> .env'\n        sh '''cat > npm.sh << EOF\r\n#! /bin/bash\r\nrootPath=\\\\`pwd\\\\`\r\nfunction read_dir(){\r\n  for file in \\\\`ls \\\\$1\\\\`\r\n  do\r\n    if [ -d \\\\$1'/'\\\\$file ]; then\r\n      if [ \\\\$file != 'node_modules' ]; then\r\n        read_dir \\\\$1'/'\\\\$file\r\n      fi\r\n    else\r\n      if [ \\\\$file = 'package.json' ]; then\r\n        cd \\\\$1\r\n        npm install\r\n        cd \\\\$rootPath\r\n      fi\r\n    fi\r\n  done\r\n}\r\nread_dir \\\\$1\r\nEOF'''\n        sh 'cat npm.sh && ls -la'\n      }\n    }\n\n    stage(\"Installing serverless cli\") {\n      steps {\n        sh 'npm config ls'\n        sh 'npm set registry https://registry.npmjs.org/'\n        sh 'npm install -g serverless'\n        sh 'sls -v'\n      }\n    }\n\n    stage(\"Downloading code\") {\n      steps {\n        sh 'git init && git remote add origin $CODE_URL'\n        sh 'git fetch --no-tags --prune --progress --depth=2 origin'\n        sh 'git checkout --progress --force -B dev refs/remotes/origin/dev'\n        sh 'git log -1 --format=%H'\n      }\n    }\n\n    stage(\"Installing dependencies\") {\n      steps {\n        sh 'chmod +x ./npm.sh && ./npm.sh `pwd` && rm npm.sh'\n      }\n    }\n\n    stage(\"Deploying serverless project\") {\n      steps {\n        sh 'serverless deploy --debug'\n      }\n    }\n\n  }\n}\n",
      AutoCancelSameRevision: true,
      AutoCancelSameMergeRequest: true,
      TriggerRemind: 'ALWAYS',
      JobFromType: 'SERVERLESS',
      DepotType: 'NONE',
      DepotId: 0,
      EnvList: credentialEnvs,
    });
  });
  it('[createCodingCIJob using git] should create project job success', async () => {
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

  it('[triggerCodingCIBuildReq using git] should get right request data', async () => {
    const req = triggerCodingCIBuildReq({
      jobId: gitJobId,
      envs: [
        {
          Name: 'CODE_URL',
          Value: process.env.CODE_URL_GIT as string,
          Sensitive: false,
        },
      ],
    });
    expect(req).toEqual({
      JobId: gitJobId,
      Revision: 'master',
      ParamList: [
        {
          Name: 'CODE_URL',
          Value: process.env.CODE_URL_GIT as string,
          Sensitive: false,
        },
      ],
    });
  });

  it('[triggerCodingCIBuild using git] should trigger ci build success', async () => {
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
});
