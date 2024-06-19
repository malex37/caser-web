export const AuthTokenFields: { [name in keyof AuthToken]: keyof AuthToken } = {
  accessToken: 'accessToken',
  idToken: 'idToken',
  tokenExpiration: 'tokenExpiration',
  tokenStart: 'tokenStart'
} as const;

export interface AuthToken {
  accessToken: string;
  idToken: string;
  tokenExpiration: string;
  tokenStart: string;
}
