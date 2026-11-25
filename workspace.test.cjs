const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const path = require('node:path')
const { test } = require('node:test')
const { apply } = require('./index.cjs')

test('Windows workspace creation, repeat creation, and session grants', async () => {
  const root = await fs.realpath(await fs.mkdtemp(path.join(__dirname, '..', '.harness-workspace-test-')))
  try {
    const paths = { harness: path.join(root, '管理 $&'), project: path.join(root, '软件'), test: path.join(root, '测试') }
    paths.code = path.join(paths.project, 'code')
    for (const dir of Object.values(paths)) await fs.mkdir(dir, { recursive: true })
    const rolePaths = [paths.harness, paths.project, paths.code, paths.test]
    const picks = [...rolePaths]
    const records = new Map()
    const granted = []
    let service, onCreated
    const ctx = {
      invocation: { peer: { principal: { kind: 'owner' } } },
      provide: (namespace, instance) => { service = instance },
      on: (name, callback) => { assert.equal(name, 'agent/created'); onCreated = callback },
      workspaceRegistry: { create: async (dir, title) => ({ id: 'example', dir, title }) },
      credentials: { modifyRecord: async (key, update) => records.set(key, update()), readRecord: async (key) => records.get(key) },
      directoryPicker: { capability: () => ({ kind: 'native', pick: async () => picks.shift() ?? null }) },
      sandboxPolicy: { registerWritableRoot: (session, dir) => granted.push([session, dir]) },
      logger: { warn: (message) => assert.fail(message) },
    }
    const flowId = '00000000-0000-4000-8000-000000000000'
    apply(ctx)
    await assert.rejects(service.create(flowId, paths), /选择器/)
    ctx.invocation.peer.principal.kind = 'guest'
    await assert.rejects(service.pick(flowId, 'harness'), /仅当前/)
    ctx.invocation.peer.principal.kind = 'owner'
    await assert.rejects(service.pick(flowId, 'other'), /角色/)
    for (const [role, dir] of Object.entries({ harness: paths.harness, project: paths.project, code: paths.code, test: paths.test })) {
      assert.equal(await service.pick(flowId, role), dir)
    }
    assert.equal(await service.pick(flowId, 'test'), null)
    await assert.rejects(service.create(flowId, { ...paths, test: paths.project }), /选择器/)
    await assert.rejects(service.create('00000000-0000-4000-8000-000000000001', paths), /选择器/)
    const first = await service.create(flowId, paths)
    assert.deepEqual(first.scaffold, { created: 51, skipped: 0, seeded: 3 })
    assert.deepEqual(first.warnings, [])
    assert.equal(first.workspace.path, paths.harness)
    const table = path.join(paths.harness, 'docs', 'paths.md')
    const rendered = await fs.readFile(table, 'utf8')
    for (const [label, dir] of [['harness', paths.harness], ['project', paths.project], ['project/code', paths.code], ['test', paths.test]]) {
      assert.ok(rendered.includes(`| ${label} | ${dir} |`))
    }
    const custom = path.join(paths.harness, 'AGENTS.md')
    await fs.appendFile(custom, '\nfixture preserved\n')
    await fs.writeFile(`${table}.lock`, 'other writer', { flag: 'wx' })
    await assert.rejects(service.create(flowId, paths), /选择器/)
    picks.push(...rolePaths)
    for (const role of ['harness', 'project', 'code', 'test']) await service.pick(flowId, role)
    const second = await service.create(flowId, paths)
    assert.deepEqual(second.scaffold, { created: 0, skipped: 51, seeded: 0 })
    assert.ok(second.warnings.some((warning) => warning.includes('路径表未更新')))
    assert.equal(await fs.readFile(table, 'utf8'), rendered)
    assert.match(await fs.readFile(custom, 'utf8'), /fixture preserved/)
    const session = { header: { cwd: paths.harness } }
    await onCreated({ agent: { session } })
    await onCreated({ agent: { session } })
    assert.deepEqual(granted, [paths.project, paths.code, paths.test].map((dir) => [session, dir]))
    const child = { header: { cwd: paths.harness } }
    await onCreated({ agent: { session: child } })
    assert.deepEqual(granted.slice(3), [paths.project, paths.code, paths.test].map((dir) => [child, dir]))
    const marker = JSON.parse(await fs.readFile(first.markerPath, 'utf8'))
    marker.paths.code = root
    await fs.writeFile(first.markerPath, JSON.stringify(marker))
    await onCreated({ agent: { session: { header: { cwd: paths.harness } } } })
    await onCreated({ agent: { session: { header: { cwd: paths.project } } } })
    assert.equal(granted.length, 6)
  } finally {
    assert.equal(path.dirname(root), await fs.realpath(path.join(__dirname, '..')))
    assert.match(path.basename(root), /^\.harness-workspace-test-/)
    await fs.rm(root, { recursive: true, force: true })
  }
})
