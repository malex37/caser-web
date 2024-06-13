export const StatusCodes = {
  SUCCESS: 'SUCCESS',
  NOT_FOUND: 'NOT_FOUND',
  FAIL: 'FAIL',
  ERROR: 'ERROR'
};

export type StatusCode = keyof typeof StatusCodes;
