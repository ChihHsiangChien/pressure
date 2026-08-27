// 樊式壓力檢測量表百分等級常模對照表 (從 PDF 第 2 頁完整轉錄)

export const NORM_TABLE_ROWS = [
  { pr: 99, A: 15, B: 21, C: 12, D: 9, T: null },
  { pr: 98, A: 14, B: 20, C: null, D: null, T: null },
  { pr: 97, A: 13, B: 19, C: 11, D: null, T: 46 },
  { pr: 95, A: 12, B: 17, C: 10, D: 8, T: 42 },
  { pr: 90, A: 11, B: 15, C: 9, D: 7, T: 38 },
  { pr: 85, A: 10, B: 14, C: 8, D: 6, T: 35 },
  { pr: 80, A: 9, B: 13, C: 7, D: null, T: 33 },
  { pr: 75, A: 8, B: 12, C: null, D: 5, T: 30 }, // PR 75 為高壓力界限 (底線標註)
  { pr: 70, A: 7, B: 11, C: null, D: null, T: 27 },
  { pr: 65, A: 6, B: 10, C: 6, D: 4, T: 26 },
  { pr: 60, A: null, B: null, C: 5, D: null, T: 23 },
  { pr: 55, A: 5, B: 9, C: null, D: null, T: 22 },
  { pr: 50, A: null, B: 8, C: 4, D: 3, T: 20 },
  { pr: 45, A: 4, B: null, C: null, D: null, T: 18 },
  { pr: 40, A: 3, B: 7, C: 3, D: null, T: 16 },
  { pr: 35, A: null, B: 6, C: null, D: 2, T: 15 },
  { pr: 30, A: null, B: 5, C: null, D: null, T: 13 },
  { pr: 25, A: 2, B: 4, C: 2, D: 1, T: 11 }, // PR 25 為低壓力界限 (底線標註)
  { pr: 20, A: null, B: 3, C: null, D: null, T: 10 },
  { pr: 15, A: 1, B: 2, C: 1, D: null, T: 8 },
  { pr: 10, A: null, B: 1, C: 0, D: 0, T: 5 },
  { pr: 5, A: 0, B: null, C: null, D: null, T: 3 },
  { pr: 3, A: null, B: 0, C: null, D: null, T: 2 },
  { pr: 2, A: null, B: null, C: null, D: null, T: 1 },
  { pr: 1, A: null, B: null, C: null, D: null, T: 0 }
];

// 計算特定量表 (A, B, C, D, T) 的百分等級 (PR)
export function calculatePR(dimension, score) {
  const normPoints = NORM_TABLE_ROWS.filter(row => row[dimension] !== null)
    .map(row => ({ raw: row[dimension], pr: row.pr }))
    .sort((a, b) => b.raw - a.raw); // 高到低

  if (normPoints.length === 0) return 50;

  // 超過最大常模值
  if (score >= normPoints[0].raw) {
    if (score > normPoints[0].raw) return Math.min(99, normPoints[0].pr + (score - normPoints[0].raw));
    return normPoints[0].pr;
  }

  // 低於最小常模值
  const lowest = normPoints[normPoints.length - 1];
  if (score <= lowest.raw) {
    return Math.max(1, lowest.pr);
  }

  // 插值計算
  for (let i = 0; i < normPoints.length - 1; i++) {
    const pUpper = normPoints[i];
    const pLower = normPoints[i + 1];

    if (score === pUpper.raw) return pUpper.pr;
    if (score === pLower.raw) return pLower.pr;

    if (score < pUpper.raw && score > pLower.raw) {
      // 線性插值
      const ratio = (score - pLower.raw) / (pUpper.raw - pLower.raw);
      return Math.round(pLower.pr + ratio * (pUpper.pr - pLower.pr));
    }
  }

  return 50;
}

// 壓力等級判定
export function getStressLevelInfo(pr) {
  if (pr >= 90) {
    return {
      level: '極高壓力 (High Risk)',
      badgeClass: 'badge-danger',
      color: '#ef4444',
      bgGradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.05))',
      summary: '您的壓力百分等級高達 PR ' + pr + '，處於極高風險狀態！生理或心理已發出高度警訊，建議積極尋求醫療、心理諮商或專業身心調節協助。',
      recommendation: '強烈建議安排身心休養、減少非必要工作與承擔，向親友或心理師求助，並重新檢視生活節奏與壓力源。'
    };
  } else if (pr >= 75) {
    return {
      level: '偏高壓力 (Significant Stress)',
      badgeClass: 'badge-warning',
      color: '#f59e0b',
      bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.05))',
      summary: '您的壓力百分等級為 PR ' + pr + '，超過 PR 75 警戒線！顯示近期承受顯著壓力負擔，需特別留意身心狀況與反應。',
      recommendation: '建議開始實施減壓措施，針對分數偏高的向度（如運動、冥想、改變思考模式或調整行為作息）進行專項改善。'
    };
  } else if (pr >= 25) {
    return {
      level: '適中壓力 (Normal Range)',
      badgeClass: 'badge-info',
      color: '#3b82f6',
      bgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.05))',
      summary: '您的壓力百分等級為 PR ' + pr + '，處於 PR 25~75 常規適中範圍內。適度的壓力有助於保持警覺與動力，但仍需維持均衡生活。',
      recommendation: '請持續保持良好的作息與舒壓習慣，當某個向度出現短期升高時，適時進行微調。'
    };
  } else {
    return {
      level: '良好適應 (Low Stress)',
      badgeClass: 'badge-success',
      color: '#10b981',
      bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.05))',
      summary: '您的壓力百分等級為 PR ' + pr + '，低於 PR 25，身心狀況非常適應且穩定！',
      recommendation: '您的身心防禦與自我調節能力極佳，請繼續保持目前健康快樂的生活型態與心態。'
    };
  }
}
