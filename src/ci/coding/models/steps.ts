import { StepsInterface } from '../../../typings/ci';

class Steps implements StepsInterface {
  shells: string[];
  tab: string;
  script: string | null;
  constructor(name: string) {
    this.shells = [];
    if (name) {
      this.tab = `${name}  `;
    } else {
      this.tab = '  ';
    }
    this.script = null;
  }

  addScriptCode(c: string): boolean {
    this.script = c;
    return true;
  }

  addShell(s: string): boolean {
    this.shells.push(s);
    return true;
  }

  toString(): string {
    const size = this.shells.length;
    let result = `${this.tab}steps {\n`;
    for (let i = 0; i < size; i++) {
      result += `${this.tab}  sh '${this.shells[i]}'\n`;
    }
    if (this.script) {
      result += `${this.tab}  script {\n ${this.script} \n}\n`;
    }
    result += `${this.tab}}\n`;
    return result;
  }
}

export { Steps };
