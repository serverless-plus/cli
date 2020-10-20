export interface AnyObject {
  [prodName: string]: any;
}

export interface Environments {
  [propName: string]: string;
}

export interface StepsInterface {
  shells: string[];
  tab: string;
  script: string | null;

  addScriptCode: (s: string) => boolean;
  addShell: (s: string) => boolean;
  toString: () => string;
}

export interface StageInterface {
  tab: string;
  name: string;
  steps: StepsInterface | null;
  environments: Environments;

  // eslint-disable-next-line
  addEnvironment: (name: string, val: string) => void;
  addSteps: () => StepsInterface;
  toString: () => string;
}

export interface StagesInterface {
  tab: string;
  stages: StageInterface[];

  // eslint-disable-next-line
  addStage: (n: string) => StageInterface;
  toString: () => string;
}
export interface PipelineInterface {
  tab: string;
  stages: StagesInterface | null;
  environments: Environments;
  agent: string;

  // eslint-disable-next-line
  addEnvironment: (name: string, val: string) => void;
  addStages: () => StagesInterface;
  toString: () => string;
}

export interface CodingCIJobCachePath {
  /**
   * 绝对路径
   */
  AbsolutePath: string;

  /**
   * 是否启用
   */
  Enabled: boolean;
}

export interface CIJobEnv {
  /**
   * 环境变量名称
   */
  Name: string;

  /**
   * 环境变量值
   */
  Value: string;

  /**
   * 是否保密
   */
  Sensitive: boolean;
}

export interface CodingCIJobSchedule {
  /**
   * 代码无变化时是否触发
   */
  RefChangeTrigger: boolean;

  /**
   * 目标触发的分支
   */
  Branch: string;

  /**
   * 星期几
   */
  Weekend: string;

  /**
   * 是否周期触发（周期触发/单次触发）
   */
  Repeat: boolean;

  /**
   * 开始时间。如果是周期触发，精确到小时（ 8 ）如果是单次触发，精确到分钟数（ 8:20 ）
   */
  StartTime: string;

  /**
   * 结束时间。如果是单次触发，结束时间为空
   */
  EndTime: string;

  /**
   * 间隔
   */
  Interval: string;
}

/* *******************************
 * @api CreateProject
 */
export interface CreateProjectReqOptions {
  gitReadmeEnabled?: boolean;
  vcsType?: string;
  shared?: number;
  template?: string;
  gitIgnore?: string;
  createSvnLayout?: boolean;
  invisible?: boolean;
  label?: string;
}

// ciInstance.createProjectWithTemplate options
export interface CreateProjectWithTemplateOptions {
  name: string;
  alias: string;
  description?: string;
  options?: CreateProjectReqOptions;
}

export interface CreateProjectRequest {
  // 项目标识
  Name: string;

  // 项目名称
  DisplayName: string;

  // 启用 README.md 文件初始化项目 true|false
  GitReadmeEnabled: boolean;

  // git｜svn｜hg
  VcsType: string;

  // 是否创建 SVN 仓库推荐布局 默认false
  CreateSvnLayout: boolean;

  // 0： 不公开 1：公开源代码
  Shared: number;

  // 项目模版 CODE_HOST 代码托管项目， PROJECT_MANAGE 项目管理项目， DEV_OPS DevOps项目， DEMO_BEGIN 范例项目
  ProjectTemplate: string;

  // 标签(TKE、TCB)
  Label: string;

  // 隐藏项目在 CODING 入口不可见: true 不可见|false 可见
  Invisible: boolean;

  // 项目描述
  Description: string;

  // 项目图标
  Icon?: string;

  // git ignore 文件类型
  GitIgnore: string;
}

/* *******************************
 * @api CreateProjectWithTemplateRequest
 */
export interface CreateProjectWithTemplateRequest {
  /**
   * 项目标识
   */
  Name: string | null;

  /**
   * 项目名称
   */
  DisplayName: string | null;

  /**
   * 启用 README.md 文件初始化项目 true|false
   */
  GitReadmeEnabled: boolean | null;

  /**
   * git｜svn｜hg
   */
  VcsType: string | null;

  /**
   * 是否创建 SVN 仓库推荐布局 默认false
   */
  CreateSvnLayout: boolean | null;

  /**
   * 0： 不公开 1：公开源代码
   */
  Shared: number | null;

  /**
   * 项目模版 CODE_HOST 代码托管项目， PROJECT_MANAGE 项目管理项目， DEV_OPS DevOps项目， DEMO_BEGIN 范例项目
   */
  ProjectTemplate: string | null;

  /**
   * 标签(TKE、TCB)
   */
  Label: string | null;

  /**
   * 隐藏项目在 CODING 入口不可见  true 不可见|false 可见
   */
  Invisible: boolean | null;

  /**
   * 项目描述
   */
  Description: string | null;

  /**
   * 项目图标
   */
  Icon: string | null;

  /**
   * git ignore 文件类型
   */
  GitIgnore: string | null;
}

export interface CreateProjectWithTemplateResponse {
  /**
   * 项目Id
   */
  ProjectId: number;

  /**
   * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
   */
  RequestId?: string;
}

/* *******************************
 * @api CreateCodingCIJob
 */

export interface LayerOptions {
  org: string;
  app: string;
  stage: string;
  runtime: string;
  name?: string;
}

export interface SrcObject {
  src?: string;
  dist?: string;
  hook?: string;
  exclude?: string[];
}

export interface SlsInputs {
  src?: string | SrcObject;
  [propName: string]: any;
}

export interface SlsOptions {
  org: string;
  app: string;
  stage: string;
  component: string;
  name: string;
  inputs?: SlsInputs;
}

export interface CIParseOptions {
  slsOptions?: SlsOptions;
  layerOptions?: LayerOptions;
}

export interface CreateCodingCIJobOptions {
  // 构建计划名称
  jobName: string;
  // 项目 ID
  projectId: number;
  //  仓库 ID
  depotId?: number;
  // 环境变量
  envs?: CIJobEnv[];
  // 自定义 pipeline
  pipeline?: PipelineInterface;
  // 是否使用 CI 提供的临时密钥作为鉴权信息，默认为 false
  useCITempAuth?: boolean;
  // 将 serverless.yml 解析成真实值配置相关配置，包括需要定制化配置和环境变量
  parseOptions?: CIParseOptions;
  // 是否部署layer
  needDeployLayer?: boolean;
  // 是否需要安装 serverless，如果使用默认含有 serverless 命令的镜像，就不需要
  needInstallSls?: boolean;
  // 是否使用git克隆方式下载代码
  useGit?: boolean;
  // git 分支，使用时需要设置 useGit 为 true
  gitBranch?: string;
  // 是否需要编译项目
  needBuild?: boolean;
}

export interface CreateCodingCIJobRequest {
  /**
   * 项目 ID
   */
  ProjectId: number;

  /**
   * 仓库 ID
   */
  DepotId: number;

  /**
   * 构建计划名称
   */
  Name: string;

  /**
   * 执行方式 CVM | STATIC
   */
  ExecuteIn: string;

  /**
   * REF_CHANGE 代码更新触发
   *  CRON = 1 定时触发
   *  MR_CHANGE  MR变动触发
   */
  TriggerMethodList: string[];

  /**
   * 代码更新触发匹配规则 DEFAULT,TAG,BRANCH,CUSTOM
   */
  HookType: string;

  /**
   * STATIC，SCM 从代码库读取
   */
  JenkinsFileFromType: string;

  /**
   * 自动取消相同版本
   */
  AutoCancelSameRevision: boolean;

  /**
   * 自动取消相同 MR
   */
  AutoCancelSameMergeRequest: boolean;

  /**
   * 构建结果通知触发者机制
   *   ALWAYS -总是通知;
   *  BUILD_FAIL -仅构建失败时通知;
   */
  TriggerRemind: string;

  /**
   * 构建计划来源 TKE TCB
   */
  JobFromType: string;

  /**
   * 仓库类型 CODING,TGIT,GITHUB,GITLAB,GITLAB_PRIVATE,GITEE,NONE
   */
  DepotType: string;

  /**
   * hookType 为 DEFAULT 时须指定
   */
  BranchSelector: string;

  /**
   * hookType 为 CUSTOME 时须指定
   */
  BranchRegex: string;

  /**
   * JenkinsFileFromType 为 SCM 必填
   */
  JenkinsFilePath: string;

  /**
   * JenkinsFileFromType 为 STATIC 必填
   */
  JenkinsFileStaticContent: string;

  /**
   * 任务缓存目录配置
   */
  CachePathList: CodingCIJobCachePath[];

  /**
   * 环境变量配置
   */
  EnvList: CIJobEnv[];

  /**
   * 针对 CRON triggerMethod 的 schedule 规则配置, 暂只用于添加
   */
  ScheduleList: Array<CodingCIJobSchedule>;

  /**
   * 不管构建成功还是失败总是通知的用户
   */
  AlwaysUserIdList: Array<number>;

  /**
   * 仅构建失败时要通知的用户
   */
  BuildFailUserIdList: Array<number>;
}

export interface CreateCodingCIJobData {
  /**
   * 构建计划 Id
   */
  Id: number;
}

export interface CreateCodingCIJobResponse {
  /**
   * 创建构建计划返回结构
   */
  Data: CreateCodingCIJobData;

  /**
   * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
   */
  RequestId: string;
}
/* *******************************
 * @api TriggerCodingCIBuild
 */
export interface TriggerCodingCIBuildOptions {
  jobId: number;
  envs: CIJobEnv[];
}
export interface TriggerCodingCIBuildRequest {
  /**
   * 构建计划 Id
   */
  JobId: number;

  /**
   * 分支名或 CommitId，当为构建计划的 DepotType 为 NONE 是可不传
   */
  Revision: string;

  /**
   * 构建附加的环境变量
   */
  ParamList: CIJobEnv[];
}

export interface CIBuildTestResult {
  /**
   * 是否空
   */
  Empty: boolean;

  /**
   * 失败次数
   */
  FailCount: number;

  /**
   * 通过次数
   */
  PassCount: number;

  /**
   * 跳过次数
   */
  SkipCount: number;

  /**
   * 总次数
   */
  TotalCount: number;

  /**
   * 时长
   */
  Duration: number;
}

export type CIJobBuildStatus =
  | 'QUEUED'
  | 'INITIALIZING'
  | 'NOT_BUILT'
  | 'RUNNING'
  | 'SUCCEED'
  | 'FAILED'
  | 'ABORTED';

export interface CodingCIBuild {
  /**
   * 构建 ID
   */
  Id: number;

  /**
   * 构建计划 ID
   */
  JobId: number;

  /**
   * 构建唯一标识
   */
  CodingCIId: string;

  /**
   * 构建序号
   */
  Number: number;

  /**
   * Git Commit ID
   */
  CommitId: string;

  /**
   * 触发原因
   */
  Cause: string;

  /**
   * 分支
   */
  Branch: string;

  /**
   * 失败原因
   */
  FailedMessage: string;

  /**
   * 本次构建的 Jenkinsfile
   */
  JenkinsFileContent: string;

  /**
   * 构建执行时间 QUEUED  等待构建 INITIALIZING  初始化 NOT_BUILT  准备构建 RUNNING  运行中 SUCCEED  成功 FAILED  失败 ABORTED  被取消 TIMEOUT  超时
   */
  Duration: number;

  /**
   * 构建当前状态
   */
  Status: CIJobBuildStatus;

  /**
   * 构建进行到了哪个 stage/node
   */
  StatusNode: string;

  /**
   * 构建创建时间
   */
  CreatedAt: number;

  /**
   * 测试结果
   */
  TestResult: CIBuildTestResult;
}

export interface TriggerCodingCIBuildData {
  /**
   * 构建信息
   */
  Build: CodingCIBuild;
}

export interface TriggerCodingCIBuildResponse {
  /**
   * 构建信息
   */
  Data: TriggerCodingCIBuildData;

  /**
   * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
   */
  RequestId: string;
}

/* *******************************
 * @api DescribeCodingCIBuildStage
 */
export interface DescribeCodingCIBuildStageRequest {
  // 构建 ID
  BuildId: number;
}

export interface CodingCIBuildStageData {
  /**
   * Stage 返回字符串
   */
  StageJsonString: string;
}

export interface DescribeCodingCIBuildStageResponse {
  /**
   * 包含步骤返回信息
   */
  Data: CodingCIBuildStageData;

  /**
   * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
   */
  RequestId: string;
}

/* *******************************
 * @api DescribeCodingCIBuildLog
 */
export interface DescribeCodingCIBuildLogRequest {
  /**
   * 构建 ID
   */
  BuildId: number;

  /**
   * 日志的开始位置
   */
  Start: number;
}

export interface DescribeCodingCIBuildLogData {
  /**
   * 日志
   */
  Log: string;

  /**
   * 是否有更多的日志
   */
  MoreData: boolean;

  /**
   * 当前展示日志长度
   */
  TextDelivered: number;

  /**
   * 总日志长度
   */
  TextSize: number;
}

export interface DescribeCodingCIBuildLogResponse {
  /**
   * 日志信息
   */
  Data: DescribeCodingCIBuildLogData;

  /**
   * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
   */
  RequestId: string;
}

export interface CodingCIOptions {
  secretId: string;
  secretKey: string;
  token?: string;
  region?: string;
}

/* *******************************
 * @api DescribeCodingCIBuild
 */
export interface DescribeCodingCIBuildRequest {
  // 构建 ID
  BuildId: number;
}

export interface DescribeCodingCIBuildResponse {
  /**
   * 构建详情
   */
  Build: CodingCIBuild;

  /**
   * 唯一请求 ID，每次请求都会返回。定位问题时需要提供该次请求的 RequestId。
   */
  RequestId: string;
}

export interface Project {
  Name: string;
  Id: number;
  Type: number;
  DisplayName: string;
  Icon: string;
  Description: string;
  CreatedAt: number;
  MaxMember: number;
  TeamId: number;
  UserOwnerId: number;
  IsDemo: boolean;
  Archived: boolean;
  StartDate: number;
  UpdatedAt: number;
  TeamOwnerId: number;
  EndDate: number;
  Status: number;
}

export interface CodingCIInterface {
  /* *********************************
   * @api CreateCodingCIJob
   */
  createProjectWithTemplate: (
    options: CreateProjectWithTemplateOptions,
  ) => Promise<CreateProjectWithTemplateResponse>;

  /* *********************************
   * @api TriggerCodingCIJobBuild
   */
  createCodingCIJob: (options: CreateCodingCIJobOptions) => Promise<CreateCodingCIJobResponse>;

  /* *********************************
   * @api TriggerCodingCIJobBuild
   */
  triggerCodingCIBuild: (
    options: TriggerCodingCIBuildOptions,
  ) => Promise<TriggerCodingCIBuildResponse>;

  /* *********************************
   * @api DescribeCodingCIBuild
   */
  describeCodingCIBuild: (buildId: number) => Promise<DescribeCodingCIBuildResponse>;

  /* *********************************
   * @api DescribeCodingCIBuildStage
   */
  describeCodingCIBuildStage: (buildId: number) => Promise<DescribeCodingCIBuildStageResponse>;

  /* *********************************
   * @api DescribeCodingCIBuildLog
   */
  describeCodingCIBuildLog: (
    buildId: number,
    start: number,
  ) => Promise<DescribeCodingCIBuildLogResponse>;
}
