import fs from 'fs/promises';
import path from 'path';

export async function checkIfExistingDirectory(dirPath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(dirPath);
    return stats?.isDirectory() === true;
  } catch (e) {
    return false;
  }

}

export async function checkIfSvgFile(filePath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(filePath);
    return stats && stats.isFile() && path.extname(filePath) === '.svg';
  } catch (e) {
    return false;
  }
}
