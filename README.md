arena-plugin
============

Arena Plugin Dev Command Line Interface

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/arena-plugin-cli.svg)](https://npmjs.org/package/arena-plugin)
![Downloads/week](https://img.shields.io/npm/dw/arena-plugin-cli.svg)
![License](https://img.shields.io/npm/l/arena-plugin-cli.svg)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g arena-plugin-cli
$ arena-plugin COMMAND
running command...
$ arena-plugin (-v|--version|version)
arena-plugin-cli/0.1.3 win32-x64 node-v12.13.0
$ arena-plugin --help [COMMAND]
USAGE
  $ arena-plugin COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`arena-plugin build`](#arena-plugin-build)
* [`arena-plugin build-theme`](#arena-plugin-build-theme)
* [`arena-plugin dev`](#arena-plugin-dev)
* [`arena-plugin help [COMMAND]`](#arena-plugin-help-command)
* [`arena-plugin init [DIRNAME]`](#arena-plugin-init-dirname)
* [`arena-plugin install APFN`](#arena-plugin-install-apfn)
* [`arena-plugin publish`](#arena-plugin-publish)
* [`arena-plugin selfhost`](#arena-plugin-selfhost)

## `arena-plugin build`

Build production plugin

```
USAGE
  $ arena-plugin build

OPTIONS
  -b, --bump=patch|minor|major  Auto versioning
  -d, --delete                  Delete old version
  -p, --publish                 Publish to Arena Market

DESCRIPTION
  ...
  Build production Arena plugin
```

_See code: [src\commands\build.js](https://github.com/corpcode/arena-plugin/blob/v0.1.3/src\commands\build.js)_

## `arena-plugin build-theme`

Building apt files from themes section

```
USAGE
  $ arena-plugin build-theme

DESCRIPTION
  ...
  Build all available theme from themes section in plugin.json
```

_See code: [src\commands\build-theme.js](https://github.com/corpcode/arena-plugin/blob/v0.1.3/src\commands\build-theme.js)_

## `arena-plugin dev`

Develope your Arena plugins with hot reload.

```
USAGE
  $ arena-plugin dev

DESCRIPTION
  Develope your Arena plugins with hot reload, run this command under your project folder.
  Before you run this command, you need to:
  1. Create plugin.json and plugin entry file,
  	you can also run <new> command to create a new plugin project.

  2. Open Arena, and run this command,
  	once the plugin is ready, plugin button will appear at the top of the app.
```

_See code: [src\commands\dev.js](https://github.com/corpcode/arena-plugin/blob/v0.1.3/src\commands\dev.js)_

## `arena-plugin help [COMMAND]`

display help for arena-plugin

```
USAGE
  $ arena-plugin help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src\commands\help.ts)_

## `arena-plugin init [DIRNAME]`

Create a empty Arena plugin project

```
USAGE
  $ arena-plugin init [DIRNAME]

DESCRIPTION
  Create an new empty Arena plugin project in current directory
```

_See code: [src\commands\init.js](https://github.com/corpcode/arena-plugin/blob/v0.1.3/src\commands\init.js)_

## `arena-plugin install APFN`

Install a plugin to Arena Editor

```
USAGE
  $ arena-plugin install APFN

ARGUMENTS
  APFN  The plugin file you want to install

DESCRIPTION
  ...
  Install a .arenap to Arena Editor
```

_See code: [src\commands\install.js](https://github.com/corpcode/arena-plugin/blob/v0.1.3/src\commands\install.js)_

## `arena-plugin publish`

Describe the command here

```
USAGE
  $ arena-plugin publish

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src\commands\publish.js](https://github.com/corpcode/arena-plugin/blob/v0.1.3/src\commands\publish.js)_

## `arena-plugin selfhost`

Self hosting unix socket port for testing only

```
USAGE
  $ arena-plugin selfhost
```

_See code: [src\commands\selfhost.js](https://github.com/corpcode/arena-plugin/blob/v0.1.3/src\commands\selfhost.js)_
<!-- commandsstop -->
