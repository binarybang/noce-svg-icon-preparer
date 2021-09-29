const pkgJson = {
  filename: './package.json',
  "type": 'json'
}

const pkgConstants = {
  filename: './src/utils/pkg-constants.ts',
  updater: require('./scripts/extract-pkg-info')
}

module.exports = {
  packageFiles: [pkgJson],
  bumpFiles: [pkgJson, pkgConstants]
}
