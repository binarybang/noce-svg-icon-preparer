import {asyncFilter, asyncMap, asyncMapNotNull} from '../../src/utils/async-ops';

test('async map should return mapped results', () => {
  const asyncMapper = (num: number) => Promise.resolve(num + 1);
  return asyncMap([1, 2], asyncMapper)
    .then(r => {
      expect(r).toHaveLength(2);
      expect(r[0]).toBe(2);
    });
});


test('async filter should return filtered results', () => {
  const asyncFilterer = (num: number) => Promise.resolve(num % 2 == 0);
  return asyncFilter([1, 2], asyncFilterer)
    .then(r => {
      expect(r).toHaveLength(1);
      expect(r[0]).toBe(2);
    });
});

test('async non-null map should return non-null mapped results', () => {
  const asyncMapper = (num: number) => Promise.resolve(num % 2 == 0 ? null : true);
  return asyncMapNotNull([1, 2], asyncMapper)
    .then(r => {
      expect(r).toHaveLength(1);
      expect(r[0]).toBe(true);
    });
});
