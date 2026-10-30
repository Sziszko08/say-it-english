/* Say It! - A1-B1 American English speaking trainer. Vanilla JS, no backend. */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const main = $('#main');
const LS = 'sayit-progress-v1', LSS = 'sayit-settings-v1';
const INTERVALS = [0, 0, 1, 3, 7, 16]; // days per Leitner box (1..5)
const today = () => new Date().toISOString().slice(0, 10);
const load = (k, d) => { try { return Object.assign(d, JSON.parse(localStorage.getItem(k)) || {}); } catch { return d; } };
let P = load(LS, { items: {}, points: 0, streak: 0, lastDay: null });
let S = load(LSS, { voice: '', rate: 0.95, auto: false, ipa: true, theme: '', level: 'A1' });
const saveP = () => localStorage.setItem(LS, JSON.stringify(P));
const saveS = () => localStorage.setItem(LSS, JSON.stringify(S));

// ---------- data helpers ----------
const ALL = [];
CATEGORIES.forEach(c => c.items.forEach(it => ALL.push({ cat: c.id, en: it[0], hu: it[1], ipa: it[2], resp: it[3], tip: it[4] || '', key: c.id + '|' + it[0] })));
const catItems = id => ALL.filter(i => i.cat === id);
const levelCats = () => CATEGORIES.filter(c => c.level === S.level);
const rec = k => P.items[k] || (P.items[k] = { box: 0, ok: 0, due: 0 });
const learned = i => (P.items[i.key] && P.items[i.key].box >= 3);
const mastery = id => { const its = catItems(id); return its.length ? Math.round(100 * its.reduce((a, i) => a + Math.min((P.items[i.key]?.box || 0), 3), 0) / (its.length * 3)) : 0; };
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
function markActive() { // daily streak
  const d = today(); if (P.lastDay === d) return;
  const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  P.streak = P.lastDay === y ? P.streak + 1 : 1; P.lastDay = d; saveP(); updStreak();
}
function grade(item, good) {
  markActive(); const r = rec(item.key);
  if (good) { r.box = Math.min(5, r.box + 1); r.ok++; P.points += 2; } else r.box = Math.max(1, r.box ? 1 : 1);
  r.due = Date.now() + INTERVALS[r.box] * 864e5; saveP();
}
const level = () => { const n = ALL.filter(learned).length; return { n, lvl: 1 + Math.floor(P.points / 100) }; };
function updStreak() { $('#streak').textContent = '🔥 ' + (P.streak || 0); }
function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('show'), 2200); }

// ---------- speech synthesis ----------
const synth = window.speechSynthesis;
let voices = [];
function loadVoices() {
  if (!synth) return;
  const all = synth.getVoices();
  voices = all.filter(v => /en[-_]US/i.test(v.lang));
  if (!voices.length) voices = all.filter(v => /^en/i.test(v.lang));
  const rank = v => (/google|natural|neural|premium|enhanced/i.test(v.name) ? 0 : 1) + (/en[-_]US/i.test(v.lang) ? 0 : 2);
  voices.sort((a, b) => rank(a) - rank(b));
  const sel = $('#voiceSel');
  sel.innerHTML = voices.length ? voices.map(v => `<option value="${esc(v.name)}">${esc(v.name)} (${esc(v.lang)})</option>`).join('') : '<option value="">Nincs angol hang telepítve</option>';
  if (S.voice && voices.some(v => v.name === S.voice)) sel.value = S.voice;
}
if (synth) { loadVoices(); synth.onvoiceschanged = loadVoices; }
function speak(text, rate) {
  return new Promise(res => {
    if (!synth) { toast('A böngésző nem támogatja a felolvasást'); return res(); }
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US'; u.rate = rate || +S.rate;
    const v = voices.find(v => v.name === S.voice) || voices[0]; if (v) u.voice = v;
    u.onend = u.onerror = () => res();
    try { synth.speak(u); } catch (e) { return res(); }
    setTimeout(res, 8000);
  });
}

// ---------- speech recognition ----------
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let activeRec = null;
function listen() {
  return new Promise((res, rej) => {
    if (!SR) return rej(new Error('unsupported'));
    if (activeRec) try { activeRec.abort(); } catch {}
    const r = new SR(); activeRec = r;
    r.lang = 'en-US'; r.maxAlternatives = 5; r.interimResults = false; r.continuous = false;
    let got = false;
    r.onresult = e => { got = true; const alts = []; for (const a of e.results[0]) alts.push(a.transcript); res(alts); };
    r.onerror = e => rej(new Error(e.error || 'error'));
    r.onend = () => { activeRec = null; if (!got) rej(new Error('no-speech')); };
    try { r.start(); } catch (e) { rej(e); }
  });
}
const CONTR = { "i'm": 'i am', "you're": 'you are', "it's": 'it is', "don't": 'do not', "can't": 'can not', "cannot": 'can not', "i'll": 'i will', "you'll": 'you will', "i'd": 'i would', "let's": 'let us', "that's": 'that is', "what's": 'what is', "how's": 'how is', "where's": 'where is' };
const NUMS = { 0: 'zero', 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten', 12: 'twelve', 13: 'thirteen', 20: 'twenty', 30: 'thirty', 100: 'one hundred' };
function norm(s) {
  return s.toLowerCase().replace(/[’`]/g, "'").replace(/\.\.\./g, ' ').split(/\s+/).map(w => w.replace(/[^a-z0-9']/g, '')).filter(Boolean)
    .map(w => CONTR[w] || NUMS[w] || w.replace(/'/g, '')).join(' ').replace(/\btv\b/g, 't v').split(' ').filter(Boolean);
}
function lev(a, b) {
  const m = a.length, n = b.length; if (!m || !n) return m || n;
  let p = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) { const c = [i]; for (let j = 1; j <= n; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); p = c; }
  return p[n];
}
function score(target, alts) {
  const tw = norm(target.split('/')[0]); let best = { score: 0, heard: alts[0] || '', hits: [] };
  for (const alt of alts) {
    const aw = norm(alt);
    const hits = tw.map(w => aw.some(x => x === w || (w.length > 3 && lev(x, w) <= 1)));
    const wordPart = hits.filter(Boolean).length / tw.length;
    const a = aw.join(' '), t = tw.join(' ');
    const charPart = 1 - lev(a, t) / Math.max(a.length, t.length, 1);
    const sc = Math.round(100 * (0.6 * wordPart + 0.4 * Math.max(0, charPart)));
    if (sc > best.score) best = { score: sc, heard: alt, hits };
  }
  if (!best.hits.length) best.hits = tw.map(() => false);
  best.words = tw; return best;
}
function feedbackHTML(r) {
  const cls = r.score >= 80 ? 'good' : r.score >= 50 ? 'mid' : 'low';
  const msg = r.score >= 90 ? 'Kiváló! Nagyon érthető volt. 🎉' : r.score >= 80 ? 'Szép munka, érthető!' : r.score >= 50 ? 'Majdnem! Figyelj a pirossal jelölt szavakra.' : 'Próbáld újra, lassabban és tisztán. Hallgasd meg előtte még egyszer.';
  const words = r.words.map((w, i) => `<span class="${r.hits[i] ? 'w-ok' : 'w-miss'}">${esc(w)}</span>`).join(' ');
  return { cls, html: `<div class="score">${r.score}%</div><div>${msg}</div><div class="small">Cél: ${words}</div><div class="small muted">Ezt hallottam: „${esc(r.heard)}”</div>` };
}
const srErr = e => ({ 'not-allowed': 'A mikrofon hozzáférés tiltva. Engedélyezd a böngészőben (https vagy localhost kell).', 'no-speech': 'Nem hallottam semmit. Próbáld újra, közelebb a mikrofonhoz.', 'network': 'A beszédfelismeréshez internet kell (Chrome).', 'audio-capture': 'Nem található mikrofon.' }[e.message] || 'Hiba a felismerésnél: ' + e.message);

// Speak-check widget: returns HTML and binder. onResult(good:boolean)
function sayWidget(target, onResult) {
  const id = 'sw' + Math.random().toString(36).slice(2, 7);
  const html = SR
    ? `<div class="row center"><button class="btn mic" id="${id}m" data-key="m">🎤 Mondd ki</button></div><div class="feedback" id="${id}f" aria-live="polite"></div>`
    : `<p class="small muted center" style="text-align:center">Mondd ki hangosan, majd értékeld magad:</p><div class="row center"><button class="btn ok" id="${id}g">👍 Jó volt</button><button class="btn ghost" id="${id}b">🔁 Még gyakorolom</button></div><div class="feedback" id="${id}f"></div>`;
  const bind = () => {
    const f = $('#' + id + 'f');
    if (!SR) {
      $('#' + id + 'g').onclick = () => { f.className = 'feedback good'; f.textContent = 'Szuper! 👍'; onResult(true, 100); };
      $('#' + id + 'b').onclick = () => { f.className = 'feedback mid'; f.textContent = 'Rendben, ismételjük még.'; onResult(false, 0); };
      return;
    }
    const m = $('#' + id + 'm');
    m.onclick = async () => {
      if (m.classList.contains('rec')) { activeRec && activeRec.stop(); return; }
      synth && synth.cancel();
      m.classList.add('rec'); m.textContent = '⏺ Figyelek... (kattints a leállításhoz)';
      try { const r = score(target, await listen()); const fb = feedbackHTML(r); f.className = 'feedback ' + fb.cls; f.innerHTML = fb.html; onResult(r.score >= 80, r.score); }
      catch (e) { f.className = 'feedback low'; f.textContent = srErr(e); }
      finally { m.classList.remove('rec'); m.textContent = '🎤 Mondd ki újra'; }
    };
  };
  return { html, bind };
}

// ---------- views ----------
let keyHandler = null;
const views = {};
function go(v, arg) {
  synth && synth.cancel(); keyHandler = null;
  document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('active', b.dataset.go === v));
  main.style.animation = 'none'; main.offsetHeight; main.style.animation = '';
  views[v](arg); location.hash = v; window.scrollTo(0, 0);
}
const levelSwitch = () => `<div class="row" role="group" aria-label="Szint">${Object.entries(LEVELS).map(([k, n]) => `<button class="btn ${S.level === k ? 'primary' : 'ghost'}" data-level="${k}">${n}</button>`).join('')}</div>`;
function bindLevel(again) { main.querySelectorAll('[data-level]').forEach(b => b.onclick = () => { S.level = b.dataset.level; saveS(); again(); }); }
function catPicker(title, desc, onPick, extra = '', redo) {
  main.innerHTML = `<h1>${title}</h1><p class="muted">${desc}</p>${levelSwitch()}<div style="height:12px"></div>${extra}<div class="grid">${levelCats().map(c => `<button class="cat" data-c="${c.id}"><span class="ic">${c.icon}</span><b>${esc(c.name)}</b><span class="small muted">${c.items.length} kifejezés · ${mastery(c.id)}%</span><div class="bar"><i style="width:${mastery(c.id)}%"></i></div></button>`).join('')}</div>`;
  bindLevel(redo || (() => catPicker(title, desc, onPick, extra)));
  main.querySelectorAll('[data-c]').forEach(b => b.onclick = () => onPick(b.dataset.c));
}

views.home = () => {
  const { n, lvl } = level();
  const due = ALL.filter(i => P.items[i.key] && P.items[i.key].due <= Date.now() && P.items[i.key].box < 5).length;
  main.innerHTML = `
  <section class="panel"><h1>Szia! 👋 Gyakoroljunk beszédet.</h1>
  <p class="muted">Rövid, napi 10 perces gyakorlás: hallgasd meg, mondd ki hangosan, ismételd. Nincsenek életek, nincs stressz, csak kiejtés és szókincs.</p>
  <div class="row"><button class="btn primary" data-go="drill">🔁 Napi drill indítása${due ? ` (${due} esedékes)` : ''}</button><button class="btn" data-go="learn">📇 Új szavak tanulása</button></div></section>
  <div class="stats"><div class="stat"><b>${n}</b><span class="small muted">megtanult</span></div><div class="stat"><b>${P.streak || 0}</b><span class="small muted">nap sorozat</span></div><div class="stat"><b>${lvl}</b><span class="small muted">szint (${P.points} pont)</span></div></div>
  <h2>Témák</h2>${levelSwitch()}<div style="height:10px"></div>
  <div class="grid">${levelCats().map(c => `<button class="cat" data-c="${c.id}"><span class="ic">${c.icon}</span><b>${esc(c.name)}</b><span class="small muted">${catItems(c.id).filter(learned).length}/${c.items.length} megy már</span><div class="bar"><i style="width:${mastery(c.id)}%"></i></div></button>`).join('')}</div>
  <p class="small muted" style="margin-top:16px">Tipp: egy szó akkor számít megtanultnak, ha többször, különböző napokon is jól kimondtad.</p>`;
  bindLevel(views.home);
  main.querySelectorAll('[data-c]').forEach(b => b.onclick = () => go('learn', b.dataset.c));
};

function itemFront(i) { return `<div class="word">${esc(i.en)}</div>${S.ipa ? `<div class="ipa">${esc(i.ipa)}</div>` : ''}<div class="resp" title="Magyaros kiejtési segítség">🗣 ${esc(i.resp)}</div>`; }

views.learn = (cat) => {
  if (!cat) return catPicker('📇 Tanulás', 'Válassz témát. Kártyák: hallgasd meg, fordítsd meg, mondd ki.', c => views.learn(c));
  const items = catItems(cat); const C = CATEGORIES.find(c => c.id === cat); let idx = 0;
  const render = () => {
    const i = items[idx]; const sw = sayWidget(i.en, good => { if (good) { grade(i, true); toast('+2 pont'); } });
    main.innerHTML = `<div class="row"><button class="btn ghost" id="back">← Témák</button><b>${C.icon} ${esc(C.name)}</b><span class="muted small" style="margin-left:auto">${idx + 1} / ${items.length}</span></div>
    <div class="bar"><i style="width:${100 * (idx + 1) / items.length}%"></i></div>
    <div class="flash-wrap"><div class="flash" id="card" tabindex="0" role="button" aria-label="Kártya megfordítása">
      <div class="face front">${itemFront(i)}<div class="small muted" style="margin-top:14px">Koppints a fordításért (Szóköz)</div></div>
      <div class="face back"><div class="hu">${esc(i.hu)}</div><div class="word" style="font-size:1.3rem;margin-top:8px">${esc(i.en)}</div>${i.tip ? `<div class="tip">💡 ${esc(i.tip)}</div>` : ''}</div></div></div>
    <div class="row center"><button class="btn" id="prev" aria-label="Előző">←</button><button class="btn primary" id="play">🔊 Meghallgatom</button><button class="btn" id="slow">🐢 Lassan</button><button class="btn" id="next" aria-label="Következő">→</button></div>
    <div class="panel" style="margin-top:14px">${sw.html}</div>`;
    sw.bind();
    const card = $('#card'); card.onclick = () => card.classList.toggle('flipped');
    $('#play').onclick = () => speak(i.en); $('#slow').onclick = () => speak(i.en, 0.6);
    $('#prev').onclick = () => { idx = (idx - 1 + items.length) % items.length; render(); };
    $('#next').onclick = () => { rec(i.key); saveP(); idx = (idx + 1) % items.length; render(); };
    $('#back').onclick = () => views.learn();
    if (S.auto) speak(i.en);
  };
  keyHandler = e => { if (e.key === ' ') { $('#card').click(); return true; } if (e.key === 'ArrowRight') { $('#next').click(); return true; } if (e.key === 'ArrowLeft') { $('#prev').click(); return true; } if (e.key === 'Enter' || e.key === 'p') { $('#play').click(); return true; } if (e.key === 'm') { $('.mic')?.click(); return true; } };
  render();
};

views.drill = (scope) => {
  if (!scope) {
    const due = ALL.filter(i => P.items[i.key] && P.items[i.key].due <= Date.now() && P.items[i.key].box < 5);
    return catPicker('🔁 Drill', 'Ismétlő gyakorlás: hallgasd meg, ismételd el, ellenőrizzük. Egy szó addig marad a körben, amíg kétszer egymás után jól nem mondod. A jól tudott szavak ritkábban jönnek elő (Leitner-dobozok).',
      c => views.drill(c), `<div class="panel" style="margin-bottom:12px"><div class="row"><button class="btn primary" id="dueBtn" ${due.length ? '' : 'disabled'}>Esedékes ismétlések (${due.length})</button><button class="btn" id="mixBtn">🎲 Vegyes kör (${LEVELS[S.level]})</button></div><div class="boxes">${[1, 2, 3, 4, 5].map(b => `<span><b>${ALL.filter(i => P.items[i.key]?.box === b).length}</b>${b}. doboz</span>`).join('')}</div></div>`, () => views.drill()),
      $('#dueBtn').onclick = () => views.drill({ list: shuffle(due).slice(0, 12) }),
      $('#mixBtn').onclick = () => views.drill({ list: shuffle(ALL.filter(i => levelCats().some(c => c.id === i.cat))).sort((a, b) => (P.items[a.key]?.box || 0) - (P.items[b.key]?.box || 0)).slice(0, 10) });
  }
  let list = typeof scope === 'string' ? shuffle(catItems(scope)).sort((a, b) => (P.items[a.key]?.box || 0) - (P.items[b.key]?.box || 0)).slice(0, 10) : scope.list;
  const queue = list.map(i => ({ i, streak: 0 })); const NEED = 2; let done = 0; const total = queue.length;
  const render = () => {
    if (!queue.length) { main.innerHTML = `<div class="panel" style="text-align:center"><h1>🎉 Kör vége!</h1><p>${total} kifejezést gyakoroltál. Holnap a rendszer visszahozza, amit érdemes ismételni.</p><div class="row center"><button class="btn primary" id="again">Új kör</button><button class="btn" data-go="home">Főoldal</button></div></div>`; $('#again').onclick = () => views.drill(); return; }
    const q = queue[0], i = q.i;
    const sw = sayWidget(i.en, good => {
      grade(i, good);
      if (good) q.streak++; else q.streak = 0;
      $('#dots').innerHTML = dots(q.streak);
      $('#nextD').hidden = false; $('#nextD').focus();
    });
    const dots = s => Array.from({ length: NEED }, (_, k) => `<i class="${k < s ? 'on' : ''}"></i>`).join('');
    main.innerHTML = `<div class="row"><button class="btn ghost" id="back">← Vissza</button><span class="muted small" style="margin-left:auto">Kész: ${done} / ${total} · maradt: ${queue.length}</span></div>
    <div class="bar"><i style="width:${100 * done / total}%"></i></div>
    <div class="panel" style="text-align:center;margin-top:14px"><div class="small muted">1. Hallgasd meg · 2. Ismételd · 3. Ellenőrzés</div>
    <div style="margin:14px 0">${itemFront(i)}<div class="muted" style="margin-top:6px">${esc(i.hu)}</div>${i.tip ? `<div class="tip">💡 ${esc(i.tip)}</div>` : ''}</div>
    <div class="row center"><button class="btn primary" id="play">🔊 Meghallgatom</button><button class="btn" id="slow">🐢 Lassan</button></div>
    <div style="margin-top:12px">${sw.html}</div><div class="dots" id="dots" title="Egymás utáni helyes kimondások">${dots(q.streak)}</div>
    <div class="row center" style="margin-top:12px"><button class="btn" id="nextD" hidden>Tovább →</button></div></div>`;
    sw.bind();
    $('#play').onclick = () => speak(i.en); $('#slow').onclick = () => speak(i.en, 0.6);
    $('#back').onclick = () => views.drill();
    $('#nextD').onclick = () => { queue.shift(); if (q.streak >= NEED) done++; else queue.splice(Math.min(2, queue.length), 0, q); render(); };
    speak(i.en);
  };
  keyHandler = e => { if (e.key === 'Enter' || e.key === 'p') { $('#play')?.click(); return true; } if (e.key === 'm') { $('.mic')?.click(); return true; } if (e.key === 'ArrowRight' && $('#nextD') && !$('#nextD').hidden) { $('#nextD').click(); return true; } };
  render();
};

views.quiz = () => {
  const pool = ALL.filter(i => levelCats().some(c => c.id === i.cat));
  let n = 0, right = 0; const N = 10;
  const render = () => {
    if (n >= N) { main.innerHTML = `<div class="panel" style="text-align:center"><h1>Eredmény: ${right} / ${N}</h1><p class="muted">${right >= 8 ? 'Nagyon jó füled van! 👂' : 'Gyakorlással egyre jobb lesz.'}</p><div class="row center"><button class="btn primary" id="again">Újra</button></div></div>`; $('#again').onclick = views.quiz; return; }
    const mode = n % 2 ? 'word' : 'meaning';
    const t = pool[Math.random() * pool.length | 0];
    const opts = shuffle([t, ...shuffle(pool.filter(x => x.key !== t.key && x.hu !== t.hu)).slice(0, 3)]);
    main.innerHTML = `<h1>🎧 Hallgat és válassz</h1>${levelSwitch()}<div class="bar" style="margin-top:10px"><i style="width:${100 * n / N}%"></i></div>
    <div class="panel" style="text-align:center;margin-top:12px"><p class="muted">${mode === 'meaning' ? 'Mit jelent, amit hallasz?' : 'Melyik angol kifejezést hallod?'}</p>
    <div class="row center"><button class="btn primary" id="play" style="font-size:1.2rem">🔊 Lejátszás</button><button class="btn" id="slow">🐢</button></div>
    <div class="opts">${opts.map((o, k) => `<button class="opt" data-k="${o.key}"><span class="muted small">${k + 1}.</span> ${esc(mode === 'meaning' ? o.hu : o.en)}</button>`).join('')}</div>
    <div class="feedback" id="qf"></div><div class="row center" style="margin-top:10px"><button class="btn" id="qn" hidden>Tovább →</button></div></div>`;
    bindLevel(views.quiz);
    $('#play').onclick = () => speak(t.en); $('#slow').onclick = () => speak(t.en, 0.6);
    let answered = false;
    main.querySelectorAll('.opt').forEach(b => b.onclick = () => {
      if (answered) return; answered = true; const ok = b.dataset.k === t.key; if (ok) { right++; P.points += 1; markActive(); saveP(); }
      main.querySelectorAll('.opt').forEach(x => x.classList.toggle('right', x.dataset.k === t.key));
      if (!ok) b.classList.add('wrong');
      const f = $('#qf'); f.className = 'feedback ' + (ok ? 'good' : 'low'); f.innerHTML = `${ok ? '✅ Helyes!' : '❌ Nem egészen.'} <b>${esc(t.en)}</b> = ${esc(t.hu)} <span class="ipa">${esc(t.ipa)}</span>`;
      $('#qn').hidden = false; $('#qn').focus();
    });
    $('#qn').onclick = () => { n++; render(); };
    speak(t.en);
  };
  keyHandler = e => { const k = +e.key; if (k >= 1 && k <= 4) { main.querySelectorAll('.opt')[k - 1]?.click(); return true; } if (e.key === 'Enter' && !$('#qn').hidden) { $('#qn').click(); return true; } if (e.key === 'p') { $('#play').click(); return true; } };
  render();
};

views.pairs = () => {
  let idx = 0, mode = 'list';
  const render = () => {
    const [a, b, ia, ib, tip] = MINIMAL_PAIRS[idx];
    const target = Math.random() < .5 ? a : b;
    const swA = sayWidget(a, () => {}), swB = sayWidget(b, () => {});
    main.innerHTML = `<h1>👂 Hangpárok (minimal pairs)</h1><p class="muted">Ezek a szavak csak egy hangban különböznek. A magyar fülnek nehéz, de gyakorlással megy!</p>
    <div class="row"><span class="muted small">${idx + 1} / ${MINIMAL_PAIRS.length}</span><button class="btn ghost" id="pp" style="margin-left:auto">←</button><button class="btn ghost" id="pn">→</button></div>
    <div class="pair" style="margin-top:10px">${[[a, ia, swA], [b, ib, swB]].map(([w, ip, sw], k) => `<div class="panel" style="text-align:center"><div class="word">${esc(w)}</div><div class="ipa">${esc(ip)}</div><div class="row center" style="margin:8px 0"><button class="btn" data-say="${esc(w)}">🔊</button><button class="btn" data-slow="${esc(w)}">🐢</button></div>${sw.html}</div>`).join('')}</div>
    <div class="tip">💡 ${esc(tip)}</div>
    <div class="panel" style="margin-top:12px;text-align:center"><b>Füledzés:</b> melyiket hallod?<div class="row center" style="margin-top:8px"><button class="btn primary" id="pq">🔊 Titkos szó</button><button class="btn" data-pick="${esc(a)}">${esc(a)}</button><button class="btn" data-pick="${esc(b)}">${esc(b)}</button></div><div class="feedback" id="pf"></div></div>`;
    swA.bind(); swB.bind();
    main.querySelectorAll('[data-say]').forEach(x => x.onclick = () => speak(x.dataset.say));
    main.querySelectorAll('[data-slow]').forEach(x => x.onclick = () => speak(x.dataset.slow, 0.55));
    $('#pq').onclick = () => speak(target);
    main.querySelectorAll('[data-pick]').forEach(x => x.onclick = () => { const ok = x.dataset.pick === target; const f = $('#pf'); f.className = 'feedback ' + (ok ? 'good' : 'low'); f.textContent = ok ? `✅ Igen, ez „${target}” volt!` : `❌ Ez „${target}” volt. Hallgasd meg mindkettőt újra.`; if (ok) { P.points++; markActive(); saveP(); } });
    $('#pp').onclick = () => { idx = (idx - 1 + MINIMAL_PAIRS.length) % MINIMAL_PAIRS.length; render(); };
    $('#pn').onclick = () => { idx = (idx + 1) % MINIMAL_PAIRS.length; render(); };
  };
  keyHandler = e => { if (e.key === 'ArrowRight') { $('#pn').click(); return true; } if (e.key === 'ArrowLeft') { $('#pp').click(); return true; } if (e.key === 'p' || e.key === 'Enter') { $('#pq').click(); return true; } };
  render();
};

views.dialog = (d) => {
  if (d === undefined) {
    main.innerHTML = `<h1>💬 Gyors kifejezések, párbeszédek</h1><p class="muted">Rövid, valós helyzetek. Hallgasd meg az egészet, aztán mondd el te a „B” szerepet.</p><div class="grid">${DIALOGUES.map((x, k) => `<button class="cat" data-d="${k}"><span class="ic">💬</span><b>${esc(x.title)}</b><span class="small muted">${x.lines.length} mondat</span></button>`).join('')}</div>`;
    main.querySelectorAll('[data-d]').forEach(b => b.onclick = () => views.dialog(+b.dataset.d)); return;
  }
  const D = DIALOGUES[d]; let showHu = true;
  const render = () => {
    const ws = D.lines.map(l => l[0] === 'B' ? sayWidget(l[1], g => { if (g) { P.points += 2; markActive(); saveP(); } }) : null);
    main.innerHTML = `<div class="row"><button class="btn ghost" id="back">← Párbeszédek</button><h2 style="margin:0 8px">${esc(D.title)}</h2></div>
    <div class="row" style="margin:10px 0"><button class="btn primary" id="all">▶️ Teljes párbeszéd</button><button class="btn ghost" id="hu">${showHu ? 'Fordítás elrejtése' : 'Fordítás mutatása'}</button></div>
    ${D.lines.map((l, k) => `<div class="line ${l[0]}"><div class="who">${l[0]}</div><div class="bubble"><b>${esc(l[1])}</b>${showHu ? `<div class="small muted">${esc(l[2])}</div>` : ''}<div class="row"><button class="btn" data-l="${k}">🔊</button><button class="btn" data-ls="${k}">🐢</button></div>${ws[k] ? `<div style="margin-top:6px"><span class="small muted">A te sorod:</span>${ws[k].html}</div>` : ''}</div></div>`).join('')}`;
    ws.forEach(w => w && w.bind());
    main.querySelectorAll('[data-l]').forEach(b => b.onclick = () => speak(D.lines[b.dataset.l][1]));
    main.querySelectorAll('[data-ls]').forEach(b => b.onclick = () => speak(D.lines[b.dataset.ls][1], 0.6));
    $('#all').onclick = async () => { for (const l of D.lines) { await speak(l[1]); await new Promise(r => setTimeout(r, 350)); } };
    $('#hu').onclick = () => { showHu = !showHu; render(); };
    $('#back').onclick = () => views.dialog();
  };
  render();
};

// ---------- global UI ----------
function applyTheme() { const t = S.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); document.documentElement.dataset.theme = t; }
applyTheme(); updStreak();
$('#themeBtn').onclick = () => { S.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; saveS(); applyTheme(); };
document.addEventListener('click', e => { const g = e.target.closest('[data-go]'); if (g) go(g.dataset.go); });
$('.brand').onkeydown = e => { if (e.key === 'Enter') go('home'); };
const dlg = $('#settings');
$('#settingsBtn').onclick = () => { $('#rateSel').value = String(S.rate); $('#autoPlay').checked = S.auto; $('#showIpa').checked = S.ipa; dlg.showModal ? dlg.showModal() : dlg.setAttribute('open', ''); };
$('#voiceSel').onchange = e => { S.voice = e.target.value; saveS(); };
$('#rateSel').onchange = e => { S.rate = +e.target.value; saveS(); };
$('#autoPlay').onchange = e => { S.auto = e.target.checked; saveS(); };
$('#showIpa').onchange = e => { S.ipa = e.target.checked; saveS(); };
$('#testVoice').onclick = () => speak('Hello! Nice to meet you. How much is this?');
$('#resetBtn').onclick = () => { if (confirm('Biztosan törlöd az összes haladást?')) { P = { items: {}, points: 0, streak: 0, lastDay: null }; saveP(); updStreak(); toast('Haladás nullázva'); go('home'); } };
$('#exportBtn').onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(P, null, 1)], { type: 'application/json' })); a.download = 'sayit-haladas-' + today() + '.json'; a.click(); };
$('#importFile').onchange = async e => { try { const d = JSON.parse(await e.target.files[0].text()); if (!d.items) throw 0; P = d; saveP(); updStreak(); toast('Haladás betöltve ✅'); go('home'); } catch { toast('Hibás fájl'); } };
document.addEventListener('keydown', e => {
  if (e.target.closest('input,select,textarea,dialog') || e.ctrlKey || e.metaKey || e.altKey) return;
  if (keyHandler && keyHandler(e)) e.preventDefault();
});
const notes = [];
if (!SR) notes.push('Ez a böngésző nem támogatja a beszédfelismerést (pl. Firefox). Használj Chrome-ot, Edge-et vagy Safarit a kiejtés-ellenőrzéshez. Addig „hallgasd és ismételd” módban, önértékeléssel gyakorolhatsz.');
if (!synth) notes.push('A felolvasás (szövegfelolvasó) nem érhető el ebben a böngészőben.');
if (location.protocol === 'file:') notes.push('Fájlként megnyitva a mikrofon tiltva lehet. Indítsd helyi szerverrel (lásd README).');
if (notes.length) { const b = $('#banner'); b.hidden = false; b.innerHTML = notes.map(esc).join('<br>'); }
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
go(views[location.hash.slice(1)] ? location.hash.slice(1) : 'home');
})();
