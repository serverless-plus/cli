import { AnyObject, SlsInputs } from './index.d';

export interface GetInstanceRequest {
  stage: string;
  app: string;
  name: string;
  region?: string;
  appid?: string;
}

export interface InstanceResponse {
  Body: string;
  RequestId: string;
}

export interface InstanceBodyResponse {
  body: string;
  headers: AnyObject;
  statusCode: number;
}

export interface Instance {
  appName: string;
  appUid: string;
  componentName: string;
  componentVersion: string;
  deploymentError: string | null;
  deploymentErrorStack: string | null;
  description: string | null;
  instanceId: string;
  instanceName: string;
  instanceStatus: string;
  orgName: string;
  stageName: string;
  lastAction: string;
  inputs: SlsInputs;
  lastActionAt: number;
  lastDeployedAt: number;
  orgUid: number;
  createdAt: number;
  updatedAt: number;
  instanceMetrics: AnyObject;
  outputs: AnyObject;
  state: AnyObject;
}

export interface InstanceBody {
  instance: Instance;
}
