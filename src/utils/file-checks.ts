import {promises as fs} from 'fs';
import path from 'path';

export async function directoryExists(dirPath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(dirPath);
    return stats.isDirectory();
  } catch (e) {
    return false;
  }
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(filePath);
    return stats.isFile();
  } catch (e) {
    return false;
  }
}

export async function fileExistsAndIsSvg(filePath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(filePath);
    return stats && stats.isFile() && path.extname(filePath) === '.svg';
  } catch (e) {
    return false;
  }
}
