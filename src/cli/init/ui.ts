import { startServer } from '@slsplus/ui';

async function startUI(): Promise<void> {
  await startServer();
}

export { startUI };
