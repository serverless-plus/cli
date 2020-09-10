import { Environments } from '../typings/ci-interfaces';
import { Stages } from './stages';

class Pipeline {
  tab: string = '';
  options = {};
  stages: Stages | null;
  environments: Environments;
  agent: string = 'any';

  constructor() {
    this.tab = '';
    this.stages = null;
    this.environments = {};
    this.agent = 'any';
  }

  addEnvironment(name: string, val: any) {
    this.environments[name] = val;
  }

  addStages() {
    this.stages = new Stages(this.tab);
    return this.stages;
  }

  toString() {
    if (!this.stages) {
      return `pipeline {}`;
    }
    let env = '';
    if (Object.keys(this.environments).length) {
      env = '  environment {\n';
      Object.keys(this.environments).forEach((key) => {
        env += `    ${key} = '${this.environments[key]}'\n`;
      });
      env += '  }\n';
    }
    return `pipeline {\n  agent ${this.agent}\n${env}\n${this.stages.toString()}}\n`;
  }
}

export { Pipeline };
