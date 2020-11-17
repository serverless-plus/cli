import { join } from 'path';
import { removeSync } from 'fs-extra';
import { migrate } from '../src/cli/migrate';
import { fileExist } from '../src/utils';

// migrate results
import expressResult from './fixtures/express/result';
import scfResult from './fixtures/scf/result';
import apigwResult from './fixtures/apigw/result';
import websiteResult from './fixtures/website/result';

describe('Migrate command test', () => {
  const demoPath = join(__dirname, 'demo');
  const expressYaml = join(__dirname, 'fixtures/express', 'serverless.yml');
  const scfYaml = join(__dirname, 'fixtures/scf', 'serverless.yml');
  const apigwYaml = join(__dirname, 'fixtures/apigw', 'serverless.yml');
  const websiteYaml = join(__dirname, 'fixtures/website', 'serverless.yml');
  const bakPath = join(demoPath, 'serverless.bak.yml');

  afterAll(() => {
    removeSync(demoPath);
  });

  test(`[framework] should migrate config file success`, async () => {
    const res = await migrate({
      rootDir: demoPath,
      input: expressYaml,
    });

    expect(res).toEqual(expressResult);

    expect(fileExist(bakPath)).toBe(true);
  });

  test(`[scf] should migrate config file success`, async () => {
    const res = await migrate({
      rootDir: demoPath,
      input: scfYaml,
    });

    expect(res).toEqual(scfResult);

    expect(fileExist(bakPath)).toBe(true);
  });

  test(`[apigateway] should migrate config file success`, async () => {
    const res = await migrate({
      rootDir: demoPath,
      input: apigwYaml,
    });

    expect(res).toEqual(apigwResult);

    expect(fileExist(bakPath)).toBe(true);
  });

  test(`[website] should migrate config file success`, async () => {
    const res = await migrate({
      rootDir: demoPath,
      input: websiteYaml,
    });

    expect(res).toEqual(websiteResult);

    expect(fileExist(bakPath)).toBe(true);
  });
});
