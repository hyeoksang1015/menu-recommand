// 링크 공유 썸네일(Open Graph 1200×630)을 언어별로 만든다: public/og/{ko,en,ja,zh}.png
// 사용: node scripts/make_og.mjs  (폰트를 눈누 CDN에서 받으므로 인터넷 연결이 필요하다)
// 글자를 바꾸려면 아래 TEXT를 고치고 다시 실행한 뒤 PNG를 커밋한다.
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const TEXT = {
  ko: {
    name: "골라주께",
    tagline: "메뉴 고민 시간, 줄여주께",
    bubble: "뭐 먹지? 3개로 줄여 줄게!",
    picks: ["무난한 선택", "오늘 상태에 딱", "새로운 도전"],
  },
  en: {
    name: "Gollajuke",
    tagline: "Less time deciding, more time eating",
    bubble: "What to eat? I'll pick 3!",
    picks: ["Safe choice", "Fits your mood", "Something new"],
  },
  ja: {
    name: "ゴラジュケ",
    tagline: "メニューに迷う時間、短くします",
    bubble: "何食べる？3つに絞るね！",
    picks: ["定番の一品", "今の気分にぴったり", "新しい挑戦"],
  },
  zh: {
    name: "Gollajuke",
    tagline: "少花时间纠结吃什么",
    bubble: "吃什么？帮你挑 3 道！",
    picks: ["稳妥之选", "正合心情", "尝鲜挑战"],
  },
};

// 손글씨 폰트는 한글·라틴만 있어 가나·한자는 언어에 맞는 글꼴로 대체한다(만든 PC가 Windows 기준).
const FALLBACK = {
  ko: '"Malgun Gothic"',
  en: '"Malgun Gothic"',
  ja: '"Yu Gothic", "Meiryo"',
  zh: '"Microsoft YaHei"',
};

// 밥그릇 캐릭터. 사이트 팔레트(#086288 · #4D8DBA · #97D7FF · #FFEFC4)만 쓴다.
const MASCOT = `
<svg viewBox="0 0 320 300" width="380" height="356" xmlns="http://www.w3.org/2000/svg">
  <g fill="none" stroke="#4d8dba" stroke-width="9" stroke-linecap="round">
    <path d="M110 70 q-14 -18 0 -36 q14 -18 0 -36" transform="translate(0 14)"/>
    <path d="M160 60 q-14 -18 0 -36 q14 -18 0 -36" transform="translate(0 10)"/>
    <path d="M210 70 q-14 -18 0 -36 q14 -18 0 -36" transform="translate(0 14)"/>
  </g>
  <g stroke="#4d8dba" stroke-width="12" stroke-linecap="round">
    <line x1="228" y1="130" x2="300" y2="40"/>
    <line x1="248" y1="138" x2="314" y2="62"/>
  </g>
  <path d="M40 150 C40 95 100 80 160 80 C220 80 280 95 280 150 Z" fill="#ffffff" stroke="#c3e6fb" stroke-width="6"/>
  <g fill="#e4f4ff">
    <ellipse cx="110" cy="118" rx="9" ry="5" transform="rotate(-20 110 118)"/>
    <ellipse cx="150" cy="102" rx="9" ry="5" transform="rotate(15 150 102)"/>
    <ellipse cx="196" cy="114" rx="9" ry="5" transform="rotate(-10 196 114)"/>
    <ellipse cx="232" cy="132" rx="9" ry="5" transform="rotate(25 232 132)"/>
    <ellipse cx="80" cy="138" rx="9" ry="5" transform="rotate(10 80 138)"/>
  </g>
  <path d="M20 148 H300 C300 236 236 284 160 284 C84 284 20 236 20 148 Z" fill="#086288"/>
  <rect x="20" y="146" width="280" height="20" rx="10" fill="#4d8dba"/>
  <ellipse cx="112" cy="206" rx="13" ry="16" fill="#ffefc4"/>
  <ellipse cx="208" cy="206" rx="13" ry="16" fill="#ffefc4"/>
  <circle cx="116" cy="200" r="5" fill="#086288"/>
  <circle cx="212" cy="200" r="5" fill="#086288"/>
  <ellipse cx="80" cy="236" rx="18" ry="10" fill="#97d7ff" opacity="0.9"/>
  <ellipse cx="240" cy="236" rx="18" ry="10" fill="#97d7ff" opacity="0.9"/>
  <path d="M140 234 q20 22 40 0" fill="none" stroke="#ffefc4" stroke-width="8" stroke-linecap="round"/>
</svg>`;

const page = (lang, t) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
@font-face {
  font-family: "DearFromsol";
  src: url("https://cdn.jsdelivr.net/gh/Project-Noonnu/2607161334@griun-fromsol-rg/griun-fromsol-rg/Griun_Fromsol-Rg.woff2") format("woff2");
  /* 한글·라틴만 이 폰트로 쓴다. 폰트에 든 가나·한자는 폭이 넓어 일본어·중국어가 띄엄띄엄 보이므로 각 언어 글꼴로 넘긴다. */
  unicode-range: U+0000-024F, U+2000-206F, U+20A9, U+1100-11FF, U+3130-318F, U+A960-A97F, U+AC00-D7AF, U+D7B0-D7FF;
}
* { margin: 0; box-sizing: border-box; }
body {
  width: 1200px; height: 630px; overflow: hidden; position: relative;
  background: #ffefc4; color: #0b2b3c;
  font-family: "DearFromsol", ${FALLBACK[lang]}, sans-serif;
}
.dot { position: absolute; border-radius: 50%; background: #e4f4ff; }
.mascot { position: absolute; left: 70px; top: 230px; }
.bubble {
  position: absolute; left: 56px; top: 80px; white-space: nowrap;
  background: #fff; border: 5px solid #97d7ff; border-radius: 40px;
  padding: 18px 30px; font-size: 36px; line-height: 1.25;
}
.bubble::after {
  content: ""; position: absolute; left: 150px; bottom: -30px;
  border: 16px solid transparent; border-top: 18px solid #97d7ff;
}
.right { position: absolute; left: 530px; top: 70px; right: 50px; }
h1 { font-size: 112px; line-height: 1; color: #086288; font-weight: ${lang === "ja" ? 700 : 400}; }
.tag { margin-top: 18px; font-size: 40px; line-height: 1.25; }
.picks { margin-top: 30px; display: flex; flex-direction: column; gap: 12px; }
.pick {
  display: inline-flex; align-items: center; gap: 16px; align-self: flex-start;
  background: #fff; border: 4px solid #c3e6fb; border-radius: 999px;
  padding: 8px 28px 8px 10px; font-size: 32px;
}
.pick b {
  display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%;
  background: #086288; color: #fff; font-size: 26px; font-weight: 400;
}
</style></head><body>
<div class="dot" style="width:360px;height:360px;right:-120px;top:-140px"></div>
<div class="dot" style="width:220px;height:220px;left:400px;bottom:-110px"></div>
<div class="bubble">${t.bubble}</div>
<div class="mascot">${MASCOT}</div>
<div class="right">
  <h1>${t.name}</h1>
  <p class="tag">${t.tagline}</p>
  <div class="picks">${t.picks.map((p, i) => `<span class="pick"><b>${i + 1}</b>${p}</span>`).join("")}</div>
</div>
</body></html>`;

mkdirSync("public/og", { recursive: true });
const browser = await chromium.launch();
const tab = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const [lang, t] of Object.entries(TEXT)) {
  await tab.setContent(page(lang, t), { waitUntil: "networkidle" });
  await tab.evaluate(() => document.fonts.ready);
  if (!(await tab.evaluate(() => document.fonts.check('40px "DearFromsol"'))))
    throw new Error("폰트를 받지 못했습니다(인터넷 연결 확인)");
  await tab.screenshot({ path: `public/og/${lang}.png` });
  console.log(`public/og/${lang}.png`);
}
await browser.close();
