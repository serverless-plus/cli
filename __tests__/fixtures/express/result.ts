export default {
  org: 'orgDemo',
  app: 'appDemo',
  stage: 'dev',
  component: 'express',
  name: 'expressDemo',
  inputs: {
    src: {
      src: './',
      exclude: ['.env'],
    },
    region: 'ap-guangzhou',
    faas: {
      name: 'expressDemo',
      timeout: 10,
      environments: [
        {
          envKey: 'TEST',
          envVal: 1,
        },
      ],
      tags: [
        {
          tagKey: 'TEST',
          tagVal: 1,
        },
      ],
      layers: [
        {
          name: 'layer-test',
          version: 1,
        },
      ],
    },
    apigw: {
      id: 'service-abcdefg',
      name: 'express_api',
      description: 'test',
      cors: true,
      protocols: ['http', 'https'],
      customDomains: [
        {
          domain: 'abc.com',
          certId: 'abcdef',
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
    },
    static: {
      cos: {
        bucket: 'static-bucket',
        acl: {
          permissions: 'public-read',
        },
        sources: [
          {
            src: '.next/static',
            targetDir: '/_next/static',
          },
          {
            src: 'public',
            targetDir: '/',
          },
        ],
      },
      cdn: {
        area: 'mainland',
        domain: 'abc.com',
        autoRefresh: true,
        refreshType: 'delete',
        https: {
          http2: 'on',
          certId: 'abc',
          forceRedirect: {
            switch: 'on',
            redirectType: 'https',
            redirectStatusCode: 301,
          },
        },
      },
    },
  },
};
