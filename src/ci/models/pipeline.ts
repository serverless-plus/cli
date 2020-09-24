import { Environments, PipelineInterface, StagesInterface } from '../../typings/ci';
import { Stages } from './stages';

class Pipeline implements PipelineInterface {
  tab: string;
  stages: StagesInterface | null;
  environments: Environments;
  agent: string;

  constructor() {
    this.tab = '';
    this.stages = null;
    this.environments = {};
    this.agent = 'any';
  }

  addEnvironment(name: string, val: string): void {
    this.environments[name] = val;
  }

  addStages(): StagesInterface {
    this.stages = new Stages(this.tab);
    return this.stages;
  }

  toString(): string {
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
