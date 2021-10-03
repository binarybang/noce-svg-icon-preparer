import {directoryExists, fileExists, fileExistsAndIsSvg} from '../../src/utils/file-checks';
import mock = require('mock-fs');

beforeEach(() => {
  mock({
    'test-dir': {
      'test-file.txt': 'test',
      'test-svg.svg': '<svg></svg>'
    }
  });
});

afterEach(() => mock.restore());

describe('directoryExists', () => {
  test('should return true for existing dirs', async () => {
    const result = await directoryExists('./test-dir');
    expect(result).toBe(true);
  });

  test('should return false for non-existing dirs', async () => {
    const result = await directoryExists('./missing-dir');
    expect(result).toBe(false);
  });
});

describe('fileExists', () => {
  test('should return true for existing files', async () => {
    const result = await fileExists('./test-dir/test-file.txt');
    expect(result).toBe(true);
  });

  test('should return false for non-existing files', async () => {
    const result = await fileExists('./test-dir/missing-file.txt');
    expect(result).toBe(false);
  });
});

describe('fileExistsAndIsSvg', () => {
  test('should return true for existing SVG files', async () => {
    const result = await fileExistsAndIsSvg('./test-dir/test-svg.svg');
    expect(result).toBe(true);
  });

  test('should return false for existing non-SVG files', async () => {
    const result = await  fileExistsAndIsSvg('./test-dir/test-file.txt');
    expect(result).toBe(false);
  });

  test('should return false for non-existing files', async () => {
    const result = await  fileExistsAndIsSvg('./test-dir/missing-svg.svg');
    expect(result).toBe(false);
  });
});
