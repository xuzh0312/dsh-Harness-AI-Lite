window.UI_LAYOUT_EXAMPLES = {
  '1.1': {
    note: '三个区块共用一份页面；点击顶部锚点定位。单页说的是内容是否拆页，不代表必须很长。', height:220,
    html:`<nav aria-label="本页区块"><button data-to="intro">概览</button><button data-to="paths">步道</button><button data-to="tips">须知</button></nav>
<div class="sections" tabindex="0" aria-label="可滚动的单页内容">
  <section id="intro" tabindex="-1"><b>01 / 概览</b><p>从山脚出发，三条半日路线可选。</p></section>
  <section id="paths" tabindex="-1"><b>02 / 步道</b><p>林间的松林道最平缓；溪谷线适合沿途歇脚。</p></section>
  <section id="tips" tabindex="-1"><b>03 / 须知</b><p>雨后别走湿滑的石阶；请带足饮水。</p></section>
</div>`,
    css:`nav{display:flex;gap:8px;padding-bottom:8px}.sections{height:150px;overflow:auto;border:1px solid var(--line)}
section{min-height:100%;padding:20px;background:var(--tile)}section:nth-child(2){background:#d8e8d9}section:nth-child(3){background:#f1e6d3}p{margin:.4em 0}
@media(prefers-reduced-motion:no-preference){.sections{scroll-behavior:smooth}}`,
    js:`const sections = document.querySelector('.sections');
document.querySelectorAll('[data-to]').forEach(btn => btn.onclick = () => {
  const target = document.getElementById(btn.dataset.to);
  target.focus({preventScroll:true});
  sections.scrollTop += target.getBoundingClientRect().top - sections.getBoundingClientRect().top - sections.clientTop;
});`
  },
  '1.2': {
    note: '点击导航会换入独立编写的首页、步道页或须知页模板，共用页头页脚；这里模拟拆页体验，不会加载新文档或改变浏览器地址。', height:215, kind:'近似',
    html:`<header><b>山间站点</b><nav aria-label="站点导航"><button data-page="home" aria-current="page">首页</button><button data-page="paths">步道</button><button data-page="tips">出行须知</button></nav></header>
<main></main><footer>山间站点 · 步道资料</footer>
<template id="home"><h2 tabindex="-1">山间路线</h2><p>选一条半日步道，出发走走。</p></template>
<template id="paths"><h2 tabindex="-1">步道目录</h2><ul><li>松林道 · 2.5 公里</li><li>溪谷线 · 4 公里</li></ul></template>
<template id="tips"><h2 tabindex="-1">行前检查</h2><p><strong>雨后提示：</strong>避开湿石阶，记得携带饮水。</p></template>`,
    css:`header,footer{padding:6px 9px;background:var(--tile)}header{display:flex;align-items:center;flex-wrap:wrap;gap:4px 12px}nav{display:flex;flex-wrap:wrap;gap:4px}button[aria-current]{background:var(--forest);color:white}main{min-height:102px;padding:7px 9px;border-inline:1px solid var(--line);background:white}h2,p,ul{margin:.15em 0}h2{font-size:18px}ul{padding-inline-start:1.2em}footer{font-size:12px}`,
    js:`const buttons = [...document.querySelectorAll('button[data-page]')];
const main = document.querySelector('main');
function openPage(selected, focus = false) {
  buttons.forEach(button => button === selected ? button.setAttribute('aria-current','page') : button.removeAttribute('aria-current'));
  const template = document.getElementById(selected.dataset.page);
  main.replaceChildren(template.content.cloneNode(true));
  if (focus) main.querySelector('h2').focus();
}
buttons.forEach(button => button.onclick = () => openPage(button, true));
openPage(buttons[0]);`
  },
  '1.3': {
    note: '在框内向下滚动，进度条跟进；章节按海拔编排，滚动距离参与叙事，而不是只用菜单定位。', height:232,
    html:`<label for="progress">登山记录 · 阅读进度</label><progress id="progress" max="100" value="0"></progress>
<div class="trail" tabindex="0" aria-label="向下滚动阅读登山记录">
  <section><small>01 / 240 米</small><h2>从山脚穿过薄雾</h2><p>沿木栈道走进松影。</p></section>
  <section><small>02 / 410 米</small><h2>踩着石阶跨溪谷</h2><p>水声渐远，林道开始抬升。</p></section>
  <section><small>03 / 610 米</small><h2>离开树冠，望见山脊</h2><p>可在前方观景台休息。</p></section>
  <section><small>04 / 760 米</small><h2>到达山顶</h2><p>整条上山路尽收眼底。</p></section>
</div>`,
    css:`label{font-size:12px;font-weight:700}progress{display:block;width:100%;height:8px;margin:4px 0 7px;accent-color:var(--forest)}
.trail{height:164px;overflow:auto;border:1px solid var(--line)}section{display:grid;align-content:center;min-height:154px;padding:16px;background:#e4eddc}
section:nth-child(2){background:#cddfd7}section:nth-child(3){background:#a9c7b4}section:nth-child(4){background:#315941;color:#fff}h2,p{margin:.15em 0}h2{font-size:clamp(17px,4vw,25px)}`,
    js:`const trail = document.querySelector('.trail');
const progress = document.querySelector('progress');
function update() { progress.value = 100 * trail.scrollTop / Math.max(1, trail.scrollHeight - trail.clientHeight); }
trail.addEventListener('scroll', update, {passive:true});
addEventListener('resize', update);`
  },
  '1.4': {
    note: '大标题占据示例首屏；往下才出现次要信息。强调的是首屏份量，不限定居中，也不需要全屏背景图。', height:215,
    html:`<main><section class="opening"><small>山间特辑 / 01</small><h1>在山里<br>留半天</h1><p>三条路线，慢慢走。</p></section>
<section class="secondary"><b>出行信息</b><p>路线、坡度和补给点可在出发前查阅。</p></section></main>`,
    css:`.opening{min-height:calc(100vh - 20px);display:grid;align-content:center;justify-items:start;padding:14px clamp(16px,6vw,64px);background:#dbe8d7;border-inline-start:7px solid var(--forest)}
h1{font-size:clamp(36px,10vw,65px);line-height:1.01;margin:.12em 0;color:var(--forest);letter-spacing:-.05em}p{margin:0}.secondary{padding:16px 22px;margin-block:8px;border-top:1px solid var(--line)}`
  },
  '1.5': {
    note: '两种主题平分同一舞台，彼此独立、权重相近；不等于一侧列表驱动另一侧详情。窄屏上下各半。', height:225,
    html:`<main class="split"><section><small>01 / 山林</small><h2>沿松林走</h2><p>平缓林道 · 2.5 公里</p></section>
<section><small>02 / 水岸</small><h2>循溪流走</h2><p>沿溪步行 · 4 公里</p></section></main>`,
    css:`.split{height:calc(100vh - 20px);display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2px}
section{display:grid;align-content:center;justify-items:start;padding:10px clamp(12px,4vw,36px);background:#dce9d7;color:#1f402f}section+section{background:#dee9ed;color:#173944}h2,p{margin:.12em 0}h2{font-size:clamp(20px,5vw,34px)}
@media(max-width:360px){.split{grid-template-columns:1fr;grid-template-rows:repeat(2,minmax(0,1fr))}}`
  },
  '1.6': {
    note: '内联矢量风景铺满预览，标题叠在暗色遮罩上。与首屏聚焦不同，关键在背景层覆盖，而不是字有多大。', height:200,
    html:`<main><svg class="landscape" aria-hidden="true" viewBox="0 0 780 290" preserveAspectRatio="xMidYMid slice">
  <rect width="780" height="290" fill="#b2ccc5"/><circle cx="560" cy="72" r="44" fill="#fae2a1"/>
  <path d="M0 178 132 94 224 150 355 53 558 166 650 95 780 184V290H0Z" fill="#69897e"/>
  <path d="M0 230 122 160 194 187 330 128 460 219 630 166 780 208V290H0Z" fill="#476a58"/>
  <path d="M0 248C145 290 250 200 425 243S690 204 780 247V290H0Z" fill="#25493a"/>
</svg><div class="caption"><h1>山谷的清晨</h1><p>溪谷线 · 沿水一路向上</p></div></main>`,
    css:`body{padding:0}main{position:relative;isolation:isolate;display:grid;align-items:end;min-height:100vh;color:white}
.landscape,main::after{position:absolute;inset:0;width:100%;height:100%;z-index:-1}main::after{content:"";background:linear-gradient(0deg,#122b23e8,transparent 85%)}
.caption{padding:clamp(14px,5vw,42px)}h1,p{margin:.12em 0}`
  },
  '1.7': {
    note: '封面报道配大图和摘要，短讯用更小的字号和区域；大小由编辑权重决定，而不是一组同规格卡片。', height:232,
    html:`<header>山间志 <small>· 第 08 期</small></header>
<div class="mag"><article class="feature"><svg aria-hidden="true" viewBox="0 0 320 75" preserveAspectRatio="none"><rect width="320" height="75" fill="#d7cba4"/><path d="M0 75 89 21 135 44 212 4 320 64V75Z" fill="#6d9174"/><path d="M0 75 60 40 160 72 258 37 320 75Z" fill="#365b48"/></svg><small>封面报道</small><h2>山脊上的秋色</h2><p>从林地到草坡，一趟慢行观察。</p></article>
<aside aria-label="本期短讯"><article><b>行前</b><p>南坡木栈道已修复。</p></article><article><b>人物</b><p>跟护林员走一段河岸。</p></article></aside></div>`,
    css:`header{font-family:Georgia,"Songti SC",serif;font-size:25px;font-weight:700;line-height:1.2;border-bottom:3px double var(--forest);padding-bottom:6px;margin-bottom:8px}small{font:650 11px system-ui;color:var(--forest)}
.mag{display:grid;grid-template-columns:minmax(0,2fr) minmax(0,1fr);gap:10px}.feature svg{display:block;width:100%;height:72px;margin-bottom:5px}h2,p{margin:0}h2{font-size:19px}aside{border-inline-start:1px solid var(--line);padding-inline-start:9px}aside article{padding:6px 0;border-bottom:1px solid var(--line);font-size:12px}`
  },
  '1.9': {
    note: '同一行的卡片各自包含状态、标题和详情；展开一张不更换其它卡片。卡片是一种内容单元，不是栅格列数。', height:192,
    html:`<div class="cards"><details><summary><small>轻松</small><b>松林道</b><span>2.5 公里</span></summary><p>约 1 小时，入口有水站。</p></details>
<details><summary><small>适中</small><b>溪谷线</b><span>4 公里</span></summary><p>约 2 小时，雨后注意湿滑。</p></details>
<details><summary><small>进阶</small><b>观景环</b><span>6 公里</span></summary><p>约 3 小时，终点回到入口。</p></details></div>`,
    css:`.cards{display:flex;flex-wrap:wrap;align-items:flex-start;gap:8px}details{flex:1 1 85px;min-width:0;padding:8px;background:white;border:1px solid var(--line);border-radius:10px;box-shadow:0 2px 4px #25493a14}summary{cursor:pointer;color:var(--forest)}summary b,summary span{display:block}summary b{font-size:16px}summary span,p{font-size:12px}p{margin:6px 0 0;border-top:1px solid var(--line);padding-top:5px}details[open]{background:var(--tile)}`
  },
  '1.12': {
    note: '在框内滚动，近山、中岭和远景按不同系数移动。减少动态效果开启时保留静态分层。', height:225,
    html:`<div class="view" tabindex="0" aria-label="上下滚动观察三层山景的速度差"><div class="depth"><div class="scene">
  <i class="far"></i><i class="mid"></i><i class="near"></i><span>远景 0.09 · 中景 0.25 · 近景 0.47</span>
</div></div></div><small>在图内上下滚动，观察山峰的相对位移。</small>`,
    css:`.view{height:164px;overflow:auto;border:1px solid var(--line)}.depth{height:344px}.scene{position:sticky;top:0;height:162px;overflow:hidden;isolation:isolate;background:#d6e7e0}
.scene i{position:absolute;inset:0;transform:translateY(calc(var(--scroll,0px) * var(--speed)));pointer-events:none}
.far{--speed:-.09;background:#a1bfae;clip-path:polygon(0 84%,23% 45%,43% 64%,66% 28%,100% 74%,100% 160%,0 160%)}
.mid{--speed:-.25;background:#678d75;clip-path:polygon(0 95%,24% 60%,57% 88%,82% 59%,100% 81%,100% 160%,0 160%)}
.near{--speed:-.47;background:#315941;clip-path:polygon(0 97%,17% 82%,51% 100%,75% 77%,100% 96%,100% 170%,0 170%)}
.scene span{position:absolute;top:6px;left:8px;background:white;padding:3px 7px;font-size:11px}small{display:block;margin-top:5px}
@media(prefers-reduced-motion:reduce){.scene i{transform:none}}`,
    js:`const view = document.querySelector('.view');
view.addEventListener('scroll', () => view.style.setProperty('--scroll', view.scrollTop + 'px'), {passive:true});`
  },
  '2.1': {
    note: '先扫页首的总题和摘要，再沿左边扫每条报道标题，下方横向阅读逐渐变短。虚线用于讲解，不声称能预测每个人的视线。', height:222,
    html:`<main class="scan"><header><small>本周简报</small><h2>周末去哪儿？三条山间步道推荐</h2><p>按坡度、路况与步行时间筛选。</p></header>
<article><b>松林道 · 林荫平路</b><p>2.5 公里，入口有补给点。</p></article><article><b>溪谷线 · 溪畔木道</b><p>4 公里，雨后湿滑。</p></article>
</main>`,
    css:`.scan{padding-inline-start:10px;border-inline-start:2px dashed #6d9075}.scan>*{padding:0 0 5px;margin:0 0 7px;border-bottom:1px dashed #6d9075}.scan article:nth-child(2){width:71%}.scan article:nth-child(3){width:56%}
h2,p{margin:.08em 0}h2{font-size:18px;color:var(--forest)}small,p{font-size:12px}`
  },
  '2.2': {
    note: '左上名称、右上标签、左下卖点、右下行动组成 Z 型阅读顺序；连线为演示标记，适用于内容少的推广页。', height:197,
    html:`<main class="z"><svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M5 10H95L5 90H95" fill="none" stroke="#8aa28a" stroke-dasharray="5 4" vector-effect="non-scaling-stroke"/></svg>
<b>山间周末</b><small>半日精选</small><strong>半天就能上山</strong><button>选路线 →</button></main><p role="status"></p>`,
    css:`.z{display:grid;grid-template-columns:1fr auto;grid-template-rows:repeat(2,1fr);align-items:center;gap:14px;position:relative;isolation:isolate;height:132px;padding:8px;background:#e6ede1}.z svg{position:absolute;inset:13px 6px;width:calc(100% - 12px);height:calc(100% - 26px);z-index:-1}.z :is(b,small,strong){justify-self:start;background:#f9faf6;padding:4px 7px}.z small{justify-self:end}.z strong{font-size:clamp(15px,4.6vw,22px)}button{background:var(--forest);color:white}p{margin:5px 0}`,
    js:`document.querySelector('button').onclick = () => { document.querySelector('[role=status]').textContent = '推荐：松林道，约 1 小时。'; };`
  },
  '2.3': {
    note: '在均衡四象限中突出左上的起点和右下的终点。和 Z 型的显式折线路径不同，此图强调各象限的相对阅读权重（经验模型）。', height:181,
    html:`<div class="quadrants"><section><small>首要视觉区</small><b>秋日山径</b></section><section><small>次要区</small><span>周六 · 清晨</span></section>
<section><small>次要区</small><span>集合地点：东门</span></section><section><small>终点视觉区</small><b>08:30 发队</b></section></div>`,
    css:`.quadrants{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:minmax(68px,auto);gap:2px;background:var(--line);border:1px solid var(--line)}section{padding:8px 10px;background:#f5f7ef;display:grid;align-content:center}section:first-child,section:last-child{background:#d5e6d2;color:#264533}section:last-child{text-align:end}small{font-size:11px}b{font-size:clamp(16px,4vw,22px)}`
  },
  '2.4': {
    note: '图形、留白和文字围绕中轴镜像安排，视觉重心稳定；它不是两块承担不同任务的分屏。', height:175,
    html:`<div class="seal"><small>秋季 · 山野见面会</small><svg aria-hidden="true" viewBox="0 0 300 55"><path d="M150 0v55" stroke="#aab6a8" stroke-dasharray="2 3"/><path d="m26 45 35-25 32 14 26-12 31 23 31-23 26 12 32-14 35 25" fill="none" stroke="#315941" stroke-width="2"/></svg><h2>山间步道年会</h2><p>十月 · 东麓观景台</p></div>`,
    css:`.seal{text-align:center;padding:12px 8px;border:3px double #8aa38b;background:var(--tile);color:#264533}.seal svg{display:block;margin:0 auto;width:min(100%,300px);height:52px}h2,p{margin:0}h2{font-family:Georgia,"Songti SC",serif}`
  },
  '2.5': {
    note: '不等宽版心里让标题跨到图上，编号反向偏置；打破对齐是为了加强主次，不是让所有元素随机错位。', height:206,
    html:`<article class="broken"><div class="slope" aria-hidden="true"></div><small>野外手记 / 07</small><h2>松影<br>深处</h2><p>林道绕过矮丘，在这里第一次望见山脊。</p></article>`,
    css:`.broken{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));grid-template-rows:auto 90px auto;padding:8px;isolation:isolate}.slope{grid-area:1 / 4 / 3 / 13;background:linear-gradient(154deg,#abbf9f 43%,#729479 44% 68%,#315941 69%);z-index:-1;margin-top:13px}
small{grid-area:1 / 8 / 2 / 13;justify-self:end;background:white;padding:2px 5px}h2{grid-area:2 / 1 / 3 / 10;justify-self:start;align-self:center;margin:0;background:#f6e7c5;color:#264533;font-size:clamp(29px,7vw,38px);line-height:1;padding:8px 13px}p{grid-area:3 / 3 / 4 / 13;margin:8px 0 0}`
  },
  '3.3': {
    note: '点菜单从左侧唤出导航；可选目的地，也可点遮罩、关闭按钮或按 Esc 收回。与常驻侧栏不同，关闭时不占内容宽度。', height:222,
    html:`<header><button id="open" aria-haspopup="dialog" aria-controls="menu">☰ 菜单</button> 山间向导</header>
<main aria-live="polite"><h2>路线总览</h2><p>三条适合周末的山间步道。</p></main>
<dialog id="menu" aria-labelledby="drawer-title"><header><b id="drawer-title">山间向导</b><button id="close" autofocus aria-label="关闭菜单">×</button></header>
<nav aria-label="主导航"><button data-text="三条适合周末的山间步道。">路线总览</button><button data-text="下雨后请避开湿石阶。">出行须知</button><button data-text="松林道入口设有饮水站。">补给点</button></nav></dialog>`,
    css:`header{display:flex;gap:8px;align-items:center;padding:8px;background:var(--tile)}main{padding:12px;border:1px solid var(--line)}h2,p{margin:.2em 0}button{cursor:pointer}
dialog{margin:0 auto 0 0;border:0;border-right:1px solid var(--line);padding:0;height:100%;max-height:100%;width:min(74vw,246px);max-width:none;background:#f9faf6;color:inherit}dialog::backdrop{background:#172b2170}dialog header{justify-content:space-between}nav{display:grid;gap:5px;padding:10px}nav button{text-align:start;padding:5px 8px}
@media(prefers-reduced-motion:no-preference){dialog[open]{animation:slide-in .23s ease-out}@keyframes slide-in{from{transform:translateX(-100%)}}}`,
    js:`const menu = document.querySelector('dialog');
const open = document.querySelector('#open');
open.onclick = () => menu.showModal();
document.querySelector('#close').onclick = () => menu.close();
menu.addEventListener('click', (event) => {
  if (event.target !== menu) return;
  const {left, top, right, bottom} = menu.getBoundingClientRect();
  if (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) menu.close();
});
menu.querySelectorAll('[data-text]').forEach(button => button.onclick = () => {
  document.querySelector('main h2').textContent = button.textContent;
  document.querySelector('main p').textContent = button.dataset.text;
  menu.close();
});
menu.addEventListener('close', () => open.focus());`
  },
  '3.5': {
    note: '标签在同一页面切换等层级内容，不负责整站导航。支持点击、左右方向键和首尾键。', height:172,
    html:`<div role="tablist" aria-label="路线资料">
  <button role="tab" id="tab-info" aria-selected="true" aria-controls="panel-info">概要</button>
  <button role="tab" id="tab-plan" aria-selected="false" aria-controls="panel-plan" tabindex="-1">行程</button>
  <button role="tab" id="tab-kit" aria-selected="false" aria-controls="panel-kit" tabindex="-1">装备</button>
</div>
<section role="tabpanel" id="panel-info" aria-labelledby="tab-info" tabindex="0"><b>松林道 · 初次友好</b><p>2.5 公里，约 1 小时。</p></section>
<section role="tabpanel" id="panel-plan" aria-labelledby="tab-plan" tabindex="0" hidden><b>入口 → 松林 → 观景亭</b><p>原路返回，不穿越陡坡。</p></section>
<section role="tabpanel" id="panel-kit" aria-labelledby="tab-kit" tabindex="0" hidden><b>轻量装备</b><p>建议带水、帽子和防滑鞋。</p></section>`,
    css:`[role=tablist]{display:flex;border-bottom:1px solid var(--line)}[role=tab]{border:0;border-bottom:3px solid transparent;background:transparent;padding:8px 13px;color:inherit;cursor:pointer;font:inherit}[aria-selected=true]{color:var(--forest);border-bottom-color:var(--forest);font-weight:700}section{padding:12px;background:var(--tile)}p{margin:.25em 0}`,
    js:`const tabs = [...document.querySelectorAll('[role=tab]')];
function activate(index, focus = false) {
  tabs.forEach((tab, i) => {
    tab.setAttribute('aria-selected', i === index);
    tab.tabIndex = i === index ? 0 : -1;
    document.getElementById(tab.getAttribute('aria-controls')).hidden = i !== index;
  });
  if (focus) tabs[index].focus();
}
tabs.forEach((tab, index) => {
  tab.onclick = () => activate(index);
  tab.onkeydown = (event) => {
    const target = {ArrowLeft:(index + tabs.length - 1) % tabs.length, ArrowRight:(index + 1) % tabs.length, Home:0, End:tabs.length - 1}[event.key];
    if (target === undefined) return;
    event.preventDefault(); activate(target, true);
  };
});`
  },
  '3.6': {
    note: '整行入口可点击；进入设置子页后返回列表。和侧边栏相比，列表本身就是当前主画面，而非并排的常驻列。', height:194,
    html:`<nav aria-label="路线设置"><b>路线设置</b>
<button data-desc="当前单位：公里。可在此查看路线距离。"><span aria-hidden="true">◈</span> 距离显示 <i aria-hidden="true">›</i></button>
<button data-desc="当前状态：仅在有封路信息时提醒。"><span aria-hidden="true">◇</span> 安全提醒 <i aria-hidden="true">›</i></button>
<button data-desc="最近保存：松林道。"><span aria-hidden="true">▤</span> 已保存路线 <i aria-hidden="true">›</i></button></nav>
<section hidden><button id="back">← 返回设置</button><h2 tabindex="-1"></h2><p></p></section>`,
    css:`nav{border:1px solid var(--line);background:white}nav b{display:block;padding:8px;background:var(--tile)}nav button{width:100%;display:grid;grid-template-columns:1em 1fr auto;align-items:center;gap:8px;padding:8px;font:inherit;color:inherit;text-align:start;border:0;border-top:1px solid var(--line);background:white;cursor:pointer}nav button:hover{background:#f2f6ed}section{padding:10px;background:var(--tile)}h2,p{margin:.3em 0}h2{font-size:19px}`,
    js:`const list = document.querySelector('nav');
const detail = document.querySelector('section');
let last;
list.querySelectorAll('button').forEach(button => button.onclick = () => {
  last = button;
  detail.querySelector('h2').textContent = button.childNodes[1].textContent.trim();
  detail.querySelector('p').textContent = button.dataset.desc;
  list.hidden = true; detail.hidden = false; detail.querySelector('h2').focus();
});
document.querySelector('#back').onclick = () => { detail.hidden = true; list.hidden = false; last.focus(); };`
  },
  '3.7': {
    note: '三行三列排列九个同级目的地。点图标查看功能入口回执；这里不是展示数据指标的仪表盘。', height:247,
    html:`<nav aria-label="山间九宫格"><button data-status="松林道 · 溪谷线 · 观景环"><span aria-hidden="true">△</span>路线</button><button data-status="东门入口在山脚。"><span aria-hidden="true">▧</span>地图</button><button data-status="示例天气：晴，19 ℃。"><span aria-hidden="true">☀</span>天气</button>
<button data-status="松林道入口设有水站。"><span aria-hidden="true">◇</span>补给</button><button data-status="已收藏：松林道。"><span aria-hidden="true">☆</span>收藏</button><button data-status="今日一条封路提醒。"><span aria-hidden="true">!</span>通知</button>
<button data-status="示例：上周实走 4 公里。"><span aria-hidden="true">▥</span>轨迹</button><button data-status="建议穿防滑鞋。"><span aria-hidden="true">▣</span>装备</button><button data-status="雨后请谨慎通过石阶。"><span aria-hidden="true">◎</span>指南</button></nav>
<p role="status">选择一个入口</p>`,
    css:`nav{max-width:480px;margin:auto;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}button{display:grid;justify-items:center;gap:1px;border:1px solid var(--line);background:white;color:var(--forest);border-radius:6px;padding:5px;font:inherit;cursor:pointer}button span{font-weight:700;font-size:18px;line-height:1.1}button:hover{background:var(--tile)}p{margin:6px 0;text-align:center}`,
    js:`document.querySelectorAll('[data-status]').forEach(button => button.onclick = () => {
  document.querySelector('[role=status]').textContent = button.dataset.status;
});`
  },
  '3.8': {
    note: '点击打开或在预览获得焦点后按 Ctrl/⌘ + K。可输入「路线」过滤；用上下键选中、回车执行、Esc 关闭。', height:255,
    html:`<button id="open" aria-haspopup="dialog">打开命令面板 <kbd>Ctrl / ⌘ + K</kbd></button><p role="status">尚未运行命令。</p>
<dialog aria-labelledby="search-label"><label id="search-label" for="command">搜索命令</label><input id="command" type="search" placeholder="例如：路线" autocomplete="off">
<div class="choices"><button data-result="已打开松林路线。">打开松林路线</button><button data-result="已打开溪谷路线。">打开溪谷路线</button><button data-result="已显示出行须知。">查看出行须知</button></div><p id="empty" hidden>无匹配命令</p></dialog>`,
    css:`button,input{font:inherit}button{cursor:pointer}kbd{margin-left:5px;color:#355746}dialog{width:min(calc(100% - 24px),420px);margin:12px auto auto;padding:10px;background:#f9faf6;border:1px solid var(--line);border-radius:8px;color:inherit}dialog::backdrop{background:#152d227d}label{font-weight:700}input{display:block;width:100%;min-width:0;margin:5px 0;padding:4px 6px} .choices button{display:block;text-align:start;width:100%;padding:4px 7px;background:white;border:1px solid var(--line);margin:2px 0;color:inherit}.choices button.current{background:#d3e6ce}.choices button[hidden]{display:none}p{margin:.5em 0}`,
    js:`const dialog = document.querySelector('dialog');
const input = dialog.querySelector('input');
const choices = [...dialog.querySelectorAll('button')];
let selected = 0;
const visible = () => choices.filter(button => !button.hidden);
function mark() { visible().forEach((button,i) => button.classList.toggle('current', i === selected)); }
function filter() {
  choices.forEach(button => button.hidden = !button.textContent.includes(input.value.trim()));
  document.querySelector('#empty').hidden = visible().length !== 0;
  selected = 0; mark();
}
function run(button) {
  if (!button) return;
  document.querySelector('[role=status]').textContent = button.dataset.result; dialog.close();
}
function open() { if (dialog.open) return; input.value = ''; filter(); dialog.showModal(); input.focus(); }
document.querySelector('#open').onclick = open;
document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); open(); }
});
input.oninput = filter;
input.onkeydown = event => {
  if (event.isComposing) return;
  const count = visible().length;
  if (event.key === 'Enter') { event.preventDefault(); run(visible()[selected]); }
  if (count && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
    event.preventDefault(); selected = (selected + (event.key === 'ArrowDown' ? 1 : -1) + count) % count; mark();
  }
};
choices.forEach(button => button.onclick = () => run(button));`
  },
  '3.9': {
    note: '点击路径上任一级可返回上层，再用下方入口深入；最末项标识当前位置，不是浏览历史也不是进度。', height:194,
    html:`<nav aria-label="当前位置"><ol></ol></nav><main><h2 aria-live="polite"></h2><p></p><button></button></main>`,
    css:`ol{display:flex;align-items:center;flex-wrap:wrap;gap:3px 8px;list-style:none;padding:8px;margin:0;background:var(--tile)}li+li::before{content:'›';margin-right:8px;color:#617567}ol button{border:0;padding:0;background:transparent;color:var(--forest);text-decoration:underline;font:inherit;cursor:pointer}[aria-current=page]{font-weight:700}main{padding:10px;border:1px solid var(--line)}h2,p{margin:.12em 0 .35em}h2{font-size:19px}`,
    js:`const pages = [['步道库','按地形分类整理路线。'],['山间路线','选择一条山林线路查看详情。'],['松林道','2.5 公里 · 平缓林道']];
const path = document.querySelector('ol');
const next = document.querySelector('main button');
function show(depth, focus = false) {
  path.replaceChildren(...pages.slice(0, depth + 1).map(([name], index) => {
    const item = document.createElement('li');
    if (index === depth) { const current = document.createElement('span'); current.setAttribute('aria-current','page'); current.textContent = name; item.append(current); }
    else { const button = document.createElement('button'); button.textContent = name; button.onclick = () => show(index, true); item.append(button); }
    return item;
  }));
  const heading = document.querySelector('h2');
  heading.textContent = pages[depth][0];
  heading.tabIndex = -1;
  document.querySelector('p').textContent = pages[depth][1];
  next.hidden = depth === pages.length - 1;
  next.textContent = next.hidden ? '' : '打开' + pages[depth + 1][0];
  next.onclick = () => show(depth + 1, true);
  if (focus) heading.focus();
}
show(2);`
  },
  '4.1': {
    note: '眉题、主标题、解释和行动沿中轴排列，强调首屏内部如何对齐，不要求占满整屏。', height:211,
    html:`<main class="hero"><small>周末向导 / 半日路线</small><h1>把周末留给山野</h1><p>从三条精选步道里，挑一条现在就能走的。</p><button>看推荐</button><output aria-live="polite"></output></main>`,
    css:`.hero{min-height:178px;display:grid;align-content:center;justify-items:center;text-align:center;padding:14px;background:radial-gradient(ellipse at top,#f8f8ed,#dce9d8);border:1px solid var(--line);color:#254331}h1,p{margin:.1em 0}h1{font-size:clamp(22px,6vw,39px)}button{padding:5px 13px;margin:8px 0 0;color:white;background:var(--forest);border:0;border-radius:4px;cursor:pointer}output{display:block;min-height:17px;font-size:12px}`,
    js:`document.querySelector('button').onclick = () => { document.querySelector('output').textContent = '推荐起点：松林道东门。'; };`
  },
  '4.3': {
    note: '三段按说服任务排列：先讲是什么，再讲为什么，最后给一个行动。与一般单页不同，区块的角色和顺序有意固定。', height:278,
    html:`<main><section class="intro"><small>01 / 引入</small><h2>半天走进山里</h2><p>山间向导为第一次徒步的人准备。</p></section>
<section class="features"><small>02 / 卖点</small><ul><li>清楚标注难度</li><li>途中补给提示</li><li>雨后安全提醒</li></ul></section>
<section class="action"><small>03 / 行动</small><button>生成半日计划</button><output aria-live="polite"></output></section></main>`,
    css:`section{padding:7px 12px;margin:0 0 4px}.intro{background:#d6e6d5}.features{background:white;border:1px solid var(--line)}.action{background:#315941;color:white}.features ul{display:flex;flex-wrap:wrap;list-style:none;gap:3px 8px;padding:0}.features li{border-left:2px solid #8ea991;padding-left:5px}h2,p,ul{margin:.12em 0}small{display:block}button{margin:3px 0;cursor:pointer}output{display:block;min-height:18px;font-size:12px}`,
    js:`document.querySelector('button').onclick = () => { document.querySelector('output').textContent = '已生成：09:00 东门出发，沿松林道往返。'; };`
  },
  '4.4': {
    note: '价格、卖点和选择按钮按行对齐，中间档高亮。切换计费周期时同时更新各档可比价格。', height:262,
    html:`<fieldset><legend>计费周期</legend><label><input type="radio" name="billing" value="month" checked> 月付</label><label><input type="radio" name="billing" value="year"> 年付</label></fieldset>
<div class="plans"><article><h3>基础</h3><strong data-month="0" data-year="0">¥0/月</strong><p>离线读路线</p><button>选基础</button></article><article class="chosen"><h3>探索 <small>推荐</small></h3><strong data-month="19" data-year="190">¥19/月</strong><p>含天气提醒</p><button>选探索</button></article><article><h3>小队</h3><strong data-month="49" data-year="490">¥49/月</strong><p>共享行程</p><button>选小队</button></article></div><p role="status">仅演示，不会产生订阅。</p>`,
    css:`fieldset{border:0;padding:0;margin:0 0 8px}legend{font-weight:700}.plans{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}.plans article{padding:7px 5px;text-align:center;background:white;border:1px solid var(--line);border-radius:6px}.plans .chosen{background:#e0eedb;border-color:var(--forest)}h3,p{margin:.1em 0 .35em}h3{font-size:14px;min-height:2.9em}h3 small{display:inline-block;background:var(--forest);color:white;padding:0 3px;border-radius:3px;font-size:10px}.plans strong{font-size:clamp(12px,3vw,21px)}button{font:inherit;cursor:pointer}[role=status]{margin-top:6px;font-size:12px}`,
    js:`const prices = [...document.querySelectorAll('[data-month]')];
const status = document.querySelector('[role=status]');
document.querySelector('fieldset').onchange = (event) => {
  const period = event.target.value;
  prices.forEach(price => price.textContent = '¥' + price.dataset[period] + (period === 'year' ? '/年' : '/月'));
  status.textContent = '仅演示，不会产生订阅。';
};
document.querySelectorAll('.plans button').forEach((button, index) => button.onclick = () => {
  status.textContent = button.textContent + ' · ' + prices[index].textContent + '（仅演示）';
});`
  },
  '4.5': {
    note: '先用缩略图网格展示代表成果，再点作品查看问题、过程和结果。重点是项目叙事，不只是可展开的通用卡片。', height:229,
    html:`<section id="gallery"><b>山间设计项目</b><div class="gallery">
<button data-project="0"><i class="map" aria-hidden="true"></i>松林导览图</button><button data-project="1"><i class="sign" aria-hidden="true"></i>溪谷指路牌</button><button data-project="2"><i class="guide" aria-hidden="true"></i>周末路线册</button></div></section>
<article hidden><button id="back">← 全部案例</button><h2 tabindex="-1"></h2><p></p></article>`,
    css:`.gallery{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-top:7px}.gallery button{display:grid;gap:4px;align-content:start;border:1px solid var(--line);border-radius:6px;background:white;color:var(--forest);padding:5px;font:inherit;cursor:pointer}.gallery i{display:block;height:77px}.map{background:repeating-linear-gradient(24deg,#bbd2b4 0 10px,#4b785d 11px 13px,#dce8d4 14px 24px)}.sign{background:linear-gradient(145deg,#dbe5e4 37%,#41656b 38% 61%,#c0d5d8 62%)}.guide{background:linear-gradient(90deg,#a88f5a 13%,#e6d4a6 14% 59%,#f2e5c7 60%)}article{padding:10px;background:var(--tile)}h2,p{margin:.3em 0}`,
    js:`const projects = [['松林导览图','问题：入口难找。过程：重绘路线与地标。成果：用一张图串起三个岔路。'],['溪谷指路牌','问题：雨雾中难以辨认。过程：测试高对比箭头。成果：统一方向与距离标注。'],['周末路线册','问题：装备信息散乱。过程：按出行阶段整理。成果：浓缩为一张随身清单。']];
const gallery = document.querySelector('#gallery');
const detail = document.querySelector('article');
let previous;
gallery.querySelectorAll('button').forEach(button => button.onclick = () => {
  const [name, description] = projects[Number(button.dataset.project)];
  detail.querySelector('h2').textContent = name; detail.querySelector('p').textContent = description;
  previous = button; gallery.hidden = true; detail.hidden = false; detail.querySelector('h2').focus();
});
document.querySelector('#back').onclick = () => { gallery.hidden = false; detail.hidden = true; previous.focus(); };`
  },
  '5.1': {
    note: '用居中窄栏和行距控制正文行长；左右留白不是侧栏。与 F 型搜索结果的扫描优先不同，这里让人连贯阅读。', height:263,
    html:`<article><header><small>步道手记 · 4 分钟阅读</small><h1>雨后的松林道</h1><p>林野编辑部 · 10 月</p></header>
<p>木栈道在林间转弯。雨刚停，松针滴下的水落在鞋面上，很快消失在深色的木纹里。</p>
<p>走到第一处分岔口，不急着上坡，先沿平缓的小道走到观景亭。站在亭边，便能看见雨雾从山腰散开。</p></article>`,
    css:`article{max-width:34em;margin:auto;padding-inline:clamp(4px,2vw,14px);line-height:1.6}header{border-bottom:1px solid var(--line);padding:2px 0 6px;color:var(--forest);margin-bottom:8px}h1{margin:0;font-family:Georgia,"Songti SC",serif;font-size:26px}p{margin:5px 0 10px}header p{font-size:12px;margin:0}`
  },
  '5.3': {
    note: '左侧是版块索引，中间放可读的正文，右侧提供独立工具。窄容器将正文放在两栏辅助内容之间的独立一行。', height:269,
    html:`<div class="three"><aside class="index"><b>版块索引</b><ul><li>路线指南</li><li>徒步手记</li><li>装备讨论</li></ul></aside>
<article><small>徒步手记 / 讨论帖</small><h2>松林道的岔路</h2><p>过第一座木桥后，左边是缓坡，右边通往观景亭；两条路都会汇回主道。</p></article>
<aside class="tools"><b>行前工具</b><details><summary>安全清单</summary><small>饮水 · 防滑鞋 · 离线地图</small></details></aside></div>`,
    css:`.three{display:grid;grid-template-areas:"index article tools";grid-template-columns:minmax(0,1fr) minmax(0,2.2fr) minmax(0,1fr);gap:7px}aside,article{min-width:0;padding:8px;background:var(--tile)}article{grid-area:article;background:white;border:1px solid var(--line)}.index{grid-area:index}.tools{grid-area:tools}h2,p,ul{margin:.25em 0}h2{font-size:19px}ul{padding-inline-start:1.2em}details{margin-top:5px}
@media(max-width:360px){.three{grid-template:"index" auto "article" auto "tools" auto / 1fr}.index ul{display:flex;gap:4px 8px;flex-wrap:wrap;list-style:none;padding:0}.tools{display:flex;align-items:start;gap:8px}.tools details{margin:0}}`
  },
  '5.4': {
    note: '主图、缩略图放在一组，规格和购买操作放在另一组；试切换示意图、规格或加入本地演示购物车。', height:356,
    html:`<main class="product"><section aria-label="商品图"><div class="picture" data-view="front" role="img" aria-label="水壶正面示意图"><i></i></div><div class="thumbs" role="group" aria-label="选商品视图"><button aria-pressed="true" data-view="front">正面</button><button aria-pressed="false" data-view="side">侧面</button></div></section>
<section><small>山间装备</small><h1>随行轻量水壶</h1><strong id="price">¥69</strong><label>容量 <select><option value="69">500 毫升</option><option value="89">750 毫升</option></select></label><button id="add">加入购物车</button><p role="status">购物车 0 件</p></section></main>`,
    css:`.product{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px}.picture{height:168px;background:#e2eadc;display:grid;place-items:center}.picture i{position:relative;width:54px;height:105px;border-radius:15px 15px 12px 12px;background:linear-gradient(90deg,#436d52,#83af8f 69%,#477a57);border:1px solid #315941}.picture i::before{content:"";position:absolute;width:28px;height:12px;top:-12px;left:50%;transform:translateX(-50%);background:#293a30;border-radius:4px 4px 0 0}.picture[data-view=side]{background:#dfebec}.picture[data-view=side] i{width:42px;transform:rotate(14deg);background:linear-gradient(90deg,#436069,#7ba0ac 69%,#36565e)}.thumbs{display:flex;gap:6px;margin-top:5px}button[aria-pressed=true],#add{background:var(--forest);color:white}h1,p{margin:.1em 0}h1{font-size:21px}label{display:block;margin:6px 0}strong{font-size:19px}button,select{font:inherit}p{font-size:12px;margin-top:5px}
@media(max-width:360px){.product{grid-template-columns:1fr}.picture{height:120px}.picture i{height:76px}}`,
    js:`const picture = document.querySelector('.picture');
const thumbnails = [...document.querySelectorAll('.thumbs button')];
const size = document.querySelector('select');
let count = 0;
thumbnails.forEach(button => button.onclick = () => {
  picture.dataset.view = button.dataset.view;
  picture.setAttribute('aria-label', '水壶' + button.textContent + '示意图');
  thumbnails.forEach(item => item.setAttribute('aria-pressed', item === button));
});
size.onchange = () => { document.querySelector('#price').textContent = '¥' + size.value; };
document.querySelector('#add').onclick = () => { document.querySelector('[role=status]').textContent = '已添加 ' + size.selectedOptions[0].text + ' · 购物车 ' + ++count + ' 件'; };`
  },
  '5.5': {
    note: '搜索框与难度筛选联动，结果区域保持 F 型扫描；练习重点是查询、过滤、反馈而不只是怎么排列标题。', height:261,
    html:`<div class="filters"><label>路线关键词 <input type="search" placeholder="如：松林"></label><label>难度 <select><option value="">全部</option><option>轻松</option><option>适中</option><option>进阶</option></select></label></div>
<p role="status">共有 3 条结果</p><ul><li data-level="轻松"><b>松林道</b><small>轻松 · 平缓林道 · 2.5 公里</small></li><li data-level="适中"><b>溪谷线</b><small>适中 · 溪畔木道 · 4 公里</small></li><li data-level="进阶"><b>观景环</b><small>进阶 · 山脊环线 · 6 公里</small></li></ul>`,
    css:`.filters{display:flex;flex-wrap:wrap;gap:6px 10px;background:var(--tile);padding:6px}.filters label{display:flex;align-items:center;gap:5px;font-size:12px}input,select{font:inherit;min-width:0}input{width:8em}ul,p{margin:4px 0;padding:0}ul{list-style:none}li{padding:5px 6px;border-bottom:1px solid var(--line)}li small{display:block}li b{color:var(--forest)}[role=status]{font-size:12px}`,
    js:`const input = document.querySelector('input');
const difficulty = document.querySelector('select');
const results = [...document.querySelectorAll('li')];
function filter() {
  const term = input.value.trim();
  results.forEach(item => { item.hidden = !item.textContent.includes(term) || Boolean(difficulty.value && item.dataset.level !== difficulty.value); });
  const count = results.filter(item => !item.hidden).length;
  document.querySelector('[role=status]').textContent = count ? '共有 ' + count + ' 条结果' : '没有匹配结果，试试清空关键词或筛选。';
}
input.oninput = difficulty.onchange = filter;`
  },
  '5.6': {
    note: '先讲团队为何存在，再用人物网格和数字给使命提供证据。不是产品卖点目录，也不是项目案例入口。', height:278,
    html:`<header><small>认识我们</small><h2>把好走的路线写下来</h2><p>我们从一份手绘地图开始，想让第一次上山的人也能安心出发。</p></header>
<div class="team" aria-label="团队成员"><article><i aria-hidden="true">林</i><b>林知</b><small>路线勘察</small></article><article><i aria-hidden="true">岳</i><b>岳宁</b><small>视觉设计</small></article><article><i aria-hidden="true">江</i><b>江遥</b><small>内容编辑</small></article></div>
<footer><b>3 年</b> 维护路线 <span aria-hidden="true">·</span> <b>24 次</b> 实地复查</footer>`,
    css:`header{background:#dfe9d9;padding:9px 10px}.team{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin:6px 0}article{display:grid;justify-items:center;gap:1px;text-align:center;border:1px solid var(--line);padding:7px 3px;background:white}article i{display:grid;place-items:center;width:29px;height:29px;border-radius:50%;background:#cbdcc7;color:#294834;font-style:normal}h2,p{margin:.1em 0}h2{font-size:21px}footer{text-align:center;padding:5px;border-block:1px solid var(--line)}`
  },
  '5.7': {
    note: '联系信息和提交表单是两种清晰的入口；填写测试数据，试用浏览器必填和邮箱校验。不会发送或保存数据。', height:375,
    html:`<main><aside><h2>联系路线小组</h2><p>受理步道修订、合作和安全建议。</p><p>地址：山脚游客服务站</p><small>周一至周五 · 09:00–17:00</small></aside>
<form><label>电子邮箱 <input type="email" name="email" required placeholder="示例：a@example.org"></label><label>留言 <textarea name="message" required rows="2"></textarea></label><button>提交演示</button><p role="status"></p></form></main>`,
    css:`main{display:grid;grid-template-columns:minmax(0,2fr) minmax(0,3fr);gap:8px}aside,form{padding:9px}aside{background:var(--tile)}form{background:white;border:1px solid var(--line)}h2,p{margin:.15em 0 .45em}h2{font-size:18px}label{display:grid;gap:3px;margin-bottom:6px}input,textarea,button{font:inherit;min-width:0}textarea{resize:vertical}[role=status]{font-size:12px;min-height:1.3em;margin-top:5px}
@media(max-width:360px){main{grid-template-columns:1fr}}`,
    js:`const form = document.querySelector('form');
const status = document.querySelector('[role=status]');
form.oninput = () => { status.textContent = ''; };
form.onsubmit = event => {
  event.preventDefault();
  status.textContent = '表单校验通过，仅完成本地演示。'; form.reset();
};`
  },
  '6.1': {
    note: '先给一排关键指标，再用趋势和分布解释；切换区间会一起更新数字和条形图。和九宫格入口不同，这里供人判断状态。', height:255,
    html:`<header><b>步道运营概览</b><label>时间 <select><option value="0">本周</option><option value="1">上周</option></select></label></header>
<div class="metrics" aria-live="polite"><div>到访<b>1,240</b></div><div>完成路线<b>860</b></div><div>异常提醒<b>3</b></div></div>
<div class="charts"><figure><figcaption>分段到访</figcaption><div class="bars"><div>周初 <meter max="700" value="320" aria-label="周初到访"></meter></div><div>周中 <meter max="700" value="410" aria-label="周中到访"></meter></div><div>周末 <meter max="700" value="510" aria-label="周末到访"></meter></div></div></figure><figure class="completion"><figcaption>完成率</figcaption><output>69%</output></figure></div>`,
    css:`header{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:4px;margin-bottom:6px}.metrics,.charts{display:grid;gap:5px}.metrics{grid-template-columns:repeat(3,minmax(0,1fr));margin-bottom:5px}.charts{grid-template-columns:minmax(0,2fr) minmax(0,1fr)}.metrics div,figure{border:1px solid var(--line);padding:6px 8px;background:var(--tile);margin:0}.metrics b,output{display:block;font-size:20px;color:var(--forest)}figure{background:white}.bars div{display:grid;grid-template-columns:2.5em 1fr;align-items:center;gap:4px;font-size:12px}meter{width:100%;min-width:0}.completion output{font-size:clamp(21px,5vw,29px);font-weight:700}`,
    js:`const data = [[['1,240','860','3'],[320,410,510],'69%'],[['1,086','728','5'],[290,366,430],'67%']];
document.querySelector('select').onchange = event => {
  const [metrics, counts, percentage] = data[Number(event.target.value)];
  document.querySelectorAll('.metrics b').forEach((node,i) => node.textContent = metrics[i]);
  document.querySelectorAll('meter').forEach((meter,i) => meter.value = counts[i]);
  document.querySelector('output').textContent = percentage;
};`
  },
  '6.2': {
    note: '深色高对比大屏以中央简图带动周边监测指标，偏远距查看；此处用固定本地批次模拟刷新，不连接实时数据服务。', height:320,
    html:`<main class="screen"><header><span>山间监测中心</span><button>刷新模拟批次</button></header>
<div class="telemetry"><section><b>客流</b><strong id="readers">1,240</strong><small>三条步道合计</small></section>
<figure><svg viewBox="0 0 240 102" role="img" aria-label="三处在线监测点示意图"><path d="M5 81 50 33 85 59 144 17 175 38 208 23 237 55M16 94l38-40 36 20 57-43 29 21 31-14 23 27" fill="none" stroke="#356b79" stroke-width="2"/><path d="M48 66 95 42 138 64 194 45" fill="none" stroke="#71d9c9" stroke-width="2" stroke-dasharray="4 3"/><g fill="#89fff0" stroke="#102e39" stroke-width="2"><circle cx="48" cy="66" r="5"/><circle cx="95" cy="42" r="5"/><circle cx="194" cy="45" r="5"/></g></svg><figcaption>步道路网 / 监测点</figcaption></figure>
<section><b>路况告警</b><strong id="warnings">3</strong><small>请留意溪谷线</small></section></div><footer role="status">本地样本 · 第 01 批</footer></main>`,
    css:`body{background:#102b36;color:#e3faef}.screen{min-height:calc(100vh - 20px);padding:8px;display:flow-root;background:linear-gradient(135deg,#11222d,#153e48);border:1px solid #538c90}header{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:4px;margin-bottom:8px;font-weight:700}button{background:#1d4650;border:1px solid #76bdbb;color:white;font:inherit;cursor:pointer}.telemetry{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2fr) minmax(0,1fr);gap:6px}.telemetry>*{border:1px solid #4f8792;padding:5px;margin:0}.telemetry section{display:grid;align-content:center}.telemetry strong{font-size:clamp(16px,4vw,27px);color:#89fff0}small,figcaption,footer{font-size:11px}svg{display:block;width:100%;height:105px}footer{margin-top:7px}
@media(max-width:360px){.telemetry{grid-template-columns:repeat(2,minmax(0,1fr))}.telemetry figure{grid-area:2 / 1 / 3 / 3}}`,
    js:`const samples = [['1,240',3],['1,248',2],['1,261',4]];
let batch = 0;
document.querySelector('button').onclick = () => {
  batch = (batch + 1) % samples.length;
  document.querySelector('#readers').textContent = samples[batch][0];
  document.querySelector('#warnings').textContent = samples[batch][1];
  document.querySelector('footer').textContent = '本地样本 · 第 0' + (batch + 1) + ' 批';
};`
  },
  '6.3': {
    note: '顶栏放全局身份和操作，侧栏切模块，内容区显示可操作的记录，而不只是看指标。试切菜单、折叠导航或变更一条记录状态。', height:285,
    html:`<div class="admin"><header><button id="toggle" aria-expanded="true" aria-controls="admin-nav">☰ 菜单</button><b>山间档案</b><small>值班员</small></header>
<div class="shell"><nav id="admin-nav" aria-label="后台模块"><button data-mode="paths" aria-current="page">步道管理</button><button data-mode="stations">站点管理</button></nav>
<main><h2>步道管理</h2><table><thead><tr><th scope="col">名称</th><th scope="col">状态</th><th scope="col">操作</th></tr></thead><tbody></tbody></table><p role="status"></p></main></div></div>`,
    css:`header{display:flex;align-items:center;gap:6px;padding:6px 8px;background:#315941;color:white}header small{margin-inline-start:auto}.shell{display:flex;gap:6px}.shell nav{flex:0 0 auto;background:var(--tile);padding:4px}.shell nav button{display:block;width:100%;margin-bottom:3px}button{font:inherit;cursor:pointer}button[aria-current]{background:#d0e3cf;font-weight:700}main{min-width:0;flex:1;background:white;padding:6px;border:1px solid var(--line)}h2,p{margin:.2em 0}h2{font-size:17px}table{border-collapse:collapse;width:100%;font-size:12px}th,td{padding:4px 3px;text-align:start;border-bottom:1px solid var(--line)}[role=status]{font-size:12px}`,
    js:`const data = {paths:[['松林道',true],['溪谷线',true]],stations:[['东门水站',true],['观景亭水站',false]]};
const nav = document.querySelector('nav');
const toggle = document.querySelector('#toggle');
const tbody = document.querySelector('tbody');
const status = document.querySelector('[role=status]');
toggle.onclick = () => { nav.hidden = !nav.hidden; toggle.setAttribute('aria-expanded', !nav.hidden); };
function render(mode, activeIndex) {
  const rows = data[mode].map(([name, live], index) => {
    const row = document.createElement('tr');
    row.insertCell().textContent = name; row.insertCell().textContent = live ? '开放' : '关闭';
    const change = document.createElement('button'); change.textContent = live ? '关闭' : '开放';
    change.setAttribute('aria-label', change.textContent + name);
    change.onclick = () => { data[mode][index][1] = !live; render(mode, index); status.textContent = name + (live ? '已关闭' : '已开放'); };
    row.insertCell().append(change);
    return row;
  });
  tbody.replaceChildren(...rows);
  if (activeIndex !== undefined) rows[activeIndex].querySelector('button').focus();
}
const modules = [...nav.querySelectorAll('button')];
modules.forEach(button => button.onclick = () => {
  modules.forEach(item => item === button ? item.setAttribute('aria-current','page') : item.removeAttribute('aria-current'));
  document.querySelector('h2').textContent = button.textContent; status.textContent = ''; render(button.dataset.mode);
});
render('paths');`
  },
  '7.2': {
    note: '这是一种先后顺序而非单独规则：小屏先交付核心路线和行动，较宽才加侧边参考信息。用窄/宽预览比较，基础样式不依赖媒体查询。', height:190,
    html:`<main class="mobile"><section><small>核心任务</small><h2>看一条可走路线</h2><p>松林道 · 2.5 公里 · 约 1 小时</p><details><summary>查看起点</summary><p>山脚东门，沿松林标牌前行。</p></details></section><aside><b>宽屏增补</b><p>同类路线：溪谷线</p><p>行前参考：补给点有饮水</p></aside></main>`,
    css:`.mobile{display:grid;gap:8px}.mobile section,.mobile aside{padding:10px;background:var(--tile)}.mobile aside{display:none;background:white;border:1px solid var(--line)}h2,p{margin:.15em 0 .4em}h2{font-size:20px}summary{cursor:pointer;color:var(--forest)}
@media(min-width:361px){.mobile{grid-template-columns:minmax(0,2fr) minmax(0,1fr)}.mobile aside{display:block}}`
  },
  '7.3': {
    note: '预览实际到 361px、600px 时，同样四项从 1 栏切到 2 栏、再到 4 栏。这里示范的是临界值与重排，不是在规定通用设备尺寸。', height:246,
    html:`<div class="state" aria-live="polite"><output id="width"></output><span class="small">≤ 360px · 1 栏</span><span class="medium">361–599px · 2 栏</span><span class="large">≥ 600px · 4 栏</span></div>
<div class="tracks"><div>01 松林道</div><div>02 溪谷线</div><div>03 观景环</div><div>04 水岸道</div></div>`,
    css:`.state{display:flex;flex-wrap:wrap;gap:3px 8px;margin-bottom:8px;padding:7px;background:#315941;color:white}.state span{font-weight:700}.medium,.large{display:none}.tracks{display:grid;grid-template-columns:minmax(0,1fr);gap:6px}.tracks div{padding:9px 7px;background:var(--tile);border:1px solid var(--line)}
@media(min-width:361px){.tracks{grid-template-columns:repeat(2,minmax(0,1fr))}.small{display:none}.medium{display:inline}}
@media(min-width:600px){.tracks{grid-template-columns:repeat(4,minmax(0,1fr))}.medium{display:none}.large{display:inline}}`,
    js:`const width = document.querySelector('#width');
function measure() { width.textContent = '视口 ' + innerWidth + 'px'; }
addEventListener('resize', measure); measure();`
  },
  '7.4': {
    note: '拖动滑块比较同宽窗口：上排跳到 168/252/342px 三套固定版式之一，下排宽度连续跟随。真实项目也可以混用流式与断点。', height:246,
    html:`<label>模拟容器宽度 <input type="range" min="185" max="425" value="280" aria-label="模拟容器宽度"> <output></output></label>
<section class="sample"><div class="adaptive" data-size="medium"><b>自适应</b><span>松林道</span><span>溪谷线</span><span>观景环</span></div><div class="responsive"><b>响应式</b><span>松林道</span><span>溪谷线</span><span>观景环</span></div></section>`,
    css:`label{display:flex;align-items:center;flex-wrap:wrap;gap:3px 7px;margin-bottom:8px}input{max-width:40%}.sample{width:280px;max-width:100%;padding:6px;border:1px dashed #7b9680;background:white}.sample div{display:grid;background:var(--tile);gap:3px;padding:4px}.sample b{grid-column:1 / -1;font-size:12px}.sample span{background:#cee0c9;padding:2px 3px;font-size:11px}.adaptive[data-size=small]{width:168px;grid-template-columns:1fr}.adaptive[data-size=medium]{width:252px;grid-template-columns:repeat(2,1fr)}.adaptive[data-size=large]{width:342px;grid-template-columns:repeat(3,1fr)}.sample .responsive{width:100%;grid-template-columns:repeat(3,minmax(0,1fr));margin-top:5px;background:#dce9ed}.responsive span{background:#c1d9dd}`,
    js:`const slider = document.querySelector('input');
const sample = document.querySelector('.sample');
const fixed = document.querySelector('.adaptive');
const output = document.querySelector('output');
function update() {
  slider.max = Math.max(185, Math.min(425, document.body.clientWidth - 20));
  sample.style.width = slider.value + 'px';
  const actual = Math.round(sample.getBoundingClientRect().width);
  fixed.dataset.size = actual >= 370 ? 'large' : actual >= 270 ? 'medium' : 'small';
  output.textContent = actual + 'px';
}
slider.oninput = update; addEventListener('resize', update); update();`
  },
  '7.5': {
    note: '工具条只沿一根主轴分配空间：标题占内容所需宽度，搜索框吸收剩余空间，按钮固定。勾选可观察主轴从横向改成纵向。', height:220,
    html:`<label class="toggle"><input type="checkbox"> 改为纵向主轴</label><div class="toolbar" role="search"><b>步道库</b><input type="search" aria-label="路线名称" placeholder="输入松林或溪谷"><button>查找</button></div><p role="status"></p>`,
    css:`.toggle{display:block;margin-bottom:7px}.toolbar{display:flex;align-items:center;gap:6px;padding:8px;background:var(--tile);border:1px solid var(--line)}.toolbar input{flex:1;min-width:0}.toolbar button,.toolbar b{flex:none}.toolbar button,.toolbar input{font:inherit;padding:4px 5px}body:has(.toggle input:checked) .toolbar{flex-direction:column;align-items:stretch}body:has(.toggle input:checked) .toolbar input{flex:auto}p{margin:5px 0}`,
    js:`const search = document.querySelector('input[type=search]');
function query() {
  const value = search.value.trim();
  const matches = ['松林道','溪谷线','观景环'].filter(name => name.includes(value));
  document.querySelector('[role=status]').textContent = matches.length ? matches.join(' · ') : '未找到路线。';
}
document.querySelector('button').onclick = query;
search.onkeydown = event => { if (event.key === 'Enter' && !event.isComposing) query(); };`
  },
  '7.6': {
    note: '虚线是流式容器；条块分配 64% / 36%，边距和字号也随视口连续缩放。没有依赖固定档位重排。', height:196,
    html:`<main class="fluid"><h2>山间路线尺</h2><div class="bands"><div>林地 · 64%</div><div>开阔坡 · 36%</div></div><p>拖宽或收窄示例，观察比例不变、实际宽度变化。</p></main>`,
    css:`.fluid{width:88%;max-width:720px;margin:auto;padding:clamp(7px,2.2vw,22px);border:1px dashed #729379;background:white}.bands{display:flex}.bands div{padding:6px 4px;text-align:center;background:#cbdcc7}.bands div:first-child{width:64%}.bands div+div{width:36%;background:#dce8eb}h2,p{margin:.12em 0 .35em}h2{font-size:clamp(16px,4vw,33px)}p{font-size:12px;margin-top:7px}`
  },
  '7.7': {
    note: '版心始终 460px，大于它时居中，空间不足出现横向滚动。用窄预览或在框内横向滚动，观察内容没有缩成一栏。', height:194,
    html:`<div class="scroll" tabindex="0" aria-label="可横向滚动的固定宽度页面"><div class="fixed"><header><b>山间站点 / 460px</b><span>路线档案</span></header><main><aside>路线分类</aside><article><b>松林道</b><p>2.5 公里 · 林间平路</p></article></main></div></div>`,
    css:`.scroll{overflow-x:auto;padding:8px;border:1px dashed #759178}.fixed{width:460px;margin-inline:auto;border:1px solid var(--line);background:white}.fixed header{display:flex;justify-content:space-between;gap:8px;padding:8px;background:var(--tile)}.fixed main{display:grid;grid-template-columns:128px 1fr;min-height:71px}.fixed aside,.fixed article{padding:8px}.fixed aside{border-right:1px solid var(--line)}p{margin:.25em 0}`
  }
};
