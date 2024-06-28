import { SessionOptions } from "iron-session";

export const SessionTokenOptions: SessionOptions = {
    password: process.env.DEV_PSWD,
    cookieName: 'x-tickety-ticket',
    cookieOptions: {
      secure: true,
      path: '/'
    }
  }
export const SessionKeysOptions: SessionOptions = {
    password: process.env.DEV_PSWD,
    cookieName: 'x-tickety-auth',
    cookieOptions: {
      secure: true,
      path: '/'
    }
  }

export const AuthTokens = [
  SessionTokenOptions,
  SessionKeysOptions
];
