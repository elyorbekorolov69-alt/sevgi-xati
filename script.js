// ====== SOZLAMALAR: faqat shu yerni to'ldiring ======
const CONFIG = {
  herName: "",     // uning ismi (bo'sh qolsa, ko'rsatilmaydi)
  telegram: "Urolov20_05",    // Telegram username, @ belgisiz. Masalan: "elyor123"
  telegramText: "Assalomu alaykum, maktubingizni oldim",  // Telegram chatida tayyor turadigan yozuv (bo'sh qolsa, chat bo'sh ochiladi)
  instagram: ""    // Instagram username, @ belgisiz. Masalan: "elyor.123"
};
// =====================================================

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const dpr = Math.min(window.devicePixelRatio || 1, 2);

/* ---------- Ism va kontaktlar ---------- */
if (CONFIG.herName) $$(".her").forEach((el) => (el.textContent = ", " + CONFIG.herName));

(function renderContacts() {
  const html = [];
  if (CONFIG.telegram) {
    const q = CONFIG.telegramText ? "?text=" + encodeURIComponent(CONFIG.telegramText) : "";
    html.push(`<a href="https://t.me/${encodeURIComponent(CONFIG.telegram)}${q}" target="_blank" rel="noopener">Telegram orqali yozish</a>`);
  }
  if (CONFIG.instagram) html.push(`<a class="insta" href="https://instagram.com/${encodeURIComponent(CONFIG.instagram)}" target="_blank" rel="noopener">Instagram profilim</a>`);
  if (!html.length) html.push(`<p class="small">Menga ishxonada aytsangiz ham bo&#8216;ladi &#128578;</p>`);
  $$("[data-contacts]").forEach((el) => (el.innerHTML = html.join("")));
})();

/* ---------- Bosqichlar ---------- */
function go(id) {
  $$(".stage").forEach((s) => s.classList.remove("active"));
  $("#" + id).classList.add("active");
  if (id === "s2") startLoading();
  if (id === "s3") startQuiz();
}
$$("[data-next]").forEach((b) => b.addEventListener("click", () => go(b.dataset.next)));

/* ---------- Boshlanish: eshik, kabutar, sahifa ---------- */
$("#start").addEventListener("click", () => {
  $("#gate").hidden = true;
  DoveIntro.run((x, y) => {
    const b = $("#bloom");
    b.style.setProperty("--fx", x + "px");
    b.style.setProperty("--fy", y + "px");
    b.classList.remove("go");
    void b.offsetWidth;
    b.classList.add("go");
    if (!reduceMotion) {
      document.body.classList.remove("shake");
      void document.body.offsetWidth;
      document.body.classList.add("shake");
      burst(x, y, 130, 40);
    }
    $("#page").hidden = false;
    scrollTo(0, 0);
  });
});

/* ---------- Jasorat yuklanmoqda ---------- */
let loadTimer = null;
function startLoading() {
  clearInterval(loadTimer);
  const bar = $("#bar"), pct = $("#pct"), msg = $("#load-msg"), next = $("#load-next");
  next.hidden = true;
  msg.innerHTML = "";
  let v = 0, stalled = false;
  const set = (n) => { v = n; bar.style.width = n + "%"; pct.textContent = Math.round(n) + "%"; };
  set(0);
  loadTimer = setInterval(() => {
    if (stalled) return;
    set(Math.min(87, v + 1 + Math.random() * 2));
    const steps = [[10, "Salom aytish mashq qilinyapti..."], [28, "Biroz ikkilanish topildi..."], [48, "Ovoz ravonlashtirilyapti..."], [68, "Yuragim tez ura boshladi..."], [80, "Oxirgi tayyorgarlik..."]];
    for (const [at, text] of steps) if (v >= at) msg.innerHTML = text;
    if (v >= 87) {
      stalled = true;
      msg.innerHTML = "Qolgan 13% kelmayapti &#128517;";
      setTimeout(() => {
        set(100);
        msg.innerHTML = "Mayli, baribir aytaman!";
        next.hidden = false;
        clearInterval(loadTimer);
      }, 1800);
    }
  }, 90);
}

/* ---------- Hazilli savollar ---------- */
const QUIZ = [
  { q: "Ishxonada eng yaxshi payt qaysi?", a: ["Choy tanaffusi &#9749;", "Maosh kuni &#128516;", "Dam olish kuni yaqinlashganda"], r: ["Choy tanaffusini hech kim yomon ko'rmaydi", "Bu javobga hamma qo'shiladi", "Juma kuni soat 17:00 &#128513;"] },
  { q: "Suhbatda sizga nima yoqadi?", a: ["Samimiylik", "Yengil hazil", "Ikkalasi ham"], r: ["Men ham shunday o'ylayman", "Hazilga hazil bilan javob beraman &#128521;", "Demak, til topishamiz"] },
  { q: "Dushanba ertalab qanday kayfiyatda bo'lasiz?", a: ["Hali uyquda &#128564;", "Choy bo'lsa tirilaman &#9749;", "Dushanbani yaxshi ko'raman"], r: ["Hammamiz bir qayiqdamiz &#128516;", "Choy ishxonaning yoqilg'isi", "Siz noyob odamsiz &#128563;"] },
  { q: "Ishxonada kompyuter qotib qolsa, nima qilasiz?", a: ["Sabr bilan kutaman", "Qayta yoqaman", "Yordam so'rayman"], r: ["Sabr qilgan murodiga yetadi &#128522;", "Eng sinalgan usul &#128514;", "Yordam so'rash aqlli ish"] },
  { q: "Telefoningizda nechta o'qilmagan xabar bor?", a: ["Nolta, tartibliman", "Yigirmatacha", "Sanashdan qo'rqaman"], r: ["Menga ham o'rgating &#128517;", "Men ham shunga yaqinman", "Sanamang, yaxshisi &#128514;"] },
  { q: "Bu sahifani yasash qancha vaqt oldi deb o'ylaysiz?", a: ["Bir daqiqa", "Bir kecha", "Butun hafta"], r: ["Kaş shunchalik tez bo'lsa &#128516;", "Juda yaqin topdingiz", "Deyarli shunday, sabringiz uchun rahmat &#128522;"] },
  { q: "Sahifa shu yergacha yoqdimi?", a: ["Ha, yoqdi", "Ozgina kulgim keldi", "Davom eting-chi"], r: ["Xursand bo'ldim &#128522;", "Maqsad ham shu edi &#128516;", "Oz qoldi, sabr qiling"] }
];
let qi = 0;
function startQuiz() { qi = 0; showQuestion(); }
function showQuestion() {
  const item = QUIZ[qi];
  $("#progress").innerHTML = QUIZ.map((_, i) => `<i class="${i <= qi ? "on" : ""}"></i>`).join("");
  $("#q-title").innerHTML = item.q;
  $("#q-reaction").innerHTML = "";
  const box = $("#q-options");
  box.innerHTML = "";
  item.a.forEach((text, idx) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn";
    b.innerHTML = text;
    b.addEventListener("click", () => {
      $$("#q-options .btn").forEach((x) => (x.disabled = true));
      b.classList.add("picked");
      $("#q-reaction").innerHTML = item.r[idx];
      setTimeout(() => {
        qi++;
        if (qi < QUIZ.length) showQuestion();
        else go("s4");
      }, 1400);
    });
    box.appendChild(b);
  });
}

/* ---------- Baholash ---------- */
(function rating() {
  const wrap = $("#stars"), msg = $("#star-msg"), next = $("#star-next");
  const btns = [...wrap.querySelectorAll("button")];
  const paint = (n) => btns.forEach((b, i) => b.classList.toggle("on", i < n));
  btns.forEach((b) => {
    b.addEventListener("mouseenter", () => { if (!wrap.classList.contains("locked")) paint(+b.dataset.v); });
    b.addEventListener("click", () => {
      const v = +b.dataset.v;
      wrap.classList.add("locked");
      paint(v);
      if (v === 5) {
        msg.innerHTML = "Rahmat, xursand bo'ldim &#128522;";
        next.hidden = false;
        return;
      }
      msg.innerHTML = v === 4
        ? "4? Bitta yulduzcha yetishmayotgan ekan, qo'shib qo'ydim &#128516;"
        : "Bu xatolik bo'lsa kerak, 5 ga to'g'rilab qo'ydim &#128517;";
      let n = v;
      const t = setInterval(() => {
        n++;
        paint(n);
        if (n >= 5) { clearInterval(t); next.hidden = false; }
      }, 350);
    });
  });
})();

/* ---------- Asosiy savol: qochuvchi "Yo'q" ---------- */
const yes = $("#yes"), no = $("#no"), hint = $("#no-hint");
const THINK = [
  "Yaxshilab o'ylab ko'ring &#129300;",
  "Bir marta ham o'ylab ko'rmadingiz-ku",
  "Yana bir bor o'ylab ko'ring",
  "Tugma ham ketvoldi &#128517;",
  "O'ylab ko'rish hech kimga zarar qilmagan",
  "Yana bir bor o'ylab ko'ring &#128522;"
];
let dodges = 0;
function dodge(e) {
  e.preventDefault();
  if (no.classList.contains("gone")) return;
  dodges++;
  no.innerHTML = "Yo'q";
  hint.innerHTML = THINK[(dodges - 1) % THINK.length];
  no.style.position = "fixed";
  const pad = 14, w = no.offsetWidth, h = no.offsetHeight;
  if (!no.dataset.moved) {
    // Tugma oqimdan chiqqanda boshqa elementlar siljib ketmasin
    const sp = document.createElement("span");
    sp.style.cssText = `display:inline-block;width:${w}px;height:${h}px`;
    no.parentNode.insertBefore(sp, no);
    no.dataset.moved = "1";
  }
  const sc = Math.min(1 + dodges * 0.07, 1.4);
  yes.style.transform = `scale(${sc})`;
  // "Ha" tugmasi (kattalashganini hisobga olib), kichik havola va musiqa tugmasi ustiga tushmasin
  const yr = yes.getBoundingClientRect();
  const cx = yr.left + yr.width / 2, cy = yr.top + yr.height / 2;
  const yw = (yes.offsetWidth * sc) / 2, yh = (yes.offsetHeight * sc) / 2;
  const avoid = [
    { left: cx - yw, right: cx + yw, top: cy - yh, bottom: cy + yh },
    $("#polite").getBoundingClientRect(),
    $("#music").getBoundingClientRect()
  ];
  const clash = (x, y) => avoid.some((r) => x < r.right + 12 && x + w > r.left - 12 && y < r.bottom + 12 && y + h > r.top - 12);
  let x = pad, y = pad;
  for (let i = 0; i < 60; i++) {
    x = pad + Math.random() * Math.max(10, innerWidth - w - pad * 2);
    y = pad + Math.random() * Math.max(10, innerHeight - h - pad * 2);
    if (!clash(x, y)) break;
  }
  no.style.left = x + "px";
  no.style.top = y + "px";
}
["pointerenter", "pointerdown", "click", "touchstart"].forEach((ev) => no.addEventListener(ev, dodge, { passive: false }));

yes.addEventListener("click", () => {
  go("s6");
  burst(innerWidth / 2, innerHeight * 0.55, 160, 40);
});
$("#polite").addEventListener("click", () => go("s8"));

/* ---------- Tushayotgan gul barglari ---------- */
const pc = $("#petals"), pctx = pc.getContext("2d");
let petals = [];
const PETAL_COLORS = ["#f7b6c4", "#ffd3dc", "#f9c2a5", "#ffe0cf", "#f2a0b4"];
function sizeCanvas(c, ctx) {
  c.width = innerWidth * dpr;
  c.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
function newPetal(any) {
  return { x: Math.random() * innerWidth, y: any ? Math.random() * innerHeight : -20, s: Math.random() * 6 + 5, v: Math.random() * 0.6 + 0.4, p: Math.random() * 6, c: PETAL_COLORS[(Math.random() * PETAL_COLORS.length) | 0] };
}
function initPetals() {
  sizeCanvas(pc, pctx);
  petals = Array.from({ length: Math.min(26, Math.round(innerWidth / 50)) }, () => newPetal(true));
}
function drawPetals(t) {
  pctx.clearRect(0, 0, innerWidth, innerHeight);
  for (const p of petals) {
    p.y += p.v;
    p.x += Math.sin(t / 900 + p.p) * 0.7 + 0.2;
    if (p.y > innerHeight + 20) Object.assign(p, newPetal(false));
    pctx.save();
    pctx.translate(p.x, p.y);
    pctx.rotate(Math.sin(t / 700 + p.p) * 1.2);
    pctx.scale(1, Math.abs(Math.cos(t / 600 + p.p)) * 0.7 + 0.3);
    pctx.fillStyle = p.c;
    pctx.beginPath();
    pctx.ellipse(0, 0, p.s, p.s * 0.55, 0, 0, 7);
    pctx.fill();
    pctx.restore();
  }
  if (!reduceMotion) requestAnimationFrame(drawPetals);
}
initPetals();
requestAnimationFrame(drawPetals);

/* ---------- Gul barglari va yuraklar portlashi ---------- */
const fc = $("#fx"), fctx = fc.getContext("2d");
sizeCanvas(fc, fctx);
addEventListener("resize", () => { initPetals(); sizeCanvas(fc, fctx); });
let parts = [], fxRunning = false;
const BURST_COLORS = ["#f7b6c4", "#ffd3dc", "#f9c2a5", "#fff0d2", "#e58a9e", "#f6c26b"];

function burst(x, y, n, hearts) {
  if (reduceMotion) return;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, v = Math.random() * 12 + 3;
    parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 5, g: 0.2, size: 6 + Math.random() * 7, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, c: BURST_COLORS[i % BURST_COLORS.length], heart: false, life: 0 });
  }
  for (let i = 0; i < hearts; i++) {
    const a = Math.random() * Math.PI * 2, v = Math.random() * 9 + 3;
    parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 6, g: 0.2, size: 16 + Math.random() * 12, rot: 0, vr: 0, heart: true, life: 0 });
  }
  if (!fxRunning) { fxRunning = true; requestAnimationFrame(fxLoop); }
}
function fxLoop() {
  fctx.clearRect(0, 0, innerWidth, innerHeight);
  parts = parts.filter((p) => p.y < innerHeight + 40 && p.life < 260);
  for (const p of parts) {
    p.vy += p.g; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life++;
    fctx.save();
    fctx.translate(p.x, p.y);
    fctx.rotate(p.rot);
    fctx.globalAlpha = Math.max(0, 1 - p.life / 260);
    if (p.heart) {
      fctx.font = p.size + "px serif";
      fctx.textAlign = "center";
      fctx.fillText("\u{1F497}", 0, 0);
    } else {
      fctx.fillStyle = p.c;
      fctx.beginPath();
      fctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, 7);
      fctx.fill();
    }
    fctx.restore();
  }
  if (parts.length) requestAnimationFrame(fxLoop);
  else fxRunning = false;
}

/* ---------- Yengil musiqa (tugma bilan yoqiladi) ---------- */
const musicBtn = $("#music");
let ac = null, master = null, chordTimer = null, chordIndex = 0;
const CHORDS = [[261.63, 329.63, 392], [220, 261.63, 329.63], [174.61, 220, 261.63], [196, 246.94, 293.66]];
function playChord() {
  const t = ac.currentTime;
  CHORDS[chordIndex % CHORDS.length].forEach((f) => {
    [f, f * 2].forEach((freq, k) => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = k ? "sine" : "triangle";
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(k ? 0.012 : 0.028, t + 1.3);
      g.gain.linearRampToValueAtTime(0, t + 4.4);
      o.connect(g).connect(master);
      o.start(t);
      o.stop(t + 4.5);
    });
  });
  chordIndex++;
}
musicBtn.addEventListener("click", () => {
  if (!ac) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ac = new AC();
    master = ac.createGain();
    master.gain.value = 0.9;
    master.connect(ac.destination);
  }
  if (chordTimer) {
    clearInterval(chordTimer);
    chordTimer = null;
    musicBtn.classList.remove("on");
    musicBtn.setAttribute("aria-label", "Musiqani yoqish");
  } else {
    ac.resume();
    playChord();
    chordTimer = setInterval(playChord, 4000);
    musicBtn.classList.add("on");
    musicBtn.setAttribute("aria-label", "Musiqani o'chirish");
  }
});
