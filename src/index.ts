#!/usr/bin/env node

import { Command } from 'commander';
import {ProgramOptions} from "./utils/program-options";
import {IconSetParser} from "./icon-processing/icon-set-parser";
import {IconSetWriter} from "./icon-processing/icon-set-writer";
import {IconCodeGenerator} from "./icon-processing/icon-code-generator";

async function main() {
  const program = new Command();
  program
    .name('prepare-icons')
    .description('Prepares icon files in icon set directories for usage in Noce packages')
    .requiredOption('-id, --input-dir', 'Path to directory that contains the icon sets you want to prepare')
    .requiredOption('-iod, --icon-output-dir', 'Path to directory that will contain generated SVG files')
    .requiredOption('-cod, --code-output-dir', 'Path to directory that will contain generated TS types and exports')
    .option('-cof, --code-output-file', 'Name of the file that will contain generated TS types and exports', 'icon-sets.ts')
    .option('-gip, --global-icon-prefix', 'Prefix for usage in type names and export variable names', 'Noce');

  await program.parseAsync(process.argv);

  const options: ProgramOptions = program.opts();

  const iconParser = new IconSetParser(options.inputDirectory);
  const iconSets = await iconParser.parseIconSets();

  const iconWriter = new IconSetWriter(options.iconOutputDirectory);
  await iconWriter.writeIconSetsToFile(iconSets);

  const iconCodeGenerator = new IconCodeGenerator(options.codeOutputDirectory, options.codeOutputFile);
  await iconCodeGenerator.writeGeneratedCodeToFile(iconSets, options.globalIconPrefix);

}
main();


