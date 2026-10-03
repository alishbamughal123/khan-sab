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

/* ====== original party music (Web Audio, no file needed) ====== */
const synth = (function () {
  let ctx, master, rev, chordBus, leadBus, noise, timer, step = 0, next = 0, on = false;
  const BPM = 124, BEAT = 60 / BPM, STEP = BEAT / 4, LOOP = 16 * 8;       // 8 bars of 16 steps
  const C = [261.63, 329.63, 392], G = [196, 246.94, 293.66], Am = [220, 261.63, 329.63], F = [174.61, 220, 261.63];
  const BARS = [[C, 65.41], [G, 49], [Am, 55], [F, 43.65], [C, 65.41], [G, 49], [Am, 55], [F, 43.65]];
  const SC = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];              // C major pentatonic
  const MEL = [
    [2, -1, -1, 2, -1, 3, -1, 4, -1, -1, 3, -1, 2, -1, -1, -1],
    [4, -1, -1, 4, -1, 3, -1, 2, -1, -1, 3, -1, -1, -1, -1, -1],
    [3, -1, -1, 3, -1, 4, -1, 5, -1, -1, 4, -1, 3, -1, 2, -1],
    [2, -1, 3, -1, 2, -1, 0, -1, 1, -1, -1, -1, 0, -1, -1, -1],
  ];
  function env(g, t, v, a, d) { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + a); g.gain.exponentialRampToValueAtTime(.0001, t + d); }
  function osc(type, f, t, d, v, dest, det = 0, a = .01) {
    const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.value = f; o.detune.value = det;
    env(g, t, v, a, d); o.connect(g).connect(dest); o.start(t); o.stop(t + d + .05);
  }
  function kick(t) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(160, t); o.frequency.exponentialRampToValueAtTime(42, t + .13);
    g.gain.setValueAtTime(.9, t); g.gain.exponentialRampToValueAtTime(.001, t + .28);
    o.connect(g).connect(master); o.start(t); o.stop(t + .3);
  }
  function noiseHit(t, d, v, hz, type) {
    const s = ctx.createBufferSource(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    s.buffer = noise; f.type = type; f.frequency.value = hz;
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + d);
    s.connect(f).connect(g).connect(master); s.start(t); s.stop(t + d + .02);
  }
  function chord(notes, t) {                                             // warm detuned "supersaw" pad
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(700, t); lp.frequency.linearRampToValueAtTime(2600, t + BEAT * 2);
    lp.connect(chordBus);
    notes.forEach(f => [-12, 0, 12].forEach(dt => osc('sawtooth', f * 2, t, BEAT * 4, .035, lp, dt, .08)));
  }
  function schedule() {
    while (next < ctx.currentTime + .3) {
      const s = step % LOOP, t = next, bar = Math.floor(s / 16), p = s % 16, [ch, root] = BARS[bar];
      if (p % 4 === 0) {                                                  // four-on-the-floor + pumping chords
        kick(t); chordBus.gain.cancelScheduledValues(t); chordBus.gain.setValueAtTime(.2, t); chordBus.gain.linearRampToValueAtTime(1, t + BEAT * .5);
      }
      if (p === 4 || p === 12) { noiseHit(t, .16, .35, 1500, 'bandpass'); osc('triangle', 220, t, .1, .15, master); }   // clap
      if (p % 4 === 2) noiseHit(t, .09, .22, 8000, 'highpass');                                                         // open hat
      else if (p % 2) noiseHit(t, .03, .08, 9000, 'highpass');                                                           // closed hat
      if (p % 4 === 2) { osc('sine', root * 2, t, STEP * 3.2, .5, master); osc('sawtooth', root * 2, t, STEP * 3, .08, master); }  // off-beat bass
      if (p === 0) chord(ch, t);
      osc('triangle', ch[[0, 1, 2, 1][p % 4]] * 4, t, STEP * 1.4, p % 4 ? .035 : .06, leadBus);                         // sparkle arp
      const m = MEL[bar % 4][p];
      if (m >= 0) { osc('triangle', SC[m], t, STEP * 3, .2, leadBus); osc('sine', SC[m] * 2, t, STEP * 2, .05, leadBus); osc('square', SC[m], t, STEP * 1.5, .02, leadBus); }
      step++; next += STEP;
    }
  }
  function impulse(sec) {                                                // synthetic reverb tail
    const n = ctx.sampleRate * sec, b = ctx.createBuffer(2, n, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.5); }
    return b;
  }
  function start() {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (!master) {
      master = ctx.createGain(); master.gain.value = 0;
      const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 4;
      master.connect(comp).connect(ctx.destination);
      rev = ctx.createConvolver(); rev.buffer = impulse(2.2); const rg = ctx.createGain(); rg.gain.value = .35; rev.connect(rg).connect(master);
      chordBus = ctx.createGain(); chordBus.connect(master); chordBus.connect(rev);
      leadBus = ctx.createGain(); leadBus.connect(master); leadBus.connect(rev);
      noise = ctx.createBuffer(1, ctx.sampleRate * .5, ctx.sampleRate);
      const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    ctx.resume(); step = 0; next = ctx.currentTime + .05; on = true;
    master.gain.cancelScheduledValues(ctx.currentTime); master.gain.linearRampToValueAtTime(.55, ctx.currentTime + 1.5);
    clearInterval(timer); timer = setInterval(schedule, 80); schedule();
  }
  function stop() {
    on = false; clearInterval(timer);
    if (master) { master.gain.cancelScheduledValues(ctx.currentTime); master.gain.linearRampToValueAtTime(0, ctx.currentTime + .4); }
  }
  return { start, stop, get on() { return on; } };
})();

/* ====== music player: YouTube → mp3 file → built-in celebration music ====== */
const music = (function () {
  const a = $('music'), pl = $('player'), btn = $('playBtn'); let playing = false, yt = null, mode = YT_ID ? 'yt' : 'file';
  $('songTitle').textContent = SONG.title; $('songSub').textContent = SONG.sub;
  if (mode === 'file') { a.src = SONG.src; a.volume = .7; }
  function set(on) { playing = on; pl.classList.toggle('on', on); btn.textContent = on ? '❚❚' : '▶'; if (on) $('songSub').textContent = 'Now playing'; }
  function useSynth() { mode = 'synth'; $('songTitle').textContent = 'Birthday Music'; synth.start(); set(true); }
  function play() {
    if (mode === 'yt') {
      if (!yt) { yt = document.createElement('iframe'); yt.allow = 'autoplay'; yt.src = `https://www.youtube.com/embed/${YT_ID}?autoplay=1&loop=1&playlist=${YT_ID}`; $('ytHost').appendChild(yt); }
      set(true);
    } else if (mode === 'synth') useSynth();
    else a.play().then(() => set(true)).catch(useSynth);   // no mp3 found → built-in music
  }
  function pause() { if (mode === 'yt') { yt && yt.remove(); yt = null; } else if (mode === 'synth') synth.stop(); else a.pause(); set(false); }
  btn.onclick = () => playing ? pause() : play();
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
