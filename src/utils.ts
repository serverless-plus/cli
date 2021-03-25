import fs from 'fs-extra';
import { AnyObject } from './typings/index';

const deepClone = (obj: AnyObject): AnyObject => {
  return JSON.parse(JSON.stringify(obj));
};

const typeOf = (obj: AnyObject): string => {
  return Object.prototype.toString.call(obj).slice(8, -1);
};

const isUndefined = (val: any): boolean => {
  return val === undefined;
};

const isObject = (obj: AnyObject): boolean => {
  return typeOf(obj) === 'Object';
};

const isEmptyObject = (obj: AnyObject): boolean => {
  return Object.keys(obj).length === 0;
};

const mergeObject = (source: AnyObject, target: AnyObject): AnyObject => {
  Object.entries(source).forEach(([key, val]) => {
    if (isObject(val) && isObject(target[key]) && target[key]) {
      source[key] = mergeObject(val, target[key]);
    } else if (target[key]) {
      source[key] = target[key];
    }
  });
  Object.entries(target).forEach(([key, val]) => {
    if (!source[key]) {
      source[key] = val;
    }
  });
  return source;
};

const endsWith = (suffix: string, str: any) => {
  if (!str) {
    return false;
  }
  const arr = str.split(suffix);
  return arr.length === 2 && arr[1] === '';
};

/**
 * Determines if a given file path is a YAML file
 */
const isYamlPath = (filePath: string): boolean =>
  endsWith('.yml', filePath) || endsWith('.yaml', filePath);

/**
 * Determines if a given file path is a JSON file
 */
const isJsonPath = (filePath: string): boolean => endsWith('.json', filePath);

/**
 * Checks if a file exist
 */
const fileExist = (filePath: string): boolean => {
  try {
    const stats = fs.lstatSync(filePath);
    return stats.isFile();
  } catch (e) {
    return false;
  }
};

const getFileExt = (filePath: string): string => {
  try {
    const arr = filePath.split('.');
    return arr[arr.length - 1];
  } catch (e) {
    return '';
  }
};

const cwdDir = process.cwd();

export {
  isObject,
  deepClone,
  isYamlPath,
  isJsonPath,
  fileExist,
  typeOf,
  mergeObject,
  getFileExt,
  isUndefined,
  isEmptyObject,
  cwdDir,
};
