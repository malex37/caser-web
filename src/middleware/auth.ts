'use server'
import { Middleware } from '@models/middleware/Middleware';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
export class AuthMiddleware extends Middleware {
  middlewareName = 'Authenticator';
  execute(request: NextRequest) {
    this.log(`Request path is ${request.url}`);
    this.log(`Cookies? ${JSON.stringify(cookies().getAll())}`);
    let redirectResponse = NextResponse.redirect(new URL('/login', request.url));
    // get session for cookie
    let nextResponse = NextResponse.next({
      request: {
        ...request,
        headers: request.headers
      }
    });
    const ironTicket = cookies().get('x-iron-ticket');
    if (!ironTicket) {
      this.log('No iron ticket in request');
      return redirectResponse;
    }
    return nextResponse;
  }
}

