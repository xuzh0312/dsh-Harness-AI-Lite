const { basename } = require('node:path')
const { platform } = require('node:os')
const {
  resolveDirectory, workspacePaths, scaffoldWorkspace, writeMarker, readMarker,
  syncPathsTable, samePath, digest,
} = require('./workspace.cjs')

const namespace = 'harnessWorkspaceWin'
const roles = ['project', 'code', 'test']
const remoteMethods = '@deepseek-ai/dsh-typert-protocol/remote-methods'
const grantKey = (harness) => `harness-workspace-win/${digest(platform() === 'win32' ? harness.toLowerCase() : harness)}`

class HarnessWorkspaceService {
  constructor(ctx) {
    this.ctx = ctx
    this.host = ctx
    this.pending = new Set()
    this.grants = new WeakMap()
    this.picks = new WeakMap()
    this.picking = new WeakSet()
    this.typertRemote = { service: this, serviceKey: namespace, namespace }
    Object.defineProperty(this, Symbol.for('cordis.tracker'), {
      value: { associate: namespace, property: 'ctx' },
    })
  }

  ownerInvocation() {
    const invocation = this.ctx.invocation
    if (invocation?.peer.principal.kind !== 'owner') throw new Error('仅当前 DSH 所有者可以创建 Harness 工作区')
    return invocation
  }

  async pick(flowId, role) {
    const { peer, signal } = this.ownerInvocation()
    if (typeof flowId !== 'string' || !/^[a-f0-9-]{36}$/.test(flowId)) throw new Error('无效的目录选择流程')
    if (role !== 'harness' && !roles.includes(role)) throw new Error('无效的目录角色')
    if (this.picking.has(peer)) throw new Error('目录选择器已打开')
    this.picking.add(peer)
    try {
      const capability = this.host.directoryPicker.capability()
      if (capability.kind !== 'native') throw new Error('此版本只能通过支持原生目录选择器的 DSH 桌面端添加')
      const value = await capability.pick(signal)
      if (value === null) return null
      const dir = await resolveDirectory(value, role)
      let flows = this.picks.get(peer)
      if (!flows) this.picks.set(peer, flows = new Map())
      const now = Date.now()
      for (const [id, flow] of flows) if (flow.expires <= now) flows.delete(id)
      if (!flows.has(flowId)) {
        if (flows.size >= 16) flows.delete(flows.keys().next().value)
        flows.set(flowId, { paths: new Map(), expires: now })
      }
      const flow = flows.get(flowId)
      flow.paths.set(role, dir)
      flow.expires = now + 30 * 60_000
      return dir
    } finally {
      this.picking.delete(peer)
    }
  }

  async create(flowId, request) {
    const { peer } = this.ownerInvocation()
    const flows = this.picks.get(peer)
    const flow = flows?.get(flowId)
    const selected = flow?.paths
    if (!selected || flow.expires <= Date.now() || this.picking.has(peer) || !['harness', ...roles].every((role) => selected.get(role) && selected.get(role) === request?.[role])) {
      throw new Error('请通过目录选择器确认全部四个目录')
    }
    const paths = await workspacePaths(request)
    if (!['harness', ...roles].every((role) => samePath(paths[role], selected.get(role)))) {
      throw new Error('目录已变化，请重新选择')
    }
    const key = grantKey(paths.harness)
    if (this.pending.has(key)) throw new Error('此 Harness 工作区正在创建，请稍后重试')
    if (flows.get(flowId) !== flow || !['harness', ...roles].every((role) => selected.get(role) === request[role])) {
      throw new Error('目录选择已变化，请重试')
    }
    this.pending.add(key)
    try {
      const { scaffold, warnings } = await scaffoldWorkspace(paths)
      const { markerPath, fingerprint } = await writeMarker(paths.harness, paths)
      try {
        await this.host.credentials.modifyRecord(key, () => ({ kind: 'grant', payload: { fingerprint } }))
      } catch (error) {
        warnings.push(`路径已记录，但保存写权限确认失败：${error.message}`)
      }
      try { await syncPathsTable(paths) } catch (error) {
        warnings.push(`路径表未更新：${error.message}`)
      }
      let workspace = null
      const title = basename(paths.harness)
      try {
        const entry = await this.host.workspaceRegistry.create(paths.harness, title)
        workspace = { id: entry.id, title: entry.title ?? title, path: paths.harness }
      } catch (error) {
        warnings.push(`工作区未登记：${error.message}`)
      }
      flows.delete(flowId)
      return { paths, markerPath, workspace, scaffold, warnings }
    } finally {
      this.pending.delete(key)
    }
  }

  async grantFor(agent) {
    const session = agent.session
    const cwd = session?.header?.cwd
    if (!cwd) return
    try {
      const harness = await resolveDirectory(cwd, 'harness')
      const marker = await readMarker(harness)
      if (!marker) return
      const approval = await this.ctx.credentials.readRecord(grantKey(harness))
      if (approval?.kind !== 'grant' || approval.payload?.fingerprint !== marker.fingerprint) return
      let granted = this.grants.get(session)
      if (!granted) this.grants.set(session, granted = [])
      for (const role of roles) {
        const recorded = marker.paths[role]
        try {
          const dir = await resolveDirectory(recorded, role)
          if (!samePath(dir, recorded) || samePath(dir, harness) || granted.some((root) => samePath(root, dir))) continue
          await this.ctx.sandboxPolicy.registerWritableRoot(session, dir)
          granted.push(dir)
        } catch (error) {
          this.ctx.logger.warn(`Harness 工作区未授予 ${role} 写权限：${error.message}`)
        }
      }
    } catch (error) {
      this.ctx.logger.warn(`Harness 工作区未加载写权限：${error.message}`)
    }
  }
}

Object.defineProperty(HarnessWorkspaceService.prototype, remoteMethods, {
  value: { version: 1, methods: ['pick', 'create'].map((method) => ({ method, invocation: { kind: 'direct' } })) },
})

exports.inject = ['workspaceRegistry', 'sandboxPolicy', 'credentials', 'directoryPicker']
exports.apply = function apply(ctx) {
  const service = new HarnessWorkspaceService(ctx)
  ctx.provide(namespace, service)
  ctx.on('agent/created', ({ agent }) => service.grantFor(agent))
}
