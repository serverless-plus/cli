export interface ParseOptions {
  rootDir?: string;
  input?: string;
  output?: boolean;
  outputPath?: string;
  slsOptionsJson?: string;
  layerOptionsJson?: string;
  autoCreate?: boolean;
  component?: string;
  override?: boolean;
  // debug mode
  debug?: boolean;
}
