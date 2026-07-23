/**
 * Word Quest — 敵キャラ固有SVG（20体・1体1デザイン）
 * stageIndex と 1対1。色違いつまみ食いは禁止。
 */
(function (global) {
  'use strict';

  function wrap(inner, viewBox) {
    const vb = viewBox || '0 0 100 100';
    return `<svg viewBox="${vb}" class="w-full h-full drop-shadow-xl animate-float">${inner}</svg>`;
  }

  function shade(hex, amt) {
    const h = String(hex || '#888888').replace('#', '');
    if (h.length !== 6) return hex;
    const n = parseInt(h, 16);
    let r = (n >> 16) + amt;
    let g = ((n >> 8) & 0xff) + amt;
    let b = (n & 0xff) + amt;
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  // 1 緑スライム
  function drawSlime(c) {
    return wrap(`
      <ellipse cx="50" cy="88" rx="28" ry="6" fill="#000" opacity="0.25"/>
      <path d="M18,78 Q12,42 50,18 Q88,42 82,78 Q50,96 18,78 Z" fill="${c}" opacity="0.95"/>
      <path d="M22,70 Q20,48 50,28 Q78,48 78,70 Q50,82 22,70 Z" fill="${shade(c, 40)}" opacity="0.35"/>
      <ellipse cx="34" cy="36" rx="10" ry="5" fill="#fff" opacity="0.55" transform="rotate(-28 34 36)"/>
      <ellipse cx="38" cy="52" rx="7" ry="10" fill="#fff"/>
      <ellipse cx="62" cy="52" rx="7" ry="10" fill="#fff"/>
      <circle cx="40" cy="54" r="3.5" fill="#0f172a"/>
      <circle cx="64" cy="54" r="3.5" fill="#0f172a"/>
      <circle cx="41.5" cy="52.5" r="1.2" fill="#fff"/>
      <circle cx="65.5" cy="52.5" r="1.2" fill="#fff"/>
      <path d="M40,68 Q50,76 60,68" stroke="#14532d" stroke-width="3" fill="none" stroke-linecap="round"/>
    `);
  }

  // 2 コウモリナイト
  function drawBatKnight(c) {
    return wrap(`
      <ellipse cx="50" cy="92" rx="22" ry="5" fill="#000" opacity="0.25"/>
      <path d="M50,48 L8,28 Q18,55 28,62 L42,55 Z" fill="${shade(c, -40)}"/>
      <path d="M50,48 L92,28 Q82,55 72,62 L58,55 Z" fill="${shade(c, -40)}"/>
      <path d="M50,48 L18,22 L28,48 Z" fill="${c}" opacity="0.7"/>
      <path d="M50,48 L82,22 L72,48 Z" fill="${c}" opacity="0.7"/>
      <rect x="38" y="48" width="24" height="34" rx="4" fill="${c}"/>
      <path d="M40,52 L60,52 L56,70 L44,70 Z" fill="#94a3b8"/>
      <circle cx="50" cy="36" r="14" fill="#1e293b"/>
      <path d="M38,32 Q50,18 62,32 L60,40 Q50,30 40,40 Z" fill="#64748b"/>
      <rect x="42" y="34" width="16" height="5" rx="1" fill="#fbbf24"/>
      <rect x="68" y="40" width="5" height="40" fill="#cbd5e1"/>
      <polygon points="70.5,32 64,44 77,44" fill="#e2e8f0"/>
    `);
  }

  // 3 ポイズンフロッグ
  function drawFrog(c) {
    return wrap(`
      <ellipse cx="50" cy="90" rx="30" ry="5" fill="#000" opacity="0.2"/>
      <ellipse cx="50" cy="62" rx="34" ry="24" fill="${c}"/>
      <ellipse cx="50" cy="58" rx="26" ry="16" fill="${shade(c, 35)}" opacity="0.35"/>
      <circle cx="28" cy="40" r="12" fill="${c}"/>
      <circle cx="72" cy="40" r="12" fill="${c}"/>
      <circle cx="28" cy="40" r="7" fill="#fff"/>
      <circle cx="72" cy="40" r="7" fill="#fff"/>
      <circle cx="30" cy="41" r="3.5" fill="#111"/>
      <circle cx="74" cy="41" r="3.5" fill="#111"/>
      <ellipse cx="50" cy="70" rx="10" ry="7" fill="#4c1d95" opacity="0.85"/>
      <path d="M40,78 Q50,84 60,78" stroke="#064e3b" stroke-width="2.5" fill="none"/>
      <ellipse cx="18" cy="78" rx="8" ry="5" fill="${shade(c, -30)}"/>
      <ellipse cx="82" cy="78" rx="8" ry="5" fill="${shade(c, -30)}"/>
      <circle cx="44" cy="55" r="3" fill="#a3e635" opacity="0.8"/>
      <circle cx="58" cy="52" r="2.5" fill="#a3e635" opacity="0.8"/>
    `);
  }

  // 4 ロックゴーレム
  function drawGolem(c) {
    return wrap(`
      <ellipse cx="50" cy="92" rx="28" ry="5" fill="#000" opacity="0.25"/>
      <rect x="22" y="48" width="56" height="40" rx="3" fill="${c}"/>
      <rect x="28" y="28" width="44" height="28" rx="2" fill="${shade(c, -25)}"/>
      <rect x="34" y="12" width="32" height="22" rx="2" fill="${shade(c, 20)}"/>
      <rect x="8" y="50" width="18" height="28" rx="2" fill="${shade(c, -15)}"/>
      <rect x="74" y="46" width="18" height="32" rx="2" fill="${shade(c, -15)}"/>
      <line x1="30" y1="40" x2="70" y2="55" stroke="#78350f" stroke-width="2" opacity="0.5"/>
      <line x1="40" y1="20" x2="55" y2="35" stroke="#78350f" stroke-width="2" opacity="0.45"/>
      <rect x="40" y="20" width="8" height="6" fill="#0f172a"/>
      <rect x="54" y="20" width="8" height="6" fill="#0f172a"/>
      <rect x="44" y="32" width="14" height="4" fill="#451a03"/>
    `);
  }

  // 5 ファイヤードラゴン
  function drawDragon(c) {
    return wrap(`
      <ellipse cx="50" cy="92" rx="26" ry="5" fill="#000" opacity="0.25"/>
      <path d="M50,55 L10,30 Q20,60 32,68 Z" fill="${shade(c, -30)}"/>
      <path d="M50,55 L90,25 Q82,58 68,68 Z" fill="${shade(c, -20)}"/>
      <path d="M35,50 Q50,20 65,50 L60,85 L40,85 Z" fill="${c}"/>
      <path d="M42,38 Q50,28 58,38" fill="${shade(c, 40)}"/>
      <polygon points="38,28 32,8 44,24" fill="#fbbf24"/>
      <polygon points="62,28 68,8 56,24" fill="#fbbf24"/>
      <circle cx="44" cy="42" r="3" fill="#fef08a"/>
      <circle cx="56" cy="42" r="3" fill="#fef08a"/>
      <circle cx="44" cy="42" r="1.5" fill="#000"/>
      <circle cx="56" cy="42" r="1.5" fill="#000"/>
      <polygon points="46,52 50,62 54,52" fill="#fff"/>
      <path d="M60,80 Q85,70 92,88 Q70,85 60,80" fill="${shade(c, -40)}"/>
      <path d="M68,48 L88,42 L72,55" fill="#fb923c" opacity="0.9"/>
      <path d="M70,52 L90,55 L72,58" fill="#facc15" opacity="0.85"/>
    `);
  }

  // 6 アイスウルフ
  function drawWolf(c) {
    return wrap(`
      <ellipse cx="52" cy="90" rx="28" ry="5" fill="#000" opacity="0.2"/>
      <ellipse cx="48" cy="62" rx="30" ry="18" fill="${c}"/>
      <ellipse cx="72" cy="48" rx="16" ry="14" fill="${shade(c, 25)}"/>
      <polygon points="60,38 58,18 70,34" fill="${shade(c, -20)}"/>
      <polygon points="78,36 88,16 86,40" fill="${shade(c, -20)}"/>
      <polygon points="78,48 92,46 80,54" fill="#e0f2fe"/>
      <circle cx="78" cy="46" r="2.5" fill="#0f172a"/>
      <circle cx="68" cy="48" r="2" fill="#0f172a" opacity="0.5"/>
      <path d="M20,70 Q8,50 22,55 Q30,60 28,72 Z" fill="${shade(c, -30)}"/>
      <path d="M55,78 L70,92 L60,80" fill="${shade(c, -35)}"/>
      <path d="M40,40 Q48,28 55,40" fill="#fff" opacity="0.45"/>
      <polygon points="74,52 76,58 72,56" fill="#fff"/>
      <polygon points="80,52 84,58 78,56" fill="#fff"/>
    `);
  }

  // 7 サンダーバード
  function drawThunderBird(c) {
    return wrap(`
      <ellipse cx="50" cy="90" rx="20" ry="4" fill="#000" opacity="0.2"/>
      <path d="M50,48 L5,58 Q20,40 42,45 Z" fill="${c}"/>
      <path d="M50,48 L95,58 Q80,40 58,45 Z" fill="${c}"/>
      <path d="M50,48 L12,35 Q30,30 45,42" fill="${shade(c, 30)}" opacity="0.7"/>
      <path d="M50,48 L88,35 Q70,30 55,42" fill="${shade(c, 30)}" opacity="0.7"/>
      <ellipse cx="50" cy="52" rx="14" ry="18" fill="${shade(c, -15)}"/>
      <circle cx="50" cy="36" r="12" fill="${shade(c, 10)}"/>
      <polygon points="50,28 46,12 54,12" fill="#fef08a"/>
      <circle cx="46" cy="36" r="2.5" fill="#0f172a"/>
      <circle cx="54" cy="36" r="2.5" fill="#0f172a"/>
      <path d="M50,70 L46,92 L54,78 L58,92 Z" fill="${shade(c, -40)}"/>
      <path d="M62,40 L78,22 L70,42" stroke="#facc15" stroke-width="3" fill="none"/>
      <path d="M30,42 L18,20 L26,44" stroke="#fde047" stroke-width="2.5" fill="none"/>
    `);
  }

  // 8 シャドウナイト
  function drawShadowKnight(c) {
    return wrap(`
      <ellipse cx="50" cy="92" rx="24" ry="5" fill="#000" opacity="0.35"/>
      <path d="M30,50 Q20,90 50,95 Q80,90 70,50 Z" fill="#0f172a" opacity="0.55"/>
      <rect x="34" y="48" width="32" height="38" rx="3" fill="${c}"/>
      <path d="M36,52 L64,52 L60,72 L40,72 Z" fill="#1e293b"/>
      <path d="M38,22 L50,10 L62,22 L58,48 L42,48 Z" fill="#020617"/>
      <rect x="42" y="30" width="16" height="6" rx="1" fill="#ef4444"/>
      <circle cx="46" cy="33" r="1.5" fill="#fecaca"/>
      <circle cx="54" cy="33" r="1.5" fill="#fecaca"/>
      <rect x="70" y="28" width="6" height="55" fill="#94a3b8"/>
      <polygon points="73,18 64,32 82,32" fill="#e2e8f0"/>
      <path d="M28,55 Q18,70 30,80" stroke="${shade(c, -50)}" stroke-width="6" fill="none"/>
    `);
  }

  // 9 エント（動く大木）
  function drawEnt(c) {
    return wrap(`
      <ellipse cx="50" cy="94" rx="26" ry="4" fill="#000" opacity="0.2"/>
      <path d="M42,40 L38,90 L48,90 Z" fill="#78350f"/>
      <path d="M58,42 L52,90 L62,90 Z" fill="#92400e"/>
      <ellipse cx="50" cy="42" rx="26" ry="28" fill="${c}"/>
      <circle cx="40" cy="28" r="8" fill="${shade(c, 25)}"/>
      <circle cx="62" cy="24" r="7" fill="${shade(c, 15)}"/>
      <circle cx="55" cy="38" r="6" fill="${shade(c, 35)}"/>
      <path d="M20,50 Q8,40 18,35" stroke="#78350f" stroke-width="5" fill="none"/>
      <path d="M80,48 Q94,38 86,30" stroke="#78350f" stroke-width="5" fill="none"/>
      <path d="M38,48 Q42,52 46,48" stroke="#14532d" stroke-width="2" fill="none"/>
      <path d="M54,48 Q58,52 62,48" stroke="#14532d" stroke-width="2" fill="none"/>
      <path d="M44,60 Q50,66 56,60" stroke="#3f6212" stroke-width="2.5" fill="none"/>
      <line x1="45" y1="35" x2="55" y2="55" stroke="#3f2a14" stroke-width="1.5" opacity="0.5"/>
    `);
  }

  // 10 クラーケン
  function drawKraken(c) {
    return wrap(`
      <ellipse cx="50" cy="40" rx="28" ry="24" fill="${c}"/>
      <ellipse cx="50" cy="36" rx="18" ry="14" fill="${shade(c, 30)}" opacity="0.35"/>
      <circle cx="40" cy="36" r="8" fill="#fff"/>
      <circle cx="60" cy="36" r="8" fill="#fff"/>
      <circle cx="42" cy="38" r="4" fill="#0f172a"/>
      <circle cx="62" cy="38" r="4" fill="#0f172a"/>
      <circle cx="43.5" cy="36" r="1.5" fill="#fff"/>
      <circle cx="63.5" cy="36" r="1.5" fill="#fff"/>
      <path d="M28,55 Q18,85 30,95" stroke="${shade(c, -20)}" stroke-width="8" fill="none" stroke-linecap="round"/>
      <path d="M42,58 Q38,90 48,96" stroke="${c}" stroke-width="8" fill="none" stroke-linecap="round"/>
      <path d="M58,58 Q62,90 52,96" stroke="${shade(c, -10)}" stroke-width="8" fill="none" stroke-linecap="round"/>
      <path d="M72,55 Q82,85 70,95" stroke="${shade(c, -25)}" stroke-width="8" fill="none" stroke-linecap="round"/>
      <path d="M50,58 Q50,80 56,92" stroke="${shade(c, 15)}" stroke-width="7" fill="none" stroke-linecap="round"/>
      <circle cx="28" cy="88" r="3" fill="#fecdd3"/>
      <circle cx="72" cy="88" r="3" fill="#fecdd3"/>
    `);
  }

  // 11 グリフィン
  function drawGriffin(c) {
    return wrap(`
      <ellipse cx="50" cy="92" rx="24" ry="4" fill="#000" opacity="0.2"/>
      <path d="M48,50 L14,40 Q22,62 36,65 Z" fill="#f59e0b"/>
      <path d="M52,50 L88,32 Q80,60 66,64 Z" fill="#fbbf24"/>
      <ellipse cx="48" cy="68" rx="22" ry="16" fill="${c}"/>
      <circle cx="58" cy="40" r="16" fill="${shade(c, 20)}"/>
      <polygon points="48,30 42,12 54,26" fill="#78350f"/>
      <polygon points="64,28 72,10 68,30" fill="#78350f"/>
      <path d="M58,42 L78,48 L60,50" fill="#fde68a"/>
      <circle cx="54" cy="38" r="2.5" fill="#0f172a"/>
      <circle cx="64" cy="36" r="2.5" fill="#0f172a"/>
      <path d="M30,75 L22,92 L34,82" fill="${shade(c, -30)}"/>
      <path d="M55,78 L60,94 L65,78" fill="${shade(c, -30)}"/>
      <path d="M70,72 Q88,70 84,82" fill="#ea580c"/>
    `);
  }

  // 12 ミイラキング
  function drawMummy(c) {
    return wrap(`
      <ellipse cx="50" cy="92" rx="22" ry="4" fill="#000" opacity="0.2"/>
      <rect x="34" y="42" width="32" height="44" rx="4" fill="${c}"/>
      <path d="M36,48 H64 M36,56 H64 M36,64 H60 M38,72 H62 M36,80 H58" stroke="#fef3c7" stroke-width="3" opacity="0.85"/>
      <circle cx="50" cy="30" r="16" fill="${shade(c, 25)}"/>
      <path d="M36,28 H64 M40,36 H60" stroke="#fef3c7" stroke-width="2.5"/>
      <rect x="42" y="30" width="6" height="4" fill="#0f172a"/>
      <rect x="54" y="30" width="6" height="4" fill="#0f172a"/>
      <path d="M34,16 L50,6 L66,16 L62,22 L38,22 Z" fill="#fbbf24"/>
      <circle cx="50" cy="12" r="3" fill="#ef4444"/>
      <rect x="68" y="40" width="5" height="45" fill="#a16207"/>
      <circle cx="70.5" cy="38" r="6" fill="#f59e0b"/>
      <path d="M28,55 Q18,70 28,78" stroke="#fef3c7" stroke-width="4" fill="none"/>
    `);
  }

  // 13 ドッペルゲンガー（勇者の影）
  function drawDoppel(c) {
    return wrap(`
      <ellipse cx="50" cy="92" rx="20" ry="4" fill="#000" opacity="0.3"/>
      <path d="M62,50 L78,92 L52,88 Z" fill="${shade(c, -40)}" opacity="0.8"/>
      <rect x="38" y="48" width="24" height="32" rx="4" fill="${c}"/>
      <path d="M42,52 L58,52 L54,68 L46,68 Z" fill="#312e81"/>
      <circle cx="50" cy="32" r="14" fill="#1e1b4b"/>
      <path d="M38,28 Q50,16 62,28 L60,36 Q50,26 40,36 Z" fill="#4338ca"/>
      <circle cx="45" cy="32" r="2.5" fill="#a5b4fc"/>
      <path d="M28,48 Q22,70 36,78 Q42,60 36,50 Z" fill="#6366f1"/>
      <g transform="rotate(25 35 55)">
        <rect x="22" y="30" width="5" height="36" rx="1" fill="#c7d2fe"/>
        <rect x="18" y="62" width="13" height="4" fill="#818cf8"/>
      </g>
      <path d="M20,20 Q50,8 80,20" stroke="${c}" stroke-width="2" opacity="0.5" fill="none"/>
    `);
  }

  // 14 ヒドラ（多首）
  function drawHydra(c) {
    return wrap(`
      <ellipse cx="50" cy="92" rx="28" ry="4" fill="#000" opacity="0.2"/>
      <ellipse cx="50" cy="78" rx="26" ry="14" fill="${shade(c, -25)}"/>
      <path d="M36,75 Q28,40 22,28" stroke="${c}" stroke-width="10" fill="none" stroke-linecap="round"/>
      <path d="M50,72 Q50,38 50,22" stroke="${shade(c, 10)}" stroke-width="11" fill="none" stroke-linecap="round"/>
      <path d="M64,75 Q72,40 80,26" stroke="${shade(c, -10)}" stroke-width="10" fill="none" stroke-linecap="round"/>
      <circle cx="22" cy="24" r="10" fill="${c}"/>
      <circle cx="50" cy="18" r="11" fill="${shade(c, 15)}"/>
      <circle cx="80" cy="22" r="10" fill="${c}"/>
      <circle cx="20" cy="22" r="2.5" fill="#fef08a"/>
      <circle cx="48" cy="16" r="2.5" fill="#fef08a"/>
      <circle cx="78" cy="20" r="2.5" fill="#fef08a"/>
      <circle cx="20" cy="22" r="1.2" fill="#000"/>
      <circle cx="48" cy="16" r="1.2" fill="#000"/>
      <circle cx="78" cy="20" r="1.2" fill="#000"/>
      <polygon points="18,30 22,38 26,30" fill="#fff"/>
      <polygon points="46,24 50,34 54,24" fill="#fff"/>
      <polygon points="76,28 80,36 84,28" fill="#fff"/>
    `);
  }

  // 15 ガーディアンロボ
  function drawRobot(c) {
    return wrap(`
      <ellipse cx="50" cy="92" rx="24" ry="4" fill="#000" opacity="0.25"/>
      <rect x="30" y="40" width="40" height="42" rx="3" fill="${c}"/>
      <rect x="34" y="46" width="32" height="20" rx="2" fill="#0f172a"/>
      <rect x="36" y="50" width="28" height="8" rx="1" fill="#22d3ee"/>
      <rect x="38" y="14" width="24" height="26" rx="2" fill="${shade(c, 20)}"/>
      <rect x="42" y="22" width="16" height="6" rx="1" fill="#ef4444"/>
      <rect x="12" y="48" width="16" height="12" rx="2" fill="${shade(c, -20)}"/>
      <rect x="72" y="48" width="16" height="12" rx="2" fill="${shade(c, -20)}"/>
      <rect x="14" y="60" width="10" height="22" fill="#334155"/>
      <rect x="76" y="60" width="10" height="22" fill="#334155"/>
      <circle cx="50" cy="72" r="4" fill="#fbbf24"/>
      <rect x="46" y="8" width="8" height="8" fill="#94a3b8"/>
      <line x1="50" y1="4" x2="50" y2="10" stroke="#f87171" stroke-width="2"/>
    `);
  }

  // 16 アストラルビースト
  function drawAstral(c) {
    return wrap(`
      <ellipse cx="50" cy="90" rx="18" ry="4" fill="#000" opacity="0.2"/>
      <circle cx="50" cy="50" r="36" fill="none" stroke="${shade(c, 40)}" stroke-width="2" opacity="0.5" stroke-dasharray="4 6"/>
      <circle cx="50" cy="50" r="26" fill="none" stroke="${c}" stroke-width="1.5" opacity="0.7"/>
      <polygon points="50,22 58,42 80,42 62,56 70,78 50,64 30,78 38,56 20,42 42,42" fill="${c}"/>
      <polygon points="50,34 54,44 64,44 56,50 60,60 50,54 40,60 44,50 36,44 46,44" fill="${shade(c, 50)}" opacity="0.85"/>
      <circle cx="50" cy="50" r="6" fill="#fff" opacity="0.9"/>
      <circle cx="50" cy="50" r="3" fill="#4c1d95"/>
      <circle cx="78" cy="28" r="3" fill="#fde68a"/>
      <circle cx="22" cy="66" r="2.5" fill="#fde68a"/>
    `);
  }

  // 17 ヘルハウンド
  function drawHellhound(c) {
    return wrap(`
      <ellipse cx="50" cy="92" rx="26" ry="4" fill="#000" opacity="0.25"/>
      <ellipse cx="46" cy="64" rx="28" ry="16" fill="${c}"/>
      <ellipse cx="70" cy="50" rx="15" ry="13" fill="${shade(c, 15)}"/>
      <polygon points="60,40 56,20 68,36" fill="#7f1d1d"/>
      <polygon points="76,38 86,18 84,42" fill="#7f1d1d"/>
      <circle cx="74" cy="48" r="2.5" fill="#fde047"/>
      <circle cx="66" cy="50" r="2" fill="#fde047" opacity="0.6"/>
      <path d="M72,55 Q84,60 78,66" fill="#f97316"/>
      <path d="M18,60 Q6,40 20,48 Z" fill="#fb923c" opacity="0.8"/>
      <path d="M22,55 Q10,35 24,45 Z" fill="#ef4444" opacity="0.7"/>
      <ellipse cx="46" cy="58" rx="10" ry="6" fill="#450a0a"/>
      <path d="M55,78 L68,94 L62,78" fill="${shade(c, -30)}"/>
      <polygon points="74,52 76,60 70,56" fill="#fff"/>
      <polygon points="80,52 86,60 78,56" fill="#fff"/>
    `);
  }

  // 18  vis（堕天使）
  function drawAbaddon(c) {
    return wrap(`
      <ellipse cx="50" cy="92" rx="22" ry="4" fill="#000" opacity="0.3"/>
      <path d="M40,45 Q10,20 8,55 L32,58 Z" fill="#1c1917" opacity="0.85"/>
      <path d="M60,45 Q90,15 95,48 L70,58 Z" fill="#1c1917" opacity="0.85"/>
      <path d="M42,50 Q20,70 28,85" stroke="#44403c" stroke-width="3" fill="none"/>
      <path d="M58,48 Q82,65 78,82" stroke="#44403c" stroke-width="3" fill="none"/>
      <path d="M38,48 L62,48 L58,88 L42,88 Z" fill="${c}"/>
      <circle cx="50" cy="34" r="14" fill="#292524"/>
      <path d="M40,28 C36,10 48,8 50,20" stroke="#b91c1c" stroke-width="4" fill="none"/>
      <path d="M60,28 C64,10 52,8 50,20" stroke="#b91c1c" stroke-width="4" fill="none"/>
      <circle cx="45" cy="34" r="2.5" fill="#ef4444"/>
      <circle cx="55" cy="34" r="2.5" fill="#ef4444"/>
      <rect x="66" y="40" width="5" height="42" fill="#a8a29e"/>
      <polygon points="68.5,28 62,42 75,42" fill="#e7e5e4"/>
      <path d="M34,70 Q50,82 66,70" stroke="#a16207" stroke-width="2" fill="none"/>
    `);
  }

  // 19 デスナイト（近衛兵）
  function drawDeathKnight(c) {
    return wrap(`
      <ellipse cx="50" cy="92" rx="24" ry="4" fill="#000" opacity="0.3"/>
      <rect x="36" y="48" width="28" height="38" rx="3" fill="${c}"/>
      <path d="M38,52 L62,52 L58,74 L42,74 Z" fill="#27272a"/>
      <circle cx="50" cy="32" r="16" fill="#18181b"/>
      <path d="M38,28 L50,14 L62,28 L58,44 L42,44 Z" fill="#09090b"/>
      <!-- 髑髏風スリット -->
      <ellipse cx="44" cy="32" rx="4" ry="5" fill="#ef4444"/>
      <ellipse cx="56" cy="32" rx="4" ry="5" fill="#ef4444"/>
      <path d="M46,42 H54" stroke="#a1a1aa" stroke-width="2"/>
      <path d="M22,55 L18,85 L38,70 Z" fill="#ca8a04"/>
      <path d="M22,55 L42,48 L38,70 Z" fill="#eab308"/>
      <rect x="68" y="30" width="6" height="50" fill="#d4d4d8"/>
      <polygon points="71,18 62,34 80,34" fill="#fafafa"/>
      <circle cx="50" cy="60" r="3" fill="#7f1d1d"/>
    `);
  }

  // 20 魔王ヴォルデグラード
  function drawDemonLord(c) {
    return wrap(`
      <ellipse cx="60" cy="108" rx="32" ry="6" fill="#000" opacity="0.35"/>
      <path d="M35,55 Q8,25 5,70 L40,68 Z" fill="#2e1065"/>
      <path d="M85,55 Q112,25 115,70 L80,68 Z" fill="#2e1065"/>
      <path d="M40,58 L80,58 L72,105 L48,105 Z" fill="${c}"/>
      <circle cx="40" cy="58" r="10" fill="#f59e0b"/>
      <circle cx="80" cy="58" r="10" fill="#f59e0b"/>
      <path d="M45,28 C45,8 75,8 75,28 L70,58 L50,58 Z" fill="#1e1b4b"/>
      <path d="M48,26 C36,0 24,12 34,30" stroke="#ef4444" stroke-width="5" fill="none"/>
      <path d="M72,26 C84,0 96,12 86,30" stroke="#ef4444" stroke-width="5" fill="none"/>
      <circle cx="55" cy="36" r="4" fill="#ef4444"/>
      <circle cx="70" cy="36" r="4" fill="#ef4444"/>
      <circle cx="56" cy="35" r="1.5" fill="#fff"/>
      <circle cx="71" cy="35" r="1.5" fill="#fff"/>
      <path d="M48,105 Q60,118 72,105" stroke="#a855f7" stroke-width="3" fill="none"/>
      <path d="M30,80 Q60,95 90,80" stroke="#7c3aed" stroke-width="2" opacity="0.6" fill="none"/>
    `, '0 0 120 120');
  }

  const DRAWERS = [
    drawSlime,
    drawBatKnight,
    drawFrog,
    drawGolem,
    drawDragon,
    drawWolf,
    drawThunderBird,
    drawShadowKnight,
    drawEnt,
    drawKraken,
    drawGriffin,
    drawMummy,
    drawDoppel,
    drawHydra,
    drawRobot,
    drawAstral,
    drawHellhound,
    drawAbaddon,
    drawDeathKnight,
    drawDemonLord
  ];

  function generateMonsterSVG(stageIndex, color) {
    const idx = Math.max(0, Math.min(DRAWERS.length - 1, stageIndex | 0));
    const drawer = DRAWERS[idx];
    return drawer(color || '#888888');
  }

  global.generateMonsterSVG = generateMonsterSVG;
  global.MONSTER_SVG_COUNT = DRAWERS.length;
})(typeof window !== 'undefined' ? window : globalThis);
