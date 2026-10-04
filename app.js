/* ====== CONFIG — edit text, dates, photos and song here ====== */
const BIRTH = { month: 10, day: 5, year: 1952 };          // 5 Oct 1952
const LINE1 = 'Happy Birthday';
const LINE2 = 'Khan Sab';
const ROLES = ['Our Leader', 'Our Inspiration', 'The Pride of Millions', 'A Legend in Every Heart'];
const HERO_PHOTO = 'assets/3.png';
// Put photos in the assets/ folder and list them here (any name/extension)
const PHOTOS = [
  { src: 'assets/3.png', cap: 'Leader of the people' },
  { src: 'assets/5.png', cap: 'Grace, faith & dignity' },
  { src: 'assets/image.png', cap: 'The smile millions love' },
  { src: 'assets/2.png', cap: 'Always in our hearts' },
  { src: 'assets/1.png', cap: 'A vision for the future' },
  { src: 'assets/4.png', cap: 'A voice that stands firm' },
];
// SONG: put your mp3 at assets/song.mp3  — OR set YT_ID to a YouTube video id (e.g. 'dQw4w9WgXcQ')
const SONG = { src: 'assets/song.mp3', title: 'Khan Sab Birthday Song', sub: 'Tap to play' };
const YT_ID = '';
// SoundCloud track (streamed through SoundCloud's official embedded player — nothing is downloaded)
const SC_URL = 'https://soundcloud.com/shoaib-khan-40/ay-puttar-hattan-tay-nai-wikdaycover-by-hadia-hashmi';
const SC_START = 20000;                                  // start (and loop back to) 20 seconds in, in ms
const WISHES = [
  ['🏆', 'Your courage and determination inspire millions. May you be blessed with good health and a long life.'],
  ['✨', 'The prayers of countless hearts are with you today. Happy Birthday, Khan Sab!'],
  ['🌟', 'You taught a generation to dream big and never give up. Wishing you endless success.'],
  ['🕊️', 'Wishing you health, happiness and strength on your special day.'],
];

/* ====== always open at the very top (browsers otherwise restore the old scroll position) ====== */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
scrollTo(0, 0);
addEventListener('load', () => scrollTo(0, 0));
addEventListener('pageshow', () => scrollTo(0, 0));

/* ====== helpers ====== */
const $ = id => document.getElementById(id);
const rand = (a, b) => Math.random() * (b - a) + a;
const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

function placeholder(i) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='840'><rect width='100%' height='100%' fill='#222'/>
  <text x='50%' y='50%' font-size='34' fill='#fff' text-anchor='middle' font-family='sans-serif'>photo ${i + 1} missing</text></svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
function safeImg(img, i) { img.onerror = () => { img.onerror = null; img.src = placeholder(i); }; }

/* ====== themes ====== */
let themeCols = {};
function applyTheme() {
  themeCols = { a: css('--a'), b: css('--b'), c: css('--c'), d: css('--d'), e: css('--e'), g1: css('--g1'), bg: css('--bg') };
  document.querySelectorAll('.balloon').forEach((b, n) => b.style.background = [themeCols.a, themeCols.b, themeCols.c, themeCols.e, '#fff'][n % 5]);
}

/* ====== age + countdown ====== */
function nextBirthday() {
  const n = new Date(); let d = new Date(n.getFullYear(), BIRTH.month - 1, BIRTH.day);
  if (d < new Date(n.getFullYear(), n.getMonth(), n.getDate())) d.setFullYear(n.getFullYear() + 1);
  return d;
}
function tick() {
  const now = new Date(), nb = nextBirthday();
  $('age').textContent = nb.getFullYear() - BIRTH.year;
  if (now.getMonth() + 1 === BIRTH.month && now.getDate() === BIRTH.day) { $('countdown').innerHTML = '<div><b>🎂</b><small>Today is the day!</small></div>'; return; }
  let s = Math.floor((nb - now) / 1000);
  $('countdown').innerHTML = [['Days', 86400], ['Hours', 3600], ['Mins', 60], ['Secs', 1]]
    .map(([l, v]) => { const x = Math.floor(s / v); s %= v; return `<div><b>${String(x).padStart(2, '0')}</b><small>${l}</small></div>`; }).join('');
}
tick(); setInterval(tick, 1000);

/* ====== 3D headline + pointer tilt ====== */
(function text3d() {
  let i = 0;
  [['l1', LINE1], ['l2', LINE2]].forEach(([id, txt]) => {
    $(id).innerHTML = txt.split(' ').map(w => `<span class="word">${[...w].map(ch => `<span class="ch" style="--i:${i++}">${ch}</span>`).join('')}</span>`).join('');
  });
  const hero = $('hero');
  addEventListener('pointermove', e => {
    hero.style.setProperty('--ry', ((e.clientX / innerWidth - .5) * 30) + 'deg');
    hero.style.setProperty('--rx', (-(e.clientY / innerHeight - .5) * 20) + 'deg');
  });
  addEventListener('deviceorientation', e => {
    if (e.gamma == null) return;
    hero.style.setProperty('--ry', (e.gamma / 2) + 'deg'); hero.style.setProperty('--rx', ((45 - e.beta) / 4) + 'deg');
  });
  $('heroImg').src = HERO_PHOTO; safeImg($('heroImg'), 0);
})();

/* ====== rotating role line ====== */
(function typer() {
  let w = 0, c = 0, del = false; const el = $('role');
  (function step() {
    const word = ROLES[w]; el.textContent = word.slice(0, c);
    if (!del && c === word.length) { del = true; return setTimeout(step, 1600); }
    if (del && c === 0) { del = false; w = (w + 1) % ROLES.length; }
    c += del ? -1 : 1; setTimeout(step, del ? 35 : 80);
  })();
})();

/* ====== balloons ====== */
(function balloons() {
  for (let i = 0; i < 14; i++) {
    const b = document.createElement('div'); b.className = 'balloon';
    b.style.cssText = `left:${rand(0, 100)}%;animation-duration:${rand(11, 22)}s;animation-delay:${rand(0, 12)}s;scale:${rand(.7, 1.3)}`;
    $('balloons').appendChild(b);
  }
})();

/* ====== boot theme (must run before background/confetti read colours) ====== */
applyTheme();

/* ====== animated background ====== */
(function bg() {
  const c = $('bg'), x = c.getContext('2d'); let W, H, P = [];
  const resize = () => { W = c.width = innerWidth; H = c.height = innerHeight; P = Array.from({ length: Math.min(120, W / 10) }, () => ({ x: rand(0, W), y: rand(0, H), r: rand(.6, 2.6), v: rand(.1, .6), a: rand(0, 6.28) })); };
  addEventListener('resize', resize); resize();
  let mx = W / 2, my = H / 2; addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; });
  (function loop() {
    const g = x.createRadialGradient(mx, my, 0, W / 2, H / 2, Math.max(W, H));
    g.addColorStop(0, themeCols.g1); g.addColorStop(.55, themeCols.bg); g.addColorStop(1, themeCols.bg);
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    for (const p of P) {
      p.y -= p.v; p.a += .02; if (p.y < -5) { p.y = H + 5; p.x = rand(0, W); }
      x.globalAlpha = .4 + Math.sin(p.a) * .4; x.fillStyle = p.r > 1.8 ? themeCols.c : themeCols.d;
      x.beginPath(); x.arc(p.x, p.y, p.r, 0, 6.28); x.fill();
    }
    x.globalAlpha = 1; requestAnimationFrame(loop);
  })();
})();

/* ====== confetti ====== */
const confetti = (function () {
  const c = $('confetti'), x = c.getContext('2d'); let P = [];
  const resize = () => { c.width = innerWidth; c.height = innerHeight; }; addEventListener('resize', resize); resize();
  function burst(ox = innerWidth / 2, oy = innerHeight / 3, n = 140) {
    const cols = [themeCols.a, themeCols.b, themeCols.c, themeCols.d, themeCols.e, '#fff'];
    for (let i = 0; i < n; i++) P.push({ x: ox, y: oy, vx: rand(-8, 8), vy: rand(-14, -2), s: rand(6, 12), r: rand(0, 6), vr: rand(-.3, .3), c: cols[i % cols.length], life: 160 });
  }
  (function loop() {
    x.clearRect(0, 0, c.width, c.height);
    P = P.filter(p => p.life-- > 0 && p.y < c.height + 20);
    for (const p of P) {
      p.vy += .3; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; x.globalAlpha = Math.min(1, p.life / 40);
      x.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); x.restore();
    }
    requestAnimationFrame(loop);
  })();
  return burst;
})();

/* ====== music: SoundCloud track (streamed via the official embedded player) → optional local mp3 ====== */
const music = (function () {
  const a = $('music'); let sc = null, started = false, wantPlay = false;
  function loadSC() {
    const f = document.createElement('iframe'); f.allow = 'autoplay';
    f.src = 'https://w.soundcloud.com/player/?url=' + encodeURIComponent(SC_URL) + '&auto_play=true&hide_related=true&show_comments=false&visual=false';
    $('ytHost').appendChild(f);
    const boot = () => {
      sc = SC.Widget(f); let seeked = false;
      sc.bind(SC.Widget.Events.READY, () => { sc.setVolume(85); sc.play(); });
      sc.bind(SC.Widget.Events.PLAY, () => { started = true; if (!seeked) { seeked = true; sc.seekTo(SC_START); } });   // jump ahead once playback begins
      sc.bind(SC.Widget.Events.FINISH, () => { sc.seekTo(SC_START); sc.play(); });                                      // loop from the same point
    };
    if (window.SC) boot(); else { const s = document.createElement('script'); s.src = 'https://w.soundcloud.com/player/api.js'; s.onload = boot; document.head.appendChild(s); }
    // if the browser blocked autoplay, the very next tap/click anywhere starts it
    const retry = () => { if (wantPlay && sc && !started) sc.play(); };
    addEventListener('pointerdown', retry); addEventListener('keydown', retry);
  }
  function play() {
    wantPlay = true;
    if (SC_URL) { if (!sc && !document.querySelector('#ytHost iframe')) loadSC(); else if (sc) sc.play(); }
    else { a.src = SONG.src; a.volume = .8; a.loop = true; a.play().catch(() => {}); }
  }
  return { play };
})();

/* ====== gate ====== */
$('openBtn').onclick = () => {
  $('gate').classList.add('hide');
  confetti(innerWidth / 2, innerHeight / 2, 220);
  music.play();
};
$('partyBtn').onclick = () => { for (let i = 0; i < 4; i++) setTimeout(() => confetti(rand(100, innerWidth - 100), rand(100, innerHeight / 2), 100), i * 250); };

/* ====== cinematic gallery ====== */
(function gallery() {
  const img = $('gimg'), bgEl = $('gbg'), bar = $('gbar'); let cur = 0, timer;
  const thumbs = PHOTOS.map((p, i) => {
    const t = document.createElement('img'); t.src = p.src; safeImg(t, i); t.onclick = () => show(i); $('thumbs').appendChild(t); return t;
  });
  function show(i) {
    cur = (i + PHOTOS.length) % PHOTOS.length; const p = PHOTOS[cur];
    img.style.animation = 'none'; void img.offsetWidth; img.style.animation = ''; // restart entrance
    img.src = p.src; safeImg(img, cur); bgEl.style.backgroundImage = `url("${p.src}")`;
    $('gnum').textContent = String(cur + 1).padStart(2, '0'); $('gcap').textContent = p.cap;
    thumbs.forEach((t, n) => t.classList.toggle('on', n === cur));
    bar.classList.remove('run'); void bar.offsetWidth; bar.classList.add('run');
    clearTimeout(timer); timer = setTimeout(() => show(cur + 1), 4500);
  }
  $('next').onclick = () => show(cur + 1); $('prev').onclick = () => show(cur - 1);
  // 3D tilt + holographic shine
  const f = $('frame');
  f.onpointermove = e => {
    const r = f.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    f.style.setProperty('--fy', (px - .5) * 28 + 'deg'); f.style.setProperty('--fx', (.5 - py) * 22 + 'deg');
    f.style.setProperty('--mx', px * 100 + '%'); f.style.setProperty('--my', py * 100 + '%');
  };
  f.onpointerleave = () => { f.style.setProperty('--fy', '0deg'); f.style.setProperty('--fx', '0deg'); };
  let sx = 0; f.addEventListener('touchstart', e => sx = e.touches[0].clientX);
  f.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1)); });
  show(0);
})();

/* ====== wish cards ====== */
(function cards() {
  const wrap = $('cards');
  WISHES.forEach(([ic, t]) => {
    const d = document.createElement('div'); d.className = 'card'; d.innerHTML = `<span class="ic">${ic}</span><p>${t}</p>`;
    d.onpointermove = e => { const r = d.getBoundingClientRect(); const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5; d.style.transform = `rotateY(${px * 14}deg) rotateX(${-py * 14}deg)`; };
    d.onpointerleave = () => d.style.transform = '';
    wrap.appendChild(d);
  });
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); } }), { threshold: .2 });
  wrap.querySelectorAll('.card').forEach((c, i) => { c.style.transitionDelay = i * .12 + 's'; io.observe(c); });
})();

/* ====== wish wall ====== */
(function wall() {
  const key = 'khan-wishes'; let list = [];
  try { list = JSON.parse(localStorage.getItem(key)) || []; } catch {}
  const add = w => {
    const n = document.createElement('div'); n.className = 'note'; n.style.transform = `rotate(${rand(-3, 3)}deg)`;
    const b = document.createElement('b'), p = document.createElement('span'); b.textContent = w.n; p.textContent = w.m; n.append(b, p); $('wall').prepend(n);
  };
  list.forEach(add);
  $('wishForm').onsubmit = e => {
    e.preventDefault(); const w = { n: $('wName').value.trim(), m: $('wMsg').value.trim() };
    add(w); list.push(w); try { localStorage.setItem(key, JSON.stringify(list)); } catch {}
    e.target.reset(); confetti(innerWidth / 2, innerHeight / 2, 120);
  };
})();
