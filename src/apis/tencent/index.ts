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
  const { ServiceType } = capi.options;
  const typePrefix = `API_${ServiceType.toUpperCase()}_`;
  try {
    const reqData = cleanEmptyValue(options) as RequestData;
    const res = await capi.request(reqData, {
      isV3: false,
      debug: !!process.env.DEBUG,
    });
    const { Response } = res;
    if (Response && Response.Error && Response.Error.Code) {
      throw new ApiError({
        type: `${typePrefix}${options.Action}`,
        message: `${Response.Error.Message} (reqId: ${Response.RequestId})`,
        reqId: Response.RequestId,
        code: Response.Error.Code,
      });
    }
    return Response;
  } catch (e) {
    throw new ApiError({
      type: `${typePrefix}${options.Action}`,
      message: e.message,
      stack: e.stack,
      reqId: e.reqId,
      code: e.code,
    });
  }
}

export { request };
