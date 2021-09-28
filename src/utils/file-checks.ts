import fs from "fs/promises";
import path from "path";

export async function checkIfExistingDirectory(path: string) {
  const stats = await fs.stat(path);
  return stats?.isDirectory() === true;
}

export async function checkIfSvgFile(filePath: string) {
  const stats = await fs.stat(filePath);
  return stats && stats.isFile() && path.extname(filePath) === '.svg';
}
