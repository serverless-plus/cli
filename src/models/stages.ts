import { Steps } from './steps';
import { Environments } from '../typings/ci-interfaces';

class Stage {
  tab: string;
  name: string;
  steps: Steps | null;
  environments: Environments = {};

  constructor(name: string, ...args: any) {
    this.name = name;
    this.steps = null;
    this.environments = {};
    if (args.length) {
      const idx = args.length - 1;
      this.tab = `${args[idx]}  `;
    } else {
      this.tab = '  ';
    }
  }

  addEnvironment(name: string, val: any) {
    this.environments[name] = val;
  }

  addSteps() {
    this.steps = new Steps(this.tab);
    return this.steps;
  }

  toString() {
    if (!this.steps) {
      return '';
    }
    let env = '';
    if (Object.keys(this.environments).length) {
      env = `${this.tab}  environment {\n`;

      Object.keys(this.environments).forEach((key) => {
        env += `${this.tab}    ${key} = '${this.environments[key]}'\n`;
      });

      env += `${this.tab}  }\n`;
    }

    const steps = this.steps.toString();
    return `${this.tab}stage("${this.name}") {\n${env}${steps}${this.tab}}\n`;
  }
}

class Stages {
  tab: string;
  stages: Stage[];

  constructor(...args: any) {
    this.stages = [];
    if (args.length) {
      const idx = args.length - 1;
      this.tab = `${args[idx]}  `;
    } else {
      this.tab = '  ';
    }
  }

  addStage(name: string) {
    const stage = new Stage(name, this.tab);
    this.stages.push(stage);
    return stage;
  }

  toString() {
    const size = this.stages.length;
    let result = `${this.tab}stages {\n`;
    for (let i = 0; i < size; i++) {
      result += `${this.stages[i].toString()}\n`;
    }
    result += `${this.tab}}\n`;
    return result;
  }
}

export { Stages };
