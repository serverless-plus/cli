# Serverless Plus CLI

[![npm](https://img.shields.io/npm/v/@slsplus/cli)](http://www.npmtrends.com/@slsplus/cli)
[![NPM downloads](http://img.shields.io/npm/dm/@slsplus/cli.svg?style=flat-square)](http://www.npmtrends.com/@slsplus/cli)
[![Build Status](https://github.com/serverless-plus/cli/workflows/Release/badge.svg?branch=master)](https://github.com/serverless-plus/cli/actions?query=workflow:Release+branch:master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

CLI tool for Serverless Plus

- [@slsplus/cli](#Serverless-Plus-CLI)
  - [Support Cloud Vendors](#support-cloud-vendors)
  - [Installation](#installation)
  - [Usage](#usage)
    - [config](#config)
    - [init](#init)
    - [clone](#clone)
    - [faas](#faas)
      - [faas logs](#faas-logs)
      - [faas invoke](#faas-invoke)
      - [faas warm](#faas-warm)
    - [bundle](#bundle)
    - [app](#app)
      - [app warm](#app-warm)
    - [parse](#Parse-serverless-config-file)
    - [migrate](#Migrate-serverless-config-file)

## Support Cloud Vendors

- [x] Tencent Cloud
- [ ] AWS
- [ ] Aliyun

## Installation

```bash
$ npm i @slsplus/cli -g
```

## Usage

```bash
$ slsplus -h
Usage: slsplus [options] [command]

Options:
  -v, --version                 output the current version
  -h, --help                    display help for command

Commands:
  config                        Config for slsplus cli
  clone <source> [destination]  clone a repository into a newly created directory
  parse [options]               parse serverless config file with costomize and environment variables replacement
  faas                          Operation for faas
  app                           Operation for serverless application
  migrate [options]             Migrate old serverless config to uniform config
  init [options]                Initialize command for serverless project
  bundle [options]              Bundle command for serverless project
  help [command]                display help for command

Example call:
  $ slsplus --help
```

> Notice: Below examples will use `sp` instead of `slsplus`.

### config

Config credentils for vendors:

```bash
$ sp config
```

### init

Initialize command for serverless project:

```bash
$ sp init -u
```

> It will start an UI config server for serverless project.

### clone

```bash
$ sp clone https://github.com/serverless-plus/cli
```

### faas

Before using `faas` command, you should run `sp config` to config tencent cloud credentilas.

#### faas logs

Get faas logs:

```bash
$ sp faas logs --name=scfdemo --limit=1
```

#### faas invoke

Invoke faas:

```bash
$ sp faas invoke --name=scfdemo
```

Invoke with event:

```bash
$ sp faas invoke --name=scfdemo --event=./event.json
```

#### faas warm

Warm up faas:

```bash
# name parameter is the name of cloud function
$ sp faas warm --name=scfdemo
```

### bundle

Before using `bundle` command, you can bundle your project with dependencies into one file, so you need not to upload `node_modules` directory.

```
$ sp bundle --input=app.js --file=./sls.js
```

If you do not pass `--file` option, it will be bundled to `sls.prod.js` by default.

### app

Before using `app` command, you should run `sp config` to config tencent cloud credentilas.

#### app warm

Warm up serverless application:

```bash
# name parameter is the name configured in serverless.yml
$ sp app warm --app=appname --name=scfdemo --stage=dev
```

### Parse serverless config file

```bash
$ sp parse -o -s '{"src":"./"}'
```

Parse command will parse serverless config file with costomize and environment variables replacement.

For example, before is:

```yaml
inputs:
  region: ${env:REGION}
```

If `process.env.REGION=ap-guangzhou`, after parsing, the `serverless.yml` will be:

```yaml
inputs:
  src: ./
  region: ap-guangzhou
```

### Migrate serverless config file

```bash
$ slsplus migrate
```

This command will auto migrate your old yaml config to latest version.

## Development

All `git commit` mesage must follow below syntax:

```bash
type(scope?): subject  #scope is optional
```

support type：

- **feat**: add new feature
- **fix**: fix bug or patch feature
- **ci**: CI
- **chore**: modify config, nothing to do with production code
- **docs**: create or modifiy documents
- **refactor**: refactor project
- **revert**: revert
- **test**: test

Most of time, we just use `feat` and `fix`.

## Test

For CI test, should copy `.env.example` to `.env.test`, then config below environment variables to yours:

```dotenv
# tencent credentials
TENCENT_SECRET_ID=xxx
TENCENT_SECRET_KEY=xxx

# cos url for project code download in CI environment
CODE_URL_COS=xxx
# git ulr for git project
CODE_URL_GIT=xxx

# nextjs
CODE_URL_COS_NEXTJS=xxx
STATIC_URL_NEXTJS=xxx

# nuxtjs
CODE_URL_COS_NUXTJS=xxx
STATIC_URL_NUXTJS=xxx
```

## License

MIT License

Copyright (c) 2020 Serverless Plus
