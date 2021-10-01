import mock from 'mock-fs';
import {IconSetWriter} from '../../src/icon-processing/icon-set-writer';
import {ParsedIconSet} from '../../src/icon-processing/models';
import {IconPreparerError} from '../../src/utils/preparer-error';
import fs from 'fs';
import {DOMParser} from 'xmldom';

beforeEach(() => {
  mock({
    'output-dir': {
    }
  });
});

describe('icon set writer', () => {
  let writer: IconSetWriter;
  let iconSetsToWrite: ParsedIconSet[];
  const parser = new DOMParser();

  beforeEach(() => {
    writer = new IconSetWriter('./output-dir', false);
    iconSetsToWrite = [
      {
        'name': 'mat-test-1',
        'license': 'license content',
        'icons': [
          {
            'name': 'icon1',
            'content': '<svg viewBox="0 0 10 10"><g></g><svg>'
          },
          {
            'name': 'icon2',
            'content': '<svg><g><rect></rect></g><svg>'
          }
        ]
      },
      {
        'name': 'mat-test-2',
        'license': null,
        'icons': [
          {
            'name': 'icon21',
            'content': '<svg viewBox="0 0 10 10"><g></g><svg>'
          },
          {
            'name': 'icon22',
            'content': '<svg viewBox="0 0 10 10"><g><rect></rect></g><svg>'
          },
          {
            'name': 'icon23',
            'content': '<svg viewBox="0 0 10 10"><g></g><svg>'
          }
        ]
      }
    ];
  });

  test('should be created successfully', () => {
    expect(writer).toBeInstanceOf(IconSetWriter);
  });

  test('should throw error if output dir is invalid', async () => {
    writer = new IconSetWriter('./missing-dir', false);
    await expect(writer.writeIconSetsToFile(iconSetsToWrite))
      .rejects
      .toThrow(IconPreparerError);
  });

  test('should write all available icon sets', () => {
    return writer.writeIconSetsToFile(iconSetsToWrite)
      .then(() => {
        const contents = fs.readdirSync('./output-dir');
        expect(contents.length).toBe(2);
      });
  });

  test('should use correct names for icon set files', () => {
    return writer.writeIconSetsToFile(iconSetsToWrite)
      .then(() => {
        const contents = fs.readdirSync('./output-dir');
        expect(contents[0]).toBe('mat-test-1.svg');
      });
  });

  test('should write all valid icons into icon set files', () => {
    return writer.writeIconSetsToFile(iconSetsToWrite)
      .then(() => {
        const contents = fs.readFileSync('./output-dir/mat-test-2.svg', {encoding: 'utf-8'});
        const parsedContents = parser.parseFromString(contents);
        expect(parsedContents.getElementsByTagName('symbol').length).toBe(3);
      });
  });

  test('should skip icons without viewBox', () => {
    return writer.writeIconSetsToFile(iconSetsToWrite)
      .then(() => {
        const contents = fs.readFileSync('./output-dir/mat-test-1.svg', {encoding: 'utf-8'});
        const parsedContents = parser.parseFromString(contents);
        expect(parsedContents.getElementsByTagName('symbol').length).toBe(1);
      });
  });

  test('should use correct ids for icon symbols', () => {
    return writer.writeIconSetsToFile(iconSetsToWrite)
      .then(() => {
        const contents = fs.readFileSync('./output-dir/mat-test-1.svg', {encoding: 'utf-8'});
        const parsedContents = parser.parseFromString(contents);
        expect(parsedContents.getElementsByTagName('symbol')[0].getAttribute('id')).toBe('icon1');
      });
  });

  test('should include license content if available', () => {
    return writer.writeIconSetsToFile(iconSetsToWrite)
      .then(() => {
        const contents = fs.readFileSync('./output-dir/mat-test-1.svg', {encoding: 'utf-8'});
        expect(contents).toContain('<!--license content-->');
      });
  });

});
