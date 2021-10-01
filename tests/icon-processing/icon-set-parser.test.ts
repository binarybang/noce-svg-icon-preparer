import mock = require('mock-fs');
import {IconSetParser} from '../../src/icon-processing/icon-set-parser';
import {IconPreparerError} from '../../src/utils/preparer-error';

beforeEach(() => {
  mock({
    'test-input': {
      'mat-test-1': {
        'icon1.svg': '<svg><g></g><svg>',
        'icon2.svg': '<svg><g><rect></rect></g><svg>',
        'LICENSE.txt': 'license content'
      },
      'mat-test-2': {
        'icon21.svg': '<svg><g></g><svg>',
        'icon22.svg': '<svg><g><rect></rect></g><svg>',
        'icon23.svg': '<svg><g></g><svg>',
        'LICENSE': 'license content'
      },
      'mat-test-3': {
        'icon31.svg': '<svg><g></g><svg>',
        'icon32.svg': '<svg><g><rect></rect></g><svg>'
      }
    }
  });
});

afterEach(() => mock.restore());

describe('icon set parser', () => {
  let parser: IconSetParser;
  beforeEach(() => {
    parser = new IconSetParser('./test-input');
  });

  test('should be created successfully', () => {
    expect(parser).toBeInstanceOf(IconSetParser);
  });

  test('should throw if icon root dir does not exist', async () => {
    parser = new IconSetParser('./missing-dir');
    await expect(parser.parseIconSets())
      .rejects
      .toThrow(IconPreparerError);
  });

  test('should parse all available icon sets', () => {
    return parser.parseIconSets()
      .then(iconSets => {
        expect(iconSets).toBeTruthy();
        expect(iconSets).toHaveLength(3);
      });
  });

  test('should set correct icon set names', () => {
    return parser.parseIconSets()
      .then(iconSets => {
        expect(iconSets[0].name).toBe('mat-test-1');
      });
  });

  test('should parse license if available', () => {
    return parser.parseIconSets()
      .then(iconSets => {
        expect(iconSets[0].license).toBe('license content');
        expect(iconSets[1].license).toBe('license content');
      });
  });

  test('should not have license if license file is not available', () => {
    return parser.parseIconSets()
      .then(iconSets => {
        expect(iconSets[2].license).toBeNull();
      });
  });

  test('should have correct icon counts in sets', () => {
    return parser.parseIconSets()
      .then(iconSets => {
        expect(iconSets[0].icons.length).toBe(2);
        expect(iconSets[1].icons.length).toBe(3);
      });
  });

  test('should have correct icon names', () => {
    return parser.parseIconSets()
      .then(iconSets => {
        expect(iconSets[0].icons[0].name).toBe('icon1');
      });
  });
  test('should have correct icon content', () => {
    return parser.parseIconSets()
      .then(iconSets => {
        expect(iconSets[0].icons[0].content).toBe('<svg><g></g><svg>');
      });
  });
});
