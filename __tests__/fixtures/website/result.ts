export default {
  component: 'website',
  name: 'websitedemo',
  org: 'test',
  app: 'websiteApp',
  stage: 'dev',
  inputs: {
    src: {
      src: './src',
      index: 'index.html',
      error: 'index.html',
    },
    region: 'ap-guangzhou',
    bucket: 'my-bucket',
    replace: false,
    cdns: [
      {
        domain: 'abc.com',
      },
    ],
  },
};
