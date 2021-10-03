#!/usr/bin/env node

import {Command} from 'commander';
import {ProgramOptions} from './utils/program-options';
import {IconSetParser} from './icon-processing/icon-set-parser';
import {IconSetWriter} from './icon-processing/icon-set-writer';
import {IconCodeGenerator} from './icon-processing/icon-code-generator';
import {IconPreparerError} from './utils/preparer-error';
import {log} from './utils/logging';

async function runProgram() {
  const program = new Command();
  program
    .name('prepare-icons')
    .description('Prepares icon files in icon set directories for usage in Noce packages')
    .requiredOption('-id, --input-dir <directory>', 'Path to directory that contains the icon sets you want to prepare')
    .requiredOption('-iod, --icon-output-dir <directory>', 'Path to directory that will contain generated SVG files')
    .option(
      '-cod, --code-output-dir <directory>',
      'Path to directory that will contain generated TS types and exports. If option is not specified, TS file will not be generated')
    .option('-cof, --code-output-file <file-name>', 'Name of the file that will contain generated TS types and exports', 'icon-sets.ts')
    .option('-gip, --global-icon-prefix <prefix>', 'Prefix for usage in type names and export variable names', 'Noce')
    .option('-pp, --pretty-print', 'Specifies whether to pretty-print SVG output', true)
    .option('-v, ---verbose', 'Enables verbose log output');

  await program.parseAsync(process.argv);

  const options: ProgramOptions = program.opts();

  const iconParser = new IconSetParser(options.inputDir);
  const iconSets = await iconParser.parseIconSets();

  const iconWriter = new IconSetWriter(options.iconOutputDir, options.prettyPrint);
  await iconWriter.writeIconSetsToFile(iconSets);

  if (options.codeOutputDir) {
    const iconCodeGenerator = new IconCodeGenerator(options.codeOutputDir, options.codeOutputFile);
    await iconCodeGenerator.writeGeneratedCodeToFile(iconSets, options.globalIconPrefix);
  }

}

async function main() {
  try {
    await runProgram();
  } catch (e) {
    if (e instanceof IconPreparerError) {
      log.error('Error occurred while preparing icons', e);
    } else {
      log.error('Unknown error occurred while preparing icons', e);
    }
    process.exit(1);
  }
}

main();


