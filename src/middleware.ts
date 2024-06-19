import { NextRequest, NextResponse } from "next/server";
import { AuthMiddleware } from "./middleware/auth";

// Middleware to execute in order
// TODO: Maybe can leverage the middleware matcher
const MiddlewareFunctions = [
  new AuthMiddleware(),
];

export function middleware(request: NextRequest) {
  console.log(`[MainMiddleware] Executing through middleware with cookies ${JSON.stringify(request.cookies.getAll())}`);
  let response = NextResponse.next({
    request: {
      ...request,
      headers: request.headers,
    },
  });
  // execution middlewares
  for (const middleFunction of MiddlewareFunctions) {
    console.log('Executing middleware :');
    middleFunction.name();
    response = middleFunction.execute(request);
    if (response.ok) {
      console.log('[MainMiddleware] Middleware response is ok, continuing');
      continue;
    } else {
      break;
    }
  }
  return response;
}


export const config = {
  matcher: ['/((?!login|_next/).*)']
};

