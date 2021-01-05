export default {
  org: 'orgDemo',
  app: 'appDemo',
  stage: 'dev',
  component: 'scf',
  name: 'scfDemo',
  inputs: {
    src: {
      src: './',
      exclude: ['.env'],
    },
    region: 'ap-guangzhou',
    name: 'scfDemo',
    timeout: 10,
    environments: [
      {
        key: 'TEST',
        value: 1,
      },
    ],
    tags: [
      {
        key: 'TEST',
        value: 1,
      },
    ],
    layers: [
      {
        name: 'layer-test',
        version: 1,
      },
    ],
    triggers: [
      {
        type: 'timer',
        name: 'timer',
        qualifier: '$DEFAULT',
        cronExpression: '*/5 * * * * * *',
        enable: true,
        argument: 'argument',
      },
      {
        type: 'apigw',
        description: 'test',
        protocols: ['http', 'https'],
        apis: [
          {
            path: '/',
            method: 'ANY',
            cors: true,
            id: 'api-abcdef',
            name: 'apidemo',
            timeout: 10,
          },
        ],
      },
    ],
  },
};
