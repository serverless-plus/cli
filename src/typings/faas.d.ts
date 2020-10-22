export interface InvokeOptions {
  name: string;
  qualifier?: string;
  context: string;
  namespace?: string;
  type?: string;
}

export interface InvokeResponse {
  Log: string;
  RetMsg: string;
  FunctionRequestId: string;
  ErrMsg: string;
  MemUsage: number;
  BillDuration: number;
  Duration: number;
  InvokeResult: number;
}

export interface WarmOptions {
  name: string;
  qualifier?: string;
  namespace?: string;
  region?: string;
  stage?: string;
  app?: string;
  type: string;
}
