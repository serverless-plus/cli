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
    - [config command](#config)
    - [clone command](#clone)
    - [faas command](#faas)
      - [faas logs command](#faas-logs)
      - [faas invoke command](#faas-invoke)
      - [faas warm command](#faas-warm)
    - [app command](#app)
      - [app warm command](#app-warm)
    - [parse command](#Parse-serverless-config-file)
    - [migrate command](#Migrate-serverless-config-file)

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
  help [command]                display help for command

Example call:
  $ slsplus --help
```

### config

Config credentils for vendors:

```bash
$ slsplus config
```

### clone

```bash
$ slsplus clone https://github.com/serverless-plus/cli
```

### faas

Before using `faas` command, you should run `slsplus config` to config tencent cloud credentilas.

#### faas logs

Get faas logs:

```bash
$ slsplus faas logs --name=scf-demo --limit=1
```

#### faas invoke

Invoke faas:

```bash
$ slsplus faas invoke --name=scf-demo
```

#### faas warm

Warm up faas:

```bash
# name parameter is the name of cloud function
$ slsplus faas warm --name=scf-demo
```

It also support to warm up application created by [serverless components](https://github.com/serverless/components):

```bash
# name parameter is the name configured in serverless.yml
$ slsplus faas warm-app --name=scf-app
```

### app

Before using `app` command, you should run `slsplus config` to config tencent cloud credentilas.

#### app warm

Warm up serverless application:

```bash
# name parameter is the name configured in serverless.yml
$ slsplus app warm --app=app-demo --name=scf-demo --stage=dev
```

### Parse serverless config file

```bash
$ slsplus parse -o -s '{"src":"./"}'
```

Parse command will parse serverless config file with costomize and environment variables replacement.

For example, before is:

```yaml
inputs:
  src:
    src: ./
    exclude:
      - .env
  region: ${env:REGION}
  apigatewayConf:
    protocols:
      - http
      - https
```

If `process.env.REGION=ap-guangzhou`, after parsing, the `serverless.yml` will be:

```yaml
inputs:
  src: ./
  region: ap-guangzhou
  apigatewayConf:
    protocols:
      - http
      - https
```

### Migrate serverless config file

```bash
$ slsplus migrate
```

This command will auto migrate your old yaml config to latest version.

For example, before is:

```yaml
org: orgDemo
app: appDemo
stage: dev
component: express
name: expressDemo

inputs:
  src:
    src: ./
    exclude:
      - .env
  region: ap-guangzhou
  functionName: expressDemo
  layers:
    - name: layer-test
      version: 1
  serviceId: service-abcdefg
  serviceName: express_api
  functionConf:
    timeout: 10
    environment:
      variables:
        TEST: 1
    tags:
      TEST: 1
  apigatewayConf:
    enableCORS: true
    serviceDesc: test
    protocols:
      - http
      - https
```

If `process.env.REGION=ap-guangzhou`, after parsing, the `serverless.yml` will be:

```yaml
org: orgDemo
app: appDemo
stage: dev
component: express
name: expressDemo
inputs:
  src:
    src: ./
    exclude:
      - .env
  region: ap-guangzhou
  faas:
    name: expressDemo
    timeout: 10
    environments:
      - envKey: TEST
        envVal: 1
    tags:
      - tagKey: TEST
        tagVal: 1
    layers:
      - name: layer-test
        version: 1
  apigw:
    id: service-abcdefg
    name: express_api
    description: test
    cors: true
    protocols:
      - http
      - https
```

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
