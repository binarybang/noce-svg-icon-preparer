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
  test('should return true for existing dirs', () => {
    return directoryExists('./test-dir').then(r => {
      expect(r).toBe(true);
    });
  });

  test('directoryExists should return false for non-existing dirs', () => {
    return directoryExists('./missing-dir').then(r => {
      expect(r).toBe(false);
    });
  });
});

describe('fileExists', () => {
  test('should return true for existing files', () => {
    return fileExists('./test-dir/test-file.txt').then(r => {
      expect(r).toBe(true);
    });
  });

  test('should return false for non-existing files', () => {
    return fileExists('./test-dir/missing-file.txt').then(r => {
      expect(r).toBe(false);
    });
  });
});

describe('fileExistsAndIsSvg', () => {
  test('should return true for existing SVG files', () => {
    return fileExistsAndIsSvg('./test-dir/test-svg.svg').then(r => {
      expect(r).toBe(true);
    });
  });

  test('should return false for existing non-SVG files', () => {
    return fileExistsAndIsSvg('./test-dir/test-file.txt').then(r => {
      expect(r).toBe(false);
    });
  });

  test('should return false for non-existing files', () => {
    return fileExistsAndIsSvg('./test-dir/missing-svg.svg').then(r => {
      expect(r).toBe(false);
    });
  });
});
