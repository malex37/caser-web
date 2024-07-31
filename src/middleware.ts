import { NextRequest, NextResponse } from "next/server";
import { AuthMiddleware } from "@middleware/AuthMiddleware";
import { Middleware } from "@models/middleware/Middleware";

// Middleware to execute in order
// TODO: Maybe can leverage the middleware matcher
const MiddlewareFunctions: Middleware[] = [
  new AuthMiddleware(),
];

export async function middleware(request: NextRequest) {
  console.log(`[MainMiddleware] Processing request with url ${request.url}`);
  let response = NextResponse.next({
    request: {
      ...request,
      headers: request.headers,
    },
  });
  // execution middlewares
  for (const middleFunction of MiddlewareFunctions) {
    console.log(`[MainMiddleware] Executing middleware: ${middleFunction.name()}`);
    
    const midResponse = await middleFunction.execute(request);
    if (midResponse.status === 'SUCCESS') {
      console.log('[MainMiddleware] Middleware response is ok, continuing');
      continue;
    } if (midResponse.status === 'FAIL') {
      console.log(`[MainMiddleWare] Middleware response is ${JSON.stringify(midResponse)}`);
      // destroy cookies
      middleFunction.processFailure();
      response = NextResponse.redirect(new URL('/login', request.url))
    }
  }
  console.log(`[MainMiddleware] Responding with response.url = ${response.url}`)
  return response;
}


export const config = {
  matcher: '/((?!login|_next/).*)'
};

