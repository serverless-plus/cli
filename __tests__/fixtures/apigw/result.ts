export default {
  org: 'orgDemo',
  app: 'appDemo',
  stage: 'dev',
  component: 'apigateway',
  name: 'apigatewayDemo',
  inputs: {
    region: 'ap-guangzhou',
    id: 'service-abcdef',
    name: 'apigateway_demo',
    environment: 'release',
    description: 'apigw desc',
    protocols: ['http', 'https'],
    netTypes: ['OUTER', 'INNER'],
    customDomains: [
      {
        domain: 'abc.com',
        certId: 'abcdefg',
        customMap: true,
        pathMap: [
          {
            path: '/',
            environment: 'release',
          },
        ],
        protocols: ['http', 'https'],
      },
    ],
    apis: [
      {
        path: '/',
        method: 'ANY',
        cors: true,
        id: 'api-abcdef',
        name: 'apidemo',
        timeout: 10,
        description: 'api desc',
        function: {
          isIntegratedResponse: true,
          functionQualifier: '$LATEST',
          functionName: 'myFunction',
        },
      },
    ],
  },
};
