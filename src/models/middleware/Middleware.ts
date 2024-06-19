import { NextRequest, NextResponse } from "next/server";

export abstract class Middleware {
  middlewareName = '';
  execute(_request: NextRequest): NextResponse {
    throw new Error(`Middleware failed to implement execute function`);
  };
  log(message?: any) {
    console.log(`[${this.middlewareName}] ${message ? message : ''}`);
  }
  name() {
    this.log()
  }
}
