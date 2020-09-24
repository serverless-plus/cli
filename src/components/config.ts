import { AnyObject } from '../typings';

interface ComponentConfig {
  org: string;
  app: string;
  stage: string;
  component: string;
  name: string;
  inputs: AnyObject;
}

// use scf component for default
function getDefaultConfig(component = 'scf'): ComponentConfig {
  return {
    org: 'orgDemo',
    app: 'appDemo',
    stage: 'dev',
    component: component,
    name: `${component}Demo`,
    inputs: {
      src: './',
    },
  };
}

export { getDefaultConfig };
