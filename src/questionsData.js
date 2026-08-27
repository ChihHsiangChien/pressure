export const QUESTIONS = [
  {
    id: 1,
    category: 'A',
    categoryName: '生理特質',
    text: '相較於過去，最近眼睛比以前更容易覺得酸、乾澀、疲勞。'
  },
  {
    id: 2,
    category: 'A',
    categoryName: '生理特質',
    text: '相較於過去，最近覺得自己皮膚膚質或髮質變差，像是痘痘變多、皮膚乾燥、白頭髮變多等。'
  },
  {
    id: 3,
    category: 'A',
    categoryName: '生理特質',
    text: '相較於過去，最近胸口會悶悶、好像被勒緊般發痛。'
  },
  {
    id: 4,
    category: 'A',
    categoryName: '生理特質',
    text: '相較於過去，最近有時會喘不過氣，有缺氧的感覺。'
  },
  {
    id: 5,
    category: 'A',
    categoryName: '生理特質',
    text: '相較於過去，最近常覺得手腳冰冷，有麻麻的感覺。'
  },
  {
    id: 6,
    category: 'A',
    categoryName: '生理特質',
    text: '相較於過去，最近站起來會頭暈，或是瞬間眼花站不穩。'
  },
  {
    id: 7,
    category: 'B',
    categoryName: '認知反應',
    text: '相較於過去，最近比以前更容易疲倦，而且疲倦好像不太能消除。'
  },
  {
    id: 8,
    category: 'B',
    categoryName: '認知反應',
    text: '相較於過去，最近稍微做點事就立刻感到疲倦。'
  },
  {
    id: 9,
    category: 'B',
    categoryName: '認知反應',
    text: '相較於過去，即使早上睡醒仍覺得前一天的疲勞沒有完全消除。'
  },
  {
    id: 10,
    category: 'B',
    categoryName: '認知反應',
    text: '相較於過去，最近對工作或課業提不起勁，也比較無法集中注意力。'
  },
  {
    id: 11,
    category: 'B',
    categoryName: '認知反應',
    text: '相較於過去，最近覺得自己的記憶力變差，容易忘記事情。'
  },
  {
    id: 12,
    category: 'B',
    categoryName: '認知反應',
    text: '相較於過去，最近自己容易做出錯誤的決定。'
  },
  {
    id: 13,
    category: 'B',
    categoryName: '認知反應',
    text: '相較於過去，最近自己在判斷事情上比較難定下心來思考。'
  },
  {
    id: 14,
    category: 'C',
    categoryName: '情緒狀態',
    text: '相較於過去，最近對人有些不想靠近的感覺。'
  },
  {
    id: 15,
    category: 'C',
    categoryName: '情緒狀態',
    text: '相較於過去，最近容易為小事情感到煩躁、生氣。'
  },
  {
    id: 16,
    category: 'C',
    categoryName: '情緒狀態',
    text: '相較於過去，最近覺得有太多事情加在自己身上，感到力不從心。'
  },
  {
    id: 17,
    category: 'C',
    categoryName: '情緒狀態',
    text: '相較於過去，最近容易生氣，對事情沒有耐心、不耐煩、缺乏熱情。'
  },
  {
    id: 18,
    category: 'D',
    categoryName: '行為表現',
    text: '相較於過去，最近即便吃飽了，還是會不斷想吃東西。'
  },
  {
    id: 19,
    category: 'D',
    categoryName: '行為表現',
    text: '相較於過去，最近睡眠品質變差，半夜1、2點會醒來，然後再也睡不著。'
  },
  {
    id: 20,
    category: 'D',
    categoryName: '行為表現',
    text: '相較於過去，最近經常做夢。'
  },
  {
    id: 21,
    category: 'D',
    categoryName: '行為表現',
    text: '相較於過去，最近在人際上比較退縮，和人接觸或是見面，覺得很麻煩。'
  }
];

export const RATING_OPTIONS = [
  { value: 0, label: '不符合', desc: '近一個月無此現象' },
  { value: 1, label: '有一點符合', desc: '偶爾出現或輕微感受' },
  { value: 2, label: '有一半符合', desc: '經常出現或中度感受' },
  { value: 3, label: '完全符合', desc: '持續出現或嚴重感受' }
];

export const CATEGORIES = {
  A: {
    code: 'A',
    name: '生理特質',
    subtitle: '內分泌、身體發炎與軀體反應',
    maxScore: 18,
    questionRange: '1~6 題',
    color: '#f43f5e', // Rose
    lightBg: 'rgba(244, 63, 94, 0.1)',
    advice: '建議藉由肢體活動（如有氧運動、瑜伽伸展），讓壓力有排解的去處，而不致於壓抑影響體內身體健康。'
  },
  B: {
    code: 'B',
    name: '認知反應',
    subtitle: '思考敏捷度、專注力與大腦疲勞',
    maxScore: 21,
    questionRange: '7~13 題',
    color: '#3b82f6', // Blue
    lightBg: 'rgba(59, 130, 246, 0.1)',
    advice: '建議藉由改變思考方式與信念排解壓力，練習正念認知，讓大腦從反覆反芻中抽離，使思緒清晰、明快。'
  },
  C: {
    code: 'C',
    name: '情緒狀態',
    subtitle: '心情波動、煩躁易怒與心理耗竭',
    maxScore: 12,
    questionRange: '14~17 題',
    color: '#8b5cf6', // Violet
    lightBg: 'rgba(139, 92, 246, 0.1)',
    advice: '建議藉由聽音樂、深度冥想、呼吸吐納與情緒抒發排解壓力，讓神經系統得以修復，使情緒恢復平衡穩定。'
  },
  D: {
    code: 'D',
    name: '行為表現',
    subtitle: '飲食睡眠規律與社交退縮行為',
    maxScore: 12,
    questionRange: '18~21 題',
    color: '#10b981', // Emerald
    lightBg: 'rgba(16, 185, 129, 0.1)',
    advice: '建議藉由覺察來瞭解並處理自己所承受的壓力，並適度做出些不同行動（如調整作息、邊界設定）達到減壓效果。'
  }
};
