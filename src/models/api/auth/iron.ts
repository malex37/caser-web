export type SessionToken = {
  username: string;
  sessionId: string;
  active: boolean;
  cognitoCred: {
    secretKey: string;
    accessKeyId: string;
  };
  webId: string;
}
