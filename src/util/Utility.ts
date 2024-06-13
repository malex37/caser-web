export function isEmpty(obj: any): boolean {
  //@ts-ignore next-line
  for (const prop in obj) {
    return false;
  }
  return true;
}
