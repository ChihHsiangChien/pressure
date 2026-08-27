/* ==========================================================================
   樊式壓力檢測量表 (Fan's Stress Self-Rating Scale) - Standalone Pure JS App
   ========================================================================== */

// 1. 題目數據 (21 items from PDF Page 1)
const QUESTIONS = [
  { id: 1, category: 'A', text: '相較於過去，最近眼睛比以前更容易覺得酸、乾澀、疲勞。' },
  { id: 2, category: 'A', text: '相較於過去，最近覺得自己皮膚膚質或髮質變差，像是痘痘變多、皮膚乾燥、白頭髮變多等。' },
  { id: 3, category: 'A', text: '相較於過去，最近胸口會悶悶、好像被勒緊般發痛。' },
  { id: 4, category: 'A', text: '相較於過去，最近有時會喘不過氣，有缺氧的感覺。' },
  { id: 5, category: 'A', text: '相較於過去，最近常覺得手腳冰冷，有麻麻的感覺。' },
  { id: 6, category: 'A', text: '相較於過去，最近站起來會頭暈，或是瞬間眼花站不穩。' },
  { id: 7, category: 'B', text: '相較於過去，最近比以前更容易疲倦，而且疲倦好像不太能消除。' },
  { id: 8, category: 'B', text: '相較於過去，最近稍微做點事就立刻感到疲倦。' },
  { id: 9, category: 'B', text: '相較於過去，即使早上睡醒仍覺得前一天的疲勞沒有完全消除。' },
  { id: 10, category: 'B', text: '相較於過去，最近對工作或課業提不起勁，也比較無法集中注意力。' },
  { id: 11, category: 'B', text: '相較於過去，最近覺得自己的記憶力變差，容易忘記事情。' },
  { id: 12, category: 'B', text: '相較於過去，最近自己容易做出錯誤的決定。' },
  { id: 13, category: 'B', text: '相較於過去，最近自己在判斷事情上比較難定下心來思考。' },
  { id: 14, category: 'C', text: '相較於過去，最近對人有些不想靠近的感覺。' },
  { id: 15, category: 'C', text: '相較於過去，最近容易為小事情感到煩躁、生氣。' },
  { id: 16, category: 'C', text: '相較於過去，最近覺得有太多事情加在自己身上，感到力不從心。' },
  { id: 17, category: 'C', text: '相較於過去，最近容易生氣，對事情沒有耐心、不耐煩、缺乏熱情。' },
  { id: 18, category: 'D', text: '相較於過去，最近即便吃飽了，還是會不斷想吃東西。' },
  { id: 19, category: 'D', text: '相較於過去，最近睡眠品質變差，半夜1、2點會醒來，然後再也睡不著。' },
  { id: 20, category: 'D', text: '相較於過去，最近經常做夢。' },
  { id: 21, category: 'D', text: '相較於過去，最近在人際上比較退縮，和人接觸或是見面，覺得很麻煩。' }
];

const RATING_OPTIONS = [
  { value: 0, label: '不符合' },
  { value: 1, label: '有一點符合' },
  { value: 2, label: '有一半符合' },
  { value: 3, label: '完全符合' }
];

const CATEGORIES = {
  A: {
    code: 'A',
    name: '生理特質',
    subtitle: '內分泌、身體發炎與軀體反應',
    maxScore: 18,
    questionRange: '1~6 題',
    color: '#f43f5e',
    advice: '建議藉由肢體活動（如有氧運動、瑜伽伸展），讓壓力有排解的去處，而不致於壓抑影響體內身體健康。'
  },
  B: {
    code: 'B',
    name: '認知反應',
    subtitle: '思考敏捷度、專注力與大腦疲勞',
    maxScore: 21,
    questionRange: '7~13 題',
    color: '#3b82f6',
    advice: '建議藉由改變思考方式與信念排解壓力，練習正念認知，讓大腦從反覆反芻中抽離，使思緒清晰、明快。'
  },
  C: {
    code: 'C',
    name: '情緒狀態',
    subtitle: '心情波動、煩躁易怒與心理耗竭',
    maxScore: 12,
    questionRange: '14~17 題',
    color: '#8b5cf6',
    advice: '建議藉由聽音樂、深度冥想、呼吸吐納與情緒抒發排解壓力，讓神經系統得以修復，使情緒恢復平衡穩定。'
  },
  D: {
    code: 'D',
    name: '行為表現',
    subtitle: '飲食睡眠規律與社交退縮行為',
    maxScore: 12,
    questionRange: '18~21 題',
    color: '#10b981',
    advice: '建議藉由覺察來瞭解並處理自己所承受的壓力，並適度做出些不同行動（如調整作息、邊界設定）達到減壓效果。'
  }
};

// 2. 常模對照表 (PDF Page 2)
const NORM_TABLE_ROWS = [
  { pr: 99, A: 15, B: 21, C: 12, D: 9, T: null },
  { pr: 98, A: 14, B: 20, C: null, D: null, T: null },
  { pr: 97, A: 13, B: 19, C: 11, D: null, T: 46 },
  { pr: 95, A: 12, B: 17, C: 10, D: 8, T: 42 },
  { pr: 90, A: 11, B: 15, C: 9, D: 7, T: 38 },
  { pr: 85, A: 10, B: 14, C: 8, D: 6, T: 35 },
  { pr: 80, A: 9, B: 13, C: 7, D: null, T: 33 },
  { pr: 75, A: 8, B: 12, C: null, D: 5, T: 30 },
  { pr: 70, A: 7, B: 11, C: null, D: null, T: 27 },
  { pr: 65, A: 6, B: 10, C: 6, D: 4, T: 26 },
  { pr: 60, A: null, B: null, C: 5, D: null, T: 23 },
  { pr: 55, A: 5, B: 9, C: null, D: null, T: 22 },
  { pr: 50, A: null, B: 8, C: 4, D: 3, T: 20 },
  { pr: 45, A: 4, B: null, C: null, D: null, T: 18 },
  { pr: 40, A: 3, B: 7, C: 3, D: null, T: 16 },
  { pr: 35, A: null, B: 6, C: null, D: 2, T: 15 },
  { pr: 30, A: null, B: 5, C: null, D: null, T: 13 },
  { pr: 25, A: 2, B: 4, C: 2, D: 1, T: 11 },
  { pr: 20, A: null, B: 3, C: null, D: null, T: 10 },
  { pr: 15, A: 1, B: 2, C: 1, D: null, T: 8 },
  { pr: 10, A: null, B: 1, C: 0, D: 0, T: 5 },
  { pr: 5, A: 0, B: null, C: null, D: null, T: 3 },
  { pr: 3, A: null, B: 0, C: null, D: null, T: 2 },
  { pr: 2, A: null, B: null, C: null, D: null, T: 1 },
  { pr: 1, A: null, B: null, C: null, D: null, T: 0 }
];

function calculatePR(dimension, score) {
  const normPoints = NORM_TABLE_ROWS.filter(row => row[dimension] !== null)
    .map(row => ({ raw: row[dimension], pr: row.pr }))
    .sort((a, b) => b.raw - a.raw);

  if (normPoints.length === 0) return 50;
  if (score >= normPoints[0].raw) return normPoints[0].pr;

  const lowest = normPoints[normPoints.length - 1];
  if (score <= lowest.raw) return lowest.pr;

  for (let i = 0; i < normPoints.length - 1; i++) {
    const pUpper = normPoints[i];
    const pLower = normPoints[i + 1];

    if (score === pUpper.raw) return pUpper.pr;
    if (score === pLower.raw) return pLower.pr;

    if (score < pUpper.raw && score > pLower.raw) {
      const ratio = (score - pLower.raw) / (pUpper.raw - pLower.raw);
      return Math.round(pLower.pr + ratio * (pUpper.pr - pLower.pr));
    }
  }

  return 50;
}

function getStressLevelInfo(pr) {
  if (pr >= 90) {
    return {
      level: '極高壓力 (High Risk)',
      badgeClass: 'badge-danger',
      summary: `您的壓力百分等級高達 PR ${pr}，處於極高風險狀態！生理或心理已發出高度警訊，建議積極尋求醫療、心理諮商或專業身心調節協助。`,
      recommendation: '強烈建議安排身心休養、減少非必要工作與承擔，向親友或心理師求助，並重新檢視生活節奏與壓力源。'
    };
  } else if (pr >= 75) {
    return {
      level: '偏高壓力 (Significant Stress)',
      badgeClass: 'badge-warning',
      summary: `您的壓力百分等級為 PR ${pr}，超過 PR 75 警戒線！顯示近期承受顯著壓力負擔，需特別留意身心狀況與反應。`,
      recommendation: '建議開始實施減壓措施，針對分數偏高的向度（如運動、冥想、改變思考模式或調整行為作息）進行專項改善。'
    };
  } else if (pr >= 25) {
    return {
      level: '適中壓力 (Normal Range)',
      badgeClass: 'badge-info',
      summary: `您的壓力百分等級為 PR ${pr}，處於 PR 25~75 常規適中範圍內。適度的壓力有助於保持警覺與動力，但仍需維持均衡生活。`,
      recommendation: '請持續保持良好的作息與舒壓習慣，當某個向度出現短期升高時，適時進行微調。'
    };
  } else {
    return {
      level: '良好適應 (Low Stress)',
      badgeClass: 'badge-success',
      summary: `您的壓力百分等級為 PR ${pr}，低於 PR 25，身心狀況非常適應且穩定！`,
      recommendation: '您的身心防禦與自我調節能力極佳，請繼續保持目前健康快樂的生活型態與心態。'
    };
  }
}

// 3. Application State & Controller
const state = {
  answers: {},
  activeCategory: 'ALL',
  theme: localStorage.getItem('fan_stress_theme') || 'dark',
  radarChartInstance: null,
  barChartInstance: null
};

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderQuestions();
  setupEventListeners();
  updateProgress();
  if (window.lucide) window.lucide.createIcons();
});

function initTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  updateThemeIcon();
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem('fan_stress_theme', state.theme);
  updateThemeIcon();
  if (state.radarChartInstance) renderCharts(calculateResults());
}

function updateThemeIcon() {
  const iconEl = document.getElementById('icon-theme');
  if (iconEl) {
    iconEl.setAttribute('data-lucide', state.theme === 'dark' ? 'sun' : 'moon');
    if (window.lucide) window.lucide.createIcons();
  }
}

function renderQuestions() {
  const container = document.getElementById('questions-list');
  container.innerHTML = '';

  const filtered = state.activeCategory === 'ALL' 
    ? QUESTIONS 
    : QUESTIONS.filter(q => q.category === state.activeCategory);

  filtered.forEach(q => {
    const card = document.createElement('div');
    card.className = `question-card glass-card ${state.answers[q.id] !== undefined ? 'answered' : ''}`;
    card.id = `q-card-${q.id}`;

    const catMeta = CATEGORIES[q.category];

    let optionsHtml = '';
    RATING_OPTIONS.forEach(opt => {
      const isSelected = state.answers[q.id] === opt.value;
      optionsHtml += `
        <button type="button" 
                class="option-btn ${isSelected ? 'selected' : ''}" 
                data-qid="${q.id}" 
                data-val="${opt.value}">
          <span class="option-val-pill">${opt.value} 分</span>
          <span class="option-label-text">${opt.label}</span>
        </button>
      `;
    });

    card.innerHTML = `
      <div class="question-header">
        <span class="question-num">第 ${q.id} 題</span>
        <span class="question-cat-tag cat-tag-${q.category.toLowerCase()}">${catMeta.code}. ${catMeta.name}</span>
      </div>
      <div class="question-text">${q.text}</div>
      <div class="options-group">
        ${optionsHtml}
      </div>
    `;

    container.appendChild(card);
  });

  container.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const qid = parseInt(btn.dataset.qid);
      const val = parseInt(btn.dataset.val);
      selectOption(qid, val);
    });
  });
}

function selectOption(qid, val) {
  state.answers[qid] = val;
  const card = document.getElementById(`q-card-${qid}`);
  if (card) {
    card.classList.add('answered');
    card.querySelectorAll('.option-btn').forEach(b => {
      if (parseInt(b.dataset.val) === val) b.classList.add('selected');
      else b.classList.remove('selected');
    });
  }
  updateProgress();
}

function updateProgress() {
  const answeredCount = Object.keys(state.answers).length;
  const totalCount = QUESTIONS.length;
  const percent = Math.round((answeredCount / totalCount) * 100);

  document.getElementById('answered-count').textContent = answeredCount;
  document.getElementById('progress-percent').textContent = `${percent}%`;
  document.getElementById('progress-bar-fill').style.width = `${percent}%`;

  const btnSubmit = document.getElementById('btn-submit');
  if (answeredCount === totalCount) {
    btnSubmit.removeAttribute('disabled');
  } else {
    btnSubmit.setAttribute('disabled', 'true');
  }
}

function setupEventListeners() {
  document.getElementById('category-tabs').addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.activeCategory = btn.dataset.category;
    renderQuestions();
  });

  document.getElementById('btn-toggle-theme').addEventListener('click', toggleTheme);
  document.getElementById('btn-fill-demo').addEventListener('click', fillDemoAnswers);
  document.getElementById('btn-clear').addEventListener('click', clearAnswers);
  document.getElementById('btn-scroll-top').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.getElementById('btn-submit').addEventListener('click', generateReport);
  
  document.getElementById('btn-back-to-test').addEventListener('click', () => {
    document.getElementById('report-section').classList.add('hidden');
    document.getElementById('questionnaire-section').classList.remove('hidden');
    document.getElementById('sticky-footer').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.getElementById('btn-copy-summary').addEventListener('click', copySummary);
  document.getElementById('btn-download-pdf').addEventListener('click', downloadPDF);
  document.getElementById('btn-print').addEventListener('click', () => window.print());
}

function fillDemoAnswers() {
  const demoVals = [2, 1, 2, 1, 0, 1, 2, 3, 2, 2, 1, 1, 2, 2, 3, 2, 1, 2, 3, 2, 1];
  QUESTIONS.forEach((q, idx) => { state.answers[q.id] = demoVals[idx]; });
  renderQuestions();
  updateProgress();
}

function clearAnswers() {
  if (Object.keys(state.answers).length > 0 && !confirm('確定要清空所有填答嗎？')) return;
  state.answers = {};
  renderQuestions();
  updateProgress();
}

function calculateResults() {
  let scoreA = 0, scoreB = 0, scoreC = 0, scoreD = 0;
  QUESTIONS.forEach(q => {
    const val = state.answers[q.id] || 0;
    if (q.category === 'A') scoreA += val;
    else if (q.category === 'B') scoreB += val;
    else if (q.category === 'C') scoreC += val;
    else if (q.category === 'D') scoreD += val;
  });

  const totalScore = scoreA + scoreB + scoreC + scoreD;

  const prA = calculatePR('A', scoreA);
  const prB = calculatePR('B', scoreB);
  const prC = calculatePR('C', scoreC);
  const prD = calculatePR('D', scoreD);
  const prT = calculatePR('T', totalScore);

  return {
    rawScores: { A: scoreA, B: scoreB, C: scoreC, D: scoreD, T: totalScore },
    percentileRanks: { A: prA, B: prB, C: prC, D: prD, T: prT },
    levelInfo: getStressLevelInfo(prT)
  };
}

function generateReport() {
  const results = calculateResults();

  document.getElementById('questionnaire-section').classList.add('hidden');
  document.getElementById('sticky-footer').classList.add('hidden');
  document.getElementById('report-section').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  const now = new Date();
  document.getElementById('report-timestamp').textContent = `檢測時間：${now.toLocaleString('zh-TW')}`;

  document.getElementById('res-total-score').textContent = results.rawScores.T;
  document.getElementById('res-total-pr').textContent = `PR ${results.percentileRanks.T}`;
  
  const badgeEl = document.getElementById('res-stress-badge');
  badgeEl.textContent = results.levelInfo.level;
  badgeEl.className = `badge ${results.levelInfo.badgeClass}`;

  document.getElementById('res-stress-level-title').textContent = results.levelInfo.level;
  document.getElementById('res-stress-summary').textContent = results.levelInfo.summary;
  document.getElementById('res-stress-recommendation-text').textContent = results.levelInfo.recommendation;

  renderCharts(results);
  renderDimensionsGrid(results);
  renderNormMatrixTable(results);

  if (window.confetti) {
    window.confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  }
}

function renderCharts(results) {
  const isDark = state.theme === 'dark';
  const textColor = isDark ? '#94a3b8' : '#475569';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  // Radar Chart
  const ctxRadar = document.getElementById('radarChart').getContext('2d');
  if (state.radarChartInstance) state.radarChartInstance.destroy();

  state.radarChartInstance = new Chart(ctxRadar, {
    type: 'radar',
    data: {
      labels: ['A. 生理特質', 'B. 認知反應', 'C. 情緒狀態', 'D. 行為表現'],
      datasets: [
        {
          label: '您的百分等級 (PR)',
          data: [
            results.percentileRanks.A,
            results.percentileRanks.B,
            results.percentileRanks.C,
            results.percentileRanks.D
          ],
          backgroundColor: 'rgba(99, 102, 241, 0.25)',
          borderColor: '#6366f1',
          borderWidth: 2,
          pointBackgroundColor: ['#f43f5e', '#3b82f6', '#8b5cf6', '#10b981'],
          pointRadius: 6
        },
        {
          label: '高壓警戒線 (PR 75)',
          data: [75, 75, 75, 75],
          borderColor: 'rgba(245, 158, 11, 0.6)',
          borderWidth: 1.5,
          borderDash: [4, 4],
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: { stepSize: 20, color: textColor, backdropColor: 'transparent' },
          grid: { color: gridColor },
          angleLines: { color: gridColor },
          pointLabels: { color: textColor, font: { size: 12, weight: '600' } }
        }
      },
      plugins: {
        legend: { labels: { color: textColor } }
      }
    }
  });

  // Bar Chart
  const ctxBar = document.getElementById('barChart').getContext('2d');
  if (state.barChartInstance) state.barChartInstance.destroy();

  state.barChartInstance = new Chart(ctxBar, {
    type: 'bar',
    data: {
      labels: ['A. 生理', 'B. 認知', 'C. 情緒', 'D. 行為', 'T. 總表'],
      datasets: [
        {
          label: '百分等級 (PR)',
          data: [
            results.percentileRanks.A,
            results.percentileRanks.B,
            results.percentileRanks.C,
            results.percentileRanks.D,
            results.percentileRanks.T
          ],
          backgroundColor: [
            'rgba(244, 63, 94, 0.7)',
            'rgba(59, 130, 246, 0.7)',
            'rgba(139, 92, 246, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(99, 102, 241, 0.85)'
          ],
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: { color: textColor },
          grid: { color: gridColor }
        },
        x: {
          ticks: { color: textColor },
          grid: { display: false }
        }
      },
      plugins: { legend: { display: false } }
    }
  });
}

function renderDimensionsGrid(results) {
  const container = document.getElementById('dimensions-detail-container');
  container.innerHTML = '';

  ['A', 'B', 'C', 'D'].forEach(code => {
    const meta = CATEGORIES[code];
    const rawScore = results.rawScores[code];
    const prVal = results.percentileRanks[code];

    const card = document.createElement('div');
    card.className = 'dim-card glass-card';
    card.style.setProperty('--dim-color', meta.color);

    card.innerHTML = `
      <div>
        <div class="dim-header">
          <div class="dim-title-group">
            <h4>${meta.code}. ${meta.name}</h4>
            <span class="dim-subtitle">${meta.subtitle} (${meta.questionRange})</span>
          </div>
          <div class="dim-score-badge">
            <span class="dim-score-val">${rawScore}</span>
            <span class="dim-score-max">/ ${meta.maxScore} 分</span>
          </div>
        </div>

        <div class="dim-pr-row">
          <span>常模百分等級</span>
          <span class="dim-pr-val">PR ${prVal} ${prVal >= 75 ? '⚠️ 偏高' : prVal <= 25 ? '✅ 良好' : '▶ 常規'}</span>
        </div>

        <div class="dim-bar-track">
          <div class="dim-bar-fill" style="width: ${prVal}%; background: ${meta.color};"></div>
        </div>
      </div>

      <div class="dim-advice-box">
        <strong>💡 身心舒解建議：</strong><br>
        ${meta.advice}
      </div>
    `;

    container.appendChild(card);
  });
}

function renderNormMatrixTable(results) {
  const tbody = document.getElementById('norm-table-tbody');
  tbody.innerHTML = '';

  NORM_TABLE_ROWS.forEach(row => {
    const tr = document.createElement('tr');
    if (row.pr === 75) tr.classList.add('cutoff-pr-75');
    if (row.pr === 25) tr.classList.add('cutoff-pr-25');

    tr.innerHTML = `
      <td><strong>${row.pr}</strong></td>
      ${formatMatrixCell('A', row.A, results.rawScores.A)}
      ${formatMatrixCell('B', row.B, results.rawScores.B)}
      ${formatMatrixCell('C', row.C, results.rawScores.C)}
      ${formatMatrixCell('D', row.D, results.rawScores.D)}
      ${formatMatrixCell('T', row.T, results.rawScores.T)}
      <td><strong>${row.pr}</strong></td>
    `;

    tbody.appendChild(tr);
  });
}

function formatMatrixCell(dimKey, tableVal, userRawScore) {
  if (tableVal === null) return `<td>-</td>`;
  const isMatch = tableVal === userRawScore;
  const isUnderlined = (dimKey === 'A' && (tableVal === 8 || tableVal === 2)) ||
                       (dimKey === 'B' && (tableVal === 12 || tableVal === 4)) ||
                       (dimKey === 'C' && tableVal === 2) ||
                       (dimKey === 'D' && (tableVal === 5 || tableVal === 1)) ||
                       (dimKey === 'T' && (tableVal === 30 || tableVal === 11));

  const style = isUnderlined ? 'text-decoration: underline; font-weight: 600;' : '';

  if (isMatch) return `<td class="user-score-highlight">${tableVal} 🎯</td>`;
  return `<td style="${style}">${tableVal}</td>`;
}

function copySummary() {
  const res = calculateResults();
  const text = `【樊式壓力檢測量表 - 檢測報告摘要】
總得分：${res.rawScores.T} / 63 分 (PR ${res.percentileRanks.T})
壓力判定：${res.levelInfo.level}

四大向度分析：
- A. 生理特質：${res.rawScores.A}/18 分 (PR ${res.percentileRanks.A})
- B. 認知反應：${res.rawScores.B}/21 分 (PR ${res.percentileRanks.B})
- C. 情緒狀態：${res.rawScores.C}/12 分 (PR ${res.percentileRanks.C})
- D. 行為表現：${res.rawScores.D}/12 分 (PR ${res.percentileRanks.D})

建議：
${res.levelInfo.recommendation}`;

  navigator.clipboard.writeText(text).then(() => alert('已複製檢測報告摘要！')).catch(() => alert('複製失敗。'));
}

async function downloadPDF() {
  const reportEl = document.getElementById('printable-report');
  const btn = document.getElementById('btn-download-pdf');
  const originalText = btn.innerHTML;
  btn.textContent = '產出中...';

  try {
    const canvas = await window.html2canvas(reportEl, {
      scale: 2,
      useCORS: true,
      backgroundColor: state.theme === 'dark' ? '#0f172a' : '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`樊式壓力檢測報告_${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (err) {
    console.error('PDF error:', err);
    alert('PDF 產出失敗，請使用瀏覽器列印功能另存 PDF。');
  } finally {
    btn.innerHTML = originalText;
    if (window.lucide) window.lucide.createIcons();
  }
}
