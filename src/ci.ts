// / <reference path="./typings/ci-interfaces.d.ts" />

import { Capi } from '@tencent-sdk/capi';
import {
  CodingCIInterface,
  CodingCIOptions,
  CreateProjectWithTemplateOptions,
  CreateProjectWithTemplateRequest,
  CreateCodingCIJobOptions,
  CreateCodingCIJobRequest,
  TriggerCodingCIBuildOptions,
  TriggerCodingCIBuildRequest,
  DescribeCodingCIBuildStageRequest,
  DescribeCodingCIBuildLogRequest,
  CreateProjectWithTemplateResponse,
  CreateCodingCIJobResponse,
  TriggerCodingCIBuildResponse,
  DescribeCodingCIBuildStageResponse,
  DescribeCodingCIBuildLogResponse,
} from './typings/ci-interfaces';

import { Pipeline } from './models/pipeline';

import { NPM_INSTALL_SHELL } from './constants';
import { request } from './apis';

class CodingCI implements CodingCIInterface {
  capi: Capi;
  constructor({ secretId, secretKey, token, region = 'ap-guangzhou' }: CodingCIOptions) {
    this.capi = new Capi({
      SecretId: secretId,
      SecretKey: secretKey,
      Token: token,
      Region: region,
      ServiceType: 'coding',
      Version: '2019-10-21',
      SignatureMethod: 'sha256',
    });
  }
  /* *********************************
   * @api CreateProjectWithTemplate
   */
  async createProjectWithTemplate({
    name,
    alias,
    description,
    options = {},
  }: CreateProjectWithTemplateOptions): Promise<CreateProjectWithTemplateResponse> {
    const req = CodingCI.createProjectWithTemplateReq({
      name,
      alias,
      description,
      options,
    });
    const res = await request(this.capi, {
      Action: 'CreateProjectWithTemplate',
      ...req,
    });
    return res;
  }

  async createCodingCIJob({
    jobName,
    projectId,
    depotId,
    envs = [],
  }: CreateCodingCIJobOptions): Promise<CreateCodingCIJobResponse> {
    const req = CodingCI.createCodingCIJobReq({
      jobName,
      projectId,
      depotId,
      envs,
    });
    const res = await request(this.capi, {
      Action: 'CreateCodingCIJob',
      ...req,
    });
    return res;
  }

  async triggerCodingCIBuild({
    jobId,
    envs = [],
  }: TriggerCodingCIBuildOptions): Promise<TriggerCodingCIBuildResponse> {
    const req = CodingCI.triggerCodingCIBuildReq({
      jobId,
      envs,
    });
    const res = await request(this.capi, {
      Action: 'TriggerCodingCIBuild',
      ...req,
    });
    return res;
  }

  async describeCodingCIBuildStage(buildId: number): Promise<DescribeCodingCIBuildStageResponse> {
    const req = CodingCI.describeCodingCIBuildStageReq(buildId);
    const res = await request(this.capi, {
      Action: 'DescribeCodingCIBuildStage',
      ...req,
    });
    return res;
  }

  async describeCodingCIBuildLog(
    buildId: number,
    start = 0,
  ): Promise<DescribeCodingCIBuildLogResponse> {
    const req = CodingCI.describeCodingCIBuildLogReq(buildId, start);
    const res = await request(this.capi, {
      Action: 'DescribeCodingCIBuildLog',
      ...req,
    });
    return res;
  }

  /**
   * Generate CreateProject request data
   */
  static createProjectWithTemplateReq({
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
  static createCodingCIJobReq({
    jobName,
    projectId,
    depotId,
    envs = [],
    pipeline,
  }: CreateCodingCIJobOptions): CreateCodingCIJobRequest {
    if (!pipeline) {
      pipeline = new Pipeline();
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
  static triggerCodingCIBuildReq({
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
   * generate DescribeCodingCIBuildStage request data
   */
  static describeCodingCIBuildStageReq(buildId: number): DescribeCodingCIBuildStageRequest {
    return {
      BuildId: buildId,
    };
  }

  /**
   * generate DescribeCodingCIBuildLog request data
   */
  static describeCodingCIBuildLogReq(buildId: number, start = 0): DescribeCodingCIBuildLogRequest {
    return {
      BuildId: buildId,
      Start: start,
    };
  }
}

export { CodingCI };
