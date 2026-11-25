// 第 8–11 章：独立沙盒演示。不加载外部资源。
(() => {
  const base = `
button { font: inherit; color: #294636; background: #fffdf6; border: 1px solid var(--line, #bdcbbd); border-radius: 9px; padding: 5px 9px; cursor: pointer; }
button:hover, button[aria-pressed="true"] { background: #dceadd; }
:focus-visible { outline: 2px solid #226ab4; outline-offset: 2px; }
p { margin: 0; }
.controls { display:flex; align-items:center; flex-wrap:wrap; gap:5px; }
.caption { color:#435b4c; font-size:12px; }
`;
  const reduced = `
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
}
`;
  const demo = entry => ({ ...entry, css: base + entry.css + reduced });

  window.UI_MOTION_STRUCTURE = {
    '8.1': demo({
      note: '单元跨行、跨列而不破坏共同的轨道；主格可展开摘要。重点是有层级的拼合，而不是同规格的卡片列表。',
      height: 184,
      html: `<div class="bento"><button class="lead" aria-expanded="false"><small>01 / 主模块</small><strong>林间观测</strong><span class="hint">点击展开</span><span class="expand" hidden>晨间采集已完成</span></button><div><small>02 / 样本</small><b>24 组</b></div><div><small>03 / 温度</small><b>18 °C</b></div><div class="wide"><small>04 / 观测路径</small><b>北坡 ━━━ 湖心</b></div></div>`,
      css: `
.bento { display:grid; grid-template-columns: 1.35fr 1fr 1fr; grid-template-rows: 68px 68px; gap:7px; }
.bento>* { min-width:0; padding:9px; border:0; background:#e1ece2; border-radius:12px; text-align:left; animation:settle .38s both; display:grid; align-content:center; gap:2px; }
.bento .lead { grid-row:span 2; background:#284c3b; color:#f6fff9; }
.bento .lead:hover,.bento .lead[aria-expanded="true"] { background:#356149; }
.bento .wide { grid-column:span 2; background:#efead8; animation-delay:.14s; }
.bento div:nth-child(2) { animation-delay:.05s; }.bento div:nth-child(3) { animation-delay:.1s; }
.bento small,.hint,.expand { font-size:11px; }
.bento strong { font-size:clamp(15px,6vw,25px); }
.expand:not([hidden]) { animation:settle .24s both; }
@keyframes settle { from { opacity:0; transform:translateY(7px); } }
`,
      js: `const b=document.querySelector('.lead'); b.onclick=()=>{const open=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',open);b.querySelector('.expand').hidden=!open;b.querySelector('.hint').textContent=open?'点击收起':'点击展开';};`
    }),
    '8.2': demo({
      note: '每张卡片有同等地位、完整边界和独立状态；这里点击翻看背面，不会重排其他卡片。',
      height: 174,
      html: `<div class="cards"><button aria-label="山脊：翻看详情" aria-pressed="false"><span><b>山脊</b><small>观测点 01</small></span><span aria-hidden="true"><b>海拔</b><small>860 米</small></span></button><button aria-label="湖岸：翻看详情" aria-pressed="false"><span><b>湖岸</b><small>观测点 02</small></span><span aria-hidden="true"><b>水温</b><small>16 °C</small></span></button></div><p class="caption">点击任意卡片翻面</p>`,
      css: `
.cards {display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:9px; margin:3px 0 8px; perspective:500px; }
.cards button { position:relative; height:104px; border:0; padding:0; background:transparent; }
.cards span { position:absolute; inset:0; border-radius:10px; border:1px solid #cad5c8; background:#f7faf4; box-shadow:0 3px 6px #19372718; display:grid; align-content:center; gap:4px; backface-visibility:hidden; transition:transform .42s; }
.cards span+span { background:#d7eadb; transform:rotateY(180deg); }
.cards [aria-pressed="true"] span:first-child { transform:rotateY(-180deg); }
.cards [aria-pressed="true"] span+span { transform:rotateY(0deg); }
@media (prefers-reduced-motion:reduce) { .cards [aria-hidden="true"] { visibility:hidden; } }
`,
      js: `document.querySelectorAll('.cards button').forEach((b,i)=>b.onclick=()=>{const on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',on);b.setAttribute('aria-label',on?['山脊海拔 860 米：翻回','湖岸水温 16 摄氏度：翻回'][i]:['山脊：翻看详情','湖岸：翻看详情'][i]);b.firstElementChild.setAttribute('aria-hidden',on);b.lastElementChild.setAttribute('aria-hidden',!on);});`
    }),
    '8.3': demo({
      note: '背景从 iframe 左右边缘延伸，滚动在两张满幅画面之间吸附。这里的「全屏」仅指演示视口，不会接管浏览器。',
      height: 190,
      html: `<section class="reel" tabindex="0" aria-label="满幅风景，向下滚动观看第二幕"><article><div><small>01 / 向下滑动</small><strong>穿过山谷</strong></div></article><article><div><small>02 / 湖岸</small><strong>日落入水</strong></div></article></section>`,
      css: `
body { padding:0; }
.reel { height:100vh; overflow-y:auto; overscroll-behavior:contain; scroll-snap-type:y mandatory; }
.reel:focus-visible { outline-offset:-3px; }
.reel article { scroll-snap-align:start; min-height:100%; display:flex; align-items:end; color:#fff; padding:20px; background:linear-gradient(20deg,#173b31 20%,transparent 70%),linear-gradient(152deg,transparent 48%,#3f725b 49%,#6d987a 70%,transparent 71%),linear-gradient(30deg,#a3c09e,#dfeee2); }
.reel article+article { background:linear-gradient(10deg,#243c54 8%,#385c71 45%,transparent 69%),radial-gradient(circle at 71% 34%,#fff6d4 0 15px,transparent 16px),linear-gradient(#da916b,#f5cda1); }
.reel strong { display:block; font-size:28px; letter-spacing:.07em; }
@media (prefers-reduced-motion:reduce) { .reel { scroll-snap-type:none; } }
`
    }),
    '8.4': demo({
      note: '同一组块从对齐切换到不对称重叠，对照能看出结构变化，而不只是给规则网格加阴影。',
      height: 194,
      html: `<div class="controls"><button aria-pressed="true">错位排版</button><span class="caption" role="status">标题压住图块边缘</span></div><div class="spread broken"><div class="photo" aria-hidden="true">◒</div><strong>地形<br>档案</strong><span>FIELD NOTE / 08</span></div>`,
      css: `
.spread {margin-top:8px; height:122px; overflow:hidden; position:relative; background:#eae7d9; border-radius:8px; color:#233b30; }
.spread>* { position:absolute; transition:transform .35s cubic-bezier(.2,.8,.3,1); }
.spread .photo { left:4%; width:44%; top:8px; height:92px; background:#305745; color:#e4eec8; text-align:center; font:78px/92px serif; }
.spread strong { left:55%; top:17px; z-index:1; background:#ffd27e; padding:5px 10px; font-size:23px; line-height:1.05; }
.spread span { left:55%; bottom:10px; font-size:10px; letter-spacing:.08em; font-weight:700; }
.spread.broken .photo { transform:translate(24%,9px) rotate(-7deg); }
.spread.broken strong { transform:translate(-34%,15px) rotate(4deg); }
.spread.broken span { transform:translate(23%,-11px); }
`,
      js: `const b=document.querySelector('button');b.onclick=()=>{const broken=document.querySelector('.spread').classList.toggle('broken');b.setAttribute('aria-pressed',broken);document.querySelector('[role=status]').textContent=broken?'标题压住图块边缘':'回到对齐的双列';};`
    }),
    '8.5': demo({
      note: '三列各自纵向累积，卡片高度不必和隔壁对齐；每批本地样本分配到当前较短的列，不使用外部图片或无限请求。',
      height: 208,
      html: `<div class="controls"><button>添三张样本</button><span class="caption" role="status">6 张 · 可在墙内滚动</span></div><div class="wall" tabindex="0" aria-label="样本瀑布墙"><div><span style="--h:62px;--color:#debb90">01</span><span style="--h:40px;--color:#dce8bc">04</span></div><div><span style="--h:43px;--color:#d4e4d0">02</span><span style="--h:72px;--color:#cfdfeb">05</span></div><div><span style="--h:76px;--color:#d5e3bf">03</span><span style="--h:46px;--color:#ead9bf">06</span></div></div>`,
      css: `
.wall { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); align-items:start; gap:5px; margin-top:7px; height:141px; overflow:auto; overscroll-behavior:contain; }
.wall div { display:grid; gap:5px; }
.wall span { display:grid; place-items:center; height:var(--h); background:repeating-linear-gradient(35deg,transparent 0 10px,#fff2 10px 20px),var(--color); border-radius:8px; color:#263a31; font-weight:700; animation:pop .36s var(--wait,0s) both; }
@keyframes pop { from { opacity:0; transform:translateY(6px); } }
`,
      js: `const wall=document.querySelector('.wall'), cols=[...wall.children], b=document.querySelector('button'), colors=['#debb90','#d4e4d0','#cfdfeb'];let n=6;b.onclick=()=>{for(let i=0;i<3;i++){const col=cols.reduce((a,c)=>a.offsetHeight<=c.offsetHeight?a:c);const card=document.createElement('span');card.textContent=String(++n).padStart(2,'0');card.style.setProperty('--h',36+n*11%44+'px');card.style.setProperty('--color',colors[n%3]);card.style.setProperty('--wait',i*.06+'s');col.append(card);}document.querySelector('[role=status]').textContent=n+' 张 · 可在墙内滚动';wall.scrollTo({top:wall.scrollHeight,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});if(n===24){b.disabled=true;b.textContent='本地样本已展示';}};`
    }),
    '9.1': demo({
      note: '光晕在局部画布内插值追随；经过标记时变为环。保留系统指针，触屏和减少动态模式不绘制追踪装饰。',
      height: 176,
      html: `<div class="field"><span>指针在点阵中移动</span><b>◎ 标记</b><i aria-hidden="true"></i></div>`,
      css: `
.field { height:140px; overflow:hidden; position:relative; background:#204333 radial-gradient(#6c8878 1px,transparent 1px) 0 0/16px 16px; border-radius:10px; color:#f2fff7; padding:12px; }
.field b { position:absolute; left:45%; top:43%; border:1px solid #8eaa98; background:#305745; border-radius:6px; padding:7px; }
.field i { position:absolute; left:0; top:0; width:0; height:0; pointer-events:none; display:none; }
.field.live i { display:block; }
.field i::before { content:''; display:block; width:20px; height:20px; translate:-50% -50%; border:2px solid #ffdd87; border-radius:50%; box-shadow:0 0 16px #ffe2a9; background:#ffcf6b80; transition:scale .2s,background .2s; }
.field.mark i::before { scale:1.65; background:transparent; }
@media (prefers-reduced-motion:reduce) { .field.live i { display:none; } }
`,
      js: `const zone=document.querySelector('.field'),halo=zone.querySelector('i'),mark=zone.querySelector('b'),rm=matchMedia('(prefers-reduced-motion: reduce)');let x,y,tx,ty,id=0;function frame(){id=0;x+=(tx-x)*.23;y+=(ty-y)*.23;halo.style.transform='translate('+x+'px,'+y+'px)';if(Math.abs(x-tx)+Math.abs(y-ty)>.25)id=requestAnimationFrame(frame);}zone.onpointermove=e=>{if(e.pointerType==='touch'||rm.matches)return;const r=zone.getBoundingClientRect();tx=e.clientX-r.left;ty=e.clientY-r.top;if(!zone.classList.contains('live')){x=tx;y=ty;zone.classList.add('live');}zone.classList.toggle('mark',e.target===mark);if(!id)frame();};zone.onpointerleave=()=>{zone.classList.remove('live','mark');cancelAnimationFrame(id);id=0;};`
    }),
    '9.2': demo({
      note: '这次移动的是按钮本身：相对固定中心测量距离，进入吸附半径才拉偏，移开后归位。不同于上一条的光标跟随。',
      height: 179,
      html: `<div class="well"><span>靠近虚线范围</span><div class="anchor"><button>吸附按钮</button></div><output aria-live="polite"></output></div>`,
      css: `
.well { height:147px; border-radius:10px; position:relative; background:#e4eee4; text-align:center; padding-top:8px; }
.well span,.well output { color:#3b5847; font-size:12px; }
.well output { position:absolute; bottom:7px; left:0; right:0; }
.anchor { position:absolute; top:23px; left:50%; translate:-50%; width:104px; height:104px; border:1px dashed #809b89; border-radius:50%; display:grid; place-items:center; }
.anchor button { transform:translate(var(--x,0px),var(--y,0px)); transition:transform .37s cubic-bezier(.19,1.6,.39,1); background:#315943; color:#fff; white-space:nowrap; }
.well.near button { transition:transform .09s ease-out; }
`,
      js: `const w=document.querySelector('.well'),a=w.querySelector('.anchor'),b=a.querySelector('button');const reset=()=>{w.classList.remove('near');b.style.removeProperty('--x');b.style.removeProperty('--y');};w.onpointermove=e=>{if(e.pointerType==='touch'||matchMedia('(prefers-reduced-motion: reduce)').matches){reset();return;}const r=a.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2,d=Math.hypot(x,y);if(d>54){reset();return;}w.classList.add('near');b.style.setProperty('--x',x*.32+'px');b.style.setProperty('--y',y*.32+'px');};w.onpointerleave=reset;b.onclick=()=>w.querySelector('output').textContent='按钮已响应';`
    }),
    '9.3': demo({
      note: '悬停用局部揭示反馈，不追踪任意坐标；焦点或点击也能打开同一面板，便于键盘与触屏查看。',
      height: 161,
      html: `<button class="tile" aria-label="苔藓图鉴，预览：阴湿岩石上的绿色地毯" aria-pressed="false"><span class="title">苔藓图鉴 <small>预览 ↗</small></span><span class="detail" aria-hidden="true">阴湿岩石上的绿色地毯</span></button><p class="caption">悬停、聚焦或点击</p>`,
      css: `
.tile { display:block; position:relative; height:100px; width:100%; overflow:hidden; margin-bottom:8px; text-align:left; background:#c9dfbf radial-gradient(circle at 85% 10%,#e9efb0,transparent 52%); }
.tile:hover,.tile[aria-pressed="true"] { background:#c9dfbf radial-gradient(circle at 85% 10%,#e9efb0,transparent 52%); }
.title { display:block; font-weight:700; transition:transform .24s; }
.title small { font-weight:400; }
.detail { position:absolute; inset:auto 0 0; padding:8px; transform:translateY(100%); transition:transform .24s; background:#2b533d; color:#fff; font-size:12px; }
.tile:focus-visible .title,.tile[aria-pressed="true"] .title { transform:translateY(-12px); }
.tile:focus-visible .detail,.tile[aria-pressed="true"] .detail { transform:none; }
@media (hover:hover) { .tile:hover .title { transform:translateY(-12px); } .tile:hover .detail { transform:none; } }
`,
      js: `const b=document.querySelector('.tile');b.onclick=()=>b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')!=='true');`
    }),
    '9.4': demo({
      note: '把任务拖进虚线目标区；释放无效则留在原列。点击任务或按 Enter 可完成同一移动，不把拖动当作唯一入口。',
      height: 186,
      html: `<div class="board"><section><b>待办</b><button id="task" aria-label="采集叶片，激活移至另一列">采集叶片</button></section><section><b>已完成</b></section></div><p class="caption" role="status">拖到另一列，或点击任务移动。</p>`,
      css: `
.board {display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin-bottom:9px; }
.board section { min-width:0; height:105px; border:1px dashed #8ca58f; background:#edf2e8; border-radius:9px; padding:7px; }
.board section.over { outline:2px solid #40845b; outline-offset:1px; background:#d8ead8; }
.board button { display:block; margin-top:9px; max-width:100%; touch-action:none; user-select:none; cursor:grab; font-size:12px; }
.ghost { position:fixed; z-index:1; pointer-events:none; border-radius:8px; padding:6px 9px; color:#fff; background:#315943; opacity:.92; }
`,
      js: `const task=document.querySelector('#task'),cols=[...document.querySelectorAll('.board section')],status=document.querySelector('[role=status]');let start=null,ghost=null,target=null,ignoreClick=false;const other=()=>cols.find(c=>c!==task.parentElement);function move(to){to.append(task);task.focus();status.textContent='已将任务移至「'+to.querySelector('b').textContent+'」。';}task.onclick=e=>{if(ignoreClick&&e.detail){ignoreClick=false;return;}move(other());};task.onpointerdown=e=>{if(!e.isPrimary||e.button!==0)return;ignoreClick=false;start={x:e.clientX,y:e.clientY,id:e.pointerId};task.setPointerCapture(e.pointerId);};task.onpointermove=e=>{if(!start||start.id!==e.pointerId)return;if(!ghost&&Math.hypot(e.clientX-start.x,e.clientY-start.y)<6)return;if(!ghost){ghost=document.createElement('span');ghost.className='ghost';ghost.setAttribute('aria-hidden','true');ghost.textContent=task.textContent;document.body.append(ghost);}ghost.style.left=e.clientX+8+'px';ghost.style.top=e.clientY-14+'px';const c=other(),r=c.getBoundingClientRect();target=e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom?c:null;c.classList.toggle('over',!!target);};function finish(drop){if(!start)return;start=null;if(!ghost)return;ghost.remove();ghost=null;ignoreClick=true;cols.forEach(c=>c.classList.remove('over'));if(drop&&target)move(target);target=null;}task.onpointerup=()=>finish(true);task.onpointercancel=task.onlostpointercapture=()=>finish(false);`
    }),
    '9.5': demo({
      note: '水平划动时轨道跟手，超过阈值就换帧；鼠标可模拟单指，按钮可替代手势。本例不模拟双指捏合或长按。',
      height: 194,
      html: `<div class="swipe" aria-label="可左右滑动的景片"><div class="track" aria-hidden="true"><div>01 / 松林</div><div>02 / 水面</div><div>03 / 山脊</div></div></div><div class="controls"><button class="prev">上一帧</button><button class="next">下一帧</button><span class="caption" role="status"></span></div>`,
      css: `
.swipe { overflow:hidden; border-radius:9px; touch-action:pan-y; cursor:grab; margin-bottom:6px; }
.track { display:flex; transform:translateX(calc(var(--page,0%) + var(--dx,0px))); transition:transform .26s ease-out; user-select:none; }
.track.dragging { transition:none; }
.track div { flex:0 0 100%; height:112px; display:grid; place-items:center; color:#fff; font-size:20px; font-weight:700; letter-spacing:.12em; background:repeating-linear-gradient(115deg,#2d513e 0 18px,#365d48 18px 35px); }
.track div:nth-child(2) { background:repeating-linear-gradient(10deg,#31576d 0 14px,#3b6478 14px 22px); }
.track div:nth-child(3) { background:repeating-linear-gradient(165deg,#694d3d 0 16px,#745647 16px 23px); }
`,
      js: `const pane=document.querySelector('.swipe'),track=document.querySelector('.track'),prev=document.querySelector('.prev'),next=document.querySelector('.next'),status=document.querySelector('[role=status]'),rm=matchMedia('(prefers-reduced-motion: reduce)');let n=0,start=null,dx=0;function page(i){n=Math.min(2,Math.max(0,i));track.style.setProperty('--page',-n*100+'%');track.style.removeProperty('--dx');prev.disabled=n===0;next.disabled=n===2;status.textContent=['松林','水面','山脊'][n]+' '+(n+1)+'/3';}prev.onclick=()=>page(n-1);next.onclick=()=>page(n+1);pane.onpointerdown=e=>{if(!e.isPrimary||e.button!==0)return;start=e.clientX;dx=0;pane.setPointerCapture(e.pointerId);track.classList.add('dragging');};pane.onpointermove=e=>{if(start===null)return;dx=e.clientX-start;if(!rm.matches)track.style.setProperty('--dx',Math.max(-pane.clientWidth,Math.min(pane.clientWidth,dx*((n===0&&dx>0)||(n===2&&dx<0)?.2:1)))+'px');};function end(change){if(start===null)return;start=null;track.classList.remove('dragging');page(n+(change&&Math.abs(dx)>36?(dx<0?1:-1):0));}pane.onpointerup=()=>end(true);pane.onpointercancel=pane.onlostpointercapture=()=>end(false);page(0);`
    }),
    '9.6': demo({
      kind: '示意',
      note: '无麦克风也能体验「待命→模拟聆听→指令结果」；固定波形和预设命令都不是语音识别。',
      height: 185,
      html: `<div class="voice"><div class="wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><p role="status">待命 · 不使用麦克风</p></div><div class="controls"><button>模拟指令「开灯」</button></div>`,
      css: `
.voice { border-radius:10px; color:#fff; background:#253f38; padding:11px 7px; text-align:center; margin-bottom:7px; }
.voice.on { background:#496340; }
.wave { height:49px; display:flex; gap:5px; align-items:center; justify-content:center; }
.wave i { display:block; width:7px; height:28px; background:#f2d387; border-radius:8px; transform:scaleY(.25); }
.voice.listen i { animation:pulse .57s ease-in-out infinite alternate; }
.voice.on i { transform:scaleY(.46); }
.voice.listen i:nth-child(2n) { animation-delay:-.35s; }.voice.listen i:nth-child(3) { animation-delay:-.18s; }
@keyframes pulse { to { transform:scaleY(1.4); } }
`,
      js: `const box=document.querySelector('.voice'),s=box.querySelector('[role=status]'),b=document.querySelector('button');let timer;b.onclick=()=>{clearTimeout(timer);box.className='voice listen';s.textContent='模拟聆听…';timer=setTimeout(()=>{box.className='voice on';s.textContent='模拟结果：台灯已开启';},matchMedia('(prefers-reduced-motion: reduce)').matches?80:700);};`
    }),
    '10.1': demo({
      note: '只驱动单一数字，按时间缓出到目标值；数字等宽防止位数改变时跳动，减少动态时直接显示终值。',
      height: 160,
      html: `<div class="metric"><div>本月新增样本</div><strong aria-hidden="true">0</strong><small>份</small><span class="sr" role="status"></span></div><button>重播计数</button>`,
      css: `
.metric { padding:9px 13px; margin-bottom:7px; border-radius:10px; background:#e1ecdf; color:#294534; }
.metric strong { font-size:35px; font-variant-numeric:tabular-nums; letter-spacing:-.025em; }
.metric small { margin-left:4px; }
.sr { position:absolute; width:1px; height:1px; clip-path:inset(50%); overflow:hidden; white-space:nowrap; }
`,
      js: `const num=document.querySelector('strong'),s=document.querySelector('[role=status]'),fmt=new Intl.NumberFormat('zh-CN'),rm=matchMedia('(prefers-reduced-motion: reduce)');let id;function run(){cancelAnimationFrame(id);s.textContent='';const start=performance.now();function step(now){const p=rm.matches?1:Math.min(1,(now-start)/950);num.textContent=fmt.format(Math.round(12840*(1-(1-p)**3)));if(p<1)id=requestAnimationFrame(step);else s.textContent='本月新增 12,840 份样本';}step(start);}document.querySelector('button').onclick=run;run();`
    }),
    '10.2': demo({
      note: '同一坐标尺度上，三根柱子向真实新值过渡；区分于单数字滚动，重点是多个类别的相对变化。数据是固定样本。',
      height: 194,
      html: `<div class="controls" aria-label="图表数据月份"><button aria-pressed="true">四月</button><button aria-pressed="false">五月</button><span class="caption">相同尺度：0–100</span></div><div class="chart" role="img" aria-label="四月：甲 32，乙 58，丙 43"><div><b>32</b><i></i><small>甲</small></div><div><b>58</b><i></i><small>乙</small></div><div><b>43</b><i></i><small>丙</small></div></div>`,
      css: `
.chart {display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:8px; margin-top:6px; padding:0 10px; background:repeating-linear-gradient(to top,#e1e9df 0 1px,transparent 1px 25px); }
.chart div { --val:0; display:flex; align-items:center; justify-content:end; flex-direction:column; height:125px; }
.chart i { width:min(65%,60px); height:calc(var(--val) * .82px); background:#487d5d; border-radius:5px 5px 0 0; transition:height .45s cubic-bezier(.2,.8,.35,1); }
.chart div:nth-child(2) i { background:#416b8a; }.chart div:nth-child(3) i { background:#a07036; }
.chart b,.chart small { font-size:12px; }
`,
      js: `const chart=document.querySelector('.chart'),bars=[...chart.children],buttons=[...document.querySelectorAll('button')];function plot(i){const vals=i?[76,43,89]:[32,58,43];buttons.forEach((b,j)=>b.setAttribute('aria-pressed',i===j));bars.forEach((b,j)=>{b.style.setProperty('--val',vals[j]);b.querySelector('b').textContent=vals[j];});chart.setAttribute('aria-label',buttons[i].textContent+'：甲 '+vals[0]+'，乙 '+vals[1]+'，丙 '+vals[2]);}let selected=false;buttons.forEach((b,i)=>b.onclick=()=>{selected=true;plot(i);});if(matchMedia('(prefers-reduced-motion: reduce)').matches)plot(0);else requestAnimationFrame(()=>requestAnimationFrame(()=>{if(!selected)plot(0);}));`
    }),
    '10.3': demo({
      note: '滚动切换叙事段落，左侧始终保留同一数据尺度并高亮当前阶段；虚构样本用来展示阅读顺序，并不代表真实因果。',
      height: 197,
      html: `<div class="story"><div class="index" role="img" aria-label="三阶段：准备 18，试点 41，扩展 68；当前为准备"><div class="on"><b>18</b><span>准备</span></div><div><b>41</b><span>试点</span></div><div><b>68</b><span>扩展</span></div></div><div class="chapters" tabindex="0" aria-label="向下滚动阅读三阶段"><section><strong>01 准备</strong><p>基线为 18 站。</p></section><section><strong>02 试点</strong><p>试点后记录 41 站。</p></section><section><strong>03 扩展</strong><p>最后覆盖 68 站。</p></section></div></div><p class="caption">滚动右侧，观察左侧高亮。</p>`,
      css: `
.story {display:grid;grid-template-columns:1fr 1fr;gap:9px; margin-bottom:6px; }
.index { display:grid; align-content:center; gap:6px; border-radius:9px; background:#e8efe3; padding:8px; }
.index div { position:relative; padding:4px 6px; border-left:3px solid transparent; border-radius:4px; display:flex; gap:5px; align-items:center; color:#30483a; background:#eef1e8; transition:background .24s,border-color .24s; }
.index div::before { content:''; position:absolute; inset:0 auto 0 0; width:var(--w,18%); opacity:.25; background:#75a67f; }
.index div:nth-child(2) { --w:41%; }.index div:nth-child(3) { --w:68%; }
.index div>* { position:relative; }
.index .on { border-left-color:#2d6544; background:#d8e9d6; }
.chapters { height:135px; overflow:auto; overscroll-behavior:contain; scroll-snap-type:y proximity; }
.chapters section { height:135px; scroll-snap-align:start; background:#f5eee0; display:grid; align-content:center; padding:8px; border-radius:9px; }
.chapters section p { font-size:12px; }
@media (prefers-reduced-motion:reduce) { .chapters { scroll-snap-type:none; } }
`,
      js: `const sc=document.querySelector('.chapters'),ix=document.querySelector('.index'),items=[...ix.children];let active=0;sc.onscroll=()=>{const n=Math.min(2,Math.round(sc.scrollTop/sc.clientHeight));if(n===active)return;active=n;items.forEach((p,i)=>p.classList.toggle('on',i===n));ix.setAttribute('aria-label','三阶段：准备 18，试点 41，扩展 68；当前为'+items[n].querySelector('span').textContent);};`
    }),
    '11.1': demo({
      kind: '示意',
      note: '这套离线规则根据两种明确意图选择不同组件，逐块拼出界面；不调用 AI，也不理解自由文本。',
      height: 207,
      html: `<div class="controls"><button data-intent="tour">规划路线</button><button data-intent="report">查看报告</button></div><p class="caption mode" role="status">本地模板 · 选择一个意图</p><div class="generated" aria-label="生成的组件"></div>`,
      css: `
.mode { margin:6px 0; }
.generated { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:5px; }
.generated article { padding:7px 8px; border-radius:8px; color:#294534; background:#dbeadf; animation:arrive .24s both; font-size:12px; }
.generated article:first-child { grid-column:span 2; background:#e8dfc8; }
.generated[data-intent="report"] article:first-child { grid-column:auto; }
.generated[data-intent="report"] article:last-child { grid-column:span 2; }
@keyframes arrive { from { opacity:0; transform:translateY(5px); } }
`,
      js: `const out=document.querySelector('.generated'),state=document.querySelector('.mode'),rm=matchMedia('(prefers-reduced-motion: reduce)'),templates={tour:['路线 · 松林 → 湖岸','里程 · 2.4 公里','装备 · 雨衣'],report:['指标 · 18 站','变化 · +3 站','结论 · 东区新增观测点']};let run=0;document.querySelectorAll('button').forEach(b=>b.onclick=()=>{const token=++run,key=b.dataset.intent;out.replaceChildren();out.dataset.intent=key;state.textContent='本地模板 · 正在组装';templates[key].forEach((text,i)=>{const add=()=>{if(token!==run)return;const item=document.createElement('article');item.textContent=text;out.append(item);if(i===2)state.textContent='本地模板 · 已生成 3 个组件';};if(rm.matches)add();else setTimeout(add,i*145);});});`
    }),
    '11.2': demo({
      kind: '示意',
      note: '不是按指令生成新组件：固定主页按你本次的点选次数调整排序与主题，不记录身份，也不跨刷新保留。',
      height: 211,
      html: `<div class="controls"><button data-focus="trail">多看路线</button><button data-focus="log">多看记录</button><button class="reset">重置</button></div><div class="home"><p class="caption" role="status">按本次点选次数调整</p><div class="homecards"><article data-key="trail">路线探索 <b>0</b></article><article data-key="log">观测记录 <b>0</b></article></div></div>`,
      css: `
.home { border-radius:9px; padding:7px; margin-top:7px; background:#e4eee1; transition:background .25s; }
.home[data-theme="log"] { background:#e3eaf4; }
.home .caption { margin-bottom:5px; }
.homecards { display:grid; gap:5px; }
.home article { display:flex; justify-content:space-between; padding:6px 8px; border-radius:7px; background:#fcfcf4; }
`,
      js: `const home=document.querySelector('.home'),grid=home.querySelector('.homecards'),cards=[...grid.children],state=home.querySelector('[role=status]'),taps={trail:0,log:0},rm=matchMedia('(prefers-reduced-motion: reduce)');function adapt(){const old=new Map(cards.map(c=>[c,c.getBoundingClientRect().top]));const order=[...cards].sort((a,b)=>taps[b.dataset.key]-taps[a.dataset.key]);order.forEach(c=>{c.querySelector('b').textContent=taps[c.dataset.key];grid.append(c);if(c.getAnimations)c.getAnimations().forEach(a=>a.cancel());});for(const c of order){const dy=old.get(c)-c.getBoundingClientRect().top;if(dy&&!rm.matches&&c.animate)c.animate([{transform:'translateY('+dy+'px)'},{transform:'none'}],{duration:230,easing:'ease-out'});}const tied=taps.trail===taps.log;home.dataset.theme=tied?'trail':order[0].dataset.key;state.textContent=tied?'两类热度相同 · 默认顺序':(home.dataset.theme==='trail'?'路线':'记录')+'优先 · 随本次偏好切换主题';}document.querySelectorAll('[data-focus]').forEach(b=>b.onclick=()=>{taps[b.dataset.focus]++;adapt();});document.querySelector('.reset').onclick=()=>{taps.trail=taps.log=0;adapt();};`
    }),
    '11.3': demo({
      kind: '示意',
      note: '按钮把风格提示映射到不同的本地关键帧与插值，模拟动效生成流程；没有模型、视频合成或实时 AI 渲染。',
      height: 193,
      html: `<div class="controls"><button data-motion="glide" aria-pressed="false">提示：轻盈</button><button data-motion="hop" aria-pressed="false">提示：弹跳</button></div><div class="rail" aria-hidden="true"><i></i></div><p class="caption" role="status">规则演示 · 选择风格后预览</p>`,
      css: `
.rail { position:relative; height:92px; overflow:hidden; border-radius:9px; margin:7px 0 5px; background:repeating-linear-gradient(90deg,#dce9e0 0 1px,transparent 1px 25%),#eef3e9; }
.rail::before { content:''; position:absolute; inset:auto 7% 17px; border-bottom:2px dashed #7a9480; }
.rail i { position:absolute; bottom:18px; left:8%; width:23px; height:23px; background:#37654d; border-radius:50%; translate:-50%; }
.rail i.end { left:88%; }
`,
      js: `const ball=document.querySelector('.rail i'),state=document.querySelector('[role=status]'),rm=matchMedia('(prefers-reduced-motion: reduce)'),buttons=[...document.querySelectorAll('button')];let playing;const frames={glide:[{left:'8%',transform:'translateY(0)'},{left:'52%',transform:'translateY(-32px)'},{left:'88%',transform:'translateY(0)'}],hop:[{left:'8%',transform:'scaleY(.75)'},{left:'34%',transform:'translateY(-38px)'},{left:'52%',transform:'scaleY(.82)'},{left:'72%',transform:'translateY(-21px)'},{left:'88%',transform:'none'}]};buttons.forEach(b=>b.onclick=()=>{if(playing)playing.cancel();const key=b.dataset.motion;buttons.forEach(c=>c.setAttribute('aria-pressed',b===c));ball.classList.add('end');state.textContent='本地关键帧 · '+(key==='glide'?'3 帧 / 平滑弧线':'5 帧 / 两次弹跳');if(!rm.matches&&ball.animate)playing=ball.animate(frames[key],{duration:key==='glide'?980:820,easing:key==='glide'?'ease-in-out':'ease-out'});});`
    })
  };
})();
