import { AuthToken, AuthTokenFields } from '@models/api/AuthToken';
import { Middleware } from '@models/middleware/Middleware';
import { NextRequest, NextResponse } from 'next/server';
export class AuthMiddleware extends Middleware {
  middlewareName = 'Authenticator';
  execute(request: NextRequest) {
    const token: AuthToken = {
      accessToken: request.cookies.get('accessToken')?.value || '',
      idToken: request.cookies.get(AuthTokenFields.idToken)?.value || '',
      tokenExpiration: request.cookies.get(AuthTokenFields.tokenExpiration)?.value || '',
      tokenStart: request.cookies.get(AuthTokenFields.tokenStart)?.value || '',
    };
    let redirectResponse = NextResponse.redirect(new URL('/login', request.url));
    let nextResponse = NextResponse.next({
      request: {
        ...request,
        headers: request.headers,
      }
    });
    // copy cookies
    const requestCookies = request.cookies.getAll();
    requestCookies.map(cookie => {
      nextResponse.cookies.set(cookie.name, cookie.value);
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    // this.log(`Validating token ${JSON.stringify(token, null, 2)}`);
    for (const key in AuthTokenFields) {
      // this.log(`Checking token for ${key}`);
      const tokenValue = token[key as keyof AuthToken];
      this.log(`Token value is ${!!tokenValue}`);
      if (tokenValue === '') {
        this.invalidateToken(redirectResponse);
        this.log('Empty required token value, redirecting');
        return redirectResponse;
      }
    }
    const currentTime = Date.now();
    const timePlusExpiration = Number(token.tokenStart) + Number(token.tokenExpiration);
    const delta = timePlusExpiration - currentTime;
    this.log(`Current time is: ${currentTime} and expiration max is ${timePlusExpiration} delta (et - ct) is ${delta}`);
    // check for token expiration
    if (delta <= 0) {
      this.log('Token is expired redirecting to login');
      this.invalidateToken(redirectResponse);
      return redirectResponse;
    }
    return nextResponse;
  }
  private invalidateToken(response: NextResponse) {
    this.log('Invalidating token')
    for (const authTokenKey in AuthTokenFields) {
      response.cookies.delete(authTokenKey);
    }
    return response;
  };
}

