import {asyncFilter, asyncMap, asyncMapNotNull} from '../../src/utils/async-ops';

test('async map should return mapped results', async () => {
  const asyncMapper = (num: number) => Promise.resolve(num + 1);
  const result = await asyncMap([1, 2], asyncMapper);
  expect(result).toHaveLength(2);
  expect(result[0]).toBe(2);
});


test('async filter should return filtered results', async () => {
  const asyncFilterer = (num: number) => Promise.resolve(num % 2 == 0);
  const result = await asyncFilter([1, 2], asyncFilterer);
  expect(result).toHaveLength(1);
  expect(result[0]).toBe(2);
});

test('async non-null map should return non-null mapped results', async () => {
  const asyncMapper = (num: number) => Promise.resolve(num % 2 == 0 ? null : true);
  const result = await asyncMapNotNull([1, 2], asyncMapper);
  expect(result).toHaveLength(1);
  expect(result[0]).toBe(true);
});
