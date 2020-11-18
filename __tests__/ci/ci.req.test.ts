import {
  createProjectWithTemplateReq,
  createCodingCIJobReq,
  triggerCodingCIBuildReq,
  describeCodingCIBuildStageReq,
  describeCodingCIBuildLogReq,
} from '../../src/ci/coding/actions';

describe('Coding CI', () => {
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
      JenkinsFileStaticContent: expect.any(String),
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
      JenkinsFileStaticContent: expect.any(String),
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
      JenkinsFileStaticContent: expect.any(String),
      AutoCancelSameRevision: true,
      AutoCancelSameMergeRequest: true,
      TriggerRemind: 'ALWAYS',
      JobFromType: 'SERVERLESS',
      DepotType: 'NONE',
      DepotId: 0,
      EnvList: credentialEnvs,
    });
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

  it('[describeCodingCIBuildStageReq] should get right request data', async () => {
    const req = describeCodingCIBuildStageReq(buildId);
    expect(req).toEqual({
      BuildId: buildId,
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
      JenkinsFileStaticContent: expect.any(String),
      AutoCancelSameRevision: true,
      AutoCancelSameMergeRequest: true,
      TriggerRemind: 'ALWAYS',
      JobFromType: 'SERVERLESS',
      DepotType: 'NONE',
      DepotId: 0,
      EnvList: credentialEnvs,
    });
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

  it('[createCodingCIJobReq using git with auto trigger by target branch] should get right request data', async () => {
    const req = createCodingCIJobReq({
      jobName: 'slsplus-cli-test-git',
      projectId,
      envs: credentialEnvs,
      useGit: true,
      gitBranch: 'dev',
      autoTriggerRuleOptions: {
        hookType: 'DEFAULT',
        branchRegex: '',
        branchSelector: 'test-branch',
      },
    });
    expect(req).toEqual({
      ProjectId: projectId,
      Name: 'slsplus-cli-test-git',
      ExecuteIn: 'CVM',
      HookType: 'DEFAULT',
      TriggerMethodList: ['REF_CHANGE', 'MR_CHANGE'],
      BranchSelector: 'test-branch',
      JenkinsFileFromType: 'STATIC',
      JenkinsFileStaticContent: expect.any(String),
      AutoCancelSameRevision: true,
      AutoCancelSameMergeRequest: true,
      TriggerRemind: 'ALWAYS',
      JobFromType: 'SERVERLESS',
      DepotType: 'NONE',
      DepotId: 0,
      EnvList: credentialEnvs,
    });
  });

  it('[createCodingCIJobReq using git with auto trigger by all branch] should get right request data', async () => {
    const req = createCodingCIJobReq({
      jobName: 'slsplus-cli-test-git',
      projectId,
      envs: credentialEnvs,
      useGit: true,
      gitBranch: 'dev',
      autoTriggerRuleOptions: {
        hookType: 'BRANCH',
        branchRegex: '^refs/heads/.+$',
        branchSelector: '',
      },
    });
    expect(req).toEqual({
      ProjectId: projectId,
      Name: 'slsplus-cli-test-git',
      ExecuteIn: 'CVM',
      HookType: 'BRANCH',
      TriggerMethodList: ['REF_CHANGE', 'MR_CHANGE'],
      BranchRegex: '^refs/heads/.+$',
      JenkinsFileFromType: 'STATIC',
      JenkinsFileStaticContent: expect.any(String),
      AutoCancelSameRevision: true,
      AutoCancelSameMergeRequest: true,
      TriggerRemind: 'ALWAYS',
      JobFromType: 'SERVERLESS',
      DepotType: 'NONE',
      DepotId: 0,
      EnvList: credentialEnvs,
    });
  });

  it('[createCodingCIJobReq using git with auto trigger by new tag] should get right request data', async () => {
    const req = createCodingCIJobReq({
      jobName: 'slsplus-cli-test-git',
      projectId,
      envs: credentialEnvs,
      useGit: true,
      gitBranch: 'dev',
      autoTriggerRuleOptions: {
        hookType: 'TAG',
        branchRegex: '^refs/tags/.+$',
        branchSelector: '',
      },
    });
    expect(req).toEqual({
      ProjectId: projectId,
      Name: 'slsplus-cli-test-git',
      ExecuteIn: 'CVM',
      HookType: 'TAG',
      TriggerMethodList: ['REF_CHANGE', 'MR_CHANGE'],
      BranchRegex: '^refs/tags/.+$',
      JenkinsFileFromType: 'STATIC',
      JenkinsFileStaticContent: expect.any(String),
      AutoCancelSameRevision: true,
      AutoCancelSameMergeRequest: true,
      TriggerRemind: 'ALWAYS',
      JobFromType: 'SERVERLESS',
      DepotType: 'NONE',
      DepotId: 0,
      EnvList: credentialEnvs,
    });
  });

  it('[createCodingCIJobReq using git with auto trigger by custom regex rule] should get right request data', async () => {
    const req = createCodingCIJobReq({
      jobName: 'slsplus-cli-test-git',
      projectId,
      envs: credentialEnvs,
      useGit: true,
      gitBranch: 'dev',
      autoTriggerRuleOptions: {
        hookType: 'CUSTOM',
        branchRegex: '^refs/heads/master$',
        branchSelector: '',
      },
    });
    expect(req).toEqual({
      ProjectId: projectId,
      Name: 'slsplus-cli-test-git',
      ExecuteIn: 'CVM',
      HookType: 'CUSTOM',
      TriggerMethodList: ['REF_CHANGE', 'MR_CHANGE'],
      BranchRegex: '^refs/heads/master$',
      JenkinsFileFromType: 'STATIC',
      JenkinsFileStaticContent: expect.any(String),
      AutoCancelSameRevision: true,
      AutoCancelSameMergeRequest: true,
      TriggerRemind: 'ALWAYS',
      JobFromType: 'SERVERLESS',
      DepotType: 'NONE',
      DepotId: 0,
      EnvList: credentialEnvs,
    });
  });
});
