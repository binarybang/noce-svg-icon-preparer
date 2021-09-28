import {ParsedIconSet} from './models';
import {log} from '../utils/logging';
import fs from 'fs/promises';
import path from 'path';

/**
 * Default prefix for icon type name and exported array name.
 */
const DEFAULT_ICON_PREFIX = 'Noce';

/**
 * Generates declarations and exports for the specified icon sets for use in TS code.
 * @param iconSets Icon set data.
 * @param globalIconPrefix Prefix for encompassing icon type and export variable.
 * The default value is "Noce".
 */
function generateIconTypes(iconSets: ParsedIconSet[], globalIconPrefix: string = DEFAULT_ICON_PREFIX) {
  const iconSetTypes = iconSets.map(ics => generateTypeForIconSet(ics.name, ics.icons.map(i => i.name)));

  const iconSetNames = iconSets.map(ics => ics.name);
  const iconType = generateIconSetType(globalIconPrefix, iconSets.map(ics => ics.name));
  const iconSetExport = generateIconSetExport(globalIconPrefix, iconSetNames);

  return iconSetTypes.concat([iconType, iconSetExport]).join('\n');
}

/**
 * Generates declaration for union type <prefix>Icon that includes icons from all processed icon sets.
 * @param prefix Prefix for icon type name
 * @param iconSetNames Names of icon sets
 */
function generateIconSetType(prefix: string, iconSetNames: string[]): string {
  const preparedPrefix = preparePrefixForType(prefix);
  const iconSetTypes = iconSetNames.map(generateIconSetTypeName);
  return `export type ${preparedPrefix}Icon = ${makeLiteralString(iconSetTypes, '|')};`;
}

/**
 * Generates declaration for icon set type.
 * @param iconSetName Icon set name.
 * @param iconNames Names of all icons in the set.
 */
function generateTypeForIconSet(iconSetName: string, iconNames: string[]): string {
  const iconSetType = generateIconSetTypeName(iconSetName);
  const iconNamePrefix = iconSetName.toLowerCase();
  const preparedIconNames = iconNames.map(n => `${iconNamePrefix}/${n}`);
  return `export type ${iconSetType} = ${makeLiteralString(preparedIconNames, '|')};`;
}

/**
 * Generates exported array <prefix>IconSets of all icon set names.
 * @param prefix Prefix for the array's name..
 * @param iconSetNames Icon set names to include in the exported array.
 */
function generateIconSetExport(prefix: string, iconSetNames: string[]) {
  const preparedPrefix = preparePrefixForVariable(prefix);
  return `export const ${preparedPrefix}IconSets = [${makeLiteralString(iconSetNames, ',')}];`;
}

/**
 * Prepares prefix for use in a type name.
 * @param rawPrefix
 */
function preparePrefixForType(rawPrefix: string): string {
  return rawPrefix[0].toUpperCase() + rawPrefix.substring(1).toLowerCase();
}

/**
 * Prepares prefix for use in a variable name.
 * @param rawPrefix
 */
function preparePrefixForVariable(rawPrefix: string): string {
  return rawPrefix.toLowerCase();
}

/**
 * Generates TS string literals separated by the specified parameter..
 * @param parts String to use as literals.
 * @param separator
 */
function makeLiteralString(parts: string[], separator: string) {
  return parts.map(p => `'${p}'`).join(` ${separator} `);
}

/**
 * Generates a type name for the given icon set name.
 * @param iconSetName
 */
function generateIconSetTypeName(iconSetName: string) {
  return preparePrefixForType(iconSetName) + 'IconSet';
}

export class IconCodeGenerator {
  constructor(private destinationDirectory: string, private destinationFile: string) {
  }

  public async writeGeneratedCodeToFile(iconSets: ParsedIconSet[], globalIconPrefix: string = DEFAULT_ICON_PREFIX): Promise<void> {
    log.info('Generating type declarations and exports for icon sets...');
    const generatedCode = generateIconTypes(iconSets, globalIconPrefix);
    log.debug('Saving type declarations and exports for icon sets...');
    const fileFullName = path.join(this.destinationDirectory, this.destinationFile);
    await fs.writeFile(fileFullName, generatedCode, { encoding: 'utf-8' });
    log.info('Saved type declarations and exports for icon sets');
  }
}
