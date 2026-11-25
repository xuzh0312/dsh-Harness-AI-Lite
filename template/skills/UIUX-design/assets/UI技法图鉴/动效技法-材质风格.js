window.UI_MOTION_STYLE = {
  '1.2': {
    note: '拨动电源，观察开关的机械行程和灯泡亮灭。拉丝面板、凹槽和反光用 CSS 绘制，没有使用照片纹理。',
    html: `<div class="amp">
  <div class="engraving"><strong>录音室电源</strong><small>STUDIO / 01</small></div>
  <button class="switch" type="button" aria-label="录音室电源" aria-pressed="false"><span></span></button>
  <span class="status" role="status">关</span>
</div>`,
    css: `.amp { min-height: 148px; padding: 18px; display: flex; align-items: center; justify-content: center; gap: 13px; border: 5px ridge #b6a89e; border-radius: 9px; background: repeating-linear-gradient(0deg,#fff2 0 1px,#1f140812 1px 2px),linear-gradient(#e4d4be,#9d8875 55%,#b5a08c); color: #211710; box-shadow: inset 0 1px #fff9; }
.engraving { display: grid; gap: 3px; text-shadow: 0 1px #fff8; }
.engraving small { font: 700 10px monospace; letter-spacing: .12em; }
.switch { width: 60px; height: 54px; padding: 5px; background: #291e16; border: 2px inset #816549; border-radius: 9px; box-shadow: inset 0 4px 6px #000; cursor: pointer; }
.switch span { display: block; width: 29px; height: 33px; border-radius: 5px; border: 1px solid #705030; background: repeating-linear-gradient(0deg,#7d4a2420 0 2px,transparent 2px 5px),linear-gradient(#c0905d,#f6d8a8,#91714e); box-shadow: 0 4px 4px #000c; transform: translateX(0) rotate(-7deg); transition: transform .18s; }
.switch[aria-pressed=true] span { transform: translateX(13px) rotate(7deg); }
.status { flex: none; color: #211710; font-weight: 700; }
.status::before { content: ''; display: block; margin: 0 auto 5px; width: 12px; height: 12px; border: 2px inset #77663c; border-radius: 50%; background: #322e24; }
.switch[aria-pressed=true] + .status::before { background: #fef483; box-shadow: 0 0 12px 3px #ffce4f; }
@media (prefers-reduced-motion: reduce) { .switch span { transition: none; } }`,
    js: `const lever = document.querySelector('.switch');
lever.addEventListener('click', () => {
  const on = lever.getAttribute('aria-pressed') === 'false';
  lever.setAttribute('aria-pressed', on);
  document.querySelector('.status').textContent = on ? '开' : '关';
});`,
    height: 170
  },
  '1.5': {
    note: '点击镜片看轮廓拉伸，移动指针看高光跟随。这里是背景模糊与动态高光叠加，不是真实折射，也不是苹果系统材质。',
    kind: '近似',
    html: `<div class="basin">
  <div class="print" aria-hidden="true">OPTICS<br>014</div>
  <button class="lens" type="button" aria-label="拉伸镜片" aria-pressed="false"><span aria-hidden="true">＋</span></button>
</div>`,
    css: `.basin { min-height: 152px; display: grid; place-items: center; overflow: hidden; position: relative; isolation: isolate; background: repeating-linear-gradient(116deg,transparent 0 11px,#071d3840 11px 13px),linear-gradient(120deg,#113457 17%,#77e1ef 47%,#b79af4 64%,#241b62 85%); }
.print { position: absolute; inset: auto auto 13px 16px; font: 900 clamp(25px,8vw,46px)/.86 system-ui,sans-serif; letter-spacing: -.08em; color: #fff; }
.lens { --x: 30%; --y: 20%; z-index: 1; width: 82px; height: 56px; color: #08172c; font: 700 26px system-ui; border: 1px solid #efffffce; border-radius: 46% 49% 42% 51% / 52%; background: radial-gradient(circle at var(--x) var(--y),#fff 0%,#ffffff70 13%,transparent 45%),#d2f2ff5c; backdrop-filter: blur(4px) saturate(1.45); box-shadow: inset -4px -5px 12px #4bc1f554,inset 3px 3px 8px #ffffffe0,0 8px 19px #0d173b60; cursor: pointer; transition: width .46s cubic-bezier(.2,1.6,.3,1), border-radius .46s; }
.lens[aria-pressed=true] { width: min(77%,195px); border-radius: 21px 48px 46px 24px / 28px; }
@media (prefers-reduced-motion: reduce) { .lens { transition: none; background: radial-gradient(circle at 30% 20%,#fff,#ffffff70 13%,transparent 45%),#d2f2ff5c; } }`,
    js: `const lens = document.querySelector('.lens');
lens.addEventListener('click', () => {
  const wide = lens.getAttribute('aria-pressed') === 'false';
  lens.setAttribute('aria-pressed', wide);
  lens.firstElementChild.textContent = wide ? '－' : '＋';
});
lens.addEventListener('pointermove', e => {
  const rect = lens.getBoundingClientRect();
  lens.style.setProperty('--x', (e.clientX - rect.left) / rect.width * 100 + '%');
  lens.style.setProperty('--y', (e.clientY - rect.top) / rect.height * 100 + '%');
});
lens.addEventListener('pointerleave', () => {
  lens.style.removeProperty('--x');
  lens.style.removeProperty('--y');
});`,
    height: 174
  },
  '1.6': {
    note: '胖圆边和深浅两层内阴影形成黏土体块。点击重放先挤扁、再过冲拉长的形变；这里用关键帧手调节奏。',
    html: `<div class="bench">
  <button class="clay" type="button" aria-label="戳一下黏土"><span class="face" aria-hidden="true"></span></button>
  <span class="count" role="status">戳一下</span>
</div>`,
    css: `.bench { min-height: 150px; display: grid; align-content: center; justify-items: center; gap: 12px; background: #efe6ff; border-radius: 14px; color: #49315a; font-weight: 700; }
.clay { display: grid; place-items: center; width: 100px; height: 77px; transform-origin: 50% 95%; border: 0; border-radius: 44% 47% 36% 37%; background: #f093aa; color: #653453; box-shadow: inset 8px 10px 14px #ffd9de,inset -7px -11px 15px #ad536ec9,0 12px 14px #79406e49; cursor: pointer; }
.face { position: relative; display: block; width: 6px; height: 8px; margin-left: -20px; border-radius: 50%; background: currentColor; box-shadow: 20px 0 currentColor; }
.face::after { content: ''; position: absolute; width: 12px; height: 8px; left: 7px; top: 9px; border-bottom: 2px solid; border-radius: 0 0 90% 90%; }
.clay[data-pop] { animation: squish 540ms ease-out; }
@keyframes squish { 30% { transform: scale(1.21,.71); } 57% { transform: scale(.92,1.18); } 80% { transform: scale(1.04,.95); } }
@media (prefers-reduced-motion: reduce) { .clay[data-pop] { animation: none; } }`,
    js: `const clay = document.querySelector('.clay');
let pokes = 0;
clay.addEventListener('click', () => {
  clay.removeAttribute('data-pop');
  void clay.offsetWidth;
  clay.setAttribute('data-pop', '');
  document.querySelector('.count').textContent = '戳了 ' + ++pokes + ' 下';
});`,
    height: 172
  },
  '1.7': {
    note: '这里极光是实体按钮表面漫开的彩光；2.1 只演示背景渐变。按「换光」改变色场，凸边和落影保持不动。',
    html: `<div class="tray"><button class="aurora" type="button" aria-pressed="false"><span>换光</span></button></div>`,
    css: `.tray { min-height: 144px; display: grid; place-items: center; background: #181a38; border-radius: 10px; }
.aurora { position: relative; overflow: hidden; isolation: isolate; width: 154px; height: 74px; border: 1px solid #e1dcff9c; border-radius: 22px; color: #fff; background: #2d2e61; box-shadow: 0 13px 19px #0007; font: 800 15px system-ui; cursor: pointer; }
.aurora::before { content: ''; position: absolute; z-index: -1; inset: -37px; background: radial-gradient(ellipse at 24% 28%,#43e0b8 0,transparent 48%),radial-gradient(ellipse at 77% 68%,#de77f9 0,transparent 54%),radial-gradient(ellipse at 46% 48%,#556fea 0,transparent 59%); filter: blur(12px); transition: transform .85s ease-in-out; }
.aurora::after { content: ''; position: absolute; pointer-events: none; inset: 0; border-radius: inherit; box-shadow: inset 0 3px 7px #ffffff70,inset 0 -10px 14px #090b2c88; }
.aurora[aria-pressed=true]::before { transform: translate(15px,-8px) rotate(140deg); }
.aurora span { padding: 5px 11px; border-radius: 12px; background: #191e42db; }
@media (prefers-reduced-motion: reduce) { .aurora::before { transition: none; } }`,
    js: `const aurora = document.querySelector('.aurora');
aurora.addEventListener('click', () => aurora.setAttribute('aria-pressed', aurora.getAttribute('aria-pressed') === 'false'));`,
    height: 166
  },
  '1.8': {
    note: '字形内部压进很窄的亮带和陡峭明暗分界，像铬面倒映出地平线。划过、聚焦或点按可扫过一段银蓝高光；没有场景反射采样。',
    html: `<div class="foil"><button type="button" aria-label="移动铬面反光" aria-pressed="false"><span aria-hidden="true">Cr</span><small>镜铬</small></button></div>`,
    css: `.foil { min-height: 148px; display: grid; place-items: center; background: linear-gradient(170deg,#343c5c,#141522 62%); border-radius: 9px; }
.foil button { display: grid; justify-items: center; padding: 1px 20px 8px; border: 1px solid #8998bc; border-radius: 42px; background: #15182b; color: #e8edff; cursor: pointer; }
.foil button span { font: italic 900 63px/1.06 system-ui,sans-serif; letter-spacing: -.10em; padding-right: .1em; background: linear-gradient(105deg,transparent 32%,#cceaff 49%,#fff 51%,transparent 61%) -70px 0/210% 100%,linear-gradient(#fff 8%,#394d72 39%,#f4faff 46%,#111221 49%,#4a6191 64%,#d8f0ff 81%,#5c6383 95%); background-clip: text; color: transparent; transition: background-position .53s; }
.foil button:hover span,.foil button:focus-visible span,.foil button[aria-pressed=true] span { background-position: 70px 0,0 0; }
.foil small { font-size: 11px; letter-spacing: .18em; }
@media (prefers-reduced-motion: reduce) { .foil button span { transition: none; } }
@media (forced-colors: active) { .foil button span { color: ButtonText; } }`,
    js: `const chrome = document.querySelector('.foil button');
chrome.addEventListener('click', () => chrome.setAttribute('aria-pressed', chrome.getAttribute('aria-pressed') === 'false'));`,
    height: 170
  },
  '1.9': {
    note: '同一场景对照木纹和纸纤维；点击纸签可翻到背面，木底不变。纹理由渐变叠绘，翻页用平面旋转，没有模拟真实纸张弯折。',
    html: `<div class="wood">
  <span class="stamp" aria-hidden="true">原木<br>底板</span>
  <button class="sheet" type="button" aria-label="翻转纸签" aria-pressed="false">
    <span class="fibre" aria-hidden="true"><b>编号 027</b><small>纸签 · 正面</small></span>
    <span class="back" aria-hidden="true"><b>已核对 ✓</b><small>纸签 · 背面</small></span>
  </button>
</div>`,
    css: `.wood { min-height: 152px; padding: 14px; display: flex; justify-content: center; align-items: center; gap: 16px; background: repeating-radial-gradient(ellipse at -52px 48px,#ffd8a736 0 1px,transparent 2px 11px,#3820143d 12px 14px,transparent 15px 24px),linear-gradient(20deg,#6e442e,#9d633e,#70432b); perspective: 500px; }
.stamp { color: #fff0d0; border: 2px solid; font: 700 13px/1.1 system-ui; padding: 5px; transform: rotate(-8deg); }
.sheet { width: 133px; height: 83px; position: relative; border: 0; background: none; transform-style: preserve-3d; transition: transform .48s; cursor: pointer; }
.sheet[aria-pressed=true] { transform: rotateY(-180deg); }
.sheet span { position: absolute; inset: 0; display: grid; align-content: center; justify-items: center; color: #4d342d; box-shadow: 2px 6px 8px #2616099e; backface-visibility: hidden; background: repeating-linear-gradient(94deg,#503c1514 0 1px,transparent 1px 5px),repeating-linear-gradient(12deg,#503c1514 0 1px,transparent 1px 4px),#fff3cf; }
.sheet .back { transform: rotateY(180deg); color: #3f4b2c; background-color: #e5e3b5; }
.sheet small { margin-top: 4px; }
@media (prefers-reduced-motion: reduce) { .sheet { transition: none; } }`,
    js: `const sheet = document.querySelector('.sheet');
sheet.addEventListener('click', () => sheet.setAttribute('aria-pressed', sheet.getAttribute('aria-pressed') === 'false'));`,
    height: 174
  },
  '2.3': {
    note: '形状由低亮度灯管变成高亮线芯，周围多层阴影向暗处散光。点按开关比较亮灭；不使用连续闪烁。',
    html: `<div class="store"><button class="neon" type="button" aria-label="霓虹灯牌" aria-pressed="false"><span aria-hidden="true">OPEN</span></button><span class="label" role="status">灯牌已关</span></div>`,
    css: `.store { display: grid; align-content: center; justify-items: center; gap: 9px; min-height: 152px; color: #ead6e6; background: repeating-linear-gradient(0deg,transparent 0 18px,#322839 18px 20px),#1a1321; }
.neon { min-width: 148px; padding: 9px 18px; border: 3px solid #896283; border-radius: 16px; background: #211423; color: #c195b9; font: 800 29px/1 system-ui,sans-serif; letter-spacing: .15em; cursor: pointer; transition: color .34s,border-color .34s,box-shadow .34s; }
.neon span { transition: text-shadow .34s; }
.neon[aria-pressed=true] { border-color: #bcffeb; color: #fff3fd; box-shadow: 0 0 5px #dafff6,0 0 13px #2eface,0 0 25px #1fddb390,inset 0 0 10px #2eface; }
.neon[aria-pressed=true] span { text-shadow: 0 0 4px #fff,0 0 9px #ff4bd6,0 0 20px #ff43c5; }
.label { font: 700 11px system-ui; }
@media (prefers-reduced-motion: reduce) { .neon,.neon span { transition: none; } }`,
    js: `const sign = document.querySelector('.neon');
sign.addEventListener('click', () => {
  const on = sign.getAttribute('aria-pressed') === 'false';
  sign.setAttribute('aria-pressed', on);
  document.querySelector('.label').textContent = on ? '灯牌已亮' : '灯牌已关';
});`,
    height: 174
  },
  '2.4': {
    note: '圆周用角度渐变，平面用明暗渐变，合成金／银章。点击切换金属色并扫光；与 1.8 的镜铬字面不同，这里强调冲压徽章的边和面。',
    html: `<div class="case"><button class="medal" type="button" aria-label="改用银章" aria-pressed="false"><strong aria-hidden="true">01</strong></button><span role="status">金质章</span></div>`,
    css: `.case { min-height: 155px; display: grid; align-content: center; justify-items: center; gap: 8px; background: #302a24; color: #fff5db; font: 700 12px system-ui; }
.medal { --shine: #fff1aa; --mid: #cc9c3f; --shadow: #88601e; position: relative; isolation: isolate; overflow: hidden; display: grid; place-items: center; width: 82px; aspect-ratio: 1; border: 1px solid var(--shine); border-radius: 50%; background: conic-gradient(from 0deg,var(--mid),var(--shine),var(--shadow),var(--mid),var(--shine),var(--shadow),var(--mid)); box-shadow: 0 6px 10px #0009; cursor: pointer; }
.medal[aria-pressed=true] { --shine: #eef9fc; --mid: #b1c1cb; --shadow: #596981; }
.medal strong { display: grid; place-items: center; width: 67px; aspect-ratio: 1; border: 2px ridge var(--shine); border-radius: 50%; color: #272018; font: 900 27px Georgia,serif; text-shadow: 0 1px #fffc; background: linear-gradient(140deg,var(--mid),var(--shine) 30%,var(--mid) 67%,var(--shadow)); }
.medal::after { content: ''; position: absolute; inset: 0; background: linear-gradient(112deg,transparent 30%,#ffffffd1 50%,transparent 66%); transform: translateX(-100%); transition: transform .65s; pointer-events: none; }
.medal[aria-pressed=true]::after { transform: translateX(100%); }
@media (prefers-reduced-motion: reduce) { .medal::after { display: none; } }`,
    js: `const medal = document.querySelector('.medal');
medal.addEventListener('click', () => {
  const silver = medal.getAttribute('aria-pressed') === 'false';
  medal.setAttribute('aria-pressed', silver);
  document.querySelector('[role=status]').textContent = silver ? '银质章' : '金质章';
});`,
    height: 177
  },
  '2.5': {
    note: '上方色面完全相同，只有右半盖上了 SVG 程序噪声。拖动滑杆看颗粒密度感随叠加不透明度变化；不刷新随机种子。',
    html: `<div class="compare">
  <span>无颗粒</span><span>有颗粒</span>
  <svg viewBox="0 0 240 160" preserveAspectRatio="none" aria-hidden="true">
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="4" seed="12" stitchTiles="stitch"/></filter>
    <rect width="100%" height="100%" fill="white" filter="url(#grain)"/>
  </svg>
</div>
<label>叠加量 <input type="range" min="0" max="80" value="45"><output>45%</output></label>`,
    css: `.compare { position: relative; isolation: isolate; display: grid; grid-template-columns: 1fr 1fr; align-items: end; justify-items: center; min-height: 112px; border-radius: 9px; overflow: hidden; padding-bottom: 12px; background: linear-gradient(180deg,#b4adf5,#59727d 62%,#233c55); }
.compare span { z-index: 1; color: white; background: #192936; border-radius: 9px; padding: 3px 8px; font-size: 11px; }
.compare svg { position: absolute; inset: 0 0 0 50%; width: 50%; height: 100%; mix-blend-mode: overlay; opacity: var(--grain, .45); border-left: 1px solid #fff; transition: opacity .15s linear; }
label { display: flex; align-items: center; justify-content: center; gap: 6px; min-height: 38px; font-weight: 700; }
input { width: min(44%,142px); accent-color: #315941; }
output { min-width: 3ch; }
@media (prefers-reduced-motion: reduce) { .compare svg { transition: none; } }`,
    js: `const amount = document.querySelector('input');
amount.addEventListener('input', () => {
  document.querySelector('.compare').style.setProperty('--grain', Number(amount.value) / 100);
  document.querySelector('output').value = amount.value + '%';
});`,
    height: 172
  },
  '2.6': {
    note: '选择「跟随系统」或显式覆盖。底色、正文、次要文字和轮廓由语义变量一起切换，不是把整个画面反色。',
    html: `<div class="reader" data-theme="auto">
  <label>主题 <select><option value="auto">跟随系统</option><option value="light">浅色</option><option value="dark">深色</option></select></label>
  <div class="excerpt"><strong>海边的晨间笔记</strong><small>阅读进度 35%</small><progress max="100" value="35" aria-label="阅读进度">35%</progress></div>
</div>`,
    css: `.reader { --bg: #f6f0e5; --card: #fffaf1; --ink: #2e2a25; --muted: #5e5348; --rule: #a99172; --accent: #45653f; min-height: 157px; display: grid; align-content: center; gap: 9px; padding: 14px; border-radius: 9px; color: var(--ink); background: var(--bg); color-scheme: light; transition: color .22s,background-color .22s; }
.reader[data-theme=dark] { --bg: #171f1f; --card: #252f2f; --ink: #f5ede1; --muted: #c9c0b2; --rule: #81928a; --accent: #a1cc8f; color-scheme: dark; }
@media (prefers-color-scheme: dark) { .reader[data-theme=auto] { --bg: #171f1f; --card: #252f2f; --ink: #f5ede1; --muted: #c9c0b2; --rule: #81928a; --accent: #a1cc8f; color-scheme: dark; } }
select,.excerpt { border: 1px solid var(--rule); color: inherit; background: var(--card); }
select { font: inherit; }
.excerpt { display: grid; gap: 4px; padding: 9px; border-radius: 5px; transition: color .22s,background-color .22s,border-color .22s; }
.excerpt small { color: var(--muted); }
progress { width: 100%; height: 8px; accent-color: var(--accent); }
@media (prefers-reduced-motion: reduce) { .reader,.excerpt { transition: none; } }`,
    js: `document.querySelector('select').addEventListener('change', e => {
  document.querySelector('.reader').dataset.theme = e.currentTarget.value;
});`,
    height: 179
  },
  '2.7': {
    note: '硬边、裸露的编号和黑黄撞色构成这张粗野主义票据。按一下会硬切位置，无缓动、无闪烁。',
    html: `<div class="sheet"><strong>公告<span aria-hidden="true">!</span></strong><button type="button" aria-pressed="false">钉住编号</button><output>NO. 17 / 浮动</output></div>`,
    css: `.sheet { min-height: 151px; display: grid; grid-template-columns: minmax(0,1fr) auto; align-content: center; align-items: center; gap: 9px; padding: 11px 13px; border: 4px solid #111; color: #111; background: #ffe928; }
.sheet strong { font: 1000 clamp(22px,10vw,49px)/1 system-ui; letter-spacing: -.08em; }
.sheet button { border: 3px solid #111; box-shadow: 4px 4px #111; padding: 5px 7px; color: #111; background: #fff; font: 900 12px system-ui; cursor: pointer; }
.sheet button[aria-pressed=true] { box-shadow: none; color: #fff; background: #111; }
.sheet output { justify-self: start; grid-column: 1/-1; padding: 5px 7px; border: 2px solid #111; font: 900 12px monospace; }
.sheet button[aria-pressed=true] + output { transform: translateX(12px); color: #fff; background: #111; }
@media (prefers-reduced-motion: reduce) { .sheet button[aria-pressed=true] + output { transform: none; } }`,
    js: `const pin = document.querySelector('button');
pin.addEventListener('click', () => {
  const fixed = pin.getAttribute('aria-pressed') === 'false';
  pin.setAttribute('aria-pressed', fixed);
  document.querySelector('output').value = fixed ? 'NO. 17 / 已钉住' : 'NO. 17 / 浮动';
});`,
    height: 173
  },
  '3.1': {
    note: '青红副本只在部分扫描行错位，字的主体仍然可读。点击「扰动」播放一次短促撕裂；减少动效时静态显示色偏。',
    html: `<div class="monitor">
  <strong class="signal">SIGNAL<span aria-hidden="true">SIGNAL</span><span aria-hidden="true">SIGNAL</span></strong>
  <button type="button" aria-pressed="false">扰动信号</button>
</div>`,
    css: `.monitor { min-height: 150px; display: grid; align-content: center; justify-items: center; gap: 12px; color: #ecf8f6; background: repeating-linear-gradient(0deg,#141824 0 2px,#222939 2px 4px); border-radius: 6px; }
.signal { position: relative; isolation: isolate; z-index: 0; font: 900 clamp(28px,11vw,55px)/1 monospace; letter-spacing: -.052em; }
.signal span { position: absolute; inset: 0; color: #00e5e7; transform: translateX(-3px); clip-path: inset(13% 0 66%); opacity: 0; }
.signal span + span { color: #ff609f; transform: translateX(3px); clip-path: inset(60% 0 14%); }
.monitor[data-distort] .signal span { opacity: 1; animation: tear .45s steps(3,end); }
.monitor[data-distort] .signal span + span { animation-direction: reverse; }
.monitor button { border: 1px solid #61b4b4; color: #f5ffff; background: #21323d; padding: 5px 10px; font: 700 12px system-ui; cursor: pointer; }
.monitor button[aria-pressed=true] { background: #364559; }
@keyframes tear { 25% { transform: translate(-8px,1px); clip-path: inset(38% 0 46%); } 75% { transform: translate(7px,-1px); clip-path: inset(74% 0 8%); } }
@media (prefers-reduced-motion: reduce) { .monitor[data-distort] .signal span { animation: none; } }`,
    js: `const monitor = document.querySelector('.monitor');
const noise = monitor.querySelector('button');
noise.addEventListener('click', () => {
  const distorted = noise.getAttribute('aria-pressed') === 'false';
  noise.setAttribute('aria-pressed', distorted);
  monitor.toggleAttribute('data-distort', distorted);
});`,
    height: 172
  },
  '3.2': {
    note: '机器人由 12×12 个实际 Canvas 像素组成，整数倍放大并关闭平滑。点按播放四帧步态，可再次点按暂停。',
    html: `<div class="arcade">
  <canvas width="12" height="12" role="img" aria-label="绿色的像素机器人"></canvas>
  <button type="button" aria-pressed="false">播放走路</button>
</div>`,
    css: `.arcade { min-height: 153px; display: grid; place-items: center; align-content: center; gap: 10px; background: repeating-linear-gradient(0deg,#111c22 0 15px,#244033 15px 16px); }
canvas { display: block; width: 96px; height: 96px; image-rendering: pixelated; }
.arcade button { padding: 3px 8px; border: 2px solid #11221d; background: #d4f197; color: #102823; box-shadow: 3px 3px #7b9d5b; font: 900 12px monospace; cursor: pointer; }`,
    js: `const ctx = document.querySelector('canvas').getContext('2d');
const play = document.querySelector('button');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const feet = [[3,7],[2,8],[4,7],[3,8]];
let timer = 0, frame = 0;
function draw() {
  ctx.clearRect(0,0,12,12);
  ctx.fillStyle = '#375941'; ctx.fillRect(1,11,10,1);
  ctx.fillStyle = '#8bca58'; ctx.fillRect(2,3,8,6);
  ctx.fillStyle = '#d6f785'; ctx.fillRect(3,2,6,7); ctx.fillRect(5,0,2,2);
  ctx.fillStyle = '#1b3330'; ctx.fillRect(4,4,1,2); ctx.fillRect(7,4,1,2); ctx.fillRect(5,7,2,1);
  ctx.fillStyle = '#a4db68';
  feet[frame].forEach(x => ctx.fillRect(x,9,2,frame % 2 ? 1 : 2));
}
function stop() {
  clearInterval(timer); timer = 0;
  play.setAttribute('aria-pressed', 'false');
  play.textContent = '播放走路';
}
play.addEventListener('click', () => {
  if (reduce.matches) { frame = (frame + 1) % feet.length; draw(); return; }
  if (timer) { stop(); return; }
  play.setAttribute('aria-pressed', 'true');
  play.textContent = '暂停走路';
  timer = setInterval(() => { frame = (frame + 1) % feet.length; draw(); }, 155);
});
reduce.addEventListener('change', () => {
  stop();
  play.textContent = reduce.matches ? '下一帧' : '播放走路';
});
if (reduce.matches) play.textContent = '下一帧';
draw();`,
    height: 175
  },
  '3.3': {
    note: '粉紫晚霞、透视地网与仿旧桌面标题栏组合成千禧风播放器。换台时光碟漂移，同时切换频段，不实际播放音频。',
    html: `<div class="desktop"><div class="bar"><b>✧ NET RADIO</b><span aria-hidden="true">▢</span></div>
  <div class="sunset"><div class="disc" aria-hidden="true"></div><button type="button">换台</button><output>01 / SUNSET</output></div>
</div>`,
    css: `.desktop { width: min(100%,300px); margin: 0 auto; border: 3px outset #f5c6ff; color: #271842; background: #b466d5; box-shadow: 3px 4px #56416a; }
.bar { display: flex; justify-content: space-between; padding: 5px 7px; background: linear-gradient(#fff4ff,#d9a9f3 48%,#a87ddb 49%,#efcafa); font: 900 12px monospace; }
.sunset { isolation: isolate; position: relative; overflow: hidden; min-height: 121px; display: flex; justify-content: center; align-items: end; gap: 7px; padding: 8px; background: radial-gradient(circle at 50% 48%,#ffeb99 0 27px,transparent 28px),linear-gradient(#391278,#e77dda 61%,#512465 62%); }
.sunset::before { content: ''; position: absolute; z-index: -1; inset: 56% -22% -42%; background: repeating-linear-gradient(90deg,transparent 0 21px,#f7a3ed80 22px 23px),repeating-linear-gradient(0deg,transparent 0 12px,#f7a3ed80 13px 14px); transform: perspective(110px) rotateX(43deg); }
.disc { position: absolute; z-index: -1; width: 59px; aspect-ratio: 1; left: calc(50% - 30px); top: 18px; border-radius: 50%; border: 1px solid white; background: radial-gradient(circle,#654a9c 0 10%,#fff9f9 11% 20%,transparent 21%),conic-gradient(#f5a1db,#7ca3f5,#fff1aa,#f591e4,#8f7fed,#f5a1db); box-shadow: 0 0 18px #ffc7f5; transition: transform .58s; }
.sunset[data-channel=night] { background: radial-gradient(circle at 50% 48%,#d1cbff 0 24px,transparent 25px),linear-gradient(#1a1452,#894ad9 61%,#361959 62%); }
.sunset[data-channel=night] .disc { transform: translate(21px,-7px) rotate(140deg) scale(.87); }
.sunset button,.sunset output { padding: 4px 7px; border: 1px solid #553772; background: #f4d8ff; color: #291542; font: 800 11px monospace; }
.sunset button { border: 2px outset white; cursor: pointer; }
@media (prefers-reduced-motion: reduce) { .disc { transition: none; } }`,
    js: `const stage = document.querySelector('.sunset');
stage.querySelector('button').addEventListener('click', () => {
  const night = stage.dataset.channel !== 'night';
  stage.dataset.channel = night ? 'night' : 'sunset';
  stage.querySelector('output').value = night ? '02 / NIGHT' : '01 / SUNSET';
});`,
    height: 176
  },
  '3.4': {
    note: '波点圆、斜纹方和撞色三角彼此叠放。按「重排」可看几何形状以不同节奏跳换位置。',
    html: `<div class="party">
  <i class="dot" aria-hidden="true"></i><i class="block" aria-hidden="true"></i><i class="tri" aria-hidden="true"></i>
  <button type="button" aria-pressed="false">重排图形</button>
</div>`,
    css: `.party { min-height: 154px; position: relative; isolation: isolate; overflow: hidden; display: grid; place-items: end center; padding: 9px; background: radial-gradient(#24384b 1px,transparent 1.5px) 0 0/13px 13px,#ffde79; border: 2px solid #22263d; }
.party i { position: absolute; z-index: -1; display: block; transition: transform .45s cubic-bezier(.21,1.55,.48,1); }
.dot { width: 67px; height: 67px; left: 17%; top: 22px; border: 3px solid #242542; border-radius: 50%; background: radial-gradient(#241a36 2px,transparent 2.5px) 0 0/11px 11px,#f684b7; }
.block { width: 62px; height: 62px; left: 43%; top: 36px; background: repeating-linear-gradient(45deg,#142c7c 0 4px,#77bdff 4px 9px); border: 3px solid #192842; transform: rotate(15deg); }
.tri { width: 70px; height: 65px; right: 10%; top: 18px; background: #136a52; clip-path: polygon(55% 0,100% 100%,0 83%); }
.party[data-alt] .dot { transform: translate(12px,21px) scale(.78); }
.party[data-alt] .block { transform: translate(-9px,-17px) rotate(-26deg); transition-delay: .09s; }
.party[data-alt] .tri { transform: translate(-7px,13px) rotate(52deg); transition-delay: .16s; }
.party button { border: 2px solid #292740; box-shadow: 3px 3px #292740; color: #222135; background: #fff; font: 900 12px system-ui; padding: 5px 9px; cursor: pointer; }
@media (prefers-reduced-motion: reduce) { .party i,.party[data-alt] i { transition: none; } }`,
    js: `const paper = document.querySelector('.party');
paper.querySelector('button').addEventListener('click', e => {
  e.currentTarget.setAttribute('aria-pressed', paper.toggleAttribute('data-alt'));
});`,
    height: 176
  },
  '3.5': {
    note: '与 1.1 的无材质原则不同，这里用留白、字号层次和单一强调色控制阅读顺序。展开时只渐显一行文字，不移动标题。',
    html: `<div class="quiet">
  <span>档案 · 06</span><strong>夏至</strong>
  <button type="button" aria-expanded="false" aria-controls="detail">展开注记</button>
  <p id="detail" hidden>北半球白昼最长的一天。</p>
</div>`,
    css: `.quiet { min-height: 154px; width: min(100%,350px); margin-inline: auto; display: grid; grid-template-rows: auto auto auto 17px; gap: 2px; align-content: center; justify-items: start; padding: 7px 13%; color: #2b2926; background: #fffdf8; }
.quiet span { font-size: 10px; letter-spacing: .15em; }
.quiet strong { font: 600 35px/1.2 Georgia,serif; }
.quiet button { padding: 5px 0 3px; border: 0; border-bottom: 1px solid currentColor; color: #48654d; background: transparent; font: 700 12px system-ui; cursor: pointer; }
.quiet p { margin: 2px 0 0; font-size: 12px; }
.quiet p:not([hidden]) { animation: arrive .43s ease both; }
@keyframes arrive { from { opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .quiet p:not([hidden]) { animation: none; } }`,
    js: `const reveal = document.querySelector('button');
const detail = document.querySelector('#detail');
reveal.addEventListener('click', () => {
  detail.hidden = !detail.hidden;
  reveal.setAttribute('aria-expanded', !detail.hidden);
  reveal.textContent = detail.hidden ? '展开注记' : '收起注记';
});`,
    height: 176
  },
  '3.6': {
    note: '界面由几片透过网格的透明层和偏色边缘组成；切换读取状态让虹彩掠过。虹彩来自渐变混合，并非真实全息投影。',
    html: `<div class="console">
  <div class="layer" aria-hidden="true"></div>
  <div class="screen"><small>透明界面 / 03</small><div class="scan"><span role="status">待机</span><button type="button" aria-pressed="false">开启扫描</button></div></div>
</div>`,
    css: `.console { position: relative; isolation: isolate; min-height: 157px; display: grid; place-items: center; color: #f1fdff; background: repeating-linear-gradient(0deg,transparent 0 12px,#98d5fe34 13px 14px),repeating-linear-gradient(90deg,transparent 0 12px,#98d5fe34 13px 14px),#102739; }
.layer { position: absolute; width: min(64%,186px); height: 88px; border: 1px solid #a7b8ffa0; background: linear-gradient(125deg,#8acfff22,#e6a7ff45,#8cfbdd26); transform: translate(-12px,4px) skewY(-8deg); box-shadow: -4px 5px 0 #b7a8ee2a; }
.screen { position: relative; width: min(72%,197px); padding: 10px 12px; overflow: hidden; isolation: isolate; border: 1px solid #bfd6f6; border-radius: 3px; background: linear-gradient(120deg,#70daf32c,#eea7e82b 53%,#b4ffe537); box-shadow: inset 0 0 14px #b6d5ff40,5px 5px 0 #c2b2fd37; transform: translate(7px,-2px); }
.screen::before { content: ''; position: absolute; z-index: -1; inset: 0; background: linear-gradient(123deg,transparent 25%,#82ffd38c 48%,#f3a4fa88 58%,transparent 73%); mix-blend-mode: screen; transform: translateX(-80%); transition: transform .78s; }
.console[data-scanning] .screen::before { transform: translateX(30%); }
.screen small { font: 700 10px monospace; }
.scan { display: flex; flex-wrap: wrap; gap: 4px 7px; align-items: center; margin-top: 10px; }
.scan span,.scan button { background: #1c3650; color: #f1fdff; border: 1px solid #abbaf1; padding: 3px 5px; font: 700 11px system-ui; }
.scan button { cursor: pointer; }
@media (prefers-reduced-motion: reduce) { .screen::before { transition: none; } }`,
    js: `const panel = document.querySelector('.console');
const scan = panel.querySelector('button');
scan.addEventListener('click', () => {
  const active = panel.toggleAttribute('data-scanning');
  scan.setAttribute('aria-pressed', active);
  panel.querySelector('[role=status]').textContent = active ? '扫描中' : '待机';
});`,
    height: 179
  }
};
