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

let currentQuestion = 0, score = 0, correctStreak = 0;
let gameQuestions = [];
/** @type {Array<{name?:string,icon?:string,theme?:string,questions:Array}>} */
let stageBanks = [];
let level = 1, experience = 0, totalScore = 0, totalExperience = 0;
let achievements = new Set(), maxStreak = 0;
let mp = 0, currentStage = 0, unlockedStage = 0;
let timeLeft = QUESTION_TIME, timerId = null, answerLocked = false, doubleActive = false;

function getStageBank(stageIndex) {
  const bank = stageBanks[stageIndex];
  if (bank && Array.isArray(bank.questions) && bank.questions.length) return bank.questions;
  // フォールバック: 他ステージから集める
  const merged = stageBanks.flatMap((s) => (s && Array.isArray(s.questions) ? s.questions : []));
  return merged;
}

function pickQuestionsForStage(stageIndex) {
  const pool = [...getStageBank(stageIndex)];
  if (!pool.length) return [];
  pool.sort(() => Math.random() - 0.5);
  const n = Math.min(QUESTIONS_PER_GAME, pool.length);
  return pool.slice(0, n);
}

const ACHIEVEMENTS = {
  firstCorrect: { title:'初回正解', desc:'最初の問題に正解しました！' },
  streak3: { title:'連続正解3回', desc:'3回連続で正解しました！' },
  streak5: { title:'連続正解5回', desc:'5回連続で正解しました！' },
  streak10: { title:'連続正解10回', desc:'10回連続で正解しました！' },
  perfectGame: { title:'パーフェクト', desc:'全問正解でクリアしました！' },
  levelUp: { title:'レベルアップ', desc:'レベルが上がりました！' },
  score100: { title:'スコア100', desc:'累計スコアが100に達しました！' },
  score500: { title:'スコア500', desc:'累計スコアが500に達しました！' }
};

function speak(text) {
  if (!text || !('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US'; u.volume = 1; u.rate = .9; u.pitch = 1;
  const voices = window.speechSynthesis.getVoices();
  u.voice = voices.find(v => v.lang === 'en-US') || voices.find(v => v.lang.startsWith('en')) || null;
  window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
}

function addExperience(exp) {
  experience += exp; totalExperience += exp;
  while (experience >= EXP_PER_LEVEL) { experience -= EXP_PER_LEVEL; levelUp(); }
  updateUI();
}
function levelUp() { level++; showLevelUpNotification(); checkAchievement('levelUp'); }
function addMP(amount) { mp = Math.min(MAX_MP, mp + amount); updateUI(); }
function spendMP(cost) { if (mp < cost || answerLocked) return false; mp -= cost; updateUI(); return true; }

function updateUI() {
  levelNumberEl.textContent = level;
  expFillEl.style.width = `${experience}%`; expTextEl.textContent = `${experience} / 100 XP`;
  streakEl.textContent = correctStreak; totalScoreEl.textContent = totalScore;
  progressFillEl.style.width = `${((currentQuestion + 1) / QUESTIONS_PER_GAME) * 100}%`;
  questionCounterEl.textContent = `${Math.min(currentQuestion + 1, QUESTIONS_PER_GAME)} / ${QUESTIONS_PER_GAME}`;
  mpFillEl.style.width = `${mp}%`; mpTextEl.textContent = `${mp} / ${MAX_MP}`;
  timerEl.textContent = timeLeft;
  stageNumberEl.textContent = currentStage + 1; stageNameEl.textContent = STAGES[currentStage].name; stageIconEl.textContent = STAGES[currentStage].icon;
  [hintBtn, halfBtn, timeBtn, doubleBtn].forEach(b => b.disabled = answerLocked);
  hintBtn.classList.toggle('unavailable', mp < 20); halfBtn.classList.toggle('unavailable', mp < 30);
  timeBtn.classList.toggle('unavailable', mp < 30); doubleBtn.classList.toggle('unavailable', mp < 40);
  renderStageMap();
}

function renderStageMap() {
  stageMapEl.innerHTML = '';
  STAGES.forEach((s, i) => {
    const b = document.createElement('button'); b.className = 'stage-node';
    if (i === currentStage) b.classList.add('active');
    if (i > unlockedStage) b.classList.add('locked');
    b.innerHTML = `<span>${i > unlockedStage ? '🔒' : s.icon}</span><small>${i + 1}</small>`;
    b.disabled = i > unlockedStage;
    b.addEventListener('click', () => { if (i <= unlockedStage && i !== currentStage) { currentStage = i; restartGame(); } });
    stageMapEl.appendChild(b);
  });
}

function checkAchievement(key) {
  if (achievements.has(key) || !ACHIEVEMENTS[key]) return;
  achievements.add(key); showAchievementNotification(ACHIEVEMENTS[key].title, ACHIEVEMENTS[key].desc);
}
function showAchievementNotification(title, desc) {
  achievementTitleEl.textContent = title; achievementDescEl.textContent = desc; achievementEl.style.display = 'block';
  setTimeout(() => achievementEl.style.display = 'none', 3000);
}
function showLevelUpNotification() {
  levelupLevelEl.textContent = `Level ${level}`; levelupEl.style.display = 'block';
  setTimeout(() => levelupEl.style.display = 'none', 3000);
}

function startTimer() {
  clearInterval(timerId); timeLeft = QUESTION_TIME; timerEl.textContent = timeLeft;
  timerId = setInterval(() => {
    timeLeft--; timerEl.textContent = timeLeft;
    if (timeLeft <= 0) { clearInterval(timerId); handleTimeout(); }
  }, 1000);
}
function handleTimeout() {
  if (answerLocked) return;
  answerLocked = true; correctStreak = 0;
  document.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);
  const current = gameQuestions[currentQuestion];
  resultEl.innerHTML = `<div class="explain-block incorrect"><div class="title">⏰ <strong>TIME UP!</strong></div><div class="line"><strong>● 正解：</strong> ${current.answer}</div><div class="line"><strong>● 意味：</strong> ${current.meaning}</div></div>`;
  nextBtn.style.display = 'block'; updateUI();
}

function showQuestion() {
  clearInterval(timerId); answerLocked = false; doubleActive = false; skillMessageEl.textContent = '';
  const current = gameQuestions[currentQuestion];
  questionEl.innerHTML = `<p><strong>${current.jp}</strong></p><p>${current.sentence}</p>`;
  const shuffled = [...current.choices].sort(() => Math.random() - .5);
  choicesEl.innerHTML = ''; resultEl.innerHTML = ''; nextBtn.style.display = 'none';
  shuffled.forEach(choice => {
    const btn = document.createElement('button'); btn.className = 'choice-btn'; btn.innerText = choice;
    btn.addEventListener('click', () => selectAnswer(choice)); choicesEl.appendChild(btn);
  });
  startTimer(); updateUI();
}

function selectAnswer(selected) {
  if (answerLocked) return; answerLocked = true; clearInterval(timerId);
  const current = gameQuestions[currentQuestion], correct = current.answer;
  const sentenceWithWord = current.sentence.replace(/\([^)]*\)/, correct);
  document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.disabled = true;
    if (btn.innerText === selected) btn.classList.add(selected === correct ? 'correct' : 'incorrect');
    if (btn.innerText === correct) btn.classList.add('correct');
  });
  let expGained = 0, streakBonus = 0;
  const meaning = current.meaning || '—';
  const synonym = current.synonym || '—';
  const antonym = current.antonym || '—';
  if (selected === correct) {
    score++; correctStreak++; maxStreak = Math.max(maxStreak, correctStreak);
    const scoreGain = doubleActive ? 20 : 10; totalScore += scoreGain; addMP(MP_PER_CORRECT);
    expGained = EXP_PER_CORRECT;
    if (correctStreak >= 3) { streakBonus = Math.min(correctStreak - 2, 5) * EXP_PER_STREAK; expGained += streakBonus; }
    if (score === 1) checkAchievement('firstCorrect');
    if (correctStreak === 3) checkAchievement('streak3'); if (correctStreak === 5) checkAchievement('streak5'); if (correctStreak === 10) checkAchievement('streak10');
    resultEl.innerHTML = `<div class="explain-block correct"><div class="title">${doubleActive ? '⚡ DOUBLE! ' : ''}✅ <strong>正解！</strong></div><div class="line"><strong>● 単語：</strong> ${correct}</div><div class="line"><strong>● 意味：</strong> ${meaning}</div><div class="line"><strong>● 類義語：</strong> ${synonym}</div><div class="line"><strong>● 反対語：</strong> ${antonym}</div><div class="line"><strong>● 獲得：</strong> ${expGained} XP / +${MP_PER_CORRECT} MP / +${scoreGain} SCORE</div></div>`;
  } else {
    correctStreak = 0;
    resultEl.innerHTML = `<div class="explain-block incorrect"><div class="title">❌ <strong>不正解…</strong></div><div class="line"><strong>● 正解：</strong> ${correct}</div><div class="line"><strong>● 意味：</strong> ${meaning}</div><div class="line"><strong>● 類義語：</strong> ${synonym}</div><div class="line"><strong>● 反対語：</strong> ${antonym}</div></div>`;
  }
  addExperience(expGained); if (totalScore >= 100) checkAchievement('score100'); if (totalScore >= 500) checkAchievement('score500');
  speak(correct); setTimeout(() => speak(sentenceWithWord), 1000); nextBtn.style.display = 'block'; updateUI();
}

hintBtn.addEventListener('click', () => {
  if (!spendMP(20)) return;
  const q = gameQuestions[currentQuestion];
  const a = q.answer;
  const custom = typeof q.hint === 'string' && q.hint.trim() ? q.hint.trim() : '';
  skillMessageEl.textContent = custom
    ? `💡 HINT：${custom}`
    : `💡 HINT：正解は「${a.charAt(0).toUpperCase()}」から始まる / ${a.length}文字`;
});
halfBtn.addEventListener('click', () => {
  if (!spendMP(30)) return; const correct = gameQuestions[currentQuestion].answer;
  const wrong = [...document.querySelectorAll('.choice-btn')].filter(b => b.innerText !== correct && !b.disabled).sort(() => Math.random() - .5).slice(0, 2);
  wrong.forEach(b => { b.disabled = true; b.classList.add('skill-hidden'); }); skillMessageEl.textContent = '✂️ HALF：ハズレを2つ消した！';
});
timeBtn.addEventListener('click', () => {
  if (!spendMP(30)) return; timeLeft += 5; timerEl.textContent = timeLeft; skillMessageEl.textContent = '⏱ TIME STOP：残り時間 +5秒！';
});
doubleBtn.addEventListener('click', () => {
  if (!spendMP(40)) return; doubleActive = true; doubleBtn.classList.add('armed'); skillMessageEl.textContent = '⚡ DOUBLE：この問題のスコアが2倍！';
});

nextBtn.addEventListener('click', () => {
  window.speechSynthesis.cancel(); currentQuestion++;
  if (currentQuestion >= QUESTIONS_PER_GAME) showResult(); else showQuestion();
});
restartBtn.addEventListener('click', restartGame);

function showResult() {
  clearInterval(timerId); answerLocked = true; const ratio = score / QUESTIONS_PER_GAME;
  let rank = ratio === 1 ? 'LEGEND' : ratio >= .8 ? 'MASTER' : ratio >= .6 ? 'CHALLENGER' : 'ROOKIE';
  let expBonus = ratio === 1 ? 50 : ratio >= .9 ? 30 : ratio >= .8 ? 20 : ratio >= .7 ? 15 : ratio >= .6 ? 10 : ratio >= .5 ? 5 : 0;
  if (ratio === 1) checkAchievement('perfectGame'); if (expBonus) addExperience(expBonus);
  const cleared = ratio >= .6;
  if (cleared && currentStage < STAGES.length - 1) unlockedStage = Math.max(unlockedStage, currentStage + 1);
  questionEl.innerHTML = `<div class="final-result"><div class="result-rank">${cleared ? 'STAGE CLEAR!' : 'TRY AGAIN'}</div><div class="result-stage">${STAGES[currentStage].icon} ${STAGES[currentStage].name}</div><div>スコア：${score} / ${QUESTIONS_PER_GAME}</div><div>RANK：<strong>${rank}</strong></div>${cleared && currentStage < 4 ? `<div class="unlock-message">🔓 STAGE ${currentStage + 2} 解放！</div>` : ''}${currentStage === 4 && cleared ? '<div class="unlock-message">👑 ENGLISH QUEST COMPLETE!</div>' : ''}${expBonus ? `<div>+${expBonus} XP BONUS</div>` : ''}</div>`;
  choicesEl.innerHTML = ''; resultEl.innerHTML = ''; restartBtn.style.display = 'block'; nextBtn.style.display = 'none'; updateUI();
}

function restartGame() {
  clearInterval(timerId); currentQuestion = 0; score = 0; correctStreak = 0; answerLocked = false;
  doubleBtn.classList.remove('armed');
  gameQuestions = pickQuestionsForStage(currentStage);
  resultEl.innerHTML = ''; restartBtn.style.display = 'none'; nextBtn.style.display = 'none';
  if (!gameQuestions.length) {
    questionEl.innerHTML = 'このステージの問題データがありません。';
    choicesEl.innerHTML = '';
    return;
  }
  showQuestion();
}

function normalizeQuestionData(data) {
  // v2: { stages: [ { questions: [...] }, ... ] }
  if (data && Array.isArray(data.stages) && data.stages.length) {
    return data.stages.map((s, i) => ({
      name: s.name || STAGES[i]?.name,
      icon: s.icon || STAGES[i]?.icon,
      theme: s.theme || '',
      questions: Array.isArray(s.questions) ? s.questions : []
    }));
  }
  // v1 互換: フラット配列 → 全ステージ共通（非推奨）
  if (Array.isArray(data)) {
    return STAGES.map((meta) => ({ ...meta, theme: 'legacy', questions: data }));
  }
  return [];
}

window.onload = () => {
  window.speechSynthesis.onvoiceschanged = () => {};
  fetch('questions.fixed.json')
    .then((res) => res.json())
    .then((data) => {
      stageBanks = normalizeQuestionData(data);
      // JSON側の名前・アイコンがあれば UI 定義を上書き
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
};