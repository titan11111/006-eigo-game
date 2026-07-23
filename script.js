'use strict';

const questionEl = document.getElementById('question');
const choicesEl = document.getElementById('choices');
const resultEl = document.getElementById('result');
const restartBtn = document.getElementById('restart-btn');
const nextBtn = document.getElementById('next-btn');
const levelNumberEl = document.getElementById('level-number');
const expFillEl = document.getElementById('exp-fill');
const expTextEl = document.getElementById('exp-text');
const streakEl = document.getElementById('streak');
const totalScoreEl = document.getElementById('total-score');
const progressFillEl = document.getElementById('progress-fill');
const questionCounterEl = document.getElementById('question-counter');
const achievementEl = document.getElementById('achievement');
const achievementTitleEl = document.getElementById('achievement-title');
const achievementDescEl = document.getElementById('achievement-desc');
const levelupEl = document.getElementById('levelup');
const levelupLevelEl = document.getElementById('levelup-level');
const mpFillEl = document.getElementById('mp-fill');
const mpTextEl = document.getElementById('mp-text');
const timerEl = document.getElementById('timer');
const stageNumberEl = document.getElementById('stage-number');
const stageNameEl = document.getElementById('stage-name');
const stageIconEl = document.getElementById('stage-icon');
const stageMapEl = document.getElementById('stage-map');
const skillMessageEl = document.getElementById('skill-message');
const hintBtn = document.getElementById('hint-btn');
const halfBtn = document.getElementById('half-btn');
const timeBtn = document.getElementById('time-btn');
const doubleBtn = document.getElementById('double-btn');
const playEl = document.getElementById('play');

const QUESTIONS_PER_GAME = 10;
const EXP_PER_CORRECT = 10;
const EXP_PER_STREAK = 5;
const EXP_PER_LEVEL = 100;
const MAX_MP = 100;
const MP_PER_CORRECT = 15;
const QUESTION_TIME = 15;

const STAGES = [
  { name: '単語の森', icon: '🌲' },
  { name: '文法洞窟', icon: '🪨' },
  { name: '過去形研究所', icon: '🧪' },
  { name: '英語都市', icon: '🌃' },
  { name: '英語王の城', icon: '👑' }
];

let currentQuestion = 0;
let score = 0;
let correctStreak = 0;
let gameQuestions = [];
/** @type {Array<{name?:string,icon?:string,theme?:string,questions:Array}>} */
let stageBanks = [];
let level = 1;
let experience = 0;
let totalScore = 0;
let totalExperience = 0;
let achievements = new Set();
let maxStreak = 0;
let mp = 0;
let currentStage = 0;
let unlockedStage = 0;
let timeLeft = QUESTION_TIME;
let timerId = null;
let answerLocked = false;
let doubleActive = false;

// ------------------------------------------------------------
// iOS: ダブルタップ防止 / スクロール誤爆防止 / 打感
// ------------------------------------------------------------
function vibrate(ms) {
  try {
    if (navigator.vibrate) navigator.vibrate(ms);
  } catch (_) { /* ignore */ }
}

function bindTapFeel(root) {
  root.addEventListener('pointerdown', (e) => {
    const t = e.target.closest('button, .choice-btn, .skill-btn, .stage-node, .action-btn');
    if (!t || t.disabled) return;
    vibrate(12);
  }, { passive: true });
}

(function installIOSGuards() {
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) e.preventDefault();
    lastTouchEnd = now;
  }, { passive: false });

  document.addEventListener('dblclick', (e) => e.preventDefault());
  document.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('selectstart', (e) => e.preventDefault());
  document.addEventListener('dragstart', (e) => e.preventDefault());

  // 画面全体のラバーバンドは止め、問題エリア内スクロールは許可
  document.addEventListener('touchmove', (e) => {
    if (playEl && playEl.contains(e.target)) return;
    e.preventDefault();
  }, { passive: false });

  bindTapFeel(document);
})();

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function setVisible(el, on) {
  if (!el) return;
  el.hidden = !on;
}

function getStageBank(stageIndex) {
  const bank = stageBanks[stageIndex];
  if (bank && Array.isArray(bank.questions) && bank.questions.length) return bank.questions;
  return stageBanks.flatMap((s) => (s && Array.isArray(s.questions) ? s.questions : []));
}

function pickQuestionsForStage(stageIndex) {
  const pool = [...getStageBank(stageIndex)];
  if (!pool.length) return [];
  pool.sort(() => Math.random() - 0.5);
  return pool.slice(0, Math.min(QUESTIONS_PER_GAME, pool.length));
}

const ACHIEVEMENTS = {
  firstCorrect: { title: '初回正解', desc: '最初の問題に正解しました！' },
  streak3: { title: '連続正解3回', desc: '3回連続で正解しました！' },
  streak5: { title: '連続正解5回', desc: '5回連続で正解しました！' },
  streak10: { title: '連続正解10回', desc: '10回連続で正解しました！' },
  perfectGame: { title: 'パーフェクト', desc: '全問正解でクリアしました！' },
  levelUp: { title: 'レベルアップ', desc: 'レベルが上がりました！' },
  score100: { title: 'スコア100', desc: '累計スコアが100に達しました！' },
  score500: { title: 'スコア500', desc: '累計スコアが500に達しました！' }
};

function speak(text) {
  if (!text || !('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.volume = 1;
  u.rate = 0.9;
  u.pitch = 1;
  const voices = window.speechSynthesis.getVoices();
  u.voice = voices.find((v) => v.lang === 'en-US') || voices.find((v) => v.lang.startsWith('en')) || null;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

function addExperience(exp) {
  experience += exp;
  totalExperience += exp;
  while (experience >= EXP_PER_LEVEL) {
    experience -= EXP_PER_LEVEL;
    levelUp();
  }
  updateUI();
}

function levelUp() {
  level++;
  showLevelUpNotification();
  checkAchievement('levelUp');
}

function addMP(amount) {
  mp = Math.min(MAX_MP, mp + amount);
  updateUI();
}

function spendMP(cost) {
  if (mp < cost || answerLocked) return false;
  mp -= cost;
  updateUI();
  return true;
}

function updateUI() {
  levelNumberEl.textContent = String(level);
  expFillEl.style.width = `${experience}%`;
  expTextEl.textContent = `${experience}/100 XP`;
  streakEl.textContent = String(correctStreak);
  totalScoreEl.textContent = String(totalScore);
  progressFillEl.style.width = `${((currentQuestion + 1) / QUESTIONS_PER_GAME) * 100}%`;
  questionCounterEl.textContent = `${Math.min(currentQuestion + 1, QUESTIONS_PER_GAME)}/${QUESTIONS_PER_GAME}`;
  mpFillEl.style.width = `${mp}%`;
  mpTextEl.textContent = `${mp}/${MAX_MP} MP`;
  timerEl.textContent = String(timeLeft);
  stageNumberEl.textContent = String(currentStage + 1);
  stageNameEl.textContent = STAGES[currentStage].name;
  stageIconEl.textContent = STAGES[currentStage].icon;
  [hintBtn, halfBtn, timeBtn, doubleBtn].forEach((b) => { b.disabled = answerLocked; });
  hintBtn.classList.toggle('unavailable', mp < 20);
  halfBtn.classList.toggle('unavailable', mp < 30);
  timeBtn.classList.toggle('unavailable', mp < 30);
  doubleBtn.classList.toggle('unavailable', mp < 40);
  renderStageMap();
}

function renderStageMap() {
  stageMapEl.innerHTML = '';
  STAGES.forEach((s, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'stage-node';
    b.setAttribute('aria-label', `ステージ${i + 1} ${s.name}`);
    if (i === currentStage) b.classList.add('active');
    if (i > unlockedStage) b.classList.add('locked');
    b.textContent = i > unlockedStage ? '🔒' : s.icon;
    b.disabled = i > unlockedStage;
    b.addEventListener('click', () => {
      if (i <= unlockedStage && i !== currentStage) {
        vibrate(15);
        currentStage = i;
        restartGame();
      }
    });
    stageMapEl.appendChild(b);
  });
}

function checkAchievement(key) {
  if (achievements.has(key) || !ACHIEVEMENTS[key]) return;
  achievements.add(key);
  showAchievementNotification(ACHIEVEMENTS[key].title, ACHIEVEMENTS[key].desc);
}

function showAchievementNotification(title, desc) {
  achievementTitleEl.textContent = title;
  achievementDescEl.textContent = desc;
  achievementEl.hidden = false;
  setTimeout(() => { achievementEl.hidden = true; }, 2200);
}

function showLevelUpNotification() {
  levelupLevelEl.textContent = `Level ${level}`;
  levelupEl.hidden = false;
  setTimeout(() => { levelupEl.hidden = true; }, 2200);
}

function startTimer() {
  clearInterval(timerId);
  timeLeft = QUESTION_TIME;
  timerEl.textContent = String(timeLeft);
  timerId = setInterval(() => {
    timeLeft -= 1;
    timerEl.textContent = String(timeLeft);
    if (timeLeft <= 0) {
      clearInterval(timerId);
      handleTimeout();
    }
  }, 1000);
}

function handleTimeout() {
  if (answerLocked) return;
  answerLocked = true;
  correctStreak = 0;
  vibrate([20, 40, 20]);
  document.querySelectorAll('.choice-btn').forEach((b) => { b.disabled = true; });
  const current = gameQuestions[currentQuestion];
  resultEl.innerHTML =
    `<div class="explain-block incorrect"><div class="title">⏰ TIME UP</div>` +
    `<div class="line"><strong>正解</strong> ${escapeHtml(current.answer)}</div>` +
    `<div class="line">${escapeHtml(current.meaning || '')}</div></div>`;
  setVisible(nextBtn, true);
  updateUI();
}

function showQuestion() {
  clearInterval(timerId);
  answerLocked = false;
  doubleActive = false;
  doubleBtn.classList.remove('armed');
  skillMessageEl.textContent = '';
  const current = gameQuestions[currentQuestion];
  questionEl.innerHTML =
    `<p><strong>${escapeHtml(current.jp)}</strong></p>` +
    `<p>${escapeHtml(current.sentence)}</p>`;
  const shuffled = [...current.choices].sort(() => Math.random() - 0.5);
  choicesEl.innerHTML = '';
  resultEl.innerHTML = '';
  setVisible(nextBtn, false);
  setVisible(restartBtn, false);
  shuffled.forEach((choice) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice-btn';
    btn.textContent = choice;
    btn.addEventListener('click', () => selectAnswer(choice));
    choicesEl.appendChild(btn);
  });
  if (playEl) playEl.scrollTop = 0;
  startTimer();
  updateUI();
}

function selectAnswer(selected) {
  if (answerLocked) return;
  answerLocked = true;
  clearInterval(timerId);
  const current = gameQuestions[currentQuestion];
  const correct = current.answer;
  const sentenceWithWord = current.sentence.replace(/\([^)]*\)/, correct);
  const isCorrect = selected === correct;

  vibrate(isCorrect ? 18 : [18, 30, 18]);

  document.querySelectorAll('.choice-btn').forEach((btn) => {
    btn.disabled = true;
    if (btn.textContent === selected) btn.classList.add(isCorrect ? 'correct' : 'incorrect');
    if (btn.textContent === correct) btn.classList.add('correct');
  });

  let expGained = 0;
  const meaning = current.meaning || '—';
  if (isCorrect) {
    score += 1;
    correctStreak += 1;
    maxStreak = Math.max(maxStreak, correctStreak);
    const scoreGain = doubleActive ? 20 : 10;
    totalScore += scoreGain;
    addMP(MP_PER_CORRECT);
    expGained = EXP_PER_CORRECT;
    if (correctStreak >= 3) {
      expGained += Math.min(correctStreak - 2, 5) * EXP_PER_STREAK;
    }
    if (score === 1) checkAchievement('firstCorrect');
    if (correctStreak === 3) checkAchievement('streak3');
    if (correctStreak === 5) checkAchievement('streak5');
    if (correctStreak === 10) checkAchievement('streak10');
    // 類義語・反対語は縦を圧迫するので出さない（意味＋獲得だけ）
    resultEl.innerHTML =
      `<div class="explain-block correct"><div class="title">${doubleActive ? '⚡ ' : ''}✅ 正解</div>` +
      `<div class="line"><strong>${escapeHtml(correct)}</strong> — ${escapeHtml(meaning)}</div>` +
      `<div class="line">+${expGained}XP / +${MP_PER_CORRECT}MP / +${scoreGain}</div></div>`;
  } else {
    correctStreak = 0;
    resultEl.innerHTML =
      `<div class="explain-block incorrect"><div class="title">❌ 不正解</div>` +
      `<div class="line"><strong>正解</strong> ${escapeHtml(correct)} — ${escapeHtml(meaning)}</div></div>`;
  }

  addExperience(expGained);
  if (totalScore >= 100) checkAchievement('score100');
  if (totalScore >= 500) checkAchievement('score500');
  speak(correct);
  setTimeout(() => speak(sentenceWithWord), 900);
  setVisible(nextBtn, true);
  updateUI();
}

hintBtn.addEventListener('click', () => {
  if (!spendMP(20)) { vibrate(8); return; }
  vibrate(15);
  const q = gameQuestions[currentQuestion];
  const a = q.answer;
  const custom = typeof q.hint === 'string' && q.hint.trim() ? q.hint.trim() : '';
  skillMessageEl.textContent = custom
    ? `💡 ${custom}`
    : `💡 「${a.charAt(0).toUpperCase()}」から / ${a.length}文字`;
});

halfBtn.addEventListener('click', () => {
  if (!spendMP(30)) { vibrate(8); return; }
  vibrate(15);
  const correct = gameQuestions[currentQuestion].answer;
  const wrong = [...document.querySelectorAll('.choice-btn')]
    .filter((b) => b.textContent !== correct && !b.disabled)
    .sort(() => Math.random() - 0.5)
    .slice(0, 2);
  wrong.forEach((b) => {
    b.disabled = true;
    b.classList.add('skill-hidden');
  });
  skillMessageEl.textContent = '✂ ハズレを2つ消した';
});

timeBtn.addEventListener('click', () => {
  if (!spendMP(30)) { vibrate(8); return; }
  vibrate(15);
  timeLeft += 5;
  timerEl.textContent = String(timeLeft);
  skillMessageEl.textContent = '⏱ +5秒';
});

doubleBtn.addEventListener('click', () => {
  if (!spendMP(40)) { vibrate(8); return; }
  vibrate(15);
  doubleActive = true;
  doubleBtn.classList.add('armed');
  skillMessageEl.textContent = '⚡ 次の正解スコア×2';
});

nextBtn.addEventListener('click', () => {
  vibrate(12);
  window.speechSynthesis.cancel();
  currentQuestion += 1;
  if (currentQuestion >= QUESTIONS_PER_GAME) showResult();
  else showQuestion();
});

restartBtn.addEventListener('click', () => {
  vibrate(12);
  restartGame();
});

function showResult() {
  clearInterval(timerId);
  answerLocked = true;
  const ratio = score / QUESTIONS_PER_GAME;
  const rank = ratio === 1 ? 'LEGEND' : ratio >= 0.8 ? 'MASTER' : ratio >= 0.6 ? 'CHALLENGER' : 'ROOKIE';
  const expBonus = ratio === 1 ? 50 : ratio >= 0.9 ? 30 : ratio >= 0.8 ? 20 : ratio >= 0.7 ? 15 : ratio >= 0.6 ? 10 : ratio >= 0.5 ? 5 : 0;
  if (ratio === 1) checkAchievement('perfectGame');
  if (expBonus) addExperience(expBonus);
  const cleared = ratio >= 0.6;
  if (cleared && currentStage < STAGES.length - 1) {
    unlockedStage = Math.max(unlockedStage, currentStage + 1);
  }
  questionEl.innerHTML =
    `<div class="final-result">` +
    `<div class="result-rank">${cleared ? 'STAGE CLEAR!' : 'TRY AGAIN'}</div>` +
    `<div class="result-stage">${STAGES[currentStage].icon} ${escapeHtml(STAGES[currentStage].name)}</div>` +
    `<div>${score}/${QUESTIONS_PER_GAME} ・ ${rank}</div>` +
    `${cleared && currentStage < 4 ? `<div class="unlock-message">🔓 STAGE ${currentStage + 2} 解放</div>` : ''}` +
    `${currentStage === 4 && cleared ? '<div class="unlock-message">👑 COMPLETE!</div>' : ''}` +
    `${expBonus ? `<div>+${expBonus} XP</div>` : ''}` +
    `</div>`;
  choicesEl.innerHTML = '';
  resultEl.innerHTML = '';
  setVisible(restartBtn, true);
  setVisible(nextBtn, false);
  updateUI();
}

function restartGame() {
  clearInterval(timerId);
  currentQuestion = 0;
  score = 0;
  correctStreak = 0;
  answerLocked = false;
  doubleBtn.classList.remove('armed');
  gameQuestions = pickQuestionsForStage(currentStage);
  resultEl.innerHTML = '';
  setVisible(restartBtn, false);
  setVisible(nextBtn, false);
  if (!gameQuestions.length) {
    questionEl.textContent = 'このステージの問題データがありません。';
    choicesEl.innerHTML = '';
    return;
  }
  showQuestion();
}

function normalizeQuestionData(data) {
  if (data && Array.isArray(data.stages) && data.stages.length) {
    return data.stages.map((s, i) => ({
      name: s.name || STAGES[i]?.name,
      icon: s.icon || STAGES[i]?.icon,
      theme: s.theme || '',
      questions: Array.isArray(s.questions) ? s.questions : []
    }));
  }
  if (Array.isArray(data)) {
    return STAGES.map((meta) => ({ ...meta, theme: 'legacy', questions: data }));
  }
  return [];
}

window.addEventListener('load', () => {
  window.speechSynthesis.onvoiceschanged = () => {};
  fetch('questions.fixed.json')
    .then((res) => res.json())
    .then((data) => {
      stageBanks = normalizeQuestionData(data);
      stageBanks.forEach((s, i) => {
        if (STAGES[i] && s.name) STAGES[i].name = s.name;
        if (STAGES[i] && s.icon) STAGES[i].icon = s.icon;
      });
      restartGame();
    })
    .catch((err) => {
      questionEl.textContent = 'クイズデータの読み込みに失敗しました。';
      console.error(err);
    });
});
