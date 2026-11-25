(() => {
  'use strict';
  const root = document.querySelector('[data-guide]');
  if (!root) return;
  const page = root.dataset.guide;
  const index = window.UI_GUIDE_INDEX?.[page];
  if (!index) {
    root.querySelector('.guide-count').textContent = '目录加载失败。请将配套文件放在同一目录，再重新打开。';
    return;
  }
  const examples = page === 'layout' ? window.UI_LAYOUT_EXAMPLES : {
    ...window.UI_MOTION_STYLE, ...window.UI_MOTION_INTERACTION, ...window.UI_MOTION_STRUCTURE
  };
  const originals = page === 'layout' ? {
    '1.8':'grid','1.10':'masonry','1.11':'grid','3.1':'nav-position','3.2':'nav-position',
    '3.4':'sidebar','4.2':'hero','5.2':'article','7.1':'twelve'
  } : {
    '1.1':'neumorphism','1.3':'neumorphism','1.4':'glassmorphism','2.1':'gradient-comparison',
    '2.2':'gradient-comparison','4.1':'spring-motion','4.2':'skeleton-screen',
    '4.6':'spring-motion','5.3':'scroll-reveal','5.5':'scroll-snap'
  };
  const originalKinds = page === 'layout' ? {'1.10':'近似'} : {'2.2':'近似','4.6':'近似'};
  const groups = new Map(), rows = [], nav = root.querySelector('.guide-chapters');
  const listing = root.querySelector('.guide-list');
  const filter = root.querySelector('input');
  const count = root.querySelector('.guide-count');
  const cssBase = `:root { color-scheme:light; --forest:#315941; --line:#ccd3c6; --tile:#e6ede1; }
* { box-sizing:border-box; }
body { margin:0; padding:10px; background:#faf9f4; color:#202722; font:14px/1.45 system-ui,"Microsoft YaHei",sans-serif; }
button,input,select,textarea { font:inherit; color:inherit; }
button,summary { cursor:pointer; }
a { color:var(--forest); }
:focus-visible { outline:2px solid #315941; outline-offset:2px; }
[hidden] { display:none !important; }`;
  function node(tag, cls, text) {
    const result = document.createElement(tag);
    if (cls) result.className = cls;
    if (text) result.textContent = text;
    return result;
  }
  function makeFrame(entry, data) {
    const frame = node('iframe');
    frame.title = `${entry.id} ${entry.title}`;
    frame.setAttribute('sandbox', page === 'layout' && entry.id === '5.7' ? 'allow-scripts allow-forms' : 'allow-scripts');
    frame.style.height = `${data.height || 188}px`;
    // Sandbox has no same-origin access; keep examples entirely local and block network subresources.
    frame.srcdoc = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base href="about:srcdoc"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; media-src data: blob:; form-action 'none'"><style>${cssBase}\n${data.css || ''}</style></head><body>${data.html}${data.js ? '<script>' + data.js.replace(/<\/script/gi,'<\\/script') + '</script>' : ''}</body></html>`;
    return frame;
  }
  function appendDemo(row, entry, data) {
    const body = node('div','guide-body');
    body.append(node('p','',data.note));
    const stage = node('div','guide-stage');
    body.append(stage);
    const source = node('details','guide-source');
    source.append(node('summary','','查看实际演示源码'));
    for (const [lang, text] of [['HTML',data.html],['CSS',`${cssBase}\n\n${data.css || ''}`],['JavaScript',data.js]]) {
      if (!text) continue;
      const pre = node('pre'), code = node('code','',text.trim());
      pre.tabIndex = 0;
      pre.setAttribute('aria-label',`${entry.id} ${lang} 源码`);
      pre.append(code);
      source.append(node('h4','',lang),pre);
    }
    body.append(source);
    row.append(body);
    row.addEventListener('toggle', () => {
      if (row.open && !stage.firstChild) stage.append(makeFrame(entry,data));
      else if (!row.open) stage.replaceChildren();
    });
  }
  for (const entry of index) {
    if (!groups.has(entry.group)) {
      const group = node('section','guide-group');
      group.id = `guide-chapter-${entry.id.split('.')[0]}`;
      group.append(node('h3','',entry.group));
      listing.append(group);
      const jump = node('a','',entry.group.split(/\s/)[0]);
      jump.href = `#${group.id}`;
      nav.append(jump);
      groups.set(entry.group,{group,jump,rows:[]});
    }
    const data = examples?.[entry.id], original = originals[entry.id];
    const row = node(data && !original ? 'details' : 'div','guide-row');
    row.id = `guide-${entry.id.replace('.','-')}`;
    row.dataset.technique = entry.id;
    row.dataset.searchTerms = `${entry.scenarios || ''} ${entry.keywords || ''} ${data?.aliases || ''}`;
    const label = node(data && !original ? 'summary' : 'div',data && !original ? '' : 'guide-link');
    label.append(node('span','guide-id',entry.id),node('span','',entry.title));
    if (original) {
      const link = node('a','guide-legacy','查看上方对照 ↑');
      link.href = `#${original}`;
      label.append(node('span','guide-badge',originalKinds[entry.id] || '已有对照'),link);
    } else if (data) {
      label.append(node('span','guide-badge',data.kind || '实作'));
    } else {
      label.append(node('span','guide-empty','未载入标本'));
      row.dataset.missing = '';
    }
    row.append(label);
    if (data && !original) appendDemo(row,entry,data);
    const group = groups.get(entry.group);
    group.group.append(row);
    group.rows.push(row);
    rows.push(row);
  }
  function updateFilter() {
    const words = filter.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let visible = 0;
    for (const row of rows) {
      const search = `${row.firstChild.textContent} ${row.dataset.searchTerms}`.toLowerCase();
      row.hidden = !words.every(word => /^\d+\.\d+$/.test(word) ? row.dataset.technique === word : search.includes(word));
      if (!row.hidden) visible++;
    }
    for (const group of groups.values()) group.jump.hidden = group.group.hidden = group.rows.every(row => row.hidden);
    const missing = rows.filter(row => Object.hasOwn(row.dataset,'missing')).length;
    count.textContent = `显示 ${visible} / ${index.length} 个编号${missing ? ` · ${missing} 项未载入，请检查配套文件` : ''}`;
  }
  function jumpToTechnique() {
    const target = document.getElementById(location.hash.slice(1));
    if (!target?.classList.contains('guide-row') && !target?.classList.contains('guide-group')) return;
    if (target.hidden || target.closest('[hidden]')) {
      filter.value = '';
      updateFilter();
    }
    if (target instanceof HTMLDetailsElement) target.open = true;
    requestAnimationFrame(() => target.scrollIntoView({block:'start'}));
  }
  if (page === 'layout') {
    const narrow = document.querySelector('#narrow');
    const nearIndex = document.querySelector('#guide-narrow');
    const widthChoices = document.querySelectorAll('input[name="width"]');
    const wide = [...widthChoices].find(input => input !== narrow);
    nearIndex.checked = narrow.checked;
    for (const choice of widthChoices) choice.addEventListener('change', () => { nearIndex.checked = narrow.checked; });
    nearIndex.addEventListener('change', () => { (nearIndex.checked ? narrow : wide).checked = true; });
  }
  filter.addEventListener('input', updateFilter);
  window.addEventListener('hashchange', jumpToTechnique);
  updateFilter();
  jumpToTechnique();
})();
