const { constants } = require('node:fs')
const fs = require('node:fs/promises')
const path = require('node:path')
const { createHash, randomUUID } = require('node:crypto')

const roles = { harness: 'harness', project: 'project', code: 'project/code', test: 'test' }
const markerName = 'harness-workspace.json'
const bundleRoot = __dirname
const digest = (value) => createHash('sha256').update(value).digest('hex')
const samePath = (a, b) => path.relative(a, b) === ''

function isFullPath(value) {
  if (typeof value !== 'string' || /[\x00-\x1f]/.test(value) || !path.isAbsolute(value)) return false
  if (process.platform !== 'win32') return true
  return /^[a-z]:[\\/]/i.test(value) || /^[\\/]{2}[^\\/?.][^\\/]*[\\/][^\\/]+/.test(value)
}

async function resolveDirectory(value, label) {
  if (!isFullPath(value)) throw new Error(`${label}: 请选择完整绝对路径（${String(value ?? '')}）`)
  try {
    const dir = await fs.realpath(value)
    if (!(await fs.stat(dir)).isDirectory()) throw new Error('不是目录')
    return dir
  } catch (error) {
    throw new Error(`${label}: 无法使用 ${value}（${error.code ?? error.message}）`)
  }
}

async function lstatIfPresent(file) {
  try { return await fs.lstat(file) } catch (error) {
    if (error.code !== 'ENOENT') throw error
    return null
  }
}

// Refuse symlinks and junctions beneath user-selected roots.
async function checkDirectory(dir) {
  const info = await fs.lstat(dir)
  if (!info.isDirectory() || info.isSymbolicLink() || !samePath(await fs.realpath(dir), dir)) {
    throw new Error(`不是普通目录：${dir}`)
  }
}

async function ensureDirectory(dir) {
  try { await fs.mkdir(dir) } catch (error) {
    if (error.code !== 'EEXIST') throw error
  }
  await checkDirectory(dir)
}

async function readRegular(file) {
  const info = await lstatIfPresent(file)
  if (!info) return null
  if (!info.isFile() || info.isSymbolicLink()) throw new Error(`不是普通文件：${file}`)
  return fs.readFile(file, 'utf8')
}

async function replaceRegular(file, data) {
  const temp = `${file}.${randomUUID()}.tmp`
  await fs.writeFile(temp, data, { encoding: 'utf8', flag: 'wx' })
  try { await fs.rename(temp, file) } finally {
    await fs.unlink(temp).catch((error) => { if (error.code !== 'ENOENT') throw error })
  }
}

async function copyTree(source, target, stats, warnings) {
  for (const entry of await fs.readdir(source, { withFileTypes: true })) {
    const from = path.join(source, entry.name)
    const to = path.join(target, entry.name)
    try {
      if (entry.isDirectory()) {
        await ensureDirectory(to)
        await copyTree(from, to, stats, warnings)
      } else if (entry.isFile()) {
        if (await lstatIfPresent(to)) {
          stats.skipped++
          continue
        }
        try {
          await fs.copyFile(from, to, constants.COPYFILE_EXCL)
          stats.created++
        } catch (error) {
          if (error.code !== 'EEXIST') throw error
          stats.skipped++
        }
      }
    } catch (error) {
      warnings.push(`模板项未生成 ${to}：${error.code ?? error.message}`)
    }
  }
}

async function seedReadme(relative, target, stats, ignored = []) {
  const info = await lstatIfPresent(target)
  if (!info) return
  await checkDirectory(target)
  if ((await fs.readdir(target)).some((name) => !ignored.includes(name))) return
  try {
    await fs.copyFile(path.join(bundleRoot, 'seeds', relative, 'README.md'), path.join(target, 'README.md'), constants.COPYFILE_EXCL)
    stats.seeded++
  } catch (error) {
    if (error.code !== 'EEXIST') throw error
  }
}

async function syncPathsTable(paths) {
  const dir = path.join(paths.harness, 'docs')
  await checkDirectory(dir)
  const file = path.join(dir, 'paths.md')
  const lockFile = `${file}.lock`
  const lock = await fs.open(lockFile, 'wx')
  try {
    await lock.writeFile(`harness-workspace-win ${randomUUID()} ${new Date().toISOString()}\n`)
    const markdown = await readRegular(file)
    if (markdown === null) throw new Error('缺少 docs/paths.md')
    const owner = /^当前写入者：[ \t]*([^\r\n]*)/m.exec(markdown)?.[1]
    if (owner && !/^无(?:\s*[（(].*)?$/.test(owner.trim())) throw new Error('路径表登记了其他写入者')
    const labels = new Map(Object.entries(roles).map(([role, label]) => [label, paths[role]]))
    const next = markdown.replace(/^(\|[ \t]*(harness|project\/code|project|test)[ \t]*\|)(?:\\\||[^|\r\n])*\|/gm,
      (_, prefix, label) => `${prefix} ${labels.get(label).replaceAll('|', '\\|')} |`)
    if (next !== markdown) await replaceRegular(file, next)
  } finally {
    await lock.close()
    await fs.unlink(lockFile)
  }
}

async function readMarker(harness) {
  const dir = path.join(harness, '.dsh')
  if (!await lstatIfPresent(dir)) return null
  await checkDirectory(dir)
  const raw = await readRegular(path.join(dir, markerName))
  if (raw === null) return null
  try {
    const record = JSON.parse(raw)
    if (record?.version !== 1 || !Object.keys(roles).every((role) => isFullPath(record.paths?.[role]))) return null
    if (!samePath(harness, record.paths.harness)) return null
    return { paths: record.paths, fingerprint: digest(raw) }
  } catch {
    return null
  }
}

async function writeMarker(harness, paths) {
  const dir = path.join(harness, '.dsh')
  await ensureDirectory(dir)
  const markerPath = path.join(dir, markerName)
  const existing = await readRegular(markerPath)
  if (existing !== null && !await readMarker(harness)) throw new Error(`已有无法识别的工作区记录：${markerPath}`)
  const body = `${JSON.stringify({ version: 1, updatedAt: new Date().toISOString(), paths }, null, 2)}\n`
  await replaceRegular(markerPath, body)
  return { markerPath, fingerprint: digest(body) }
}

async function workspacePaths(request) {
  const paths = {}
  for (const [role, label] of Object.entries(roles)) paths[role] = await resolveDirectory(request?.[role], label)
  const physical = await fs.realpath(bundleRoot)
  for (const dir of Object.values(paths)) {
    if (samePath(dir, path.parse(dir).root)) throw new Error(`请选择具体项目目录：${dir}`)
    const isWithin = (parent, child) => {
      const relative = path.relative(parent, child)
      return !path.isAbsolute(relative) && relative !== '..' && !relative.startsWith(`..${path.sep}`)
    }
    if (isWithin(physical, dir) || isWithin(dir, physical)) {
      throw new Error(`请选择与插件安装目录分开的项目目录：${dir}`)
    }
  }
  return paths
}

async function scaffoldWorkspace(paths) {
  const warnings = []
  const scaffold = { created: 0, skipped: 0, seeded: 0 }
  const rel = path.relative(paths.project, paths.code)
  if (rel === '..' || rel.startsWith(`..${path.sep}`) || path.isAbsolute(rel)) {
    warnings.push(`project/code 不在 project 目录下：${paths.code}`)
  }
  await copyTree(path.join(bundleRoot, 'template'), paths.harness, scaffold, warnings)
  const seeds = [
    ['project', paths.project, ['code', 'installpark']],
    [path.join('project', 'code'), paths.code],
    [path.join('project', 'installpark'), path.join(paths.project, 'installpark')],
    ['test', paths.test],
  ]
  for (const [relative, dir, ignored] of seeds) {
    try { await seedReadme(relative, dir, scaffold, ignored) } catch (error) {
      warnings.push(`README 未补写 ${dir}：${error.code ?? error.message}`)
    }
  }
  try {
    if (!await readRegular(path.join(paths.harness, 'AGENTS.md'))) warnings.push('harness 缺少有效的 AGENTS.md')
  } catch (error) { warnings.push(`无法读取 AGENTS.md：${error.message}`) }
  return { scaffold, warnings }
}

exports.resolveDirectory = resolveDirectory
exports.workspacePaths = workspacePaths
exports.scaffoldWorkspace = scaffoldWorkspace
exports.writeMarker = writeMarker
exports.readMarker = readMarker
exports.syncPathsTable = syncPathsTable
exports.samePath = samePath
exports.digest = digest
