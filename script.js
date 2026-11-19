// ====== SOZLAMALAR: faqat shu yerni to'ldiring ======
const CONFIG = {
  herName: "",     // uning ismi (bo'sh qolsa, ko'rsatilmaydi)
  telegram: "",    // Telegram username, @ belgisiz. Masalan: "elyor123"
  instagram: ""    // Instagram username, @ belgisiz. Masalan: "elyor.123"
};
// =====================================================

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

/* ---------- Ism ---------- */
if (CONFIG.herName) {
  $$(".her").forEach((el) => (el.textContent = ", " + CONFIG.herName));
}

/* ---------- Kontaktlar ---------- */
function renderContacts() {
  const html = [];
  if (CONFIG.telegram) {
    html.push(`<a href="https://t.me/${encodeURIComponent(CONFIG.telegram)}" target="_blank" rel="noopener">Telegram orqali yozish</a>`);
  }
  if (CONFIG.instagram) {
    html.push(`<a class="insta" href="https://instagram.com/${encodeURIComponent(CONFIG.instagram)}" target="_blank" rel="noopener">Instagram profilim</a>`);
  }
  if (!html.length) {
    html.push(`<p class="small">Menga ishxonada aytsangiz ham bo&#8216;ladi &#128578;</p>`);
  }
  $$("[data-contacts]").forEach((el) => (el.innerHTML = html.join("")));
}
renderContacts();

/* ---------- Bosqichlar ---------- */
function go(id) {
  $$(".stage").forEach((s) => s.classList.remove("active"));
  $("#" + id).classList.add("active");
  if (id === "s3") startQuiz();
}
$$("[data-next]").forEach((b) => b.addEventListener("click", () => go(b.dataset.next)));

/* ---------- Mini savollar ---------- */
const QUIZ = [
  { q: "Ishxonada choy yoki qahva?", a: ["Choy &#9749;", "Qahva", "Ikkalasi ham"], r: "Yozib qo'ydim &#128221;" },
  { q: "Dam olish kuni qanday o'tadi?", a: ["Uyda, tinch", "Oila bilan", "Sayr va yangi joylar"], r: "Yaxshi tanlov, bu menga yoqdi &#128522;" },
  { q: "Suhbatda sizga nima muhimroq?", a: ["Samimiylik", "Hazil", "Ikkalasi"], r: "Men uchun ham aynan shu &#128154;" }
];
let qi = 0;

function startQuiz() {
  qi = 0;
  showQuestion();
}

function showQuestion() {
  const item = QUIZ[qi];
  $("#progress").innerHTML = QUIZ.map((_, i) => `<i class="${i <= qi ? "on" : ""}"></i>`).join("");
  $("#q-title").innerHTML = item.q;
  $("#q-reaction").innerHTML = "";
  const box = $("#q-options");
  box.innerHTML = "";
  item.a.forEach((text) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn";
    b.innerHTML = text;
    b.addEventListener("click", () => {
      $$("#q-options .btn").forEach((x) => (x.disabled = true));
      b.classList.add("picked");
      $("#q-reaction").innerHTML = item.r;
      setTimeout(() => {
        qi++;
        if (qi < QUIZ.length) showQuestion();
        else go("s4");
      }, 1100);
    });
    box.appendChild(b);
  });
}

/* ---------- Asosiy savol: qochuvchi "Yo'q" ---------- */
const yes = $("#yes");
const no = $("#no");
const hint = $("#no-hint");
const NO_TEXTS = [
  "Yo'q",
  "Ishonchingiz komilmi?",
  "Bir o'ylab ko'ring &#129402;",
  "Tugma ham ketvoldi &#128517;",
  "Ushlab bo'lmaydi-ku",
  "Yana bir urinib ko'ring",
  "Men charchadim..."
];
let dodges = 0;

function dodge(e) {
  e.preventDefault();
  if (no.classList.contains("gone")) return;
  dodges++;
  no.innerHTML = NO_TEXTS[Math.min(dodges, NO_TEXTS.length - 1)];
  no.style.position = "fixed";
  const pad = 14;
  const w = no.offsetWidth;
  const h = no.offsetHeight;
  no.style.left = pad + Math.random() * Math.max(10, innerWidth - w - pad * 2) + "px";
  no.style.top = pad + Math.random() * Math.max(10, innerHeight - h - pad * 2) + "px";
  yes.style.transform = `scale(${Math.min(1 + dodges * 0.07, 1.4)})`;
  if (dodges >= 8) {
    no.classList.add("gone");
    hint.innerHTML = "&laquo;Yo'q&raquo; tugmasi dam olishga ketdi &#128564;";
  }
}
["pointerenter", "pointerdown", "click", "touchstart"].forEach((ev) => no.addEventListener(ev, dodge, { passive: false }));

yes.addEventListener("click", () => {
  go("s5");
  celebrate();
});
$("#think").addEventListener("click", () => go("s6"));

/* ---------- Yulduzli osmon ---------- */
const sc = $("#stars");
const sctx = sc.getContext("2d");
let stars = [];
let shoot = null;
const dpr = Math.min(window.devicePixelRatio || 1, 2);

function sizeCanvas(c, ctx) {
  c.width = innerWidth * dpr;
  c.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
function initStars() {
  sizeCanvas(sc, sctx);
  const n = Math.round((innerWidth * innerHeight) / 5500);
  stars = Array.from({ length: n }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: Math.random() * 1.4 + 0.3,
    p: Math.random() * Math.PI * 2,
    s: Math.random() * 0.02 + 0.005
  }));
}
function drawStars() {
  sctx.clearRect(0, 0, innerWidth, innerHeight);
  for (const s of stars) {
    s.p += s.s;
    const a = 0.45 + Math.sin(s.p) * 0.4;
    sctx.fillStyle = `rgba(255, 244, 214, ${a})`;
    sctx.beginPath();
    sctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    sctx.fill();
  }
  if (!shoot && Math.random() < 0.004) {
    shoot = { x: Math.random() * innerWidth * 0.8, y: Math.random() * innerHeight * 0.4, l: 0 };
  }
  if (shoot) {
    shoot.x += 9;
    shoot.y += 4;
    shoot.l += 1;
    const g = sctx.createLinearGradient(shoot.x, shoot.y, shoot.x - 70, shoot.y - 31);
    g.addColorStop(0, "rgba(255,241,194,.9)");
    g.addColorStop(1, "rgba(255,241,194,0)");
    sctx.strokeStyle = g;
    sctx.lineWidth = 2;
    sctx.beginPath();
    sctx.moveTo(shoot.x, shoot.y);
    sctx.lineTo(shoot.x - 70, shoot.y - 31);
    sctx.stroke();
    if (shoot.l > 40) shoot = null;
  }
  requestAnimationFrame(drawStars);
}
initStars();
drawStars();
addEventListener("resize", () => {
  initStars();
  sizeCanvas(fc, fctx);
});

/* ---------- Konfetti va yuraklar ---------- */
const fc = $("#fx");
const fctx = fc.getContext("2d");
sizeCanvas(fc, fctx);
let parts = [];
let fxRunning = false;
const COLORS = ["#e8c872", "#fff1c2", "#eaa6bd", "#ffd9e6", "#b9a7ff"];

function celebrate() {
  for (let i = 0; i < 160; i++) {
    const heart = Math.random() < 0.3;
    parts.push({
      x: innerWidth / 2 + (Math.random() - 0.5) * 80,
      y: innerHeight * 0.55,
      vx: (Math.random() - 0.5) * 12,
      vy: -Math.random() * 14 - 4,
      g: 0.22,
      size: heart ? 18 + Math.random() * 12 : 5 + Math.random() * 6,
      rot: Math.random() * 6,
      vr: (Math.random() - 0.5) * 0.3,
      c: COLORS[(Math.random() * COLORS.length) | 0],
      heart,
      life: 0
    });
  }
  if (!fxRunning) {
    fxRunning = true;
    requestAnimationFrame(fxLoop);
  }
}
function fxLoop() {
  fctx.clearRect(0, 0, innerWidth, innerHeight);
  parts = parts.filter((p) => p.y < innerHeight + 40 && p.life < 260);
  for (const p of parts) {
    p.vy += p.g;
    p.vx *= 0.99;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.life++;
    fctx.save();
    fctx.translate(p.x, p.y);
    fctx.rotate(p.rot);
    fctx.globalAlpha = Math.max(0, 1 - p.life / 260);
    if (p.heart) {
      fctx.font = p.size + "px serif";
      fctx.textAlign = "center";
      fctx.fillText("\u{1F49B}", 0, 0);
    } else {
      fctx.fillStyle = p.c;
      fctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    }
    fctx.restore();
  }
  if (parts.length) requestAnimationFrame(fxLoop);
  else fxRunning = false;
}

/* ---------- Yengil musiqa (tashqi fayl kerak emas) ---------- */
const musicBtn = $("#music");
let ac = null;
let master = null;
let chordTimer = null;
let chordIndex = 0;
const CHORDS = [
  [220, 261.63, 329.63],
  [174.61, 220, 261.63],
  [261.63, 329.63, 392],
  [196, 246.94, 293.66]
];

function playChord() {
  const t = ac.currentTime;
  CHORDS[chordIndex % CHORDS.length].forEach((f) => {
    [f, f * 2].forEach((freq, k) => {
      const o = ac.createOscillator();
      const g = ac.createGain();
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
