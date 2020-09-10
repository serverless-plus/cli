class Steps {
  shells: string[];
  tab: string;
  script: string | null;
  constructor(...args: any) {
    this.shells = [];
    if (args.length) {
      const idx = args.length - 1;
      this.tab = `${args[idx]}  `;
    } else {
      this.tab = '  ';
    }
    this.script = null;
  }

  addScriptCode(c: string) {
    this.script = c;
  }

  addShell(s: string) {
    this.shells.push(s);
    return true;
  }

  toString() {
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
