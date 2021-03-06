const {Command, flags} = require('@oclif/command')
const writer = require('arena-file/writer')
const webpackCompiler = require('../webpack/compiler')
const t = require('../ui')
const fs = require('fs')
const path = require('path')
const semver = require('semver')

class BuildCommand extends Command {
  async run() {
    const initError = await webpackCompiler.init(process.cwd())
    if (initError) {
      this.error(initError)
      return
    }

    t.newPbar()
    t.headerDev()

    const {flags} = this.parse(BuildCommand)

    const pluginJsonPath = path.resolve(process.cwd(), 'plugin.json')
    if (!fs.existsSync(pluginJsonPath)) {
      throw new Error('插件配置不存在 (plugin.json)')
    }

    const pluginJson = JSON.parse(fs.readFileSync(pluginJsonPath, {encoding: 'utf8'}));
    const version = flags.bump ? semver.inc(pluginJson.version, flags.bump) : pluginJson.version;

    webpackCompiler.compile(
      this.compileSuccess.bind(this),
      this.compileWarning.bind(this),
      this.compileError.bind(this),
      this.compileProgress.bind(this),
      this.compileStart.bind(this),
      this.config.root,
      true,
      version,
    )
  }

  compileStart() {
    t.headerDev()
    t.pbar().update(0)
  }

  compileProgress(percentage) {
    t.pbar().update(percentage)
  }

  compileSuccess(content, fileBuffer) {
    const {flags} = this.parse(BuildCommand)

    t.headerDev()
    t.term.defaultColor('✌️\t').bgBrightGreen('打包完成\n')
    webpackCompiler.stop()

    // version increment
    const prevSavedPath = path.resolve(process.cwd(), `${webpackCompiler.id}${webpackCompiler.pjson.version ? '-' + webpackCompiler.pjson.version : ''}.arenap`)
    if (fs.existsSync(prevSavedPath) && flags.delete) {
      fs.unlinkSync(prevSavedPath)
    }

    if (content.config.version) {
      if (flags.bump) {
        content.config.version = semver.inc(content.config.version, flags.bump)
      }
      const pluginJson = path.resolve(process.cwd(), 'plugin.json')
      const jsonOnDisk = fs.readFileSync(pluginJson, {encoding: 'utf8'})
      const jsonContent = JSON.parse(jsonOnDisk)
      jsonContent.version = content.config.version
      fs.writeFileSync(pluginJson, JSON.stringify(jsonContent, null, 2))
    }

    // compress
    const contentBuffer = Buffer.from(JSON.stringify(content), 'utf8')
    // const compressedBuffer = zlib.deflateSync(contentBuffer)
    const savePath = path.resolve(process.cwd(), `${webpackCompiler.id}${content.config.version ? '-' + content.config.version : ''}.arenap`)

    const w = new writer(savePath)
    w.setContentVersion(content.config.version || '0.0.0')
    w.addContent(contentBuffer, 'content.json', true)
    w.addContent(fileBuffer.code, 'code.js', true)
    for (let index = 0; index < content.config.plugins.length; index += 1) {
      const p = content.config.plugins[index]
      p.icon && w.addFile(path.resolve(process.cwd(), p.icon), p.icon, false)
      p.thumb && w.addFile(path.resolve(process.cwd(), p.thumb), p.thumb, false)

      if (p.components && p.components.length) {
        p.components.forEach(sub => {
          sub.icon && w.addFile(path.resolve(process.cwd(), sub.icon), sub.icon, false)
          sub.thumb && w.addFile(path.resolve(process.cwd(), sub.thumb), sub.thumb, false)
        })
      }
    }
    content.config.thumb && w.addFile(path.resolve(process.cwd(), content.config.thumb), content.config.thumb, false)

    // add style
    fileBuffer.styles.forEach(style => {
      w.addContent(style.style, style.name)
    })

    w.write()

    // fs.writeFileSync(savePath, compressedBuffer)
  }

  compileWarning(content) {
    t.term.brightYellow(`Warning: ${content}\n`)
  }

  compileError(content) {
    t.term.defaultColor('❗️\t').bgBrightRed(content + '\t')
  }
}

BuildCommand.description = `Build production plugin
...
Build production Arena plugin
`

BuildCommand.flags = {
  bump: flags.string({
    char: 'b',
    // default: 'patch',
    description: 'Auto versioning',
    options: ['patch', 'minor', 'major'],
  }),
  delete: flags.boolean({
    char: 'd',
    description: 'Delete old version',
  }),
  publish: flags.boolean({
    char: 'p',
    description: 'Publish to Arena Market',
    default: false,
  }),
}

module.exports = BuildCommand
