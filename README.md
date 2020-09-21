# Serverless Plus CLI

[![npm](https://img.shields.io/npm/v/@slsplus/cli)](http://www.npmtrends.com/@slsplus/cli)
[![NPM downloads](http://img.shields.io/npm/dm/@slsplus/cli.svg?style=flat-square)](http://www.npmtrends.com/@slsplus/cli)
[![Build Status](https://github.com/serverless-plus/cli/workflows/Release/badge.svg?branch=master)](https://github.com/serverless-plus/cli/actions?query=workflow:Release+branch:master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

CLI tool for Serverless Plus

## Features

- [x] [Typescript](https://github.com/microsoft/TypeScript)
- [x] [Github Actions](https://github.com/features/actions)
- [x] [Eslint](https://github.com/eslint/eslint)
- [x] [Prettier](https://github.com/prettier/prettier)
- [x] [Jest](https://github.com/facebook/jest)
- [x] [semantic-release](https://github.com/semantic-release/semantic-release)

## Usage

```bash
$ npm i @slsplus/cli -g
$ slsplus -h
```

### Clone project

```bash
$ slsplus clone https://github.com/serverless-plus/cli
```

### Parse serverless config file

```bash
$ slsplus parse -o -rv '{"src":"./"}'
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

> Notice: if you don't pass `-o` option, serverless.yml will not be rewrite, the parse result will just be outputed to terminal.

## Environment

For auto `release` action, you should setup `GH_TOKEN` and `NPM_TOKEN` secrets.

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
TENCENT_SECRET_ID=xxx
TENCENT_SECRET_KEY=xxx
CODE_URL_COS=xxx
```

> Notice: `CODE_URL_COS` is a cos url for project code download in CI environment.

## License

MIT
