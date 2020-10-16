import YAML from 'js-yaml';
import fse from 'fs-extra';
import { LayerOptions, AnyObject } from '../typings';

function createLayerConfig(
  filePath: string,
  { org, app, stage = 'dev', runtime }: LayerOptions,
): AnyObject {
  const defaultConfig = {
    org,
    app,
    stage,
    component: 'layer',
    name: `${app}-layer`,
    inputs: {
      name: `${app}-layer`,
      src: {
        src: '../node_modules',
        targetDir: '/node_modules',
      },
      runtimes: [runtime],
    },
  };

  const content = YAML.dump(defaultConfig);

  fse.outputFileSync(filePath, content);

  return defaultConfig;
}

export { createLayerConfig };
