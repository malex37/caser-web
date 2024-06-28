import { NextRequest } from "next/server";

export type MiddlewareResponse = {
  status: 'SUCCESS' | 'FAIL',
  reason?: string;
}

export abstract class Middleware {
  middlewareName = '';
  // For middleware that isn't using await it won't matter but we give the option for middleware to
  // use other async calls
  async execute(_request: NextRequest): Promise<MiddlewareResponse> {
    throw new Error(`Middleware failed to implement execute function`);
  };
  log(message?: any) {
    console.log(`[${this.middlewareName}]:[${ new Date(Date.now())}] ${message ? message : ''}`);
  }
  name() {
    this.log()
  }
}
