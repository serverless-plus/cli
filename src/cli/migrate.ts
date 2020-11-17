import { resolve } from 'path';
import fse from 'fs-extra';
import YAML from 'js-yaml';
import chalk from 'chalk';
import { program } from 'commander';
import { prompt } from 'inquirer';
import { fileExist, isJsonPath, isYamlPath, getFileExt, typeOf } from '../utils';
import { AnyObject, MigrateOptions } from '../typings';
import { COMPONENTS, getDefaultConfig, isFrameworkComponent } from '../components/config';
import { MIGRATE_METHOD_MAP, SupportComponents } from '@slsplus/migrate';

/**
 * Reads a file on the file system
 */
export const readAndMigrate = (filePath: string): AnyObject => {
  const contents = fse.readFileSync(filePath, 'utf8');
  let type = '';
  let res = {};
  if (isJsonPath(filePath)) {
    type = 'json';
    res = JSON.parse(contents);
  } else if (isYamlPath(filePath)) {
    type = 'yaml';
    res = YAML.load(contents.toString());
  } else {
    throw new Error(`Unsupport file extension, can only be .yaml,.yml and .json`);
  }

  return {
    type,
    data: res,
  };
};

function outputSlsYaml({
  rootDir,
  inputPath,
  fileType,
  slsOptions,
}: {
  rootDir: string;
  inputPath: string;
  fileType: string;
  slsOptions: AnyObject;
}) {
  const ext = getFileExt(inputPath);
  const opPath = resolve(rootDir, `serverless.${ext}`);
  let outputContent = '';
  if (fileType === 'yaml') {
    outputContent = YAML.dump(slsOptions, {});
  } else {
    outputContent = JSON.stringify(slsOptions);
  }
  fse.outputFileSync(opPath, outputContent);
  console.log(chalk.green(`\nMigrate success, and output to file path ${opPath}\n`));
}

function backupYaml(rootDir: string, inputPath: string) {
  const ext = getFileExt(inputPath);
  const backupPath = resolve(rootDir, `serverless.bak.${ext}`);
  fse.outputFileSync(backupPath, fse.readFileSync(inputPath));
}

export async function migrate({
  rootDir = process.cwd(),
  input,
  component,
}: MigrateOptions): Promise<AnyObject> {
  let inputPath = '';
  if (input) {
    inputPath = resolve(rootDir, input);
  } else {
    inputPath = resolve(rootDir, 'serverless.yml');
  }

  // if serveless config file not exit
  // create a default one
  let currentComponent = component;
  if (!fileExist(inputPath)) {
    if (!currentComponent) {
      const answers = await prompt([
        {
          type: 'list',
          name: 'component',
          message: 'Please select a component',
          default: 'scf',
          choices: COMPONENTS,
        },
      ]);
      currentComponent = answers.component;
    }
    const defaultConfig = getDefaultConfig(currentComponent);
    const defaultContent = YAML.dump(defaultConfig);
    fse.outputFileSync(inputPath, defaultContent);
  } else {
    // backup old config
    backupYaml(rootDir, inputPath);
  }

  const { data: slsOptions, type } = readAndMigrate(inputPath);
  currentComponent = slsOptions.component;

  let migrateMethod = MIGRATE_METHOD_MAP.framework;
  if (!isFrameworkComponent(currentComponent)) {
    migrateMethod = MIGRATE_METHOD_MAP[currentComponent as SupportComponents];
  }

  if (migrateMethod && typeOf(migrateMethod) === 'Function') {
    slsOptions.inputs = migrateMethod(slsOptions.inputs);
  }

  outputSlsYaml({
    rootDir,
    inputPath,
    fileType: type,
    slsOptions,
  });

  return slsOptions;
}

const migrateCommand = (): void => {
  program
    .command('migrate')
    .description('Migrate old serverless config to uniform config')
    .option('-i, --input [input]', 'source serverless config file path')
    .option('-r, --root [rootDir]', 'root directory for migrate command running')
    .option('-c, --component [component]', 'serverless component name')
    .action((options) => {
      migrate({
        rootDir: options.rootDir,
        input: options.input,
        component: options.component,
      });
    });
};

export { migrateCommand };
