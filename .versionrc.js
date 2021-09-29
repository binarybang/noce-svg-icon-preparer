const pkgConstants = {
  filename: './src/utils/pkg-constants.ts',
  updater: require('./scripts/extract-pkg-info')
}

module.exports = {
  bumpFiles: [pkgConstants]
}
