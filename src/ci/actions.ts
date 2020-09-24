import {
  CreateProjectWithTemplateRequest,
  CreateCodingCIJobRequest,
  TriggerCodingCIBuildRequest,
  DescribeCodingCIBuildRequest,
  DescribeCodingCIBuildStageRequest,
  DescribeCodingCIBuildLogRequest,
  CreateProjectWithTemplateOptions,
  CreateCodingCIJobOptions,
  TriggerCodingCIBuildOptions,
} from '../typings/ci';

import { Pipeline } from './models/pipeline';

import { NPM_INSTALL_SHELL } from '../constants';

/**
 * Generate CreateProject request data
 */
function createProjectWithTemplateReq({
  name,
  alias,
  description,
  options = {},
}: CreateProjectWithTemplateOptions): CreateProjectWithTemplateRequest {
  const req = {} as CreateProjectWithTemplateRequest;
  req.Name = name;
  req.DisplayName = alias;
  req.GitReadmeEnabled = options.gitReadmeEnabled || true;
  req.VcsType = options.vcsType || 'git';
  req.Shared = options.shared || 0;
  req.ProjectTemplate = options.template || 'DEV_OPS';
  req.GitIgnore = options.gitIgnore || 'no';
  req.Description = description || '';
  req.CreateSvnLayout = options.createSvnLayout || false;
  req.Invisible = options.invisible || false;
  req.Label = options.label || 'SLS';

  return req;
}

/**
 * Generate CreateCodingCIJob request data
 */
function createCodingCIJobReq({
  jobName,
  projectId,
  depotId,
  envs = [],
  pipeline,
  useCITempAuth = false,
  parseOptions,
  needDeployLayer = false,
}: CreateCodingCIJobOptions): CreateCodingCIJobRequest {
  if (!pipeline) {
    pipeline = new Pipeline();
    const stages = pipeline.addStages();

    // 1. initial environment variables
    let stage = stages.addStage('Initializing Node.js environment');
    let steps = stage.addSteps();
    steps.addShell('env');
    steps.addShell('date');
    // 1.1 generate environment variables for serverless
    if (useCITempAuth) {
      steps.addShell('echo TENCENT_SECRET_ID=$TENCENT_TEMP_SECRET_ID > .env');
      steps.addShell('echo TENCENT_SECRET_KEY=$TENCENT_TEMP_SECRET_KEY >> .env');
      steps.addShell('echo TENCENT_TOKEN=$TENCENT_TEMP_TOKEN >> .env');
    } else {
      steps.addShell('echo TENCENT_SECRET_ID=$TENCENT_SECRET_ID > .env');
      steps.addShell('echo TENCENT_SECRET_KEY=$TENCENT_SECRET_KEY >> .env');
      steps.addShell('echo TENCENT_TOKEN=$TENCENT_TOKEN >> .env');
    }
    steps.addShell('echo SERVERLESS_PLATFORM_VENDOR=tencent >> .env');
    steps.addShell('echo SERVERLESS_PLATFORM_STAGE=$SERVERLESS_PLATFORM_STAGE >> .env');
    // 1.2 generate npm install shell, include install for sub dir
    steps.addShell(NPM_INSTALL_SHELL);
    steps.addShell('cat npm.sh && ls -la');

    // 2. install serverless cli
    stage = stages.addStage('Installing serverless and slsplus cli');
    steps = stage.addSteps();
    steps.addShell('npm config ls');
    steps.addShell('npm set registry https://registry.npmjs.org/');
    steps.addShell('npm install -g serverless');
    steps.addShell('sls -v');

    // 3. download code
    stage = stages.addStage('Downloading code');
    steps = stage.addSteps();
    steps.addShell('wget $CODE_URL_COS -O code.zip');
    steps.addShell('ls -l && file code.zip');
    steps.addShell('unzip -n code.zip && rm code.zip');

    // 4. install project dependencies
    stage = stages.addStage('Install dependencies');
    steps = stage.addSteps();
    steps.addShell('chmod +x ./npm.sh && ./npm.sh `pwd` && rm npm.sh');

    // 5. Processing serverless config files (optional)
    // whether need parse serverless.yml to source values config
    if (parseOptions) {
      stage = stages.addStage('Processing serverless config files');
      steps = stage.addSteps();
      steps.addShell('npm install -g @slsplus/cli');
      if (parseOptions.slsOptions) {
        steps.addShell(
          `slsplus parse --output --auto-create --sls-options=\\\'${JSON.stringify(
            parseOptions.slsOptions,
          )}\\\' && cat serverless.yml`,
        );
      }
      if (parseOptions.layerOptions) {
        steps.addShell(
          `slsplus parse --output --auto-create --layer-options=\\\'${JSON.stringify(
            parseOptions.layerOptions,
          )}\\\' && cat layer/serverless.yml`,
        );
      }
    }

    // 6. deploy serverless project
    stage = stages.addStage('Deploying Serverless project');
    steps = stage.addSteps();
    if (needDeployLayer) {
      // 6.1 deploy layer (optional)
      steps.addShell('serverless deploy --debug --target=./layer');
    }
    // 6.2 deploy project
    steps.addShell('serverless deploy --debug');
  } else {
    if (!(pipeline instanceof Pipeline)) {
      throw new Error('[PARAMETER_ERROR] pipeline should be instance of Pipeline');
    }
  }

  const req = {} as CreateCodingCIJobRequest;
  req.ProjectId = projectId;
  req.Name = jobName;
  req.ExecuteIn = 'CVM';
  req.TriggerMethodList = ['REF_CHANGE', 'MR_CHANGE'];
  req.HookType = 'DEFAULT';
  req.JenkinsFileFromType = 'STATIC';
  req.JenkinsFileStaticContent = pipeline.toString();
  req.AutoCancelSameRevision = true;
  req.AutoCancelSameMergeRequest = true;
  req.TriggerRemind = 'ALWAYS';
  req.JobFromType = 'SERVERLESS';
  if (depotId) {
    req.DepotType = 'CODING';
    req.DepotId = depotId;
  } else {
    req.DepotType = 'NONE';
    req.DepotId = 0;
  }

  req.EnvList = envs.map((item) => {
    item.Sensitive = item.Sensitive !== false;
    return item;
  });

  return req;
}

/**
 * generate TriggerCodingCIBuild request data
 */
function triggerCodingCIBuildReq({
  jobId,
  envs = [],
}: TriggerCodingCIBuildOptions): TriggerCodingCIBuildRequest {
  const req = {} as TriggerCodingCIBuildRequest;
  req.JobId = jobId;
  req.Revision = 'master';
  req.ParamList = envs.map((item) => {
    item.Sensitive = item.Sensitive !== false;
    return item;
  });

  return req;
}

/**
 * generate DescribeCodingCIBuild request data
 */
function describeCodingCIBuildReq(buildId: number): DescribeCodingCIBuildRequest {
  return {
    BuildId: buildId,
  };
}

/**
 * generate DescribeCodingCIBuildStage request data
 */
function describeCodingCIBuildStageReq(buildId: number): DescribeCodingCIBuildStageRequest {
  return {
    BuildId: buildId,
  };
}

/**
 * generate DescribeCodingCIBuildLog request data
 */
function describeCodingCIBuildLogReq(buildId: number, start = 0): DescribeCodingCIBuildLogRequest {
  return {
    BuildId: buildId,
    Start: start,
  };
}

export {
  createProjectWithTemplateReq,
  createCodingCIJobReq,
  triggerCodingCIBuildReq,
  describeCodingCIBuildReq,
  describeCodingCIBuildStageReq,
  describeCodingCIBuildLogReq,
};
