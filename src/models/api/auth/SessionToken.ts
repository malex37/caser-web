export interface SessionToken {
  username: string;
  webId: string;
  refresh: string;
  access: string;
}

export interface SessionServiceKeys {
  SKI: string;
  AKI: string;
  ST: string;
  EXP: number;
}

export type SessionTokenKeys = keyof SessionToken;
