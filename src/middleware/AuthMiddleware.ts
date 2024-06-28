import { SessionServiceKeys, SessionToken } from '@models/api/auth/SessionToken';
import { Middleware, MiddlewareResponse } from '@models/middleware/Middleware';
import { IronSession, getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { SessionTokenOptions, SessionKeysOptions, AuthTokens } from './Config';
import { NextRequest } from 'next/server';

export class AuthMiddleware extends Middleware {
  middlewareName = 'Authenticator';
  async execute(_request: NextRequest): Promise<MiddlewareResponse> {
    this.log('Starting')
    // Get session for request
    const tokenSession = await getIronSession<SessionToken>(cookies(), SessionTokenOptions);
    const serviceSession = await getIronSession<SessionServiceKeys>(cookies(), SessionKeysOptions);
    this.log(`TokenSession: ${JSON.stringify(tokenSession, null, 2)}`);
    this.log(`ServiceSession: ${JSON.stringify(serviceSession, null, 2)}`);

    if (!tokenSession || !serviceSession) {
      this.log('Insufficient tokens');
      return {
        status: 'FAIL',
        reason: 'Invalid auth'
      }
    }
    // Check token for empty fields
    if (!this.checkNoEmptyFields(tokenSession) || !this.checkNoEmptyFields(serviceSession)) {
      this.log('Token has empty fields')
      return {
        status: 'FAIL',
        reason: 'Empty required session field',
      }
    }
    // check for expiration
    if (this.checkIfTokenExpired(serviceSession)) {
      this.log('Token is expired')
      return {
        status: 'FAIL',
        reason: 'Token Expired'
      }
    }
    return {
      status: 'SUCCESS',
    }
  }

  checkNoEmptyFields(session: IronSession<SessionToken | SessionServiceKeys>): boolean {
    if (Object.keys(session).length === 0) {
      return false;
    }
    for (const field in session) {
      if (!field || field == '') {
        return false;
      }
    }
    return true;
  }

  checkIfTokenExpired(session: IronSession<SessionServiceKeys>): boolean {
    const expirationTime = session.EXP
    this.log(`Checking against expiration time ${JSON.stringify(expirationTime)}`)
    const currentTime = Date.now();
    // If expiration > than current time it means the expiration date is in the future
    // and ticket is still valid, if less than current taime eT > cT == false so negate to return
    // true to match function name
    this.log(`Current date is ${new Date(currentTime).toString()} and token expiration date is ${new Date(expirationTime).toString()}`);
    return !(expirationTime > currentTime);
  }

  processFailure() {
    this.log('Invoking process failure');
    AuthTokens.map(async tokenConfig => {
      const cookie = cookies().get(tokenConfig.cookieName);
      if (cookie) {
        cookies().delete(tokenConfig.cookieName);
      }
    });
  }
}
