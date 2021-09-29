export interface IconDirData {
  name: string;
  path: string;
  svgFilePaths: string[];
}

export interface ParsedIcon {
  name: string;
  content: string;
}

export interface ParsedIconSet {
  name: string;
  license: string | null;
  icons: ParsedIcon[];
}
