import { QUESTIONS, RATING_OPTIONS, CATEGORIES } from './questionsData.js';
import { NORM_TABLE_ROWS, calculatePR, getStressLevelInfo } from './normData.js';
import Chart from 'chart.js/auto';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { createIcons, icons } from 'lucide';

// Application State
const state = {
  answers: {}, // { 1: 2, 2: 1, ... }
  activeCategory: 'ALL',
  theme: localStorage.getItem('fan_stress_theme') || 'dark',
  radarChartInstance: null,
  barChartInstance: null
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderQuestions();
  setupEventListeners();
  updateProgress();
  createIcons({ icons });
});

// Theme Management
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
    createIcons({ icons });
  }
}

// Render Questions
function renderQuestions() {
  const container = document.getElementById('questions-list');
  container.innerHTML = '';

  const filteredQuestions = state.activeCategory === 'ALL' 
    ? QUESTIONS 
    : QUESTIONS.filter(q => q.category === state.activeCategory);

  filteredQuestions.forEach((q) => {
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

  // Attach event listeners for option buttons
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
  
  // Update card UI state
  const card = document.getElementById(`q-card-${qid}`);
  if (card) {
    card.classList.add('answered');
    card.querySelectorAll('.option-btn').forEach(b => {
      if (parseInt(b.dataset.val) === val) {
        b.classList.add('selected');
      } else {
        b.classList.remove('selected');
      }
    });
  }

  updateProgress();
}

// Update Sticky Progress Bar
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
    btnSubmit.classList.add('pulse');
  } else {
    btnSubmit.setAttribute('disabled', 'true');
    btnSubmit.classList.remove('pulse');
  }
}

// Category Filter Handling
function setupEventListeners() {
  // Category tabs
  document.getElementById('category-tabs').addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.activeCategory = btn.dataset.category;
    renderQuestions();
  });

  // Toggle Theme
  document.getElementById('btn-toggle-theme').addEventListener('click', toggleTheme);

  // Fill Demo Answers
  document.getElementById('btn-fill-demo').addEventListener('click', fillDemoAnswers);

  // Reset Answers
  document.getElementById('btn-clear').addEventListener('click', clearAnswers);

  // Scroll to Top
  document.getElementById('btn-scroll-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Submit / Generate Report
  document.getElementById('btn-submit').addEventListener('click', generateReport);

  // Back to Test
  document.getElementById('btn-back-to-test').addEventListener('click', () => {
    document.getElementById('report-section').classList.add('hidden');
    document.getElementById('questionnaire-section').classList.remove('hidden');
    document.getElementById('sticky-footer').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Copy Summary
  document.getElementById('btn-copy-summary').addEventListener('click', copySummary);

  // Download PDF
  document.getElementById('btn-download-pdf').addEventListener('click', downloadPDF);

  // Print Report
  document.getElementById('btn-print').addEventListener('click', () => {
    window.print();
  });
}

// Preset Demo Fill
function fillDemoAnswers() {
  const demoVals = [2, 1, 2, 1, 0, 1, 2, 3, 2, 2, 1, 1, 2, 2, 3, 2, 1, 2, 3, 2, 1];
  QUESTIONS.forEach((q, idx) => {
    state.answers[q.id] = demoVals[idx];
  });
  renderQuestions();
  updateProgress();
}

// Clear Answers
function clearAnswers() {
  if (Object.keys(state.answers).length > 0 && !confirm('確定要清空所有填答結果嗎？')) return;
  state.answers = {};
  renderQuestions();
  updateProgress();
}

// Results Calculation
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

  const levelInfo = getStressLevelInfo(prT);

  return {
    rawScores: { A: scoreA, B: scoreB, C: scoreC, D: scoreD, T: totalScore },
    percentileRanks: { A: prA, B: prB, C: prC, D: prD, T: prT },
    levelInfo
  };
}

// Generate & Render Report
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

  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 }
  });
}

// Render Radar & Bar Charts
function renderCharts(results) {
  const isDark = state.theme === 'dark';
  const textColor = isDark ? '#94a3b8' : '#475569';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  // 1. Radar Chart
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
          pointRadius: 6,
          pointHoverRadius: 8
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

  // 2. Bar Chart
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
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// Render Dimensions Grid
function renderDimensionsGrid(results) {
  const container = document.getElementById('dimensions-detail-container');
  container.innerHTML = '';

  const dimKeys = ['A', 'B', 'C', 'D'];
  dimKeys.forEach(code => {
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

// Render Norm Profile Table Matrix
function renderNormMatrixTable(results) {
  const tbody = document.getElementById('norm-table-tbody');
  tbody.innerHTML = '';

  NORM_TABLE_ROWS.forEach(row => {
    const tr = document.createElement('tr');
    if (row.pr === 75) tr.classList.add('cutoff-pr-75');
    if (row.pr === 25) tr.classList.add('cutoff-pr-25');

    const cellA = formatMatrixCell('A', row.A, results.rawScores.A);
    const cellB = formatMatrixCell('B', row.B, results.rawScores.B);
    const cellC = formatMatrixCell('C', row.C, results.rawScores.C);
    const cellD = formatMatrixCell('D', row.D, results.rawScores.D);
    const cellT = formatMatrixCell('T', row.T, results.rawScores.T);

    tr.innerHTML = `
      <td><strong>${row.pr}</strong></td>
      ${cellA}
      ${cellB}
      ${cellC}
      ${cellD}
      ${cellT}
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

  let style = isUnderlined ? 'text-decoration: underline; font-weight: 600;' : '';

  if (isMatch) {
    return `<td class="user-score-highlight">${tableVal} 🎯</td>`;
  } else {
    return `<td style="${style}">${tableVal}</td>`;
  }
}

// Copy Text Summary to Clipboard
function copySummary() {
  const res = calculateResults();
  const summaryText = `【樊式壓力檢測量表 - 檢測報告摘要】
總得分：${res.rawScores.T} / 63 分 (百分等級: PR ${res.percentileRanks.T})
壓力判定：${res.levelInfo.level}

四大向度分析：
- A. 生理特質：${res.rawScores.A}/18 分 (PR ${res.percentileRanks.A})
- B. 認知反應：${res.rawScores.B}/21 分 (PR ${res.percentileRanks.B})
- C. 情緒狀態：${res.rawScores.C}/12 分 (PR ${res.percentileRanks.C})
- D. 行為表現：${res.rawScores.D}/12 分 (PR ${res.percentileRanks.D})

建議專區：
${res.levelInfo.recommendation}`;

  navigator.clipboard.writeText(summaryText).then(() => {
    alert('已複製診斷報告摘要至剪貼簿！');
  }).catch(() => {
    alert('複製失敗，請手動複製。');
  });
}

// Download PDF Report
async function downloadPDF() {
  const reportEl = document.getElementById('printable-report');
  const btn = document.getElementById('btn-download-pdf');
  const originalText = btn.innerHTML;

  btn.innerHTML = `<i data-lucide="loader"></i> 產出中...`;
  createIcons({ icons });

  try {
    const canvas = await html2canvas(reportEl, {
      scale: 2,
      useCORS: true,
      backgroundColor: state.theme === 'dark' ? '#0f172a' : '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`樊式壓力檢測報告_${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (err) {
    console.error('Export PDF error:', err);
    alert('PDF 匯出失敗，請使用瀏覽器預設的列印功能另存為 PDF。');
  } finally {
    btn.innerHTML = originalText;
    createIcons({ icons });
  }
}
