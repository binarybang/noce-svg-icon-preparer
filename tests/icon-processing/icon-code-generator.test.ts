import mock from 'mock-fs';
import {ParsedIconSet} from '../../src/icon-processing/models';
import {IconPreparerError} from '../../src/utils/preparer-error';
import {IconCodeGenerator} from '../../src/icon-processing/icon-code-generator';
import fs from 'fs';

beforeEach(() => {
  mock({
    'output-dir': {
    }
  });
});

describe('icon code generator', () => {
  let generator: IconCodeGenerator;
  let iconSetsToWrite: ParsedIconSet[];

  beforeEach(() => {
    generator = new IconCodeGenerator('./output-dir', 'models.ts');
    iconSetsToWrite = [
      {
        'name': 'mat-test-1',
        'license': 'license content',
        'icons': [
          {
            'name': 'icon1',
            'content': '<svg viewBox="0 0 10 10"><g></g></svg>'
          },
          {
            'name': 'icon2',
            'content': '<svg><g><rect></rect></g></svg>'
          }
        ]
      },
      {
        'name': 'mat-test-2',
        'license': null,
        'icons': [
          {
            'name': 'icon21',
            'content': '<svg viewBox="0 0 10 10"><g></g></svg>'
          },
          {
            'name': 'icon22',
            'content': '<svg viewBox="0 0 10 10"><g><rect></rect></g></svg>'
          }
        ]
      }
    ];
  });

  test('should be created successfully', () => {
    expect(generator).toBeInstanceOf(IconCodeGenerator);
  });

  test('should throw error if output dir is invalid', async () => {
    generator = new IconCodeGenerator('./missing-dir', 'models.ts');
    await expect(generator.writeGeneratedCodeToFile(iconSetsToWrite))
      .rejects
      .toThrow(IconPreparerError);
  });

  test('should generate types for icon sets', async () => {
    return generator.writeGeneratedCodeToFile(iconSetsToWrite)
      .then(() => {
        const generatedCode = fs.readFileSync('./output-dir/models.ts', {encoding: 'utf-8'});
        expect(generatedCode).toContain('export type Mattest1IconSet = \'mat-test-1/icon1\';');
        expect(generatedCode).toContain('export type Mattest2IconSet = \'mat-test-2/icon21\' | \'mat-test-2/icon22\';');
      });
  });

  test('should generate union type for icon sets', async () => {
    return generator.writeGeneratedCodeToFile(iconSetsToWrite)
      .then(() => {
        const generatedCode = fs.readFileSync('./output-dir/models.ts', {encoding: 'utf-8'});
        expect(generatedCode).toContain('export type NoceIcon = \'Mattest1IconSet\' | \'Mattest2IconSet\';');
      });
  });

  test('should generate union type with custom prefix if specified', async () => {
    return generator.writeGeneratedCodeToFile(iconSetsToWrite, 'TestPrefix')
      .then(() => {
        const generatedCode = fs.readFileSync('./output-dir/models.ts', {encoding: 'utf-8'});
        expect(generatedCode).toContain('export type TestprefixIcon = \'Mattest1IconSet\' | \'Mattest2IconSet\';');
      });
  });

  test('should generate exported icon set names', async () => {
    return generator.writeGeneratedCodeToFile(iconSetsToWrite)
      .then(() => {
        const generatedCode = fs.readFileSync('./output-dir/models.ts', {encoding: 'utf-8'});
        expect(generatedCode).toContain('export const noceIconSets = [\'mat-test-1\', \'mat-test-2\'];');
      });
  });

  test('should generate exported icon set names with custom prefix if specified', async () => {
    return generator.writeGeneratedCodeToFile(iconSetsToWrite, 'TestPrefix')
      .then(() => {
        const generatedCode = fs.readFileSync('./output-dir/models.ts', {encoding: 'utf-8'});
        expect(generatedCode).toContain('export const testprefixIconSets = [\'mat-test-1\', \'mat-test-2\'];');
      });
  });
});
