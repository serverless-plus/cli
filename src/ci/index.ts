import { Capi } from '@tencent-sdk/capi';
import {
  CodingCIInterface,
  CreateCodingCIJobResponse,
  CreateProjectWithTemplateResponse,
  TriggerCodingCIBuildResponse,
  DescribeCodingCIBuildResponse,
  DescribeCodingCIBuildStageResponse,
  DescribeCodingCIBuildLogResponse,
  CodingCIOptions,
  CreateProjectWithTemplateOptions,
  CreateCodingCIJobOptions,
  TriggerCodingCIBuildOptions,
  Project,
} from '../typings/ci';
import {
  createProjectWithTemplateReq,
  createCodingCIJobReq,
  triggerCodingCIBuildReq,
  describeCodingCIBuildReq,
  describeCodingCIBuildStageReq,
  describeCodingCIBuildLogReq,
} from './actions';

import { request } from '../apis';

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

  async getProjectByName(projectName: string): Promise<Project | undefined> {
    const { ProjectList = [] } = await request(this.capi, {
      Action: 'DescribeProjectLabels',
    });
    if (ProjectList.length > 0) {
      const [project] = ProjectList.some((item: Project) => item.Name === projectName);
      return project;
    }
    return undefined;
  }

  async createProjectWithTemplate(
    options: CreateProjectWithTemplateOptions,
  ): Promise<CreateProjectWithTemplateResponse> {
    const project = await this.getProjectByName(options.name);
    if (project) {
      return {
        ProjectId: project.Id,
      };
    }
    const req = createProjectWithTemplateReq(options);
    const res = await request(this.capi, {
      Action: 'CreateProjectWithTemplate',
      ...req,
    });
    return res;
  }

  async createCodingCIJob(options: CreateCodingCIJobOptions): Promise<CreateCodingCIJobResponse> {
    const req = createCodingCIJobReq(options);
    const res = await request(this.capi, {
      Action: 'CreateCodingCIJob',
      ...req,
    });
    return res;
  }

  async triggerCodingCIBuild(
    options: TriggerCodingCIBuildOptions,
  ): Promise<TriggerCodingCIBuildResponse> {
    const req = triggerCodingCIBuildReq(options);
    const res = await request(this.capi, {
      Action: 'TriggerCodingCIBuild',
      ...req,
    });
    return res;
  }

  async describeCodingCIBuild(buildId: number): Promise<DescribeCodingCIBuildResponse> {
    const req = describeCodingCIBuildReq(buildId);
    const res = await request(this.capi, {
      Action: 'DescribeCodingCIBuild',
      ...req,
    });
    return res;
  }

  async describeCodingCIBuildStage(buildId: number): Promise<DescribeCodingCIBuildStageResponse> {
    const req = describeCodingCIBuildStageReq(buildId);
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
    const req = describeCodingCIBuildLogReq(buildId, start);
    const res = await request(this.capi, {
      Action: 'DescribeCodingCIBuildLog',
      ...req,
    });
    return res;
  }
}

export { CodingCI };
