import { Steps } from './steps';
import { Environments, StageInterface, StagesInterface, StepsInterface } from '../../../typings/ci';

class Stage implements StageInterface {
  tab: string;
  name: string;
  steps: StepsInterface | null;
  environments: Environments = {};

  constructor(name: string, tab: string) {
    this.name = name;
    this.steps = null;
    this.environments = {};
    if (tab) {
      this.tab = `${tab}  `;
    } else {
      this.tab = '  ';
    }
  }

  addEnvironment(name: string, val: string): void {
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

class Stages implements StagesInterface {
  tab: string;
  stages: Stage[];

  constructor(name: string) {
    this.stages = [];
    if (name) {
      this.tab = `${name}  `;
    } else {
      this.tab = '  ';
    }
  }

  addStage(name: string): StageInterface {
    const stage = new Stage(name, this.tab);
    this.stages.push(stage);
    return stage;
  }

  toString(): string {
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
