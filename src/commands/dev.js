const {Command} = require('@oclif/command')
const path = require('path')
const writer = require('arena-file/writer')
const os = require('os')
const fs = require('fs')
const request = require('request-promise-native');
const webpackCompiler = require('../webpack/compiler')
const t = require('../ui')

class DevCommand extends Command {
  async run() {
    const initError = await webpackCompiler.init(process.cwd())
    if (initError) {
      this.error(initError)
      return
    }

    this.devPortFile = path.resolve(os.tmpdir(), 'arena_dev.sig')

    t.newPbar()
    t.headerDev()

    webpackCompiler.compile(
      this.compileSuccess.bind(this),
      this.compileWarning.bind(this),
      this.compileError.bind(this),
      this.compileProgress.bind(this),
      this.compileStart.bind(this),
      this.config.root,
      false,
      webpackCompiler.pluginJson.version
    )
  }

  compileStart() {
    t.headerDev()
    t.pbar().update(0)
  }

  compileProgress(percentage) {
    t.pbar().update(percentage)
  }

  async compileSuccess(content, fileBuffer) {
    t.headerDev()
    t.term.bgCyan(`[${new Date().toLocaleString()}]编译成功\n`)

    const savePath = path.resolve(os.tmpdir(), `dev-${content.config.pluginId}.arenap`)
    const w = new writer(savePath)
    w.setContentVersion('0.0.0')
    w.addContent(Buffer.from(JSON.stringify(content), 'utf-8'), 'content.json')
    w.addContent(fileBuffer.code, 'code.js')
    for (let index = 0; index < content.config.plugins.length; index += 1) {
      const p = content.config.plugins[index]
      p.icon && w.addFile(path.resolve(process.cwd(), p.icon), p.icon)
      p.thumb && w.addFile(path.resolve(process.cwd(), p.thumb), p.thumb)
    }
    content.config.thumb && w.addFile(path.resolve(process.cwd(), content.config.thumb), content.config.thumb)

    fileBuffer.styles.forEach(style => {
      w.addContent(style.style, style.name)
    })

    await w.write()

    if (!fs.existsSync(savePath)) {
      return this.compileError('未启动 Arena')
    }

    const devPort = fs.readFileSync(this.devPortFile, {encoding: 'utf8'})

    request(`http://localhost:${devPort}/?client=cli&file=${savePath}`).then((res) => {
      t.term.bgGreen(`[${new Date().toLocaleString()}]成功！已更新到 Arena ${res}`)
    })
    .catch(error => {
      this.compileError(`更新失败: ${error.message}`)
    })
  }

  compileWarning(content) {
    t.term.bgYellow(`[${new Date().toLocaleString()}]警告！${content}\n`)
  }

  compileError(content) {
    t.term.bgRed(`[${new Date().toLocaleString()}]错误！${content}\n`)
  }
}

DevCommand.description = `Develope your Arena plugins with hot reload.
Develope your Arena plugins with hot reload, run this command under your project folder.
Before you run this command, you need to:
1. Create plugin.json and plugin entry file,
\t you can also run <new> command to create a new plugin project.

2. Open Arena, and run this command,
\t once the plugin is ready, plugin button will appear at the top of the app.
`

module.exports = DevCommand
