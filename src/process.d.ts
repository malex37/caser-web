declare namespace NodeJS {
  export interface ProcessEnv {
    SESSION_COOKIE: string;
    DEV_PSWD: string;
    DEV_USR: string;
    IDENTITY_POOL_ID: string;
    USER_POOL_ID: string;
    SERVICE_REGION: string;
    AWS_ACCOUNT_ID: string;
  }
}
