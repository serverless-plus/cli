import { program } from 'commander';
import { startUI } from './ui';

const initCommand = (): void => {
  program
    .command('init')
    .description('Initialize command for serverless project')
    .option('-u, --ui', 'Config by UI')
    .action((options) => {
      if (options.ui) {
        startUI();
      }
    });
};

export { initCommand };
