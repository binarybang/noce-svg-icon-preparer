export async function asyncMap<T, U>(source: T[], mapper: (item: T) => Promise<U>): Promise<U[]> {
  return await Promise.all(source.map(mapper));
}

export async function asyncMapNotNull<T, U>(source: T[], mapper: (item: T) => Promise<U | null>): Promise<U[]> {
  const result = await asyncMap(source, mapper);
  return result.filter((item): item is U => item !== null);
}

export async function asyncFilter<T>(source: T[], predicate: (item: T) => Promise<boolean>): Promise<T[]> {
  const predicateChecker = (item: T) => predicate(item)
    .then(result => result ? item : null);
  const checkResults = await asyncMap(source, predicateChecker);
  return checkResults.filter((i): i is T => i !== null);
}
