const pkg = require('../package.json');

module.exports.readVersion = function () {
  return '0.0.0';
}

module.exports.writeVersion = function (contents, version) {
  const pkgNameExport = `export const PACKAGE_NAME = '${pkg.name}';`;
  const pkgVersionExport = `export const PACKAGE_VERSION = '${version}';`;

  return `${pkgNameExport}\n${pkgVersionExport}`;
}

