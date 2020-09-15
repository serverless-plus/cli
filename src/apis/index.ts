import { Capi, RequestData } from '@tencent-sdk/capi';
import { ApiError } from './error';

interface ObjectInstance {
  [propName: string]: any;
}

export interface RequestOptions {
  Action: string;
  RequestClient?: string;
  [propName: string]: any;
}

function isEmpty(val: any) {
  return val === undefined || val === null || (typeof val === 'number' && isNaN(val));
}

function cleanEmptyValue(obj: ObjectInstance) {
  const newObj: ObjectInstance = {};
  Object.entries(obj).forEach(([key, val]) => {
    if (!isEmpty(val)) {
      newObj[key] = val;
    }
  });
  return newObj;
}

async function request(capi: Capi, options: RequestOptions): Promise<any | ApiError> {
  try {
    const reqData = cleanEmptyValue(options) as RequestData;
    const res = await capi.request(reqData, {
      isV3: false,
      debug: false,
      host: 'coding.tencentcloudapi.com',
      RequestClient: 'slsplus_coding',
    });
    const { Response } = res;
    if (Response && Response.Error && Response.Error.Code) {
      throw new ApiError({
        type: `API_CODING_${options.Action}`,
        message: `${Response.Error.Message} (reqId: ${Response.RequestId})`,
        reqId: Response.RequestId,
        code: Response.Error.Code,
      });
    }
    return Response;
  } catch (e) {
    throw new ApiError({
      type: `API_CODING__${options.Action}`,
      message: e.message,
      stack: e.stack,
      reqId: e.reqId,
      code: e.code,
    });
  }
}

export { request };
