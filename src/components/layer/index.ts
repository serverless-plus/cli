import YAML from 'js-yaml';
import fse from 'fs-extra';
import { LayerOptions, AnyObject } from '../../typings';

function createLayerConfig(
  filePath: string,
  { org, app, stage = 'dev', runtime, name, region = 'ap-guangzhou' }: LayerOptions,
): AnyObject {
  const layerName = name ? name : `${app}-layer`;
  const defaultConfig = {
    org,
    app,
    stage,
    component: 'layer',
    name: layerName,
    inputs: {
      name: layerName,
      region,
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
