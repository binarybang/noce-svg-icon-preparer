import fs from 'fs/promises';
import path from 'path';
import {log} from "../utils/logging";
import {IconDirData, ParsedIcon, ParsedIconSet} from "./models";
import {IconPreparatorError} from "../utils/preparator-error";
import {asyncFilter, asyncMap, asyncMapNotNull} from "../utils/async-ops";
import {checkIfExistingDirectory, checkIfSvgFile} from "../utils/file-checks";

async function scanSvgIcons(iconDirPath: string): Promise<IconDirData | null> {
  if (await checkIfExistingDirectory(iconDirPath)) {
    const dirContents = await fs.readdir(iconDirPath);
    const svgFiles = await asyncFilter(dirContents, checkIfSvgFile);
    return {
      name: path.dirname(iconDirPath),
      path: iconDirPath,
      svgFilePaths: svgFiles
    };
  } else {
    return null;
  }
}

async function extractIconDir(iconDirData: IconDirData): Promise<ParsedIconSet> {
  log.info(`Parsing icon set ${iconDirData.name}`);
  const icons = await asyncMap(iconDirData.svgFilePaths, extractIconFromFile);
  log.info(`Parsed icon set ${iconDirData.name}`);
  return {
    name: iconDirData.name,
    icons
  };
}

async function extractIconFromFile(svgFilePath: string): Promise<ParsedIcon> {
  const content = await fs.readFile(svgFilePath, {
    encoding: 'utf-8'
  });

  return {
    name: path.basename(svgFilePath, path.extname(svgFilePath)),
    content
  };
}

export class IconSetParser {
    constructor(private iconRootDirectory: string) {
    }

    public async parseIconSets(): Promise<ParsedIconSet[]> {
      const iconDirData = await this.scanRootDirectory();

      const iconSets = await asyncMap(iconDirData, extractIconDir);
      log.info('Parsed all icon sets');

      return iconSets;
    }

    private async scanRootDirectory(): Promise<IconDirData[]> {
        log.debug("Checking validity of icon root directory...");

        const rootDirIsValid = checkIfExistingDirectory(this.iconRootDirectory);
        if (!rootDirIsValid) {
            throw new IconPreparatorError(`Invalid icon root dir: ${this.iconRootDirectory}`);
        }

        log.info("Scanning directory for icon sets...");

        const rootDirContents = await fs.readdir(this.iconRootDirectory);
        log.debug(`Found ${rootDirContents.length} entries in icon root directory`);

        const iconDirs = await asyncMapNotNull(rootDirContents, scanSvgIcons);
        const totalIconCount = iconDirs.reduce((s, e) => e.svgFilePaths.length + s, 0);

        log.info(`Found ${iconDirs.length} icon sets, ${totalIconCount} icons in total`);

        return iconDirs;
    }
}
