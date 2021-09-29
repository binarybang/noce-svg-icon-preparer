const fs = require('fs');
const pkg = require('../package.json');

function writePackageConstants(version) {
  const pkgNameExport = `export const PACKAGE_NAME = '${pkg.name}';`;
  const pkgVersionExport = `export const PACKAGE_VERSION = '${version}';`;

  fs.writeFileSync('./src/utils/pkg-constants.ts', `${pkgNameExport}\n${pkgVersionExport}`);
}

module.exports.readVersion = function () {
  return '0.0.0';
}

module.exports.writeVersion = function (contents, version) {
  writePackageConstants(version);
}

