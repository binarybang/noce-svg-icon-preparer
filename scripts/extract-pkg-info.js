const fs = require('fs/promises');
const pkg = require('../package.json');

const pkgNameExport = `export const PACKAGE_NAME = '${pkg.name}';`;
const pkgVersionExport = `export const PACKAGE_VERSION = '${pkg.version}';`;

fs.writeFile('./src/utils/pkg-constants.ts', `${pkgNameExport}\n${pkgVersionExport}`)
  .then(() => process.exit(0))
  .catch(() => process.exit(1));

