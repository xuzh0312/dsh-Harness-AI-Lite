window.__ModuleLoader__.load({
  id: '@local/dsh-harness-workspace-win',
  factory(require) {
    const { createElement: h, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } = require('react')
    const namespace = 'harnessWorkspaceWin'
    const pickEndpoint = `${namespace}/pick`
    const createEndpoint = `${namespace}/create`
    const roles = ['harness', 'project', 'code', 'test']
    const roleLabels = { harness: 'harness', project: 'project', code: 'project/code', test: 'test' }
    const dictionaries = {
      zh: {
        title: '添加 Harness 工作区',
        intro: '选择四个已存在的目录。插件会补齐 Harness 模板，不覆盖已有模板文件，并将所选路径写入 docs/paths.md。新会话在 harness 目录运行；其余三个目录将作为文件工具的额外可写目录，PowerShell 仍受会话工作目录的沙箱限制。',
        harness: '工作区根：规则、计划与角色',
        project: '项目资料和安装包所在目录',
        code: '实际源码根目录，可在 project 外',
        test: '测试、原型和原始证据',
        choose: '选择…', chooseRole: '选择 {role} 目录', unset: '未选择',
        cancel: '取消', create: '创建', creating: '正在创建…', picking: '正在选择…', done: '完成',
        pickError: '无法选择目录：{message}', createError: '无法完成创建：{message}',
        unexpected: '宿主未返回预期的结果。',
        registered: '工作区已登记：{title}', recorded: '路径已记录，但工作区未登记。',
        scaffold: '已生成 {created} 个模板文件，跳过 {skipped} 个已有文件，补写 {seeded} 个 README。',
        warnings: '已记录路径。请核对以下提示和未完成的步骤。',
      },
      en: {
        title: 'Add Harness workspace',
        intro: 'Choose four existing folders. The plugin fills in missing Harness template files without overwriting existing ones and records the selected paths in docs/paths.md. New sessions run in harness. The other three folders are writable through file tools; PowerShell still follows the session working-directory sandbox limits.',
        harness: 'Workspace root: rules, plans, and roles',
        project: 'Project materials and installers',
        code: 'Actual source root; may be outside project',
        test: 'Tests, prototypes, and raw evidence',
        choose: 'Choose…', chooseRole: 'Choose {role} folder', unset: 'Not chosen',
        cancel: 'Cancel', create: 'Create', creating: 'Creating…', picking: 'Choosing…', done: 'Done',
        pickError: 'Could not choose a folder: {message}', createError: 'Could not complete setup: {message}',
        unexpected: 'The host did not return the expected result.',
        registered: 'Workspace registered: {title}', recorded: 'Paths were recorded, but the workspace was not registered.',
        scaffold: 'Created {created} template files, skipped {skipped} existing files, and added {seeded} README files.',
        warnings: 'Paths recorded. Review these notices for steps that may be incomplete.',
      },
    }

    const css = `
      .hww-trigger, .hww-dialog button { font: inherit; cursor: pointer; }
      .hww-trigger { display:flex; align-items:center; gap:6px; width:100%; min-height:32px; padding:4px 8px; border:0; border-radius:var(--dsw-radius-sm); background:transparent; color:var(--dsw-alias-label-secondary); font-size:13px; text-align:start; }
      .hww-trigger[data-compact] { width:36px; min-height:36px; justify-content:center; margin-inline:auto; padding:0; }
      .hww-trigger svg { flex:none; }
      .hww-trigger span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      .hww-trigger:hover { background:var(--dsw-alias-card-fill-hover); color:var(--dsw-alias-label-primary); }
      .hww-dialog { box-sizing:border-box; width:min(620px, calc(100% - 32px)); max-height:calc(100% - 32px); overflow:auto; margin:auto; padding:20px; border:1px solid var(--dsw-alias-border-l1); border-radius:var(--dsw-radius-lg); background:var(--dsw-alias-bg-layer-1); color:var(--dsw-alias-label-primary); box-shadow:var(--dsw-elevation-prominent); font:14px/1.5 var(--dsw-font-family); pointer-events:auto; overflow-wrap:anywhere; }
      .hww-dialog::backdrop { background:var(--dsw-alias-bg-mask-3, rgba(0,0,0,.48)); pointer-events:auto; }
      .hww-dialog h2 { margin:0; font-size:18px; font-weight:600; }
      .hww-intro { margin:6px 0 12px; color:var(--dsw-alias-label-secondary); }
      .hww-row { display:grid; grid-template-columns:minmax(112px, 1fr) minmax(0, 1.2fr) auto; align-items:center; gap:10px; padding:10px 0; border-bottom:1px solid var(--dsw-alias-border-l1); }
      .hww-hint { display:block; font-size:12px; color:var(--dsw-alias-label-secondary); }
      .hww-path { min-width:0; color:var(--dsw-alias-label-secondary); font:12px/1.5 var(--ds-font-family-code); white-space:pre-wrap; }
      .hww-dialog button { min-height:32px; padding:4px 12px; border:1px solid var(--dsw-alias-border-l2); border-radius:var(--dsw-radius-sm); background:var(--dsw-alias-bg-layer-2); color:inherit; white-space:nowrap; }
      .hww-dialog button:hover:not(:disabled) { background:var(--dsw-alias-interactive-bg-hover-solid); }
      .hww-dialog button:disabled { cursor:default; opacity:.55; }
      .hww-dialog button.hww-primary { border-color:transparent; background:var(--dsw-alias-button-primary-fill); color:var(--dsw-alias-label-primary-foreground); }
      .hww-dialog button.hww-primary:hover:not(:disabled) { background:var(--dsw-alias-button-primary-hover); }
      .hww-footer { margin-top:16px; display:flex; justify-content:flex-end; gap:8px; }
      .hww-error { color:var(--dsw-alias-state-error-primary); margin:12px 0 0; }
      .hww-result h3, .hww-result p, .hww-result ul { margin:8px 0; }
      @media (max-width: 480px) {
        .hww-dialog { padding:16px; }
        .hww-row { grid-template-columns:minmax(0, 1fr) auto; gap:4px 8px; }
        .hww-row .hww-path { grid-column:1; }
        .hww-row button { grid-column:2; grid-row:1 / span 2; }
      }
    `

    function newFlowId() {
      if (typeof globalThis.crypto.randomUUID === 'function') return globalThis.crypto.randomUUID()
      // Ordinary Web over HTTP can expose getRandomValues without randomUUID.
      const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16))
      bytes[6] = (bytes[6] & 0x0f) | 0x40
      bytes[8] = (bytes[8] & 0x3f) | 0x80
      const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')
      return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
    }

    function Dialog({ t, rpc, close }) {
      const [flowId] = useState(newFlowId)
      const [paths, setPaths] = useState({})
      const [busy, setBusy] = useState(null)
      const [error, setError] = useState(null)
      const [result, setResult] = useState(null)
      const dialog = useRef(null)
      const done = useRef(null)
      const lastControl = useRef(null)
      const backdropPress = useRef(false)
      const pending = useRef(false)
      const id = useId()

      useLayoutEffect(() => {
        const node = dialog.current
        node.showModal()
        return () => { if (node.open) node.close() }
      }, [])
      useLayoutEffect(() => {
        if (busy !== null) return
        if (result !== null) done.current?.focus()
        else lastControl.current?.focus()
        lastControl.current = null
      }, [busy, result])

      function dismiss() {
        if (!pending.current) close()
      }

      function outsideDialog(event) {
        if (event.target !== event.currentTarget) return false
        const { left, right, top, bottom } = event.currentTarget.getBoundingClientRect()
        return event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom
      }

      async function run(operation, work) {
        if (pending.current) return
        pending.current = true
        setBusy(operation)
        setError(null)
        try {
          await work()
        } catch (reason) {
          setError({ key: operation === 'create' ? 'createError' : 'pickError', message: reason?.message || String(reason) })
        } finally {
          pending.current = false
          setBusy(null)
        }
      }

      function choose(role, control) {
        lastControl.current = control
        return run(role, async () => {
          const chosen = await rpc(pickEndpoint, { flowId, role }, t)
          if (chosen === null) return
          if (typeof chosen !== 'string' || chosen === '') throw new Error(t('unexpected'))
          setPaths(current => ({ ...current, [role]: chosen }))
        })
      }

      const complete = roles.every(role => Boolean(paths[role]))
      function submit(event) {
        event.preventDefault()
        if (!complete || result !== null || pending.current) return
        lastControl.current = event.nativeEvent.submitter
        void run('create', async () => {
          const value = await rpc(createEndpoint, { flowId, request: paths }, t)
          if (!value?.paths || !value.scaffold || !Array.isArray(value.warnings)) throw new Error(t('unexpected'))
          setResult(value)
        })
      }

      return h('dialog', {
        ref: dialog, className: 'hww-dialog', 'aria-labelledby': `${id}-title`,
        'aria-describedby': result === null ? `${id}-intro` : undefined, 'aria-modal': true,
        onCancel: event => { event.preventDefault(); dismiss() },
        onPointerDown: event => { backdropPress.current = outsideDialog(event) },
        onClick: event => {
          if (backdropPress.current && outsideDialog(event)) dismiss()
          backdropPress.current = false
        },
      }, h('form', { onSubmit: submit },
        h('h2', { id: `${id}-title` }, t('title')),
        result === null ? h('div', null,
          h('p', { id: `${id}-intro`, className: 'hww-intro' }, t('intro')),
          roles.map(role => h('div', { key: role, className: 'hww-row' },
            h('div', null, h('strong', null, roleLabels[role]), h('span', { className: 'hww-hint' }, t(role))),
            h('div', { className: 'hww-path', id: `${id}-${role}` }, paths[role] ?? t('unset')),
            h('button', {
              type: 'button', disabled: busy !== null,
              'aria-label': t('chooseRole', { role: roleLabels[role] }), 'aria-describedby': `${id}-${role}`,
              onClick: event => { void choose(role, event.currentTarget) },
            }, busy === role ? t('picking') : t('choose')))))
          : h('div', { className: 'hww-result' },
            h('p', { role: 'status' }, result.workspace
              ? t('registered', { title: result.workspace.title || result.paths.harness }) : t('recorded')),
            h('p', null, t('scaffold', result.scaffold)),
            roles.map(role => h('div', { key: role, className: 'hww-path' }, `${roleLabels[role]}: ${result.paths[role]}`)),
            result.warnings.length > 0 && h('div', null,
              h('h3', null, t('warnings')),
              h('ul', null, result.warnings.map((warning, index) => h('li', { key: index }, warning))))),
        error && h('p', { className: 'hww-error', role: 'alert' }, t(error.key, { message: error.message })),
        h('div', { className: 'hww-footer' }, result === null ? [
          h('button', { key: 'cancel', type: 'button', onClick: dismiss, disabled: busy !== null }, t('cancel')),
          h('button', { key: 'create', type: 'submit', className: 'hww-primary', disabled: !complete || busy !== null },
            busy === 'create' ? t('creating') : t('create')),
        ] : h('button', { ref: done, type: 'button', className: 'hww-primary', onClick: dismiss }, t('done'))),
      ))
    }

    return {
      inject: ['slots', 'locale', 'connection', 'remoteAccess'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(namespace, dictionaries), 'harness-workspace-win: locale')
        let visible = false
        const listeners = new Set()
        const subscribe = listener => {
          listeners.add(listener)
          return () => listeners.delete(listener)
        }
        const getSnapshot = () => visible
        function setVisible(next) {
          if (next === visible) return
          visible = next
          for (const listener of listeners) listener()
        }
        async function rpc(endpoint, args, t) {
          const result = await ctx.connection.rpc.call('/api', endpoint, { args })
          if (!result.ok) throw new Error(result.error?.message || t('unexpected'))
          return result.value
        }
        function FooterAction({ wide, t }) {
          return h('button', {
            type: 'button', className: 'hww-trigger', 'data-compact': wide ? undefined : '',
            title: t('title'), 'aria-label': t('title'), 'aria-haspopup': 'dialog',
            onClick: () => setVisible(true),
          }, h('svg', { viewBox: '0 0 16 16', width: 16, height: 16, 'aria-hidden': true, fill: 'none' },
            h('path', {
              d: 'M2.5 4.5a1 1 0 0 1 1-1h3l1.2 1.4h4.8a1 1 0 0 1 1 1v6.6a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1zM8 8.2v3.1M6.4 9.7h3.2',
              stroke: 'currentColor', strokeWidth: 1.2, strokeLinejoin: 'round', strokeLinecap: 'round',
            })), wide && h('span', null, t('title')))
        }
        function Overlay({ t }) {
          const open = useSyncExternalStore(subscribe, getSnapshot)
          return h('div', null, h('style', null, css), open && h(Dialog, { t, rpc, close: () => setVisible(false) }))
        }
        ctx.remoteAccess.whenAccess(createEndpoint, () => ctx.remoteAccess.whenAccess(pickEndpoint, function* () {
          yield ctx.slots.inject('shell.overlay', () => ctx.slots.register({
            name: 'shell.overlay', id: 'harness-workspace-win-dialog', order: 900, locale: namespace,
          }, Overlay))
          yield ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
            name: 'sidebar.footer.action', id: 'harness-workspace-win', order: 120, locale: namespace,
          }, FooterAction))
          yield () => setVisible(false)
        }))
      },
    }
  },
})
