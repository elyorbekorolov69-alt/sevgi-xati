// Kabutar xat tashlaydi: uchib keladi, xat shamolda uchib tushadi, yerga qo'nadi va gullarga aylanadi.
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const $ = (id) => document.getElementById(id);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function el(tag, a, p) {
    const e = document.createElementNS(NS, tag);
    for (const k in a) e.setAttribute(k, a[k]);
    if (p) p.appendChild(e);
    return e;
  }

  /* ---------- Kabutar chizmasi (o'ngga qaraydi) ---------- */
  const bird = $("bird");
  const defs = el("defs", {}, bird);
  function grad(id, stops, x2 = "0", y2 = "1") {
    const g = el("linearGradient", { id, x1: "0", y1: "0", x2, y2 }, defs);
    stops.forEach(([o, c]) => el("stop", { offset: o, "stop-color": c }, g));
  }
  grad("fNear", [[0, "#ffffff"], [0.7, "#eef1f7"], [1, "#cfd6e3"]]);
  grad("fTip", [[0, "#f3f5fa"], [0.65, "#d8dee9"], [1, "#8f99ad"]]);
  grad("fFar", [[0, "#c9d0dd"], [1, "#8f99ad"]]);
  grad("tail", [[0, "#f4f6fb"], [0.8, "#d5dbe6"], [1, "#8e98ac"]], "1", "0");
  const rg = el("radialGradient", { id: "bodyG", cx: ".62", cy: ".35", r: ".7" }, defs);
  [[0, "#ffffff"], [0.55, "#eef1f6"], [1, "#c3cad8"]].forEach(([o, c]) => el("stop", { offset: o, "stop-color": c }, rg));
  grad("sheen", [[0, "rgba(170,205,215,0)"], [0.5, "rgba(150,205,195,.6)"], [1, "rgba(190,165,220,.4)"]], "1", "1");

  function fPath(len, w) {
    return `M0 0 C${w} ${-len * 0.22} ${w * 0.95} ${-len * 0.78} ${w * 0.18} ${-len} C${-w * 0.45} ${-len * 0.92} ${-w * 0.8} ${-len * 0.32} 0 0Z`;
  }
  function feather(g, x, y, len, ang, w, fill, edge = "rgba(80,92,120,.45)") {
    const t = `translate(${x} ${y}) rotate(${ang})`;
    el("path", { d: fPath(len, w), transform: t, fill, stroke: edge, "stroke-width": 0.7 }, g);
    el("path", { d: `M0 -2 Q${w * 0.12} ${-len * 0.5} ${w * 0.12} ${-len * 0.9}`, transform: t, fill: "none", stroke: "rgba(110,120,145,.45)", "stroke-width": 0.6 }, g);
  }
  function buildWing(parent, far) {
    const root = el("g", {}, parent);
    const arm = el("g", {}, root);
    const fill = far ? "url(#fFar)" : "url(#fNear)";
    const tip = far ? "url(#fFar)" : "url(#fTip)";
    const edge = far ? "rgba(60,70,95,.55)" : "rgba(80,92,120,.45)";
    for (let i = 0; i <= 9; i++) { const t = i / 9; feather(arm, 4 * t, -58 * t, 50 + t * 12, -100 + t * 38, 10, fill, edge); }
    const hand = el("g", {}, root);
    for (let i = 0; i < 8; i++) { const len = [64, 70, 76, 82, 86, 88, 84, 74][i]; feather(hand, i * 1.4, -i * 1.6, len, -58 + i * 8.5, 8.5, tip, edge); }
    for (let i = 0; i < 4; i++) feather(hand, 2 + i, -4 - i * 2, 30, -40 + i * 12, 7, fill, edge);
    for (let i = 0; i <= 7; i++) { const t = i / 7; feather(root, 3 + 4 * t, -6 - 50 * t, 28, -78 + t * 28, 8, fill, edge); }
    el("path", { d: "M-7 6 C-9 -20 -5 -44 4 -60 L13 -61 C12 -40 10 -16 9 7Z", fill: far ? "#aeb6c6" : "#f7f9fc", stroke: edge, "stroke-width": 0.6 }, root);
    return { root, hand };
  }
  const farW = buildWing(bird, true);
  const tailG = el("g", {}, bird);
  for (let i = 0; i < 7; i++) feather(tailG, 104, 114 + i * 1.6, 68 + (i % 3) * 4, -104 + i * 4.5, 12, "url(#tail)");
  el("path", { d: "M92 116 C112 92 168 86 204 90 C218 78 238 72 254 80 C266 86 269 97 262 104 C252 113 238 112 228 116 C210 133 160 146 122 139 C106 136 96 128 92 116Z", fill: "url(#bodyG)", stroke: "rgba(90,100,125,.45)", "stroke-width": 0.8 }, bird);
  el("path", { d: "M206 92 C220 86 232 92 236 106 C230 112 220 116 212 118 C214 108 212 99 206 92Z", fill: "url(#sheen)" }, bird);
  el("path", { d: "M120 136 C150 140 190 132 214 118", fill: "none", stroke: "rgba(150,160,180,.5)", "stroke-width": 1.2 }, bird);
  el("path", { d: "M150 138 l-3 9 M156 138 l1 9", stroke: "#c98a86", "stroke-width": 2.2, "stroke-linecap": "round" }, bird);
  el("circle", { cx: 249, cy: 88, r: 5.2, fill: "#e4dcd6" }, bird);
  el("circle", { cx: 249, cy: 88, r: 3.8, fill: "#24170f" }, bird);
  el("circle", { cx: 250.4, cy: 86.6, r: 1.2, fill: "#fff" }, bird);
  el("path", { d: "M261 92 C268 92 276 95 282 98 C276 100 268 101 262 101Z", fill: "#b88f86" }, bird);
  el("path", { d: "M260 91.5 C263 89.5 267 90 268 92.5 C265 93.5 262 93.5 260 91.5Z", fill: "#f1ece6" }, bird);
  const nearW = buildWing(bird, false);

  const NEAR = { x: 166, y: 104 }, FAR = { x: 184, y: 98 }, BEAK = { x: 281, y: 99 }, VB = { x: -20, y: -130, w: 340, h: 300 };
  let phase = 0;

  function poseWings(s, glide) {
    const sy = glide ? 0.28 + 0.06 * Math.sin(phase * 0.3) : s;
    const rot = glide ? -6 : -10 + 14 * s;
    const hand = glide ? -6 : -20 * Math.cos(phase);
    nearW.root.setAttribute("transform", `translate(${NEAR.x} ${NEAR.y}) scale(1 ${sy}) rotate(${rot})`);
    nearW.hand.setAttribute("transform", `translate(4 -58) rotate(${hand}) translate(-4 58)`);
    farW.root.setAttribute("transform", `translate(${FAR.x} ${FAR.y}) scale(.92 ${sy * 0.9}) rotate(${rot - 6})`);
    farW.hand.setAttribute("transform", `translate(4 -58) rotate(${hand}) translate(-4 58)`);
    tailG.setAttribute("transform", `rotate(${glide ? 2 : s * 3} 104 118)`);
  }

  /* ---------- Animatsiya ---------- */
  const letter = $("letter");
  const shadow = $("shadow");
  let rafId = null;
  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const lerp = (a, b, t) => a + (b - a) * t;

  function stop() { cancelAnimationFrame(rafId); }

  function run(onDone) {
    stop();
    $("intro").hidden = false;
    bird.style.display = "";
    letter.style.display = "";
    letter.classList.remove("glow");
    shadow.style.opacity = 0;
    const W = innerWidth, H = innerHeight;
    const finish = (x, y) => { stop(); $("intro").hidden = true; onDone(x, y); };
    $("skip").onclick = () => finish(W / 2, H * 0.6);
    if (reduce) { finish(W / 2, H * 0.6); return; }

    const BW = Math.min(260, W * 0.55);
    bird.style.width = BW + "px";
    const BH = (BW * VB.h) / VB.w;
    const LW = Math.min(64, W * 0.15);
    letter.style.width = LW + "px";
    const dropT = 2.6;
    const P0 = { x: W + BW * 0.6, y: -BH * 0.4 };
    const P1 = { x: W * 0.5, y: H * 0.28 };
    const P2 = { x: -BW * 1.2, y: -BH };
    const groundY = H * 0.6;
    const fallDur = 3.6;
    let t0 = null, last = null, released = false, rel = null, landed = false, landT = 0;

    function beakPos(bx, by, scale) {
      const fx = (BEAK.x - VB.x) / VB.w, fy = (BEAK.y - VB.y) / VB.h;
      const w = BW * scale, h = BH * scale;
      return { x: bx - w / 2 + (1 - fx) * w, y: by - h / 2 + fy * h };
    }

    function frame(ts) {
      if (t0 === null) { t0 = ts; last = ts; }
      const t = (ts - t0) / 1000;
      const dt = Math.min(0.05, (ts - last) / 1000);
      last = ts;
      let bx, by, sc, glide = false, freq = 4.4;
      if (t < dropT) {
        const k = ease(t / dropT);
        bx = lerp(P0.x, P1.x, k);
        by = lerp(P0.y, P1.y, k) - Math.sin(k * Math.PI) * H * 0.05;
        sc = lerp(0.35, 1, k);
        if (t > 1.5 && t < 2.0) glide = true;
      } else {
        const k = Math.min(1, (t - dropT) / 2.8), e = k * k;
        bx = lerp(P1.x, P2.x, e);
        by = lerp(P1.y, P2.y, e) - Math.sin(k * Math.PI) * H * 0.04;
        sc = lerp(1, 0.55, k);
        freq = k < 0.15 ? 6 : 4.8;
        if (k > 0.55 && k < 0.75) glide = true;
      }
      phase += dt * freq * Math.PI * 2;
      const s = Math.sin(phase);
      poseWings(s, glide);
      const bob = glide ? Math.sin(t * 2) * 2 : s * 5 * sc;
      const tilt = t < dropT ? -8 : 14;
      if (t < dropT + 2.9) bird.style.transform = `translate(${bx - BW / 2}px,${by - BH / 2 + bob}px) scale(${-sc},${sc}) rotate(${tilt}deg)`;
      else bird.style.display = "none";

      if (!released) {
        const b = beakPos(bx, by + bob, sc);
        const ls = lerp(0.45, 0.8, Math.min(1, t / dropT));
        letter.style.transform = `translate(${b.x - LW / 2}px,${b.y - LW * 0.15}px) scale(${ls}) rotate(${-14 + s * 4}deg)`;
        if (t >= dropT + 0.15) { released = true; rel = { t, x: b.x, y: b.y, s: ls }; }
      } else if (!landed) {
        const u = Math.min(1, (t - rel.t) / fallDur), w = 2.4, tt = t - rel.t;
        const sway = Math.sin(tt * w) * Math.min(W * 0.18, 110) * (1 - u * 0.85);
        const gust = Math.sin(tt * 0.9 + 1) * 26 * (1 - u);
        const x = lerp(rel.x, W / 2, ease(u)) + sway + gust;
        const y = lerp(rel.y, groundY, u * u * 0.35 + u * 0.65) - Math.abs(Math.cos(tt * w)) * 10 * (1 - u);
        const ls = lerp(rel.s, 1.6, u);
        const rz = Math.cos(tt * w) * 30 * (1 - u * 0.8);
        const rx = Math.sin(tt * w * 1.3) * 50 * (1 - u);
        const ry = Math.sin(tt * w * 0.8) * 32 * (1 - u);
        letter.style.transform = `translate(${x - LW / 2}px,${y - LW * 0.35}px) scale(${ls}) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;
        shadow.style.opacity = u * 0.9;
        shadow.style.transform = `translate(${x - 45}px,${groundY + LW * 0.55}px) scale(${0.4 + u * 0.9},1)`;
        if (u >= 1) { landed = true; landT = t; letter.classList.add("glow"); }
      } else {
        const k = Math.min(1, (t - landT) / 1.6);
        const pulse = 1.6 + k * 0.5 + Math.sin(t * 6) * 0.05;
        letter.style.transform = `translate(${W / 2 - LW / 2}px,${groundY - LW * 0.35 - k * 10}px) scale(${pulse})`;
        if (k >= 1) { finish(W / 2, groundY); return; }
      }
      rafId = requestAnimationFrame(frame);
    }
    rafId = requestAnimationFrame(frame);
  }

  window.DoveIntro = { run, stop };
})();
