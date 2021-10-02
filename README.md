# noce-svg-icon-preparer

A CLI utility for generating packed SVG icons and TS types and exports for usage in other projects.

[![License](https://img.shields.io/npm/l/noce-svg-icon-preparer.svg)](https://www.npmjs.com/package/noce-svg-icon-preparer)
![npm](https://img.shields.io/npm/v/noce-svg-icon-preparer)

## Reasoning

This is a tool born out of necessity to pack SVG icons in a certain way to be consumed by a Angular project.

Icon sets there are represented as SVG files containing symbols with IDs that are supposed to be used as icon names.

Angular service would register available icon sets and SVG location, download SVG files for those icon sets,
parse icons inside them and cache the results. Angular directive would then be used on SVG tag
which would take icon set and icon name as input(s), retrieve icon content from that service
(or wait until it's loaded and cached) and inject it into the SVG element.

This approach is supposed to achieve the following:
- make less requests for icon content to server (one request per icon set)
- give the developer more control over how icon is displayed since all styles may be written
right in a caller component's styles section and there's no separate `<svg-icon>` element that is usually present in
Angular SVG libraries
- make icon sets usable in IE11. This browser doesn't support `use` element to load icons by URLs (which is usually
mentioned in articles about SVG icons) so if one needed to pack icons together they'd have to find another way to do
this.

## Details

Utility needs an input root directory that contains directories that represent icon sets.

Icon set directories should have properly named SVG icons with `viewBox` attribute set.

If license needs to be included for the icon set, place it as `LICENSE` or `LICENSE.txt` file in the icon set directory.

1. Utility scans all child directories of the specified input root directory to search for SVG files and license files.
2. If child directory contains at least one SVG file it becomes an icon set.
3. Icons in each icon set are converted to `symbol` elements with ids equivalent to file names and `viewBox` attribute
set to the one that is present in SVG file.
4. Each icon set leads to generation of svg file `<icon-set-dir-name>.svg` with symbols for all icons placed there.
5. Generated TS file contains union types for icons of each processed icon set and exported array of icon set names
to be used in icon set registration.

## Installation

Use yarn or npm to install the utility

```bash
yarn add -D noce-svg-icon-preparer
npm install --save-dev noce-svg-icon-preparer
```

## Usage

```bash

# Use icons from icon-input directory,
# pack them into icon set SVGs in icon-output directory,
# put generated icon-sets.ts file into code-output directory
noce-prepare-svg-icons -id ./icon-input -iod ./icon-output -cod ./code-output
```

## Options

`-id, --input-dir <directory>`: Path to directory that contains the icon sets you want to prepare

`-iod, --icon-output-dir <directory>`: Path to directory that will contain generated SVG files

`-cod, --code-output-dir <directory>`: Path to directory that will contain generated TS types and exports

`-cof, --code-output-file <file-name>`: Name of the file that will contain generated TS types and exports. Default:
`icon-sets.ts`

`-gip, --global-icon-prefix <prefix>`: Prefix for usage in type names and export variable names. Default: `Noce`

`-pp, --pretty-print`: Specifies whether to pretty-print SVG output'. Default: `true`

`-v, ---verbose`: Enables verbose log output

Please see `src/index.ts` to see the latest set of options in case this section is outdated.


## Contributing
This is more of an exercise in making a Node.js CLI utility than a production-ready tool, so while PRs and suggestions
(using issues) are welcome, I don't guarantee I will respond/merge your changes in time.

## License
[MIT](https://choosealicense.com/licenses/mit/)
