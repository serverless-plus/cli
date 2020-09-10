export interface Environments {
  [propName: string]: any;
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

export interface CreateProjectOptions {
  name: string;
  alias: string;
  description: string;
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
 * @api CreateCodingCIJob
 */
export interface CreateCodingCIJobOptions {
  jobName: string;
  projectId: number;
  depotId?: number;
  envs?: Environments;
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

/* *******************************
 * @api TriggerCodingCIBuild
 */
export interface TriggerCodingCIJobBuildOptions {
  jobId: number;
  envs: Environments;
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

/* *******************************
 * @api DescribeCodingCIBuildStage
 */
export interface DescribeCodingCIBuildStageRequest {
  // 构建 ID
  BuildId: number;
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
