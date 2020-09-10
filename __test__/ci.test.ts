import { CodingCI } from '../src';

describe('Coding CI', () => {
  describe('triggerCodingCIJobBuildReq', () => {
    it('should get right request data', async () => {
      const req = CodingCI.createProjectReq({
        name: 'ci-test',
        alias: 'ci-test',
        description: 'ci test',
      });
      expect(req).toEqual({
        Name: 'ci-test',
        DisplayName: 'ci-test',
        GitReadmeEnabled: true,
        VcsType: 'git',
        Shared: 0,
        ProjectTemplate: 'DEV_OPS',
        GitIgnore: 'no',
        Description: 'ci test',
        CreateSvnLayout: false,
        Invisible: false,
        Label: 'SLS',
      });
    });
  });
});
