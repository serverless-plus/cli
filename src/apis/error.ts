export interface ApiErrorOptions {
  type: string;
  message: string;
  stack?: string;
  reqId?: string;
  displayMsg?: string;
  code?: string | number;
}

export interface ApiErrorInstance extends Error {
  type: string;
  message: string;
  stack: string;
  reqId: string;
  displayMsg: string;
  code: string | number;
}

class ApiError {
  constructor({ type, message, stack, reqId, displayMsg, code }: ApiErrorOptions) {
    const err = new Error(message) as ApiErrorInstance;
    err.type = type;
    if (stack) {
      err.stack = stack;
    }
    if (reqId) {
      err.reqId = reqId;
    }
    if (code) {
      err.code = code;
    }
    err.displayMsg = displayMsg || message;
    return err;
  }
}

export { ApiError };
