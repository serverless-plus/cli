import { join } from 'path';
import { removeSync, outputFileSync } from 'fs-extra';
import { parse, readAndParse } from '../src/cli/parse';
import { fileExists } from '../src/utils';
import { AnyObject } from '../src/typings/index.d';
interface ConfigFileContent extends AnyObject {
  yml: string;
  yaml: string;
  json: string;
}

describe('Parse command test', () => {
  // inject environment variables
  process.env.REGION = 'ap-guangzhou';

  const extList = ['yml', 'yaml', 'json'];
  const configFileContent: ConfigFileContent = {
    yml: `org: orgDemo
app: appDemo
stage: dev
component: express
name: expressDemo

inputs:
  src:
    src: ./
    exclude:
      - .env
  region: \${env:REGION}
  apigatewayConf:
    protocols:
      - http
      - https
`,
    yaml: `org: orgDemo
app: appDemo
stage: dev
component: express
name: expressDemo

inputs:
  src:
    src: ./
    exclude:
      - .env
  region: \${env:REGION}
  apigatewayConf:
    protocols:
      - http
      - https
`,
    json: `{
  "org":"orgDemo",
  "app":"appDemo",
  "stage":"dev",
  "component":"express",
  "name":"expressDemo",
  "inputs":{
      "src": {
        "src": "./",
        "exclude": [".env"]
      },
      "region": "\${env:REGION}",
      "apigatewayConf": {
        "protocols": [
          "http",
          "https"
        ]
      }
  }
}
`,
  };
  const demoPath = join(__dirname, 'demo');
  const outputPath = join(__dirname, 'output');

  beforeAll(() => {
    for (let i = 0; i < extList.length; i++) {
      const ext = extList[i];
      const filename = `serverless.${ext}`;
      const configFile = join(demoPath, filename);
      const content = configFileContent[ext];

      outputFileSync(configFile, content);
    }
  });

  afterAll(() => {
    removeSync(demoPath);
    removeSync(outputPath);
  });

  for (let i = 0; i < extList.length; i++) {
    const ext = extList[i];
    const filename = `serverless.${ext}`;
    const configFile = join('demo', filename);

    test(`should success parse ${filename} file`, async () => {
      const res = parse({
        rootDir: __dirname,
        input: configFile,
      });
      expect(res).toEqual({
        org: 'orgDemo',
        app: 'appDemo',
        stage: 'dev',
        component: 'express',
        name: 'expressDemo',
        inputs: {
          src: {
            src: './',
            exclude: ['.env'],
          },
          region: 'ap-guangzhou',
          apigatewayConf: {
            protocols: ['http', 'https'],
          },
        },
      });
    });

    test(`should success parse ${filename} file using replace json`, async () => {
      const res = parse({
        rootDir: __dirname,
        input: configFile,
        replaceVars: '{"inputs":{"src":"./"}}',
      });
      expect(res).toEqual({
        org: 'orgDemo',
        app: 'appDemo',
        stage: 'dev',
        component: 'express',
        name: 'expressDemo',
        inputs: {
          src: './',
          region: 'ap-guangzhou',
          apigatewayConf: {
            protocols: ['http', 'https'],
          },
        },
      });
    });

    test(`should success parse ${filename} file using replace json with new property`, async () => {
      const res = parse({
        rootDir: __dirname,
        input: configFile,
        replaceVars: '{"inputs":{"src":"./","test":1}}',
      });
      expect(res).toEqual({
        org: 'orgDemo',
        app: 'appDemo',
        stage: 'dev',
        component: 'express',
        name: 'expressDemo',
        inputs: {
          src: './',
          test: 1,
          region: 'ap-guangzhou',
          apigatewayConf: {
            protocols: ['http', 'https'],
          },
        },
      });
    });

    test(`should success parse ${filename} file, and output to current path`, async () => {
      const res = parse({
        rootDir: __dirname,
        input: configFile,
        output: true,
      });
      expect(res).toEqual({
        org: 'orgDemo',
        app: 'appDemo',
        stage: 'dev',
        component: 'express',
        name: 'expressDemo',
        inputs: {
          src: {
            src: './',
            exclude: ['.env'],
          },
          region: 'ap-guangzhou',
          apigatewayConf: {
            protocols: ['http', 'https'],
          },
        },
      });
      expect(readAndParse(join(__dirname, configFile))).toEqual({
        data: {
          org: 'orgDemo',
          app: 'appDemo',
          stage: 'dev',
          component: 'express',
          name: 'expressDemo',
          inputs: {
            src: {
              src: './',
              exclude: ['.env'],
            },
            region: 'ap-guangzhou',
            apigatewayConf: {
              protocols: ['http', 'https'],
            },
          },
        },
        type: ext === 'json' ? 'json' : 'yaml',
      });
    });

    test(`should success parse ${filename} file, and output to target path`, async () => {
      const opFile = `${outputPath}/${filename}`;
      const res = parse({
        rootDir: __dirname,
        input: configFile,
        outputPath: opFile,
      });
      expect(res).toEqual({
        org: 'orgDemo',
        app: 'appDemo',
        stage: 'dev',
        component: 'express',
        name: 'expressDemo',
        inputs: {
          src: {
            src: './',
            exclude: ['.env'],
          },
          region: 'ap-guangzhou',
          apigatewayConf: {
            protocols: ['http', 'https'],
          },
        },
      });
      expect(fileExists(opFile)).toBe(true);
    });
  }
});
