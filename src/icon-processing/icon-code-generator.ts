import {ParsedIconSet} from './models';
import {log} from '../utils/logging';
import fs from 'fs/promises';
import path from 'path';
import {directoryExists} from '../utils/file-checks';
import {IconPreparerError} from '../utils/preparer-error';
import {JSDOM} from 'jsdom';

function normalizeIconSetName(iconSetName: string) {
  return iconSetName.replace(/[^a-zA-Z0-9]/g, '');
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
  return parts.map(p => `'${p}'`).join(separator);
}

/**
 * Generates a type name for the given icon set name.
 * @param iconSetName
 */
function generateIconSetTypeName(iconSetName: string) {
  return preparePrefixForType(normalizeIconSetName(iconSetName)) + 'IconSet';
}

/**
 * Default prefix for icon type name and exported array name.
 */
const DEFAULT_ICON_PREFIX = 'Noce';

/**
 * Generates declaration for union type <prefix>Icon that includes icons from all processed icon sets.
 * @param prefix Prefix for icon type name
 * @param iconSetNames Names of icon sets
 */
function generateIconSetType(prefix: string, iconSetNames: string[]): string {
  const preparedPrefix = preparePrefixForType(prefix);
  const iconSetTypes = iconSetNames.map(generateIconSetTypeName);
  return `export type ${preparedPrefix}Icon = ${makeLiteralString(iconSetTypes, ' | ')};`;
}

/**
 * Generates exported array <prefix>IconSets of all icon set names.
 * @param prefix Prefix for the array's name..
 * @param iconSetNames Icon set names to include in the exported array.
 */
function generateIconSetExport(prefix: string, iconSetNames: string[]) {
  const preparedPrefix = preparePrefixForVariable(prefix);
  return `export const ${preparedPrefix}IconSets = [${makeLiteralString(iconSetNames, ', ')}];`;
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
  return `export type ${iconSetType} = ${makeLiteralString(preparedIconNames, ' | ')};`;
}

function filterValidIconNames(iconSet: ParsedIconSet): string[] {
  return iconSet.icons
    .filter(i => {
      const iconDom = new JSDOM(i.content);
      const svgRoot = iconDom.window.document.getElementsByTagName('svg');
      return svgRoot.length === 1 && svgRoot[0].getAttribute('viewBox');
    })
    .map(i => i.name);
}

/**
 * Generates declarations and exports for the specified icon sets for use in TS code.
 * @param iconSets Icon set data.
 * @param globalIconPrefix Prefix for encompassing icon type and export variable.
 * The default value is "Noce".
 */
function generateIconTypes(iconSets: ParsedIconSet[], globalIconPrefix: string = DEFAULT_ICON_PREFIX) {
  const iconSetTypes = iconSets.map(ics => generateTypeForIconSet(ics.name, filterValidIconNames(ics)));

  const iconSetNames = iconSets.map(ics => ics.name);
  const iconType = generateIconSetType(globalIconPrefix, iconSets.map(ics => ics.name));
  const iconSetExport = generateIconSetExport(globalIconPrefix, iconSetNames);

  return iconSetTypes.concat([iconType, iconSetExport]).join('\n');
}

/**
 * Provides generation of TS types and exports for icon sets.
 */
export class IconCodeGenerator {
  constructor(private destinationDirectory: string, private destinationFile: string) {
  }

  /**
   * Generates TS types and exports for specified icon sets
   * and writes them to a file set by constructor.
   * @param iconSets Icon set data.
   * @param globalIconPrefix Prefix for icon set types and export variable.
   */
  public async writeGeneratedCodeToFile(iconSets: ParsedIconSet[], globalIconPrefix: string = DEFAULT_ICON_PREFIX): Promise<void> {
    log.debug('Checking validity of icon root directory...');
    const { destinationDirectory, destinationFile } = this;

    const destDirIsValid = await directoryExists(destinationDirectory);
    if (!destDirIsValid) {
      throw new IconPreparerError(`Invalid output dir: ${destinationDirectory}`);
    }

    log.info('Generating type declarations and exports for icon sets...');
    const generatedCode = generateIconTypes(iconSets, globalIconPrefix);

    log.debug('Saving type declarations and exports for icon sets...');
    const fileFullName = path.join(destinationDirectory, destinationFile);

    await fs.writeFile(fileFullName, generatedCode, { encoding: 'utf-8' });
    log.info('Saved type declarations and exports for icon sets');
  }
}
