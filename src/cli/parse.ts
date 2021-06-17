import { join, resolve } from 'path';
import fse from 'fs-extra';
import YAML from 'js-yaml';
import traverse from 'traverse';
import chalk from 'chalk';
import { program } from 'commander';
import { fileExist, isJsonPath, isYamlPath, getFileExt, mergeObject } from '../utils';
import { AnyObject, ParseOptions } from '../typings';
import { getDefaultConfig } from '../components/config';
import { createLayerConfig } from '../components/layer';

/**
 * Resolves any variables that require resolving
 * This currently supports only ${env:xxx}.
 */
const resolveVariables = (inputs: AnyObject): AnyObject => {
  const regex = /\${(\w*:?[\w\d.-]+)}/g;
  let variableResolved = false;
  const resolvedInputs = traverse(inputs).forEach(function(value) {
    const matches = typeof value === 'string' ? value.match(regex) : null;
    if (matches) {
      let newValue = value;
      for (const match of matches) {
        // Search for ${env:}
        if (/\${env:(\w*[\w.-_]+)}/g.test(match)) {
          const referencedPropertyPath = match.substring(2, match.length - 1).split(':');
          newValue = process.env[referencedPropertyPath[1]];
          variableResolved = true;
          if (match === value) {
            newValue = process.env[referencedPropertyPath[1]];
          } else {
            newValue = value.replace(match, process.env[referencedPropertyPath[1]]);
          }
        }
      }
      this.update(newValue);
    }
  });
  if (variableResolved) {
    return resolveVariables(resolvedInputs);
  }
  return resolvedInputs;
};

/**
 * Reads a file on the file system
 */
export const readAndParse = (filePath: string, options = {}): AnyObject => {
  const contents = fse.readFileSync(filePath, 'utf8');
  let type = '';
  let res = {};
  if (isJsonPath(filePath)) {
    type = 'json';
    res = JSON.parse(contents);
  } else if (isYamlPath(filePath)) {
    type = 'yaml';
    res = YAML.load(contents.toString(), Object.assign(options, { filename: filePath }));
  } else {
    throw new Error(`Unsupport file extension, can only be .yaml,.yml and .json`);
  }

  return {
    type,
    data: resolveVariables(res),
  };
};

function generateLayerYaml(rootDir: string, slsOptions: AnyObject, layerOptions = '') {
  // if get layer options, try to create it
  if (layerOptions && JSON.parse(layerOptions)) {
    // 1. create layer serverless.yml
    const layerPath = join(rootDir, 'layer/serverless.yml');
    const layerConfig = createLayerConfig(layerPath, JSON.parse(layerOptions));
    // 2. update project serverless.yml
    slsOptions.inputs = slsOptions.inputs || {};
    slsOptions.inputs.layers = slsOptions.inputs.layers || [];
    slsOptions.inputs.layers.push({
      name: '${output:${stage}:${app}:' + layerConfig.name + '.name}',
      version: '${output:${stage}:${app}:' + layerConfig.name + '.version}',
    });
  }
  return slsOptions;
}

function outputSlsYaml({
  rootDir,
  inputPath,
  fileType,
  slsOptions,
  output,
  outputPath,
  debug,
}: {
  rootDir: string;
  inputPath: string;
  fileType: string;
  slsOptions: AnyObject;
  output: boolean;
  outputPath: string | undefined;
  debug: boolean;
}) {
  // if need write parse res back to config file
  if (output || outputPath) {
    const ext = getFileExt(inputPath);
    let opPath = resolve(rootDir, `serverless.${ext}`);
    if (outputPath) {
      opPath = resolve(rootDir, outputPath);
    }
    let outputContent = '';
    if (fileType === 'yaml') {
      outputContent = YAML.dump(slsOptions, {});
    } else {
      outputContent = JSON.stringify(slsOptions);
    }
    fse.outputFileSync(opPath, outputContent);
    console.log(chalk.green(`\nParse success, and output to file path ${opPath}\n`));
  } else {
    if (debug) {
      console.log(chalk.green('\nParse Result:\n'));
      console.log(JSON.stringify(slsOptions, null, 2));
    }
  }
}

export function parse({
  rootDir = process.cwd(),
  input,
  output = false,
  outputPath,
  autoCreate = false,
  slsOptionsJson = '{}',
  layerOptionsJson,
  component,
  override = false,
  debug = false,
}: ParseOptions): AnyObject {
  let inputPath = '';
  if (input) {
    inputPath = resolve(rootDir, input);
  } else {
    inputPath = resolve(rootDir, 'serverless.yml');
  }

  // if serveless config file not exit and autoCreate is true
  // try to create a default one
  if (!fileExist(inputPath)) {
    if (autoCreate) {
      const defaultConfig = getDefaultConfig(component);
      const defaultContent = YAML.dump(defaultConfig);
      fse.outputFileSync(inputPath, defaultContent);
    } else {
      throw new Error(`File does not exist at this path ${inputPath}`);
    }
  }

  const { data: parseObj, type } = readAndParse(inputPath, autoCreate);
  let slsOptions = override
    ? JSON.parse(slsOptionsJson)
    : mergeObject(parseObj, JSON.parse(slsOptionsJson));

  slsOptions = generateLayerYaml(rootDir, slsOptions, layerOptionsJson);

  outputSlsYaml({
    rootDir,
    inputPath,
    fileType: type,
    slsOptions,
    output,
    outputPath,
    debug,
  });

  return slsOptions;
}

const parseCommand = (): void => {
  program
    .command('parse')
    .description(
      'parse serverless config file with costomize and environment variables replacement',
    )
    .option('-i, --input [input]', 'source serverless config file path')
    .option('-o, --output', 'whether output parse result to input serverless config file', false)
    .option(
      '-O, --output-path [outputPath]',
      'output parse result to target serverless config file path',
    )
    .option('-r, --root [rootDir]', 'root directory for parse command running')
    .option('-a, --auto-create', 'whether auto create serverless config file', false)
    .option('-c, --component [component]', 'serverless component name')
    .option('-s, --sls-options [slsOptions]', 'serverless config')
    .option('-l, --layer-options [layerOptions]', 'serverless layer config')
    .option('-or, --override [override]', 'override serverless config')
    .action((options) => {
      parse({
        rootDir: options.rootDir,
        input: options.input,
        output: options.output,
        outputPath: options.outputPath,
        slsOptionsJson: options.slsOptions,
        layerOptionsJson: options.layerOptions,
        autoCreate: options.autoCreate,
        component: options.component,
        override: options.override,
      });
    });
};

export { parseCommand };
