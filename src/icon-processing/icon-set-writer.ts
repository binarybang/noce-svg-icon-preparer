import fs from 'fs/promises';
import path from 'path';
import {ParsedIcon, ParsedIconSet} from './models';
import {IconPreparatorError} from '../utils/preparator-error';
import {log} from '../utils/logging';
import {JSDOM} from 'jsdom';
import {PACKAGE_NAME, PACKAGE_VERSION} from '../utils/pkg-constants';
import {checkIfExistingDirectory} from '../utils/file-checks';


async function writeIconSetToFile(iconSet: ParsedIconSet, destDir: string) {
  const iconSetDom = new JSDOM();
  const iconSetDoc = iconSetDom.window.document;
  iconSetDoc.appendChild(iconSetDoc.createComment(`Generated by ${PACKAGE_NAME} ${PACKAGE_VERSION} at ${new Date().toISOString()}`));

  const svgRoot = iconSetDoc.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgRoot.appendChild(iconSetDoc.createComment(`Generated by ${PACKAGE_NAME} ${PACKAGE_VERSION} at ${new Date().toISOString()}`));
  for (const icon of iconSet.icons) {
    const iconSymbol = convertIconToSymbol(icon);
    if (iconSymbol) {
      svgRoot.appendChild(iconSymbol);
    }
  }

  const iconSetFile = path.resolve(destDir, `${iconSet.name}.svg`);
  await fs.writeFile(iconSetFile, svgRoot.outerHTML, {
    encoding: 'utf-8',
  });
}

function convertIconToSymbol(icon: ParsedIcon) {
  const iconDom = new JSDOM(icon.content);
  const iconDoc = iconDom.window.document;
  const svgRoot = iconDoc.body.getElementsByTagName('svg')[0];
  const iconViewBox = svgRoot.getAttribute('viewBox');
  if (iconViewBox === null) {
    log.warn(`Icon [${icon.name}] is missing a viewBox attribute`);
    return null;
  }

  const symbolElement = iconDoc.createElementNS('http://www.w3.org/2000/svg', 'symbol');
  symbolElement.setAttribute('id', icon.name);
  symbolElement.setAttribute('viewBox', iconViewBox);
  for (const child of [].slice.call(svgRoot.children)) {
    symbolElement.appendChild(child);
  }

  return symbolElement;
}


export class IconSetWriter {

  constructor(private destinationDirectory: string) {
  }

  public async writeIconSetsToFile(iconSets: ParsedIconSet[]) {
    const { destinationDirectory } = this;
    const destDirIsValid = checkIfExistingDirectory(destinationDirectory);
    if (!destDirIsValid) {
      throw new IconPreparatorError(`Invalid destination directory for icons: ${destinationDirectory}`);
    }

    log.info('Writing icon sets...');
    for (const iconSet of iconSets) {
      log.debug(`Writing icon set ${iconSet.name} to ${destinationDirectory}`);
      await writeIconSetToFile(iconSet, destinationDirectory);
      log.debug(`Written icon set ${iconSet.name} to ${destinationDirectory}`);
    }
    log.info(`Processed ${iconSets.length} icon sets`);

  }
}
