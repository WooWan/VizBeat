export function compareShallowArray(arr1: unknown[] = [], arr2: unknown[] = []): boolean {
  if (arr1.length !== arr2.length) return false;

  const isEqual = arr1.every((item, index) => item === arr2[index]);
  return isEqual;
}
