import { resolve } from 'path';
import fse from 'fs-extra';
import YAML from 'js-yaml';
import traverse from 'traverse';
import chalk from 'chalk';
import { fileExists, isJsonPath, isYamlPath, getFileExt } from '../utils';
import { AnyObject, ParseOptions } from '../typings';

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

export function parse({
  rootDir = process.cwd(),
  input,
  output,
  outputPath,
  autoCreate = false,
  replaceVars = '{}',
}: ParseOptions): AnyObject {
  let inputPath = '';
  if (input) {
    inputPath = resolve(rootDir, input);
  } else {
    inputPath = resolve(rootDir, 'serverless.yml');
  }

  if (!fileExists(inputPath)) {
    if (autoCreate) {
      const defaultContent = YAML.dump({ createdByCli: true });
      fse.outputFileSync(inputPath, defaultContent);
    } else {
      throw new Error(`File does not exist at this path ${inputPath}`);
    }
  }

  const { data: parseObj, type } = readAndParse(inputPath, autoCreate);
  const parseRes = Object.assign(parseObj, JSON.parse(replaceVars));

  // if need write parse res back to config file
  if (output || outputPath) {
    const ext = getFileExt(inputPath);
    let opPath = resolve(rootDir, `serverless.${ext}`);
    if (outputPath) {
      opPath = resolve(rootDir, outputPath);
    }
    let outputContent = '';
    if (type === 'yaml') {
      outputContent = YAML.dump(parseRes, {});
    } else {
      outputContent = JSON.stringify(parseRes);
    }
    fse.outputFileSync(opPath, outputContent);
    console.log(chalk.green(`\nParse success, and output to file path ${opPath}\n`));
  } else {
    console.log(chalk.green('\nParse Result:\n'));
    console.log(JSON.stringify(parseRes, null, 2));
  }

  return parseRes;
}
