import {
  CreateProjectOptions,
  CreateProjectRequest,
  CreateCodingCIJobOptions,
  CreateCodingCIJobRequest,
  TriggerCodingCIJobBuildOptions,
  TriggerCodingCIBuildRequest,
  DescribeCodingCIBuildStageRequest,
  DescribeCodingCIBuildLogRequest,
} from './typings/ci-interfaces';

import { Pipeline } from './models/pipeline';

import { NPM_INSTALL_SHELL } from './constants';

class CodingCI {
  /**
   * Generate CreateProject request data
   */
  static createProjectReq({
    name,
    alias,
    description,
    options = {},
  }: CreateProjectOptions): CreateProjectRequest {
    const req = {} as CreateProjectRequest;
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
  static createCodingCIJobReq({
    jobName,
    projectId,
    depotId,
    envs = {},
  }: CreateCodingCIJobOptions): CreateCodingCIJobRequest {
    const pipeline = new Pipeline();
    const stages = pipeline.addStages();

    let stage = stages.addStage('Initializing Node.js environment');
    let steps = stage.addSteps();
    steps.addShell('env');
    steps.addShell('date');
    steps.addShell('echo TENCENT_SECRET_ID=$TENCENT_SECRET_ID > .env');
    steps.addShell('echo TENCENT_SECRET_KEY=$TENCENT_SECRET_KEY >> .env');
    steps.addShell('echo TENCENT_TOKEN=$TENCENT_TOKEN >> .env');
    steps.addShell('echo SERVERLESS_PLATFORM_VENDOR=tencent >> .env');
    steps.addShell('echo SERVERLESS_PLATFORM_STAGE=$SERVERLESS_PLATFORM_STAGE >> .env');

    steps.addShell(NPM_INSTALL_SHELL);
    steps.addShell('cat npm.sh && ls -la');

    stage = stages.addStage('Installing serverless cli');
    steps = stage.addSteps();
    steps.addShell('npm config ls');
    steps.addShell('npm set registry https://registry.npmjs.org/');
    steps.addShell('npm install -g serverless');
    steps.addShell('sls -v');

    stage = stages.addStage('Downloading code');
    steps = stage.addSteps();
    steps.addShell('wget $CODE_URL_COS -O code.zip');
    steps.addShell('ls -l && file code.zip');
    steps.addShell('unzip -n code.zip');

    stage = stages.addStage('Deploying Serverless project');
    steps = stage.addSteps();
    steps.addShell('chmod +x ./npm.sh && ./npm.sh `pwd`');
    steps.addShell('serverless deploy --debug');

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

    req.EnvList = [];

    Object.keys(envs).forEach((k: string) => {
      req.EnvList.push({
        Name: k,
        Value: envs[k],
        Sensitive: false,
      });
    });

    return req;
  }

  /**
   * generate TriggerCodingCIBuild request data
   */
  static triggerCodingCIJobBuildReq({
    jobId,
    envs,
  }: TriggerCodingCIJobBuildOptions): TriggerCodingCIBuildRequest {
    const req = {} as TriggerCodingCIBuildRequest;
    req.JobId = jobId;
    req.Revision = 'master';
    req.ParamList = [];

    Object.keys(envs).forEach((k) => {
      req.ParamList.push({
        Name: k,
        Value: envs[k],
        Sensitive: false,
      });
    });

    return req;
  }

  /**
   * generate DescribeCodingCIBuildStage request data
   */
  static describeCodingCIBuildStatusReq(buildId: number): DescribeCodingCIBuildStageRequest {
    return {
      BuildId: buildId,
    };
  }

  /**
   * generate DescribeCodingCIBuildLog request data
   */
  static describeCodingCIBuildLogReq(
    buildId: number,
    offset: number = 0,
  ): DescribeCodingCIBuildLogRequest {
    return {
      BuildId: buildId,
      Start: offset,
    };
  }
}

export { CodingCI };
