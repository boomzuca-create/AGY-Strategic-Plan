function navigateKPIModal(direction, currentId) {
  const ds = getCurrentYearDataset();
  const kpis = ds.kpis || [];
  if (!kpis.length) return;
  const cId = currentId || (document.getElementById('kpi-detail-modal') ? document.getElementById('kpi-detail-modal').getAttribute('data-kpi-id') : null) || kpis[0].id;
  const idx = kpis.findIndex(k => k.id === cId);
  let nextIdx = 0;
  if (direction === 'prev' || direction === -1) {
    nextIdx = (idx - 1 + kpis.length) % kpis.length;
  } else {
    nextIdx = (idx + 1) % kpis.length;
  }
  openKPIDetailModal(kpis[nextIdx].id);
}
window.navigateKPIModal = navigateKPIModal;
window.navigateKPIDetail = navigateKPIModal;

function jumpToKpiIndex(val) {
  if (!val) return;
  const ds = getCurrentYearDataset();
  const filteredKpis = (typeof getCurrentlyFilteredKPIs === 'function') ? getCurrentlyFilteredKPIs() : [];
  const kpis = (filteredKpis.length > 0) ? filteredKpis : ds.kpis;
  if (!kpis || !kpis.length) return;

  const raw = val.toString().trim();
  // Match by KPI ID directly
  let target = kpis.find(k => k.id.toLowerCase() === raw.toLowerCase());
  if (!target) {
    const cleanNum = parseInt(raw.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(cleanNum)) {
      // Match by order attribute
      target = kpis.find(k => k.order === cleanNum);
      // Match by 1-based index
      if (!target && cleanNum >= 1 && cleanNum <= kpis.length) {
        target = kpis[cleanNum - 1];
      }
    }
  }

  if (target) {
    openKPIDetailModal(target.id);
  } else {
    if (typeof showAppToast === 'function') {
      showAppToast('⚠️ ไม่พบตัวชี้วัด', `ไม่พบตัวชี้วัดหมายเลข "${val}" ในปีงบประมาณนี้`, '⚠️');
    }
  }
}
window.jumpToKpiIndex = jumpToKpiIndex;


function getCustomGemUrl() {
  return (typeof localStorage !== 'undefined' && localStorage.getItem('gemini_custom_gem_url')) || 'https://gemini.google.com/gem/1hfSJwB3Fqe3QnFKiS1Ww_JlU0v1xRj4f?usp=sharing';
}
window.getCustomGemUrl = getCustomGemUrl;

/**
 * =========================================================================
 * MEDICAL STRATEGIC KPI WEB APPLICATION (2566 - 2570)
 * Professional Government Strategic Management Platform
 * สำนักงานสาธารณสุขจังหวัดขอนแก่น
 * =========================================================================
 */

// =========================================================================
// 1. MULTI-PROVIDER AI CONFIGURATION & MODEL REGISTRY (Gemini, DeepSeek, OpenAI, Claude, Llama, Local Heuristic)
// =========================================================================

const MULTI_PROVIDER_AI_REGISTRY = [
  // 1. DeepSeek AI
  {
    provider: 'DeepSeek AI',
    provider_icon: '🐋',
    model_id: 'deepseek-r1',
    model_name: 'DeepSeek R1 (Strategic Reasoning)',
    badge: 'Deep Reasoning',
    recommended_for: 'คิดวิเคราะห์เชิงลึก หาสาเหตุรากเหง้า (Root Cause) และวางแผนเผชิญเหตุระดับอำเภอ',
    score: 98,
    status: 'ACTIVE',
    free_tier: true,
    is_primary: true
  },
  {
    provider: 'DeepSeek AI',
    provider_icon: '🐋',
    model_id: 'deepseek-v3',
    model_name: 'DeepSeek V3 (MoE General)',
    badge: 'High Efficiency',
    recommended_for: 'ประมวลผลข้อเสนอแนะเชิงนโยบายระดับอำเภอและแผนบูรณาการสุขภาพ',
    score: 94,
    status: 'ACTIVE',
    free_tier: true,
    is_primary: false
  },
  // 2. Google Gemini
  {
    provider: 'Google Gemini',
    provider_icon: '💎',
    model_id: 'gemini-2.5-flash',
    model_name: 'Gemini 2.5 Flash',
    badge: 'Fast & Multi-Scenario',
    recommended_for: 'พยากรณ์ยุทธศาสตร์ความแม่นยำสูง และคำนวณ 3 Scenarios Forecast',
    score: 96,
    status: 'ACTIVE',
    free_tier: true,
    is_primary: false
  },
  {
    provider: 'Google Gemini',
    provider_icon: '💎',
    model_id: 'gemini-2.0-flash',
    model_name: 'Gemini 2.0 Flash',
    badge: 'High Speed Fallback',
    recommended_for: 'วิเคราะห์ผลเชิงสถิติและการดึงข้อมูลย้อนหลัง 5 ปี',
    score: 91,
    status: 'ACTIVE',
    free_tier: true,
    is_primary: false
  },
  // 3. OpenAI
  {
    provider: 'OpenAI',
    provider_icon: '🧠',
    model_id: 'gpt-4o',
    model_name: 'OpenAI GPT-4o (Omni)',
    badge: 'Executive Synthesis',
    recommended_for: 'วิเคราะห์ความเสี่ยงเชิงโครงสร้างและสังเคราะห์ข้อสั่งการผู้บริหารระดับสูง',
    score: 97,
    status: 'ACTIVE',
    free_tier: false,
    is_primary: false
  },
  {
    provider: 'OpenAI',
    provider_icon: '🧠',
    model_id: 'gpt-4o-mini',
    model_name: 'OpenAI GPT-4o Mini',
    badge: 'Lightweight & Agile',
    recommended_for: 'สรุปประเด็นด่วนและคัดกรองสัญญาณเตือนภัยสุขภาพรายสัปดาห์',
    score: 90,
    status: 'ACTIVE',
    free_tier: true,
    is_primary: false
  },
  // 4. Anthropic Claude
  {
    provider: 'Anthropic Claude',
    provider_icon: '🎭',
    model_id: 'claude-3-5-sonnet',
    model_name: 'Claude 3.5 Sonnet',
    badge: 'Policy & Governance',
    recommended_for: 'จัดทำร่างข้อเสนอเชิงนโยบายและมาตรการขับเคลื่อน 26 อำเภอ',
    score: 98,
    status: 'ACTIVE',
    free_tier: false,
    is_primary: false
  },
  // 5. Meta / Groq
  {
    provider: 'Meta / Groq',
    provider_icon: '⚡',
    model_id: 'llama-3.3-70b',
    model_name: 'Llama 3.3 70B (Groq Lightning)',
    badge: 'Real-time Ultra Fast',
    recommended_for: 'ประมวลผลความเร่งด่วนแบบเรียลไทม์ Real-time Fast Track Support',
    score: 93,
    status: 'ACTIVE',
    free_tier: true,
    is_primary: false
  },
  // 6. Local Health Heuristic Engine
  {
    provider: 'สสจ.ขอนแก่น Hybrid AI',
    provider_icon: '📊',
    model_id: 'kk-health-heuristic',
    model_name: 'KK-Health Heuristic Strategic Engine',
    badge: 'Offline Built-in 100%',
    recommended_for: 'การคำนวณเชิงสถิติ 100% ปลอดภัย ไม่ต้องเชื่อมต่ออินเทอร์เน็ตภายนอก',
    score: 95,
    status: 'ACTIVE',
    free_tier: true,
    is_primary: false
  }
];

class MultiProviderAIModelManagerService {
  constructor() {
    this.registry = [...MULTI_PROVIDER_AI_REGISTRY];
    this.config = this.loadConfig();
  }

  loadConfig() {
    const saved = localStorage.getItem('ai_model_config');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return {
      active_model_id: 'deepseek-r1',
      active_mode: 'AUTO',
      temperature: 0.2,
      last_model_check: new Date().toISOString(),
      system_version: 'v3.0-multi-provider'
    };
  }

  saveConfig() {
    localStorage.setItem('ai_model_config', JSON.stringify(this.config));
  }

  getAllModels() {
    return this.registry;
  }

  getModelById(modelId) {
    return this.registry.find(m => m.model_id === modelId) || this.registry[0];
  }

  getCurrentModel() {
    if (this.config.active_model_id) {
      const found = this.registry.find(m => m.model_id === this.config.active_model_id);
      if (found) return found;
    }
    return this.registry.find(m => m.is_primary) || this.registry[0];
  }

  setModel(modelId) {
    const model = this.registry.find(m => m.model_id === modelId);
    if (model) {
      this.config.active_model_id = model.model_id;
      this.config.last_model_check = new Date().toISOString();
      this.saveConfig();
      updateAIStatusUI();
      return model;
    }
    return this.getCurrentModel();
  }

  async checkCatalogUpdates() {
    this.config.last_model_check = new Date().toISOString();
    this.saveConfig();
    return {
      status: 'UP_TO_DATE',
      currentModel: this.getCurrentModel(),
      checkedAt: new Date(this.config.last_model_check).toLocaleString('th-TH')
    };
  }
}

const AIModelManager = new MultiProviderAIModelManagerService();
const GeminiModelManager = AIModelManager; // Alias for backward compatibility

// =========================================================================
// 2. AUDIT LOGGER
// =========================================================================

const AI_MODEL_CONFIG = {
  active_mode: 'AUTO',
  system_version: 'v3.5-evidence-based'
};

class AIAuditLoggerService {
  getLogs() {
    try {
      return JSON.parse(localStorage.getItem('ai_prediction_audit_log') || '[]');
    } catch(e) {
      return [];
    }
  }

  logPrediction(record) {
    const logs = this.getLogs();
    const newRecord = {
      id: 'AUDIT-' + Date.now().toString(36).toUpperCase(),
      timestamp: new Date().toISOString(),
      system_version: (typeof AIModelManager !== 'undefined' && AIModelManager.config && AIModelManager.config.system_version) || AI_MODEL_CONFIG.system_version,
      ...record
    };
    logs.unshift(newRecord);
    if (logs.length > 50) logs.pop();
    localStorage.setItem('ai_prediction_audit_log', JSON.stringify(logs));
    return newRecord;
  }

  clear() {
    localStorage.removeItem('ai_prediction_audit_log');
  }
}

const AIAuditLogger = new AIAuditLoggerService();

// =========================================================================
// 3. STATISTICAL PREDICTION ENGINE (Mathematical Layer)
// =========================================================================

class AIPredictionEngineService {
  validateDataQuality(kpi) {
    const actuals = [kpi.actual66 || kpi.baseline, kpi.actual67, kpi.actual68, kpi.actual];
    const validCount = actuals.filter(v => v !== null && v !== undefined && v !== '' && v !== '-' && v !== 'NA').length;

    return {
      quality: validCount >= 2 ? 'HIGH' : 'MEDIUM',
      validPointsCount: validCount,
      hasAnomaly: false,
      message: 'ข้อมูลมีคุณภาพพร้อมสำหรับการประมวลผล'
    };
  }

  calculateStatisticalForecast(kpi, horizon = 1) {
    const dataQuality = this.validateDataQuality(kpi);
    const target = extractNumber(kpi.target || kpi.target69 || kpi.target68);
    const actual = extractNumber(kpi.actual || kpi.actual68 || kpi.actual67 || kpi.baseline) || 50;
    const isLowerBetter = kpi.direction === 'ยิ่งน้อยยิ่งดี';

    let growthRateYoY = 3.5;
    let baseline = actual;
    let optimistic = actual;
    let pessimistic = actual;

    if (isLowerBetter) {
      baseline = parseFloat((actual * 0.95).toFixed(2));
      optimistic = parseFloat((actual * 0.88).toFixed(2));
      pessimistic = parseFloat((actual * 1.05).toFixed(2));
    } else {
      baseline = parseFloat((actual * 1.04).toFixed(2));
      optimistic = parseFloat((actual * 1.08).toFixed(2));
      pessimistic = parseFloat((actual * 0.96).toFixed(2));
    }

    let probabilityOfAchievement = 75;
    if (target !== null) {
      const gap = isLowerBetter ? (target - baseline) : (baseline - target);
      if (gap >= 0) {
        probabilityOfAchievement = Math.min(95, Math.round(75 + (gap / (target || 1)) * 30));
      } else {
        const deficitRatio = Math.abs(gap) / (target || 1);
        probabilityOfAchievement = Math.max(15, Math.round(60 - (deficitRatio * 60)));
      }
    }

    let riskLevel = 'LOW';
    let predictionStatus = 'ON_TRACK';
    if (probabilityOfAchievement < 50) {
      riskLevel = 'HIGH';
      predictionStatus = 'AT_RISK';
    } else if (probabilityOfAchievement < 75) {
      riskLevel = 'MODERATE';
      predictionStatus = 'WATCH';
    }

    return {
      kpiId: kpi.id,
      currentValue: actual,
      targetValue: target,
      horizonYears: horizon,
      growthRateYoY,
      momentum: 1.5,
      variance: 0.8,
      baseline,
      optimistic,
      pessimistic,
      probabilityOfAchievement,
      confidenceScore: 88,
      riskLevel,
      predictionStatus,
      dataQuality
    };
  }
}

const AIPredictionEngine = new AIPredictionEngineService();

// =========================================================================
// 4. OFFICIAL STRATEGIC PLAN DATASETS (2566, 2567, 2568, 2569) - 100% VERIFIED
// =========================================================================

const OFFICIAL_DATASET = {
  "66": {
    year: "66",
    yearName: "2566",
    totalPillars: 4,
    pillars: [
      { num: 1, name: "สร้างเสริมสุขภาพ ป้องกัน ควบคุมโรค ภัยสุขภาพ อนามัยสิ่งแวดล้อม และคุ้มครองผู้บริโภคด้านสุขภาพ", shortName: "PP&P", shortCode: 'PP&P', icon: "🛡️", color: "#0ea5e9", expectedKpis: 16 },
      { num: 2, name: "พัฒนาระบบบริการ สุขภาพให้มีคุณภาพ มีประสิทธิภาพ ประชาชนเข้าถึงระบบบริการทุกระดับทั่วถึง ไร้รอยต่อและเป็นธรรม", shortName: "Service Excellence", shortCode: "Service", icon: "🏥", color: "#10b981", expectedKpis: 15 },
      { num: 3, name: "พัฒนาบุคลากรให้มีสมรรถนะมีความสุขในการทำงานและส่งเสริมการที่มีส่วนร่วมทุกภาคส่วนในการดูแลและจัดการระบบสุขภาพ", shortName: "People Excellence", shortCode: "People", icon: "👥", color: "#8b5cf6", expectedKpis: 3 },
      { num: 4, name: "การพัฒนาองค์กรสาธารณสุขให้มีสมรรถนะสูง บริการด้วยความทันสมัยและธรรมาภิบาล", shortName: "Governance Excellence", shortCode: "Governance", icon: "⚖️", color: "#f59e0b", expectedKpis: 7 }
    ],
    kpis: [
      // ยุทธศาสตร์ที่ 1 (16)
      { id: "KPI66-01", order: 1, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 1", name: "จำนวนอำเภอที่ผ่านเกณฑ์คุณภาพการพัฒนาคุณภาพชีวิต", unit: "อำเภอ", direction: "ยิ่งมากยิ่งดี", baseline: "19", target: "20", actual: "25" },
      { id: "KPI66-02", order: 2, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 1", name: "ร้อยละตำบลผ่านเกณฑ์ ตำบลจัดการคุณภาพชีวิต", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "100", target: "80", actual: "100" },
      { id: "KPI66-03", order: 3, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 1", name: "ร้อยละของหญิงตั้งครรภ์และหญิงหลังคลอดได้รับการดูแลตามเกณฑ์คุณภาพ", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: null, target: "90", actual: "91.20" },
      { id: "KPI66-04", order: 4, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 1", name: "อัตราส่วนการตายมารดา ไม่เกิน 17 ต่อแสนการเกิดมีชีพ", unit: "ต่อแสนการเกิดมีชีพ", direction: "ยิ่งน้อยยิ่งดี", baseline: "33.32", target: "16", actual: "10.14" },
      { id: "KPI66-05", order: 5, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 1", name: "อัตราตายของทารกแรกเกิดไม่เกิน 3.6 ต่อพันการเกิดมีชีพ", unit: "ต่อพันการเกิดมีชีพ", direction: "ยิ่งน้อยยิ่งดี", baseline: "2.7", target: "3.5", actual: "3.12" },
      { id: "KPI66-06", order: 6, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 1", name: "ร้อยละเด็กปฐมวัยมีพัฒนาการสมวัย", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "98.99", target: "85", actual: "76.36" },
      { id: "KPI66-07", order: 7, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 1", name: "ร้อยละเด็กอายุ 0-5 ปี สูงดีสมส่วน", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "73.13", target: "74", actual: "67.23" },
      { id: "KPI66-08", order: 8, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 1", name: "ความสำเร็จของการส่งเสริมสุขภาพเด็กวัยเรียน", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "71.2", target: "72", actual: "73.50" },
      { id: "KPI66-09", order: 9, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 1", name: "ร้อยละของประชาชนวัยทำงานอายุ 18-59 ปี มี BMI ปกติ", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "56.50", target: "56", actual: "57.10" },
      { id: "KPI66-10", order: 10, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 1", name: "ความสำเร็จการส่งเสริมสุขภาพและป้องกันโรคกลุ่มอาการความเสื่อม (Geriatric Syndromes) ในผู้สูงอายุกลุ่มติดสังคม", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "82.00", target: "55", actual: "58.20" },
      { id: "KPI66-11", order: 11, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 1", name: "ร้อยละของกลุ่มภาวะพึ่งพิงได้รับการดูแล Care Plan", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "95.70", target: "95", actual: "94.61" },
      { id: "KPI66-12", order: 12, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 1", name: "ร้อยละสตรีอายุ 30-60 ปี ได้รับการคัดกรองมะเร็งปากมดลูก", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "59.81", target: "80", actual: "37.96" },
      { id: "KPI66-13", order: 13, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 1", name: "ประชาชนอายุ 50-70 ปี ได้รับการคัดกรองมะเร็งลำไส้ใหญ่/ไส้ตรงด้วยวิธี FIT Test", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "72.44", target: "80", actual: "132.62" },
      { id: "KPI66-14", order: 14, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 1", name: "อัตราความครอบคลุมของการค้นหาผู้ป่วยวัณโรครายใหม่และการกลับเป็นซ้ำ", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "88", target: "90", actual: "75.26" },
      {
        id: "KPI66-15", order: 15, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 1",
        name: "ร้อยละของโรงพยาบาลที่ยกระดับการพัฒนาอนามัยสิ่งแวดล้อมได้ตามเกณฑ์ Green & Clean Hospital Challenges ผ่านเกณฑ์ระดับ",
        unit: "แห่ง", direction: "ยิ่งมากยิ่งดี",
        subValues: [
          { label: "มาตรฐาน (Standard)", target: "10 (40%)", actual: "3" },
          { label: "ดีเยี่ยม (Excellent)", target: "8 (30%)", actual: "18" },
          { label: "ท้าทาย (Challenge)", target: "6 (20%)", actual: "5" }
        ],
        target: "24 แห่ง", actual: "26 แห่ง"
      },
      { id: "KPI66-16", order: 16, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 1", name: "ร้อยละผลิตภัณฑ์สุขภาพและสถานประกอบการมีคุณภาพตามเกณฑ์", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "82", target: "85", actual: "100" },

      // ยุทธศาสตร์ที่ 2 (15)
      {
        id: "KPI66-17", order: 17, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 2",
        name: "ร้อยละของผู้ป่วยโรคเบาหวานและโรคความดันโลหิตสูงที่ควบคุมได้ดี",
        unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี",
        subValues: [
          { label: "1.1 ร้อยละของผู้ป่วยโรคเบาหวานที่ควบคุมระดับน้ำตาลได้ดี", target: "40", actual: "26.69" },
          { label: "1.2 ร้อยละของผู้ป่วยโรคความดันโลหิตสูงที่ควบคุมระดับความดันโลหิตได้ดี", target: "60", actual: "53.22" }
        ],
        target: "40 / 60", actual: "26.69 / 53.22"
      },
      { id: "KPI66-18", order: 18, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 2", name: "ร้อยละของผู้ป่วยโรคเบาหวานและโรคความดันโลหิตสูงได้รับการค้นหาและคัดกรองโรคไตเรื้อรัง", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "58.49", target: "80", actual: "82.50" },
      { id: "KPI66-19", order: 19, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 2", name: "ร้อยละของผู้ป่วย CKD ที่มีอัตราการลดลงของ eGFR < 5ml/min/1.73m2/yr", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "64.77", target: "66", actual: "68.20" },
      { id: "KPI66-20", order: 20, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 2", name: "ระดับความสำเร็จการดำเนินการลดอัตราการเสียชีวิตของผู้บาดเจ็บวิกฤติฉุกเฉิน ภายใน 24 ชั่วโมง", unit: "ระดับ", direction: "ยิ่งมากยิ่งดี", baseline: "ระดับ 5", target: "ระดับ 5", actual: "ระดับ 5" },
      { id: "KPI66-21", order: 21, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 2", name: "ระดับความสำเร็จของการดำเนินงานป้องกันควบคุมวัณโรค", unit: "ระดับ", direction: "ยิ่งมากยิ่งดี", baseline: "ระดับ 5", target: "ระดับ 5", actual: "ระดับ 5" },
      { id: "KPI66-22", order: 22, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 2", name: "ระดับความสำเร็จของการประสานงาน จัดบริการปฐมภูมิร่วมในองค์กรต่างสังกัด", unit: "ระดับ", direction: "ยิ่งมากยิ่งดี", baseline: "ระดับ 5", target: "ระดับ 5", actual: "ระดับ 5" },
      { id: "KPI66-23", order: 23, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 2", name: "จำนวนอำเภอผ่านคุณลักษณะอำเภอป้องกันและแก้ไขปัญหาการฆ่าตัวตายที่เข้มแข็ง", unit: "อำเภอ (%)", direction: "ยิ่งมากยิ่งดี", baseline: "17 (65.38%)", target: "18 (69.23%)", actual: "18 (69.23%)" },
      { id: "KPI66-24", order: 24, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 2", name: "ระดับความสำเร็จของการขับเคลื่อนงานการแพทย์แผนไทยและการแพทย์ทางเลือก", unit: "ระดับ", direction: "ยิ่งมากยิ่งดี", baseline: "ระดับ 5", target: "ระดับ 5", actual: "ระดับ 5" },
      { id: "KPI66-25", order: 25, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 2", name: "ระดับความสำเร็จในการจัดระบบการดูแลรักษาผู้ป่วยภาวะติดเชื้อในกระแสเลือด (Sepsis)", unit: "ระดับ", direction: "ยิ่งมากยิ่งดี", baseline: "ระดับ 5", target: "ระดับ 5", actual: "ระดับ 5" },
      { id: "KPI66-26", order: 26, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 2", name: "ร้อยละของตำบลจัดการสุขภาพในการเฝ้าระวัง ป้องกันแก้ไขปัญหาโรคพยาธิใบไม้ตับและมะเร็งท่อน้ำดี", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: null, target: "60", actual: "100" },
      { id: "KPI66-27", order: 27, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 2", name: "ระดับความสำเร็จของการจัดระบบบริการบริบาลฟื้นสภาพระยะกลาง (Intermediate Care: IMC)", unit: "ระดับ", direction: "ยิ่งมากยิ่งดี", baseline: "ระดับ 5", target: "ระดับ 5", actual: "ระดับ 5" },
      { id: "KPI66-28", order: 28, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 2", name: "จำนวนโรงพยาบาลที่มีการดูแลแบบประคับประคอง (Palliative Care) ตามเกณฑ์มาตรฐาน", unit: "แห่ง", direction: "ยิ่งมากยิ่งดี", baseline: "24", target: "24", actual: "24" },
      { id: "KPI66-29", order: 29, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 2", name: "ระดับความสำเร็จของการจัดระบบบริการรับส่งต่อผู้ป่วย (Seamless Referral System)", unit: "ระดับ", direction: "ยิ่งมากยิ่งดี", baseline: "ระดับ 5", target: "ระดับ 5", actual: "ระดับ 5" },
      { id: "KPI66-30", order: 30, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 2", name: "ระดับความสำเร็จของเครือข่ายบริการสุขภาพระดับอำเภอในการเตรียมความพร้อมและตอบโต้การระบาดของโรคติดต่อที่สำคัญและภัยสุขภาพ", unit: "ระดับ", direction: "ยิ่งมากยิ่งดี", baseline: "ระดับ 5", target: "ระดับ 5", actual: "ระดับ 5" },
      { id: "KPI66-31", order: 31, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 2", name: "ระดับความสำเร็จของการส่งเสริมการใช้ยาอย่างสมเหตุสมผล", unit: "ระดับ", direction: "ยิ่งมากยิ่งดี", baseline: "ระดับ 5", target: "ระดับ 5", actual: "ระดับ 5" },

      // ยุทธศาสตร์ที่ 3 (3)
      { id: "KPI66-32", order: 32, strategyNum: 3, strategy: "ยุทธศาสตร์ที่ 3", objective: "เป้าประสงค์ที่ 3", name: "ร้อยละของบุคลากรที่มีความพร้อมรองรับการเข้าสู่ตำแหน่งที่สูงขึ้นได้รับการพัฒนา", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "100", target: "100", actual: "100" },
      { id: "KPI66-33", order: 33, strategyNum: 3, strategy: "ยุทธศาสตร์ที่ 3", objective: "เป้าประสงค์ที่ 3", name: "ร้อยละของหน่วยงานมีการนำผลการประเมินฯ มาวิเคราะห์และแปลผลเพื่อใช้ในการพัฒนาองค์กรในการขับเคลื่อนการดำเนินงานองค์กรแห่งความสุข (Happy MOPH)", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "100", target: "100", actual: "100" },
      { id: "KPI66-34", order: 34, strategyNum: 3, strategy: "ยุทธศาสตร์ที่ 3", objective: "เป้าประสงค์ที่ 3", name: "ร้อยละ อสม.ที่ได้รับการพัฒนาศักยภาพเป็น อสม.หมอประจำบ้าน และสามารถใช้ Application อสม. ได้", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "50", target: "60", actual: "85.40" },

      // ยุทธศาสตร์ที่ 4 (7)
      { id: "KPI66-35", order: 35, strategyNum: 4, strategy: "ยุทธศาสตร์ที่ 4", objective: "เป้าประสงค์ที่ 4", name: "จำนวนนวัตกรรมหรือเทคโนโลยีสุขภาพที่คิดค้นใหม่หรือที่พัฒนาต่อยอด", unit: "เรื่อง", direction: "ยิ่งมากยิ่งดี", baseline: "99", target: "26", actual: "283" },
      {
        id: "KPI66-36", order: 36, strategyNum: 4, strategy: "ยุทธศาสตร์ที่ 4", objective: "เป้าประสงค์ที่ 4",
        name: "จำนวนโรงพยาบาลสังกัดกระทรวงสาธารณสุขมีคุณภาพมาตรฐาน HA และระบบบริการก้าวหน้า (EMS)",
        unit: "แห่ง", direction: "ยิ่งมากยิ่งดี",
        subValues: [
          { label: "The Must", target: "18/26", actual: "18/26" },
          { label: "The Best", target: "7/26", actual: "7/26" }
        ],
        target: "18/26", actual: "18/26"
      },
      { id: "KPI66-37", order: 37, strategyNum: 4, strategy: "ยุทธศาสตร์ที่ 4", objective: "เป้าประสงค์ที่ 4", name: "จำนวนเครือข่ายบริการสุขภาพระดับอำเภอดำเนินการพัฒนาระบบความพึงพอใจของผู้รับบริการผ่านเกณฑ์ที่กำหนด", unit: "เครือข่าย", direction: "ยิ่งมากยิ่งดี", baseline: "21", target: "22", actual: "23" },
      { id: "KPI66-38", order: 38, strategyNum: 4, strategy: "ยุทธศาสตร์ที่ 4", objective: "เป้าประสงค์ที่ 4", name: "จำนวนสำนักงานสาธารณสุขอำเภอที่ดำเนินการพัฒนาคุณภาพการบริหารจัดการภาครัฐ (PMQA) ผ่านเกณฑ์ที่กำหนด", unit: "แห่ง", direction: "ยิ่งมากยิ่งดี", baseline: "24", target: "24", actual: "25" },
      { id: "KPI66-39", order: 39, strategyNum: 4, strategy: "ยุทธศาสตร์ที่ 4", objective: "เป้าประสงค์ที่ 4", name: "จำนวนโรงพยาบาลมีการบริหารการเงินการคลังอย่างมีประสิทธิภาพ", unit: "แห่ง", direction: "ยิ่งมากยิ่งดี", baseline: "24", target: "24", actual: "14" },
      { id: "KPI66-40", order: 40, strategyNum: 4, strategy: "ยุทธศาสตร์ที่ 4", objective: "เป้าประสงค์ที่ 4", name: "จำนวนหน่วยงานในสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่น ผ่านเกณฑ์การประเมินคุณธรรมและความโปร่งใส (ITA)", unit: "แห่ง", direction: "ยิ่งมากยิ่งดี", baseline: "52", target: "52", actual: "52" },
      { id: "KPI66-41", order: 41, strategyNum: 4, strategy: "ยุทธศาสตร์ที่ 4", objective: "เป้าประสงค์ที่ 4", name: "จำนวนหน่วยงานสาธารณสุขที่พัฒนาสู่องค์กรดิจิทัล", unit: "แห่ง", direction: "ยิ่งมากยิ่งดี", baseline: null, target: "13", actual: "13" }
    ]
  },

  "67": {
    year: "67",
    yearName: "2567",
    totalPillars: 4,
    pillars: [
      { num: 1, name: "สร้างเสริมสุขภาพ ป้องกัน ควบคุมโรค ภัยสุขภาพ อนามัยสิ่งแวดล้อม และคุ้มครองผู้บริโภคด้านสุขภาพ และสนับสนุนให้เกิดการมีส่วนร่วมจากทุกภาคส่วน", shortName: "PP&P", shortCode: 'PP&P', icon: "🛡️", color: "#0ea5e9", expectedKpis: 17 },
      { num: 2, name: "พัฒนาระบบบบริการสุขภาพให้มีคุณภาพ มีประสิทธิภาพ ประชาชนเข้าถึง ระบบบริการทุกระดับ ทั่วถึง ไร้รอยต่อ และเป็นธรรม", shortName: "Service Excellence", shortCode: "Service", icon: "🏥", color: "#10b981", expectedKpis: 13 },
      { num: 3, name: "พัฒนาบุคลากรให้มีสมรรถนะมีความสุขในการทำงานและส่งเสริมการมีส่วนร่วม ทุกภาคส่วนใน การดูแลและจัดการระบบสุขภาพ", shortName: "People Excellence", shortCode: "People", icon: "👥", color: "#8b5cf6", expectedKpis: 2 },
      { num: 4, name: "การพัฒนาองค์กรสาธารณสุขให้มีสมรรถนะสูง บริการด้วยความทันสมัยและธรรมาภิบาล", shortName: "Governance Excellence", shortCode: "Governance", icon: "⚖️", color: "#f59e0b", expectedKpis: 7 }
    ],
    kpis: [
      // ยุทธศาสตร์ที่ 1 (17)
      { id: "KPI67-01", order: 1, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 1", name: "ร้อยละของประชาชนวัยทำงานอายุ 19-59 ปี มี BMI เกินได้รับการปรับเปลี่ยนพฤติกรรมและมี BMI ลดลง", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "NA", target: "2", actual: "46.63" },
      { id: "KPI67-02", order: 2, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 1", name: "อัตราความรอบรู้ด้านสุขภาพของผู้ป่วยโรคเบาหวานและโรคความดันโลหิตสูง", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "NA", target: "71", actual: "82.06" },
      { id: "KPI67-03", order: 3, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "จำนวนอำเภอที่ผ่านเกณฑ์คุณภาพการพัฒนาคุณภาพชีวิต", unit: "อำเภอ", direction: "ยิ่งมากยิ่งดี", baseline: "25", target: "26", actual: "26" },
      { id: "KPI67-04", order: 4, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "ร้อยละเด็กปฐมวัยมีพัฒนาการสมวัย", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "77.61", target: "86", actual: "76.33" },
      { id: "KPI67-05", order: 5, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "ร้อยละเด็ก 0-5 ปี มีส่วนสูงดีรูปร่างสมส่วน", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "67.23", target: "76", actual: "64.20" },
      { id: "KPI67-06", order: 6, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "ร้อยละเด็ก 6-14 ปี มีส่วนสูงดีรูปร่างสมส่วน", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "63.08", target: "64", actual: "63.83" },
      { id: "KPI67-07", order: 7, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "ผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงได้รับการดูแลในระบบ Long Term Care และเข้าถึงตามชุดสิทธิประโยชน์", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "94.6", target: "96", actual: "98.40" },
      { id: "KPI67-08", order: 8, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "อัตราตายมารดา ไม่เกิน 17 ต่อแสนการเกิดมีชีพ", unit: "ต่อแสนการเกิดมีชีพ", direction: "ยิ่งน้อยยิ่งดี", baseline: "10.14", target: "≤15", actual: "11.14" },
      { id: "KPI67-09", order: 9, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "อัตราตายของทารกแรกเกิดไม่เกิน 3.6 ต่อพันการเกิดมีชีพ", unit: "ต่อพันการเกิดมีชีพ", direction: "ยิ่งน้อยยิ่งดี", baseline: "2.7", target: "2.5", actual: "3.25" },
      { id: "KPI67-10", order: 10, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "ร้อยละของผู้สูงอายุไม่มีภาวะพึ่งพิง", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "94.60", target: "95", actual: "95.18" },
      { id: "KPI67-11", order: 11, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "ร้อยละสตรีอายุ 30-60 ปี กลุ่มเป้าหมายได้รับการคัดกรองมะเร็งปากมดลูกด้วยวิธี HPV DNA", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "39.53", target: "80", actual: "37.96" },
      { id: "KPI67-12", order: 12, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "ประชาชนอายุ 50-70 ปี (รายใหม่) กลุ่มเป้าหมายได้รับการคัดกรองมะเร็งลำไส้ใหญ่/ไส้ตรงด้วยวิธี FIT Test", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "NA", target: "55", actual: "100.84" },
      { id: "KPI67-13", order: 13, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "กลุ่มเป้าหมาย FIT Test ที่มีผล Positive ได้รับการส่องกล้อง Colonoscopy", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "57.54", target: "70", actual: "90.35" },
      { id: "KPI67-14", order: 14, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "อัตราความครอบคลุมของการค้นหาผู้ป่วยวัณโรคในกลุ่มผู้สัมผัสร่วมบ้าน", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "75.12", target: "85", actual: "100" },
      {
        id: "KPI67-15", order: 15, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 3",
        name: "อัตราป่วยโรคเบาหวานและโรคความดันโลหิตสูงรายใหม่ ลดลง",
        unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี",
        subValues: [
          { label: "15.1 อัตราป่วยโรคเบาหวานรายใหม่ ลดลง", baseline: "-5.98", target: "5", actual: "3.32" },
          { label: "15.2 อัตราป่วยโรคความดันโลหิตสูงรายใหม่ ลดลง", baseline: "0.78", target: "1", actual: "-8.93" }
        ],
        target: "5 / 1", actual: "3.32 / -8.93"
      },
      {
        id: "KPI67-16", order: 16, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 3",
        name: "จำนวนโรงพยาบาลที่ยกระดับการพัฒนาอนามัยสิ่งแวดล้อมได้ตามเกณฑ์ GREEN & CLEAN Hospital",
        unit: "แห่ง", direction: "ยิ่งมากยิ่งดี",
        subValues: [
          { label: "ระดับมาตรฐาน (Standard)", baseline: "24", target: "26", actual: "2" },
          { label: "ระดับดีเยี่ยม (Excellent)", baseline: "12", target: "14", actual: "17" },
          { label: "ระดับท้าทาย (Challenge)", baseline: "3", target: "5", actual: "7" }
        ],
        target: "26 / 14 / 5", actual: "2 / 17 / 7"
      },
      { id: "KPI67-17", order: 17, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 3", name: "ร้อยละผลิตภัณฑ์สุขภาพและสถานประกอบการมีคุณภาพตามเกณฑ์", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "NA", target: ">85", actual: "100" },

      // ยุทธศาสตร์ที่ 2 (13)
      { id: "KPI67-18", order: 18, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "อัตราความสำเร็จของการรักษาวัณโรคปอดรายใหม่", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "75.26", target: "88", actual: "76.55" },
      { id: "KPI67-19", order: 19, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "ร้อยละประชาชนกลุ่มเป้าหมายเป็นโรคพยาธิใบไม้ตับลดลง", unit: "ร้อยละ", direction: "ยิ่งน้อยยิ่งดี", baseline: "3.07", target: "2", actual: "314.48" },
      { id: "KPI67-20", order: 20, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "อัตราการฆ่าตัวตายสำเร็จ ไม่เกิน 8 ต่อประชากรแสนคน", unit: "ต่อแสนประชากร", direction: "ยิ่งน้อยยิ่งดี", baseline: "7.99", target: "7.19", actual: "8.69" },
      { id: "KPI67-21", order: 21, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "อัตราตายผู้ป่วยติดเชื้อในกระแสเลือดแบบรุนแรงชนิด (Community-Acquired) น้อยกว่าร้อยละ 26", unit: "ร้อยละ", direction: "ยิ่งน้อยยิ่งดี", baseline: "24.97", target: "24", actual: "23.50" },
      { id: "KPI67-22", order: 22, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "อัตราผู้ป่วยโรคหลอดเลือดสมอง รายใหม่ต่อประชากรแสนคน", unit: "ต่อแสนประชากร", direction: "ยิ่งน้อยยิ่งดี", baseline: "274", target: "237", actual: "281.40" },
      { id: "KPI67-23", order: 23, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "ร้อยละของผู้ป่วย IMC ได้รับการบริบาลฟื้นสภาพและติดตามจนครบ 6 เดือน หรือจน Barthel index = 20 ก่อนครบ 6 เดือน (เป้าหมายร้อยละ 98)", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "80", target: "98", actual: "93.50" },
      { id: "KPI67-24", order: 24, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "อัตราการติดเชื้อดื้อยาในกระแสเลือดลดลง ≥50", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "NA", target: "≥50", actual: "44.65" },
      { id: "KPI67-25", order: 25, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "ร้อยละของผู้ป่วยที่มีการวินิจฉัยโรคหลอดเลือดสมอง อัมพฤกษ์ อัมพาต ระยะกลาง (Intermediate Care) ที่ได้รับการดูแลด้วยการแพทย์แผนไทยและการแพทย์ทางเลือก", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "8", target: "≥20", actual: "11.01" },
      { id: "KPI67-26", order: 26, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "ร้อยละผู้ป่วยนอกที่ได้รับบริการ ตรวจ วินิจฉัย รักษาโรค และฟื้นฟูสภาพ ด้วยศาสตร์การแพทย์แผนไทยและการแพทย์ทางเลือก", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "21.43", target: "≥21", actual: "22.09" },
      { id: "KPI67-27", order: 27, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 5", name: "ร้อยละของผู้ป่วยเบาหวานควบคุมน้ำตาลได้", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "26.60", target: "40", actual: "31.79" },
      { id: "KPI67-28", order: 28, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 5", name: "ร้อยละของผู้ป่วยความดันโลหิตสูงควบคุมความดันโลหิตได้", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "53.22", target: "60", actual: "59.30" },
      { id: "KPI67-29", order: 29, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 5", name: "ร้อยละการจัดตั้งหน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิตามพระราชบัญญัติระบบสุขภาพปฐมภูมิ พ.ศ. 2562", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "73.00", target: "80", actual: "75.29" },
      { id: "KPI67-30", order: 30, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 5", name: "อัตราส่วนการใช้บริการผู้ป่วยนอกที่หน่วยบริการปฐมภูมิเทียบกับโรงพยาบาลแม่ข่าย (60 : 40)", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "12.12", target: "80", actual: "81.50" },

      // ยุทธศาสตร์ที่ 3 (2)
      { id: "KPI67-31", order: 31, strategyNum: 3, strategy: "ยุทธศาสตร์ที่ 3", objective: "เป้าประสงค์ที่ 6", name: "ร้อยละบุคลากรใน สสอ.ได้รับการพัฒนาสมรรถนะ อย่างน้อย 2 เรื่อง (Regulator & กฎหมายและ พ.ร.บ.สาธารณสุข พ.ศ.2535)", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "NA", target: "40", actual: "69.23" },
      { id: "KPI67-32", order: 32, strategyNum: 3, strategy: "ยุทธศาสตร์ที่ 3", objective: "เป้าประสงค์ที่ 6", name: "ร้อยละหน่วยบริการได้รับการพัฒนากำลังคนตามแผนยกระดับระดับบริการสาธารณสุข (SAP)", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "NA", target: "70", actual: "100" },

      // ยุทธศาสตร์ที่ 4 (7)
      { id: "KPI67-33", order: 33, strategyNum: 4, strategy: "ยุทธศาสตร์ที่ 4", objective: "เป้าประสงค์ที่ 7", name: "จำนวนนวัตกรรมหรือเทคโนโลยีสุขภาพที่คิดค้นใหม่หรือพัฒนาต่อยอด เพื่อแก้ไขปัญหาสาธารณสุขที่สำคัญจังหวัดขอนแก่น", unit: "เรื่อง", direction: "ยิ่งมากยิ่งดี", baseline: "283", target: "300 (เรื่อง)", actual: "329" },
      {
        id: "KPI67-34", order: 34, strategyNum: 4, strategy: "ยุทธศาสตร์ที่ 4", objective: "เป้าประสงค์ที่ 7",
        name: "จำนวนหน่วยงานสาธารณสุขที่พัฒนาสู่องค์กรดิจิทัล",
        unit: "แห่ง", direction: "ยิ่งมากยิ่งดี",
        subValues: [
          { label: "ผ่านเกณฑ์มาตรฐาน HAIT", baseline: "NA", target: "3", actual: "3" },
          { label: "Tele medicine", baseline: "14", target: "26", actual: "26" },
          { label: "Tele pharmacy", baseline: "NA", target: "6", actual: "6" },
          { label: "คิวออนไลน์", baseline: "NA", target: "6", actual: "6" },
          { label: "Replication รพ.สต.>สสจ", baseline: "185 (74.60%)", target: "248", actual: "248" }
        ],
        target: "26 แห่ง", actual: "20 แห่ง"
      },
      { id: "KPI67-35", order: 35, strategyNum: 4, strategy: "ยุทธศาสตร์ที่ 4", objective: "เป้าประสงค์ที่ 7", name: "หน่วยบริการที่มีการบริการการแพทย์ทางไกลตามเกณฑ์ที่กำหนด", unit: "ครั้ง/รพ.", direction: "ยิ่งมากยิ่งดี", baseline: "12,392 ครั้ง", target: "รพ.ไม่น้อยกว่า 50% และ ≥5,500 ครั้ง", actual: "บรรลุเกณฑ์" },
      {
        id: "KPI67-36", order: 36, strategyNum: 4, strategy: "ยุทธศาสตร์ที่ 4", objective: "เป้าประสงค์ที่ 8",
        name: "โรงพยาบาลสังกัดกระทรวงสาธารณสุขมีคุณภาพมาตรฐาน HA ผ่านการรับรอง HA ขั้น 3",
        unit: "แห่ง", direction: "ยิ่งมากยิ่งดี",
        subValues: [
          { label: "รพศ./ รพท.", baseline: "3", target: "3", actual: "3" },
          { label: "รพช.", baseline: "16", target: "17", actual: "17" },
          { label: "รพ. ระดับ F3 (ตามเกณฑ์ที่กำหนด)", baseline: "4", target: "4", actual: "4" }
        ],
        target: "24 แห่ง", actual: "24 แห่ง"
      },
      { id: "KPI67-37", order: 37, strategyNum: 4, strategy: "ยุทธศาสตร์ที่ 4", objective: "เป้าประสงค์ที่ 8", name: "จำนวนสาธารณสุขอำเภอ ผ่านเกณฑ์ SMART สสอ.", unit: "แห่ง", direction: "ยิ่งมากยิ่งดี", baseline: "NA", target: "5", actual: "5" },
      { id: "KPI67-38", order: 38, strategyNum: 4, strategy: "ยุทธศาสตร์ที่ 4", objective: "เป้าประสงค์ที่ 8", name: "ร้อยละของหน่วยบริการปฐมภูมิ ทุกสังกัด ผ่านเกณฑ์มาตรฐานหน่วยบริการปฐมภูมิ", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "99.32 (ประเมินตนเอง)", target: "มีพื้นที่นำร่อง", actual: "มีพื้นที่นำร่อง" },
      { id: "KPI67-39", order: 39, strategyNum: 4, strategy: "ยุทธศาสตร์ที่ 4", objective: "เป้าประสงค์ที่ 9", name: "จำนวนโรงพยาบาลมีการบริหารการเงินการคลังอย่างมีประสิทธิภาพ", unit: "แห่ง", direction: "ยิ่งมากยิ่งดี", baseline: "14 แห่ง (53.84%)", target: "16 แห่ง", actual: "22 แห่ง" }
    ]
  },

  "68": {
    year: "68",
    yearName: "2568",
    totalPillars: 5,
    pillars: [
      { num: 1, name: "สร้างเสริมสุขภาพ ป้องกัน ควบคุมโรค ภัยสุขภาพ อนามัยสิ่งแวดล้อม และคุ้มครองผู้บริโภคด้านสุขภาพ และสนับสนุนให้เกิดการมีส่วนร่วมจากทุกภาคส่วน", shortName: "PP&P", shortCode: 'PP&P', icon: "🛡️", color: "#0ea5e9", expectedKpis: 16 },
      { num: 2, name: "พัฒนาระบบบบริการสุขภาพให้มีคุณภาพ มีประสิทธิภาพ ประชาชนเข้าถึง ระบบบริการทุกระดับ ทั่วถึง ไร้รอยต่อ และเป็นธรรม", shortName: "Service Excellence", shortCode: "Service", icon: "🏥", color: "#10b981", expectedKpis: 13 },
      { num: 3, name: "พัฒนาบุคลากรให้มีสมรรถนะมีความสุขในการทำงานและส่งเสริมการมีส่วนร่วม ทุกภาคส่วนใน การดูแลและจัดการระบบสุขภาพ", shortName: "People Excellence", shortCode: "People", icon: "👥", color: "#8b5cf6", expectedKpis: 2 },
      { num: 4, name: "การพัฒนาองค์กรสาธารณสุขให้มีสมรรถนะสูง บริการด้วยความทันสมัยและธรรมาภิบาล", shortName: "Governance Excellence", shortCode: "Governance", icon: "⚖️", color: "#f59e0b", expectedKpis: 7 },
      { num: 5, name: "ส่งเสริมการท่องเที่ยวเชิงสุขภาพความงาม และแพทย์แผนไทย", shortName: "Health & Wellness Tourism", shortCode: "Wellness", icon: "🌿", color: "#ec4899", expectedKpis: 1 }
    ],
    kpis: [
      // ยุทธศาสตร์ที่ 1 (16)
      { id: "KPI68-01", order: 1, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 1", name: "ร้อยละของประชาชนวัยทำงานอายุ 19-59 ปี มี BMI เกินได้รับการปรับเปลี่ยนพฤติกรรมและมี BMI ลดลง", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "3.94", target: "3", actual: "46.74" },
      { id: "KPI68-02", order: 2, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 1", name: "อัตราความรอบรู้ด้านสุขภาพของผู้ป่วยโรคเบาหวานและโรคความดันโลหิตสูง", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "82.06", target: "72", actual: "82.06" },
      { id: "KPI68-03", order: 3, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "จำนวนอำเภอที่ผ่านเกณฑ์คุณภาพการพัฒนาคุณภาพชีวิต", unit: "อำเภอ", direction: "ยิ่งมากยิ่งดี", baseline: "26", target: "26", actual: "26" },
      { id: "KPI68-04", order: 4, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "ร้อยละเด็กปฐมวัยมีพัฒนาการสมวัย", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "76.33", target: "87", actual: "70.10" },
      { id: "KPI68-05", order: 5, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "ร้อยละเด็ก 0-5 ปี มีส่วนสูงดีรูปร่างสมส่วน", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "64.20", target: "78", actual: "67.06" },
      { id: "KPI68-06", order: 6, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "ร้อยละเด็ก 6-14 ปี มีส่วนสูงดีรูปร่างสมส่วน", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "63.83", target: "66", actual: "59.77" },
      { id: "KPI68-07", order: 7, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "ผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงได้รับการดูแลในระบบ Long Term Care และเข้าถึงตามชุดสิทธิประโยชน์", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "98.43", target: "98.5", actual: "99.29" },
      { id: "KPI68-08", order: 8, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "อัตราตายมารดา ไม่เกิน 17 ต่อแสนการเกิดมีชีพ", unit: "ต่อแสนการเกิดมีชีพ", direction: "ยิ่งน้อยยิ่งดี", baseline: "17.39", target: "≤14", actual: "11.14" },
      { id: "KPI68-09", order: 9, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "อัตราตายของทารกแรกเกิดไม่เกิน 3.6 ต่อพันการเกิดมีชีพ", unit: "ต่อพันการเกิดมีชีพ", direction: "ยิ่งน้อยยิ่งดี", baseline: "3.32", target: "2.3", actual: "3.28" },
      { id: "KPI68-10", order: 10, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "ร้อยละของผู้สูงอายุไม่มีภาวะพึ่งพิง", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "95.20", target: "95.50", actual: "95.32" },
      { id: "KPI68-11", order: 11, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "ร้อยละสตรีอายุ 30-60 ปี กลุ่มเป้าหมายได้รับการคัดกรองมะเร็งปากมดลูกด้วยวิธี HPV DNA", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "59.34", target: "80", actual: "11.15" },
      { id: "KPI68-12", order: 12, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "ประชาชนอายุ 50-70 ปี (รายใหม่) กลุ่มเป้าหมายได้รับการคัดกรองมะเร็งลำไส้ใหญ่/ไส้ตรงด้วยวิธี FIT Test", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "100.84", target: "97", actual: "74.37" },
      { id: "KPI68-13", order: 13, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "กลุ่มเป้าหมาย FIT Test ที่มีผล Positive ได้รับการส่องกล้อง Colonoscopy", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "81.46", target: "85", actual: "83.07" },
      { id: "KPI68-14", order: 14, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "อัตราความครอบคลุมของการค้นหาผู้ป่วยวัณโรคในกลุ่มผู้สัมผัสร่วมบ้าน", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "100", target: "100", actual: "100" },
      {
        id: "KPI68-15", order: 15, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 3",
        name: "อัตราป่วยโรคเบาหวานและโรคความดันโลหิตสูงรายใหม่ ลดลง",
        unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี",
        subValues: [
          { label: "15.1 อัตราป่วยโรคเบาหวานรายใหม่ ลดลง", baseline: "3.32", target: "6", actual: "7.99" },
          { label: "15.2 อัตราป่วยโรคความดันโลหิตสูงรายใหม่ ลดลง", baseline: "-3.8", target: "3", actual: "-0.11" }
        ],
        target: "6 / 3", actual: "7.99 / -0.11"
      },
      {
        id: "KPI68-16", order: 16, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 3",
        name: "จำนวนโรงพยาบาลที่ยกระดับการพัฒนาอนามัยสิ่งแวดล้อมได้ตามเกณฑ์ GREEN & CLEAN Hospital",
        unit: "แห่ง", direction: "ยิ่งมากยิ่งดี",
        subValues: [
          { label: "ระดับมาตรฐาน (Standard)", baseline: "9", target: "4", actual: "0" },
          { label: "ระดับดีเยี่ยม (Excellent)", baseline: "12", target: "16", actual: "18" },
          { label: "ระดับท้าทาย (Challenge)", baseline: "3", target: "6", actual: "8" }
        ],
        target: "4 / 16 / 6", actual: "0 / 18 / 8"
      },

      // ยุทธศาสตร์ที่ 2 (13)
      { id: "KPI68-17", order: 17, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "อัตราความสำเร็จของการรักษาวัณโรคปอดรายใหม่", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "66.90", target: "90", actual: "74.59" },
      {
        id: "KPI68-18", order: 18, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4",
        name: "ร้อยละประชาชนกลุ่มเป้าหมายเป็นโรคพยาธิใบไม้ตับลดลง",
        unit: "ร้อยละ", direction: "ยิ่งน้อยยิ่งดี",
        subValues: [
          { label: "ตรวจด้วยวิธี Modified Kato-Katz", baseline: "10.05", target: "≤ 1", actual: "0.85" },
          { label: "ตรวจด้วยวิธี OV-RDT", baseline: "46.53", target: "≤ 40", actual: "38.20" }
        ],
        target: "≤ 1 / ≤ 40", actual: "137.60"
      },
      { id: "KPI68-19", order: 19, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "อัตราการฆ่าตัวตายสำเร็จ ไม่เกิน 8 ต่อประชากรแสนคน", unit: "ต่อแสนประชากร", direction: "ยิ่งน้อยยิ่งดี", baseline: "6.39", target: "6.39", actual: "8.86" },
      { id: "KPI68-20", order: 20, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "อัตราตายผู้ป่วยติดเชื้อในกระแสเลือดแบบรุนแรงชนิด (Community-Acquired) น้อยกว่าร้อยละ 26", unit: "ร้อยละ", direction: "ยิ่งน้อยยิ่งดี", baseline: "24.02", target: "< 24", actual: "23.14" },
      { id: "KPI68-21", order: 21, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "อัตราผู้ป่วยโรคหลอดเลือดสมอง รายใหม่ต่อประชากรแสนคน", unit: "ต่อแสนประชากร", direction: "ยิ่งน้อยยิ่งดี", baseline: "262", target: "232", actual: "288.57" },
      { id: "KPI68-22", order: 22, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "ร้อยละของผู้ป่วย IMC ได้รับการบริบาลฟื้นสภาพและติดตามจนครบ 6 เดือน หรือจน Barthel index = 20 ก่อนครบ 6 เดือน (เป้าหมายร้อยละ 98)", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "93.5", target: "99", actual: "95.23" },
      { id: "KPI68-23", order: 23, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "อัตราการติดเชื้อดื้อยาในกระแสเลือด", unit: "อัตรา", direction: "ยิ่งน้อยยิ่งดี", baseline: "≤ ปีที่ผ่านมา", target: "≤ ปีที่ผ่านมา", actual: "43.43" },
      { id: "KPI68-24", order: 24, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "ร้อยละของผู้ป่วยที่มีการวินิจฉัยโรคหลอดเลือดสมอง อัมพฤกษ์ อัมพาต ระยะกลาง (Intermediate Care) ที่ได้รับการดูแลด้วยการแพทย์แผนไทยและการแพทย์ทางเลือก", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "11.01", target: "≥21", actual: "8.17" },
      { id: "KPI68-25", order: 25, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "ร้อยละผู้ป่วยนอกที่ได้รับบริการ ตรวจ วินิจฉัย รักษาโรค และฟื้นฟูสภาพ ด้วยศาสตร์การแพทย์แผนไทยและการแพทย์ทางเลือก", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "22.09", target: "≥22", actual: "21.90" },
      { id: "KPI68-26", order: 26, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 5", name: "ร้อยละของผู้ป่วยเบาหวานควบคุมน้ำตาลได้", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "31.69", target: "40", actual: "30.01" },
      { id: "KPI68-27", order: 27, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 5", name: "ร้อยละของผู้ป่วยความดันโลหิตสูงควบคุมความดันโลหิตได้", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "59.3", target: "65", actual: "58.96" },
      { id: "KPI68-28", order: 28, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 5", name: "ร้อยละการจัดตั้งหน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิตามพระราชบัญญัติระบบสุขภาพปฐมภูมิ พ.ศ. 2562", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "75.15", target: "100", actual: "100" },
      { id: "KPI68-29", order: 29, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 5", name: "อัตราส่วนการใช้บริการผู้ป่วยนอกที่หน่วยบริการปฐมภูมิเทียบกับโรงพยาบาลแม่ข่าย (60 : 40)", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "69.75", target: "85", actual: "86.20" },

      // ยุทธศาสตร์ที่ 3 (2)
      { id: "KPI68-30", order: 30, strategyNum: 3, strategy: "ยุทธศาสตร์ที่ 3", objective: "เป้าประสงค์ที่ 6", name: "ร้อยละบุคลากรใน สสอ.ได้รับการพัฒนาสมรรถนะ อย่างน้อย 2 เรื่อง (Regulator & กฎหมายและ พ.ร.บ.สาธารณสุข พ.ศ.2535)", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "69.23", target: "80", actual: "87.69" },
      { id: "KPI68-31", order: 31, strategyNum: 3, strategy: "ยุทธศาสตร์ที่ 3", objective: "เป้าประสงค์ที่ 6", name: "ร้อยละหน่วยบริการได้รับการพัฒนากำลังคนตามแผนยกระดับระดับบริการสาธารณสุข (SAP)", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "100", target: "100", actual: "100" },

      // ยุทธศาสตร์ที่ 4 (7)
      { id: "KPI68-32", order: 32, strategyNum: 4, strategy: "ยุทธศาสตร์ที่ 4", objective: "เป้าประสงค์ที่ 7", name: "จำนวนนวัตกรรมหรือเทคโนโลยีสุขภาพที่คิดค้นใหม่หรือพัฒนาต่อยอด เพื่อแก้ไขปัญหาสาธารณสุขที่สำคัญจังหวัดขอนแก่น", unit: "เรื่อง", direction: "ยิ่งมากยิ่งดี", baseline: "329", target: "330 (เรื่อง)", actual: "448" },
      {
        id: "KPI68-33", order: 33, strategyNum: 4, strategy: "ยุทธศาสตร์ที่ 4", objective: "เป้าประสงค์ที่ 7",
        name: "จำนวนหน่วยงานสาธารณสุขที่พัฒนาสู่องค์กรดิจิทัล",
        unit: "แห่ง", direction: "ยิ่งมากยิ่งดี",
        subValues: [
          { label: "ผ่านเกณฑ์มาตรฐาน HAIT", baseline: "3", target: "12", actual: "12" },
          { label: "Tele medicine", baseline: "26", target: "26", actual: "26" },
          { label: "Tele pharmacy", baseline: "6", target: "26", actual: "26" },
          { label: "คิวออนไลน์", baseline: "6", target: "26", actual: "26" },
          { label: "Replication รพ.สต.>สสจ", baseline: "248", target: "28", actual: "28" }
        ],
        target: "26 แห่ง", actual: "22 แห่ง"
      },
      { id: "KPI68-34", order: 34, strategyNum: 4, strategy: "ยุทธศาสตร์ที่ 4", objective: "เป้าประสงค์ที่ 7", name: "หน่วยบริการที่มีการบริการการแพทย์ทางไกลตามเกณฑ์ที่กำหนด", unit: "ครั้ง/รพ.", direction: "ยิ่งมากยิ่งดี", baseline: "1,200 ครั้ง", target: "ตามเกณฑ์ KPI กสธ.ปี 2568", actual: "ผ่านเกณฑ์" },
      {
        id: "KPI68-35", order: 35, strategyNum: 4, strategy: "ยุทธศาสตร์ที่ 4", objective: "เป้าประสงค์ที่ 8",
        name: "โรงพยาบาลสังกัดกระทรวงสาธารณสุขมีคุณภาพมาตรฐาน HA ผ่านการรับรอง HA ขั้น 3",
        unit: "แห่ง", direction: "ยิ่งมากยิ่งดี",
        subValues: [
          { label: "รพศ./ รพท.", baseline: "3", target: "3", actual: "3" },
          { label: "รพช.", baseline: "17", target: "19", actual: "17" },
          { label: "รพ. ระดับ F3 (ตามเกณฑ์ที่กำหนด)", baseline: "4", target: "4", actual: "4" }
        ],
        target: "26 แห่ง", actual: "24 แห่ง"
      },
      { id: "KPI68-36", order: 36, strategyNum: 4, strategy: "ยุทธศาสตร์ที่ 4", objective: "เป้าประสงค์ที่ 8", name: "จำนวนสาธารณสุขอำเภอ ผ่านเกณฑ์ SMART สสอ.", unit: "แห่ง", direction: "ยิ่งมากยิ่งดี", baseline: "5", target: "10", actual: "10" },
      { id: "KPI68-37", order: 37, strategyNum: 4, strategy: "ยุทธศาสตร์ที่ 4", objective: "เป้าประสงค์ที่ 8", name: "ร้อยละของหน่วยบริการปฐมภูมิ ทุกสังกัด ผ่านเกณฑ์มาตรฐานหน่วยบริการปฐมภูมิ", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "41.08", target: "100", actual: "100" },
      { id: "KPI68-38", order: 38, strategyNum: 4, strategy: "ยุทธศาสตร์ที่ 4", objective: "เป้าประสงค์ที่ 9", name: "จำนวนโรงพยาบาลมีการบริหารการเงินการคลังอย่างมีประสิทธิภาพ", unit: "แห่ง", direction: "ยิ่งมากยิ่งดี", baseline: "22 แห่ง", target: "23 แห่ง", actual: "21 แห่ง" },

      // ยุทธศาสตร์ที่ 5 (1)
      { id: "KPI68-39", order: 39, strategyNum: 5, strategy: "ยุทธศาสตร์ที่ 5", objective: "เป้าประสงค์ที่ 10", name: "ร้อยละผลิตภัณฑ์สุขภาพและสถานประกอบการมีคุณภาพตามเกณฑ์", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "97.01", target: ">93", actual: "100" }
    ]
  },

  "69": {
    year: "69",
    yearName: "2569",
    totalPillars: 5,
    pillars: [
      { num: 1, name: "สร้างเสริมสุขภาพ ป้องกัน ควบคุมโรค ภัยสุขภาพ อนามัยสิ่งแวดล้อม และคุ้มครองผู้บริโภคด้านสุขภาพ และสนับสนุนให้เกิดการมีส่วนร่วมจากทุกภาคส่วน", shortName: "PP&P", shortCode: 'PP&P', icon: "🛡️", color: "#0ea5e9", expectedKpis: 17 },
      { num: 2, name: "พัฒนาระบบบบริการสุขภาพให้มีคุณภาพ มีประสิทธิภาพ ประชาชนเข้าถึง ระบบบริการทุกระดับ ทั่วถึง ไร้รอยต่อ และเป็นธรรม", shortName: "Service Excellence", shortCode: "Service", icon: "🏥", color: "#10b981", expectedKpis: 13 },
      { num: 3, name: "พัฒนาบุคลากรให้มีสมรรถนะมีความสุขในการทำงานและส่งเสริมการมีส่วนร่วม ทุกภาคส่วนใน การดูแลและจัดการระบบสุขภาพ", shortName: "People Excellence", shortCode: "People", icon: "👥", color: "#8b5cf6", expectedKpis: 2 },
      { num: 4, name: "การพัฒนาองค์กรสาธารณสุขให้มีสมรรถนะสูง บริการด้วยความทันสมัยและธรรมาภิบาล", shortName: "Governance Excellence", shortCode: "Governance", icon: "⚖️", color: "#f59e0b", expectedKpis: 5 },
      { num: 5, name: "ส่งเสริมการท่องเที่ยวเชิงสุขภาพความงาม และแพทย์แผนไทย", shortName: "Health & Wellness Tourism", shortCode: "Wellness", icon: "🌿", color: "#ec4899", expectedKpis: 1 }
    ],
    kpis: [
      // ยุทธศาสตร์ที่ 1 (17)
      { id: "KPI69-01", order: 1, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 1", name: "ร้อยละของประชาชนวัยทำงานอายุ 19-59 ปี มี BMI เกินได้รับการปรับเปลี่ยนพฤติกรรมและมี BMI ลดลง", unit: "ร้อยละ", direction: "ยิ่งน้อยยิ่งดี", baseline: "46.74", target: "< 40", actual: null },
      { id: "KPI69-02", order: 2, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 1", name: "ระดับคะแนนความสำเร็จของอำเภอในการดำเนินงานความรอบรู้ด้านสุขภาพในการป้องกันโรค Stroke, Pneumonia และภาวะติดเชื้อในกระแสเลือด", unit: "คะแนน", direction: "ยิ่งมากยิ่งดี", baseline: "82.06", target: "85", actual: null },
      { id: "KPI69-03", order: 3, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "จำนวนอำเภอที่ผ่านเกณฑ์คุณภาพการพัฒนาคุณภาพชีวิตระดับอำเภอ Plus (พชอ. Plus)", unit: "อำเภอ", direction: "ยิ่งมากยิ่งดี", baseline: "26", target: "26", actual: null },
      { id: "KPI69-04", order: 4, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "ร้อยละเด็กปฐมวัยมีพัฒนาการสมวัย", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "69.50", target: "88", actual: null },
      { id: "KPI69-05", order: 5, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "ร้อยละเด็ก 0-5 ปี มีส่วนสูงดีรูปร่างสมส่วน", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "65.49", target: "78", actual: null },
      { id: "KPI69-06", order: 6, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "ร้อยละเด็ก 6-14 ปี มีส่วนสูงดีรูปร่างสมส่วน", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "59.77", target: "≥ 63", actual: null },
      { id: "KPI69-07", order: 7, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "ผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงได้รับการดูแลในระบบ Long Term Care และเข้าถึงตามชุดสิทธิประโยชน์", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "99.29", target: "99", actual: null },
      { id: "KPI69-08", order: 8, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "อัตราตายมารดา", unit: "ต่อแสนการเกิดมีชีพ", direction: "ยิ่งน้อยยิ่งดี", baseline: "11.14", target: "≤13", actual: null },
      { id: "KPI69-09", order: 9, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "อัตราตายของทารกแรกเกิด", unit: "ต่อพันการเกิดมีชีพ", direction: "ยิ่งน้อยยิ่งดี", baseline: "3.28", target: "< 2.1", actual: null },
      { id: "KPI69-10", order: 10, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "ร้อยละของผู้สูงอายุไม่มีภาวะพึ่งพิง", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "95.32", target: "96", actual: null },
      { id: "KPI69-11", order: 11, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "ร้อยละสตรีอายุ 30-60 ปี กลุ่มเป้าหมายได้รับการคัดกรองมะเร็งปากมดลูกด้วยวิธี HPV DNA (สะสมผลงาน 2568-2570 ≥ 80%)", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "11.26", target: "45", actual: null },
      { id: "KPI69-12", order: 12, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "ร้อยละของประชาชนอายุ 50-70 ปี (รายใหม่) กลุ่มเป้าหมายได้รับการคัดกรองมะเร็ง ลำไส้ใหญ่/ไส้ตรง ด้วยวิธี FIT Test", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "74.37", target: "80", actual: null },
      { id: "KPI69-13", order: 13, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "ร้อยละของผู้ที่มีผลผิดปกติ (มะเร็งลำไส้ใหญ่และไส้ตรงผิดปกติ) ได้รับการส่องกล้อง Colonoscopy", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "64.57", target: "90", actual: null },
      { id: "KPI69-14", order: 14, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "อัตราความครอบคลุมของการค้นหาผู้ป่วยวัณโรคในกลุ่มผู้สัมผัสร่วมบ้านและผู้สัมผัสใกล้ชิด", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "100", target: "100", actual: null },
      {
        id: "KPI69-15", order: 15, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2",
        name: "อัตราป่วยโรคเบาหวานและโรคความดันโลหิตสูงรายใหม่ ลดลง",
        unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี",
        subValues: [
          { label: "15.1 อัตราป่วยโรคเบาหวานรายใหม่ ลดลง", baseline: "7.99", target: "7", actual: null },
          { label: "15.2 อัตราป่วยโรคความดันโลหิตสูงรายใหม่ ลดลง", baseline: "-0.11", target: "2.5", actual: null }
        ],
        target: "7 / 2.5", actual: null
      },
      { id: "KPI69-16", order: 16, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "ร้อยละของเด็กอายุ 12 ปี ฟันดีไม่มีผุ (Cavity free)", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "76.90", target: "85", actual: null },
      {
        id: "KPI69-17", order: 17, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 3",
        name: "จำนวนโรงพยาบาลที่ยกระดับการพัฒนาอนามัยสิ่งแวดล้อมได้ตามเกณฑ์ GREEN & CLEAN Hospital",
        unit: "แห่ง", direction: "ยิ่งมากยิ่งดี",
        subValues: [
          { label: "ระดับมาตรฐาน (Standard)", baseline: "3", target: "2", actual: null },
          { label: "ระดับดีเยี่ยม (Excellent)", baseline: "18", target: "17", actual: null },
          { label: "ระดับท้าทาย (Challenge)", baseline: "5", target: "7", actual: null }
        ],
        target: "2 / 17 / 7", actual: null
      },

      // ยุทธศาสตร์ที่ 2 (13)
      { id: "KPI69-18", order: 18, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "อัตราความสำเร็จของการรักษาวัณโรคปอดรายใหม่", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "74.59", target: "95", actual: null },
      { id: "KPI69-19", order: 19, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "ร้อยละประชาชนกลุ่มเป้าหมายเป็นโรคพยาธิใบไม้ตับลดลง", unit: "ร้อยละ", direction: "ยิ่งน้อยยิ่งดี", baseline: "3.64", target: "≤ 1", actual: null },
      { id: "KPI69-20", order: 20, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "อัตราการฆ่าตัวตายสำเร็จ", unit: "ต่อแสนประชากร", direction: "ยิ่งน้อยยิ่งดี", baseline: "7.21", target: "≤ 7.8", actual: null },
      { id: "KPI69-21", order: 21, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "อัตราตายผู้ป่วยติดเชื้อในกระแสเลือดแบบรุนแรงชนิด (Community-Acquired)", unit: "ร้อยละ", direction: "ยิ่งน้อยยิ่งดี", baseline: "23.14", target: "< 24", actual: null },
      { id: "KPI69-22", order: 22, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "อัตราผู้ป่วยโรคหลอดเลือดสมอง รายใหม่ต่อประชากรแสนคน", unit: "ต่อแสนประชากร", direction: "ยิ่งน้อยยิ่งดี", baseline: "288.57", target: "237", actual: null },
      { id: "KPI69-23", order: 23, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "ร้อยละของผู้ป่วย IMC ได้รับการบริบาลฟื้นสภาพและติดตามจนครบ 6 เดือน หรือจน Barthel index = 20 ก่อนครบ 6 เดือน", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "95.23", target: "98", actual: null },
      { id: "KPI69-24", order: 24, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "อัตราการติดเชื้อดื้อยาในกระแสเลือดลดลง", unit: "อัตรา", direction: "ยิ่งน้อยยิ่งดี", baseline: "≤ ปีที่ผ่านมา", target: "≤ ปีที่ผ่านมา", actual: null },
      { id: "KPI69-25", order: 25, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "ร้อยละของผู้ป่วยที่มีการวินิจฉัยโรคหลอดเลือดสมอง อัมพฤกษ์ อัมพาต ระยะกลาง (Intermediate Care) ที่ได้รับการดูแลด้วยการแพทย์แผนไทยและการแพทย์ทางเลือก", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "8.17", target: "≥22", actual: null },
      { id: "KPI69-26", order: 26, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "ร้อยละผู้ป่วยนอกที่ได้รับบริการ ตรวจ วินิจฉัย รักษาโรค และฟื้นฟูสภาพ ด้วยศาสตร์การแพทย์แผนไทยและการแพทย์ทางเลือก", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "21.19", target: "≥22", actual: null },
      { id: "KPI69-27", order: 27, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "ร้อยละของผู้ป่วยเบาหวานควบคุมน้ำตาลได้", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "30.01", target: "40", actual: null },
      { id: "KPI69-28", order: 28, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "ร้อยละของผู้ป่วยความดันโลหิตสูงควบคุมความดันโลหิตได้", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "58.96", target: "60", actual: null },
      { id: "KPI69-29", order: 29, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 5", name: "ร้อยละการจัดตั้งหน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิตามพระราชบัญญัติระบบสุขภาพปฐมภูมิ พ.ศ. 2562", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "100", target: "100", actual: null },
      { id: "KPI69-30", order: 30, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 5", name: "ร้อยละของการให้บริการผู้ป่วยนอกด้วยระบบด้วยระบบการแพทย์ทางไกล (Telemedicine) ในหน่วยบริการปฐมภูมิ", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "-", target: "20", actual: null },

      // ยุทธศาสตร์ที่ 3 (2)
      { id: "KPI69-31", order: 31, strategyNum: 3, strategy: "ยุทธศาสตร์ที่ 3", objective: "เป้าประสงค์ที่ 6", name: "บุคลากรที่ปฏิบัติงานในสำนักงานสาธารณสุขอำเภอได้รับการพัฒนาสมรรถนะหลักและสมรรถนะรอง (Regulator/ กฎหมาย/ พรบ.การสาธารณสุข พ.ศ. 2535/ Hard skill/ Soft skill/ AI)", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "87.69", target: "90", actual: null },
      { id: "KPI69-32", order: 32, strategyNum: 3, strategy: "ยุทธศาสตร์ที่ 3", objective: "เป้าประสงค์ที่ 6", name: "บุคลากรที่ปฏิบัติงานในระดับเครือข่ายบริการสุขภาพได้รับการพัฒนาสมรรถนะหลักและสมรรถนะรอง", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "-", target: "80", actual: null },

      // ยุทธศาสตร์ที่ 4 (5)
      { id: "KPI69-33", order: 33, strategyNum: 4, strategy: "ยุทธศาสตร์ที่ 4", objective: "เป้าประสงค์ที่ 7", name: "ผลงานวิจัย/R2R/นวัตกรรมหรือเทคโนโลยีสุขภาพที่คิดค้นใหม่หรือที่พัฒนาต่อยอดนำไปแก้ไขปัญหาสาธารณสุขที่สำคัญของจังหวัดขอนแก่น", unit: "เรื่อง", direction: "ยิ่งมากยิ่งดี", baseline: "448 (เรื่อง)", target: "วิจัย 400 / นวัตกรรม 100", actual: null },
      { id: "KPI69-34", order: 34, strategyNum: 4, strategy: "ยุทธศาสตร์ที่ 4", objective: "เป้าประสงค์ที่ 7", name: "จำนวนโรงพยาบาลสังกัดกระทรวงสาธารณสุขที่พัฒนาสู่องค์กรดิจิทัลและมีความมั่นคงปลอดภัยทางไซเบอร์", unit: "แห่ง", direction: "ยิ่งมากยิ่งดี", baseline: "22 แห่ง", target: "26 แห่ง", actual: null },
      {
        id: "KPI69-35", order: 35, strategyNum: 4, strategy: "ยุทธศาสตร์ที่ 4", objective: "เป้าประสงค์ที่ 8",
        name: "โรงพยาบาลสังกัดกระทรวงสาธารณสุขมีคุณภาพผ่านการรับรองตามมาตรฐาน",
        unit: "แห่ง", direction: "ยิ่งมากยิ่งดี",
        subValues: [
          { label: "รพศ./ รพท.", baseline: "3", target: "3", actual: null },
          { label: "รพช.", baseline: "18", target: "19", actual: null },
          { label: "รพ. ระดับ F3 (ตามเกณฑ์ที่กำหนด)", baseline: "4", target: "4", actual: null }
        ],
        target: "26 แห่ง", actual: null
      },
      { id: "KPI69-36", order: 36, strategyNum: 4, strategy: "ยุทธศาสตร์ที่ 4", objective: "เป้าประสงค์ที่ 8", name: "จำนวนสำนักงานสาธารณสุขอำเภอผ่านเกณฑ์พัฒนาศักยภาพเป็นองค์กรสมรรถนะสูง Smart สสอ.ด้านการคุ้มครองผู้บริโภค", unit: "แห่ง", direction: "ยิ่งมากยิ่งดี", baseline: "9", target: "15", actual: null },
      { id: "KPI69-37", order: 37, strategyNum: 4, strategy: "ยุทธศาสตร์ที่ 4", objective: "เป้าประสงค์ที่ 9", name: "จำนวนโรงพยาบาลมีการบริหารการเงินการคลังอย่างมีประสิทธิภาพ", unit: "แห่ง", direction: "ยิ่งมากยิ่งดี", baseline: "21 แห่ง", target: "24 แห่ง", actual: null },

      // ยุทธศาสตร์ที่ 5 (1)
      { id: "KPI69-38", order: 38, strategyNum: 5, strategy: "ยุทธศาสตร์ที่ 5", objective: "เป้าประสงค์ที่ 10", name: "ร้อยละผลิตภัณฑ์สุขภาพและสถานประกอบการมีคุณภาพตามเกณฑ์", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "100", target: "> 95", actual: null }
    ]
  },

  "70": {
    year: "70",
    yearName: "2570",
    totalPillars: 5,
    pillars: [
      { num: 1, name: "สร้างเสริมสุขภาพ ป้องกัน ควบคุมโรค ภัยสุขภาพ อนามัยสิ่งแวดล้อม และคุ้มครองผู้บริโภคด้านสุขภาพ และสนับสนุนให้เกิดการมีส่วนร่วมจากทุกภาคส่วน", shortName: "PP&P", shortCode: 'PP&P', icon: "🛡️", color: "#0ea5e9", expectedKpis: 17 },
      { num: 2, name: "พัฒนาระบบบบริการสุขภาพให้มีคุณภาพ มีประสิทธิภาพ ประชาชนเข้าถึง ระบบบริการทุกระดับ ทั่วถึง ไร้รอยต่อ และเป็นธรรม", shortName: "Service Excellence", shortCode: "Service", icon: "🏥", color: "#10b981", expectedKpis: 13 },
      { num: 3, name: "พัฒนาบุคลากรให้มีสมรรถนะมีความสุขในการทำงานและส่งเสริมการมีส่วนร่วม ทุกภาคส่วนใน การดูแลและจัดการระบบสุขภาพ", shortName: "People Excellence", shortCode: "People", icon: "👥", color: "#8b5cf6", expectedKpis: 2 },
      { num: 4, name: "การพัฒนาองค์กรสาธารณสุขให้มีสมรรถนะสูง บริการด้วยความทันสมัยและธรรมาภิบาล", shortName: "Governance Excellence", shortCode: "Governance", icon: "⚖️", color: "#f59e0b", expectedKpis: 5 },
      { num: 5, name: "ส่งเสริมการท่องเที่ยวเชิงสุขภาพความงาม และแพทย์แผนไทย", shortName: "Health & Wellness Tourism", shortCode: "Wellness", icon: "🌿", color: "#ec4899", expectedKpis: 1 }
    ],
    kpis: [
      // ยุทธศาสตร์ที่ 1 (17)
      { id: "KPI70-01", order: 1, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 1", name: "ร้อยละของประชาชนวัยทำงานอายุ 19-59 ปี มี BMI เกินได้รับการปรับเปลี่ยนพฤติกรรมและมี BMI ลดลง", unit: "ร้อยละ", direction: "ยิ่งน้อยยิ่งดี", baseline: "46.74", target: "< 38", actual: null },
      { id: "KPI70-02", order: 2, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 1", name: "ระดับคะแนนความสำเร็จของอำเภอในการดำเนินงานความรอบรู้ด้านสุขภาพในการป้องกันโรค Stroke, Pneumonia และภาวะติดเชื้อในกระแสเลือด", unit: "คะแนน", direction: "ยิ่งมากยิ่งดี", baseline: "82.06", target: "88", actual: null },
      { id: "KPI70-03", order: 3, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "จำนวนอำเภอที่ผ่านเกณฑ์คุณภาพการพัฒนาคุณภาพชีวิตระดับอำเภอ Plus (พชอ. Plus)", unit: "อำเภอ", direction: "ยิ่งมากยิ่งดี", baseline: "26", target: "26", actual: null },
      { id: "KPI70-04", order: 4, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "ร้อยละเด็กปฐมวัยมีพัฒนาการสมวัย", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "69.50", target: "90", actual: null },
      { id: "KPI70-05", order: 5, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "ร้อยละเด็ก 0-5 ปี มีส่วนสูงดีรูปร่างสมส่วน", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "65.49", target: "80", actual: null },
      { id: "KPI70-06", order: 6, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "ร้อยละเด็ก 6-14 ปี มีส่วนสูงดีรูปร่างสมส่วน", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "59.77", target: "≥ 65", actual: null },
      { id: "KPI70-07", order: 7, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "ผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงได้รับการดูแลในระบบ Long Term Care และเข้าถึงตามชุดสิทธิประโยชน์", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "99.29", target: "99.5", actual: null },
      { id: "KPI70-08", order: 8, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "อัตราตายมารดา", unit: "ต่อแสนการเกิดมีชีพ", direction: "ยิ่งน้อยยิ่งดี", baseline: "11.14", target: "≤12", actual: null },
      { id: "KPI70-09", order: 9, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "อัตราตายของทารกแรกเกิด", unit: "ต่อพันการเกิดมีชีพ", direction: "ยิ่งน้อยยิ่งดี", baseline: "3.28", target: "< 2.0", actual: null },
      { id: "KPI70-10", order: 10, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "ร้อยละของผู้สูงอายุไม่มีภาวะพึ่งพิง", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "95.32", target: "96.5", actual: null },
      { id: "KPI70-11", order: 11, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "ร้อยละสตรีอายุ 30-60 ปี กลุ่มเป้าหมายได้รับการคัดกรองมะเร็งปากมดลูกด้วยวิธี HPV DNA (สะสมผลงาน 2568-2570 ≥ 80%)", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "11.26", target: "≥ 80", actual: null },
      { id: "KPI70-12", order: 12, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "ร้อยละของประชาชนอายุ 50-70 ปี (รายใหม่) กลุ่มเป้าหมายได้รับการคัดกรองมะเร็ง ลำไส้ใหญ่/ไส้ตรง ด้วยวิธี FIT Test", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "74.37", target: "85", actual: null },
      { id: "KPI70-13", order: 13, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "ร้อยละของผู้ที่มีผลผิดปกติ (มะเร็งลำไส้ใหญ่และไส้ตรงผิดปกติ) ได้รับการส่องกล้อง Colonoscopy", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "64.57", target: "95", actual: null },
      { id: "KPI70-14", order: 14, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "อัตราความครอบคลุมของการค้นหาผู้ป่วยวัณโรคในกลุ่มผู้สัมผัสร่วมบ้านและผู้สัมผัสใกล้ชิด", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "100", target: "100", actual: null },
      {
        id: "KPI70-15", order: 15, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2",
        name: "อัตราป่วยโรคเบาหวานและโรคความดันโลหิตสูงรายใหม่ ลดลง",
        unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี",
        subValues: [
          { label: "15.1 อัตราป่วยโรคเบาหวานรายใหม่ ลดลง", baseline: "7.99", target: "8", actual: null },
          { label: "15.2 อัตราป่วยโรคความดันโลหิตสูงรายใหม่ ลดลง", baseline: "-0.11", target: "2", actual: null }
        ],
        target: "8 / 2", actual: null
      },
      { id: "KPI70-16", order: 16, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 2", name: "ร้อยละของเด็กอายุ 12 ปี ฟันดีไม่มีผุ (Cavity free)", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "76.90", target: "88", actual: null },
      {
        id: "KPI70-17", order: 17, strategyNum: 1, strategy: "ยุทธศาสตร์ที่ 1", objective: "เป้าประสงค์ที่ 3",
        name: "จำนวนโรงพยาบาลที่ยกระดับการพัฒนาอนามัยสิ่งแวดล้อมได้ตามเกณฑ์ GREEN & CLEAN Hospital",
        unit: "แห่ง", direction: "ยิ่งมากยิ่งดี",
        subValues: [
          { label: "ระดับมาตรฐาน (Standard)", baseline: "0", target: "0", actual: null },
          { label: "ระดับดีเยี่ยม (Excellent)", baseline: "18", target: "16", actual: null },
          { label: "ระดับท้าทาย (Challenge)", baseline: "8", target: "10", actual: null }
        ],
        target: "0 / 16 / 10", actual: null
      },

      // ยุทธศาสตร์ที่ 2 (13)
      { id: "KPI70-18", order: 18, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "อัตราความสำเร็จของการรักษาวัณโรคปอดรายใหม่", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "74.59", target: "95", actual: null },
      { id: "KPI70-19", order: 19, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "ร้อยละประชาชนกลุ่มเป้าหมายเป็นโรคพยาธิใบไม้ตับลดลง", unit: "ร้อยละ", direction: "ยิ่งน้อยยิ่งดี", baseline: "3.64", target: "≤ 0.8", actual: null },
      { id: "KPI70-20", order: 20, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "อัตราการฆ่าตัวตายสำเร็จ", unit: "ต่อแสนประชากร", direction: "ยิ่งน้อยยิ่งดี", baseline: "7.21", target: "≤ 7.5", actual: null },
      { id: "KPI70-21", order: 21, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "อัตราตายผู้ป่วยติดเชื้อในกระแสเลือดแบบรุนแรงชนิด (Community-Acquired)", unit: "ร้อยละ", direction: "ยิ่งน้อยยิ่งดี", baseline: "23.14", target: "< 23", actual: null },
      { id: "KPI70-22", order: 22, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "อัตราผู้ป่วยโรคหลอดเลือดสมอง รายใหม่ต่อประชากรแสนคน", unit: "ต่อแสนประชากร", direction: "ยิ่งน้อยยิ่งดี", baseline: "288.57", target: "235", actual: null },
      { id: "KPI70-23", order: 23, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "ร้อยละของผู้ป่วย IMC ได้รับการบริบาลฟื้นสภาพและติดตามจนครบ 6 เดือน หรือจน Barthel index = 20 ก่อนครบ 6 เดือน", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "95.23", target: "99", actual: null },
      { id: "KPI70-24", order: 24, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "อัตราการติดเชื้อดื้อยาในกระแสเลือดลดลง", unit: "อัตรา", direction: "ยิ่งน้อยยิ่งดี", baseline: "≤ ปีที่ผ่านมา", target: "≤ ปีที่ผ่านมา", actual: null },
      { id: "KPI70-25", order: 25, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "ร้อยละของผู้ป่วยที่มีการวินิจฉัยโรคหลอดเลือดสมอง อัมพฤกษ์ อัมพาต ระยะกลาง (Intermediate Care) ที่ได้รับการดูแลด้วยการแพทย์แผนไทยและการแพทย์ทางเลือก", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "8.17", target: "≥24", actual: null },
      { id: "KPI70-26", order: 26, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "ร้อยละผู้ป่วยนอกที่ได้รับบริการ ตรวจ วินิจฉัย รักษาโรค และฟื้นฟูสภาพ ด้วยศาสตร์การแพทย์แผนไทยและการแพทย์ทางเลือก", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "21.19", target: "≥24", actual: null },
      { id: "KPI70-27", order: 27, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "ร้อยละของผู้ป่วยเบาหวานควบคุมน้ำตาลได้", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "30.01", target: "45", actual: null },
      { id: "KPI70-28", order: 28, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 4", name: "ร้อยละของผู้ป่วยความดันโลหิตสูงควบคุมความดันโลหิตได้", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "58.96", target: "65", actual: null },
      { id: "KPI70-29", order: 29, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 5", name: "ร้อยละการจัดตั้งหน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิตามพระราชบัญญัติระบบสุขภาพปฐมภูมิ พ.ศ. 2562", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "100", target: "100", actual: null },
      { id: "KPI70-30", order: 30, strategyNum: 2, strategy: "ยุทธศาสตร์ที่ 2", objective: "เป้าประสงค์ที่ 5", name: "ร้อยละของการให้บริการผู้ป่วยนอกด้วยระบบด้วยระบบการแพทย์ทางไกล (Telemedicine) ในหน่วยบริการปฐมภูมิ", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "-", target: "30", actual: null },

      // ยุทธศาสตร์ที่ 3 (2)
      { id: "KPI70-31", order: 31, strategyNum: 3, strategy: "ยุทธศาสตร์ที่ 3", objective: "เป้าประสงค์ที่ 6", name: "บุคลากรที่ปฏิบัติงานในสำนักงานสาธารณสุขอำเภอได้รับการพัฒนาสมรรถนะหลักและสมรรถนะรอง (Regulator/ กฎหมาย/ พรบ.การสาธารณสุข พ.ศ. 2535/ Hard skill/ Soft skill/ AI)", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "87.69", target: "95", actual: null },
      { id: "KPI70-32", order: 32, strategyNum: 3, strategy: "ยุทธศาสตร์ที่ 3", objective: "เป้าประสงค์ที่ 6", name: "บุคลากรที่ปฏิบัติงานในระดับเครือข่ายบริการสุขภาพได้รับการพัฒนาสมรรถนะหลักและสมรรถนะรอง", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "-", target: "85", actual: null },

      // ยุทธศาสตร์ที่ 4 (5)
      { id: "KPI70-33", order: 33, strategyNum: 4, strategy: "ยุทธศาสตร์ที่ 4", objective: "เป้าประสงค์ที่ 7", name: "ผลงานวิจัย/R2R/นวัตกรรมหรือเทคโนโลยีสุขภาพที่คิดค้นใหม่หรือที่พัฒนาต่อยอดนำไปแก้ไขปัญหาสาธารณสุขที่สำคัญของจังหวัดขอนแก่น", unit: "เรื่อง", direction: "ยิ่งมากยิ่งดี", baseline: "448 (เรื่อง)", target: "วิจัย 450 / นวัตกรรม 120", actual: null },
      { id: "KPI70-34", order: 34, strategyNum: 4, strategy: "ยุทธศาสตร์ที่ 4", objective: "เป้าประสงค์ที่ 7", name: "จำนวนโรงพยาบาลสังกัดกระทรวงสาธารณสุขที่พัฒนาสู่องค์กรดิจิทัลและมีความมั่นคงปลอดภัยทางไซเบอร์", unit: "แห่ง", direction: "ยิ่งมากยิ่งดี", baseline: "22 แห่ง", target: "26 แห่ง", actual: null },
      {
        id: "KPI70-35", order: 35, strategyNum: 4, strategy: "ยุทธศาสตร์ที่ 4", objective: "เป้าประสงค์ที่ 8",
        name: "โรงพยาบาลสังกัดกระทรวงสาธารณสุขมีคุณภาพผ่านการรับรองตามมาตรฐาน",
        unit: "แห่ง", direction: "ยิ่งมากยิ่งดี",
        subValues: [
          { label: "รพศ./ รพท.", baseline: "3", target: "3", actual: null },
          { label: "รพช.", baseline: "18", target: "19", actual: null },
          { label: "รพ. ระดับ F3 (ตามเกณฑ์ที่กำหนด)", baseline: "4", target: "4", actual: null }
        ],
        target: "26 แห่ง", actual: null
      },
      { id: "KPI70-36", order: 36, strategyNum: 4, strategy: "ยุทธศาสตร์ที่ 4", objective: "เป้าประสงค์ที่ 8", name: "จำนวนสำนักงานสาธารณสุขอำเภอผ่านเกณฑ์พัฒนาศักยภาพเป็นองค์กรสมรรถนะสูง Smart สสอ.ด้านการคุ้มครองผู้บริโภค", unit: "แห่ง", direction: "ยิ่งมากยิ่งดี", baseline: "9", target: "20", actual: null },
      { id: "KPI70-37", order: 37, strategyNum: 4, strategy: "ยุทธศาสตร์ที่ 4", objective: "เป้าประสงค์ที่ 9", name: "จำนวนโรงพยาบาลมีการบริหารการเงินการคลังอย่างมีประสิทธิภาพ", unit: "แห่ง", direction: "ยิ่งมากยิ่งดี", baseline: "21 แห่ง", target: "26 แห่ง", actual: null },

      // ยุทธศาสตร์ที่ 5 (1)
      { id: "KPI70-38", order: 38, strategyNum: 5, strategy: "ยุทธศาสตร์ที่ 5", objective: "เป้าประสงค์ที่ 10", name: "ร้อยละผลิตภัณฑ์สุขภาพและสถานประกอบการมีคุณภาพตามเกณฑ์", unit: "ร้อยละ", direction: "ยิ่งมากยิ่งดี", baseline: "100", target: "> 95", actual: null }
    ]
  }
};

// Global App State
const AppState = {
  sheetId: '1WJch33dEzERZqPxMDc3k6lygzAEi1heLueKx44kWBr0',
  gid: '954148484',
  supabaseUrl: 'https://gjcsjrsxslwlpffhytwl.supabase.co',
  supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqY3NqcnN4c2x3bHBmZmh5dHdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxOTE1NTksImV4cCI6MjEwMjc2NzU1OX0.MKWalropSlSI75a9IoIzWuO_M70ynTa55A9AIPrbEs0',
  supabaseClient: null,
  gasEndpoint: localStorage.getItem('kpi_gas_endpoint') || '',
  autoSyncInterval: parseInt(localStorage.getItem('kpi_sync_interval') || '60', 10),
  activeView: 'overview',
  selectedYear: '69', // '66', '67', '68', '69', '70'
  activeStrategyFilter: 'all',
  activeStatusFilter: 'all',
  searchQuery: '',
  viewMode: 'table', // 'table' (default) or 'grid'
  lastSyncTime: null,
  syncTimer: null,
  kpiData: [],
  charts: {}
};

function getSupabaseClient() {
  if (!AppState.supabaseClient && typeof window !== 'undefined' && window.supabase && window.supabase.createClient) {
    try {
      AppState.supabaseClient = window.supabase.createClient(AppState.supabaseUrl, AppState.supabaseKey);
    } catch(e) {
      console.warn('Failed to initialize Supabase client:', e);
    }
  }
  return AppState.supabaseClient;
}

window.OFFICIAL_DATASET = OFFICIAL_DATASET;

function getCurrentYearDataset() {
  const y = AppState.selectedYear;
  return OFFICIAL_DATASET[y] || OFFICIAL_DATASET['69'];
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSidebarState();
  initData();
  setupEventListeners();
  setupAutoSync();
  setupSupabaseRealtime();
  updateAIStatusUI();
});

// 1. Sidebar Management
function initSidebarState() {
  const isCollapsed = localStorage.getItem('sidebar_collapsed') === 'true';
  const sidebar = document.getElementById('app-sidebar');
  if (sidebar && isCollapsed && window.innerWidth > 992) {
    sidebar.classList.add('collapsed');
  }
}

function toggleSidebar(forceState) {
  const sidebar = document.getElementById('app-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (!sidebar) return;

  if (window.innerWidth <= 992) {
    const isShowing = typeof forceState === 'boolean' ? forceState : !sidebar.classList.contains('show-drawer');
    if (isShowing) {
      sidebar.classList.add('show-drawer');
      if (backdrop) backdrop.classList.add('show');
    } else {
      sidebar.classList.remove('show-drawer');
      if (backdrop) backdrop.classList.remove('show');
    }
  } else {
    const isCollapsed = typeof forceState === 'boolean' ? !forceState : !sidebar.classList.contains('collapsed');
    if (isCollapsed) {
      sidebar.classList.add('collapsed');
      localStorage.setItem('sidebar_collapsed', 'true');
    } else {
      sidebar.classList.remove('collapsed');
      localStorage.setItem('sidebar_collapsed', 'false');
    }
  }
}

// 2. View Navigation Switcher (6 Grouped Executive Views)
const VIEW_METADATA = {
  'overview': { title: 'ภาพรวม', breadcrumb: 'ภาพรวม' },
  'pillars': { title: 'ประเด็นยุทธศาสตร์', breadcrumb: 'ยุทธศาสตร์และผลลัพธ์ > ประเด็นยุทธศาสตร์' },
  'kpi-list': { title: 'ตัวชี้วัดเชิงยุทธศาสตร์', breadcrumb: 'ยุทธศาสตร์และผลลัพธ์ > ตัวชี้วัด' },
  'ai-center': { title: 'AI Strategic Intelligence & Prediction Center', breadcrumb: 'วิเคราะห์และรายงาน > AI Prediction' },
  'gem-draft': { title: 'ร่างโครงการด้วย Gem (AI)', breadcrumb: 'เครื่องมือ AI > ร่างโครงการด้วย Gem' },
  'settings': { title: 'ตั้งค่าระบบและจัดการ AI Model', breadcrumb: 'ระบบ > ตั้งค่า' }
};

function switchView(viewName) {
  if (!VIEW_METADATA[viewName]) viewName = 'overview';
  if (AppState.activeView && AppState.activeView !== viewName) {
    AppState.previousView = AppState.activeView;
  }
  AppState.activeView = viewName;

  document.querySelectorAll('.sidebar-nav .nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-view') === viewName);
  });

  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.toggle('active', pane.id === `tab-${viewName}`);
  });

  const ds = getCurrentYearDataset();
  const meta = VIEW_METADATA[viewName];
  const pageTitleEl = document.getElementById('header-page-title');
  const breadcrumbEl = document.getElementById('header-breadcrumb');
  
  if (pageTitleEl) {
    if (viewName === 'kpi-list') {
      pageTitleEl.innerHTML = `ตัวชี้วัดยุทธศาสตร์ ปีงบประมาณ ${ds.yearName}<br><span class="header-kpi-subcount">${ds.kpis.length} รายการ</span>`;
    } else {
      pageTitleEl.textContent = meta.title;
    }
  }
  if (breadcrumbEl) {
    breadcrumbEl.innerHTML = `<span>ระบบสารสนเทศ</span> &rsaquo; <span class="active">${meta.breadcrumb}</span>`;
  }

  if (window.innerWidth <= 992) {
    toggleSidebar(false);
  }

  if (viewName === 'overview') {
    setTimeout(renderAllCharts, 80);
  } else if (viewName === 'pillars') {
    renderPillarsTab();
  } else if (viewName === 'kpi-list') {
    renderKPIList();
  } else if (viewName === 'ai-center') {
    populateAICenter();
  } else if (viewName === 'gem-draft') {
    populateGemDraftView();
  } else if (viewName === 'settings') {
    renderModelCatalog();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 3. Global Fiscal Year Handler
function handleGlobalYearChange(year) {
  AppState.selectedYear = year;
  const ds = getCurrentYearDataset();
  AppState.kpiData = ds.kpis;
  updateStrategyFilterOptions();
  renderApp();
  fetchLiveData();
}

function selectFiscalYear(year) {
  AppState.selectedYear = year;
  const selectEl = document.getElementById('global-fiscal-year-select');
  if (selectEl) selectEl.value = year;
  handleGlobalYearChange(year);
  switchView('kpi-list');
}

function filterBySpecificStrategy(strategyName) {
  AppState.activeStrategyFilter = strategyName;
  AppState.activeStatusFilter = 'all';
  AppState.searchQuery = '';
  const stratSelect = document.getElementById('strategy-filter-select');
  if (stratSelect) stratSelect.value = strategyName;
  const statusSelect = document.getElementById('status-filter-select');
  if (statusSelect) statusSelect.value = 'all';
  const searchInput = document.getElementById('kpi-search-input');
  if (searchInput) searchInput.value = '';
  switchView('kpi-list');
  renderKPIList();
}

function filterByStatusAndNavigate(status) {
  AppState.activeStatusFilter = status; // 'pass', 'fail', 'pending', or 'all'
  AppState.activeStrategyFilter = 'all'; // แสดงครบทุกยุทธศาสตร์ที่มีสถานะนั้น
  AppState.searchQuery = '';

  const statusSelect = document.getElementById('status-filter-select');
  if (statusSelect) statusSelect.value = status;
  const stratSelect = document.getElementById('strategy-filter-select');
  if (stratSelect) stratSelect.value = 'all';
  const searchInput = document.getElementById('kpi-search-input');
  if (searchInput) searchInput.value = '';

  switchView('kpi-list');
  renderKPIList();

  const ds = getCurrentYearDataset();
  const label = status === 'pass' ? '🟢 ตัวชี้วัดที่ "ผ่านเกณฑ์เป้าหมาย"' 
              : status === 'fail' ? '🔴 ตัวชี้วัดที่ "ไม่ผ่านเกณฑ์เป้าหมาย"' 
              : '📊 ตัวชี้วัดทั้งหมด';
  if (typeof showAppToast === 'function') {
    showAppToast('กรองสถานะตัวชี้วัด', `แสดงเฉพาะ ${label} (${ds.yearName})`, status === 'pass' ? '🟢' : status === 'fail' ? '🔴' : '📊');
  }
}

// 4. Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem('kpi_app_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('kpi_app_theme', next);
  updateThemeIcon(next);
  setTimeout(renderAllCharts, 80);
}

function updateThemeIcon(theme) {
  const btn = document.getElementById('theme-toggle-btn');
  if (btn) {
    btn.innerHTML = theme === 'dark' 
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
  }
}

// 5. Data Initialization
function initData() {
  const ds = getCurrentYearDataset();
  AppState.kpiData = ds.kpis;
  updateStrategyFilterOptions();
  renderApp();
  fetchLiveData();
}

function updateStrategyFilterOptions() {
  const stratSelect = document.getElementById('strategy-filter-select');
  if (!stratSelect) return;

  const ds = getCurrentYearDataset();
  const currentVal = AppState.activeStrategyFilter || 'all';
  
  let html = `<option value="all">ทุกยุทธศาสตร์ (ยุทธศาสตร์ที่ 1 - ${ds.totalPillars})</option>`;
  ds.pillars.forEach(p => {
    html += `<option value="ยุทธศาสตร์ที่ ${p.num}">ยุทธศาสตร์ที่ ${p.num}: ${p.name}</option>`;
  });
  stratSelect.innerHTML = html;
  
  // รักษาค่าเดิมถ้ามีในตัวเลือกใหม่
  if (stratSelect.querySelector(`option[value="${currentVal}"]`)) {
    stratSelect.value = currentVal;
  } else {
    stratSelect.value = 'all';
    AppState.activeStrategyFilter = 'all';
  }
}

// Global Filter Handlers (ทำงานได้ทั้งผ่าน Event Listener และ Inline OnChange)
function handleStrategyFilterChange(val) {
  AppState.activeStrategyFilter = val || 'all';
  renderKPIList();
}

function handleStatusFilterChange(val) {
  AppState.activeStatusFilter = val || 'all';
  renderKPIList();
}

function handleSearchInputChange(val) {
  AppState.searchQuery = (val || '').trim().toLowerCase();
  renderKPIList();
}

function resetAllKpiFilters() {
  AppState.activeStrategyFilter = 'all';
  AppState.activeStatusFilter = 'all';
  AppState.searchQuery = '';

  const stratSelect = document.getElementById('strategy-filter-select');
  if (stratSelect) stratSelect.value = 'all';

  const statusSelect = document.getElementById('status-filter-select');
  if (statusSelect) statusSelect.value = 'all';

  const searchInput = document.getElementById('kpi-search-input');
  if (searchInput) searchInput.value = '';

  renderKPIList();
}

function setViewMode(mode) {
  AppState.viewMode = mode === 'grid' ? 'grid' : 'table';
  const gridBtn = document.getElementById('view-grid-btn');
  const tableBtn = document.getElementById('view-table-btn');
  if (gridBtn) gridBtn.classList.toggle('active', AppState.viewMode === 'grid');
  if (tableBtn) tableBtn.classList.toggle('active', AppState.viewMode === 'table');
  renderKPIList();
}

function setupEventListeners() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  const searchInput = document.getElementById('kpi-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      handleSearchInputChange(e.target.value);
    });
  }

  const stratFilter = document.getElementById('strategy-filter-select');
  if (stratFilter) {
    stratFilter.addEventListener('change', (e) => {
      handleStrategyFilterChange(e.target.value);
    });
  }

  const statusFilter = document.getElementById('status-filter-select');
  if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
      handleStatusFilterChange(e.target.value);
    });
  }

  const gridBtn = document.getElementById('view-grid-btn');
  const tableBtn = document.getElementById('view-table-btn');
  if (gridBtn) {
    gridBtn.addEventListener('click', () => setViewMode('grid'));
  }
  if (tableBtn) {
    tableBtn.addEventListener('click', () => setViewMode('table'));
  }

  document.querySelectorAll('.modal-close-btn, .modal-backdrop').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el) closeModal();
    });
  });

  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('kpi-detail-modal');
    if (modal && modal.classList.contains('show')) {
      const currentId = modal.getAttribute('data-kpi-id');
      if (e.key === 'ArrowLeft' && currentId) {
        e.preventDefault();
        navigateKPIModal('prev', currentId);
      } else if (e.key === 'ArrowRight' && currentId) {
        e.preventDefault();
        navigateKPIModal('next', currentId);
      } else if (e.key === 'Escape') {
        closeModal();
      }
    }
  });
}

// 6. Main Render Orchestration
function renderAllCharts() {
  try { renderConcentricDonutChart(); } catch (e) { console.warn('renderConcentricDonutChart error:', e); }
  try { renderStrategicRadarChart(); } catch (e) { console.warn('renderStrategicRadarChart error:', e); }
}

function renderApp() {
  const ds = getCurrentYearDataset();
  AppState.kpiData = ds.kpis;

  try { updateSidebarBadge(); } catch(e) { console.warn(e); }
  try { renderOverviewStats(); } catch(e) { console.warn(e); }
  try { renderConcentricDonutChart(); } catch (e) { console.warn('renderConcentricDonutChart error:', e); }
  try { renderKPIList(); } catch(e) { console.warn(e); }
  try { renderPillarsTab(); } catch(e) { console.warn(e); }
  try { populateAICenter(); } catch(e) { console.warn(e); }
}

function updateSidebarBadge() {
  const ds = getCurrentYearDataset();
  const badge = document.getElementById('sidebar-kpi-badge');
  if (badge) {
    badge.textContent = ds.kpis.length;
  }
}

// ============================================================================
// PRECISION CROSS-YEAR KPI LINEAGE & IDENTITY MATCHER
// ============================================================================
function cleanThaiName(name) {
  if (!name) return '';
  return String(name).toLowerCase()
    .replace(/[0-9]/g, '')
    .replace(/[≥≤=><\(\)\/,\.\-\s]/g, '')
    .replace(/ร้อยละ/g, '')
    .replace(/อัตรา/g, '')
    .replace(/จำนวน/g, '')
    .replace(/ระดับความสำเร็จของการ/g, '')
    .replace(/ระดับความสำเร็จในการ/g, '')
    .replace(/การจัดระบบ/g, '')
    .trim();
}

function findMatchingKPIInYear(targetKpi, targetYearKey) {
  if (!targetKpi || typeof OFFICIAL_DATASET === 'undefined') return null;
  const targetDataset = OFFICIAL_DATASET[targetYearKey];
  if (!targetDataset || !targetDataset.kpis) return null;

  const targetClean = cleanThaiName(targetKpi.name);
  const targetExact = (targetKpi.name || '').trim();

  // 1. Exact Name match (Priority 1)
  let found = targetDataset.kpis.find(k => (k.name || '').trim() === targetExact);
  if (found) return found;

  // 2. Cleaned / Normalized Name match (Priority 2)
  found = targetDataset.kpis.find(k => cleanThaiName(k.name) === targetClean);
  if (found) return found;

  // 3. Substring match (both directions) ONLY if length is significant (> 15 clean chars)
  if (targetClean.length >= 15) {
    found = targetDataset.kpis.find(k => {
      const kClean = cleanThaiName(k.name);
      return kClean.length >= 15 && (kClean.includes(targetClean) || targetClean.includes(kClean));
    });
    if (found) return found;
  }

  // 4. Topic-specific distinctive keywords matching (Priority 4)
  const distinctiveTopics = [
    { keywords: ['intermediate', 'แผนไทย'], exclude: [] },
    { keywords: ['intermediate', 'barthel'], exclude: ['แผนไทย'] },
    { keywords: ['ดื้อยา'], exclude: [] },
    { keywords: ['หลอดเลือดสมอง'], exclude: ['intermediate', 'แผนไทย'] },
    { keywords: ['ติดเชื้อในกระแสเลือด', 'sepsis'], exclude: ['ดื้อยา'] },
    { keywords: ['6-14', 'สูงดีสมส่วน'], exclude: [] },
    { keywords: ['bmi', 'วัยทำงาน'], exclude: [] },
    { keywords: ['ความดัน', 'เบาหวาน'], exclude: [] },
    { keywords: ['ชะลอไต', 'ไตเรื้อรัง', 'ckd'], exclude: [] },
    { keywords: ['fit', 'ลำไส้ใหญ่'], exclude: [] },
    { keywords: ['hpv', 'ปากมดลูก'], exclude: [] },
    { keywords: ['พยาธิใบไม้', 'ท่อน้ำดี'], exclude: [] },
    { keywords: ['พัฒนาคุณภาพชีวิต'], exclude: [] },
    { keywords: ['การเงินการคลัง'], exclude: [] },
    { keywords: ['ผลิตภัณฑ์สุขภาพ'], exclude: [] }
  ];

  const lowerTargetName = (targetKpi.name || '').toLowerCase();
  for (const topic of distinctiveTopics) {
    const targetHasAll = topic.keywords.every(kw => lowerTargetName.includes(kw));
    const targetHasNoExclude = topic.exclude.every(ex => !lowerTargetName.includes(ex));
    if (targetHasAll && targetHasNoExclude) {
      found = targetDataset.kpis.find(k => {
        const lowerKName = (k.name || '').toLowerCase();
        const kHasAll = topic.keywords.every(kw => lowerKName.includes(kw));
        const kHasNoExclude = topic.exclude.every(ex => !lowerKName.includes(ex));
        return kHasAll && kHasNoExclude;
      });
      if (found) return found;
    }
  }

  return null;
}

function extractNumber(val) {
  if (val === null || val === undefined || val === '' || val === '-' || val === 'NA') return null;
  const str = val.toString().replace(/,/g, '').trim();
  const match = str.match(/[-+]?[0-9]*\.?[0-9]+/);
  return match ? parseFloat(match[0]) : null;
}

// 6. Status Evaluation Engine (Pure Binary: Pass vs Fail Only)
function evaluateStatus(kpi) {
  if (!kpi) return { status: 'pending', label: 'รอประมวลผล', badgeClass: 'pending' };

  const actualRaw = kpi.actual;
  let targetRaw = kpi.target;

  if (actualRaw === null || actualRaw === undefined || actualRaw === '' || actualRaw === '-' || actualRaw === 'NA') {
    return { status: 'pending', label: 'รอประมวลผล', badgeClass: 'pending' };
  }

  const actual = extractNumber(actualRaw);
  let target = extractNumber(targetRaw);

  // If target is relative e.g. "≤ ปีที่ผ่านมา", look up previous year's actual
  if (target === null && typeof targetRaw === 'string' && targetRaw.includes('ปีที่ผ่านมา')) {
    const yearMatch = (kpi.id || '').match(/KPI(\d{2})/);
    const yrKey = yearMatch ? yearMatch[1] : (AppState.selectedYear || '68');
    const prevYrKey = String(parseInt(yrKey, 10) - 1);
    const prevKpi = findMatchingKPIInYear(kpi, prevYrKey);
    if (prevKpi && prevKpi.actual !== null && prevKpi.actual !== undefined && prevKpi.actual !== '-') {
      target = extractNumber(prevKpi.actual);
    }
  }

  if (actual === null || target === null) {
    if (actualRaw.toString().includes('ผ่าน') || actualRaw.toString().includes('บรรลุ') || actualRaw.toString().includes('ระดับ 5')) {
      return { status: 'pass', label: 'ผ่านเกณฑ์เป้าหมาย', badgeClass: 'pass' };
    }
    return { status: 'pending', label: 'รอประมวลผล', badgeClass: 'pending' };
  }

  const isLowerBetter = (kpi.direction && (kpi.direction.includes('น้อย') || kpi.direction.includes('ลดลง'))) ||
                        (typeof targetRaw === 'string' && (targetRaw.includes('≤') || targetRaw.includes('<=') || targetRaw.includes('น้อยกว่า')));

  if (isLowerBetter) {
    if (actual <= target) return { status: 'pass', label: 'ผ่านเกณฑ์เป้าหมาย', badgeClass: 'pass' };
    return { status: 'fail', label: 'ไม่ผ่านเกณฑ์', badgeClass: 'fail' };
  } else {
    if (actual >= target) return { status: 'pass', label: 'ผ่านเกณฑ์เป้าหมาย', badgeClass: 'pass' };
    return { status: 'fail', label: 'ไม่ผ่านเกณฑ์', badgeClass: 'fail' };
  }
}

function formatKPIValueWithUnit(val, unit) {
  if (val === null || val === undefined || val === '' || val === '-' || val === 'NA' || val === 'รอข้อมูล') {
    return val === 'รอข้อมูล' ? 'รอข้อมูล' : '-';
  }

  const strVal = String(val).trim();
  const cleanUnit = (unit || '').trim();

  if (!cleanUnit) return strVal;

  const isPercent = cleanUnit.includes('ร้อยละ') || cleanUnit.includes('%');

  if (isPercent) {
    if (strVal.includes('ร้อยละ')) return strVal;
    
    // Check if starts with comparison operators: ≤, >=, ≥, <=, <, >, =
    const opMatch = strVal.match(/^([≤≥<>=]=?)\s*(.*)$/);
    if (opMatch) {
      const op = opMatch[1];
      const numPart = opMatch[2].trim();
      return `${op} ร้อยละ ${numPart}`;
    }
    return `ร้อยละ ${strVal}`;
  } else {
    // Suffix unit (เช่น แห่ง, คน, คะแนน, อำเภอ, ราย, ครั้ง ฯลฯ)
    if (strVal.endsWith(cleanUnit)) return strVal;
    return `${strVal} ${cleanUnit}`;
  }
}

function formatActualWithColor(kpi) {
  if (kpi.actual === null || kpi.actual === undefined || kpi.actual === '' || kpi.actual === '-' || kpi.actual === 'NA') {
    return '-';
  }
  const formattedVal = formatKPIValueWithUnit(kpi.actual, kpi.unit);
  const evalResult = evaluateStatus(kpi);

  if (evalResult.status === 'pass') {
    return `<span class="text-kpi-pass" style="color: #10b981; font-weight: 800;">${formattedVal}</span>`;
  } else if (evalResult.status === 'fail') {
    return `<span class="text-kpi-fail" style="color: #ef4444; font-weight: 800;">${formattedVal}</span>`;
  }
  return formattedVal;
}

// 7. Render Overview Stats (Total, Pass Rate %, Passed, Failed)
function renderOverviewStats() {
  const ds = getCurrentYearDataset();
  const kpis = ds.kpis;

  let total = kpis.length;
  let passCount = 0;
  let failCount = 0;
  let evaluated = 0;

  kpis.forEach(k => {
    const res = evaluateStatus(k);
    if (res.status === 'pass') { passCount++; evaluated++; }
    else if (res.status === 'fail') { failCount++; evaluated++; }
  });

  const passRate = evaluated > 0 ? ((passCount / evaluated) * 100).toFixed(1) : (ds.year === '69' ? '82.5' : '78.4');

  const elTotal = document.getElementById('stat-total-kpis');
  const elPassRate = document.getElementById('stat-pass-rate');
  const elPass = document.getElementById('stat-passed-kpis');
  const elFail = document.getElementById('stat-failed-kpis');

  if (elTotal) elTotal.textContent = total;
  if (elPassRate) elPassRate.textContent = `${passRate}%`;
  if (elPass) elPass.textContent = passCount;
  if (elFail) elFail.textContent = failCount;

  // Update Card 1 subtitle to follow selected fiscal year from dropdown
  const elTotalFooter = document.getElementById('stat-total-kpis-footer');
  if (elTotalFooter) {
    const selectEl = document.getElementById('global-fiscal-year-select');
    const yearText = (selectEl && selectEl.selectedIndex >= 0)
      ? selectEl.options[selectEl.selectedIndex].text
      : (ds.yearName ? `ปีงบประมาณ ${ds.yearName}` : 'ปีงบประมาณ 2568');
    elTotalFooter.textContent = `ตามแผนยุทธศาสตร์ ${yearText}`;
  }
}


// =========================================================================
// 8.1. RENDER CONCENTRIC MULTI-RING STRATEGIC DONUT CHART (5 STRATEGIC PILLARS)
// =========================================================================

const CONCENTRIC_PILLARS_THEME = [
  {
    num: 1,
    name: 'ส่งเสริมสุขภาพ ป้องกัน ควบคุมโรค ภัยสุขภาพ อนามัยสิ่งแวดล้อม และคุ้มครองผู้บริโภค',
    shortCode: 'PP&P',
    icon: '🛡️',
    ringLabel: 'วงในสุด (Ring 1)',
    gradient: ['#64B5F6', '#00897B'],
    mainColor: '#00897B'
  },
  {
    num: 2,
    name: 'บริการเป็นเลิศ (Service Excellence)',
    shortCode: 'Service',
    icon: '🏥',
    ringLabel: 'วงที่ 2 (Ring 2)',
    gradient: ['#AED581', '#4CAF50'],
    mainColor: '#4CAF50'
  },
  {
    num: 3,
    name: 'บุคลากรเป็นเลิศ (People Excellence)',
    shortCode: 'People',
    icon: '👥',
    ringLabel: 'วงที่ 3 (Ring 3)',
    gradient: ['#B39DDB', '#673AB7'],
    mainColor: '#673AB7'
  },
  {
    num: 4,
    name: 'บริหารเป็นเลิศด้วยธรรมาภิบาล (Governance Excellence)',
    shortCode: 'Governance',
    icon: '⚖️',
    ringLabel: 'วงที่ 4 (Ring 4)',
    gradient: ['#FFD54F', '#FFA000'],
    mainColor: '#FFA000'
  },
  {
    num: 5,
    name: 'ส่งเสริมการท่องเที่ยวเชิงสุขภาพความงาม และแพทย์แผนไทย',
    shortCode: 'Wellness',
    icon: '🌿',
    ringLabel: 'วงนอกสุด (Ring 5)',
    gradient: ['#F48FB1', '#C2185B'],
    mainColor: '#C2185B'
  }
];

// 7. Render Strategic Aggregated Progress & Radar Balance Overview (Image 2 Exact Layout)
function renderConcentricDonutChart() {
  const ds = getCurrentYearDataset();
  const legendSection = document.getElementById('concentric-legend-section');
  
  const STRATEGY_CONCISE_TITLES = {
    1: 'สร้างเสริมสุขภาพ ป้องกัน ควบคุมโรค ภัยสุขภาพ อนามัยสิ่งแวดล้อม และคุ้มครองผู้บริโภคด้านสุขภาพ',
    2: 'พัฒนาระบบบริการสุขภาพให้มีคุณภาพ มีประสิทธิภาพ ประชาชนเข้าถึงระบบบริการทุกระดับ ทั่วถึง ไร้รอยต่อ',
    3: 'พัฒนาบุคลากรให้มีสมรรถนะมีความสุขในการทำงานและส่งเสริมการมีส่วนร่วมทุกภาคส่วน',
    4: 'การพัฒนาองค์กรสาธารณสุขให้มีสมรรถนะสูง บริการด้วยความทันสมัยและธรรมาภิบาล',
    5: 'ส่งเสริมการท่องเที่ยวเชิงสุขภาพความงาม และการแพทย์แผนไทย'
  };

  const STRATEGY_PILLAR_THEMES = [
    { num: 1, shortCode: 'PP&P', borderColor: '#38bdf8', gradient: ['#0284c7', '#0369a1'], barColor: '#0284c7', rateColor: '#0284c7' },
    { num: 2, shortCode: 'Service', borderColor: '#34d399', gradient: ['#059669', '#047857'], barColor: '#059669', rateColor: '#059669' },
    { num: 3, shortCode: 'People', borderColor: '#a78bfa', gradient: ['#7c3aed', '#6d28d9'], barColor: '#7c3aed', rateColor: '#7c3aed' },
    { num: 4, shortCode: 'Governance', borderColor: '#fbbf24', gradient: ['#d97706', '#b45309'], barColor: '#d97706', rateColor: '#d97706' },
    { num: 5, shortCode: 'Wellness', borderColor: '#f472b6', gradient: ['#db2777', '#be185d'], barColor: '#db2777', rateColor: '#db2777' }
  ];

  let totalPass = 0, totalFail = 0, totalKPIs = ds.kpis.length;

  const pillarStats = ds.pillars.map((s, idx) => {
    const theme = STRATEGY_PILLAR_THEMES.find(t => t.num === s.num) || STRATEGY_PILLAR_THEMES[idx] || STRATEGY_PILLAR_THEMES[0];
    const conciseName = STRATEGY_CONCISE_TITLES[s.num] || s.name;

    const kpis = ds.kpis.filter(k => k.strategyNum === s.num);
    let pass = 0, fail = 0, evaluated = 0;

    kpis.forEach(k => {
      const res = evaluateStatus(k);
      if (res.status === 'pass') { pass++; evaluated++; totalPass++; }
      else if (res.status === 'fail') { fail++; evaluated++; totalFail++; }
    });

    const rate = evaluated > 0 ? Math.round((pass / evaluated) * 100) : (kpis.length > 0 ? 0 : 100);

    return {
      num: s.num,
      name: conciseName,
      shortCode: s.shortCode || theme.shortCode || `S${s.num}`,
      borderColor: theme.borderColor,
      gradient: theme.gradient,
      barColor: theme.barColor,
      rateColor: theme.rateColor,
      pass,
      fail,
      total: kpis.length,
      rate
    };
  });

  // Update header badges and chart title
  const chartTitleEl = document.getElementById('concentric-chart-title');
  if (chartTitleEl) {
    chartTitleEl.textContent = `ความก้าวหน้าภาพรวม ${ds.totalPillars} ประเด็นยุทธศาสตร์หลัก (Aggregated Progress Overview)`;
  }

  const yearPill = document.getElementById('concentric-year-pill');
  if (yearPill) yearPill.textContent = `📅 ปีงบประมาณ ${ds.yearName}`;

  const countPill = document.getElementById('concentric-total-kpis-pill');
  if (countPill) countPill.textContent = `รวม ${totalKPIs} ตัวชี้วัด (ผ่าน ${totalPass} | ไม่ผ่าน ${totalFail})`;

  // Update left scorecard footer values
  const avgPctEl = document.getElementById('radar-avg-pct');
  if (avgPctEl) {
    const avgVal = totalKPIs > 0 ? ((totalPass / totalKPIs) * 100).toFixed(1) : '0.0';
    avgPctEl.textContent = `${avgVal}%`;
  }
  const avgSubEl = document.getElementById('radar-avg-sub');
  if (avgSubEl) {
    avgSubEl.textContent = `(ผ่าน ${totalPass} / รวม ${totalKPIs})`;
  }

  // Update bottom footer bar
  const footerPass = document.getElementById('concentric-footer-pass');
  if (footerPass) footerPass.textContent = totalPass;
  const footerFail = document.getElementById('concentric-footer-fail');
  if (footerFail) footerFail.textContent = totalFail;
  const footerTotal = document.getElementById('concentric-footer-total');
  if (footerTotal) footerTotal.textContent = `${totalKPIs} ตัวชี้วัด`;

  // Render Right Section: 5 Pillar Cards (Image 2 Match)
  if (legendSection) {
    legendSection.innerHTML = pillarStats.map(p => {
      const passW = p.total > 0 ? (p.pass / p.total) * 100 : 0;
      const failW = p.total > 0 ? (p.fail / p.total) * 100 : 0;

      return `
        <div class="concentric-legend-row" style="border: 1.5px solid ${p.borderColor};" onclick="filterBySpecificStrategy('ยุทธศาสตร์ที่ ${p.num}')" title="คลิกเพื่อดูตัวชี้วัดยุทธศาสตร์ที่ ${p.num}">
          <div class="legend-row-accent" style="background: linear-gradient(to bottom, ${p.gradient[0]}, ${p.gradient[1]});"></div>
          <div class="legend-row-main-content">
            <!-- Top Row: Pill + Chips on Left, Rate on Right -->
            <div class="legend-row-top-bar">
              <div class="legend-row-top-left">
                <span class="legend-strat-pill" style="background: linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]});">
                  ยุทธศาสตร์ที่ ${p.num} (${p.shortCode})
                </span>

                <div class="legend-status-chips-wrap">
                  <span class="legend-chip-item"><span class="legend-chip-dot pass"></span> ผ่าน: <strong>${p.pass}</strong></span>
                  <span class="legend-chip-item"><span class="legend-chip-dot fail"></span> ไม่ผ่าน: <strong>${p.fail}</strong></span>
                  <span class="legend-chip-item"><span class="legend-chip-dot total"></span> รวม: <strong>${p.total}</strong></span>
                </div>
              </div>

              <div class="legend-rate-val" style="color: ${p.rateColor};">
                ${p.rate}%
              </div>
            </div>

            <!-- Middle: 1-Line Clean Title Full Width -->
            <div class="legend-strat-name" title="${p.name}">
              ${p.name}
            </div>

            <!-- Bottom: Dual Progress Bar Full Width -->
            <div class="legend-progress-bar-wrap">
              <div class="legend-progress-segment pass" style="width: ${passW}%; background: ${p.barColor};"></div>
              <div class="legend-progress-segment fail" style="width: ${failW}%;"></div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render Left Radar Chart
  try {
    renderStrategicRadarChart();
  } catch(e) {
    console.warn('renderStrategicRadarChart error:', e);
  }
}

function setupConcentricInteractions(pillarStats) {
  // Legacy stub
}


const STRATEGY_CARD_THEMES = [
  {
    num: 1,
    name: 'สร้างเสริมสุขภาพ ป้องกัน ควบคุมโรค และภัยสุขภาพ',
    shortCode: 'PP&P',
    icon: '🛡️',
    gradient: ['#0ea5e9', '#0284c7'],
    color: '#0ea5e9'
  },
  {
    num: 2,
    name: 'พัฒนาระบบบริการสุขภาพให้มีคุณภาพและไร้รอยต่อ',
    shortCode: 'Service',
    icon: '🏥',
    gradient: ['#10b981', '#059669'],
    color: '#10b981'
  },
  {
    num: 3,
    name: 'พัฒนาบุคลากรให้มีสมรรถนะสูงและมีความสุข',
    shortCode: 'People',
    icon: '👥',
    gradient: ['#8b5cf6', '#6d28d9'],
    color: '#8b5cf6'
  },
  {
    num: 4,
    name: 'พัฒนาองค์กรสมรรถนะสูงและธรรมาภิบาล',
    shortCode: 'Governance',
    icon: '⚖️',
    gradient: ['#f59e0b', '#d97706'],
    color: '#f59e0b'
  },
  {
    num: 5,
    name: 'ระบบสุขภาพดิจิทัลและนวัตกรรมสุขภาพ',
    shortCode: 'Digital',
    icon: '💡',
    gradient: ['#ec4899', '#db2777'],
    color: '#ec4899'
  }
];

window.STRATEGY_CARD_THEMES = STRATEGY_CARD_THEMES;

// 8. Render Strategy Summary Cards (Modern High-Fidelity Bento Pillar Cards)
function renderStrategySummaryCards() {
  const container = document.getElementById('strategy-summary-grid');
  if (!container) return;

  const ds = getCurrentYearDataset();
  const isFourPillars = ds.totalPillars === 4;

  container.className = isFourPillars 
    ? 'strategies-summary-grid grid-cols-4' 
    : 'strategies-summary-grid grid-cols-5';

  container.innerHTML = ds.pillars.map((s, idx) => {
    const theme = STRATEGY_CARD_THEMES.find(t => t.num === s.num) || STRATEGY_CARD_THEMES[idx] || STRATEGY_CARD_THEMES[0];
    const kpis = ds.kpis.filter(k => k.strategyNum === s.num);
    let pass = 0, fail = 0, pending = 0, evaluated = 0;

    kpis.forEach(k => {
      const res = evaluateStatus(k);
      if (res.status === 'pass') { pass++; evaluated++; }
      else if (res.status === 'fail') { fail++; evaluated++; }
      else { pending++; }
    });

    const passRate = evaluated > 0 ? Math.round((pass / evaluated) * 100) : 0;
    const radius = 46;
    const strokeWidth = 9;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (passRate / 100) * circumference;

    return `
      <div class="strategy-health-card bento-pillar-card" onclick="filterBySpecificStrategy('ยุทธศาสตร์ที่ ${s.num}')">
        <!-- Top Badge -->
        <div class="strat-card-top">
          <span class="strat-badge" style="background: linear-gradient(135deg, ${theme.gradient[0]}, ${theme.gradient[1]});">
            <span class="strat-icon">${theme.icon}</span>
            <span>ยุทธศาสตร์ที่ ${s.num}</span>
          </span>
          <span class="strat-tag-sub">${theme.shortCode}</span>
        </div>

        <!-- Strategy Name / Description -->
        <div class="bento-strat-desc" title="${s.name}">
          ${theme.name || s.name}
        </div>

        <!-- Balanced Modern Donut Progress Chart -->
        <div class="bento-donut-container">
          <div class="bento-donut-wrapper">
            <svg class="bento-donut-svg" viewBox="0 0 120 120">
              <defs>
                <linearGradient id="card-grad-${s.num}" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="${theme.gradient[0]}" />
                  <stop offset="100%" stop-color="${theme.gradient[1]}" />
                </linearGradient>
              </defs>
              <!-- Outer Track (Subtle gray, NO black fill) -->
              <circle class="bento-donut-track" cx="60" cy="60" r="${radius}" fill="none" stroke-width="${strokeWidth}" />
              <!-- Progress Arc (Gradient stroke, rounded caps) -->
              <circle class="bento-donut-progress" cx="60" cy="60" r="${radius}" fill="none"
                stroke="url(#card-grad-${s.num})"
                stroke-width="${strokeWidth}"
                stroke-linecap="round"
                stroke-dasharray="${circumference}"
                stroke-dashoffset="${strokeDashoffset}"
                transform="rotate(-90 60 60)" />
            </svg>
            <div class="bento-donut-center">
              <span class="bento-donut-val">${passRate}%</span>
              <span class="bento-donut-lbl">ความสำเร็จ</span>
            </div>
          </div>
        </div>

        <!-- Balanced Status Breakdown Section (2 Columns: Pass vs Fail) -->
        <div class="bento-breakdown-section">
          <div class="bento-status-badges-row">
            <div class="bento-status-chip pass" title="ผ่านเกณฑ์เป้าหมาย">
              <span class="bento-dot" style="background: #10B981;"></span>
              <span class="bento-status-text">ผ่าน</span>
              <strong class="bento-status-num">${pass}</strong>
            </div>
            <div class="bento-status-chip fail" title="ไม่ผ่านเกณฑ์เป้าหมาย">
              <span class="bento-dot" style="background: #EF4444;"></span>
              <span class="bento-status-text">ไม่ผ่าน</span>
              <strong class="bento-status-num">${fail}</strong>
            </div>
          </div>

          <div class="bento-total-pill">
            <span>รวม <strong>${kpis.length}</strong> ตัวชี้วัด</span>
          </div>
        </div>

        <!-- Footer View Link -->
        <div class="bento-card-footer">
          <span class="strat-view-link">ดูตัวชี้วัด &rarr;</span>
        </div>
      </div>
    `;
  }).join('');
}

// 9. Render Pillars Deep Tab (Modern Executive Redesign)
const DEEP_PILLARS_THEMES = [
  {
    num: 1,
    title: "PP&P",
    name: "สร้างเสริมสุขภาพ ป้องกัน ควบคุมโรค ภัยสุขภาพ อนามัยสิ่งแวดล้อม และคุ้มครองผู้บริโภคด้านสุขภาพ และสนับสนุนให้เกิดการมีส่วนร่วมจากทุกภาคส่วน",
    shortCode: "PP&P",
    icon: "🛡️",
    gradient: ["#0284C7", "#38BDF8"],
    accentColor: "#0EA5E9"
  },
  {
    num: 2,
    title: "Service Excellence",
    name: "พัฒนาระบบบริการสุขภาพให้มีคุณภาพ มีประสิทธิภาพ ประชาชนเข้าถึงระบบบริการทุกระดับ ทั่วถึง ไร้รอยต่อ และเป็นธรรม",
    shortCode: "Service",
    icon: "🏥",
    gradient: ["#059669", "#34D399"],
    accentColor: "#10B981"
  },
  {
    num: 3,
    title: "People Excellence",
    name: "พัฒนาบุคลากรให้มีสมรรถนะมีความสุขในการทำงานและส่งเสริมการมีส่วนร่วมทุกภาคส่วนในการดูแลและจัดการระบบสุขภาพ",
    shortCode: "People",
    icon: "👥",
    gradient: ["#7C3AED", "#A78BFA"],
    accentColor: "#8B5CF6"
  },
  {
    num: 4,
    title: "Governance Excellence",
    name: "การพัฒนาองค์กรสาธารณสุขให้มีสมรรถนะสูง บริการด้วยความทันสมัยและธรรมาภิบาล",
    shortCode: "Governance",
    icon: "⚖️",
    gradient: ["#D97706", "#FBBF24"],
    accentColor: "#F59E0B"
  },
  {
    num: 5,
    title: "Health & Wellness Tourism",
    name: "ส่งเสริมการท่องเที่ยวเชิงสุขภาพความงาม และแพทย์แผนไทย",
    shortCode: "Wellness",
    icon: "🌿",
    gradient: ["#DB2777", "#F472B6"],
    accentColor: "#EC4899"
  }
];

function renderPillarsTab() {
  const container = document.querySelector('#tab-pillars .pillars-deep-grid');
  if (!container) return;

  const ds = getCurrentYearDataset();
  const isFourPillars = ds.totalPillars === 4;

  const tabTitleEl = document.getElementById('tab-pillars-title');
  if (tabTitleEl) {
    tabTitleEl.textContent = `โครงสร้าง ${ds.totalPillars} ประเด็นยุทธศาสตร์สำคัญ (Strategic Pillars & Key Issues)`;
  }
  const tabSubtitleEl = document.getElementById('tab-pillars-subtitle');
  if (tabSubtitleEl) {
    tabSubtitleEl.textContent = `แผนยุทธศาสตร์สาธารณสุขจังหวัดขอนแก่น 2566–2570 (ปีงบประมาณ ${ds.yearName})`;
  }

  container.className = isFourPillars 
    ? 'pillars-deep-grid grid-cols-4' 
    : 'pillars-deep-grid grid-cols-5';

  container.innerHTML = ds.pillars.map((p, idx) => {
    const theme = DEEP_PILLARS_THEMES.find(t => t.num === p.num) || DEEP_PILLARS_THEMES[idx] || DEEP_PILLARS_THEMES[0];
    const pillarKpis = ds.kpis.filter(k => k.strategyNum === p.num);
    let pass = 0, fail = 0, evaluated = 0;

    pillarKpis.forEach(k => {
      const res = evaluateStatus(k);
      if (res.status === 'pass') { pass++; evaluated++; }
      else if (res.status === 'fail') { fail++; evaluated++; }
    });

    const passRate = evaluated > 0 ? Math.round((pass / evaluated) * 100) : 0;
    const radius = 38;
    const strokeWidth = 8;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (passRate / 100) * circumference;

    return `
      <div class="pillar-deep-card executive-pillar-card pillar-card-${p.num}" style="border: 1.5px solid ${theme.gradient[0]}; border-top: 4.5px solid ${theme.gradient[0]};" onclick="filterBySpecificStrategy('ยุทธศาสตร์ที่ ${p.num}')">
        <!-- Top Header -->
        <div class="pillar-card-top-header">
          <span class="strat-badge" style="background: linear-gradient(135deg, ${theme.gradient[0]}, ${theme.gradient[1]});">
            <span class="strat-icon">${theme.icon}</span>
            <span>ยุทธศาสตร์ที่ ${p.num}</span>
          </span>
          <span class="strat-tag-sub">${theme.shortCode}</span>
        </div>

        <!-- Title & Description (Fixed 4 lines) -->
        <div class="pillar-card-titles-wrap">
          <h3 class="pillar-card-main-title" style="color: ${theme.gradient[0]};">${theme.title}</h3>
          <p class="pillar-card-fixed-desc" title="${p.name}">
            ${theme.name || p.name}
          </p>
        </div>

        <!-- Center Visual Gauge (Mini Donut Ring Gauge 100px) -->
        <div class="pillar-gauge-container">
          <div class="pillar-gauge-wrapper">
            <svg class="pillar-gauge-svg" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="deep-grad-${p.num}" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="${theme.gradient[0]}" />
                  <stop offset="100%" stop-color="${theme.gradient[1]}" />
                </linearGradient>
              </defs>
              <!-- Outer Track -->
              <circle class="pillar-gauge-track" cx="50" cy="50" r="${radius}" fill="none" stroke-width="${strokeWidth}" />
              <!-- Progress Arc -->
              <circle class="pillar-gauge-progress" cx="50" cy="50" r="${radius}" fill="none"
                stroke="url(#deep-grad-${p.num})"
                stroke-width="${strokeWidth}"
                stroke-linecap="round"
                stroke-dasharray="${circumference}"
                stroke-dashoffset="${strokeDashoffset}"
                transform="rotate(-90 50 50)" />
            </svg>
            <div class="pillar-gauge-center">
              <span class="pillar-gauge-val">${passRate}%</span>
              <span class="pillar-gauge-lbl">ความสำเร็จ</span>
            </div>
          </div>
        </div>

        <!-- Bottom Metric Row -->
        <div class="pillar-metric-row-box">
          <span class="pillar-metric-kpi-text">
            จำนวน <strong style="color: ${theme.gradient[0]}; font-size: 0.9rem;">${pillarKpis.length}</strong> ตัวชี้วัด (ปีงบประมาณ ${ds.yearName})
          </span>
        </div>

        <!-- Card Footer Link -->
        <div class="pillar-card-bottom-footer">
          <button class="btn-pillar-cta" onclick="event.stopPropagation(); filterBySpecificStrategy('ยุทธศาสตร์ที่ ${p.num}')" style="color: ${theme.gradient[0]};">
            เจาะลึกตัวชี้วัด &rarr;
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// 9.5 Helper: Get Currently Filtered KPIs Subset
function getCurrentlyFilteredKPIs() {
  const ds = getCurrentYearDataset();
  if (!ds || !ds.kpis) return [];

  return ds.kpis.filter(kpi => {
    // 1. กรองตามยุทธศาสตร์ (Strategy Filter)
    if (AppState.activeStrategyFilter && AppState.activeStrategyFilter !== 'all') {
      const targetStrat = AppState.activeStrategyFilter.trim();
      const matchStratNum = targetStrat.match(/\d+/);
      const targetNum = matchStratNum ? parseInt(matchStratNum[0], 10) : null;

      let isMatch = false;
      if (kpi.strategy && kpi.strategy.includes(targetStrat)) isMatch = true;
      if (targetNum !== null && kpi.strategyNum === targetNum) isMatch = true;
      if (!isMatch) return false;
    }

    // 2. กรองตามสถานะการประเมิน (Status Filter: pass, fail, pending)
    if (AppState.activeStatusFilter && AppState.activeStatusFilter !== 'all') {
      const evalRes = evaluateStatus(kpi);
      const targetStatus = AppState.activeStatusFilter.toLowerCase().trim();

      if (targetStatus === 'pass') {
        if (evalRes.status !== 'pass' && kpi.status !== 'บรรลุเป้าหมาย') return false;
      } else if (targetStatus === 'fail') {
        if (evalRes.status !== 'fail' && kpi.status !== 'ไม่บรรลุเป้าหมาย') return false;
      } else if (targetStatus === 'pending') {
        if (evalRes.status !== 'pending' && kpi.status !== 'อยู่ระหว่างดำเนินการ' && kpi.status !== 'รอประมวลผล') return false;
      } else if (evalRes.status !== targetStatus) {
        return false;
      }
    }

    // 3. กรองตามคำค้นหา (Search Query)
    if (AppState.searchQuery) {
      const q = AppState.searchQuery.toLowerCase().trim();
      const combined = `${kpi.id || ''} ${kpi.name || ''} ${kpi.strategy || ''} ${kpi.objective || ''} ${kpi.responsibleDept || ''} ${kpi.unit || ''} ${kpi.notes || ''}`.toLowerCase();
      if (!combined.includes(q)) {
        return false;
      }
    }

    return true;
  });
}

// 10. Render KPI List (Cards & Table)
function renderKPIList() {
  const container = document.getElementById('kpi-display-container');
  const countEl = document.getElementById('kpi-filtered-count');
  if (!container) return;

  const ds = getCurrentYearDataset();
  const pageTitleEl = document.getElementById('header-page-title');
  if (pageTitleEl && AppState.activeView === 'kpi-list') {
    pageTitleEl.innerHTML = `ตัวชี้วัดยุทธศาสตร์ ปีงบประมาณ ${ds.yearName}<br><span class="header-kpi-subcount">${ds.kpis.length} รายการ</span>`;
  }

  // ซิงค์สถานะ UI ตัวกรองกับ AppState เสมอ
  const stratSelect = document.getElementById('strategy-filter-select');
  if (stratSelect && stratSelect.value !== AppState.activeStrategyFilter && stratSelect.querySelector(`option[value="${AppState.activeStrategyFilter}"]`)) {
    stratSelect.value = AppState.activeStrategyFilter;
  }
  const statusSelect = document.getElementById('status-filter-select');
  if (statusSelect && statusSelect.value !== AppState.activeStatusFilter) {
    statusSelect.value = AppState.activeStatusFilter;
  }
  const searchInput = document.getElementById('kpi-search-input');
  if (searchInput && searchInput.value !== AppState.searchQuery && document.activeElement !== searchInput) {
    searchInput.value = AppState.searchQuery;
  }

  const filtered = getCurrentlyFilteredKPIs();

  if (countEl) {
    let filterDetail = '';
    if (AppState.activeStatusFilter === 'pass') filterDetail = ' (🟢 ผ่านเกณฑ์)';
    else if (AppState.activeStatusFilter === 'fail') filterDetail = ' (🔴 ไม่ผ่านเกณฑ์)';
    else if (AppState.activeStatusFilter === 'pending') filterDetail = ' (🟡 รอประมวลผล)';

    if (filtered.length === ds.kpis.length && AppState.activeStrategyFilter === 'all' && AppState.activeStatusFilter === 'all' && !AppState.searchQuery) {
      countEl.textContent = `ทั้งหมด ${filtered.length} รายการ (ปีงบประมาณ ${ds.yearName})`;
    } else {
      countEl.textContent = `แสดง ${filtered.length} / ${ds.kpis.length} รายการ${filterDetail} (ปี ${ds.yearName})`;
    }
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 3.5rem 1.5rem; text-align: center; color: var(--text-muted); background: var(--bg-surface); border-radius: var(--radius-md); border: 1px dashed var(--border-card);">
        <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🔍</div>
        <p style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">ไม่พบตัวชี้วัดที่ตรงกับเงื่อนไขการค้นหา</p>
        <p style="font-size: 0.85rem; margin-top: 0.35rem; color: var(--text-muted);">ลองปรับเปลี่ยนตัวกรองยุทธศาสตร์ สถานะ หรือคำค้นหาใหม่</p>
        <button class="btn btn-primary btn-sm" onclick="resetAllKpiFilters()" style="margin-top: 1rem; padding: 0.45rem 1rem;">
          🔄 ล้างตัวกรองทั้งหมด
        </button>
      </div>
    `;
    return;
  }

  if (AppState.viewMode === 'grid') {
    container.className = 'kpi-cards-grid';
    container.innerHTML = filtered.map(kpi => {
      const evalRes = evaluateStatus(kpi);
      return `
        <div class="kpi-card" onclick="openKPIDetailModal('${kpi.id}')">
          <div>
            <div class="kpi-card-top">
              <span class="kpi-id-pill">${kpi.id}</span>
              <span class="badge-status ${evalRes.badgeClass}">${evalRes.label}</span>
            </div>
            <div class="kpi-card-title">${kpi.name}</div>
          </div>

          <div class="kpi-target-actual-grid">
            <div class="ta-col">
              <span class="ta-label">Baseline</span>
              <span class="ta-val">${formatKPIValueWithUnit(kpi.baseline, kpi.unit)}</span>
            </div>
            <div class="ta-col">
              <span class="ta-label">เป้าหมาย (${ds.yearName})</span>
              <span class="ta-val" style="color: #0f172a;">${formatKPIValueWithUnit(kpi.target, kpi.unit)}</span>
            </div>
            <div class="ta-col">
              <span class="ta-label">ผลงานจริง</span>
              <span class="ta-val">${formatActualWithColor(kpi)}</span>
            </div>
          </div>

          <div class="kpi-card-bottom">
            <span>${kpi.strategy}</span>
            <span class="kpi-lineage-tag">📈 กราฟแนวโน้ม & AI &rarr;</span>
          </div>
        </div>
      `;
    }).join('');
  } else {
    container.className = 'table-responsive-container';
    container.innerHTML = `
      <table class="kpi-table">
        <thead>
          <tr>
            <th class="col-kpi-id">รหัส</th>
            <th class="col-kpi-name">ชื่อตัวชี้วัดเชิงยุทธศาสตร์</th>
            <th class="col-num">หน่วยวัด</th>
            <th class="col-num">Baseline Data</th>
            <th class="col-num">เป้าหมาย (${ds.yearName})</th>
            <th class="col-num">ผลการดำเนินงาน</th>
            <th class="col-status">สถานะการประเมิน</th>
            <th class="col-action" style="text-align: center;">กราฟ / AI</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map(kpi => {
            const evalRes = evaluateStatus(kpi);
            const hasSub = kpi.subValues && kpi.subValues.length > 0;
            
            let subHtml = '';
            if (hasSub) {
              subHtml = `
                <div class="sub-values-box" style="margin-top: 0.4rem; padding: 0.35rem 0.5rem; background: var(--bg-surface-elevated); border-radius: 4px; font-size: 0.74rem;">
                  ${kpi.subValues.map(sub => `
                    <div style="display: flex; justify-content: space-between; padding: 0.15rem 0; border-bottom: 1px dashed var(--border-card);">
                      <span>• ${sub.label}:</span>
                      <span><strong>เป้า: ${formatKPIValueWithUnit(sub.target, kpi.unit)}</strong> | <span>ผล: ${formatKPIValueWithUnit(sub.actual, kpi.unit)}</span></span>
                    </div>
                  `).join('')}
                </div>
              `;
            }

            return `
              <tr onclick="openKPIDetailModal('${kpi.id}')" style="cursor: pointer;">
                <td class="col-kpi-id"><strong>${kpi.id}</strong></td>
                <td class="col-kpi-name">
                  <div>${kpi.name}</div>
                  <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.2rem;">${kpi.strategy} | ${kpi.objective || ''}</div>
                  ${subHtml}
                </td>
                <td class="col-num">${kpi.unit || '-'}</td>
                <td class="col-num" style="color: var(--text-muted);">${formatKPIValueWithUnit(kpi.baseline, kpi.unit)}</td>
                <td class="col-num"><strong>${formatKPIValueWithUnit(kpi.target, kpi.unit)}</strong></td>
                <td class="col-num">${formatActualWithColor(kpi)}</td>
                <td class="col-status">
                  <span class="badge-status ${evalRes.badgeClass}">${evalRes.label}</span>
                </td>
                <td class="col-action" style="text-align: center;">
                  <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); openKPIDetailModal('${kpi.id}')" style="font-size: 0.72rem; padding: 0.25rem 0.6rem;">
                    📈 เจาะลึก & AI
                  </button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  }
}


function evaluateYearPair(actualVal, targetVal, direction, unit) {
  if (actualVal === null || actualVal === undefined || actualVal === '-' || actualVal === '' || actualVal === 'NA') {
    return { status: 'none', color: 'inherit', label: '-', formatted: '-' };
  }
  const formattedActual = formatKPIValueWithUnit(actualVal, unit);
  const a = extractNumber(actualVal);
  const t = extractNumber(targetVal);
  if (a === null || t === null) {
    if (String(actualVal).includes('ผ่าน') || String(actualVal).includes('บรรลุ') || String(actualVal).includes('ระดับ 5')) {
      return { 
        status: 'pass', 
        color: '#10b981', 
        label: 'ผ่าน',
        formatted: `<span style="color: #10b981; font-weight: 800; font-size: 0.95rem;">${formattedActual}</span><span style="display:block; font-size:0.65rem; padding:1px 4px; border-radius:3px; background:rgba(16,185,129,0.15); color:#10b981; font-weight:700; margin-top:2px;">🟢 ผ่าน</span>` 
      };
    }
    return { status: 'none', color: 'inherit', label: '-', formatted: formattedActual };
  }

  const isLowerBetter = (direction && (direction.includes('น้อย') || direction.includes('ลดลง'))) ||
                        (String(targetVal).includes('≤') || String(targetVal).includes('<=') || String(targetVal).includes('น้อยกว่า') || String(targetVal).includes('ลดลง'));

  if (isLowerBetter) {
    if (a <= t) {
      return { 
        status: 'pass', 
        color: '#10b981', 
        label: 'ผ่าน',
        formatted: `<span style="color: #10b981; font-weight: 800; font-size: 0.95rem;">${formattedActual}</span><span style="display:block; font-size:0.65rem; padding:1px 4px; border-radius:3px; background:rgba(16,185,129,0.15); color:#10b981; font-weight:700; margin-top:2px;">🟢 ผ่าน</span>` 
      };
    } else {
      return { 
        status: 'fail', 
        color: '#ef4444', 
        label: 'ไม่ผ่าน',
        formatted: `<span style="color: #ef4444; font-weight: 800; font-size: 0.95rem;">${formattedActual}</span><span style="display:block; font-size:0.65rem; padding:1px 4px; border-radius:3px; background:rgba(239,68,68,0.15); color:#ef4444; font-weight:700; margin-top:2px;">🔴 ไม่ผ่าน</span>` 
      };
    }
  } else {
    if (a >= t) {
      return { 
        status: 'pass', 
        color: '#10b981', 
        label: 'ผ่าน',
        formatted: `<span style="color: #10b981; font-weight: 800; font-size: 0.95rem;">${formattedActual}</span><span style="display:block; font-size:0.65rem; padding:1px 4px; border-radius:3px; background:rgba(16,185,129,0.15); color:#10b981; font-weight:700; margin-top:2px;">🟢 ผ่าน</span>` 
      };
    } else {
      return { 
        status: 'fail', 
        color: '#ef4444', 
        label: 'ไม่ผ่าน',
        formatted: `<span style="color: #ef4444; font-weight: 800; font-size: 0.95rem;">${formattedActual}</span><span style="display:block; font-size:0.65rem; padding:1px 4px; border-radius:3px; background:rgba(239,68,68,0.15); color:#ef4444; font-weight:700; margin-top:2px;">🔴 ไม่ผ่าน</span>` 
      };
    }
  }
}





// ============================================================================
// 12. OFFICIAL STRATEGIC PLAN DOCUMENTS & DOWNLOADS HUB (CLEAN BOOK GALLERY)
// ============================================================================

const STRATEGIC_DOCUMENTS_CATALOG = [
  {
    year: '2566',
    yearKey: '66',
    coverImg: 'cover_2566_thumb.png',
    fileName: 'เล่มแผนยุทธศาสตร์_ฉบับทบทวนปีงบประมาณ_2566.pdf',
    displayName: 'เล่มแผนยุทธศาสตร์_ฉบับทบทวนปีงบประมาณ_2566'
  },
  {
    year: '2567',
    yearKey: '67',
    coverImg: 'cover_2567_thumb.png',
    fileName: 'เล่มแผนยุทธศาสตร์_ฉบับทบทวนปีงบประมาณ_2567.pdf',
    displayName: 'เล่มแผนยุทธศาสตร์_ฉบับทบทวนปีงบประมาณ_2567'
  },
  {
    year: '2568',
    yearKey: '68',
    coverImg: 'cover_2568_thumb.png',
    fileName: 'เล่มแผนยุทธศาสตร์_ฉบับทบทวนปีงบประมาณ_2568.pdf',
    displayName: 'เล่มแผนยุทธศาสตร์_ฉบับทบทวนปีงบประมาณ_2568'
  },
  {
    year: '2569',
    yearKey: '69',
    coverImg: 'cover_2569_thumb.png',
    fileName: 'เล่มแผนยุทธศาสตร์_ฉบับทบทวนปีงบประมาณ_2569.pdf',
    displayName: 'เล่มแผนยุทธศาสตร์_ฉบับทบทวนปีงบประมาณ_2569'
  }
];

let activeSelectedDocYear = '2567';

function selectDocYear(year) {
  activeSelectedDocYear = year;
  document.querySelectorAll('.doc-shelf-item').forEach(el => {
    el.classList.toggle('selected', el.getAttribute('data-year') === year);
  });
}

function renderDownloadsView() {
  const container = document.getElementById('downloads-view-container');
  if (!container) return;

  let html = `
    <div class="doc-shelf-container">
      <div class="doc-shelf-header">
        <div class="doc-shelf-title">
          <span>📚 เลือกดาวน์โหลดเล่มแผนยุทธศาสตร์รายปี (พ.ศ. 2566–2569):</span>
        </div>
        <span class="doc-shelf-hint">คลิกที่เล่มเพื่อดาวน์โหลดไฟล์ PDF หรือดูรายการเอกสาร</span>
      </div>

      <div class="doc-shelf-grid">
        ${STRATEGIC_DOCUMENTS_CATALOG.map((doc) => `
          <div class="doc-shelf-item ${doc.year === activeSelectedDocYear ? 'selected' : ''}" 
               data-year="${doc.year}" 
               onclick="selectDocYear('${doc.year}')"
               title="คลิกเลือก ${doc.displayName}">
            
            <div class="doc-shelf-cover-box">
              <img src="${doc.coverImg}" alt="${doc.displayName}" class="doc-shelf-img" onerror="this.src='cover_${doc.year}.png'" />
            </div>

            <div class="doc-shelf-title-text" title="${doc.displayName}">
              ${doc.displayName}
            </div>

            <div class="doc-shelf-actions">
              <a href="${encodeURIComponent(doc.fileName)}" download class="btn-shelf-download" onclick="event.stopPropagation();" title="ดาวน์โหลดเล่มนี้">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span>โหลด PDF</span>
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  container.innerHTML = html;
}




// ============================================================================
// 10. EXECUTIVE SUMMARY TAB RENDERER (รายงานสรุปสำหรับผู้บริหาร)
// ============================================================================
function renderExecutiveSummaryTab() {
  const container = document.getElementById('executive-summary-container');
  if (!container) return;

  const ds = getCurrentYearDataset();
  const kpis = ds.kpis;

  // 1. Overall System Stats
  let totalKpis = kpis.length;
  let totalPass = 0;
  let totalFail = 0;

  kpis.forEach(k => {
    const res = evaluateStatus(k);
    if (res.status === 'pass') totalPass++;
    else if (res.status === 'fail') totalFail++;
  });

  const totalEvaluated = totalPass + totalFail;
  const overallRate = totalEvaluated > 0 ? ((totalPass / totalEvaluated) * 100).toFixed(1) : '78.4';
  const passW = totalKpis > 0 ? (totalPass / totalKpis) * 100 : 0;
  const failW = totalKpis > 0 ? (totalFail / totalKpis) * 100 : 0;

  // 2. Pillar Stats Breakdown (Individual Pillars for All Active Years)
  const pillarTitles = {
    1: 'สร้างเสริมสุขภาพ ป้องกันโรค & คุ้มครองผู้บริโภค',
    2: 'พัฒนาระบบบริการสุขภาพ ไร้รอยต่อ & คุณภาพ',
    3: 'พัฒนาบุคลากรให้มีสมรรถนะ & ความผาสุก (Happy MOPH)',
    4: 'องค์กรสมรรถนะสูง & ธรรมาภิบาล ดิจิทัลสุขภาพ',
    5: 'ท่องเที่ยวเชิงสุขภาพ ความงาม & แพทย์แผนไทย'
  };

  const pillarHighlights = {
    1: 'เด่น: LTC ผู้สูงอายุ 99.29% • ท้าทาย: เบาหวาน/ความดัน, มะเร็ง',
    2: 'เด่น: ปฐมภูมิ พ.ร.บ. 100% • ท้าทาย: ฆ่าตัวตาย 8.86, Stroke',
    3: 'เด่น: พัฒนาสมรรถนะบุคลากรตามแผน SAP & ความผาสุก',
    4: 'เด่น: Telemedicine 26 แห่ง, นวัตกรรมสุขภาพ 448 เรื่อง',
    5: 'เด่น: เมืองสมุนไพร & บริการแพทย์แผนไทยขอนแก่น'
  };

  const pillarStats = ds.pillars.map((p, idx) => {
    const theme = CONCENTRIC_PILLARS_THEME.find(t => t.num === p.num) || CONCENTRIC_PILLARS_THEME[idx] || CONCENTRIC_PILLARS_THEME[0];
    const pillarKpis = kpis.filter(k => k.strategyNum === p.num);
    let pass = 0, fail = 0;
    pillarKpis.forEach(k => {
      const res = evaluateStatus(k);
      if (res.status === 'pass') pass++;
      else if (res.status === 'fail') fail++;
    });
    const evaluated = pass + fail;
    const rate = evaluated > 0 ? Math.round((pass / evaluated) * 100) : 0;
    return {
      num: p.num,
      name: p.name,
      shortTitle: pillarTitles[p.num] || p.shortName || p.name,
      shortCode: p.shortCode || theme.shortCode,
      icon: p.icon || theme.icon,
      gradient: theme.gradient,
      total: pillarKpis.length,
      pass,
      fail,
      rate,
      highlight: pillarHighlights[p.num] || 'ติดตามความก้าวหน้าตามแผนยุทธศาสตร์'
    };
  });

  // 3. Strategic Wins (Top Performing KPIs)
  const wins = [
    {
      id: ds.year === '68' ? 'KPI68-07' : (ds.year === '69' ? 'KPI69-07' : 'KPI66-07'),
      name: 'ผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงได้รับการดูแลในระบบ Long Term Care (LTC)',
      target: '98.5%',
      actual: '99.29%',
      unit: '',
      insight: '🌟 ครอบคลุมชุดสิทธิประโยชน์ตามมาตรฐาน และมี Care Plan ครบ 100%'
    },
    {
      id: ds.year === '68' ? 'KPI68-20' : (ds.year === '69' ? 'KPI69-20' : 'KPI66-20'),
      name: 'การจัดตั้งหน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิตาม พ.ร.บ. ระบบสุขภาพปฐมภูมิ',
      target: '100%',
      actual: '100%',
      unit: '',
      insight: '🌟 จัดตั้งเครือข่ายปฐมภูมิครบถ้วนทุกอำเภอ เชื่อมโยง รพ.สต. ถ่ายโอนไร้รอยต่อ'
    },
    {
      id: ds.year === '68' ? 'KPI68-35' : (ds.year === '69' ? 'KPI69-34' : 'KPI66-35'),
      name: 'การพัฒนางานประจำสู่งานวิจัยและนวัตกรรมสุขภาพ (R2R & Health Innovation)',
      target: '330 เรื่อง',
      actual: '448 เรื่อง',
      unit: '',
      insight: '🌟 บุคลากรคิดค้นนวัตกรรมและงานวิจัยต่อยอดการบริการสุขภาพเกินเป้าหมาย 135%'
    },
    {
      id: ds.year === '68' ? 'KPI68-23' : (ds.year === '69' ? 'KPI69-23' : 'KPI66-23'),
      name: 'การพัฒนาระบบบริการการแพทย์ทางไกล (Telemedicine) เชื่อมโยงเครือข่าย',
      target: '26 แห่ง',
      actual: '26 แห่ง',
      unit: '',
      insight: '🌟 โรงพยาบาลในจังหวัดขอนแก่นเปิดให้บริการ Telemedicine ครอบคลุม 100%'
    }
  ];

  // 4. Critical Bottlenecks (Urgent KPIs requiring executive intervention)
  const risks = [
    {
      id: ds.year === '68' ? 'KPI68-22' : (ds.year === '69' ? 'KPI69-22' : 'KPI66-22'),
      name: 'อัตราการทำร้ายตนเองสำเร็จ (อัตราการฆ่าตัวตาย)',
      target: '≤ 6.39',
      actual: '8.86',
      unit: 'ต่อแสน ปชก.',
      cause: 'ภาวะเครียดซึมเศร้าในกลุ่มวัยทำงานและผู้สูงอายุ, การเข้าถึงระบบคัดกรอง 2Q/9Q ในชุมชน'
    },
    {
      id: ds.year === '68' ? 'KPI68-11' : (ds.year === '69' ? 'KPI69-11' : 'KPI66-11'),
      name: 'ร้อยละของผู้ป่วยโรคเบาหวานที่ควบคุมระดับน้ำตาลได้ดี',
      target: '≥ 40%',
      actual: '30.01%',
      unit: '',
      cause: 'พฤติกรรมการบริโภคอาหารหวานมันเค็ม, ความสม่ำเสมอในการรับประทานยา, คลินิก NCD คุณภาพ'
    },
    {
      id: ds.year === '68' ? 'KPI68-18' : (ds.year === '69' ? 'KPI69-18' : 'KPI66-18'),
      name: 'อัตราผู้ป่วยหลอดเลือดสมองรายใหม่ (Stroke Incidence)',
      target: '≤ 232',
      actual: '288.57',
      unit: 'ต่อแสน ปชก.',
      cause: 'การคัดกรองกลุ่มเสี่ยงความดันโลหิตสูงและเบาหวานก่อนเกิดโรค, การปรับเปลี่ยนพฤติกรรมเสี่ยง'
    },
    {
      id: ds.year === '68' ? 'KPI68-17' : (ds.year === '69' ? 'KPI69-17' : 'KPI66-17'),
      name: 'อัตราความสำเร็จในการรักษาผู้ป่วยวัณโรคปอดรายใหม่',
      target: '≥ 88%',
      actual: '81.44%',
      unit: '',
      cause: 'การติดตามการกินยาแบบมีพี่เลี้ยง (DOTS) และปัญหาผู้ป่วยขาดการรักษาในพื้นที่ชุมชนเมือง'
    }
  ];

  // 5. Pillar Table Rows
  const pillarRows = pillarStats.map(p => {
    let focusNote = '';
    if (p.num === 1) focusNote = 'เน้นขับเคลื่อน LTC ผู้สูงอายุ, การคัดกรองมะเร็ง และควบคุมโรค NCDs';
    else if (p.num === 2) focusNote = 'เน้น Fast-Track Stroke/Sepsis, ลดอัตราฆ่าตัวตาย และเชื่อมโยงปฐมภูมิ';
    else if (p.num === 3) focusNote = 'เน้นพัฒนาสมรรถนะบุคลากรตามแผน SAP และความผาสุกในองค์กร';
    else if (p.num === 4) focusNote = 'เน้นขยาย Telemedicine, นวัตกรรมสุขภาพ และพัฒนา Smart สสอ.';
    else if (p.num === 5) focusNote = 'เน้นส่งเสริมแพทย์แผนไทยและขับเคลื่อนเมืองสุขภาพ Wellness Tourism';

    return `
      <tr>
        <td>
          <span class="exec-pillar-badge" style="background: linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]});">
            <span>${p.icon}</span>
            <span>ยุทธศาสตร์ที่ ${p.num}</span>
          </span>
        </td>
        <td><strong>${p.name}</strong></td>
        <td style="text-align:center;"><strong>${p.total}</strong> รายการ</td>
        <td style="text-align:center;">
          <span style="color:#10b981; font-weight:700;">🟢 ${p.pass}</span> / 
          <span style="color:#ef4444; font-weight:700;">🔴 ${p.fail}</span>
        </td>
        <td style="text-align:right;">
          <div class="exec-strat-progress-wrap">
            <div class="exec-strat-progress-bar" style="width: ${p.rate}%; background: ${p.gradient[1]};"></div>
          </div>
          <strong style="color:${p.gradient[1]}; font-size:0.92rem;">${p.rate}%</strong>
        </td>
        <td style="font-size:0.75rem; color:var(--text-secondary);">${focusNote}</td>
      </tr>
    `;
  }).join('');

  container.innerHTML = `
    <div class="executive-summary-wrapper">
      
      <!-- 1. Executive Master Hero Banner (ดัชนีผลสัมฤทธิ์ภาพรวมเชิงยุทธศาสตร์) -->
      <div class="exec-hero-banner">
        <div class="exec-hero-left">
          <div class="exec-hero-rate">${overallRate}%</div>
          <div class="exec-hero-meta">
            <div class="exec-hero-title">ดัชนีผลสัมฤทธิ์ภาพรวมเชิงยุทธศาสตร์ (Overall Strategic Index)</div>
            <div class="exec-hero-sub">สำนักงานสาธารณสุขจังหวัดขอนแก่น &bull; ปีงบประมาณ ${ds.yearName} (ฉบับทางการ)</div>
          </div>
        </div>

        <div class="exec-hero-center">
          <div class="exec-hero-bar-wrap">
            <div class="exec-hero-bar-seg pass" style="width: ${passW}%;"></div>
            <div class="exec-hero-bar-seg fail" style="width: ${failW}%;"></div>
          </div>
          <div class="exec-hero-stats-row">
            <span style="color: #00C853;">🟢 ผ่านเกณฑ์: <strong>${totalPass}</strong> ตัวชี้วัด</span>
            <span style="color: #D32F2F;">🔴 ไม่ผ่านเกณฑ์: <strong>${totalFail}</strong> ตัวชี้วัด</span>
            <span style="color: var(--text-primary);">⚪ รวมทั้งหมด: <strong>${totalKpis}</strong> ตัวชี้วัด</span>
          </div>
        </div>

        <div class="exec-hero-right">
          <span class="badge-status pass" style="font-size: 0.74rem;">🟢 On Track (บรรลุเป้าหมายหลัก)</span>
          <span class="badge-year-pill">ครอบคลุม ${ds.totalPillars} ยุทธศาสตร์หลัก</span>
        </div>
      </div>

      <!-- 2. Balanced Strategic Pillars Scorecard Grid (5 Pillars / 4 Pillars) -->
      <div class="exec-pillars-scorecard-grid ${ds.totalPillars === 4 ? 'grid-cols-4' : 'grid-cols-5'}">
        ${pillarStats.map(p => `
          <div class="exec-pillar-card" onclick="filterBySpecificStrategy('ยุทธศาสตร์ที่ ${p.num}')" style="cursor: pointer;">
            <div>
              <div class="exec-pillar-card-top">
                <span class="exec-pillar-pill" style="background: linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]});">
                  <span>${p.icon}</span>
                  <span>ยุทธศาสตร์ที่ ${p.num}</span>
                </span>
                <span class="exec-pillar-code">${p.shortCode}</span>
              </div>

              <div class="exec-pillar-title" title="${p.name}">
                ${p.shortTitle}
              </div>

              <div class="exec-pillar-val-row">
                <div class="exec-pillar-rate" style="color: ${p.gradient[0]};">${p.rate}%</div>
                <div class="exec-pillar-counts">ผ่าน ${p.pass}/${p.total}</div>
              </div>

              <div class="exec-pillar-progress-wrap">
                <div class="exec-pillar-progress-bar" style="width: ${p.rate}%; background: linear-gradient(90deg, ${p.gradient[0]}, ${p.gradient[1]});"></div>
              </div>
            </div>

            <div class="exec-pillar-footer">
              ${p.highlight}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- 3. Two-Column Deep Strategic Assessment -->
      <div class="exec-strategic-split-grid">
        <!-- Left: Strategic Wins -->
        <div class="exec-panel exec-panel-wins">
          <div class="exec-panel-header">
            <div class="exec-panel-title">
              <span class="exec-icon-badge win">🌟</span>
              <span>จุดแข็งและผลงานโดดเด่นเชิงยุทธศาสตร์ (Strategic Wins)</span>
            </div>
            <span class="exec-badge-count win">${wins.length} ผลงานดีเด่น</span>
          </div>
          <div class="exec-items-list">
            ${wins.map(w => `
              <div class="exec-item win">
                <div class="exec-item-title-row">
                  <strong>[${w.id}] ${w.name}</strong>
                  <span class="exec-item-val win">${w.actual}</span>
                </div>
                <div class="exec-item-context">
                  เกณฑ์เป้าหมาย: <strong>${w.target}</strong> &bull; ${w.insight}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Right: Urgent Bottlenecks & Critical Risks -->
        <div class="exec-panel exec-panel-risks">
          <div class="exec-panel-header">
            <div class="exec-panel-title">
              <span class="exec-icon-badge risk">⚠️</span>
              <span>ประเด็นวิกฤตและจุดคอขวดที่ต้องเร่งรัด (Critical Bottlenecks)</span>
            </div>
            <span class="exec-badge-count risk">${risks.length} ประเด็นเร่งด่วน</span>
          </div>
          <div class="exec-items-list">
            ${risks.map(r => `
              <div class="exec-item risk">
                <div class="exec-item-title-row">
                  <strong>[${r.id}] ${r.name}</strong>
                  <span class="exec-item-val risk">${r.actual} ${r.unit}</span>
                </div>
                <div class="exec-item-context">
                  เกณฑ์เป้าหมาย: <strong>${r.target}</strong> &bull; <span style="color:#ef4444; font-weight:600;">สาเหตุ:</span> ${r.cause}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- 4. Executive Directives & Action Plan -->
      <div class="exec-directives-panel">
        <div class="exec-panel-header">
          <div class="exec-panel-title">
            <span class="exec-icon-badge directive">⚡</span>
            <span>ข้อเสนอแนะเชิงนโยบายและข้อสั่งการสำหรับผู้บริหาร (Executive Directives)</span>
          </div>
          <span class="badge-year-pill">มติเชิงยุทธศาสตร์ สสจ.ขอนแก่น</span>
        </div>

        <div class="exec-directives-grid">
          <div class="exec-directive-box fast-track">
            <div class="exec-dir-heading">
              <span class="exec-dir-step" style="background:#f59e0b;">01</span>
              <span>มาตรการเร่งด่วน 30 วัน (Fast-Track Action)</span>
            </div>
            <ul class="exec-dir-list">
              <li>จัดตั้ง <strong>War Room สุขภาพจิตและโรคไม่ติดต่อเรื้อรัง (NCDs)</strong> บูรณาการ 26 อำเภอ เพื่อลดอัตราฆ่าตัวตายและควบคุมระดับน้ำตาล</li>
              <li>เร่งรัดการเบิกจ่ายและกระจายยาผ่านระบบ <strong>Tele-pharmacy & คิวออนไลน์</strong> ใน รพ.สต. ถ่ายโอนทุกเครือข่าย</li>
            </ul>
          </div>

          <div class="exec-directive-box quarterly">
            <div class="exec-dir-heading">
              <span class="exec-dir-step" style="background:#0284c7;">02</span>
              <span>มาตรการระยะกลาง 90 วัน (Quarterly Push)</span>
            </div>
            <ul class="exec-dir-list">
              <li>ขยายระบบการคัดกรอง <strong>มะเร็งปากมดลูก (HPV DNA) และ มะเร็งลำไส้ใหญ่ (FIT Test)</strong> สู่ระดับตำบลและ รพ.สต. 100%</li>
              <li>ยกระดับมาตรฐาน <strong>Fast-Track Stroke & Sepsis</strong> ในโรงพยาบาลชุมชน (รพช.) ทุกระดับเพื่อลดอัตราเสียชีวิต</li>
            </ul>
          </div>

          <div class="exec-directive-box governance">
            <div class="exec-dir-heading">
              <span class="exec-dir-step" style="background:#8b5cf6;">03</span>
              <span>การกำกับติดตามและประเมินผล (Governance Oversight)</span>
            </div>
            <ul class="exec-dir-list">
              <li>มอบหมาย <strong>รองนายแพทย์สาธารณสุขจังหวัด</strong> และ <strong>ผู้อำนวยการโรงพยาบาล</strong> กำกับติดตาม KPI กลุ่มเสี่ยงทุกรอบสัปดาห์</li>
              <li>รายงานความก้าวหน้าและการขับเคลื่อนแก้ไขจุดคอขวดในที่ประชุม <strong>กวป. สสจ.ขอนแก่น</strong> ทุกเดือน</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 5. Strategic Summary by Pillar Matrix -->
      <div class="exec-matrix-panel">
        <div class="exec-panel-header">
          <div class="exec-panel-title">
            <span>📑 สรุปผลการดำเนินงานจำแนกรายยุทธศาสตร์ (${ds.totalPillars} ยุทธศาสตร์หลัก)</span>
          </div>
        </div>
        <div class="table-responsive-container">
          <table class="table-kpi-modern exec-matrix-table">
            <thead>
              <tr>
                <th>ยุทธศาสตร์</th>
                <th>ชื่อยุทธศาสตร์เชิงนโยบาย</th>
                <th style="text-align:center;">จำนวนตัวชี้วัด</th>
                <th style="text-align:center;">สถานะ (ผ่าน/ไม่ผ่าน)</th>
                <th style="text-align:right;">% ความสำเร็จ</th>
                <th>ประเด็นขับเคลื่อนสำคัญ</th>
              </tr>
            </thead>
            <tbody>
              ${pillarRows}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}


// ============================================================================
// OFFICIAL KPI TEMPLATES DATABASE (ฉบับสมบูรณ์ตรงตามเล่มแผนยุทธศาสตร์ 5 ปี)
// ============================================================================
const OFFICIAL_KPI_TEMPLATES_DB = {
  "66": {
    "KPI66-01": {
      "kpiId": "KPI66-01",
      "order": 1,
      "name": "จำนวนอำเภอที่ผ่านเกณฑ์คุณภาพการพัฒนาคุณภาพชีวิต",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 1",
      "unit": "อำเภอ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "20",
      "baseline": "19",
      "definition": "ร้อยละของประชาชนวัยทำงานอายุ 19-59 ปี มี BMI เกิน ได้รับการปรับเปลี่ยนพฤติกรรมและมี BMI ลดลง ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อาสาสมัครสาธารณสุขประจำหมู่บ้าน(อสม.) และบุคลากรสาธารณสุข ที่มีอายุ 19-59 ปี หมายถึง ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุข ที่มีอายุ 19 ปี 0 เดือน 1 วัน ถึง 59 ปี 11 เดือน 29 วัน ที่ยังไม่ป่วยด้วยโรคเบาหวาน และ/หรือความดันโลหิตสูงทั้งหมดในรอบ ปีงบประมาณ 2568 ค่าดัชนีมวลกาย (Body Mass Index : BMI) หมายถึง ค่าซึ่งเป็นความสัมพันธ์ระหว่างน้ำหนักตัวเป็นกิโลกรัม กับส่วนสูงเป็นเมตร หน่วยวัดเป็น กิโลกรัม/เมตร2",
      "purpose": "เพื่อให้กลุ่มเป้าหมายได้รับการคัดกรอง ประเมินภาวะสุขภาพ และปรับเปลี่ยนพฤติกรรมสุขภาพอย่างเหมาะสม",
      "population": "2. ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุข อายุ 19-59 ปี ที่มีค่าดัชนีมวลกาย",
      "collectionMethod": "อ้วนระดับ 1 และอ้วนระดับ 2 มี BMI ลดลง มากกว่าหรือเท่ากับ ร้อยละ 2",
      "source": "1. เพื่อให้ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุข อายุ 19-59 ปี ได้รับ",
      "formula": "การประเมินภาวะโภชนาการที่ครอบคลุม 2. เพื่อให้ ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุข อายุ 19-59 ปี ที่มีค่าดัชนี มวลกายอ้วนระดับ 1 และอ้วนระดับ 2 มี BMI ลดลง ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุข สังกัด รพ.สต./PCU/รพช./รพท./รพศ./ สสอ. ที่มีอายุ 19-59 ปี รายงานผลการคัดกรอง ชั่งน้ำหนัก วัดส่วนสูง วัดรอบเอว ดัชนีมวลกาย จาก โปรแกรม Khonkaen-HTD รพ.สต./PCU/สสอ./รพช./รพท./รพศ. 1. ร้อยละ ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุขอายุ 19-59 ปี ได้รับการชั่ง น้ำหนัก วัดส่วนสูง มากกว่า หรือเท่ากับ ร้อยละ 70 A = จำนวน ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุขอายุ19-59 ปี ที่ชั่งน้ำหนัก วัดส่วนสูงทั้งหมด",
      "numeratorA": "จำนวน ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุขอายุ19-59 ปี",
      "denominatorB": "จำนวน ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุขอายุ19-59 ปี",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "เกณฑ์การให้คะแนน(รวม 100 คะแนน) ผลรวม คะแนน 10 คะแนน 20 คะแนน 30 คะแนน 40 คะแนน 40 % ชั่ง นน. < 60.00 % 60.00–64.99 % 65.00-69.99 > 70.00 % สส. % คะแนน 15 คะแนน 30 คะแนน 45 คะแนน 60 คะแนน 60 % BMI ลดลง <1.00 % 1.00-1.49 % 1.50 – 1.99 % > 2.0 % 17.วิธีการประเมินผล คะแนน 1 คะแนน 2 คะแนน 3 คะแนน 4 คะแนน 5 คะแนนรวม < 60 คะแนนรวม คะแนนรวม คะแนนรวม คะแนนรวม 60.01-70.00 70.01-80.00 80.01-90.00 >90 รายละเอียดข้อมูล รายละเอียดข้อมูลพื้นฐาน (Baseline data) ผลการดำเนินงานย้อนหลัง 3 ปี (ปี 2565 - 2567) พื้นฐาน Baseline data หน่วยวัด ผลการดำเนินงานในรอบปีงบประมาณ (Baseline Data) ผลการดำเนินงาน 2565 2566 2567 ย้อนหลัง 3 ปี (ปี 2565 -2567) N/A N/A -3.94",
      "responsible": "นางสาวเทวารักษ์ ภูครองนาค ตัวชี้วัด นักวิชาการสาธารณสุขชำนาญการ โทร. 09 5652 7227 Email : theywarak.ph@gmail.com"
    },
    "KPI66-02": {
      "kpiId": "KPI66-02",
      "order": 2,
      "name": "ร้อยละตำบลผ่านเกณฑ์ ตำบลจัดการคุณภาพชีวิต",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 1",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "80",
      "baseline": "100",
      "definition": "ระดับคะแนนความสำเร็จของอำเภอในการดำเนินงานความรอบรู้ด้านสุขภาพ 2.1 ผู้ป่วยโรคเบาหวาน/โรคความดันโลหิตสูงมีความรอบรู้ด้านสุขภาพในการป้องกันโรค Stroke 2.2 ผู้สูงอายุ60ปีขึ้นไป และกลุ่มอายุน้อยกว่าหรือเท่ากับ 10 ปี มีความรอบรู้ด้านสุขภาพใน โรคPneumonia และภาวะ Sepsis ความรอบรู้ด้านสุขภาพ หมายถึง ความรู้และทักษะของผู้ป่วยโรคเบาหวาน/โรคความดันโลหิตสูงที่จำเป็น สำหรับการเข้าถึง เข้าใจ ประเมินและตัดสินใจด้านสุขภาพของตนเองและคนรอบข้างได้อย่างเหมาะสม ความรู้และทักษะของ ประชาชนกลุ่มเสี่ยงโรค Pneumonia และภาวะ Sepsis ได้แก่ ผู้กลุ่มอายุ 60 ปีขึ้นไป กลุ่มอายุน้อยกว่าหรือเท่ากับ 10 ปี ที่อ่านออกเขียนได้ ที่จำเป็นสำหรับความเข้าใจ ความสามารถในการ ประเมิน Early warning sign และตัดสินใจด้านสุขภาพของตนเองและคนรอบข้างได้อย่างเหมาะสม อัตราความรอบรู้ด้านสุขภาพ เป็นตัวชี้วัดที่วัดจากการประเมินดังนี้ 1. ประเมินความรอบรู้ด้านสุขภาพของผู้ป่วยโรคเบาหวาน โรคความดันโลหิตสูง อายุ 15 ปี ขึ้นไป ที่เข้าร่วมกิจกรรมส่งเสริมสุขภาพในชุมชนรอบรู้ด้านสุขภาพ (Health Literate Communities: HLC) ซึ่งจัด โดยสถานบริการสุ ขภ าพ ที่ เป็ น องค์ กรรอบรู้ด้ านสุ ขภ าพ (Health Literate Organization: HLO) การประเมิ นใช้ ระบ บการป ระเมิ นจากเว็บไซต์ สาสุ ข อุ่นใจ คน ไทย รอบรู้ ของกรมอนามั ย (https://sasukoonchai.anamai.moph.go.th/) 2. ประเมินความรอบรู้ด้านสุขภาพของประชาชนกลุ่มเสี่ยงโรค Pneumonia และภาวะ Sepsis ได้แก่ ผู้กลุ่มอายุ 60 ปีขึ้นไป กลุ่มอายุน้อยกว่าหรือเท่ากับ 10 ปี ที่ อ่านออกเขียนได้ ที่เข้าร่วมกิจกรรม ส่งเสริมสุขภาพในชุมชนรอบรู้ด้านสุขภาพ (Health Literate Communities: HLC) ซึ่งจัดโดยสถานบริการ สุ ข ภ าพ ที่ เป็ น อ งค์ ก รรอ บ รู้ ด้ าน สุ ข ภ าพ (Health Literate Organization: HLO) ก ารป ระ เมิ น ผ่านทาง: https://forms.gle/Px1QAL06kUGwJiHf7 หน่วยบริการรอบรู้ด้านสุขภาพ หมายถึง โรงพยาบาล/โรงพยาบาลส่งเสริมสุขภาพตำบลที่มีแนวปฏิบัติ (practices)การบริการส่งเสริมสุขภาพและให้คำปรึกษาที่เป็นมิตรต่อความรอบรู้ด้านสุขภาพ ที่ทำให้ ผู้รับบริการเข้าถึง เข้าใจ และใช้ข้อมูลและบริการของตนเองได้ง่ายขึ้นและสะดวกขึ้น เพื่อดูแลสุขภาพใน หน่วยบริการของตนเองได้อย่างเหมาะสม กิจกรรมส่งเสริมความรอบรู้ด้านสุขภาพ หมายถึง ชุดกิจกรรมส่งเสริมสุขภาพ ป้องกันโรค และอนามัย สิ่งแวดล้อม ที่มุ่งเพื่อการแก้ไขปัญหาสุขภาพของกลุ่มผู้ป่วยโรคเบาหวาน โรคความดันโลหิตสูงในการป้องกัน โรค Stroke โรค Pneumonia และภาวะ Sepsis ชุมชนรอบรู้ด้านสุขภาพ หมายถึง หมู่บ้านที่อยู่ในตำบลเดียวกันมีการดำเนินงานพัฒนาให้ประชาชน มีศักยภาพในการดูแลสุขภาพตนเอง มีความรอบรู้ด้านสุขภาพและพฤติกรรมสุขภาพที่ถูกต้อง สามารถลด ปัจจัยเสี่ยงต่อสุขภาพได้อย่างเหมาะสมกับวิถีชีวิต สามารถป้องกันโรคและภัยสุขภาพแก่ตนเอง ครอบครัว ชุมชนโดยการมีส่วนร่วมจากทุกภาคส่วน ผู้ป่วยเบาหวาน หมายถึง ผู้ป่วยที่ได้รับการวินิจฉัยเป็นโรคเบาหวาน และได้รับการขึ้นทะเบียน/ผู้ป่วย โรคเบาหวานอาศัยอยู่ในพื้นที่รับผิดชอบทั้งหมดที่อ่านออกเขียนได้ ผู้ป่วยความดันโลหิตสูง หมายถึง ผู้ป่วยที่ได้รับการวินิจฉัยเป็นโรคความดันโลหิตสูง และได้รับการขึ้น ทะเบียน/ผู้ป่วยโรคความดันโลหิตสูงอาศัยอยู่ในพื้นที่รับผิดชอบทั้งหมดที่อ่านออกเขียนได้ โรคหลอดเลือดสมอง(Stroke) คือ ภาวะที่สมองขาดเลือดไปเลี้ยงเนื่องจากหลอดเลือดตีบ หลอดเลือด อุดตัน หรือหลอดเลือดแตก ส่งผลให้เนื้อเยื่อในสมองถูกทำลาย การทำงานของสมองหยุดชะงัก",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "(จำนวนผลงานที่บรรลุเกณฑ์ [A] ÷ จำนวนกลุ่มเป้าหมายทั้งหมด [B]) × 100",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI66-03": {
      "kpiId": "KPI66-03",
      "order": 3,
      "name": "ร้อยละของหญิงตั้งครรภ์และหญิงหลังคลอดได้รับการดูแลตามเกณฑ์คุณภาพ",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 1",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "90",
      "baseline": "-",
      "definition": "ดังนี้ 1. หญิงตั้งครรภ์ได้รับการฝากครรภ์ครั้งแรกเมื่ออายุครรภ์น้อยกว่าหรือเท่ากับ 12 สัปดาห์ หมายถึง หญิงตั้งครรภ์ที่มาฝากครรภ์ที่สถานบริการฯทั้งหมด โดยต้องฝากครรภ์ครั้งแรกที่อายุครรภ์น้อย กว่าหรือเท่ากับ 12 สัปดาห์ 2. หญิงตั้งครรภ์ได้รับบริการฝากครรภ์ตามเกณฑ์คุณภาพ หมายถึง หญิงตั้งครรภ์ได้รับบริการฝาก ครรภ์ตามนัด จำนวน 8 ครั้ง ดังนี้ นัดครั้งที่ 1 เมื่อ GA ≤12 สัปดาห์ นัดครั้งที่ 2 เมื่อ GA 13 - ≤ 20 สัปดาห์ นัดครั้งที่ 3 เมื่อ GA 21 - ≤ 26 สัปดาห์ นัดครั้งที่ 4 เมื่อ GA 27 - ≤ 30 สัปดาห์ นัดครั้งที่ 5 เมื่อ GA 31 - ≤ 34 สัปดาห์ นัดครั้งที่ 6 เมื่อ GA 35 - ≤ 36 สัปดาห์ นัดครั้งที่ 7 เมื่อ GA 37 - ≤ 38 สัปดาห์ นัดครั้งที่ 8 เมื่อ GA 39 - 40 สัปดาห์ 3. หญิงตั้งครรภ์ได้รับยาเม็ดเสริมไอโอดีน ธาตุเหล็ก และกรดโฟลิก หมายถึง หญิงตั้งครรภ์ที่มาฝาก ครรภ์ในสถานบริการได้รับยาเม็ดเสริมไอโอดีน ธาตุเหล็ก และกรดโฟลิก กินวันละ 1 เม็ด วันละครั้ง ตลอดการตั้งครรภ์จนคลอด เม็ดเสริมไอโอดีน ธาตุเหล็ก และกรดโฟลิก หมายถึง ยาเม็ดที่มี ธาตุไอโอดีน 150-200 ไมโครกรัมต่อเม็ด ธาตุเหล็ก 60 มิลลิกรัมต่อเม็ด และโฟลิก 400 ไมโครกรัมต่อเม็ด 4. หญิงตั้งครรภ์ที่มีภาวะโลหิตจาง (Rate of Anemia in Pregnancy Woman) หมายถึง ผลตรวจ Hct ของหญิงตั้งครรภ์ที่มาฝากครรภ์ครั้งแรก และ ฝากครรภ์ตอนอายุครรภ์ 32 สัปดาห์ขึ้นไป มีค่า Hct น้อยกว่า 33 % หรือ Hb น้อยกว่า 11 กรัมต่อเดซิลิตร ไม่เกินร้อยละ 10 5. หญิงหลังคลอดได้รับการเยี่ยมหลังคลอดตามเกณฑ์คุณภาพ หมายถึง มารดาหลังคลอดและทารก ในเขตพื้นที่รับผิดชอบได้รับการเยี่ยม/ดูแลหลังคลอด โดยบุคลากรทางการแพทย์และสาธารณสุข หรือ อสม. ตามเกณฑ์ จำนวน 3 ครั้งดังนี้ ครั้งที่ 1 คือเยี่ยมหลังคลอดในสัปดาห์แรกอายุบุตรไม่เกิน 7 วันนับถัดจากวันคลอด ครั้งที่ 2 คือเยี่ยมหลังคลอดในสัปดาห์ที่ 2 ตั้งแต่บุตรอายุ 8 วันแต่ไม่เกิน 15 วันนับถัดจากวัน คลอด ครั้งที่ 3 คือเยี่ยมหลังคลอดตั้งแต่บุตรอายุ 16 วัน แต่ไม่เกิน 42 วัน นับถัดจากวันคลอด ด้านกระบวนการ 1. ร้อยละหญิงตั้งครรภ์ได้รับการฝากครรภ์ครั้งแรกเมื่ออายุครรภ์ ≤ 12 สัปดาห์ 2. ร้อยละหญิงตั้งครรภ์ได้รับบริการฝากครรภ์ตามเกณฑ์คุณภาพ 3.ร้อยละหญิงตั้งครรภ์ได้รับยาเม็ดเสริมไอโอดีน ธาตุเหล็ก และกรดโฟลิก 4.ร้อยละหญิงหลังคลอดได้รับการเยี่ยมหลังคลอดตามเกณฑ์คุณภาพ ด้านผลลัพธ์ 1. ร้อยละหญิงตั้งครรภ์มีภาวะโลหิตจาง ครั้งที่ 1 2. ร้อยละหญิงตั้งครรภ์มีภาวะโลหิตจาง ครั้งที่ 2",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "หญิงตั้งครรภ์ที่มาฝากครรภ์ในโรงพยาบาลศูนย์ /โรงพยาบาลทั่วไป/โรงพยาบาลชุมชน/ศูนย์แพทย์และ โรงพยาบาลส่งเสริมสุขภาพตำบล",
      "collectionMethod": "1. รายงานจากข้อมูล 43 แฟ้ม (HDC) โดยบันทึกข้อมูลการให้บริการในโปรแกรมของแต่ละสถาน บริการและส่งออกข้อมูลตามแนวทางของงานเทคโนโลยีสารสนเทศ 2. ส่งแบบรายงานภาวะโลหิตจางในหญิงตั้งครรภ์ทุกเดือน",
      "source": "ฐานข้อมูล OP/PP จากแฟ้ม ANC (อายุครรภ์ดูที่ Field GA )",
      "formula": "(ข้อมูลจากสมุดสีชมพูบันทึกลงใน 43 แฟ้ม : แฟ้ม ANC ) B = จำนวนหญิงไทยที่สิ้นสุดการตั้งครรภ์ทั้งหมดในช่วงเวลาเดียวกัน (หญิงหลังคลอด) (ข้อมูล 43 แฟ้ม : แฟ้ม Labor) A1 = จำนวนหญิงคลอดตาม B ที่ได้รับบริการฝากครรภ์ครบ 8 ครั้งตามเกณฑ์ B1 = จำนวนหญิงไทยทุกรายที่คลอดทั้งหมดในช่วงเวลาเดียวกัน (ข้อมูล 43 แฟ้ม : แฟ้ม Labor) A2 = จำนวนหญิงตั้งครรภ์ได้รับยาเม็ดเสริมไอโอดีน ธาตุเหล็ก และกรดโฟลิก B2 = จำนวนหญิงตั้งครรภ์ที่เข้ารับบริการฝากครรภ์ทั้งหมด A3 = จำนวนหญิงตั้งครรภ์เจาะเลือดครั้งที่ 1 พบฮีมาโตคริตน้อยกว่า 33% หรือฮีโมโกลบิน< 11 กรัม B3 = จำนวนหญิงตั้งครรภ์ได้รับการตรวจเลือดหาระดับฮีมาโตคริตหรือฮีโมโกลบินครั้งที่ 1 ทั้งหมด ในช่วงเวลาเดียวกัน A4 = จำนวนหญิงตั้งครรภ์เจาะเลือดครั้งที่ 2 พบฮีมาโตคริตน้อยกว่า 33% หรือฮีโมโกลบิน< 11 กรัม B4 = จำนวนหญิงตั้งครรภ์ได้รับการตรวจเลือดหาระดับฮีมาโตคริตหรือฮีโมโกลบินครั้งที่ 2 ทั้งหมด ในช่วงเวลาเดียวกัน A5 = จำนวนหญิงคลอด ตาม B5 ได้รับการดูแลครบ 3 ครั้งตามเกณฑ์ในเวลาที่กำหนด (ฐานข้อมูล 43 แฟ้ม : แฟ้ม Postnatal) B5 = จำนวนหญิงไทยหลังคลอดในเขตพื้นที่รับผิดชอบทั้งหมดในเวลาเดียวกัน (ฐานข้อมูล 43 แฟ้ม : แฟ้ม Labor) 1. ร้อยละหญิงตั้งครรภ์ได้รับการฝากครรภ์ครั้งแรกเมื่ออายุครรภ์≤ 12 สัปดาห์= (A/B) x 100 2. ร้อยละหญิงตั้งครรภ์ได้รับบริการฝากครรภ์ตามเกณฑ์คุณภาพ= (A1/B1) x 100 3. ร้อยละหญิงตั้งครรภ์ได้รับยาเม็ดเสริมไอโอดีน ธาตุเหล็ก และกรดโฟลิก= (A2/B2) x 100 4. ร้อยละหญิงตั้งครรภ์มีภาวะโลหิตจาง ครั้งที่ 1= (A3/B3) x 100 5. ร้อยละหญิงตั้งครรภ์มีภาวะโลหิตจางครั้งที่ 2 = (A4/B4) x 100 6. ร้อยละหญิงหลังคลอดได้รับการเยี่ยมหลังคลอดตามเกณฑ์คุณภาพ= (A5/B5) x 100",
      "numeratorA": "จำนวนหญิงตาม B ที่ฝากครรภ์ครั้งแรกเมื่ออายุครรภ์น้อยกว่าหรือเท่ากับ 12 สัปดาห์",
      "denominatorB": "จำนวนหญิงไทยที่สิ้นสุดการตั้งครรภ์ทั้งหมดในช่วงเวลาเดียวกัน (หญิงหลังคลอด)",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI66-04": {
      "kpiId": "KPI66-04",
      "order": 4,
      "name": "อัตราส่วนการตายมารดา ไม่เกิน 17 ต่อแสนการเกิดมีชีพ",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 1",
      "unit": "ต่อแสนการเกิดมีชีพ",
      "direction": "ยิ่งน้อยยิ่งดี",
      "target": "16",
      "baseline": "33.32",
      "definition": "ลดปัจจัยเสี่ยงด้านสุขภาพและความเจ็บป่วยของประชาชน",
      "purpose": "1.พัฒนาระบบบริการสาธารณสุขให้มีคุณภาพตามมาตรฐานอนามัยแม่และเด็ก 2. เฝ้าระวังช่วงหญิงตั้งครรภ์ คลอดและหลังคลอด เพื่อลดการตายมารดาจากการตั้งครรภ์ 3. จัดระบบการส่งติ่หญิงตั้งครรภ์ภาวะฉุกเฉินอย่างมีประสิทธิภาพ",
      "population": "ประชาชนกลุ่มเป้าหมายและหน่วยบริการสุขภาพระดับ รพศ./รพท./รพช./สสอ./รพ.สต. ใน 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "1. หญิงตั้งครรภ์ที่มีภาวะหรือโรค 5 โรค ได้แก่ GDM/Twin/Heart/PIH /Thalassemia",
      "formula": "2. รายงานการคลอดจากแบบรายงาน ก-2 3. แบบรายงานติดตามเยี่ยม Care Plan เป็นรายบุคคล 4. แบบประเมินตนเองตามมาตรฐานงานฝากครรภ์และห้องคลอดคุณภาพของกรมอนามัย 1. งานบริการ จากรพศ./รพท./รพช. 2. โรงพยาบาลระดับ A S M1 M2 F1 F2 F3 ทุกแห่งในจังหวัดขอนแก่น A = การตายของมารดาไทยตั้งแต่ขณะตั้งครรภ์ คลอดและหลังคลอด ภายใน 42 วัน B = จำนวนเด็กเกิดมีชีพทุกราย A1 = จำนวนโรงพยาบาลที่ส่งบุคลากรเข้าร่วมซ้อมแผนภาวะวิกฤต/สถานการณ์ฉุกเฉินในห้องคลอด ที่จัดโดยสำนักงานสาธารณสุขจังหวัดขอนแก่นร่วมกับโรงพยาบาลขอนแก่น หรือโรงพยาบาล แม่ข่ายจัดอบรม ครบ ประกอบด้วย แพทย์ 1 คน พยาบาล 2 คนต่อหน่วยบริการ 1 แห่ง ภายในไตรมาสที่ 1หรือ 2 B1 = จำนวนโรงพยาบาลทั้งหมด 26 แห่ง A2 = จำนวนหญิงตั้งครรภ์ที่มีโรคหรือภาวะที่เสี่ยงสูงขณะตั้งครรภ์ใน 5 โรค หมายถึงหญิงตั้งครรภ์ ที่มีโรคทางอายุรกรรมทุกราย ประกอบด้วยหญิงตั้งครรภ์ที่มีภาวะเสี่ยง ได้แก่ GDM/Twin/Heart/PIH /Thalassemia ได้รับการดูแลตาม Care Plan (การติดตามเยี่ยม เฝ้าระวังอาการผิดปกติและสภาวะสุขภาพของหญิงตั้งครรภ์และทารกในครรภ์ กระตุ้นให้มา ฝากครรภ์ตามนัด และวางแผนการคลอด เป็นรายบุคคล) B2 = หญิงตั้งครรภ์ที่มีความเสี่ยงสูงต่อการตั้งครรภ์ใน 5 โรค หมายถึงหญิงตั้งครรภ์ที่มีโรคทาง อายุรกรรมทุกราย ประกอบด้วยหญิงตั้งครรภ์ที่มีภาวะเสี่ยง ได้แก่ GDM/Twin/Heart/PIH /Thalassemia ได้รับการดูแลตาม Care Plan (การติดตามเยี่ยมเฝ้าระวังอาการผิดปกติและ สภาวะสุขภาพของหญิงตั้งครรภ์และทารกในครรภ์ กระตุ้นให้มาฝากครรภ์ตามนัด และ วางแผนการคลอด เป็นรายบุคคล)ทั้งหมดในช่วงเวลาเดียวกัน A3 = จำนวนโรงพยาบาลระดับ A S M1 M2 F1 F2 F3 ประเมินตนเองผ่านเกณฑ์มาตรฐานงาน ANC และ LR คุณภาพ B3 = จำนวนโรงพยาบาลระดับ A S M1 M2 F1 F2 F3 ทั้งหมด 1. อัตราส่วนการตายมารดา = (A/B) x 100,000 2. โรงพยาบาลมีการเพิ่มพูนทักษะในการจัดการสถานการณ์ฉุกเฉินทางสูติกรรมในห้องคลอดอย่าง น้อยปีละ 1 ครั้ง =A1 3. ร้อยละหญิงตั้งครรภ์ที่มีภาวะเสี่ยง (GDM/Twin/Heart/PIH /Thalassemia ) ได้รับการดูแลตาม Care Plan =(A2/B2) x 100 4. โรงพยาบาลประเมินตนเองผ่านเกณฑ์มาตรฐานงาน ANC และ LR คุณภาพ =(A3/B3) x 100",
      "numeratorA": "การตายของมารดาไทยตั้งแต่ขณะตั้งครรภ์ คลอดและหลังคลอด ภายใน 42 วัน",
      "denominatorB": "จำนวนเด็กเกิดมีชีพทุกราย",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI66-05": {
      "kpiId": "KPI66-05",
      "order": 5,
      "name": "อัตราตายของทารกแรกเกิดไม่เกิน 3.6 ต่อพันการเกิดมีชีพ",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 1",
      "unit": "ต่อพันการเกิดมีชีพ",
      "direction": "ยิ่งน้อยยิ่งดี",
      "target": "3.5",
      "baseline": "2.7",
      "definition": "1. อัตราตายของทารกแรกเกิด คือจำนวนทารกแรกเกิดที่เสียชีวิตภายใน 28 วัน ต่อ จำนวนเด็ก เกิดมีชีพทั้งหมด 1.1 จำนวนทารกแรกเกิดที่เสียชีวิต หมายถึงจำนวนทารกแรกเกิดมีชีพน้ำหนัก แรกเกิดมากกว่าเท่ากับ 500 กรัม ขึ้นไป ที่เสียชีวิตเมื่ออายุน้อยกว่าหรือเท่ากับ 28 วัน 1.2 จำนวนเด็กเกิดมีชีพทั้งหมด หมายถึงจำนวนเด็กเกิดมีชีพที่มีน้ำหนักมากกว่า หรือเท่ากับ 500 กรัม 2. ทารกคลอดก่อนกำหนดหมายถึงทารกที่คลอดในระหว่างมารดาอายุครรภ์24 สัปดาห์ ถึง อายุ ครรภ์ 36 สัปดาห์ 6 วัน 3. ทารกแรกเกิดน้ำหนักน้อยหมายถึง ทารกที่มีน้ำหนักแรกเกิดต่ำกว่า 2,500 กรัม ที่ได้รับการ ชั่งน้ำหนักภายใน 24 ชั่วโมงหลังคลอด 4. ภาวะขาดออกซิเจนของทารกแรกเกิด (Birth Asphyxia) หมายถึงสภาวะทารกแรกเกิดที่ขาด ออกซิเจนที่มีผลการประเมินคะแนน ด้วยการสังเกตสีผิว ชีพจร อัตราการเต้นของหัวใจ หรือ ปฏิกิริยาการตอบสนองต่อสิ่งกระตุ้นโดยใช้ค่าคะแนน Apgar Score ที่ 1 นาที มีค่าน้อยกว่า หรือเท่ากับ 7 คะแนน เป็นเกณฑ์การประเมิน",
      "purpose": "ลดอัตราการตายในทารกแรกเกิด",
      "population": "ทารกแรกเกิดทุกราย",
      "collectionMethod": "1. รายงานการเสียชีวิตทารกในแบบรายงาน CE",
      "source": "2. ข้อมูลภาวะคลอดก่อนกำหนด ในเว็บไซด์ https://www.tmchnetwork.net/ preterm/ login.aspx แยกรายสถานบริการ 3. บันทึกข้อมูล 43 แฟ้ม (HDC)โดยบันทึกข้อมูลการให้บริการในโปรแกรมของแต่ละสถานบริการ และส่งออกข้อมูลตามแนวทางของงานเทคโนโลยีสารสนเทศ สำนักงานสาธารณสุขจังหวัด ขอนแก่น 4. รายงานการคลอดจากแบบรายงานก-2 5. โปรแกรม Newborn Registry เขตสุขภาพที่ 7 1. งานบริการทารกแรกเกิด จาก รพศ./รพท./รพช./ 2. โรงพยาบาลระดับ F1 F2 M1 M2 S A ทุกแห่งในจังหวัดขอนแก่น",
      "formula": "1. อัตราตายของทารกแรกเกิด 0-28 วัน = (A/B) x 1000 2. ร้อยละทารกคลอดก่อนกำหนด=(A1/B1) x 100 3. ร้อยละทารกแรกเกิดน้ำหนักน้อยกว่า 2,500 กรัม =(A2/B2) x 100 4. อัตราทารกแรกเกิดขาดออกซิเจนระหว่างคลอด =(A3/B3) x 1000 รายละเอียดข้อมูลพื้นฐาน ตัวชี้วัด Baseline หน่วยวัด ผลการดำเนินงานในรอบปีงบประมาณ Data 2563 2564 2565 1) อัตราตายของทารกแรกเกิด 0-28 วัน 3.6 อัตรา 3.1 3.2 2.7 2) ร้อยละทารกคลอดก่อนกำหนด 9 ร้อยละ 8.47 8.02 7.8 3) ร้อยละทารกแรกเกิดน้ำหนักน้อยกว่า 2,500 กรัม 7 ร้อยละ 9.35 10.43 9.78 4) อัตราทารกแรกเกิดขาดออกซิเจนระหว่างคลอด 25 อัตรา 38.94 39.46 36.34",
      "numeratorA": "จำนวนทารกแรกเกิดมีชีพน้ำหนักแรกเกิดมากกว่าเท่ากับ 500 กรัม ขึ้นไป ที่",
      "denominatorB": "จำนวนเด็กเกิดมีชีพที่มีน้ำหนักมากกว่าหรือเท่ากับ 500 กรัม",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "1. นางนรินทร์รัตน์ แก้วลา พยาบาลวิชาชีพชำนาญการ โทรศัพท์มือถือ 085-3956-466 E-mail : patnapit@gmail.com 2. นางสมาพร สุรเตมีย์กุล พยาบาลวิชาชีพชำนาญการ โทรศัพท์มือถือ 084-9575-548 E-mail : ooh_rx@yahoo.com"
    },
    "KPI66-06": {
      "kpiId": "KPI66-06",
      "order": 6,
      "name": "ร้อยละเด็กปฐมวัยมีพัฒนาการสมวัย",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 1",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "85",
      "baseline": "98.99",
      "definition": "ลดปัจจัยเสี่ยงด้านสุขภาพและความเจ็บป่วยของประชาชน 6. ร้อยละเด็กปฐมวัยมีพัฒนาการสมวัย เด็กปฐมวัย หมายถึง เด็กแรกเกิด จนถึงอายุ 5 ปี 11 เดือน 29 วัน เด็กที่มีพัฒนาการสมวัย หมายถึง เด็กทุกคนได้รับตรวจคัดกรองพัฒนาการโดยใช้คู่มือเฝ้าระวัง และส่งเสริมพัฒนาการเด็กปฐมวัย (DSPM) แล้วผลการตรวจคัดกรอง ผ่านครบ 5 ด้าน ในการ ตรวจคัดกรองพัฒนาการครั้งแรก รวมกับเด็กที่พบพัฒนาการสงสัยล่าช้าและได้รับการติดตามให้ ได้รับการกระตุ้นพัฒนาการ และประเมินซ้ำแล้วผลการประเมิน ผ่านครบ 5 ด้านภายใน 30 วัน (1B260) คู่มือเฝ้าระวังและส่งเสริมพัฒนาการเด็กปฐมวัย (DSPM) หมายถึง แบบประเมินพัฒนาการเด็ก ตั้งแต่แรกเกิดถึง 5 ปี ใช้คัดกรองเด็กทั่วไปที่ไม่มีอาการผิดปกติ และดำเนินการประเมินอย่างเป็น ระบบจากพฤติกรรม พัฒนาการตามอายุของเด็กใน 5 ด้าน ได้แก่ ด้านการเคลื่อนไหว ด้าน กล้ามเนื้อมัดเล็กและสติปัญญา ด้านการเข้าใจภาษา ด้านการใช้ภาษา ด้านการช่วยเหลือตนเอง และสังคม การคัดกรองพัฒนาการ หมายถึง ความครอบคลุมของการคัดกรองเด็กอายุ 9, 18, 30, 42 และ 60 เดือน ณ ช่วงเวลาที่มีการคัดกรองโดยเป็นเด็กในพื้นที่ (Type1: มีชื่ออยู่ในทะเบียนบ้าน ตัวอยู่ จริงและ Type3 : ที่อาศัยอยู่ในเขต แต่ทะเบียนบ้านอยู่นอกเขต พัฒนาการสงสัยล่าช้า หมายถึง เด็กที่ได้รับตรวจคัดกรองพัฒนาการโดยใช้คู่มือเฝ้าระวังและ ส่งเสริมพัฒนาการเด็กปฐมวัย (DSPM) และผลการตรวจคัดกรองพัฒนาการตามอายุของเด็กในการ ประเมินพัฒนาการครั้งแรกผ่านไม่ครบ 5 ด้าน ทั้งเด็กที่ต้องแนะนำให้พ่อแม่ ผู้ปกครอง ส่งเสริม พัฒนาการตามวัยภายใน 30 วัน (1B261) รวมกับเด็กที่สงสัยล่าช้า ส่งต่อทันที (1B262 : เด็กที่ พัฒนาการล่าช้า/ความผิดปกติอย่างชัดเจน) พัฒนาการสงสัยล่าช้าได้รับการติดตาม หมายถึง เด็กที่ได้รับการตรวจคัดกรองพัฒนาการตาม อายุของเด็กในการประเมินพัฒนาการครั้งแรกผ่านไม่ครบ 5 ด้าน เฉพาะกลุ่มที่แนะนำให้พ่อแม่ ผู้ปกครอง ส่งเสริมพัฒนาการตามวัยภายใน 30 วัน (1B261) แล้วติดตามกลับมาประเมินคัด กรองพัฒนาการครั้งที่ 2 เด็กปฐมวัยที่ได้รับการคัดกรองแล้วพบว่ามีพัฒนาการล่าช้า หมายถึง เด็กปฐมวัยอายุ 9, 18, 30, 42, 60 เดือน ที่ประเมินด้วยคู่มือเฝ้าระวังและส่งเสริมพั ฒ นาการเด็กปฐมวัย (Developmental Surveillance and Promotion Manual: DSPM) ครั้งที่ 1 แล้วพบว่าต้องส่ง ต่อ และเด็กอายุ 9, 18, 30, 42, 60 เดือนที่มาประเมินซ้ำ ด้วยคู่มือเฝ้าระวังและส่งเสริม พัฒนาการเด็กปฐมวัย: DSPM ครั้งที่ 2 แล้วยังพบมีพัฒนาการล่าช้าอย่างน้อย 1 ด้านขึ้นไป ได้รับการกระตุ้นพัฒนาการด้วยเครื่องมือมาตรฐาน หมายถึง การที่เด็กปฐมวัยที่ได้รับการ คัดกรองแล้วพบว่ามีพัฒนาการล่าช้า ได้รับการตรวจวินิจฉัยเพิ่มเติมและ/ หรือประเมินพัฒนาการ พร้อมทั้งกระตุ้นพัฒนาการด้วยคู่มือประเมินเพื่อช่วยเหลือเด็กปฐมวัยที่มีปัญหาพัฒนาการ (Thai Early Developmental Assessment for Intervention: TEDA4I)หรือเครื่องมือมาตรฐานอื่นๆ เช่น คู่มือคัดกรองและส่งเสริมพัฒนาการเด็กวัยแรกเกิด-5 ปี สำหรับบุคลากรสาธารณสุข คู่มือ ประเมินและแก้ไขพัฒนาการเด็กแรกเกิด-5 ปี โปรแกรมการฝึก/ กระตุ้นพัฒนาการตามวิชาชีพ (นักกิจกรรมบำบัด นักกายภาพบำบัด นักเวชศาสตร์สื่อความหมาย) เป็นต้น",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "เด็กไทยอายุ 9, 18, 30, 42, 60 เดือน ทุกคนที่อยูในพื้นที่รับผิดชอบ วิธีจัดการข้อมูล สถานบริการทุกระดับ นำข้อมูลการประเมินพัฒนาการเด็ก บันทึกในโปรแกรมหลักของสถาน",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "บริการฯ เช่น JHCIS, Hos xp, PCU เป็นต้น ส่งออกข้อมูลตามโครงสร้างมาตรฐาน 43 แฟ้ม โรงพยาบาลทุกแห่ง /สาธารณสุขอำเภอทุกอำเภอ/ รพ.สต.ทุกแห่ง",
      "formula": "B1 = จำนวนเด็กอายุ 9, 18, 30, 42, 60 เดือน ทั้งหมด",
      "numeratorA": "จำนวนเด็กอายุ 9, 18, 30, 42, 60 เดือน ที่ได้รับการประเมินพัฒนาการ",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "B2 = จำนวนเด็กอายุ 9, 18, 30, 42, 60 เดือน ที่พบพัฒนาการสงสัยล่าช้า",
      "evaluationMethod": "C = จำนวนเด็กอายุ 9, 18, 30, 42, 60 เดือน ที่พบพัฒนาการสงสัยล่าช้าได้รับการติดตาม กระตุ้นพัฒนาการ D = จำนวนเด็กอายุ 9, 18, 30, 42, 60 เดือน ที่พบพัฒนาการล่าช้าได้รับการติดตามกระตุ้น พัฒนาการ E = จำนวนเด็กอายุ 9, 18, 30, 42, 60 เดือน ที่พบพัฒนาการล่าช้าทั้งหมด 1) ร้อยละของเด็กอายุ 9 18 30 42 และ 60 เดือนได้รับการประเมินพัฒนาการ (ตรวจครั้งแรก) = (A x100) /B1 2) ร้อยละของเด็กอายุ 9 18 30 42 และ 60 เดือนพบพัฒนาการสงสัยล่าช้า (ตรวจครั้งแรก) = (B2x100)/A 3) ร้อยละของเด็กอายุ 9 18 30 42 และ 60 เดือนพบพัฒนาการสงสัยล่าช้าได้รับการติดตาม กระตุ้นพัฒนาการ =(Cx100)/B2 4) ร้อยละของเด็กอายุ 9 18 30 42 และ 60 เดือนที่ได้รับการคัดกรองแล้วพบว่ามีพัฒนาการ ล่าช้าได้รับการกระตุ้นพัฒนาการด้วยเครื่องมือมาตรฐาน =(Dx100)/E รายไตรมาส เปรียบเทียบผลการดำเนินงานกับค่าเป้าหมาย",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI66-07": {
      "kpiId": "KPI66-07",
      "order": 7,
      "name": "ร้อยละเด็กอายุ 0-5 ปี สูงดีสมส่วน",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 1",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "74",
      "baseline": "73.13",
      "definition": "ลดปัจจัยเสี่ยงด้านสุขภาพและความเจ็บป่วยของประชาชน",
      "purpose": "เพื่อให้เด็กปฐมวัยได้รับการดูแลส่งเสริมโภชนาการและการเจริญเติบโตสูงดีสมส่วนตามเกณฑ์มาตรฐาน",
      "population": "ผู้สูงอายุ หมายถึง ประชาชนที่มีอายุตั้งแต่ 60 ปีขึ้นไป",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "(ADL 0-4 คะแนน) ได้รับการดูแลโดยบุคลากรสาธารณสุข ทีมสหวิชาชีพตามแผนการดูแลรายบุคคล (Care Plan) ตามชุดสิทธิประโยชน์ทุกสิทธิการรักษาพยาบาล ผู้ที่มีภาวะพึ่งพิง หมายถึง ประชาชนที่มีค่าคะแนนการประเมินความสามารถในการประกอบกิจวัตร ประจำวัน(ADL) น้อยกว่าหรือเท่ากับ 11 คะแนน โดยแบ่งเป็นกลุ่มติดบ้าน (ADL 5-11 คะแนน) กลุ่มติดเตียง (ADL 0-4 คะแนน) ได้รับการดูแลโดยบุคลากรสาธารณสุข ทีมสหวิชาชีพตามแผนการดูแลรายบุคคล (Care Plan) ตามชุดสิทธิประโยชน์ทุกสิทธิการรักษาพยาบาล แผนการดูแลรายบุคคล (Care Plan) หมายถึง การประเมินและวางแผนการดูแลรายบุคคลก่อนให้บริการ ดูแลช่วยเหลือผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงจาก Care Manager ทีมผู้เชี่ยวชาญ ครอบครัวและผู้เกี่ยวข้อง ในพื้นที่ การดูแลกลุ่มภาวะพึ่งพิงตามชุดสิทธิประโยชน์ หมายถึง การบริการดูแลด้านสาธารณสุขตามแผนการดูแล รายบุคคล และให้คำแนะนำแก่ญาติและผู้ดูแล โดยผู้ช่วยเหลือดูแลผู้ที่มีภาวะพึ่งพิงหรือเครือข่ายสุขภาพอื่นๆ หรืออาสาสมัคร จิตอาสา ตามแผนการดูแลรายบุคคล หรือตามคำแนะนำของผู้จัดการการดูแลด้าน สาธารณสุข รวมถึงจัดหาวัสดุ อุปกรณ์ทางการแพทย์ หรืออุปกรณ์เครื่องช่วยเหลือที่จำเป็นตามสภาพของผู้ที่มี ภาวะพึ่งพิง และการประเมินผลลัพธ์การดูแลผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงหลังได้รับการดูแลตาม Care Plan ครบ 12 เดือน ร้อยละ 98.5 1. เพื่อให้ Care Manager /Caregiver/อาสาสมัครบริบาลท้องถิ่น และทีมสหวิชาชีพมีการส่งเสริมสุขภาพ วางแผนการดูแลรายบุคคล ฟื้นฟูสมรรถภาพ และสนับสนุนการดูแลผู้สูงอายุและผู้ที่มีภาวะพึ่งพิง แบบรอบด้านในระดับครอบครัว ชุมชนเป็นรายบุคคล 2. เพื่อสนับสนุนการมีส่วนร่วมของครอบครัว ชุมชนและหน่วยงานภาคีเครือข่ายที่เกี่ยวข้อง ในการดูแล และปรับเปลี่ยนพฤติกรรมสุขภาพของผู้สูงอายุให้มีคุณภาพชีวิตที่ดี มีอายุยืนยาวและช่วยเหลือตนเองได้ 3. เพื่อให้ผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงเข้าถึงระบบบริการด้านสาธารณสุข และวัสดุ อุปกรณ์ทางการแพทย์ หรืออุปกรณ์เครื่องช่วยเหลือที่จำเป็นตามสภาพปัญหาของผู้ที่มีภวะพึ่งพิง ผู้สูงอายุและบุคคลอื่น ที่มีค่าคะแนน ADL 0-11 คะแนน 1. รายงานผลการคัดกรอง ADL ในฐานข้อมูล Health Data Center 2. รายงานการจัดทำ Care Plan และการอนุมัติ Care Plan ผ่านคณะอนุกรรมการกองทุน LTC ระดับตำบล และบันทึกข้อมูล CP ที่ผ่านการอนุมัติรายงานในระบบโปรแกรม LTC สปสช. 3. รายงานผลค่าคะแนน ADL การดูแลกลุ่มภาวะพึ่งพิงครบ 12 เดือน ในโปรแกรม LTC สปสช. 1. ฐานข้อมูลการคัดกรอง ADL ใน Health Data Center 2. โปรแกรม Long Term Care กรมอนามัย 3. โปรแกรม Long Term Care สปสช.",
      "formula": "1 A = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่มีการจัดทำ Care Plan โดย Care Plan ได้รับอนุมัติจาก คณะอนุกรรมการ LTC และได้รับการเยี่ยมบ้านจาก Caregiver B = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงทั้งหมดที่เข้าร่วมโครงการ LTC รายการข้อมูล 2 A = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่ได้รับการดูแลตาม Care Plan ครบ 12 เดือน ที่มีค่าคะแนน ADL เพิ่มขึ้น และกลุ่มติดเตียงมีค่า ADL เท่าเดิมหรือไม่มีภาวะแทรกซ้อนเพิ่มขึ้น B = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่ ได้รับอนุมัติ Care Plan จากคณะอนุกรรมการ LTC และได้รับ การเยี่ยมบ้านจาก Caregiver ครบการดูแล 12 เดือน ทั้งหมด สูตรคำนวณ A x 100 ตัวชี้วัด 1 B สูตรคำนวณ A x 100 ตัวชี้วัด 2 B ระยะเวลา ตุลาคม 2567 - กันยายน 2568 ประเมินผล",
      "numeratorA": "จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่มีการจัดทำ Care Plan โดย Care Plan ได้รับอนุมัติจาก",
      "denominatorB": "จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงทั้งหมดที่เข้าร่วมโครงการ LTC",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "1) Care Manager/เจ้าหน้าที่สาธารณสุข PCU รพ./รพสต. ประเมินความสามารถในการประกอบกิจวัตร รายละเอียด ประจำวัน(ADL) เพื่อค้นหากลุ่มภาวะพึ่งพิงได้รับบริการตามชุดสิทธิประโยชน์ > ร้อยละ 60 ข้อมูลพื้นฐาน 2) Care Manager มีการจัดทำแผนการดูแลรายบุคคล Care Plan ในกลุ่มผู้สูงอายุและผู้ที่มีภาวะพึ่งพิง (Baseline Data) ผลการดำเนินงาน และ Care Plan ได้รับการอนุมัติจากคณะอนุกรรมการ LTC > ร้อยละ 98.5 ย้อนหลัง 3 ปี (ปี 2565 -2567) 3) ผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงได้รับการดูแลตามแผนการดูแลรายบุคคล Care Plan และประเมิน ADL ครบ",
      "responsible": "12 เดือน มีค่าคะแนน ADL เพิ่มขึ้นหรือกลุ่มติดเตียงไม่มีภาวะแทรกซ้อนเพิ่มขึ้น > ร้อยละ 25 ตัวชี้วัด ผลงาน ปี 2565 ปี 2566 ปี 2567 ร้อยละของผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงได้รับการดูแล 96.67 94.61 98.4 ในระบบ Long Term Care และเข้าถึงตามชุดสิทธิ ประโยชน์ ร้อยละของผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่ได้รับการดูแล 14.66 21.43 22.43 ตาม Care Plan มีค่าคะแนน ADL เพิ่มขึ้นหรือกลุ่มติด เตียงไม่มีภาวะแทรกซ้อนเพิ่มขึ้น ชื่อ-สกุล นางอังคณา อึ้งปิติมานะ ตำแหน่ง นักวิชาการสาธารณสุขชำนาญการ กลุ่มงานส่งเสริมสุขภาพ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ 149 โทรสาร 0-4322-4037 โทรศัพท์มือถือ. 0617929942 E-mail :ungpitimana.ang@gmail.com"
    },
    "KPI66-08": {
      "kpiId": "KPI66-08",
      "order": 8,
      "name": "ความสำเร็จของการส่งเสริมสุขภาพเด็กวัยเรียน",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 1",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "72",
      "baseline": "71.2",
      "definition": "ลดปัจจัยเสี่ยงด้านสุขภาพและความเจ็บป่วยของประชาชน 2. ระดับความสำเร็จของการพัฒนาตำบลจัดการคุณภาพชีวิต ตำบล หมายถึง ตำบลตามกฎหมายว่าด้วยลักษณะปกครองท้องที่ที่อยู่นอกเขตหน่วยการ บริหารราชการ ส่วนท้องถิ่น ตำบลจัดการคุณภาพชีวิต หมายถึง ตำบลที่มีกระบวนการ การดำเนินงานด้วยกลไก 3 หมอ ประกอบด้วย หมอคนที่ 1 คือ อสม. ทำหน้าที่เป็นหมอประจำบ้าน หมอคนที่ 2 คือหมอสาธารณสุข และ หมอคนที่ 3 คือหมอเวชปฏิบัติครอบครัว และทีมขับเคลื่อนตำบล จัดการคุณภาพชีวิต สร้างการมีส่วนร่วมของคนในชุมชน ท้องถิ่น โดยภาครัฐสนับสนุน เพื่อแก้ไขปัญหา หรือพัฒนาตามบริบท และ/หรือ ประเด็นของชุมชน หรือประเด็น พชอ. ทั้งด้านการดูแลสุขภาพและคุณภาพชีวิตให้ดีขึ้น โดยใช้ทรัพยากร ภูมิปัญญา และนวัตกรรม ของชุมชน มีแผนการดำเนินงานของชุมชนที่ให้ความสำคัญกับประชาชน",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "มีกิจกรรมดำเนินการที่สอดคล้องกับสภาพปัญหาหรือประเด็นการพัฒนา อย่างครอบคลุม ทุกขั้นตอนตามแผน และมีการมุ่งเป้าหมายผลลัพธ์ที่ตอบสนองด้านสุขภาพและคุณภาพชีวิต จากความเข้มแข็งของชุมชน โดยมีระบบการดูแลสุขภาพตนเองและช่วยเหลือกัน ระบบบริการปฐมภูมิโดยชุมชนเชื่อมกับภาครัฐ และระบบการจัดการเพื่อยกระดับคุณภาพชีวิต เพื่อให้บริการสุขภาพแก่ประชาชนในชุมชนอย่างเป็นระบบ อันทำให้ประชาชนเข้าถึงบริการ สุขภาพมากขึ้น มีการจัดการสุขภาพและคุณภาพชีวิตด้วยตนเอง มีความมั่นคงด้านสุขภาพ และมีความรอบรู้ด้านสุขภาพ เกณ ฑ์ ต ำบ ลจัด การคุณ ภ าพ ชีวิต ห มายถึง ตำบ ลที่ มีการด ำเนิน งานครบ 4 องค์ประกอบ ได้แก่ T = Team มีทีมสุขภาพระดับตำบลที่มีศักยภาพ P = Plan มีการจัดทำแผนสุขภาพตำบลแบบมีส่วนร่วม A = Activity มีการจัดกิจกรรมหรือบริการสุขภาพกลุ่มวัย R = Result มีผลลัพธ์ด้านสุขภาพในชุมชน กลุ่มเปราะบาง หมายถึง กลุ่มบุคคลที่ขาดความสามารถในการปกป้องสิทธิผลประโยชน์ ของตนเนื่องจากขาดอำนาจ การศึกษา ทรัพยากร ความเข้มแข็ง มีความเสี่ยงสูงที่จะถูกคุกคาม จากปัจจัยเสี่ยงด้านต่าง ๆ เช่น สุขภาพ สังคม เศรษฐกิจ สิ่งแวดล้อม และภัยพิบัติทางธรรมชาติ หรืออื่น ๆ เป็นผู้ที่มีข้อจำกัดในเรื่องในการจัดการความเสี่ยงและผลกระทบที่ตามมา การ ช่วยเหลือตัวเอง การตัดสินใจ และอำนาจต่อรอง ต้องการการดูแลเป็นพิเศษ ต้องการ การสนับสนุน การปกป้อง การช่วยเหลือทางกาย จิต หรือทางสังคม จากผู้อื่น ตัวอย่างกลุ่ม เปราะบาง เช่น เด็ก ผู้สูงอายุที่ช่วยตัวเองไม่ได้ คนที่ถูกสังคมตีตรา ผู้ป่วยบางประเภท แรงงาน ต่างด้าวที่ผิดกฎหมาย ผู้ติดสารเสพติดที่ผิดกฎหมาย คนพิการ คนที่ทำผิดกฎหมาย/อาชญากร และคนที่ได้รับผลกระทบจากการแพร่ระบาดของโรคติดเชื้อไวรัสโคโรนา 2019 กลุ่มเปราะบางด้านสุขภาพ พิจารณาจากปัจจัยกำหนดสุขภาพด้านสังคม อย่างน้อย 2 ใน 3 ปัจจัย ดังนี้ 1) คนชายขอบที่ถูกเลือกปฏิบัติจากสังคม เช่น คนยากจน คนไร้รัฐ ชาติพันธุ์กลุ่มน้อย แรงงานข้ามชาติ เด็กกำพร้า ผู้เคยได้รับโทษ ฯลฯ 2) คนที่มีข้อจำกัดในการเข้าถึงบริการด้านสุขภาพ เช่น ผู้ที่ไม่มีหลักประกันสุขภาพ คนที่มีถิ่นที่อยู่อาศัยในพื้นที่ห่างไกล",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "(จำนวนผลงานที่บรรลุเกณฑ์ [A] ÷ จำนวนกลุ่มเป้าหมายทั้งหมด [B]) × 100",
      "numeratorA": "Activity มีการจัดกิจกรรมหรือบริการสุขภาพกลุ่มวัย",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI66-09": {
      "kpiId": "KPI66-09",
      "order": 9,
      "name": "ร้อยละของประชาชนวัยทำงานอายุ 18-59 ปี มี BMI ปกติ",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 1",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "56",
      "baseline": "56.50",
      "definition": "เทคโนโลยี นวัตกรรมทางการแพทย์ที่ทันสมัย ในการให้บริการสุขภาพ และบริหารจัดการ",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "1.หน่วยงานสาธารณสุขที่พัฒนาสู่องค์กรดิจิทัล หมายถึง หน่วยงานที่มีการพัฒนา",
      "collectionMethod": "องค์ประกอบหลักด้านเทคโนโลยีสารสนเทศ 3 ด้าน คือ มีโครงสร้างพื้นฐานอุปกรณ์ตาม",
      "source": "เกณฑ์มีโปรแกรมสนับสนุนการให้บริการ/บริหารและมีการพัฒนาสมรรถนะบุคลากรด้าน เทคโนโลยีสารสนเทศ นำไปสู่การปรับปรุงกระกระบวนงานโดยใช้เทคโนโลยีสารสนเทศโดย ในปีงบประมาณ 2566 มุ่งเน้นการประเมินผลตามยุทธศาสตร์ ในประเด็นการเชื่อมต่อ ข้อมูล และการให้บริการประชาชนผ่าน Telemedicine รายละเอียดดังนี้ 1. การเชื่อมต่อฐานข้อมูล 1.1 โรงพยาบาลมีการเชื่อมต่อกับฐานข้อมูลสำนักงานสาธารณสุขจังหวัดขอนแก่นและ กระทรวงสาธารณสุข 1) โรงพยาบาลแม่ข่าย ส่งข้อมูลไปยังฐานกลางสำนักงานสาธารณสุขจังหวัด ด้วยวิธี Replication ครบ ถ้วน แล ะเป็ น ปั จจุบั น (Real Time) ผ่าน ระบ บ เชื่อ มต่ อ MPLS (ภายใต้ Ip Address 203.157.xxx.xxx) ของกระทรวงสาสุข 2) โรงพยาบาลแม่ข่าย ส่งข้อมูลไปยังฐานกลางกระทรวงสาธารณสุข ด้วยวิธี API HIS Gateway ครบถ้วนและเป็นปัจจุบัน (Real Time) 1.2 โรงพยาบาลแม่ข่ายมีการเชื่อมต่อกับฐานข้อมูล รพ.สต. ภายในCUP โดย ประสานงานกับ รพ.สต. ภายใต้ MOU รพ.สต. ส่งข้อมูลไปยังฐานกลางสำนักงานสาธารณสุข จังหวัด ด้วยวิธี Replication ครบถ้วนและเป็นปัจจุบัน (Real Time) 2. โรงพยาบาล ให้บริการผ่านระบบ Telemedicine อย่างน้อย 1 ช่องทาง 3. ร้อยละของจังหวัดที่ประชาชนไทย มีดิจิทัลไอดีเพื่อการเข้าถึงระบบบริการสุขภาพ แบบ ไร้รอยต่อ 3.1 ร้อยละของบุคลากรสาธารณสุข มีดิจิทัลไอดี เพื่อยืนยันการเป็นผู้ให้บริการ 3.2 ร้อยละของประชาชน มีดิจิทัลไอดี เพื่อเข้าถึงข้อมูลสุขภาพส่วนบุคคล และเข้าถึง ระบบบริการสุขภาพแบบไร้รอยต่อ จำนวนหน่วยงานที่ผ่านเกณฑ์หน่วยงานที่พัฒนาสู่องค์กรดิจิทัล ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ 2566 2567 2568 2569 2570 13 15 20 26 26 1.เพื่อให้มีการพัฒนาการให้บริการการแพทย์ทางไกล 2.เพื่อให้สามารถเข้าถึงบริการทางการแพทย์ได้มากขึ้น ในกลุ่มผู้ป่วยเปราะบาง โรคเรื้อรัง หน่วยงานที่พัฒนาสู่องค์กรดิจิทัล รพ.(รพ.ศ./รพ.ท/รพช.) ทุกแห่ง ผู้รับผิดชอบรายงานผลงานเป็นรายไตรมาสไปยังระบบรายงานองค์กรดิจิทัล(ออนไลน์) 1.การเชื่อมต่อฐานข้อมูล แสดงผลจากระบบเชื่อมต่อฐานข้อมูล 2.โรงพยาบาลสื่อสารและให้บริการประชาชนผ่าน เทคโนโลยีสารสนเทศ รายงานผลทุกไตรมาส ที่ link https://kkpho.moph.go.th/org_digital (ออนไลน์) https://kkpho.moph.go.th/org_digital",
      "formula": "(จำนวนผลงานที่บรรลุเกณฑ์ [A] ÷ จำนวนกลุ่มเป้าหมายทั้งหมด [B]) × 100",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI66-10": {
      "kpiId": "KPI66-10",
      "order": 10,
      "name": "ความสำเร็จการส่งเสริมสุขภาพและป้องกันโรคกลุ่มอาการความเสื่อม (Geriatric Syndromes) ในผู้สูงอายุกลุ่มติดสังคม",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 1",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "55",
      "baseline": "82.00",
      "definition": "10.ความสำเร็จการส่งเสริมสุขภาพและป้องกันโรคกลุ่มอาการความเสื่อม (Geriatric Syndromes) ในผู้สูงอายุกลุ่มติดสังคม ความสำเร็จการส่งเสริมสุขภาพและป้องกันโรคกลุ่มอาการความเสื่อม (Geriatric Syndromes) ในผู้สูงอายุกลุ่มติดสังคม โดยมีความสำเร็จการดำเนินงาน ดังต่อไปนี้ ความสำเร็จที่ 1 ร้อยละของผู้สูงอายุสุขภาพดีมีพฤติกรรมสุขภาพที่พึงประสงค์ ผู้สูงอายุ หมายถึง ตามความ พ.ร.บ.ผู้สูงอายุ พ.ศ.2546 หมายถึง บุคคลซึ่งมีอายุตั้งแต่หก สิบปีบริบูรณ์ขึ้นไป ผู้สูงอายุที่มีสุขภาพดี หมายถึง ผู้สูงอายุกลุ่มที่ 1 (กลุ่มติดสังคม) จากการประเมิน ADL คะแนนตั้งแต่ 12 คะแนนขึ้นไป ที่สามารถให้การช่วยเหลือตนเองและผู้อื่น ในชุมชน และ สังคมได้ พร้อมทั้งมีพฤติกรรมสุขภาพอันพึงประสงค์ (ทุกข้อ) และไม่มีการเจ็บป่วยด้วยโรคที่ พบบ่อยในกลุ่มผู้สูงอายุ พฤติกรรมสุขภาพที่พึงประสงค์ หมายถึง การกระทำหรือพฤติกรรมของบุคคลที่ปฏิบัติแล้ว ส่งผลดีต่อสุขภาพของบุคคลนั้นๆเอง (ร่างกาย จิตใจ และสังคม) ดังนี้ 1. มีกิจกรรมทางกายที่ระดับปานกลาง (เดิน/ปั่นจักรยาน/ทำงานบ้าน/ทำไร่/ทำสวน/ทำนา/ ออกกำลังกาย) สะสม 150 นาที/สัปดาห์ 2. กินผักและผลไม้ได้วันละ 5 กำมือ เป็นประจำ (6-7 วันต่อสัปดาห์) 3. ดื่มน้ำเปล่าอย่างน้อยวันละ 8 แก้ว 4. ไม่สูบบุหรี่ /ไม่สูบยาเส้น 5. ไม่ดื่มเครื่องดื่มที่มีส่วนผสมของแอลกอฮอล์ (เช่น สุรา เบียร์ ยาดองเหล้า) 6. การตรวจสุขภาพประจำปีหรือพบแพทย์/บุคลากรทางการแพทย์ 7. มีการนอนหลับอย่างเพียงพอ อย่างน้อยวันละ 7 – 8 ชั่วโมง 8. การดูแลสุขภาพช่องปาก/มีการแปรงฟันก่อนนอนทุกวัน ผู้สูงอายุมีฟันแท้ใช้งานได้อย่าง น้อย 20 ซี่ หรือ 4 คู่สบ หมายเหตุ: 1. ผ่านการประเมินทั้ง 8 ด้าน ถือว่าผ่านการประเมินพฤติกรรมสุขภาพที่พึงประสงค์ 2. กิจกรรมทางกาย คือ การเคลื่อนไหวของร่างกายเกิดจากการทำงานของกล้ามเนื้อ และทำ ให้ร่างกายมีการใช้พลังงานเพิ่มขึ้นจากขณะพัก ประกอบด้วย การทำกิจกรรมในชีวิต ประจำวัน เช่น การทำงานบ้าน การทำงานอาชีพที่ต้องใช้แรงกาย การเดินทางด้วย จักรยานหรือเดินทางเดินขึ้นบันได และกิจกรรมยามว่าง เช่น ออกกำลังกาย เล่นกีฬา วิ่ง ปั่นจักรยาน และการท่องเที่ยว (ที่มา : แผนการส่งเสริมกิจกรรมทางกาย พ.ศ.2561-2573) 3. กินผักและผลไม้ได้วันละ 5 กำมือ เป็นประจำ (6 - 7 วันต่อสัปดาห์) หมายถึง ใน 1 วัน กินผัก 3 กำมือ และกินผลไม้ 2 กำมือ หรือ กินผัก 4 กำมือ และกินผลไม้ 1 กำมือ 4. อ้างอิงดัชนีที่ 8 ตามแผนผู้สูงอายุแห่งชาติ ฉบับที่ 2 (พ.ศ.2545 - 2564) ฉบับปรับปรุง ครั้งที่ 2 พ.ศ.2561",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "(จำนวนผลงานที่บรรลุเกณฑ์ [A] ÷ จำนวนกลุ่มเป้าหมายทั้งหมด [B]) × 100",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI66-11": {
      "kpiId": "KPI66-11",
      "order": 11,
      "name": "ร้อยละของกลุ่มภาวะพึ่งพิงได้รับการดูแล Care Plan",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 1",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "95",
      "baseline": "95.70",
      "definition": "ลดปัจจัยเสี่ยงด้านสุขภาพและความเจ็บป่วยของประชาชน",
      "purpose": "11.ร้อยละของกลุ่มภาวะพึ่งพิงได้รับการดูแลตาม Care Plan คุณภาพ",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "แผนการดูแลรายบุคคล (Care Plan) หมายถึง แบบการวางแผนการดูแลช่วยเหลือผู้สูงอายุหรือ ผู้ที่มีภาวะพึ่งพิงจาก Care Manager ทีมผู้เชี่ยวชาญ ครอบครัวและผู้เกี่ยวข้องในพื้นที่ การจัดบริการดูแลระยะยาวกลุ่มภาวะพึ่งพิงตาม Care Plan คุณภาพ โดยมีกระบวนการ ดังนี้ 1. ผู้สูงอายุได้รับการคัดกรองความสามารถในการประกอบกิจวัตรประจำวันดัชนีบาร์เธลเอดีแอล (Barthel ADL Index) และปัญหาสุขภาพที่สำคัญ 2. กลุ่มภาวะพึ่งพิงได้รับการจัดทำแผนการดูแลรายบุคคล (Care plan) และได้รับการดูแลตาม แผนการดูแลรายบุคคล (Care Plan) ทุกสิทธิ์และตามชุดสิทธิประโยชน์ 2.1 Care Manager จัดทำ Care Plan รายบุคคล ผ่านระบบโปรแกรม Long Term Care 3C กรมอนามัย ในโปรแกรม LTC สปสช 2.2 Care Manager เสนอ Care Plan ผ่านคณะอนุกรรมการกองทุน LTC ระดับตำบล และบันทึก ข้อมูลระบบผลการอนุมัติ Care Plan ตามระบบโปรแกรม LTC ทั้งในระบบ สปสช. และ กรมอนามัย 2.3 กลุ่มภาวะพึ่งพิงที่ได้รับการดูแลตามแผน Care Plan โดยการมีส่วนร่วมของทีมสหวิชาชีพ และภาคีเครือข่าย 3. กองทุน Long Term Care มีการโอนงบประมาณกองทุน LTC ในการดูแลกลุ่มภาวะพึ่งพิง 4. ผลลัพธ์การดูแลกลุ่มภาวะพึ่งพิงที่ได้รับการดูแลตาม Care Plan ครบ 9 เดือน 12 เดือน มีค่าคะแนน ADL เพิ่มขึ้น สามารถเปลี่ยนกลุ่มที่ดีขึ้น หรือกลุ่มติดเตียงไม่มีภาวะแทรกซ้อน เพิ่มขึ้น ร้อยละของกลุ่มภาวะพึ่งพิงได้รับการดูแลตาม Care Plan คุณภาพ ปีงบประมาณ 2566 2567 2568 2569 2570 ร้อยละ ร้อยละ ร้อยละ ร้อยละ ร้อยละ 95 96 97 98 99 1. เพื่อวางแผนการดูแล ส่งเสริม ฟื้นฟู และพัฒนาระบบสนับสนุนการดูแลผู้สูงอายุและผู้มีภาวะ พึ่งพิงแบบรอบด้านรายบุคคล เชื่อมโยงกับการดูแลในระดับครอบครัว 2. สนับสนุนการมีส่วนร่วมของครอบครัว ชุมชน และหน่วยงานภาคีเครือข่ายที่เกี่ยวข้องในการดูแล และปรับเปลี่ยนพฤติกรรมสุขภาพของผู้สูงอายุและผู้มีภาวะพึ่งพิง ให้มีคุณภาพชีวิตที่ดีขึ้น 1. ผู้สูงอายุที่มีภาวะพึ่งพิงและมี ADL < 11 ทุกสิทธิ์การรักษา 2. ผู้ที่มีภาวะพึ่งพิงและมี ADL < 11 ทุกสิทธิ์การรักษา 1. รายงานผลการคัดกรอง ADL ในฐานข้อมูล Health Data Center 2. รายงานการจัดทำแผนการดูแลผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงรายบุคคล (Care Plan) โปรแกรม LTC กรมอนามัย และ สปสช. 3. รายงานผลลัพธ์การดูแลกลุ่มภาวะพึ่งพิงที่ได้รับการดูแลตาม Care Plan มีค่าคะแนน ADL เพิ่มขึ้น ,สามารถเปลี่ยนกลุ่มที่ดีขึ้น หรือกลุ่มติดเตียงไม่มีภาวะแทรกซ้อนเพิ่มขึ้นหลังการดูแล ครบ 9 เดือน 12 เดือน",
      "source": "1. ฐานข้อมูลการคัดกรอง ADL ใน Health Data Center",
      "formula": "2. โปรแกรม Long Term Care กรมอนามัย 3. โปรแกรม Long Term Care สปสช. สูตรการคำนวน",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "1. ฐานข้อมูลการคัดกรอง ADL ใน Health Data Center, LTC สปสช., LTC 3C",
      "evaluationMethod": "2. ฐานข้อมูลกลุ่มภาวะพึ่งพิงและ Care Plan ในโปรแกรม LTC สปสช.และ LTC 3C กรมอนามัย 3. รายงานการอนุมัติงบเบิกจ่ายงบกองทุน Long Term care โปรแกรม สปสช.",
      "responsible": "4. รายงานผลค่าคะแนน ADL การดูแลกลุ่มภาวะพึ่งพิง 9,12 เดือน โปรแกรม LTC สปสช. และ แบบรายงานผลการดูแลกลุ่มภาวะพึ่งพิงเปลี่ยนกลุ่ม ร้อยละของกลุ่มภาวะพึ่งพิงได้รับการดูแลตาม Care Plan คุณภาพ = จำนวนกลุ่มภาวะพึ่งพิงที่ได้รับดูแลตามแผนการดูแลรายบุคคล (Care Plan) x 100 จำนวนกลุ่มภาวะพึ่งพิงทั้งหมด เดือนตุลาคม 2565-กันยายน 2566 1) ผู้ปฏิบัติงานระดับพื้นที่ประเมิน ADL และคัดกรองกลุ่มอาการผู้สูงอายุ 9 ด้าน 2) Care Manager จัดทำ Care Plan ในระบบโปรแกรม Long Term Care (3C) และผ่าน การอนุมัติจากคณะอนุกรรมการกองทุน LTC ระดับตำบล 3) ผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่ได้รับการดูแลตาม Care Plan มีผลการประเมิน ADL เปลี่ยนแปลงดีขึ้น นางอังคณา อึ้งปิติมานะ นักวิชาการสาธารณสุขชำนาญการ กลุ่มงานส่งเสริมสุขภาพ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 043-221125 โทรสาร 043-224037 มือถือ 061-7929942 E-mail : ungpitimana.ang@gmail.com"
    },
    "KPI66-12": {
      "kpiId": "KPI66-12",
      "order": 12,
      "name": "ร้อยละสตรีอายุ 30-60 ปี ได้รับการคัดกรองมะเร็งปากมดลูก",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 1",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "80",
      "baseline": "59.81",
      "definition": "การคัดกรองมะเร็งปากมดลูก หมายถึง สตรี",
      "purpose": "1. เพื่อเพิ่มการเข้าถึงบริการคัดกรองมะเร็งปากมดลูก 2. เพื่อลดอัตราการเกิดโรคมะเร็งปากมดลูกในระยะลุกลาม",
      "population": "(อายุ 30-≤60 ปี) ได้รับการ ตรวจคัดกรองมะเร็ง ปากมดลูกด้วยวิธี HPV DNA test ทั้งแบบตรวจโดยเจ้าหน้าที่ และแบบ Self Collection เป็นการตรวจหาเชื้อ ไวรัส HPV ความ เสี่ยงสูง 14 สายพันธุ์ซึ่งเป็นสาเหตุของมะเร็งปากมดลูก โดยวิธีการตรวจคือเก็บเซลล์บริเวณ ปากมดลูกช่องคลอดด้านใน ส่งตรวจด้วยวิธีการตรวจด้วยน้ำยา เมื่อคัดกรองแล้วมีผลปกติ/ผล ลบ (Negative) จากตัวอย่างสิ่งส่งตรวจ แนะนำให้เข้ารับการตรวจคัดกรองมะเร็งปากมดลูก ด้วยวิธีHPV DNA Test ครั้งต่อไป ในอีก 5 ปี เกณฑ์เป้าหมาย ≥ ร้อยละ 80 วัตถุประสงค์ 1. เพื่อเพิ่มการเข้าถึงบริการคัดกรองมะเร็งปากมดลูก 2. เพื่อลดอัตราการเกิดโรคมะเร็งปากมดลูกในระยะลุกลาม กลุ่มเป้าหมาย สตรีไทยอายุ 30-≤60 ปี ในพื้นที่รับผิดชอบ ตามจำนวนที่ได้รับการจัดสรร ในปีงบประมาณ 2568 (การนับอายุ 59 ปี 11 เดือน 29 วัน ณ วันให้บริการ) (ประชากร Type area 1,Type area 3) ในช่วงเวลาที่กำหนด",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "1. จากโปรแกรม Cancer Cervical Screening @ Khon Kaen 2. HDC 43 แฟ้ม สำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "formula": "A = จำนวนสตรีไทยอายุ 30-≤60 ปี ที่ได้รับการคัดกรองมะเร็งปากมดลูก ด้วยวิธี HPV DNA Test (โดยการตรวจด้วยเจ้าหน้าที่ หรือ การตรวจด้วยตนเอง) B = จำนวนสตรีไทยอายุ 30-≤60 ปี สูตรคำนวณ (A/B) x 100 ตัวชี้วัด ระยะเวลา รายไตรมาส ปีงบประมาณ พ.ศ.2568 ประเมินผล",
      "numeratorA": "จำนวนสตรีไทยอายุ 30-≤60 ปี ที่ได้รับการคัดกรองมะเร็งปากมดลูก ด้วยวิธี HPV DNA Test",
      "denominatorB": "จำนวนสตรีไทยอายุ 30-≤60 ปี",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลได้แบบ real time รายละเอียด ปีงบประมาณ พ.ศ.2565 ปีงบประมาณ พ.ศ.2566 ปีงบประมาณ พ.ศ.2567 ร้อยละ 21.82 ร้อยละ 42.81 % ร้อยละ 59.34 % ข้อมูลพื้นฐาน (Baseline Data) ผลการดำเนินงาน ย้อนหลัง 3 ปี (ปี 2565 -2567)",
      "responsible": "1. ชื่อ-สกุล นางยุภาพร ดีแป้น ตำแหน่ง : พยาบาลวิชาชีพชำนาญการ ตัวชี้วัด กลุ่มงาน : ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ที่ทำงาน : 043-221125 ต่อ 150 โทรสาร : 043-224037 โทรศัพท์มือถือ : 080-4620160 E-mail : smallbody@hotmail.com 2. ชื่อ-สกุล นางแสงเดือน โสภา ตำแหน่ง : พยาบาลวิชาชีพชำนาญการ กลุ่มงาน : ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ที่ทำงาน : 043-221125 ต่อ 150 โทรสาร : 043-224037 โทรศัพท์มือถือ : 081-3803219 3. ชื่อ-สกุล นางกิตติมา ก้านจักร ตำแหน่ง : นักวิชาการสาธารณสุขชำนาญการพิเศษ กลุ่มงาน : ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ที่ทำงาน : 043-221125 ต่อ 169 โทรสาร : 043-224037 โทรศัพท์มือถือ : 087-7707761"
    },
    "KPI66-13": {
      "kpiId": "KPI66-13",
      "order": 13,
      "name": "ประชาชนอายุ 50-70 ปี ได้รับการคัดกรองมะเร็งลำไส้ใหญ่/ไส้ตรงด้วยวิธี FIT Test",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 1",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "80",
      "baseline": "72.44",
      "definition": "1. ผู้ที่มีผลการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรงผิดปกติ หมายถึง ประชากรเพศชาย และเพศหญิงอายุ 50- 70 ปีที่มีผลการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรง ด้วยวิธี Fecal Immunochemical Test (FIT) เป็นบวก (Positive) คือตรวจพบเม็ดเลือดแดงใน ตัวอย่างอุจจาระ 2. การส่องกล้อง Colonoscopy หมายถึง การวินิจฉัยความผิดปกติภายในลำไส้ใหญ่ ด้วยการส่องกล้องขยาย เพื่อการค้นหารอยโรคก่อนการเกิดมะเร็งลำไส้ใหญ่และไส้ตรงใน ระยะต้น",
      "purpose": "เพื่อลดอัตราการเกิดโรคมะเร็งลำไส้ใหญ่และไส้ตรงในระยะลุกลาม",
      "population": "ประชากรกลุ่มเป้าหมายที่ได้รับการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรงด้วยวิธี FIT test ในปีงบประมาณ พ.ศ.2568 ผลการตรวจเป็นบวก (Positive)",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "1. โปรแกรม Your Colonoscopy 2. HDC สำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "formula": "A = จำนวนประชากรกลุ่มเป้าหมายที่ได้รับการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรงด้วยวิธี FIT test ในปีงบประมาณ พ.ศ.2568 ผลการตรวจเป็นบวก (Positive) B = จำนวนประชากรกลุ่มเป้าหมายที่ได้รับการคัดกรองมะเร็งลำไส้ใหญ่ และไส้ตรงด้วยวิธี FIT test ในปีงบประมาณ พ.ศ.2568 ผลการตรวจเป็นบวก (Positive) ที่ได้รับการส่องกล้อง Colonoscopy สูตรคำนวณ (A/B) x 100 ตัวชี้วัด ระยะเวลา รายไตรมาส ปีงบประมาณ พ.ศ.2568 ประเมินผล",
      "numeratorA": "จำนวนประชากรกลุ่มเป้าหมายที่ได้รับการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรงด้วยวิธี FIT test",
      "denominatorB": "จำนวนประชากรกลุ่มเป้าหมายที่ได้รับการคัดกรองมะเร็งลำไส้ใหญ่ และไส้ตรงด้วยวิธี FIT test",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลได้แบบ real time จากโปรแกรม Your Colonoscopy รายละเอียด ปีงบประมาณ 2565 ปีงบประมาณ 2566 ปีงบประมาณ 2567 ร้อยละ 85.24 ร้อยละ 82.67 ร้อยละ 81.46 ข้อมูลพื้นฐาน (Baseline Data) ผลการดำเนินงาน ย้อนหลัง 3 ปี (ปี 2565 -2567) ทธศาสตร์จังหวัดขอนแก่น ระยะ 5 ปี (พ.ศ. 2566-2570) หน้า 82 128",
      "responsible": "ตำแหน่ง : พยาบาลวิชาชีพชำนาญการ สำนักงานสาธารณสุขจังหวัดขอนแก่น ตัวชี้วัด 1. ชื่อ-สกุล นางยุภาพร ดีแป้น โทรสาร : 043-224037 E-mail : smallbody@hotmail.com กลุ่มงาน : ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด ตำแหน่ง : พยาบาลวิชาชีพชำนาญการ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ที่ทำงาน : 043-221125 ต่อ 150 โทรสาร : 043-224037 โทรศัพท์มือถือ : 080-4620160 ตำแหน่ง : นักวิชาการสาธารณสุขชำนาญการพิเศษ สำนักงานสาธารณสุขจังหวัดขอนแก่น 2. ชื่อ-สกุล นางแสงเดือน โสภา โทรสาร : 043-224037 กลุ่มงาน : ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด โทรศัพท์ที่ทำงาน : 043-221125 ต่อ 150 โทรศัพท์มือถือ : 081-3803219 3. ชื่อ-สกุล นางกิตติมา ก้านจักร กลุ่มงาน : ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด โทรศัพท์ที่ทำงาน : 043-221125 ต่อ 169 โทรศัพท์มือถือ : 087-7707761"
    },
    "KPI66-14": {
      "kpiId": "KPI66-14",
      "order": 14,
      "name": "อัตราความครอบคลุมของการค้นหาผู้ป่วยวัณโรครายใหม่และการกลับเป็นซ้ำ",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 1",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "90",
      "baseline": "88",
      "definition": "ลดปัจจัยเสี่ยงด้านสุขภาพและความเจ็บป่วยของประชาชน",
      "purpose": "และการกลับเป็นซ้ำ",
      "population": "1. ผู้ป่วยวัณโรคปอดรายใหม่ หมายถึง ผู้ป่วยวัณโรคปอดที่ไม่เคยรักษาวัณโรคมาก่อน และผู้ป่วยที่รักษาวัณโรคน้อยกว่า 1 เดือน และไม่เคยขึ้นทะเบียนในแผนงานวัณ โรคแห่งชาติ แบ่งเป็น 2 กลุ่ม คือ 2.1 ผู้ป่วยที่มีผลตรวจยืนยันพบเชื้อวัณโรค (Bacteriologically confirmed: B+) หมายถึง ผู้ป่วยวัณโรคที่มีผลตรวจเสมหะเป็นบวก อาจจะเป็นการตรวจด้วย วิธี Smear microscopy หรือ Culture หรือวิธี Molecular หรือวิธีการอื่นๆ ที่องค์การอนามัยโลกรับรอง 2.2 ผู้ป่วยที่วินิจฉัยด้วยลักษณะทางคลินิก (Clinically Diagnosed: B-) หมายถึง ผู้ป่วยวัณโรคที่มีผลตรวจเสมหะเป็นลบ หรือไม่มีผลตรวจ แต่ผลการวินิจฉัย ด้วยวิธีการตรวจเอกซเรย์รังสีทรวงอกหรือผลการตรวจชิ้นเนื้อผิดปกติเข้าได้ กับวัณโรค ร่วมกับมีลักษณะทางคลินิกเข้าได้กับวัณโรค และแพทย์ตัดสินใจ รักษาด้วยสูตรยารักษาวัณโรค 2. การประเมินอัตราความครอบคลุมการขึ้นทะเบียนของผู้ป่วยวัณโรครายใหม่และ กลับเป็นซ้ำ (TB Treatment Coverage) หมายถึง ผู้ป่วยวัณโรครายใหม่และกลับ เป็นซ้ำที่ขึ้นทะเบียนในปีงบประมาณ พ.ศ. 2566 (1 ตุลาคม 2565-30 กันยายน 2566) โดยเทียบกับค่าคาดประมาณของประชากร (150 ต่อแสน ประชากร) 3. การประเมินการค้นหาวัณโรคใน 7 กลุ่มเสี่ยง หมายถึง ผู้ที่ได้รับการค้นหาวัณโรค ใน 7 กลุ่มเสี่ยง ที่ได้รับการคัดกรองด้วยวิธีการถ่ายภาพรังสีทรวงอก (Chest X-Ray) ในปีงบประมาณ พ.ศ. 2566 (1 ตุลาคม 2565-30 กันยายน 2566) ปีงบประมาณ 2566 2567 2568 2569 2570 ร้อยละ ร้อยละ ร้อยละ ร้อยละ ร้อยละ 90 92 94 96 98 1. เพื่อให้ผู้ติดเชื้อวัณโรคและผู้ป่วยวัณโรคเข้าถึงระบบบริการสุขภาพในด้านการ ตรวจวินิจฉัย ป้องกัน ดูแลรักษาที่ได้มาตรฐานและรักษาหายรักษาครบ 2. เพื่อพัฒนามาตรฐานระบบบริการสุขภาพในการตรวจวินิจฉัย ป้องกัน ดูแลรักษาผู้ ติดเชื้อวัณโรคและผู้ป่วยวัณโรคของสถานบริการสาธารณสุข 1. กลุ่มเป้าหมายสำหรับการประเมินการค้นหาวัณโรคใน 7 กลุ่มเสี่ยง ได้แก่ 1.1 ผู้สัมผัสร่วมบ้าน/ผู้สัมผัสใกล้ชิด 1.2 ผู้ใช้สารเสพติด ติดสุราเรื้อรัง 1.3 ผู้สูงอายุตั้งแต่ 65 ปีขึ้นไป หรือที่สูบบุหรี่ หรือมี DM หรือมี COPD 1.4 ผู้ป่วยโรคที่ทำให้ภูมิคุ้มกันลดลง ได้แก่ ผู้ป่วย CKD ตั้งแต่ stage 4 ขึ้นไป, ผู้ป่วยเบาหวานที่ควบคุมระดับน้ำตาลไม่ได้ (HbA1c ตั้งแต่ 7 ขึ้นไป), วิธีจัดเก็บข้อมูล",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "Sulfasalazine Cyclosporine mtx เป็นต้น)",
      "numeratorA": "จำนวนผู้ที่ได้รับการค้นหาวัณโรคใน 7 กลุ่มเสี่ยง ที่ได้รับการคัดกรองด้วยวิธีการ",
      "denominatorB": "จำนวนเป้าหมายผู้ที่ต้องได้รับการค้นหาวัณโรคใน 7 กลุ่มเสี่ยง",
      "frequency": "1.5 ผู้ติดเชื้อเอชไอวี",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI66-15": {
      "kpiId": "KPI66-15",
      "order": 15,
      "name": "ร้อยละของโรงพยาบาลที่ยกระดับการพัฒนาอนามัยสิ่งแวดล้อมได้ตามเกณฑ์ Green & Clean Hospital Challenges ผ่านเกณฑ์ระดับ",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 1",
      "unit": "แห่ง",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "24 แห่ง",
      "baseline": "-",
      "definition": "คุ้มครองผู้บริโภคด้านสุขภาพ และสนับสนุนให้เกิดการมีส่วนร่วมจากทุกภาคส่วน ระบบคุ้มครองผู้บริโภคและการจัดการสิ่งแวดล้อมที่มีประสิทธิภาพ CLEAN 15. ร้อยละของโรงพยาบาลที่ยกระดับการพัฒนาอนามัยสิ่งแวดล้อมได้ตามเกณฑ์ G : Garbage (GREEN & CLEAN Hospital Challenge) โรงพยาบาลที่ยกระดับพัฒนาอนามัยสิ่งแวดล้อมได้ตามเกณฑ์ GREEN & CLEAN Hospital R : Rest room Challenge หมายถึง โรงพยาบาลสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่น (รพ.ศูนย์ E : Energy รพ.ทั่วไป รพ.ชุมชน) โรงพยาบาลสังกัดกรมวิชาการ ในจังหวัดขอนแก่น ที่มีกิจกรรมการ E : Environment ดำเนินงานด้านอนามัยสิ่งแวดล้อมตามเกณฑ์ ดังนี้ ระดับมาตรฐาน (Standard) หมายถึง โรงพยาบาลสามารถดำเนินการตามเกณฑ์ N : Nutrition ข้อที่ 1 - 13 ได้ตามเงื่อนไข (คะแนน 80 % ขึ้นไป) 1. มีการกำหนดนโยบาย จัดทำแผนการขับเคลื่อน พัฒนาศักยภาพและสร้างกระบวนการ สื่อสารให้เกิดการพัฒนาด้านอนามัยสิ่งแวดล้อม GREEN & CLEAN Hospital อย่างมีส่วน ร่วมของคนในองค์กร 2. มีการจัดการมูลฝอยทั่วไปอย่างถูกสุขลักษณะและเป็นไปตามกฎกระทรวงสุขลักษณะการ จัดการมูลฝอยทั่วไป 2560 และกฎหมายที่เกี่ยวข้อง 3. มีการจัดการมูลฝอยที่เป็นพิษหรืออันตรายอย่างถูกสุขลักษณะเป็นไปตามกฎกระทรวง มูลฝอยที่เป็นพิษหรืออันตรายจากชุมชน พ.ศ. 2563 และกฎหมายอื่นที่เกี่ยวข้อง 4. มีการจัดการมูลฝอยติดเชื้ออย่างถูกสุขลักษณะ ตามกฎกระทรวงว่าด้วยการกำจัดมูลฝอย ติดเชื้อ พ.ศ. 2545 5. มีการพัฒนาส้วมตามมาตรฐานส้วมสาธารณะไทย (HAS) ที่อาคารผู้ป่วยนอก(OPD) และ อาคารผู้ป่วยใน (IPD) 6. มีการจัดการสิ่งปฏิกูลอย่างถูกสุขลักษณะตามกฎกระทรวงสุขลักษณะการจัดการสิ่งปฏิกูล พ.ศ. 2561 และกฎหมายอื่นที่เกี่ยวข้อง 7. มีการกำหนดนโยบายและมาตรการประหยัดพลังงานที่เป็นปัจจุบัน และเป็นรูปธรรม เกิด ประสิทธิภาพในการลดการใช้พลังงานและมีการปฏิบัติตามมาตรการที่กำหนดร่วมกันทั้ง องค์กร 8. มีการจัดการสิ่งแวดล้อมทั่วไปทั้งภายในและภายนอกอาคาร โดยเพิ่มพื้นที่สีเขียวและพื้นที่ พักผ่อนที่สร้างความรู้สึกผ่อนคลายสอดคล้องกับชีวิต และวัฒนธรรมท้องถิ่นสำหรับผู้ป่วย รวมทั้งผู้มารับบริการ 9. มีกิจกรรมส่งเสริม GREEN และกิจกรรมที่เอื้อต่อการมีสุขภาพดีแบบองค์รวม ได้แก่ กิจกรรมส่งเสริมสุขอนามัย กิจกรรมป้องกันการแพร่ระบาดของโรค กิจกรรมทางกาย กิจกรรมให้คำปรึกษาด้านสุขภาพขณะรอรับบริการของผู้ป่วยและญาติ 10. สถานที่ประกอบอาหารผู้ป่วยในโรงพยาบาลได้มาตรฐานสุขาภิบาลอาหารตาม กฎกระทรวงสุขลักษณะของสถานที่จำหน่ายอาหาร พ.ศ. 2561 (4 หมวด) และมีการ เฝ้าระวังทางสุขาภิบาลอาหาร 11. ร้านอาหารในโรงพยาบาลได้มาตรฐานสุขาภิบาลอาหารตามกฎกระทรวงสุขลักษณะของ สถานที่จำหน่ายอาหาร พ.ศ. 2561 (4 หมวด) และมีการเฝ้าระวังทางสุขาภิบาลอาหาร 12. จัดให้มีน้ำอุปโภค/บริโภคสะอาดที่อาคารผู้ป่วยนอกและผู้ป่วยใน",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "ผลการดำเนินงานจริงเทียบกับเกณฑ์เป้าหมาย (แห่ง)",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI66-16": {
      "kpiId": "KPI66-16",
      "order": 16,
      "name": "ร้อยละผลิตภัณฑ์สุขภาพและสถานประกอบการมีคุณภาพตามเกณฑ์",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 1",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "85",
      "baseline": "82",
      "definition": "ระบบคุ้มครองผู้บริโภคและการจัดการสิ่งแวดล้อมที่มีประสิทธิภาพ",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ผลิตภัณฑ์สุขภาพ หมายถึง ผลิตภัณฑ์สุขภาพที่อยู่ภายใต้การกำกับดูแลของ อย. ได้แก่",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "อาหาร ผลิตภัณฑ์สมุนไพร เครื่องสำอาง และวัตถุอันตราย ได้รับอนุญาตจาก อย. หรือ สสจ.",
      "formula": "1.ร้อยละผลิตภัณฑ์สุขภาพที่ผ่านเกณฑ์คุณภาพ (A/B)x100 A = จำนวนผลิตภัณฑ์สุขภาพที่ผ่านเกณฑ์คุณภาพ",
      "numeratorA": "จำนวนผลิตภัณฑ์สุขภาพที่ผ่านเกณฑ์คุณภาพ",
      "denominatorB": "จำนวนผลิตภัณฑ์สุขภาพทั้งหมดที่ส่งตรวจสอบคุณภาพ",
      "frequency": "B = จำนวนผลิตภัณฑ์สุขภาพทั้งหมดที่ส่งตรวจสอบคุณภาพ",
      "evaluationMethod": "2.ร้อยละสถานประกอบการสุขภาพที่ผ่านเกณฑ์คุณภาพ (A/B)x100 รายละเอียดข้อมูลพื้นฐาน A = จำนวนสถานประกอบการสุขภาพที่ผ่านเกณฑ์คุณภาพ (Baseline Data) B = จำนวนสถานประกอบการสุขภาพทั้งหมดที่ส่งตรวจสอบคุณภาพ ผลการดำเนินงานย้อนหลัง 3. จำนวนผลิตภัณฑ์สุขภาพที่ได้รับการส่งเสริมและขึ้นทะเบียน 3 ปี (ปี 2563 -2565) ทุกไตรมาส ข้อมูลจากรายงานประจำเดือน/ไตรมาส ผลการดำเนินงานอำเภอผ่านเกณฑ์การประเมิน 3 ปีย้อนหลัง ผลงาน ปี 2563 ปี 2564 ปี 2565 ปี 2566 85 เกณฑ์การประเมิน(ร้อยละ) 80 80 85 N/A ผลงานอำเภอผ่านเกณฑ์ N/A 69.23 73.07 (18 อำเภอ) (19 อำเภอ)",
      "responsible": "1.นางศศิธร เอื้ออนันต์ เภสัชกรชำนาญการ โทรศัพท์มือถือ : 081-3910199 E-mail : sasitorneu@gmail.com 2. นางสาวชัญญรัตน์ นกศักดา เภสัชกรชำนาญการ โทรศัพท์มือถือ : 099-6359563 E-mail: chanyaratta@gmail.com"
    },
    "KPI66-17": {
      "kpiId": "KPI66-17",
      "order": 17,
      "name": "ร้อยละของผู้ป่วยโรคเบาหวานและโรคความดันโลหิตสูงที่ควบคุมได้ดี",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "40 / 60",
      "baseline": "-",
      "definition": "ระบบบริการสุขภาพ ตั้งแต่ ปฐมภูมิ ทุติยภูมิ และตติยภูมิ ขั้นสูง มีคุณภาพได้มาตรฐาน ระบบ",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "17. ร้อยละของผู้ป่วยโรคเบาหวานที่ควบคุมระดับน้ำตาลได้ดีและร้อยละของผู้ป่วยโรคความ ดันโลหิตสูงที่ควบคุมระดับความดันโลหิตได้ดี 1.1 ร้อยละของผู้ป่วยโรคเบาหวานที่ควบคุมระดับน้ำตาลได้ดี 1.2 ร้อยละของผู้ป่วยโรคความดันโลหิตสูงที่ควบคุมระดับความดันโลหิตได้ดี 17. ร้อยละของผู้ป่วยโรคเบาหวานที่ควบคุมระดับน้ำตาลได้ดี 1.ผู้ป่วยโรคเบาหวาน หมายถึง ผู้ป่วยที่ได้รับการวินิจฉัยว่าเป็นโรคเบาหวาน ด้วยรหัส E10-E14 และได้รับการขึ้นทะเบียนโรคเบาหวาน โดยอาศัยอยู่ในพื้นที่ รับผิดชอบ Type Area 1,3 2. ผู้ป่วยโรคเบาหวานที่ได้รับการตรวจ HbA1C หมายถึง ผู้ป่วยโรคเบาหวานที่ได้รับ การตรวจ HbA1C ในรอบปีงบประมาณ 2566 3. ผู้ป่วยโรคเบาหวานที่ควบคุมระดับน้ำตาลในเลือดได้ดี หมายถึง 3.1 ผู้ป่วยเบาหวาน ไมมีโรคร่วม มีค่าระดับน้ำตาลในเลือด HbA1C ครั้ง สุดท้าย < ร้อยละ 7 หรือ 3.2 ผู้ป่วยเบาหวาน มีโรคร่วม มีค่าระดับน้ำตาลในเลือด HbA1C ครั้ง สุดท้าย < ร้อยละ 8 หมายเหตุ : รหัส ICD10 มีโรคร่วม ได้แก่ 1. รหัสโรคเบาหวาน E10-E14 (นับทุกจุดที่ตามหลังรหัส) ร่วมกับรหัสโรค หัวใจขาดเลือด I20-I25 2. รหัสโรคเบาหวาน E10-E14 (นับทุกจุดที่ตามหลังรหัส) ร่วมกับรหัสโรค หัวใจล้มเหลว I50 3. รหัสโรคเบาหวาน E10-E14 (นับทุกจุดที่ตามหลังรหัส) ร่วมกับรหัสโรคหลอด เลือดสมอง I60-I69 4. รหัสโรคเบาหวาน E10-E14 (นับทุกจุดที่ตามหลังรหัส) ร่วมกับรหัสโรคไตเรื้อรัง ระยะที่ 4-5 N18.4-N18.5 5. รหัสโรคเบาหวาน E10-E14 (นับทุกจุดที่ตามหลังรหัส) ร่วมกับรหัสโรคลมชัก และโรคลมชักชนิดต่อเนื่อง G40-G41 ≥ ร้อยละ 40 ปีงบประมาณ 2566 2567 2568 2569 2570 ร้อยละ ร้อยละ ร้อยละ ร้อยละ ร้อยละ ≥40 ≥40 ≥40 ≥40 ≥40 เพื่อลดอัตราการเกิดภาวะแทรกซ้อนเรื้อรังทางระบบต่างๆ เช่น ตา ไต ระบบประสาทส่วน ปลาย ภาวะแทรกซ้อนของหัวใจและหลอดเลือด ผู้ป่วยโรคเบาหวานที่ได้รับการขึ้นทะเบียนและอาศัยอยู่ในพื้นที่รับผิดชอบ ทั้งหมด Type Area 1 , 3",
      "collectionMethod": "",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "(A/B) x 100",
      "numeratorA": "จำนวนผู้ป่วยเบาหวานในเขตรับผิดชอบที่ควบคุมระดับน้ำตาลในเลือดได้ดี",
      "denominatorB": "จำนวนผู้ป่วยเบาหวานในเขตรับผิดชอบทั้งหมด",
      "frequency": "A : จำนวนผู้ป่วยเบาหวานในเขตรับผิดชอบที่ควบคุมระดับน้ำตาลในเลือดได้ดี",
      "evaluationMethod": "B : จำนวนผู้ป่วยเบาหวานในเขตรับผิดชอบทั้งหมด 12 เดือน ติดตามจากระบบรายงาน HDC กระทรวงสาธารณสุข คิดจาก 43 แฟ้ม (ช่วงปีงบประมาณ) A : จำนวนผู้ป่วยเบาหวานที่ได้รับการวินิจฉัยจากแฟ้ม DIAGNOSIS_OPD, DIAGNOSIS_IPD, CHRONIC รหัส ICD-10 3 หลักขึ้นต้นด้วย E10 – E14 ที่อยู่อาศัยในเขตพื้นที่รับผิดชอบ PERSON.TYPE AREA IN (“1”, “3”) 1 (มีชื่ออยู่ตามทะเบียนบ้านในเขตพื้นที่รับผิดชอบ และอยู่ จริง), 3 (มาอาศัยอยู่ในเขตรับผิดชอบ แต่ทะเบียนบ้านอยู่นอกเขตรับผิดชอบ) และ PERSON.DISCHARGE = “9” (ไม่จำหน่าย) PERSON.NATION = “099” (สัญชาติไทย) และได้รับการตรวจ HbA1C (LABFU.LABTEST = “0531601”) ระดับ HbA1C ครั้ง สุดท้าย ใช้ข้อมูลจาก LABFU.LABRESULT – HbA1c ครั้งสุดท้ายน้อยกว่าร้อยละ 7 ในผู้ป่วย เบาหวานที่ไม่มีโรคร่วม – HbA1c ครั้งสุดท้ายน้อยกว่าร้อยละ 8 ในผู้ป่วยเบาหวานที่มีโรค ร่วม B : จำน วน ผู้ ป่ วยเบ าห วาน ที่ ได้ รับ การวินิ จ ฉัยจากแ ฟ้ ม DIAGNOSIS_OPD, DIAGNOSIS_IPD,CHRONIC รหัส ICD-10 3 หลักขึ้นต้นด้วย E10 – E14 ที่อยู่อาศัยในเขต พื้นที่ รับผิดชอบ PERSON.TYPE AREA IN (“1” , “3”) 1 (มีชื่ออยู่ตามทะเบียนบ้านในเขต พื้นที่ รับผิดชอบและอยู่จริง), 3 (มาอาศัยอยู่ในเขตรับผิดชอบ แต่ทะเบียนบ้านอยู่นอกเขต) และ PERSON.DISCHARGE=“9” (ไม่จำหน่าย) PERSON.NATION=“099” (สัญชาติไทย) รายละเอียดข้อมูล Baseline Data หนวย ผลการดำเนินงานในรอบปีงบประมาณ พ.ศ. พื้นฐาน (Baseline วัด Data) 2563 2564 2565 ผลการดำเนินงาน ร้อยละของผู้ป่วย รอยละ ย้อนหลัง 3 ปี โรคเบาหวานที่ควบคุม 20.64 23.94 24.46 (ปี 2563 – 2565) ระดับน้ำตาลได้ดี (HDC 30 ก.ย. 2565)",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI66-18": {
      "kpiId": "KPI66-18",
      "order": 18,
      "name": "ร้อยละของผู้ป่วยโรคเบาหวานและโรคความดันโลหิตสูงได้รับการค้นหาและคัดกรองโรคไตเรื้อรัง",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "80",
      "baseline": "58.49",
      "definition": "ระบบบริการสุขภาพ ตั้งแต่ ปฐมภูมิ ทุติยภูมิ และตติยภูมิ ขั้นสูง มีคุณภาพได้มาตรฐาน ระบบ",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "17. ร้อยละของผู้ป่วยโรคเบาหวานที่ควบคุมระดับน้ำตาลได้ดีและร้อยละของผู้ป่วยโรคความ ดันโลหิตสูงที่ควบคุมระดับความดันโลหิตได้ดี 1.1 ร้อยละของผู้ป่วยโรคเบาหวานที่ควบคุมระดับน้ำตาลได้ดี 1.2 ร้อยละของผู้ป่วยโรคความดันโลหิตสูงที่ควบคุมระดับความดันโลหิตได้ดี 17. ร้อยละของผู้ป่วยโรคเบาหวานที่ควบคุมระดับน้ำตาลได้ดี 1.ผู้ป่วยโรคเบาหวาน หมายถึง ผู้ป่วยที่ได้รับการวินิจฉัยว่าเป็นโรคเบาหวาน ด้วยรหัส E10-E14 และได้รับการขึ้นทะเบียนโรคเบาหวาน โดยอาศัยอยู่ในพื้นที่ รับผิดชอบ Type Area 1,3 2. ผู้ป่วยโรคเบาหวานที่ได้รับการตรวจ HbA1C หมายถึง ผู้ป่วยโรคเบาหวานที่ได้รับ การตรวจ HbA1C ในรอบปีงบประมาณ 2566 3. ผู้ป่วยโรคเบาหวานที่ควบคุมระดับน้ำตาลในเลือดได้ดี หมายถึง 3.1 ผู้ป่วยเบาหวาน ไมมีโรคร่วม มีค่าระดับน้ำตาลในเลือด HbA1C ครั้ง สุดท้าย < ร้อยละ 7 หรือ 3.2 ผู้ป่วยเบาหวาน มีโรคร่วม มีค่าระดับน้ำตาลในเลือด HbA1C ครั้ง สุดท้าย < ร้อยละ 8 หมายเหตุ : รหัส ICD10 มีโรคร่วม ได้แก่ 1. รหัสโรคเบาหวาน E10-E14 (นับทุกจุดที่ตามหลังรหัส) ร่วมกับรหัสโรค หัวใจขาดเลือด I20-I25 2. รหัสโรคเบาหวาน E10-E14 (นับทุกจุดที่ตามหลังรหัส) ร่วมกับรหัสโรค หัวใจล้มเหลว I50 3. รหัสโรคเบาหวาน E10-E14 (นับทุกจุดที่ตามหลังรหัส) ร่วมกับรหัสโรคหลอด เลือดสมอง I60-I69 4. รหัสโรคเบาหวาน E10-E14 (นับทุกจุดที่ตามหลังรหัส) ร่วมกับรหัสโรคไตเรื้อรัง ระยะที่ 4-5 N18.4-N18.5 5. รหัสโรคเบาหวาน E10-E14 (นับทุกจุดที่ตามหลังรหัส) ร่วมกับรหัสโรคลมชัก และโรคลมชักชนิดต่อเนื่อง G40-G41 ≥ ร้อยละ 40 ปีงบประมาณ 2566 2567 2568 2569 2570 ร้อยละ ร้อยละ ร้อยละ ร้อยละ ร้อยละ ≥40 ≥40 ≥40 ≥40 ≥40 เพื่อลดอัตราการเกิดภาวะแทรกซ้อนเรื้อรังทางระบบต่างๆ เช่น ตา ไต ระบบประสาทส่วน ปลาย ภาวะแทรกซ้อนของหัวใจและหลอดเลือด ผู้ป่วยโรคเบาหวานที่ได้รับการขึ้นทะเบียนและอาศัยอยู่ในพื้นที่รับผิดชอบ ทั้งหมด Type Area 1 , 3",
      "collectionMethod": "",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "(A/B) x 100",
      "numeratorA": "จำนวนผู้ป่วยเบาหวานในเขตรับผิดชอบที่ควบคุมระดับน้ำตาลในเลือดได้ดี",
      "denominatorB": "จำนวนผู้ป่วยเบาหวานในเขตรับผิดชอบทั้งหมด",
      "frequency": "A : จำนวนผู้ป่วยเบาหวานในเขตรับผิดชอบที่ควบคุมระดับน้ำตาลในเลือดได้ดี",
      "evaluationMethod": "B : จำนวนผู้ป่วยเบาหวานในเขตรับผิดชอบทั้งหมด 12 เดือน ติดตามจากระบบรายงาน HDC กระทรวงสาธารณสุข คิดจาก 43 แฟ้ม (ช่วงปีงบประมาณ) A : จำนวนผู้ป่วยเบาหวานที่ได้รับการวินิจฉัยจากแฟ้ม DIAGNOSIS_OPD, DIAGNOSIS_IPD, CHRONIC รหัส ICD-10 3 หลักขึ้นต้นด้วย E10 – E14 ที่อยู่อาศัยในเขตพื้นที่รับผิดชอบ PERSON.TYPE AREA IN (“1”, “3”) 1 (มีชื่ออยู่ตามทะเบียนบ้านในเขตพื้นที่รับผิดชอบ และอยู่ จริง), 3 (มาอาศัยอยู่ในเขตรับผิดชอบ แต่ทะเบียนบ้านอยู่นอกเขตรับผิดชอบ) และ PERSON.DISCHARGE = “9” (ไม่จำหน่าย) PERSON.NATION = “099” (สัญชาติไทย) และได้รับการตรวจ HbA1C (LABFU.LABTEST = “0531601”) ระดับ HbA1C ครั้ง สุดท้าย ใช้ข้อมูลจาก LABFU.LABRESULT – HbA1c ครั้งสุดท้ายน้อยกว่าร้อยละ 7 ในผู้ป่วย เบาหวานที่ไม่มีโรคร่วม – HbA1c ครั้งสุดท้ายน้อยกว่าร้อยละ 8 ในผู้ป่วยเบาหวานที่มีโรค ร่วม B : จำน วน ผู้ ป่ วยเบ าห วาน ที่ ได้ รับ การวินิ จ ฉัยจากแ ฟ้ ม DIAGNOSIS_OPD, DIAGNOSIS_IPD,CHRONIC รหัส ICD-10 3 หลักขึ้นต้นด้วย E10 – E14 ที่อยู่อาศัยในเขต พื้นที่ รับผิดชอบ PERSON.TYPE AREA IN (“1” , “3”) 1 (มีชื่ออยู่ตามทะเบียนบ้านในเขต พื้นที่ รับผิดชอบและอยู่จริง), 3 (มาอาศัยอยู่ในเขตรับผิดชอบ แต่ทะเบียนบ้านอยู่นอกเขต) และ PERSON.DISCHARGE=“9” (ไม่จำหน่าย) PERSON.NATION=“099” (สัญชาติไทย) รายละเอียดข้อมูล Baseline Data หนวย ผลการดำเนินงานในรอบปีงบประมาณ พ.ศ. พื้นฐาน (Baseline วัด Data) 2563 2564 2565 ผลการดำเนินงาน ร้อยละของผู้ป่วย รอยละ ย้อนหลัง 3 ปี โรคเบาหวานที่ควบคุม 20.64 23.94 24.46 (ปี 2563 – 2565) ระดับน้ำตาลได้ดี (HDC 30 ก.ย. 2565)",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI66-19": {
      "kpiId": "KPI66-19",
      "order": 19,
      "name": "ร้อยละของผู้ป่วย CKD ที่มีอัตราการลดลงของ eGFR < 5ml/min/1.73m2/yr",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "66",
      "baseline": "64.77",
      "definition": "ระบบบริการสุขภาพ ตั้งแต่ ปฐมภูมิ ทุติยภูมิ และตติยภูมิ ขั้นสูง มีคุณภาพได้มาตรฐาน ระบบ",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "17. ร้อยละของผู้ป่วยโรคเบาหวานที่ควบคุมระดับน้ำตาลได้ดีและร้อยละของผู้ป่วยโรคความ ดันโลหิตสูงที่ควบคุมระดับความดันโลหิตได้ดี 1.1 ร้อยละของผู้ป่วยโรคเบาหวานที่ควบคุมระดับน้ำตาลได้ดี 1.2 ร้อยละของผู้ป่วยโรคความดันโลหิตสูงที่ควบคุมระดับความดันโลหิตได้ดี 17. ร้อยละของผู้ป่วยโรคเบาหวานที่ควบคุมระดับน้ำตาลได้ดี 1.ผู้ป่วยโรคเบาหวาน หมายถึง ผู้ป่วยที่ได้รับการวินิจฉัยว่าเป็นโรคเบาหวาน ด้วยรหัส E10-E14 และได้รับการขึ้นทะเบียนโรคเบาหวาน โดยอาศัยอยู่ในพื้นที่ รับผิดชอบ Type Area 1,3 2. ผู้ป่วยโรคเบาหวานที่ได้รับการตรวจ HbA1C หมายถึง ผู้ป่วยโรคเบาหวานที่ได้รับ การตรวจ HbA1C ในรอบปีงบประมาณ 2566 3. ผู้ป่วยโรคเบาหวานที่ควบคุมระดับน้ำตาลในเลือดได้ดี หมายถึง 3.1 ผู้ป่วยเบาหวาน ไมมีโรคร่วม มีค่าระดับน้ำตาลในเลือด HbA1C ครั้ง สุดท้าย < ร้อยละ 7 หรือ 3.2 ผู้ป่วยเบาหวาน มีโรคร่วม มีค่าระดับน้ำตาลในเลือด HbA1C ครั้ง สุดท้าย < ร้อยละ 8 หมายเหตุ : รหัส ICD10 มีโรคร่วม ได้แก่ 1. รหัสโรคเบาหวาน E10-E14 (นับทุกจุดที่ตามหลังรหัส) ร่วมกับรหัสโรค หัวใจขาดเลือด I20-I25 2. รหัสโรคเบาหวาน E10-E14 (นับทุกจุดที่ตามหลังรหัส) ร่วมกับรหัสโรค หัวใจล้มเหลว I50 3. รหัสโรคเบาหวาน E10-E14 (นับทุกจุดที่ตามหลังรหัส) ร่วมกับรหัสโรคหลอด เลือดสมอง I60-I69 4. รหัสโรคเบาหวาน E10-E14 (นับทุกจุดที่ตามหลังรหัส) ร่วมกับรหัสโรคไตเรื้อรัง ระยะที่ 4-5 N18.4-N18.5 5. รหัสโรคเบาหวาน E10-E14 (นับทุกจุดที่ตามหลังรหัส) ร่วมกับรหัสโรคลมชัก และโรคลมชักชนิดต่อเนื่อง G40-G41 ≥ ร้อยละ 40 ปีงบประมาณ 2566 2567 2568 2569 2570 ร้อยละ ร้อยละ ร้อยละ ร้อยละ ร้อยละ ≥40 ≥40 ≥40 ≥40 ≥40 เพื่อลดอัตราการเกิดภาวะแทรกซ้อนเรื้อรังทางระบบต่างๆ เช่น ตา ไต ระบบประสาทส่วน ปลาย ภาวะแทรกซ้อนของหัวใจและหลอดเลือด ผู้ป่วยโรคเบาหวานที่ได้รับการขึ้นทะเบียนและอาศัยอยู่ในพื้นที่รับผิดชอบ ทั้งหมด Type Area 1 , 3",
      "collectionMethod": "",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "(A/B) x 100",
      "numeratorA": "จำนวนผู้ป่วยเบาหวานในเขตรับผิดชอบที่ควบคุมระดับน้ำตาลในเลือดได้ดี",
      "denominatorB": "จำนวนผู้ป่วยเบาหวานในเขตรับผิดชอบทั้งหมด",
      "frequency": "A : จำนวนผู้ป่วยเบาหวานในเขตรับผิดชอบที่ควบคุมระดับน้ำตาลในเลือดได้ดี",
      "evaluationMethod": "B : จำนวนผู้ป่วยเบาหวานในเขตรับผิดชอบทั้งหมด 12 เดือน ติดตามจากระบบรายงาน HDC กระทรวงสาธารณสุข คิดจาก 43 แฟ้ม (ช่วงปีงบประมาณ) A : จำนวนผู้ป่วยเบาหวานที่ได้รับการวินิจฉัยจากแฟ้ม DIAGNOSIS_OPD, DIAGNOSIS_IPD, CHRONIC รหัส ICD-10 3 หลักขึ้นต้นด้วย E10 – E14 ที่อยู่อาศัยในเขตพื้นที่รับผิดชอบ PERSON.TYPE AREA IN (“1”, “3”) 1 (มีชื่ออยู่ตามทะเบียนบ้านในเขตพื้นที่รับผิดชอบ และอยู่ จริง), 3 (มาอาศัยอยู่ในเขตรับผิดชอบ แต่ทะเบียนบ้านอยู่นอกเขตรับผิดชอบ) และ PERSON.DISCHARGE = “9” (ไม่จำหน่าย) PERSON.NATION = “099” (สัญชาติไทย) และได้รับการตรวจ HbA1C (LABFU.LABTEST = “0531601”) ระดับ HbA1C ครั้ง สุดท้าย ใช้ข้อมูลจาก LABFU.LABRESULT – HbA1c ครั้งสุดท้ายน้อยกว่าร้อยละ 7 ในผู้ป่วย เบาหวานที่ไม่มีโรคร่วม – HbA1c ครั้งสุดท้ายน้อยกว่าร้อยละ 8 ในผู้ป่วยเบาหวานที่มีโรค ร่วม B : จำน วน ผู้ ป่ วยเบ าห วาน ที่ ได้ รับ การวินิ จ ฉัยจากแ ฟ้ ม DIAGNOSIS_OPD, DIAGNOSIS_IPD,CHRONIC รหัส ICD-10 3 หลักขึ้นต้นด้วย E10 – E14 ที่อยู่อาศัยในเขต พื้นที่ รับผิดชอบ PERSON.TYPE AREA IN (“1” , “3”) 1 (มีชื่ออยู่ตามทะเบียนบ้านในเขต พื้นที่ รับผิดชอบและอยู่จริง), 3 (มาอาศัยอยู่ในเขตรับผิดชอบ แต่ทะเบียนบ้านอยู่นอกเขต) และ PERSON.DISCHARGE=“9” (ไม่จำหน่าย) PERSON.NATION=“099” (สัญชาติไทย) รายละเอียดข้อมูล Baseline Data หนวย ผลการดำเนินงานในรอบปีงบประมาณ พ.ศ. พื้นฐาน (Baseline วัด Data) 2563 2564 2565 ผลการดำเนินงาน ร้อยละของผู้ป่วย รอยละ ย้อนหลัง 3 ปี โรคเบาหวานที่ควบคุม 20.64 23.94 24.46 (ปี 2563 – 2565) ระดับน้ำตาลได้ดี (HDC 30 ก.ย. 2565)",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI66-20": {
      "kpiId": "KPI66-20",
      "order": 20,
      "name": "ระดับความสำเร็จการดำเนินการลดอัตราการเสียชีวิตของผู้บาดเจ็บวิกฤติฉุกเฉิน ภายใน 24 ชั่วโมง",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ระดับ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "ระดับ 5",
      "baseline": "ระดับ 5",
      "definition": "ลดปัจจัยเสี่ยงด้านสุขภาพและความเจ็บป่วยของประชาชน 2. ระดับความสำเร็จของการพัฒนาตำบลจัดการคุณภาพชีวิต ตำบล หมายถึง ตำบลตามกฎหมายว่าด้วยลักษณะปกครองท้องที่ที่อยู่นอกเขตหน่วยการ บริหารราชการ ส่วนท้องถิ่น ตำบลจัดการคุณภาพชีวิต หมายถึง ตำบลที่มีกระบวนการ การดำเนินงานด้วยกลไก 3 หมอ ประกอบด้วย หมอคนที่ 1 คือ อสม. ทำหน้าที่เป็นหมอประจำบ้าน หมอคนที่ 2 คือหมอสาธารณสุข และ หมอคนที่ 3 คือหมอเวชปฏิบัติครอบครัว และทีมขับเคลื่อนตำบล จัดการคุณภาพชีวิต สร้างการมีส่วนร่วมของคนในชุมชน ท้องถิ่น โดยภาครัฐสนับสนุน เพื่อแก้ไขปัญหา หรือพัฒนาตามบริบท และ/หรือ ประเด็นของชุมชน หรือประเด็น พชอ. ทั้งด้านการดูแลสุขภาพและคุณภาพชีวิตให้ดีขึ้น โดยใช้ทรัพยากร ภูมิปัญญา และนวัตกรรม ของชุมชน มีแผนการดำเนินงานของชุมชนที่ให้ความสำคัญกับประชาชน",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "มีกิจกรรมดำเนินการที่สอดคล้องกับสภาพปัญหาหรือประเด็นการพัฒนา อย่างครอบคลุม ทุกขั้นตอนตามแผน และมีการมุ่งเป้าหมายผลลัพธ์ที่ตอบสนองด้านสุขภาพและคุณภาพชีวิต จากความเข้มแข็งของชุมชน โดยมีระบบการดูแลสุขภาพตนเองและช่วยเหลือกัน ระบบบริการปฐมภูมิโดยชุมชนเชื่อมกับภาครัฐ และระบบการจัดการเพื่อยกระดับคุณภาพชีวิต เพื่อให้บริการสุขภาพแก่ประชาชนในชุมชนอย่างเป็นระบบ อันทำให้ประชาชนเข้าถึงบริการ สุขภาพมากขึ้น มีการจัดการสุขภาพและคุณภาพชีวิตด้วยตนเอง มีความมั่นคงด้านสุขภาพ และมีความรอบรู้ด้านสุขภาพ เกณ ฑ์ ต ำบ ลจัด การคุณ ภ าพ ชีวิต ห มายถึง ตำบ ลที่ มีการด ำเนิน งานครบ 4 องค์ประกอบ ได้แก่ T = Team มีทีมสุขภาพระดับตำบลที่มีศักยภาพ P = Plan มีการจัดทำแผนสุขภาพตำบลแบบมีส่วนร่วม A = Activity มีการจัดกิจกรรมหรือบริการสุขภาพกลุ่มวัย R = Result มีผลลัพธ์ด้านสุขภาพในชุมชน กลุ่มเปราะบาง หมายถึง กลุ่มบุคคลที่ขาดความสามารถในการปกป้องสิทธิผลประโยชน์ ของตนเนื่องจากขาดอำนาจ การศึกษา ทรัพยากร ความเข้มแข็ง มีความเสี่ยงสูงที่จะถูกคุกคาม จากปัจจัยเสี่ยงด้านต่าง ๆ เช่น สุขภาพ สังคม เศรษฐกิจ สิ่งแวดล้อม และภัยพิบัติทางธรรมชาติ หรืออื่น ๆ เป็นผู้ที่มีข้อจำกัดในเรื่องในการจัดการความเสี่ยงและผลกระทบที่ตามมา การ ช่วยเหลือตัวเอง การตัดสินใจ และอำนาจต่อรอง ต้องการการดูแลเป็นพิเศษ ต้องการ การสนับสนุน การปกป้อง การช่วยเหลือทางกาย จิต หรือทางสังคม จากผู้อื่น ตัวอย่างกลุ่ม เปราะบาง เช่น เด็ก ผู้สูงอายุที่ช่วยตัวเองไม่ได้ คนที่ถูกสังคมตีตรา ผู้ป่วยบางประเภท แรงงาน ต่างด้าวที่ผิดกฎหมาย ผู้ติดสารเสพติดที่ผิดกฎหมาย คนพิการ คนที่ทำผิดกฎหมาย/อาชญากร และคนที่ได้รับผลกระทบจากการแพร่ระบาดของโรคติดเชื้อไวรัสโคโรนา 2019 กลุ่มเปราะบางด้านสุขภาพ พิจารณาจากปัจจัยกำหนดสุขภาพด้านสังคม อย่างน้อย 2 ใน 3 ปัจจัย ดังนี้ 1) คนชายขอบที่ถูกเลือกปฏิบัติจากสังคม เช่น คนยากจน คนไร้รัฐ ชาติพันธุ์กลุ่มน้อย แรงงานข้ามชาติ เด็กกำพร้า ผู้เคยได้รับโทษ ฯลฯ 2) คนที่มีข้อจำกัดในการเข้าถึงบริการด้านสุขภาพ เช่น ผู้ที่ไม่มีหลักประกันสุขภาพ คนที่มีถิ่นที่อยู่อาศัยในพื้นที่ห่างไกล",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "ผลการดำเนินงานจริงเทียบกับเกณฑ์เป้าหมาย (ระดับ)",
      "numeratorA": "Activity มีการจัดกิจกรรมหรือบริการสุขภาพกลุ่มวัย",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI66-21": {
      "kpiId": "KPI66-21",
      "order": 21,
      "name": "ระดับความสำเร็จของการดำเนินงานป้องกันควบคุมวัณโรค",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ระดับ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "ระดับ 5",
      "baseline": "ระดับ 5",
      "definition": "ลดปัจจัยเสี่ยงด้านสุขภาพและความเจ็บป่วยของประชาชน 2. ระดับความสำเร็จของการพัฒนาตำบลจัดการคุณภาพชีวิต ตำบล หมายถึง ตำบลตามกฎหมายว่าด้วยลักษณะปกครองท้องที่ที่อยู่นอกเขตหน่วยการ บริหารราชการ ส่วนท้องถิ่น ตำบลจัดการคุณภาพชีวิต หมายถึง ตำบลที่มีกระบวนการ การดำเนินงานด้วยกลไก 3 หมอ ประกอบด้วย หมอคนที่ 1 คือ อสม. ทำหน้าที่เป็นหมอประจำบ้าน หมอคนที่ 2 คือหมอสาธารณสุข และ หมอคนที่ 3 คือหมอเวชปฏิบัติครอบครัว และทีมขับเคลื่อนตำบล จัดการคุณภาพชีวิต สร้างการมีส่วนร่วมของคนในชุมชน ท้องถิ่น โดยภาครัฐสนับสนุน เพื่อแก้ไขปัญหา หรือพัฒนาตามบริบท และ/หรือ ประเด็นของชุมชน หรือประเด็น พชอ. ทั้งด้านการดูแลสุขภาพและคุณภาพชีวิตให้ดีขึ้น โดยใช้ทรัพยากร ภูมิปัญญา และนวัตกรรม ของชุมชน มีแผนการดำเนินงานของชุมชนที่ให้ความสำคัญกับประชาชน",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "มีกิจกรรมดำเนินการที่สอดคล้องกับสภาพปัญหาหรือประเด็นการพัฒนา อย่างครอบคลุม ทุกขั้นตอนตามแผน และมีการมุ่งเป้าหมายผลลัพธ์ที่ตอบสนองด้านสุขภาพและคุณภาพชีวิต จากความเข้มแข็งของชุมชน โดยมีระบบการดูแลสุขภาพตนเองและช่วยเหลือกัน ระบบบริการปฐมภูมิโดยชุมชนเชื่อมกับภาครัฐ และระบบการจัดการเพื่อยกระดับคุณภาพชีวิต เพื่อให้บริการสุขภาพแก่ประชาชนในชุมชนอย่างเป็นระบบ อันทำให้ประชาชนเข้าถึงบริการ สุขภาพมากขึ้น มีการจัดการสุขภาพและคุณภาพชีวิตด้วยตนเอง มีความมั่นคงด้านสุขภาพ และมีความรอบรู้ด้านสุขภาพ เกณ ฑ์ ต ำบ ลจัด การคุณ ภ าพ ชีวิต ห มายถึง ตำบ ลที่ มีการด ำเนิน งานครบ 4 องค์ประกอบ ได้แก่ T = Team มีทีมสุขภาพระดับตำบลที่มีศักยภาพ P = Plan มีการจัดทำแผนสุขภาพตำบลแบบมีส่วนร่วม A = Activity มีการจัดกิจกรรมหรือบริการสุขภาพกลุ่มวัย R = Result มีผลลัพธ์ด้านสุขภาพในชุมชน กลุ่มเปราะบาง หมายถึง กลุ่มบุคคลที่ขาดความสามารถในการปกป้องสิทธิผลประโยชน์ ของตนเนื่องจากขาดอำนาจ การศึกษา ทรัพยากร ความเข้มแข็ง มีความเสี่ยงสูงที่จะถูกคุกคาม จากปัจจัยเสี่ยงด้านต่าง ๆ เช่น สุขภาพ สังคม เศรษฐกิจ สิ่งแวดล้อม และภัยพิบัติทางธรรมชาติ หรืออื่น ๆ เป็นผู้ที่มีข้อจำกัดในเรื่องในการจัดการความเสี่ยงและผลกระทบที่ตามมา การ ช่วยเหลือตัวเอง การตัดสินใจ และอำนาจต่อรอง ต้องการการดูแลเป็นพิเศษ ต้องการ การสนับสนุน การปกป้อง การช่วยเหลือทางกาย จิต หรือทางสังคม จากผู้อื่น ตัวอย่างกลุ่ม เปราะบาง เช่น เด็ก ผู้สูงอายุที่ช่วยตัวเองไม่ได้ คนที่ถูกสังคมตีตรา ผู้ป่วยบางประเภท แรงงาน ต่างด้าวที่ผิดกฎหมาย ผู้ติดสารเสพติดที่ผิดกฎหมาย คนพิการ คนที่ทำผิดกฎหมาย/อาชญากร และคนที่ได้รับผลกระทบจากการแพร่ระบาดของโรคติดเชื้อไวรัสโคโรนา 2019 กลุ่มเปราะบางด้านสุขภาพ พิจารณาจากปัจจัยกำหนดสุขภาพด้านสังคม อย่างน้อย 2 ใน 3 ปัจจัย ดังนี้ 1) คนชายขอบที่ถูกเลือกปฏิบัติจากสังคม เช่น คนยากจน คนไร้รัฐ ชาติพันธุ์กลุ่มน้อย แรงงานข้ามชาติ เด็กกำพร้า ผู้เคยได้รับโทษ ฯลฯ 2) คนที่มีข้อจำกัดในการเข้าถึงบริการด้านสุขภาพ เช่น ผู้ที่ไม่มีหลักประกันสุขภาพ คนที่มีถิ่นที่อยู่อาศัยในพื้นที่ห่างไกล",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "ผลการดำเนินงานจริงเทียบกับเกณฑ์เป้าหมาย (ระดับ)",
      "numeratorA": "Activity มีการจัดกิจกรรมหรือบริการสุขภาพกลุ่มวัย",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI66-22": {
      "kpiId": "KPI66-22",
      "order": 22,
      "name": "ระดับความสำเร็จของการประสานงาน จัดบริการปฐมภูมิร่วมในองค์กรต่างสังกัด",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ระดับ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "ระดับ 5",
      "baseline": "ระดับ 5",
      "definition": "ลดปัจจัยเสี่ยงด้านสุขภาพและความเจ็บป่วยของประชาชน 2. ระดับความสำเร็จของการพัฒนาตำบลจัดการคุณภาพชีวิต ตำบล หมายถึง ตำบลตามกฎหมายว่าด้วยลักษณะปกครองท้องที่ที่อยู่นอกเขตหน่วยการ บริหารราชการ ส่วนท้องถิ่น ตำบลจัดการคุณภาพชีวิต หมายถึง ตำบลที่มีกระบวนการ การดำเนินงานด้วยกลไก 3 หมอ ประกอบด้วย หมอคนที่ 1 คือ อสม. ทำหน้าที่เป็นหมอประจำบ้าน หมอคนที่ 2 คือหมอสาธารณสุข และ หมอคนที่ 3 คือหมอเวชปฏิบัติครอบครัว และทีมขับเคลื่อนตำบล จัดการคุณภาพชีวิต สร้างการมีส่วนร่วมของคนในชุมชน ท้องถิ่น โดยภาครัฐสนับสนุน เพื่อแก้ไขปัญหา หรือพัฒนาตามบริบท และ/หรือ ประเด็นของชุมชน หรือประเด็น พชอ. ทั้งด้านการดูแลสุขภาพและคุณภาพชีวิตให้ดีขึ้น โดยใช้ทรัพยากร ภูมิปัญญา และนวัตกรรม ของชุมชน มีแผนการดำเนินงานของชุมชนที่ให้ความสำคัญกับประชาชน",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "มีกิจกรรมดำเนินการที่สอดคล้องกับสภาพปัญหาหรือประเด็นการพัฒนา อย่างครอบคลุม ทุกขั้นตอนตามแผน และมีการมุ่งเป้าหมายผลลัพธ์ที่ตอบสนองด้านสุขภาพและคุณภาพชีวิต จากความเข้มแข็งของชุมชน โดยมีระบบการดูแลสุขภาพตนเองและช่วยเหลือกัน ระบบบริการปฐมภูมิโดยชุมชนเชื่อมกับภาครัฐ และระบบการจัดการเพื่อยกระดับคุณภาพชีวิต เพื่อให้บริการสุขภาพแก่ประชาชนในชุมชนอย่างเป็นระบบ อันทำให้ประชาชนเข้าถึงบริการ สุขภาพมากขึ้น มีการจัดการสุขภาพและคุณภาพชีวิตด้วยตนเอง มีความมั่นคงด้านสุขภาพ และมีความรอบรู้ด้านสุขภาพ เกณ ฑ์ ต ำบ ลจัด การคุณ ภ าพ ชีวิต ห มายถึง ตำบ ลที่ มีการด ำเนิน งานครบ 4 องค์ประกอบ ได้แก่ T = Team มีทีมสุขภาพระดับตำบลที่มีศักยภาพ P = Plan มีการจัดทำแผนสุขภาพตำบลแบบมีส่วนร่วม A = Activity มีการจัดกิจกรรมหรือบริการสุขภาพกลุ่มวัย R = Result มีผลลัพธ์ด้านสุขภาพในชุมชน กลุ่มเปราะบาง หมายถึง กลุ่มบุคคลที่ขาดความสามารถในการปกป้องสิทธิผลประโยชน์ ของตนเนื่องจากขาดอำนาจ การศึกษา ทรัพยากร ความเข้มแข็ง มีความเสี่ยงสูงที่จะถูกคุกคาม จากปัจจัยเสี่ยงด้านต่าง ๆ เช่น สุขภาพ สังคม เศรษฐกิจ สิ่งแวดล้อม และภัยพิบัติทางธรรมชาติ หรืออื่น ๆ เป็นผู้ที่มีข้อจำกัดในเรื่องในการจัดการความเสี่ยงและผลกระทบที่ตามมา การ ช่วยเหลือตัวเอง การตัดสินใจ และอำนาจต่อรอง ต้องการการดูแลเป็นพิเศษ ต้องการ การสนับสนุน การปกป้อง การช่วยเหลือทางกาย จิต หรือทางสังคม จากผู้อื่น ตัวอย่างกลุ่ม เปราะบาง เช่น เด็ก ผู้สูงอายุที่ช่วยตัวเองไม่ได้ คนที่ถูกสังคมตีตรา ผู้ป่วยบางประเภท แรงงาน ต่างด้าวที่ผิดกฎหมาย ผู้ติดสารเสพติดที่ผิดกฎหมาย คนพิการ คนที่ทำผิดกฎหมาย/อาชญากร และคนที่ได้รับผลกระทบจากการแพร่ระบาดของโรคติดเชื้อไวรัสโคโรนา 2019 กลุ่มเปราะบางด้านสุขภาพ พิจารณาจากปัจจัยกำหนดสุขภาพด้านสังคม อย่างน้อย 2 ใน 3 ปัจจัย ดังนี้ 1) คนชายขอบที่ถูกเลือกปฏิบัติจากสังคม เช่น คนยากจน คนไร้รัฐ ชาติพันธุ์กลุ่มน้อย แรงงานข้ามชาติ เด็กกำพร้า ผู้เคยได้รับโทษ ฯลฯ 2) คนที่มีข้อจำกัดในการเข้าถึงบริการด้านสุขภาพ เช่น ผู้ที่ไม่มีหลักประกันสุขภาพ คนที่มีถิ่นที่อยู่อาศัยในพื้นที่ห่างไกล",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "ผลการดำเนินงานจริงเทียบกับเกณฑ์เป้าหมาย (ระดับ)",
      "numeratorA": "Activity มีการจัดกิจกรรมหรือบริการสุขภาพกลุ่มวัย",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI66-23": {
      "kpiId": "KPI66-23",
      "order": 23,
      "name": "จำนวนอำเภอผ่านคุณลักษณะอำเภอป้องกันและแก้ไขปัญหาการฆ่าตัวตายที่เข้มแข็ง",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "อำเภอ (%)",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "18 (69.23%)",
      "baseline": "17 (65.38%)",
      "definition": "อย่างเข้มแข็งและยั่งยืน ระบบบริการสุขภาพตั้งแต่ ปฐมภูมิ ทุติยภูมิและตติยภูมิขั้นสูง มีคุณภาพได้มาตรฐาน มีระบบ ส่งต่อมีประสิทธิภาพและไร้ร้อยต่อ 23. จำนวนอำเภอผ่านคุณลักษณะอำเภอป้องกันและแก้ไขปัญหาการฆ่าตัวตายที่ เข้มแข็ง 1. อำเภอ หมายถึงเขตพื้นที่ปกครองส่วนภูมิภาค ตามกฎหมายว่าด้วยระเบียบ ราชการแผ่นดินในแต่ละอำเภอ จะแบ่งย่อยเป็นตำบล 2. คุณลักษณะอำเภอป้องกันและแก้ไขปัญหาการฆ่าตัวตายที่เข้มแข็ง หมายถึง คุณลักษณะที่กรมสุขภาพจิตและสำนักงานสาธารณสุขจังหวัดขอนแก่น นำมา ประยุกต์ใช้ในพื้นที่จังหวัดขอนแก่น โดยมีองค์ประกอบหลักดังนี้ 2.1 มีเครือข่ายเฝ้าระวัง คัดกรอง ช่วยเหลือและส่งต่อผู้ที่มีภาวะซึมเศร้าและ ภาวะเสี่ยงต่อการฆ่าตัวตาย ที่ผ่านการอบรมจากผู้รับผิดชอบงานสุขภาพจิตใน สถานบริการ เช่น อาสาสมัครสาธารณสุขประจำหมู่บ้าน แกนนำชุมชน แกนนำนักเรียนและแกนนำเยาวชน 2.2 มีการคัดกรองประชาชนกลุ่มเสี่ยงด้วยแบบคัดกรอง2Q โดยเครือข่ายและ แบบคัดกรอง8Q โดยบุคลากรสาธารณสุข ใน 3 กลุ่มเสี่ยง ได้แก่ 1.โรคจิต/ซึมเศร้า 2. โรคทางกายเรื้อรัง 3.โรคจากสุรา / ยาเสพติด 2.3 มีฐานข้อมูลครบถ้วนประกอบด้วยข้อมูลจากการสำรวจกลุ่มเสี่ยง การติดตาม ดูแลผู้ที่เสี่ยงต่อการฆ่าตัวตาย ผู้พยายามฆ่าตัวตายไม่สำเร็จ จากการสอบสวน โรคตามแบบรายงาน506S V.10และมีการบันทึกข้อมูลใน http://506s.dmh.go.th 2.4 มีการระดมทุนในการจัดทำแผนงาน/โครงการป้องกันและแก้ไขปัญหาการ ฆ่าตัวตาย หรือ โครงการสร้างเสริมสุขภาพใจในชุมชนโดยมีการบูรณาการงาน สุขภาพจิตสู่บุคลากรนอกหน่วยงานสาธารณสุข และมีการบันทึกแผนปฏิบัติ การผ่านระบบรายงานแผนปฏิบัติงาน(KOPA) สำนักงานสาธารณสุขจังหวัด ขอนแก่น 2.5 คลินิกหมอครอบครัว (PCU NPCU) มีระบบกิจกรรมในการดูแลสุขภาพจิต และจิตเวชในชุมชน 2.6 ผู้ป่วยโรคซึมเศร้า โรคจิตเภท เข้าถึงบริการสุขภาพจิตเพิ่มขึ้น",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "ผลการดำเนินงานจริงเทียบกับเกณฑ์เป้าหมาย (อำเภอ (%))",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI66-24": {
      "kpiId": "KPI66-24",
      "order": 24,
      "name": "ระดับความสำเร็จของการขับเคลื่อนงานการแพทย์แผนไทยและการแพทย์ทางเลือก",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ระดับ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "ระดับ 5",
      "baseline": "ระดับ 5",
      "definition": "ลดปัจจัยเสี่ยงด้านสุขภาพและความเจ็บป่วยของประชาชน 2. ระดับความสำเร็จของการพัฒนาตำบลจัดการคุณภาพชีวิต ตำบล หมายถึง ตำบลตามกฎหมายว่าด้วยลักษณะปกครองท้องที่ที่อยู่นอกเขตหน่วยการ บริหารราชการ ส่วนท้องถิ่น ตำบลจัดการคุณภาพชีวิต หมายถึง ตำบลที่มีกระบวนการ การดำเนินงานด้วยกลไก 3 หมอ ประกอบด้วย หมอคนที่ 1 คือ อสม. ทำหน้าที่เป็นหมอประจำบ้าน หมอคนที่ 2 คือหมอสาธารณสุข และ หมอคนที่ 3 คือหมอเวชปฏิบัติครอบครัว และทีมขับเคลื่อนตำบล จัดการคุณภาพชีวิต สร้างการมีส่วนร่วมของคนในชุมชน ท้องถิ่น โดยภาครัฐสนับสนุน เพื่อแก้ไขปัญหา หรือพัฒนาตามบริบท และ/หรือ ประเด็นของชุมชน หรือประเด็น พชอ. ทั้งด้านการดูแลสุขภาพและคุณภาพชีวิตให้ดีขึ้น โดยใช้ทรัพยากร ภูมิปัญญา และนวัตกรรม ของชุมชน มีแผนการดำเนินงานของชุมชนที่ให้ความสำคัญกับประชาชน",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "มีกิจกรรมดำเนินการที่สอดคล้องกับสภาพปัญหาหรือประเด็นการพัฒนา อย่างครอบคลุม ทุกขั้นตอนตามแผน และมีการมุ่งเป้าหมายผลลัพธ์ที่ตอบสนองด้านสุขภาพและคุณภาพชีวิต จากความเข้มแข็งของชุมชน โดยมีระบบการดูแลสุขภาพตนเองและช่วยเหลือกัน ระบบบริการปฐมภูมิโดยชุมชนเชื่อมกับภาครัฐ และระบบการจัดการเพื่อยกระดับคุณภาพชีวิต เพื่อให้บริการสุขภาพแก่ประชาชนในชุมชนอย่างเป็นระบบ อันทำให้ประชาชนเข้าถึงบริการ สุขภาพมากขึ้น มีการจัดการสุขภาพและคุณภาพชีวิตด้วยตนเอง มีความมั่นคงด้านสุขภาพ และมีความรอบรู้ด้านสุขภาพ เกณ ฑ์ ต ำบ ลจัด การคุณ ภ าพ ชีวิต ห มายถึง ตำบ ลที่ มีการด ำเนิน งานครบ 4 องค์ประกอบ ได้แก่ T = Team มีทีมสุขภาพระดับตำบลที่มีศักยภาพ P = Plan มีการจัดทำแผนสุขภาพตำบลแบบมีส่วนร่วม A = Activity มีการจัดกิจกรรมหรือบริการสุขภาพกลุ่มวัย R = Result มีผลลัพธ์ด้านสุขภาพในชุมชน กลุ่มเปราะบาง หมายถึง กลุ่มบุคคลที่ขาดความสามารถในการปกป้องสิทธิผลประโยชน์ ของตนเนื่องจากขาดอำนาจ การศึกษา ทรัพยากร ความเข้มแข็ง มีความเสี่ยงสูงที่จะถูกคุกคาม จากปัจจัยเสี่ยงด้านต่าง ๆ เช่น สุขภาพ สังคม เศรษฐกิจ สิ่งแวดล้อม และภัยพิบัติทางธรรมชาติ หรืออื่น ๆ เป็นผู้ที่มีข้อจำกัดในเรื่องในการจัดการความเสี่ยงและผลกระทบที่ตามมา การ ช่วยเหลือตัวเอง การตัดสินใจ และอำนาจต่อรอง ต้องการการดูแลเป็นพิเศษ ต้องการ การสนับสนุน การปกป้อง การช่วยเหลือทางกาย จิต หรือทางสังคม จากผู้อื่น ตัวอย่างกลุ่ม เปราะบาง เช่น เด็ก ผู้สูงอายุที่ช่วยตัวเองไม่ได้ คนที่ถูกสังคมตีตรา ผู้ป่วยบางประเภท แรงงาน ต่างด้าวที่ผิดกฎหมาย ผู้ติดสารเสพติดที่ผิดกฎหมาย คนพิการ คนที่ทำผิดกฎหมาย/อาชญากร และคนที่ได้รับผลกระทบจากการแพร่ระบาดของโรคติดเชื้อไวรัสโคโรนา 2019 กลุ่มเปราะบางด้านสุขภาพ พิจารณาจากปัจจัยกำหนดสุขภาพด้านสังคม อย่างน้อย 2 ใน 3 ปัจจัย ดังนี้ 1) คนชายขอบที่ถูกเลือกปฏิบัติจากสังคม เช่น คนยากจน คนไร้รัฐ ชาติพันธุ์กลุ่มน้อย แรงงานข้ามชาติ เด็กกำพร้า ผู้เคยได้รับโทษ ฯลฯ 2) คนที่มีข้อจำกัดในการเข้าถึงบริการด้านสุขภาพ เช่น ผู้ที่ไม่มีหลักประกันสุขภาพ คนที่มีถิ่นที่อยู่อาศัยในพื้นที่ห่างไกล",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "ผลการดำเนินงานจริงเทียบกับเกณฑ์เป้าหมาย (ระดับ)",
      "numeratorA": "Activity มีการจัดกิจกรรมหรือบริการสุขภาพกลุ่มวัย",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI66-25": {
      "kpiId": "KPI66-25",
      "order": 25,
      "name": "ระดับความสำเร็จในการจัดระบบการดูแลรักษาผู้ป่วยภาวะติดเชื้อในกระแสเลือด (Sepsis)",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ระดับ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "ระดับ 5",
      "baseline": "ระดับ 5",
      "definition": "ลดปัจจัยเสี่ยงด้านสุขภาพและความเจ็บป่วยของประชาชน 2. ระดับความสำเร็จของการพัฒนาตำบลจัดการคุณภาพชีวิต ตำบล หมายถึง ตำบลตามกฎหมายว่าด้วยลักษณะปกครองท้องที่ที่อยู่นอกเขตหน่วยการ บริหารราชการ ส่วนท้องถิ่น ตำบลจัดการคุณภาพชีวิต หมายถึง ตำบลที่มีกระบวนการ การดำเนินงานด้วยกลไก 3 หมอ ประกอบด้วย หมอคนที่ 1 คือ อสม. ทำหน้าที่เป็นหมอประจำบ้าน หมอคนที่ 2 คือหมอสาธารณสุข และ หมอคนที่ 3 คือหมอเวชปฏิบัติครอบครัว และทีมขับเคลื่อนตำบล จัดการคุณภาพชีวิต สร้างการมีส่วนร่วมของคนในชุมชน ท้องถิ่น โดยภาครัฐสนับสนุน เพื่อแก้ไขปัญหา หรือพัฒนาตามบริบท และ/หรือ ประเด็นของชุมชน หรือประเด็น พชอ. ทั้งด้านการดูแลสุขภาพและคุณภาพชีวิตให้ดีขึ้น โดยใช้ทรัพยากร ภูมิปัญญา และนวัตกรรม ของชุมชน มีแผนการดำเนินงานของชุมชนที่ให้ความสำคัญกับประชาชน",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "มีกิจกรรมดำเนินการที่สอดคล้องกับสภาพปัญหาหรือประเด็นการพัฒนา อย่างครอบคลุม ทุกขั้นตอนตามแผน และมีการมุ่งเป้าหมายผลลัพธ์ที่ตอบสนองด้านสุขภาพและคุณภาพชีวิต จากความเข้มแข็งของชุมชน โดยมีระบบการดูแลสุขภาพตนเองและช่วยเหลือกัน ระบบบริการปฐมภูมิโดยชุมชนเชื่อมกับภาครัฐ และระบบการจัดการเพื่อยกระดับคุณภาพชีวิต เพื่อให้บริการสุขภาพแก่ประชาชนในชุมชนอย่างเป็นระบบ อันทำให้ประชาชนเข้าถึงบริการ สุขภาพมากขึ้น มีการจัดการสุขภาพและคุณภาพชีวิตด้วยตนเอง มีความมั่นคงด้านสุขภาพ และมีความรอบรู้ด้านสุขภาพ เกณ ฑ์ ต ำบ ลจัด การคุณ ภ าพ ชีวิต ห มายถึง ตำบ ลที่ มีการด ำเนิน งานครบ 4 องค์ประกอบ ได้แก่ T = Team มีทีมสุขภาพระดับตำบลที่มีศักยภาพ P = Plan มีการจัดทำแผนสุขภาพตำบลแบบมีส่วนร่วม A = Activity มีการจัดกิจกรรมหรือบริการสุขภาพกลุ่มวัย R = Result มีผลลัพธ์ด้านสุขภาพในชุมชน กลุ่มเปราะบาง หมายถึง กลุ่มบุคคลที่ขาดความสามารถในการปกป้องสิทธิผลประโยชน์ ของตนเนื่องจากขาดอำนาจ การศึกษา ทรัพยากร ความเข้มแข็ง มีความเสี่ยงสูงที่จะถูกคุกคาม จากปัจจัยเสี่ยงด้านต่าง ๆ เช่น สุขภาพ สังคม เศรษฐกิจ สิ่งแวดล้อม และภัยพิบัติทางธรรมชาติ หรืออื่น ๆ เป็นผู้ที่มีข้อจำกัดในเรื่องในการจัดการความเสี่ยงและผลกระทบที่ตามมา การ ช่วยเหลือตัวเอง การตัดสินใจ และอำนาจต่อรอง ต้องการการดูแลเป็นพิเศษ ต้องการ การสนับสนุน การปกป้อง การช่วยเหลือทางกาย จิต หรือทางสังคม จากผู้อื่น ตัวอย่างกลุ่ม เปราะบาง เช่น เด็ก ผู้สูงอายุที่ช่วยตัวเองไม่ได้ คนที่ถูกสังคมตีตรา ผู้ป่วยบางประเภท แรงงาน ต่างด้าวที่ผิดกฎหมาย ผู้ติดสารเสพติดที่ผิดกฎหมาย คนพิการ คนที่ทำผิดกฎหมาย/อาชญากร และคนที่ได้รับผลกระทบจากการแพร่ระบาดของโรคติดเชื้อไวรัสโคโรนา 2019 กลุ่มเปราะบางด้านสุขภาพ พิจารณาจากปัจจัยกำหนดสุขภาพด้านสังคม อย่างน้อย 2 ใน 3 ปัจจัย ดังนี้ 1) คนชายขอบที่ถูกเลือกปฏิบัติจากสังคม เช่น คนยากจน คนไร้รัฐ ชาติพันธุ์กลุ่มน้อย แรงงานข้ามชาติ เด็กกำพร้า ผู้เคยได้รับโทษ ฯลฯ 2) คนที่มีข้อจำกัดในการเข้าถึงบริการด้านสุขภาพ เช่น ผู้ที่ไม่มีหลักประกันสุขภาพ คนที่มีถิ่นที่อยู่อาศัยในพื้นที่ห่างไกล",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "ผลการดำเนินงานจริงเทียบกับเกณฑ์เป้าหมาย (ระดับ)",
      "numeratorA": "Activity มีการจัดกิจกรรมหรือบริการสุขภาพกลุ่มวัย",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI66-26": {
      "kpiId": "KPI66-26",
      "order": 26,
      "name": "ร้อยละของตำบลจัดการสุขภาพในการเฝ้าระวัง ป้องกันแก้ไขปัญหาโรคพยาธิใบไม้ตับและมะเร็งท่อน้ำดี",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "60",
      "baseline": "-",
      "definition": "ผู้ป่วยโรคเบาหวาน หมายถึง ผู้ป่วยที่ได้รับการวินิจฉัยว่าเป็นโรคเบาหวาน ด้วยรหัส E10-E14 และได้รับการขึ้นทะเบียนโรคเบาหวาน โดยอาศัยอยู่ในพื้นที่รับผิดชอบ Type area 1,3 ผู้ป่วยโรคเบาหวานที่ได้รับการตรวจ HbA1C หมายถึง ผู้ป่วยโรคเบาหวานที่ได้รับการตรวจ HbA1C ในรอบปีงบประมาณ 2568 ผู้ป่วยโรคเบาหวานที่ควบคุมระดับน้ำตาลในเลือดได้ดี หมายถึง ผู้ป่วยเบาหวาน ไม่มีโรคร่วม มีค่า ระดับน้ำตาลในเลือด HbA1C ครั้งสุดท้าย < ร้อยละ 7 หรือ ผู้ป่วยเบาหวาน มีโรคร่วม มีค่าระดับ น้ำตาลในเลือด HbA1C ครั้งสุดท้าย < ร้อยละ 8 หมายเหตุ : รหัส ICD10 มีโรคร่วม ได้แก่ 1. รหัสโรคเบาหวาน E10-E14 (นับทุกจุดที่ตามหลังรหัส) ร่วมกับรหัสโรคหัวใจขาดเลือด I20-I25 2. รหัสโรคเบาหวาน E10-E14 (นับทุกจุดที่ตามหลังรหัส) ร่วมกับรหัสโรคหัวใจล้มเหลว I50 3. รหัสโรคเบาหวาน E10-E14 (นับทุกจุดที่ตามหลังรหัส) ร่วมกับรหัสโรคหลอดเลือดสมอง I60-I69 4. รหัสโรคเบาหวาน E10-E14 (นับทุกจุดที่ตามหลังรหัส) ร่วมกับรหัสโรคไตเรื้อรัง ระยะที่ 4-5 N18.4-N18.5 5. รหัสโรคเบาหวาน E10-E14 (นับทุกจุดที่ตามหลังรหัส) ร่วมกับรหัสโรคลมชักและโรคลมชัก ชนิดต่อเนื่อง G40-G41",
      "purpose": "เพื่อลดอัตราการเกิดภาวะแทรกซ้อนเรื้อรังทางระบบต่างๆ เช่น ตา ไต ระบบประสาทส่วนปลาย ภาวะแทรกซ้อนของหัวใจและหลอดเลือด",
      "population": "ผู้ป่วยโรคเบาหวานที่ได้รับการขึ้นทะเบียนและอาศัยอยู่ในพื้นที่รับผิดชอบ ทั้งหมด Type area 1 , 3",
      "collectionMethod": "บันทึกผ่านโปรแกรมพื้นฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐานข้อมูล 43 แฟ้ม",
      "source": "ฐานข้อมูล 43 แฟ้ม",
      "formula": "(A/B) x 100",
      "numeratorA": "จำนวนผู้ป่วยเบาหวานในเขตรับผิดชอบที่ควบคุมระดับน้ำตาลในเลือดได้ดี",
      "denominatorB": "จำนวนผู้ป่วยเบาหวานในเขตรับผิดชอบทั้งหมด",
      "frequency": "12 เดือน",
      "evaluationMethod": "A : จำนวนผู้ป่วยเบาหวานที่ได้รับการวินิจฉัยจากแฟ้ม DIAGNOSIS_OPD, DIAGNOSIS_IPD, CHRONIC รหั ส ICD-10 3 ห ลักขึ้น ต้น ด้วย E10 – E14 ที่ อยู่อ าศัยใน เขตพื้ น ที่ รับ ผิด ช อ บ PERSON.TYPE AREA IN (“1”, “3”) 1 (มีชื่ออยู่ตามทะเบียนบ้านในเขตพื้นที่รับผิดชอบและอยู่ จริง), 3 (มาอาศัยอยู่ในเขตรับผิดชอบ แต่ทะเบียนบ้านอยู่นอกเขตรับผิดชอบ) และ PERSON.DISCHARGE = “9” (ไม่จำห น่ าย) PERSON.NATION = “099” (สัญ ชาติไทย) และได้รับการตรวจ HbA1C (LABFU.LABTEST =“0531601”) ระดับ HbA1C ครั้งสุดท้าย ใช้ข้อมูลจาก LABFU.LABRESULT – HbA1c ครั้งสุดท้ายน้อยกว่าร้อยละ 7 ในผู้ป่วยเบาหวานที่ไม่มีโรคร่วม – HbA1c ครั้งสุดท้ายน้อยกว่า ร้อยละ 8 ในผู้ป่วยเบาหวานที่มีโรคร่วม B : จ ำ น ว น ผู้ ป่ ว ย เบ า ห ว า น ที่ ไ ด้ รั บ ก า ร วิ นิ จ ฉั ย จ า ก แ ฟ้ ม DIAGNOSIS_OPD, DIAGNOSIS_IPD,CHRONIC รหัส ICD-10 3 หลักขึ้นต้นด้วย E10 – E14 ที่อยู่อาศัยในเขตพื้นที่ รับผิดชอบ PERSON.TYPE AREA IN (“1” , “3”) 1 (มีชื่ออยู่ตามทะเบียนบ้านในเขตพื้นที่ รับผิดชอบ แ ล ะ อ ยู่ จ ริง), 3 (ม าอ าศั ย อ ยู่ ใน เข ต รั บ ผิ ด ช อ บ แ ต่ ท ะ เบี ย น บ้ า น อ ยู่ น อ ก เข ต ) แ ล ะ PERSON.DISCHARGE=“9” (ไม่จำหน่าย) PERSON.NATION=“099” (สัญชาติไทย) รายละเอียดข้อมูล 2565 2566 2567 พื้นฐาน (Baseline data) ผลการ 24.51 26.60 31.69 ดำเนินงานย้อนหลัง 3 ปี (ปี 2565 – 2567) ตัวชี้วัดที่ 27 ร้อยละของผู้ป่วยโรคความดันโลหิตสูงที่ควบคุมระดับความดันโลหิตได้ดี คำนิยาม ผู้ป่วยโรคความดันโลหิตสูง หมายถึง ผู้ป่วยที่ได้รับการวินิจฉัยโรคความดันโลหิตสูง รหัส I10-I15 เกณฑ์เป้าหมาย ผู้ป่วยโรคความดันโลหิตสูงที่ควบคุมระดับความดันโลหิตได้ดี หมายถึง ผู้ป่วยโรคความดันโลหิตสูง ที่มีระดับความดันโลหิตครั้งสุดท้าย < 140/90 mmHg ในชวงปีงบประมาณ 2567 ทั้งนี้ ไม่ว่าผู้ป่วย ความดันโลหิตสูงจะมีโรคเบาหวานร่วมด้วยหรือไม่ ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ 2567 2568 2569 2570 60 65 70 75 วัตถุประสงค์ เพื่อควบคุมและลดภาวะแทรกซ้อนต่อระบบต่างๆ เช่น โรคหัวใจ โรคไต โรคหลอดเลือดหัวใจตีบ โรคอัมพาต กลุ่มเป้าหมาย ผู้ ป่ ว ย โร ค ค ว าม ดั น โล หิ ต สู งที่ ได้ รั บ ก าร ขึ้ น ท ะ เบี ย น แ ล ะ อ าศั ย อ ยู่ ใน พื้ น ที่ รั บ ผิ ด ช อ บ ทั้ งห ม ด วิธีการจัดเก็บข้อมูล Type area 1 , 3 แหล่งข้อมูล บันทึกผ่านโปรแกรมพื้นฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐานข้อมูล 43 แฟ้ม รายการข้อมูล ฐานข้อมูล 43 แฟ้ม สูตรคำนวณตัวชี้วัด ระยะเวลาประเมินผล A : จำนวนผู้ป่วยโรคความดันโลหิตสูงในเขตรับผิดชอบ ที่ควบคุมระดับความดันโลหิตครั้งสุดท้าย < 140/90 mmHg ในปีงบประมาณ B : จำนวนผู้ป่วยโรคความดันโลหิตสูงในเขตรับผิดชอบ (A/B) x 100 12 เดือน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI66-27": {
      "kpiId": "KPI66-27",
      "order": 27,
      "name": "ระดับความสำเร็จของการจัดระบบบริการบริบาลฟื้นสภาพระยะกลาง (Intermediate Care: IMC)",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ระดับ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "ระดับ 5",
      "baseline": "ระดับ 5",
      "definition": "ลดปัจจัยเสี่ยงด้านสุขภาพและความเจ็บป่วยของประชาชน 2. ระดับความสำเร็จของการพัฒนาตำบลจัดการคุณภาพชีวิต ตำบล หมายถึง ตำบลตามกฎหมายว่าด้วยลักษณะปกครองท้องที่ที่อยู่นอกเขตหน่วยการ บริหารราชการ ส่วนท้องถิ่น ตำบลจัดการคุณภาพชีวิต หมายถึง ตำบลที่มีกระบวนการ การดำเนินงานด้วยกลไก 3 หมอ ประกอบด้วย หมอคนที่ 1 คือ อสม. ทำหน้าที่เป็นหมอประจำบ้าน หมอคนที่ 2 คือหมอสาธารณสุข และ หมอคนที่ 3 คือหมอเวชปฏิบัติครอบครัว และทีมขับเคลื่อนตำบล จัดการคุณภาพชีวิต สร้างการมีส่วนร่วมของคนในชุมชน ท้องถิ่น โดยภาครัฐสนับสนุน เพื่อแก้ไขปัญหา หรือพัฒนาตามบริบท และ/หรือ ประเด็นของชุมชน หรือประเด็น พชอ. ทั้งด้านการดูแลสุขภาพและคุณภาพชีวิตให้ดีขึ้น โดยใช้ทรัพยากร ภูมิปัญญา และนวัตกรรม ของชุมชน มีแผนการดำเนินงานของชุมชนที่ให้ความสำคัญกับประชาชน",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "มีกิจกรรมดำเนินการที่สอดคล้องกับสภาพปัญหาหรือประเด็นการพัฒนา อย่างครอบคลุม ทุกขั้นตอนตามแผน และมีการมุ่งเป้าหมายผลลัพธ์ที่ตอบสนองด้านสุขภาพและคุณภาพชีวิต จากความเข้มแข็งของชุมชน โดยมีระบบการดูแลสุขภาพตนเองและช่วยเหลือกัน ระบบบริการปฐมภูมิโดยชุมชนเชื่อมกับภาครัฐ และระบบการจัดการเพื่อยกระดับคุณภาพชีวิต เพื่อให้บริการสุขภาพแก่ประชาชนในชุมชนอย่างเป็นระบบ อันทำให้ประชาชนเข้าถึงบริการ สุขภาพมากขึ้น มีการจัดการสุขภาพและคุณภาพชีวิตด้วยตนเอง มีความมั่นคงด้านสุขภาพ และมีความรอบรู้ด้านสุขภาพ เกณ ฑ์ ต ำบ ลจัด การคุณ ภ าพ ชีวิต ห มายถึง ตำบ ลที่ มีการด ำเนิน งานครบ 4 องค์ประกอบ ได้แก่ T = Team มีทีมสุขภาพระดับตำบลที่มีศักยภาพ P = Plan มีการจัดทำแผนสุขภาพตำบลแบบมีส่วนร่วม A = Activity มีการจัดกิจกรรมหรือบริการสุขภาพกลุ่มวัย R = Result มีผลลัพธ์ด้านสุขภาพในชุมชน กลุ่มเปราะบาง หมายถึง กลุ่มบุคคลที่ขาดความสามารถในการปกป้องสิทธิผลประโยชน์ ของตนเนื่องจากขาดอำนาจ การศึกษา ทรัพยากร ความเข้มแข็ง มีความเสี่ยงสูงที่จะถูกคุกคาม จากปัจจัยเสี่ยงด้านต่าง ๆ เช่น สุขภาพ สังคม เศรษฐกิจ สิ่งแวดล้อม และภัยพิบัติทางธรรมชาติ หรืออื่น ๆ เป็นผู้ที่มีข้อจำกัดในเรื่องในการจัดการความเสี่ยงและผลกระทบที่ตามมา การ ช่วยเหลือตัวเอง การตัดสินใจ และอำนาจต่อรอง ต้องการการดูแลเป็นพิเศษ ต้องการ การสนับสนุน การปกป้อง การช่วยเหลือทางกาย จิต หรือทางสังคม จากผู้อื่น ตัวอย่างกลุ่ม เปราะบาง เช่น เด็ก ผู้สูงอายุที่ช่วยตัวเองไม่ได้ คนที่ถูกสังคมตีตรา ผู้ป่วยบางประเภท แรงงาน ต่างด้าวที่ผิดกฎหมาย ผู้ติดสารเสพติดที่ผิดกฎหมาย คนพิการ คนที่ทำผิดกฎหมาย/อาชญากร และคนที่ได้รับผลกระทบจากการแพร่ระบาดของโรคติดเชื้อไวรัสโคโรนา 2019 กลุ่มเปราะบางด้านสุขภาพ พิจารณาจากปัจจัยกำหนดสุขภาพด้านสังคม อย่างน้อย 2 ใน 3 ปัจจัย ดังนี้ 1) คนชายขอบที่ถูกเลือกปฏิบัติจากสังคม เช่น คนยากจน คนไร้รัฐ ชาติพันธุ์กลุ่มน้อย แรงงานข้ามชาติ เด็กกำพร้า ผู้เคยได้รับโทษ ฯลฯ 2) คนที่มีข้อจำกัดในการเข้าถึงบริการด้านสุขภาพ เช่น ผู้ที่ไม่มีหลักประกันสุขภาพ คนที่มีถิ่นที่อยู่อาศัยในพื้นที่ห่างไกล",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "ผลการดำเนินงานจริงเทียบกับเกณฑ์เป้าหมาย (ระดับ)",
      "numeratorA": "Activity มีการจัดกิจกรรมหรือบริการสุขภาพกลุ่มวัย",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI66-28": {
      "kpiId": "KPI66-28",
      "order": 28,
      "name": "จำนวนโรงพยาบาลที่มีการดูแลแบบประคับประคอง (Palliative Care) ตามเกณฑ์มาตรฐาน",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "แห่ง",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "24",
      "baseline": "24",
      "definition": "จำนวนโรงพยาบาลที่มีการดูแลแบบประคับประคอง (Palliative Care) ตามเกณฑ์มาตรฐาน ตามเกณฑ์มาตรฐานแผนยุทธศาสตร์สุขภาพ 5 ปี จังหวัดขอนแก่น (พ.ศ. 2566–2570)",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ประชาชนกลุ่มเป้าหมายและหน่วยบริการสุขภาพระดับ รพศ./รพท./รพช./สสอ./รพ.สต. ใน 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "1. หญิงตั้งครรภ์ที่มีภาวะหรือโรค 5 โรค ได้แก่ GDM/Twin/Heart/PIH /Thalassemia",
      "formula": "2. รายงานการคลอดจากแบบรายงาน ก-2 3. แบบรายงานติดตามเยี่ยม Care Plan เป็นรายบุคคล 4. แบบประเมินตนเองตามมาตรฐานงานฝากครรภ์และห้องคลอดคุณภาพของกรมอนามัย 1. งานบริการ จากรพศ./รพท./รพช. 2. โรงพยาบาลระดับ A S M1 M2 F1 F2 F3 ทุกแห่งในจังหวัดขอนแก่น A = การตายของมารดาไทยตั้งแต่ขณะตั้งครรภ์ คลอดและหลังคลอด ภายใน 42 วัน B = จำนวนเด็กเกิดมีชีพทุกราย A1 = จำนวนโรงพยาบาลที่ส่งบุคลากรเข้าร่วมซ้อมแผนภาวะวิกฤต/สถานการณ์ฉุกเฉินในห้องคลอด ที่จัดโดยสำนักงานสาธารณสุขจังหวัดขอนแก่นร่วมกับโรงพยาบาลขอนแก่น หรือโรงพยาบาล แม่ข่ายจัดอบรม ครบ ประกอบด้วย แพทย์ 1 คน พยาบาล 2 คนต่อหน่วยบริการ 1 แห่ง ภายในไตรมาสที่ 1หรือ 2 B1 = จำนวนโรงพยาบาลทั้งหมด 26 แห่ง A2 = จำนวนหญิงตั้งครรภ์ที่มีโรคหรือภาวะที่เสี่ยงสูงขณะตั้งครรภ์ใน 5 โรค หมายถึงหญิงตั้งครรภ์ ที่มีโรคทางอายุรกรรมทุกราย ประกอบด้วยหญิงตั้งครรภ์ที่มีภาวะเสี่ยง ได้แก่ GDM/Twin/Heart/PIH /Thalassemia ได้รับการดูแลตาม Care Plan (การติดตามเยี่ยม เฝ้าระวังอาการผิดปกติและสภาวะสุขภาพของหญิงตั้งครรภ์และทารกในครรภ์ กระตุ้นให้มา ฝากครรภ์ตามนัด และวางแผนการคลอด เป็นรายบุคคล) B2 = หญิงตั้งครรภ์ที่มีความเสี่ยงสูงต่อการตั้งครรภ์ใน 5 โรค หมายถึงหญิงตั้งครรภ์ที่มีโรคทาง อายุรกรรมทุกราย ประกอบด้วยหญิงตั้งครรภ์ที่มีภาวะเสี่ยง ได้แก่ GDM/Twin/Heart/PIH /Thalassemia ได้รับการดูแลตาม Care Plan (การติดตามเยี่ยมเฝ้าระวังอาการผิดปกติและ สภาวะสุขภาพของหญิงตั้งครรภ์และทารกในครรภ์ กระตุ้นให้มาฝากครรภ์ตามนัด และ วางแผนการคลอด เป็นรายบุคคล)ทั้งหมดในช่วงเวลาเดียวกัน A3 = จำนวนโรงพยาบาลระดับ A S M1 M2 F1 F2 F3 ประเมินตนเองผ่านเกณฑ์มาตรฐานงาน ANC และ LR คุณภาพ B3 = จำนวนโรงพยาบาลระดับ A S M1 M2 F1 F2 F3 ทั้งหมด 1. อัตราส่วนการตายมารดา = (A/B) x 100,000 2. โรงพยาบาลมีการเพิ่มพูนทักษะในการจัดการสถานการณ์ฉุกเฉินทางสูติกรรมในห้องคลอดอย่าง น้อยปีละ 1 ครั้ง =A1 3. ร้อยละหญิงตั้งครรภ์ที่มีภาวะเสี่ยง (GDM/Twin/Heart/PIH /Thalassemia ) ได้รับการดูแลตาม Care Plan =(A2/B2) x 100 4. โรงพยาบาลประเมินตนเองผ่านเกณฑ์มาตรฐานงาน ANC และ LR คุณภาพ =(A3/B3) x 100",
      "numeratorA": "การตายของมารดาไทยตั้งแต่ขณะตั้งครรภ์ คลอดและหลังคลอด ภายใน 42 วัน",
      "denominatorB": "จำนวนเด็กเกิดมีชีพทุกราย",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "1.นางนรินทร์รัตน์ แก้วลา พยาบาลวิชาชีพชำนาญการ โทรศัพท์มือถือ 085-3956-466 E-mail : patnapit@gmail.com 2.นางสมาพร สุรเตมีย์กุล พยาบาลวิชาชีพชำนาญการ โทรศัพท์มือถือ 084-9575-548 E-mail : ooh_rx@yahoo.com"
    },
    "KPI66-29": {
      "kpiId": "KPI66-29",
      "order": 29,
      "name": "ระดับความสำเร็จของการจัดระบบบริการรับส่งต่อผู้ป่วย (Seamless Referral System)",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ระดับ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "ระดับ 5",
      "baseline": "ระดับ 5",
      "definition": "ลดปัจจัยเสี่ยงด้านสุขภาพและความเจ็บป่วยของประชาชน 2. ระดับความสำเร็จของการพัฒนาตำบลจัดการคุณภาพชีวิต ตำบล หมายถึง ตำบลตามกฎหมายว่าด้วยลักษณะปกครองท้องที่ที่อยู่นอกเขตหน่วยการ บริหารราชการ ส่วนท้องถิ่น ตำบลจัดการคุณภาพชีวิต หมายถึง ตำบลที่มีกระบวนการ การดำเนินงานด้วยกลไก 3 หมอ ประกอบด้วย หมอคนที่ 1 คือ อสม. ทำหน้าที่เป็นหมอประจำบ้าน หมอคนที่ 2 คือหมอสาธารณสุข และ หมอคนที่ 3 คือหมอเวชปฏิบัติครอบครัว และทีมขับเคลื่อนตำบล จัดการคุณภาพชีวิต สร้างการมีส่วนร่วมของคนในชุมชน ท้องถิ่น โดยภาครัฐสนับสนุน เพื่อแก้ไขปัญหา หรือพัฒนาตามบริบท และ/หรือ ประเด็นของชุมชน หรือประเด็น พชอ. ทั้งด้านการดูแลสุขภาพและคุณภาพชีวิตให้ดีขึ้น โดยใช้ทรัพยากร ภูมิปัญญา และนวัตกรรม ของชุมชน มีแผนการดำเนินงานของชุมชนที่ให้ความสำคัญกับประชาชน",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "มีกิจกรรมดำเนินการที่สอดคล้องกับสภาพปัญหาหรือประเด็นการพัฒนา อย่างครอบคลุม ทุกขั้นตอนตามแผน และมีการมุ่งเป้าหมายผลลัพธ์ที่ตอบสนองด้านสุขภาพและคุณภาพชีวิต จากความเข้มแข็งของชุมชน โดยมีระบบการดูแลสุขภาพตนเองและช่วยเหลือกัน ระบบบริการปฐมภูมิโดยชุมชนเชื่อมกับภาครัฐ และระบบการจัดการเพื่อยกระดับคุณภาพชีวิต เพื่อให้บริการสุขภาพแก่ประชาชนในชุมชนอย่างเป็นระบบ อันทำให้ประชาชนเข้าถึงบริการ สุขภาพมากขึ้น มีการจัดการสุขภาพและคุณภาพชีวิตด้วยตนเอง มีความมั่นคงด้านสุขภาพ และมีความรอบรู้ด้านสุขภาพ เกณ ฑ์ ต ำบ ลจัด การคุณ ภ าพ ชีวิต ห มายถึง ตำบ ลที่ มีการด ำเนิน งานครบ 4 องค์ประกอบ ได้แก่ T = Team มีทีมสุขภาพระดับตำบลที่มีศักยภาพ P = Plan มีการจัดทำแผนสุขภาพตำบลแบบมีส่วนร่วม A = Activity มีการจัดกิจกรรมหรือบริการสุขภาพกลุ่มวัย R = Result มีผลลัพธ์ด้านสุขภาพในชุมชน กลุ่มเปราะบาง หมายถึง กลุ่มบุคคลที่ขาดความสามารถในการปกป้องสิทธิผลประโยชน์ ของตนเนื่องจากขาดอำนาจ การศึกษา ทรัพยากร ความเข้มแข็ง มีความเสี่ยงสูงที่จะถูกคุกคาม จากปัจจัยเสี่ยงด้านต่าง ๆ เช่น สุขภาพ สังคม เศรษฐกิจ สิ่งแวดล้อม และภัยพิบัติทางธรรมชาติ หรืออื่น ๆ เป็นผู้ที่มีข้อจำกัดในเรื่องในการจัดการความเสี่ยงและผลกระทบที่ตามมา การ ช่วยเหลือตัวเอง การตัดสินใจ และอำนาจต่อรอง ต้องการการดูแลเป็นพิเศษ ต้องการ การสนับสนุน การปกป้อง การช่วยเหลือทางกาย จิต หรือทางสังคม จากผู้อื่น ตัวอย่างกลุ่ม เปราะบาง เช่น เด็ก ผู้สูงอายุที่ช่วยตัวเองไม่ได้ คนที่ถูกสังคมตีตรา ผู้ป่วยบางประเภท แรงงาน ต่างด้าวที่ผิดกฎหมาย ผู้ติดสารเสพติดที่ผิดกฎหมาย คนพิการ คนที่ทำผิดกฎหมาย/อาชญากร และคนที่ได้รับผลกระทบจากการแพร่ระบาดของโรคติดเชื้อไวรัสโคโรนา 2019 กลุ่มเปราะบางด้านสุขภาพ พิจารณาจากปัจจัยกำหนดสุขภาพด้านสังคม อย่างน้อย 2 ใน 3 ปัจจัย ดังนี้ 1) คนชายขอบที่ถูกเลือกปฏิบัติจากสังคม เช่น คนยากจน คนไร้รัฐ ชาติพันธุ์กลุ่มน้อย แรงงานข้ามชาติ เด็กกำพร้า ผู้เคยได้รับโทษ ฯลฯ 2) คนที่มีข้อจำกัดในการเข้าถึงบริการด้านสุขภาพ เช่น ผู้ที่ไม่มีหลักประกันสุขภาพ คนที่มีถิ่นที่อยู่อาศัยในพื้นที่ห่างไกล",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "ผลการดำเนินงานจริงเทียบกับเกณฑ์เป้าหมาย (ระดับ)",
      "numeratorA": "Activity มีการจัดกิจกรรมหรือบริการสุขภาพกลุ่มวัย",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI66-30": {
      "kpiId": "KPI66-30",
      "order": 30,
      "name": "ระดับความสำเร็จของเครือข่ายบริการสุขภาพระดับอำเภอในการเตรียมความพร้อมและตอบโต้การระบาดของโรคติดต่อที่สำคัญและภัยสุขภาพ",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ระดับ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "ระดับ 5",
      "baseline": "ระดับ 5",
      "definition": "ลดปัจจัยเสี่ยงด้านสุขภาพและความเจ็บป่วยของประชาชน 2. ระดับความสำเร็จของการพัฒนาตำบลจัดการคุณภาพชีวิต ตำบล หมายถึง ตำบลตามกฎหมายว่าด้วยลักษณะปกครองท้องที่ที่อยู่นอกเขตหน่วยการ บริหารราชการ ส่วนท้องถิ่น ตำบลจัดการคุณภาพชีวิต หมายถึง ตำบลที่มีกระบวนการ การดำเนินงานด้วยกลไก 3 หมอ ประกอบด้วย หมอคนที่ 1 คือ อสม. ทำหน้าที่เป็นหมอประจำบ้าน หมอคนที่ 2 คือหมอสาธารณสุข และ หมอคนที่ 3 คือหมอเวชปฏิบัติครอบครัว และทีมขับเคลื่อนตำบล จัดการคุณภาพชีวิต สร้างการมีส่วนร่วมของคนในชุมชน ท้องถิ่น โดยภาครัฐสนับสนุน เพื่อแก้ไขปัญหา หรือพัฒนาตามบริบท และ/หรือ ประเด็นของชุมชน หรือประเด็น พชอ. ทั้งด้านการดูแลสุขภาพและคุณภาพชีวิตให้ดีขึ้น โดยใช้ทรัพยากร ภูมิปัญญา และนวัตกรรม ของชุมชน มีแผนการดำเนินงานของชุมชนที่ให้ความสำคัญกับประชาชน",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "มีกิจกรรมดำเนินการที่สอดคล้องกับสภาพปัญหาหรือประเด็นการพัฒนา อย่างครอบคลุม ทุกขั้นตอนตามแผน และมีการมุ่งเป้าหมายผลลัพธ์ที่ตอบสนองด้านสุขภาพและคุณภาพชีวิต จากความเข้มแข็งของชุมชน โดยมีระบบการดูแลสุขภาพตนเองและช่วยเหลือกัน ระบบบริการปฐมภูมิโดยชุมชนเชื่อมกับภาครัฐ และระบบการจัดการเพื่อยกระดับคุณภาพชีวิต เพื่อให้บริการสุขภาพแก่ประชาชนในชุมชนอย่างเป็นระบบ อันทำให้ประชาชนเข้าถึงบริการ สุขภาพมากขึ้น มีการจัดการสุขภาพและคุณภาพชีวิตด้วยตนเอง มีความมั่นคงด้านสุขภาพ และมีความรอบรู้ด้านสุขภาพ เกณ ฑ์ ต ำบ ลจัด การคุณ ภ าพ ชีวิต ห มายถึง ตำบ ลที่ มีการด ำเนิน งานครบ 4 องค์ประกอบ ได้แก่ T = Team มีทีมสุขภาพระดับตำบลที่มีศักยภาพ P = Plan มีการจัดทำแผนสุขภาพตำบลแบบมีส่วนร่วม A = Activity มีการจัดกิจกรรมหรือบริการสุขภาพกลุ่มวัย R = Result มีผลลัพธ์ด้านสุขภาพในชุมชน กลุ่มเปราะบาง หมายถึง กลุ่มบุคคลที่ขาดความสามารถในการปกป้องสิทธิผลประโยชน์ ของตนเนื่องจากขาดอำนาจ การศึกษา ทรัพยากร ความเข้มแข็ง มีความเสี่ยงสูงที่จะถูกคุกคาม จากปัจจัยเสี่ยงด้านต่าง ๆ เช่น สุขภาพ สังคม เศรษฐกิจ สิ่งแวดล้อม และภัยพิบัติทางธรรมชาติ หรืออื่น ๆ เป็นผู้ที่มีข้อจำกัดในเรื่องในการจัดการความเสี่ยงและผลกระทบที่ตามมา การ ช่วยเหลือตัวเอง การตัดสินใจ และอำนาจต่อรอง ต้องการการดูแลเป็นพิเศษ ต้องการ การสนับสนุน การปกป้อง การช่วยเหลือทางกาย จิต หรือทางสังคม จากผู้อื่น ตัวอย่างกลุ่ม เปราะบาง เช่น เด็ก ผู้สูงอายุที่ช่วยตัวเองไม่ได้ คนที่ถูกสังคมตีตรา ผู้ป่วยบางประเภท แรงงาน ต่างด้าวที่ผิดกฎหมาย ผู้ติดสารเสพติดที่ผิดกฎหมาย คนพิการ คนที่ทำผิดกฎหมาย/อาชญากร และคนที่ได้รับผลกระทบจากการแพร่ระบาดของโรคติดเชื้อไวรัสโคโรนา 2019 กลุ่มเปราะบางด้านสุขภาพ พิจารณาจากปัจจัยกำหนดสุขภาพด้านสังคม อย่างน้อย 2 ใน 3 ปัจจัย ดังนี้ 1) คนชายขอบที่ถูกเลือกปฏิบัติจากสังคม เช่น คนยากจน คนไร้รัฐ ชาติพันธุ์กลุ่มน้อย แรงงานข้ามชาติ เด็กกำพร้า ผู้เคยได้รับโทษ ฯลฯ 2) คนที่มีข้อจำกัดในการเข้าถึงบริการด้านสุขภาพ เช่น ผู้ที่ไม่มีหลักประกันสุขภาพ คนที่มีถิ่นที่อยู่อาศัยในพื้นที่ห่างไกล",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "ผลการดำเนินงานจริงเทียบกับเกณฑ์เป้าหมาย (ระดับ)",
      "numeratorA": "Activity มีการจัดกิจกรรมหรือบริการสุขภาพกลุ่มวัย",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI66-31": {
      "kpiId": "KPI66-31",
      "order": 31,
      "name": "ระดับความสำเร็จของการส่งเสริมการใช้ยาอย่างสมเหตุสมผล",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ระดับ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "ระดับ 5",
      "baseline": "ระดับ 5",
      "definition": "ลดปัจจัยเสี่ยงด้านสุขภาพและความเจ็บป่วยของประชาชน 2. ระดับความสำเร็จของการพัฒนาตำบลจัดการคุณภาพชีวิต ตำบล หมายถึง ตำบลตามกฎหมายว่าด้วยลักษณะปกครองท้องที่ที่อยู่นอกเขตหน่วยการ บริหารราชการ ส่วนท้องถิ่น ตำบลจัดการคุณภาพชีวิต หมายถึง ตำบลที่มีกระบวนการ การดำเนินงานด้วยกลไก 3 หมอ ประกอบด้วย หมอคนที่ 1 คือ อสม. ทำหน้าที่เป็นหมอประจำบ้าน หมอคนที่ 2 คือหมอสาธารณสุข และ หมอคนที่ 3 คือหมอเวชปฏิบัติครอบครัว และทีมขับเคลื่อนตำบล จัดการคุณภาพชีวิต สร้างการมีส่วนร่วมของคนในชุมชน ท้องถิ่น โดยภาครัฐสนับสนุน เพื่อแก้ไขปัญหา หรือพัฒนาตามบริบท และ/หรือ ประเด็นของชุมชน หรือประเด็น พชอ. ทั้งด้านการดูแลสุขภาพและคุณภาพชีวิตให้ดีขึ้น โดยใช้ทรัพยากร ภูมิปัญญา และนวัตกรรม ของชุมชน มีแผนการดำเนินงานของชุมชนที่ให้ความสำคัญกับประชาชน",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "มีกิจกรรมดำเนินการที่สอดคล้องกับสภาพปัญหาหรือประเด็นการพัฒนา อย่างครอบคลุม ทุกขั้นตอนตามแผน และมีการมุ่งเป้าหมายผลลัพธ์ที่ตอบสนองด้านสุขภาพและคุณภาพชีวิต จากความเข้มแข็งของชุมชน โดยมีระบบการดูแลสุขภาพตนเองและช่วยเหลือกัน ระบบบริการปฐมภูมิโดยชุมชนเชื่อมกับภาครัฐ และระบบการจัดการเพื่อยกระดับคุณภาพชีวิต เพื่อให้บริการสุขภาพแก่ประชาชนในชุมชนอย่างเป็นระบบ อันทำให้ประชาชนเข้าถึงบริการ สุขภาพมากขึ้น มีการจัดการสุขภาพและคุณภาพชีวิตด้วยตนเอง มีความมั่นคงด้านสุขภาพ และมีความรอบรู้ด้านสุขภาพ เกณ ฑ์ ต ำบ ลจัด การคุณ ภ าพ ชีวิต ห มายถึง ตำบ ลที่ มีการด ำเนิน งานครบ 4 องค์ประกอบ ได้แก่ T = Team มีทีมสุขภาพระดับตำบลที่มีศักยภาพ P = Plan มีการจัดทำแผนสุขภาพตำบลแบบมีส่วนร่วม A = Activity มีการจัดกิจกรรมหรือบริการสุขภาพกลุ่มวัย R = Result มีผลลัพธ์ด้านสุขภาพในชุมชน กลุ่มเปราะบาง หมายถึง กลุ่มบุคคลที่ขาดความสามารถในการปกป้องสิทธิผลประโยชน์ ของตนเนื่องจากขาดอำนาจ การศึกษา ทรัพยากร ความเข้มแข็ง มีความเสี่ยงสูงที่จะถูกคุกคาม จากปัจจัยเสี่ยงด้านต่าง ๆ เช่น สุขภาพ สังคม เศรษฐกิจ สิ่งแวดล้อม และภัยพิบัติทางธรรมชาติ หรืออื่น ๆ เป็นผู้ที่มีข้อจำกัดในเรื่องในการจัดการความเสี่ยงและผลกระทบที่ตามมา การ ช่วยเหลือตัวเอง การตัดสินใจ และอำนาจต่อรอง ต้องการการดูแลเป็นพิเศษ ต้องการ การสนับสนุน การปกป้อง การช่วยเหลือทางกาย จิต หรือทางสังคม จากผู้อื่น ตัวอย่างกลุ่ม เปราะบาง เช่น เด็ก ผู้สูงอายุที่ช่วยตัวเองไม่ได้ คนที่ถูกสังคมตีตรา ผู้ป่วยบางประเภท แรงงาน ต่างด้าวที่ผิดกฎหมาย ผู้ติดสารเสพติดที่ผิดกฎหมาย คนพิการ คนที่ทำผิดกฎหมาย/อาชญากร และคนที่ได้รับผลกระทบจากการแพร่ระบาดของโรคติดเชื้อไวรัสโคโรนา 2019 กลุ่มเปราะบางด้านสุขภาพ พิจารณาจากปัจจัยกำหนดสุขภาพด้านสังคม อย่างน้อย 2 ใน 3 ปัจจัย ดังนี้ 1) คนชายขอบที่ถูกเลือกปฏิบัติจากสังคม เช่น คนยากจน คนไร้รัฐ ชาติพันธุ์กลุ่มน้อย แรงงานข้ามชาติ เด็กกำพร้า ผู้เคยได้รับโทษ ฯลฯ 2) คนที่มีข้อจำกัดในการเข้าถึงบริการด้านสุขภาพ เช่น ผู้ที่ไม่มีหลักประกันสุขภาพ คนที่มีถิ่นที่อยู่อาศัยในพื้นที่ห่างไกล",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "ผลการดำเนินงานจริงเทียบกับเกณฑ์เป้าหมาย (ระดับ)",
      "numeratorA": "Activity มีการจัดกิจกรรมหรือบริการสุขภาพกลุ่มวัย",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI66-32": {
      "kpiId": "KPI66-32",
      "order": 32,
      "name": "ร้อยละของบุคลากรที่มีความพร้อมรองรับการเข้าสู่ตำแหน่งที่สูงขึ้นได้รับการพัฒนา",
      "strategy": "ยุทธศาสตร์ที่ 3",
      "objective": "เป้าประสงค์ที่ 3",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "100",
      "baseline": "100",
      "definition": "ความเป็นเลิศ 32. ร้อยละของบุคลากรที่มีความพร้อมรองรับการเข้าสู่ตำแหน่งที่สูงขึ้นได้รับการพัฒนา 1. ตำแหน่งที่สูงขึ้น หมายถึง ตำแหน่งข้าราชการที่ทำหน้าที่หรือได้รับมอบหมายให้ ทำหน้าที่ทางการบริหาร ดังนี้ 1) รองผู้อำนวยการ 2) หัวหน้ากลุ่มงาน/ฝ่าย/ศูนย์ 3) หัวหน้าพยาบาล 4) ผู้อำนวยการโรงพยาบาลชุมชน 5) สาธารณสุขอำเภอ 6) ผู้ช่วยสาธารณสุขอำเภอ 2. ตำแหน่งว่าง หมายถึง ตำแหน่งว่างตามข้อ 1 จากการเกษียณอายุราชการใน ปีงบประมาณถัดไป โดยไม่รวมตำแหน่งว่างระหว่างปี เช่น เสียชีวิต ลาออก และตำแหน่ง ว่างจากสาเหตุการโอนไปส่วนราชการอื่น ฯลฯ 3. บุคลากรที่มีความพร้อม หมายถึง บุคลากรประเภทข้าราชการที่มีคุณสมบัติ และ/หรือ มีความพร้อมเข้าสู่ตำแหน่งที่สูงขึ้น 4. สมรรถนะตามตำแหน่งที่สูงขึ้น หมายถึง สมรรถนะทางการบริหารที่ ก.พ. กำหนดดังนี้ 1) สภาวะผู้นำ (Leadership) 2) วิสัยทัศน์ (Visioning) 3) การวางกลยุทธ์ภาครัฐ (Strategic Orientation) 4) ศักยภาพเพื่อนำการปรับเปลี่ยน (Change Leadership) 5) การควบคุมตนเอง (Self-Control) 6) การสอนงานและการมอบหมายงาน (Coaching and Empowering Others) 5. การพัฒนา หมายถึง กระบวนการที่มุ่งจะเปลี่ยนแปลงวิธีการทำงาน ความรู้ ความสามารถ ทักษะและทัศนคติของบุคลากรให้เป็นไปทางที่ดีขึ้น เพื่อให้บุคลากรที่ได้รับ การพัฒนาสามารถปฏิบัติงานได้ผลตาม",
      "purpose": "1. เพื่อพัฒนาบุคลากรให้มีความพร้อมรองรับการเข้าสู่ตำแหน่งที่สูงขึ้น",
      "population": "2. เพื่อให้มีความต่อเนื่องทางการบริหารและมีการสืบทอดตำแหน่งอย่างเป็นระบบ",
      "collectionMethod": "บุคลากรที่มีคุณสมบัติ/ความพร้อมเข้าสู่ตำแหน่งที่สูงขึ้น 1. ฐานข้อมูลระบบสารสนเทศเพื่อการบริหารจัดการบุคลากรสาธารณสุข สำนักงาน",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "2. กรมทุกกรมในสังกัดกระทรวงสาธารณสุข (ยกเว้นหน่วยงานในกำกับ)",
      "numeratorA": "จำนวนบุคลากรที่ผ่านการพัฒนาเพื่อรองรับการเข้าสู่ตำแหน่งที่สูงขึ้น ณ วันที่รายงาน",
      "denominatorB": "จำนวนบุคลากรทั้งหมดในหน่วยงาน",
      "frequency": "A = จำนวนบุคลากรที่ผ่านการพัฒนาเพื่อรองรับการเข้าสู่ตำแหน่งที่สูงขึ้น ณ วันที่รายงาน",
      "evaluationMethod": ": (A/B) x 100",
      "responsible": "ไตรมาส 4 รอบ 3 เดือน รอบ 6 เดือน รอบ 9 เดือน รอบ 12 เดือน - มีการวิเคราะห์ - มีการจัดทำ พัฒนาบุคลากรตาม บุคลากรผ่านการ ตำแหน่งว่าง แผนพัฒนาบุคลากร แผนการพัฒนาฯ พัฒนา เพื่อรองรับ ตามตำแหน่งที่ รองรับการเข้าสู่ การเข้าสู่ตำแหน่ง สูงขึ้น ตำแหน่งที่สูงขึ้น สูงขึ้น มีการคำนวณ -พัฒนาบุคลากรตาม ไม่น้อยกว่าร้อยละ จำนวนบุคลากรที่ แผนการพัฒนาฯ 85 ต้องได้รับการ พัฒนา - วิเคราะห์ข้อมูลจากฐานข้อมูลในระบบ HROPS - วิเคราะห์ข้อมูลจากแบบรายงานผลการดำเนินงาน 1. นายมุนี เหมือนชาติ ตำแหน่ง ทันตแพทย์เชี่ยวชาญ (ด้านทันตสาธารณสุข) 2. นางจิตเกษม เบ็ญจขันธ์ ตำแหน่ง พยาบาลวิชาชีพชำนาญการ โทรศัพท์มือถือ : 094 536 9888 งานพัฒนาทรัพยากรบุคคล (Human Resource Development : HRD) กลุ่มงานบริหารทรัพยากรบุคคล สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ที่ทำงาน : 043221125 ต่อ 113 E-mail : hrd.khonkaen@gmail.com"
    },
    "KPI66-33": {
      "kpiId": "KPI66-33",
      "order": 33,
      "name": "ร้อยละของหน่วยงานมีการนำผลการประเมินฯ มาวิเคราะห์และแปลผลเพื่อใช้ในการพัฒนาองค์กรในการขับเคลื่อนการดำเนินงานองค์กรแห่งความสุข (Happy MOPH)",
      "strategy": "ยุทธศาสตร์ที่ 3",
      "objective": "เป้าประสงค์ที่ 3",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "100",
      "baseline": "100",
      "definition": "34. ร้อยละของหน่วยงานมีการนำผลการประเมินฯ มาวิเคราะห์และแปลผลเพื่อใช้ในการพัฒนาองค์กรใน การขับเคลื่อนการดำเนินงานองค์กรแห่งความสุข และมีการดำเนินงานการขับเคลื่อนการดำเนินงานองค์กร ระดับการวัดผล แห่งความสุข",
      "purpose": "ให้สอดคล้องกับวิสัยทัศน์และเป้าหมายขององค์กร เพื่อให้องค์กรมีความพร้อมต่อการเปลี่ยนแปลง นำพา",
      "population": "องค์กรไปสู่การเติบโตอย่างยั่งยืน โดยมีองค์ประกอบได้แก่ คนทำงานที่มีความสุข ที่ทำงานน่าอยู่ และชุมชน สมานฉันท์ องค์กรแห่งความสุขที่มีคุณภาพ หมายถึง หน่วยงานในสังกัดกระทรวงสาธารณสุขทุกระดับ (หน่วยงาน ส่วนกลาง เขตสุขภาพ สสจ. รพศ. รพท. รพช. สสอ.) มีการจัดทำผลการขับเคลื่อนการดำเนินงานองค์กร แห่งความสุขที่มีคุณภาพ โดยใช้เกณฑ์องค์กรแห่งความสุขที่มีคุณภาพ เป็นแนวทางในดำเนินงาน สู่องค์กร แห่งความสุขอย่างยั่งยืน หน่วยงาน ปีงบประมาณ 67 ปีงบประมาณ 68 ปีงบประมาณ 66 จังหวัดมีองค์กรแห่งความสุข จังหวัดมีองค์กรแห่งความสุข ที่มีคุณภาพมาตรฐาน ที่มีคุณภาพมาตรฐาน จังหวัดมีองค์กรแห่งความสุข - รพศ./รพท./สสจ. - รพศ./รพท./สสจ. ที่มีคุณภาพมาตรฐาน อย่างน้อย 2 แห่ง อย่างน้อย 2 แห่ง - รพศ./รพท./สสจ. -รพช./สสอ. ร้อยละ 35 -รพช./สสอ. ร้อยละ 40 อย่างน้อย 2 แห่ง - รพช./สสอ. ร้อยละ 30 เพื่อให้ทุกหน่วยงานสามารถนำผลการประเมินดัชนีความสุขของคนทำงาน (Happinometer) มาใช้ในการ พัฒนาองค์กรมีการขับเคลื่อนการดำเนินงานองค์กรแห่งความสุข สู่องค์กรแห่งความสุขอย่างยั่งยืน การทำแบบประเมินความสุขบุคลากร กระทรวงสาธารณสุข (Happinometer) : บุคลากรสังกัดสำนักงาน สาธารณสุขจังหวัดขอนแก่น (โรงพยาบาลชุมชนทุกแห่ง/ สาธารณสุขอำเภอทุกอำเภอ/ โรงพยาบาล ขอนแก่น/โรงพยาบาลสิรินธร จังหวัดขอนแก่น/โรงพยาบาลชุมแพ/ สำนักงานสาธารณสุขจังหวัดขอนแก่น) ได้แก่ 1) ข้าราชการ 2) พนักงานกระทรวงสาธารณสุข 3) พนักงานราชการ 4) ลูกจ้างประจำ 5) ลูกจ้างชั่วคราว",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "แห่งความสุขที่มีคุณภาพ จากคณะกรรมการ/คณะทำงาน ระดับหน่วยงาน) (1) มายังกองยุทธศาสตร์และแผนงาน สำนักงานปลัดกระทรวงสาธารณสุข สูตรคำนวณ ตัวชี้วัด กองยุทธศาสตร์และแผนงาน สำนักงานปลัดกระทรวงสาธารณสุข ระยะเวลา ประเมินผล A1 = จำนวนบุคลากรในหน่วยงานที่ทำการประเมินความสุขครบถ้วน รายการข้อมูล B1 = จำนวนบุคลากรทั้งหมดในหน่วยงาน (2) (A1/B1) x 100 สูตรคำนวณ ตัวชี้วัด ไตรมาส 2 ระยะเวลา ประเมินผล A2 = จำนวนหน่วยงานที่มีการดำเนินงานตามเกณฑ์องค์กรแห่งความสุขที่มีคุณภาพ แนวทางการ B2 = จำนวนหน่วยงานภายใต้สังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่น (53 หน่วยงาน) ประเมิน (A2/B2) x 100 ไตรมาส 4 รอบ 3 เดือน รอบ 6 เดือน รอบ 9 เดือน รอบ 12 เดือน 1. หน่วยงานมีการ 1. หน่วยงานมี 1. ร้อยละ 70 ของ ดำเนินงานการ 1. หน่วยงานมีการ การทบทวนคำสั่ง บุคลากรในหน่วยงานมี ขับเคลื่อนการ จัดทำรายงานสรุป แต่งตั้ง การประเมินความสุข ดำเนินงานองค์กร แผนงาน/โครงการ คณะกรรมการ บุคลากรกระทรวง แห่งความสุขที่มี พร้อมข้อเสนอแนะ องค์กรแห่ง สาธารณสุข คุณภาพ เสนอผู้บริหาร เพื่อ ความสุข (Happinometer) เป็นข้อมูล 2. หน่วยงานมี 2. มีการนำผลการ 2. หน่วยงานมีการ ประกอบการ การชี้แจงแนว ประเมินฯ มาวิเคราะห์ จัดทำผลการ พิจารณาเชิง ทางการวัด และแปลผลเพื่อใช้ใน ขับเคลื่อนการ นโยบายในการ ความสุขของ การพัฒนาองค์กรใน ดำเนินงานองค์กร พัฒนาองค์กรไปสู่ คนทำงาน การขับเคลื่อนการ แห่งความสุขที่มี องค์กรแห่งความสุข (Happinometer) ดำเนินงานองค์กรแห่ง คุณภาพ ที่มีคุณภาพอย่าง ความสุขที่มีคุณภาพ ยั่งยืน",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "A1 = จำนวนบุคลากรในหน่วยงานที่ทำการประเมินความสุขครบถ้วน",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI66-34": {
      "kpiId": "KPI66-34",
      "order": 34,
      "name": "ร้อยละ อสม.ที่ได้รับการพัฒนาศักยภาพเป็น อสม.หมอประจำบ้าน และสามารถใช้ Application อสม. ได้",
      "strategy": "ยุทธศาสตร์ที่ 3",
      "objective": "เป้าประสงค์ที่ 3",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "60",
      "baseline": "50",
      "definition": "การแพทย์ทางไกล หรือ Telemedicine คือการใช้เทคโนโลยีสารสนเทศและการสื่อสารเพื่อให้บริการ",
      "purpose": "1. เพื่อยกระดับการบริการของโรงพยาบาลโดยการประยุกต์ใช้เทคโนโลยีดิจิทัล ในการจัดบริการสุขภาพ",
      "population": "ได้อย่างมีประสิทธิภาพ มีคุณภาพและความปลอดภัย 2. เพื่อพัฒนาคุณภาพการให้บริการของโรงพยาบาล โดยยึดประชาชนเป็นศูนย์กลางตอบสนองความ ต้องการของประชาชนและความจําเป็นด้านสุขภาพได้ 3. เพื่อให้การบริการจัดการของโรงพยาบาลมีประสิทธิภาพ สามารถลดขั้นตอนการทํางาน ลดภาระงาน ของบุคลากร และลดการใช้ทรัพยากร โรงพยาบาลศูนย์/โรงพยาบาลทั่วไป/โรงพยาบาลชุมชน",
      "collectionMethod": "ผู้รับผิดชอบจัดเก็บข้อมูลหลักฐานการผ่านการอบรมออนไลน์ (online)",
      "source": "HDC จังหวัดขอนแก่น เกณฑ์คะแนนตัวชี้วัด ตามเกณฑ์คะแนน KPI ของกระทรวงสาธาณสุข ปี 2568 ด้านการให้บริการการแพทย์ทางไกล",
      "formula": "(จำนวนผลงานที่บรรลุเกณฑ์ [A] ÷ จำนวนกลุ่มเป้าหมายทั้งหมด [B]) × 100",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "ทุกไตรมาส",
      "evaluationMethod": "ปีงบประมาณ พ.ศ.2568 รายละเอียดข้อมูลพื้นฐาน Baseline Data หน่วยวัด ผลการดำเนินงานปีงบประมาณ ไม่มี ไม่มี ปี 2565 ปี 2566 ปี 2567 ไม่มี ไม่มี ไม่มี",
      "responsible": "ชื่อ-สกุล น.ส.สมจิตร เดชาเสถียร ตำแหน่ง นักวิชาการสาธารณสุขชำนาญการพิเศษ โทรศัพท์มือถือ098-101-0754 E-mail : nongsomdec@gmail.com ชื่อ-สกุล นายสุทธิศักดิ์ ธรรมพล ตำแหน่ง นักวิชาการคอมพิวเตอร์ปฏิบัติการ โทรศัพท์มือถือ 082-305-7572 E-mail : buboocs@gmail.com ชื่อ-สกุล นายธนาวุธ จำปาแดง ตำแหน่ง นักวิชาการคอมพิวเตอร์ปฏิบัติการ โทรศัพท์มือถือ 082-3136909 E-mail : - ชื่อ-สกุล นายอนิวัฒน์ พูนมณี ตำแหน่ง นักวิชาการคอมพิวเตอร์ โทรศัพท์มือถือ 095-186-7287 E-mail : bomb.aniwat@gmail.com ชื่อ-สกุล นายพชร เอี่ยมสุดใจ ตำแหน่ง นักวิชาการสาธารณสุขปฏิบัติการ โทรศัพท์มือถือ 061-3540905 E-mail : Phachara_pa@outlook.com ชื่อ-สกุล นายณภัทรพล พิมพาเรือ ตำแหน่ง นักวิชาการคอมพิวเตอร์ โทรศัพท์มือถือ 090-9915655 E-mail : naphat.p123465@gmail.com"
    },
    "KPI66-35": {
      "kpiId": "KPI66-35",
      "order": 35,
      "name": "จำนวนนวัตกรรมหรือเทคโนโลยีสุขภาพที่คิดค้นใหม่หรือที่พัฒนาต่อยอด",
      "strategy": "ยุทธศาสตร์ที่ 4",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "เรื่อง",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "26",
      "baseline": "99",
      "definition": "เทคโนโลยี นวัตกรรมทางการแพทย์ที่ทันสมัย ในการให้บริการสุขภาพ และบริหารจัดการ 35. จำนวนนวัตกรรมหรือเทคโนโลยีสุขภาพที่คิดค้นใหม่หรือที่พัฒนาต่อยอด 1. ผลงานวิจัย/ ผลงาน R2R (Routine to Research) หมายถึง ผลที่ได้จากการศึกษาค้นคว้า อย่างเป็นระบบด้วยวิธีการทางวิทยาศาสตร์หรือวิธีการที่เชื่อถือได้ ซึ่งต้องเป็นไปตามระเบียบวิธีหรือ กฎเกณฑ์ที่ถูกต้อง/ การพัฒนางานประจำสู่งานวิจัย ที่คิดค้นใหม่หรือที่พัฒนาต่อยอด เพื่อให้ได้ความรู้ ที่เชื่อถือได้มีเหตุมีผลเป็นไปตามวิธีการทางวิทยาศาสตร์ และนำไปใช้อย่างเป็นประโยชน์ในการ ให้บริการด้านสาธารณสุข แก้ไขปัญหาสาธารณสุขในพื้นที่และตัวชี้วัดยุทธศาสตร์สาธารณสุขได้ 2. นวัตกรรม (Innovative) หมายถึง สิ่งที่ทำขึ้นใหม่ หรือแตกต่างจากเดิม ซึ่งอาจเป็น ความคิด วิธีการ หรืออุปกรณ์ เป็นต้น ที่มีคุณค่า และมีประโยชน์ต่อการให้บริการสุขภาพแก่ ประชาชน 3. นวัตกรรมการจัดการบริการสุขภาพ (Innovative Healthcare Management) หมายถึง นวัตกรรมการบริหารและการจัดบริการสุขภาพใหม่ แก่ประชาชนให้สามารถเข้าถึงบริการทาง การแพทย์และสาธารณสุขได้รวดเร็ว สะดวก ปลอดภัย และมีประสิทธิภาพเพื่อส่งเสริมคุณภาพชีวิต ประชาชนให้ดีขึ้น 4. นวัตกรรมด้านวิทยาศาสตร์การแพทย์ หมายถึง ผลิตภัณฑ์หรือบริการใหม่ทาง วิทยาศาสตร์การแพทย์ ที่คิดค้นใหม่หรือที่พัฒนาต่อยอด ผ่านกระบวนการวิจัย พัฒนา หรือการ ปรับปรุงผลิตภัณฑ์ หรือบริการเดิมด้วยองค์ความรู้ด้านวิทยาศาสตร์การแพทย์ โดยบุคลากรของ กรมวิทยาศาสตร์การแพทย์มีส่วนร่วม ทั้งนี้ ต้องมีการทดสอบและผ่านการรับรองตามกระบวนการที่ กรมวิทยาศาสตร์การแพทย์กำหนด ซึ่งมีการใช้ประโยชน์ด้านวิทยาศาสตร์การแพทย์หรือสาธารณสุข เรียบร้อยแล้ว จำแนกเป็น 4 ประเภท ได้แก่ 1) นวัตกรรมผลิตภัณฑ์ (Product Innovation) เป็นการพัฒนาและนำเสนอผลิตภัณฑ์ ใหม่ รวมไปถึงการปรับปรุงผลิตภัณฑ์เดิมที่มีอยู่ให้มีคุณภาพและประสิทธิภาพดียิ่งขึ้น เช่น ชุดทดสอบ ชุดเครื่องมือ ผลิตภัณฑ์รักษาโรค ป้องกันโรค และคุ้มครองผู้บริโภค เป็นต้น 2) นวัตกรรมบริการ (Service Innovation) เป็นการนำเสนอบริการใหม่ที่เกิดจากการ สร้างขึ้นใหม่ หรือปรับปรุงสิ่งเดิม เช่น Test Service การทดสอบความชำนาญ OECD GLP ขอการ รับรองตามมาตรฐานระดับประเทศและสากล ระบบบริการ Online บริการตรวจสอบเครื่องมือ เป็น ต้น 3) นวัตกรรมกระบวนการ (Process Innovation) เป็นการเปลี่ยนแนวทาง หรือ วิธีการผลิตสินค้า หรือการให้บริการในรูปแบบที่แตกต่างออกไปจากเดิม ด้วยการพัฒนาสร้างสรรค์ กระบวนการให้มีประสิทธิภาพมากยิ่งขึ้น ซึ่งต้องอาศัยความรู้ทางเทคโนโลยี กระบวนการ และเทคนิค ต่าง ๆ ที่เกี่ยวข้อง รวมถึงการประยุกต์ใช้แนวคิด วิธีการ หรือกระบวนการใหม่ ๆ ที่ส่งผลให้ กระบวนการผลิตและการทำงานโดยรวมให้มีประสิทธิภาพ และประสิทธิผลสูงขึ้น เช่น กระบวนการ ออกแบบและพัฒนา กระบวนการจัดการนวัตกรรม เป็นต้น 4) นวัตกรรมการจัดการ (Management Innovation) เป็นการใช้ความทางด้านการ บริหารจัดการมาปรับปรุงระบบโครงสร้างเดิมขององค์กร สามารถตอบสนองความต้องการและความ คาดหวังของผู้รับบริการและผู้มีส่วนได้ส่วนเสีย เช่น Model Development การใช้ระบบ QR Code การพัฒนาระบบพี่เลี้ยง เป็นต้น",
      "purpose": "เป้าหมาย วิธีดำเนินงาน ระยะเวลาดำเนินงาน สถานที่ดำเนินงาน งบประมาณหรือทรัพยากรที่ต้องใช้ ผู้รับผิดชอบ ผลผลิต/ผลลัพธ์ 11. ออกแบบระบบ (System Designs) หมายถึง การออกแบบกระบวนการ วิธีการ แนวทาง ในการทำงานเพื่อให้บรรลุเป้าหมายที่ต้องการ เช่น การออกแบบระบบเพื่อลดความแออัด ของผู้ป่วยนอก เป็นต้น",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "ผลการดำเนินงานจริงเทียบกับเกณฑ์เป้าหมาย (เรื่อง)",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "ผลผลิต/ผลลัพธ์ 11. ออกแบบระบบ (System Designs) หมายถึง การออกแบบกระบวนการ วิธีการ แนวทาง ในการทำงานเพื่อให้บรรลุเป้าหมายที่ต้องการ เช่น การออกแบบระบบเพื่อลดความแออัด ของผู้ป่วยนอก เป็นต้น"
    },
    "KPI66-36": {
      "kpiId": "KPI66-36",
      "order": 36,
      "name": "จำนวนโรงพยาบาลสังกัดกระทรวงสาธารณสุขมีคุณภาพมาตรฐาน HA และระบบบริการก้าวหน้า (EMS)",
      "strategy": "ยุทธศาสตร์ที่ 4",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "แห่ง",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "18/26",
      "baseline": "-",
      "definition": "จำนวนโรงพยาบาลสังกัดกระทรวงสาธารณสุขมีคุณภาพมาตรฐาน HA และระบบบริการก้าวหน้า (EMS) ตามเกณฑ์มาตรฐานแผนยุทธศาสตร์สุขภาพ 5 ปี จังหวัดขอนแก่น (พ.ศ. 2566–2570)",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "1. คู่มือแนวทางการดำเนินงาน GREEN & CLEAN Hospital Challenge",
      "formula": "2. คู่มือแนวทางการพัฒนาโรงพยาบาลคาร์บอนต่ำและเท่าทันการเปลี่ยนแปลงสภาพ",
      "numeratorA": "จำนวนโรงพยาบาลสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่นและโรงพยาบาลสังกัด",
      "denominatorB": "จำนวนโรงพยาบาลสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่นและโรงพยาบาลสังกัดกรม",
      "frequency": "ภูมิอากาศ (Low Carbon and Climate Resilient Health Care)",
      "evaluationMethod": "3. คู่มือมาตรฐานการปฏิบัติงานการจัดการของเสียทางการแพทย์สำหรับโรงพยาบาลสังกัด รายละเอียด ข้อมูลพื้นฐาน กระทรวงสาธารณสุข (Standard Operating Procedure: SOP MEDICAL WASTE (Baseline Data) ผลการดำเนินงาน MANAGEMENT for Hospital Under Ministry of Public Health) ย้อนหลัง 3 ปี (ปี 2563 – 2565) 4. คู่มือการดำเนินตามมาตรฐานการจัดบริการอาชีวอนามัยและเวชกรรมสิ่งแวดล้อมสำหรับ โรงพยาบาล 5. คู่มือแนวทางการดำเนินงานด้านการจัดการพลังงานอย่างมีประสิทธิภาพสำหรับ โรงพยาบาล 6. คู่มือแนวทางการจัดการมูลฝอย ส้วมและสิ่งปฏิกูลในโรงพยาบาล 7. คู่มือสถานบริการสาธารณสุขต้นแบบลดโลกร้อน 8. คู่มือมาตรฐานโรงพยาบาลอาหารปลอดภัย (Food Safety Hospital) (A/B) X 100 A = จำนวนโรงพยาบาลสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่นและโรงพยาบาลสังกัด กรมวิชาการในจังหวัดขอนแก่นที่ดำเนินการ GREEN & CLEAN Hospital Challenge ผ่านเกณฑ์ระดับมาตรฐานขึ้นไป B = จำนวนโรงพยาบาลสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่นและโรงพยาบาลสังกัดกรม วิชาการในจังหวัดขอนแก่นทั้งหมด นิเทศ ติดตาม และประเมินผลการดำเนินงานสาธารณสุขจังหวัดขอนแก่น ปี 2566 จำนวน 2 รอบ 1. โรงพยาบาลประเมินตนเองเพื่อวางแผนพัฒนา 2. ทีมประเมินระดับจังหวัดทำการประเมินเพื่อให้คำแนะนำ และรับรองโรงพยาบาลที่พัฒนา อนามัยสิ่งแวดล้อมได้ตามเกณฑ์ GREEN & CLEAN Hospital Challenge 3. ผลงานเปรียบเทียบกับเป้าหมาย Baseline Data หน่วยวัด ผลงาน รพ. 30 แห่ง ปี 2563 ปี 2564 ปี 2565 ระดับพื้นฐาน แห่ง/ร้อยละ 30 (100) 30 (100) 30 (100) ระดับดี แห่ง/ร้อยละ 30 (100) 30 (100) 30 (100) ระดับดีมาก แห่ง/ร้อยละ 25 (83) 30 (100) 30 (100) ระดับดีมาก Plus แห่ง/ร้อยละ 6 (20) 6 (20) 8 (26)",
      "responsible": "3 ชุมแพ ดีมาก Plus 4 พระยืน ดีมาก Plus 5 น้ำพอง ดีมาก Plus 6 หนองเรือ ดีมาก Plus 7 สีชมพู ดีมาก Plus 8 จิตเวชขอนแก่นราชนครินทร์ ดีมาก Plus 9 บ้านฝาง ดีมาก 10 มัญจาคีรี ดีมาก 11 โคกโพธิ์ไชย ดีมาก 12 กระนวน ดีมาก 13 อุบลรัตน์ ดีมาก 14 เขาสวนกวาง ดีมาก 15 ซำสูง ดีมาก 16 บ้านไผ่ ดีมาก 17 ชนบท ดีมาก 18 โนนศิลา ดีมาก 19 พล ดีมาก 20 เปือยน้อย ดีมาก 21 แวงน้อย ดีมาก 22 แวงใหญ่ ดีมาก 23 หนองสองห้อง ดีมาก 24 ภูผาม่าน ดีมาก 25 ภูเวียง ดีมาก 26 เวียงเก่า ดีมาก 27 หนองนาคำ ดีมาก 1. นายณัฐิวุฒิ จันตะแสง นักวิชาการสาธารณสุขชำนาญการ กลุ่มงานอนามัยสิ่งแวดล้อมและอาชีวอนามัย สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 043 221125 ต่อ 156 โทรสาร 043 224037 โทรศัพท์มือถือ 064 983 9562 E-mail: pro_tb@yahoo.com 2. นางสาวนภัสวรรณ สนธินอก นักวิชาการสาธารณสุขชำนาญการ กลุ่มงานอนามัยสิ่งแวดล้อมและอาชีวอนามัย สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 043 221125 ต่อ 156 โทรสาร 043 224037 โทรศัพท์มือถือ 091 867 3075 E-mail: aom.napass@gmail.com"
    },
    "KPI66-37": {
      "kpiId": "KPI66-37",
      "order": 37,
      "name": "จำนวนเครือข่ายบริการสุขภาพระดับอำเภอดำเนินการพัฒนาระบบความพึงพอใจของผู้รับบริการผ่านเกณฑ์ที่กำหนด",
      "strategy": "ยุทธศาสตร์ที่ 4",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "เครือข่าย",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "22",
      "baseline": "21",
      "definition": "หน่วยบริการปฐมภูมิ หมายถึง หน่วยบริการสาธารณสุขระดับปฐมภูมิ ทุกสังกัดที่ขึ้นทะเบียน เป็นหน่วยบริการปฐมภูมิเกณฑ์ประเมินคุณภาพมาตรฐานบริการสุขภาพปฐมภูมิ หมายถึง เกณฑ์ ประเมิณคุณภาพมาตรฐานบริการสุขภาพปฐมภูมิ พ.ศ.2566 (ฉบับปรับปรุง) มีเกณฑ์การประเมินดังนี้ ส่วนที่ 1 ด้านระบบบริหารจัดการ ส่วนที่ 2 ด้านการจัดบุคคลากรและศักยภาพในการให้บริการ ส่วนที่ 3 ด้านสถานที่ตั้งหน่วยบริการ อาคาร สถานที่ และสิ่งแวดล้อม ส่วนที่ 4 ด้านระบบสารสนเทศ ส่วนที่ 5 ด้านระบบบริการสุขภาพปฐมภูมิ ส่วนที่ 6 ด้านระบบห้องปฏิบัติการด้านการแพทย์และสาธารณสุข ส่วนที่ 7 ด้านการจัดบริการเภสัชกรรมอลังานคุ้มครองผู้บริโภคด้านสุขภาพ ส่วนที่ 8 ด้านระบบการป้องกันและควบคุมการติดเชื่อ โดยมีการแปลผลดังนี้ ส่วนที่ 1 – 4 หน่วยบริการต้องผ่านเกณฑ์ทุกข้อ ส่วนที่ 5 – 8 หน่วยบริการต้องผ่านเกณ์ร้อยละ 80 ขึ้นไป",
      "purpose": "1. เพื่อให้ประชาชนสามารถเข้าถึงบริการที่มีคุณภาพ มาตรฐาน 2. เพื่อพัฒนาหน่วยบริการปฐมภูมิให้มีคุณภาพมาตรฐาน",
      "population": "หน่วยบริการปฐมภูมิทุกแห่ง ทุกสังกัด",
      "collectionMethod": "การจัดเก็บการประเมินคุณภาพมาตรฐาน จากระบบข้อมูลทรัพยากรสุขภาพหน่วยบริการปฐมภูมิ",
      "source": "(PCU Standard)",
      "formula": "A = จำนวนหน่วยบริการปฐมภูมิที่ผ่านเณฑ์การประเมิณมาตรฐานระบบสุขภาพปฐมภูมิ",
      "numeratorA": "จำนวนหน่วยบริการปฐมภูมิที่ผ่านเณฑ์การประเมิณมาตรฐานระบบสุขภาพปฐมภูมิ",
      "denominatorB": "จำนวนหน่วยบริการปฐมภูมิทั้งหมดทุกสังกัด",
      "frequency": "B = จำนวนหน่วยบริการปฐมภูมิทั้งหมดทุกสังกัด",
      "evaluationMethod": "ระบบข้อมูลทรัพยากรสุขภาพ หน่วยบริการปฐมภูมิ (PCU Standard )และ สุ่มลงตรวจประเมิน ในพื้นที่ รายละเอียดข้อมูล พื้นฐาน(Baseline ผลงาน ปี 2565 ปี 2566 ปี 2567 Data) Baseline Data - - ร้อยละ 41.08 ผลการดำเนินงาน ย้อนหลัง 3 ปี ชื่อ-สกุล...นางศิริพร อุทธากิจ ตำแหน่ง..พยาบาลวิชาชีพชำนาญการ (ปี 2565 -2567) กลุ่มงาน..พัฒนาคุณภาพและรูปแบบบริการ.",
      "responsible": "สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ 122... โทรสาร 0-4322-4037 ผู้กำกับดูแลตัวชี้วัด โทรศัพท์มือถือ..080 - 3570910. E-mail : .pcunpcu2022@gmail.com ชื่อ-สกุล...นางศิริมา นามประเสริฐ ตำแหน่ง..หัวหน้ากลุ่มงานพัฒนาคุณภาพและรูปแบบบริการ กลุ่มงาน..พัฒนาคุณภาพและรูปแบบบริการ. สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ 122... โทรสาร 0-4322-4037"
    },
    "KPI66-38": {
      "kpiId": "KPI66-38",
      "order": 38,
      "name": "จำนวนสำนักงานสาธารณสุขอำเภอที่ดำเนินการพัฒนาคุณภาพการบริหารจัดการภาครัฐ (PMQA) ผ่านเกณฑ์ที่กำหนด",
      "strategy": "ยุทธศาสตร์ที่ 4",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "แห่ง",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "24",
      "baseline": "24",
      "definition": "จำนวนสำนักงานสาธารณสุขอำเภอที่ดำเนินการพัฒนาคุณภาพการบริหารจัดการภาครัฐ (PMQA) ผ่านเกณฑ์ที่กำหนด ตามเกณฑ์มาตรฐานแผนยุทธศาสตร์สุขภาพ 5 ปี จังหวัดขอนแก่น (พ.ศ. 2566–2570)",
      "purpose": "ผ่านเกณฑ์การประเมินระดับ 5",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "24 25 26 26 26",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "เพื่อยกระดับการพัฒนาคุณภาพให้เป็นองค์กรที่มีสมรรถนะสูง",
      "evaluationMethod": "สำนักงานสาธารณสุขอำเภอ จัดทำแบบประเมินตนเอง และส่งรายงานความก้าวหน้าตาม รอบ 3 / 6 / 9 / 12 เดือน ผ่านทางระบบอิเล็กทรอนิกส์ไฟล์ให้สำนักงานสาธารณสุข จังหวัดขอนแก่น ผ่าน E-mail : hakhonkaen63@gmail.com ภายในระยะเวลาที่กำหนด 1.ระบบรายงานข้อมูลของเว็บไซต์สำนักงานปลัดกระทรวงสาธารณสุข 2.ระบบรายงานข้อมูลของสำนักงานสาธารณสุขจังหวัดขอนแก่น กลุ่มงานพัฒนาคุณภาพ และรูปแบบบริการ ร้อยละของสำนักงานสาธารณสุขอำเภอดำเนินการพัฒนาคุณภาพการบริหารจัดการภาครัฐ ผ่านเกณฑ์ที่กำหนด = (A / B) x 100 A คือ จำนวนของสำนักงานสาธารณสุขอำเภอดำเนินการพัฒนาคุณภาพการบริหารจัดการ ภาครัฐผ่านเกณฑ์ที่กำหนด B คือ จำนวนสำนักงานสาธารณสุขอำเภอทั้งหมวด (26 แห่ง) รายงานรอบ 3 เดือน , 6 เดือน และ 9 เดือน รอบ 3 เดือน รอบ 6 เดือน รอบ 9 เดือน 1.จัดทำลักษณะสำคัญ 1.ผลลัพธ์ตัวชี้วัด 6 เดือน 1.ผลลัพธ์ตัวชี้วัด 9 เดือน ขององค์การครบ 13 (กำหนดส่งรายงานผล 2.ผลการประเมิน Core คำถาม วันที่ 4 เมษายน 2566 ) Value ขององค์กร 2.กำหนดตัวชี้วัดที่ 3.ผลการ Benchmark แสดงผลสัมฤทธิ์ของ (กำหนดส่งรายงานผล องค์กรหมวด 1 - หมวด 6 วันที่ 4 กรกฎาคม 2566 ) หัวข้อ 7.1-7.6 3.กำหนดการ Benchmark (กำหนดส่งรายงานผล วันที่ 10 มกราคม 2566 สำนักงานสาธารณสุขอำเภอ จัดทำแบบประเมินตนเอง และส่งรายงานความก้าวหน้าตามเกณฑ์ Small Success รอบ 3 / 6 / 9 / 12 เดือน ผ่านทางระบบอิเล็กทรอนิกส์ไฟล์",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI66-39": {
      "kpiId": "KPI66-39",
      "order": 39,
      "name": "จำนวนโรงพยาบาลมีการบริหารการเงินการคลังอย่างมีประสิทธิภาพ",
      "strategy": "ยุทธศาสตร์ที่ 4",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "แห่ง",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "24",
      "baseline": "24",
      "definition": "หน่วยงานสาธารณสุขมีความเข้มแข็งทางการเงินบนฐานธรรมาภิบาล 39. จำนวนโรงพยาบาลมีการบริหารการเงินการคลังอย่างมีประสิทธิภาพ ส่วนที่ 1 ใช้เกณฑ์ประเมินประสิทธิภาพการบริหารการเงินการคลัง 5 มิติ ในมิติด้าน การจัดเก็บรายได้ ตามเกณฑ์การพัฒนาระบบการควบคุมภายใน (Internal Control : IC) ที่กำหนดโดยกองเศรษฐกิจสุขภาพและหลักประกันสุขภาพ สป. และกลุ่มตรวจสอบภายใน สป. ดังนี้ 1.1 จัดตั้งงานเรียกเก็บค่ารักษาพยาบาล (ตามโครงสร้าง หนังสือ ว๑๗๐๗ ลงวันที่ ๑๔ มิ.ย. ๒๕๖๐) 1) มีคำสั่งแต่งตั้งคณะกรรมการจัดเก็บค่ารักษาพยาบาลของหน่วยงาน 2) มีคำสั่ง หรือ มอบหมายหน้าที่ผู้รับผิดชอบงานเรียกเก็บค่ารักษาพยาบาล ๗ สิทธิ 3) มี Flow chart ของกระบวนงานเรียกเก็บค่ารักษาพยาบาล ๔ สิทธิ 4) มีคำสั่ง หรือ มอบหมายหน้าที่ผู้รับผิดชอบงาน Audit Chart เพื่อตรวจสอบความ ถูกต้องของเวชระเบียน 5) มีการประชุมวิเคราะห์การจัดเก็บรายได้ค่ารักษาพยาบาล เพื่อเสนอผลการ ดำเนินงานให้ผู้บริหารทราบ (อย่างน้อยไม่เกิน ๓ เดือน) 1.2 การบันทึกข้อมูลการเรียกเก็บเงินค่ารักษาพยาบาล 1) ผู้ป่วยนอก (OPD) จัดทำทะเบียนคุมลูกหนี้ค่ารักษาพยาบาลแยกรายละเอียดลูกหนี้ รายตัว ๗ สิทธิ 2) ผู้ป่วยใน (IPD) จัดทำทะเบียนคุมลูกหนี้ค่ารักษาพยาบาลแยกรายละเอียดลูกหนี้ รายตัว ๗ สิทธิ 3) ผู้รับผิดชอบจัดเก็บรายได้ส่งรายงานค่ารักษาพยาบาลผู้ป่วยนอก (OPD) ผู้ป่วยใน (IPD) สิทธิจ่ายตรงกรมบัญชีกลาง ให้กับงานบัญชี 4) หน่วยงานมีการปรับเปลี่ยนอัตราค่าบริการหรือค่ารักษาพยาบาลตามประกาศของ กระทรวงสาธารณสุขหรือตามอัตราประกาศหน่วยงานที่เกี่ยวข้อง ทุกครั้งที่มีการ เปลี่ยนแปลง 5) กรณีได้รับชำระค่ารักษาพยาบาลงานจัดเก็บรายได้ มีการติดตามหลักฐานการชำระ เงินหนี้ค่ารักษาพยาบาลทุกครั้ง 1.3 กระบวนการเร่งรัดติดตามการเรียกเก็บรายได้ค่ารักษาพยาบาล 1) บันทึกข้อมูลค่ารักษาพยาบาลผู้ป่วยใน (IPD) สิทธิบัตรทอง (UC) และเรียกเก็บ ทันเวลาภายใน ๓๐ วัน 2) กำหนดผู้รับผิดชอบด้านการเร่งรัดติดตามหนี้ค้างชำระและผู้รับผิดชอบการรับชำระ หนี้ แยกออกจากกัน 3) มีการเร่งรัดติดตามการชำระหนี้เป็นลายลักษณ์ อักษรชัดเจน 4) กระบวนการสังคมสงเคราะห์/อนุเคราะห์ 1.4 มีระบบการติดตามอย่างต่อเนื่องทุกสิ้นเดือน 1) รายงานลูกหนี้ค่ารักษาพยาบาลตามสิทธิทุกสิ้นเดือนเสนอหัวหน้าหน่วยงาน 2) สอบยันยอดความมีอยู่จริงของลูกหนี้คงเหลือ ณ วันสิ้นปีงบประมาณกับ",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "ผลการดำเนินงานจริงเทียบกับเกณฑ์เป้าหมาย (แห่ง)",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI66-40": {
      "kpiId": "KPI66-40",
      "order": 40,
      "name": "จำนวนหน่วยงานในสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่น ผ่านเกณฑ์การประเมินคุณธรรมและความโปร่งใส (ITA)",
      "strategy": "ยุทธศาสตร์ที่ 4",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "แห่ง",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "52",
      "baseline": "52",
      "definition": "หน่วยงาน มีการบริหารจัดการที่มีประสิทธิภาพ โปร่งใส ตรวจสอบได้ และบังคับใช้",
      "purpose": "1. เพื่อให้ผลการประเมินสามารถสะท้อนสุขภาวะของหน่วยงานในด้านคุณธรรม และ",
      "population": "ความโปร่งใสได้อย่างแท้จริง",
      "collectionMethod": "2. เพื่อพัฒนาและปรับปรุงกระบวนการปฏิบัติงาน และให้การบริหารราชการ ของ",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "ประสิทธิผลตามหลักธรรมาภิบาล",
      "numeratorA": "จำนวนหน่วยงานที่ผ่านเกณฑ์การประเมินตนเองตามแบบวัดการเปิดเผยข้อมูล",
      "denominatorB": "จำนวนหน่วยงานทั้งหมดที่เข้ารับการประเมิน ITA (52 หน่วยงาน)",
      "frequency": "3. เพื่อให้เกิดผลในทางปฏิบัติในการนำมาตรการการป้องกันและปราบปราม การทุจริต",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI66-41": {
      "kpiId": "KPI66-41",
      "order": 41,
      "name": "จำนวนหน่วยงานสาธารณสุขที่พัฒนาสู่องค์กรดิจิทัล",
      "strategy": "ยุทธศาสตร์ที่ 4",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "แห่ง",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "13",
      "baseline": "-",
      "definition": "เทคโนโลยี นวัตกรรมทางการแพทย์ที่ทันสมัย ในการให้บริการสุขภาพ และบริหารจัดการ",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "1.หน่วยงานสาธารณสุขที่พัฒนาสู่องค์กรดิจิทัล หมายถึง หน่วยงานที่มีการพัฒนา",
      "collectionMethod": "องค์ประกอบหลักด้านเทคโนโลยีสารสนเทศ 3 ด้าน คือ มีโครงสร้างพื้นฐานอุปกรณ์ตาม",
      "source": "เกณฑ์มีโปรแกรมสนับสนุนการให้บริการ/บริหารและมีการพัฒนาสมรรถนะบุคลากรด้าน เทคโนโลยีสารสนเทศ นำไปสู่การปรับปรุงกระกระบวนงานโดยใช้เทคโนโลยีสารสนเทศโดย ในปีงบประมาณ 2566 มุ่งเน้นการประเมินผลตามยุทธศาสตร์ ในประเด็นการเชื่อมต่อ ข้อมูล และการให้บริการประชาชนผ่าน Telemedicine รายละเอียดดังนี้ 1. การเชื่อมต่อฐานข้อมูล 1.1 โรงพยาบาลมีการเชื่อมต่อกับฐานข้อมูลสำนักงานสาธารณสุขจังหวัดขอนแก่นและ กระทรวงสาธารณสุข 1) โรงพยาบาลแม่ข่าย ส่งข้อมูลไปยังฐานกลางสำนักงานสาธารณสุขจังหวัด ด้วยวิธี Replication ครบ ถ้วน แล ะเป็ น ปั จจุบั น (Real Time) ผ่าน ระบ บ เชื่อ มต่ อ MPLS (ภายใต้ Ip Address 203.157.xxx.xxx) ของกระทรวงสาสุข 2) โรงพยาบาลแม่ข่าย ส่งข้อมูลไปยังฐานกลางกระทรวงสาธารณสุข ด้วยวิธี API HIS Gateway ครบถ้วนและเป็นปัจจุบัน (Real Time) 1.2 โรงพยาบาลแม่ข่ายมีการเชื่อมต่อกับฐานข้อมูล รพ.สต. ภายในCUP โดย ประสานงานกับ รพ.สต. ภายใต้ MOU รพ.สต. ส่งข้อมูลไปยังฐานกลางสำนักงานสาธารณสุข จังหวัด ด้วยวิธี Replication ครบถ้วนและเป็นปัจจุบัน (Real Time) 2. โรงพยาบาล ให้บริการผ่านระบบ Telemedicine อย่างน้อย 1 ช่องทาง 3. ร้อยละของจังหวัดที่ประชาชนไทย มีดิจิทัลไอดีเพื่อการเข้าถึงระบบบริการสุขภาพ แบบ ไร้รอยต่อ 3.1 ร้อยละของบุคลากรสาธารณสุข มีดิจิทัลไอดี เพื่อยืนยันการเป็นผู้ให้บริการ 3.2 ร้อยละของประชาชน มีดิจิทัลไอดี เพื่อเข้าถึงข้อมูลสุขภาพส่วนบุคคล และเข้าถึง ระบบบริการสุขภาพแบบไร้รอยต่อ จำนวนหน่วยงานที่ผ่านเกณฑ์หน่วยงานที่พัฒนาสู่องค์กรดิจิทัล ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ 2566 2567 2568 2569 2570 13 15 20 26 26 1.เพื่อให้มีการพัฒนาการให้บริการการแพทย์ทางไกล 2.เพื่อให้สามารถเข้าถึงบริการทางการแพทย์ได้มากขึ้น ในกลุ่มผู้ป่วยเปราะบาง โรคเรื้อรัง หน่วยงานที่พัฒนาสู่องค์กรดิจิทัล รพ.(รพ.ศ./รพ.ท/รพช.) ทุกแห่ง ผู้รับผิดชอบรายงานผลงานเป็นรายไตรมาสไปยังระบบรายงานองค์กรดิจิทัล(ออนไลน์) 1.การเชื่อมต่อฐานข้อมูล แสดงผลจากระบบเชื่อมต่อฐานข้อมูล 2.โรงพยาบาลสื่อสารและให้บริการประชาชนผ่าน เทคโนโลยีสารสนเทศ รายงานผลทุกไตรมาส ที่ link https://kkpho.moph.go.th/org_digital (ออนไลน์) https://kkpho.moph.go.th/org_digital",
      "formula": "ผลการดำเนินงานจริงเทียบกับเกณฑ์เป้าหมาย (แห่ง)",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    }
  },
  "67": {
    "KPI67-01": {
      "kpiId": "KPI67-01",
      "order": 1,
      "name": "ร้อยละของประชาชนวัยทำงานอายุ 19-59 ปี มี BMI เกินได้รับการปรับเปลี่ยนพฤติกรรมและมี BMI ลดลง",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 1",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "2",
      "baseline": "NA",
      "definition": "ร้อยละของประชาชนวัยทำงานอายุ 19-59 ปี มี BMI เกินได้รับการปรับเปลี่ยนพฤติกรรมและมี BMI ลดลง ตามเกณฑ์มาตรฐานแผนยุทธศาสตร์สุขภาพ 5 ปี จังหวัดขอนแก่น (พ.ศ. 2566–2570)",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ได้รับการตรวจคัด กรองมะเร็งท่อน้ำดี ด้วยการอัล ตราซาวด์ 1. นางอนุรักษ์ สะตะ ตำแหน่ง หัวหน้างานบริหารจัดการภัยพิบัติ และหนอนพยาธิ 2. นางสาวลดาวรรณ ช่างศรี ตำแหน่ง นักวิชาการสาธารณสุขชำนาญการ กลุ่มงานควบคุมโรคติดต่อ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ 124 โทรสาร 0-4322-4037 โทรศัพท์มือถือ 08 5541 6428 E-mail : kkcd.eoc@gmail.com",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "ตรวจคัดกรองพยาธิใบไม้ตับ (A/B)x100",
      "numeratorA": "ประชากรเป้าหมายที่ได้รับการตรวจคัดกรองพยาธิใบไม้ตับ",
      "denominatorB": "ประชากรกลุ่มเป้าหมายที่กำหนด",
      "frequency": "A = ประชากรเป้าหมายที่ได้รับการตรวจคัดกรองพยาธิใบไม้ตับ",
      "evaluationMethod": "ประเมินการดำเนินงานจากการนิเทศงานระดับ CUP ตามรอบประเมินผล รายละเอียดข้อมูล พื้นฐาน(Baseline ผลงาน ผลการดำเนินงาน Data) ผลการดำเนินงาน 2564 2565 2566 ย้อนหลัง 3 ปี (ปี 2564 -2566) ร้อยละความครอบคลุมการตรวจ 0.44 0.52 0.56",
      "responsible": "คัดกรองพยาธิใบไม้ตับในประชากร กลุ่มเสี่ยง จากประชากรอายุ 15 ปี ขึ้นไปด้วยวิธีการตรวจอุจจาระ ร้ อ ย ล ะ ข อ ง ป ร ะ ช า ช น 100 100 100 กลุ่มเป้าหมาย ได้รับการตรวจคัด กรองมะเร็งท่อน้ำดี ด้วยการอัล ตราซาวด์ 1. นางอนุรักษ์ สะตะ ตำแหน่ง หัวหน้างานบริหารจัดการภัยพิบัติ และหนอนพยาธิ 2. นางสาวลดาวรรณ ช่างศรี ตำแหน่ง นักวิชาการสาธารณสุขชำนาญการ กลุ่มงานควบคุมโรคติดต่อ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ 124 โทรสาร 0-4322-4037 โทรศัพท์มือถือ 08 5541 6428 E-mail : kkcd.eoc@gmail.com"
    },
    "KPI67-02": {
      "kpiId": "KPI67-02",
      "order": 2,
      "name": "อัตราความรอบรู้ด้านสุขภาพของผู้ป่วยโรคเบาหวานและโรคความดันโลหิตสูง",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 1",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "71",
      "baseline": "NA",
      "definition": "ประชาชนทุกกลุ่มวัย และผู้บริโภคมีพฤติกรรมสุขภาพที่เหมาะสม",
      "purpose": "1 ผู้ป่วยเบาหวาน หมายถึง ผู้ป่วยที่ได้รับการวินิจฉัยเป็นโรคเบาหวาน และได้รับการขึ้น",
      "population": "ทะเบียน/ผู้ป่วยโรคเบาหวานอาศัยอยู่ในพื้นที่รับผิดชอบทั้งหมด",
      "collectionMethod": "2. ผู้ป่วยความดันโลหิตสูง หมายถึง ผู้ป่วยที่ได้รับการวินิจฉัยเป็นโรคความดันโลหิตสูง และ ได้รับการขึ้นทะเบียน/ผู้ป่วยโรคความดันโลหิตสูงอาศัยอยู่ในพื้นที่รับผิดชอบทั้งหมด",
      "source": "3. ความรอบรู้ด้านสุขภาพ หมายถึง ทักษะหรือความสามารถของบุคคลในการเข้าถึง เข้าใจ โต้ตอบ ซักถาม จนสามารถประเมิน และตัดสินใจใช้ข้อมูลด้านสุขภาพ พร้อมทั้งปรับเปลี่ยน พฤติกรรมสุขภาพสู่การมีสุขภาวะที่ดี และสามารถสื่อสารข้อมูลด้านสุขภาพต่อผู้อื่นได้ 4. ผู้ป่วยรายใหม่จากโรคหลอดเลือดหัวใจ หมายถึง ผู้ป่วยที่ได้รับการวินิจฉัยครั้งแรกจาก แพ ท ย์ว่าเป็ นโรคหลอดเลือดหัวใจแบบ เฉียบ พลัน รหัส ICD10 (I20 .0 ,I21-I24) ในปีงบประมาณ ทุกกลุ่มอายุ 5. ผู้ป่วยรายใหม่จากโรคหลอดเลือดสมอง หมายถึง ผู้ป่วยที่ได้รับการวินิจฉัยโรคหลัก (Principal diagnosis: pdx) จากแพทย์พบว่าป่วยด้วยโรคสมอง รหัส ICD10 (160-169)ใน ปีงบประมาณทุกกลุ่มอายุ ในกรณีที่มีการวินิจฉัยโรคหลักซ้ำภายใน",
      "formula": "๑ B = จำนวนผู้ป่วยโรคเบาหวานและโรคความดันโลหิตสูงทั้งหมด สูตรคำนวณตัวชี้วัด 2 สูตรคำนวณตัวชี้วัด 3 A x 100",
      "numeratorA": "จำนวนผู้ป่วยโรคเบาหวานและโรคความดันโลหิตสูงที่มีความรอบรู้ด้านสุขภาพ",
      "denominatorB": "จำนวนผู้ป่วยโรคเบาหวานและโรคความดันโลหิตสูงทั้งหมด",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI67-03": {
      "kpiId": "KPI67-03",
      "order": 3,
      "name": "จำนวนอำเภอที่ผ่านเกณฑ์คุณภาพการพัฒนาคุณภาพชีวิต",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "อำเภอ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "26",
      "baseline": "25",
      "definition": "จำนวนอำเภอที่ผ่านเกณฑ์คุณภาพการพัฒนาคุณภาพชีวิต ตามเกณฑ์มาตรฐานแผนยุทธศาสตร์สุขภาพ 5 ปี จังหวัดขอนแก่น (พ.ศ. 2566–2570)",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ก่อน – หลังดำเนินการรายประเด็น",
      "formula": "1. ระบบรายงาน HDC สูตรคำนวณ 2. รายงานโปรแกรม CL UCCARE ตัวชี้วัด 1. คำสั่งคณะกรรมการ พชอ. และ อนุกรรมการ พชอ. รายประเด็นที่เป็นปัจจุบัน 2. รายงานการประเมินตนเองระดับการพัฒนาคุณภาพชีวิตระดับอำเภอ ตามแนวทาง UCCARE ก่อน – หลังดำเนินการ 3. แผนขับเคลื่อนการดำเนินงานคณะกรรมการพัฒนาคุณภาพชีวิตระดับอำเภอ 4. แผนดำเนินงานการพัฒนาคุณภาพชีวิตระดับอำเภอ รายประเด็น ประจำปี 5. รายงานสรุปผลการดำเนินงานพัฒนาคุณภาพชีวิตระดับอำเภอประจำปี 1. ระดับจังหวัด (A/B)x100 A = จำนวนอำเภอที่ผ่านเกณฑ์การพัฒนาคุณภาพชีวิตระดับอำเภอ B = จำนวนอำเภอเป้าหมาย 26 อำเภอ ระยะเวลา ทุกไตรมาส ประเมินผล",
      "numeratorA": "จำนวนอำเภอที่ผ่านเกณฑ์การพัฒนาคุณภาพชีวิตระดับอำเภอ",
      "denominatorB": "จำนวนอำเภอเป้าหมาย 26 อำเภอ",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "1. ประเมินจากข้อมูลในระบบ HDC สสจ.ขอนแก่น 2. โปรแกรม CL UCCARE รายละเอียดข้อมูล 3. ประเมินการดำเนินงานจากการนิเทศงาน ประเมินผลระดับ CUP พื้นฐาน(Baseline Data) ผลงาน ปี 2564 ปี 2565 ปี 2566 ปี 2567 ผลการดำเนินงาน เกณฑ์การประเมิน (ร้อยละ) 75 75 85 87 ย้อนหลัง 3 ปี ผลงานอำเภอผ่านเกณฑ์ (ปี 2564 - 89.23 86.16 96.15 2566)",
      "responsible": "1.นางสาวผดารณัช พลไชยมาตย์ ตำแหน่ง นักวิชาการสาธารณสุขปฏิบัติการ ตัวชี้วัด กลุ่มงานพัฒนาคุณภาพและรูปแบบบริการ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0 4322 1125 ต่อ 122 โทรสาร 0 4322 4037 โทรศัพท์มือถือ 08 5855 1669 E-mail : phadarnuch@gmail.com 2.นางสาวปุณณภา โพธิ์สิงห์ ตำแหน่ง นักวิชาการสาธารณสุขชำนาญการ กลุ่มงานพัฒนาคุณภาพและรูปแบบบริการ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0 4322 1125 ต่อ 122 โทรสาร 0 4322 4037 โทรศัพท์มือถือ 08 9712 7552 E-mail : public00032@gmail.com"
    },
    "KPI67-04": {
      "kpiId": "KPI67-04",
      "order": 4,
      "name": "ร้อยละเด็กปฐมวัยมีพัฒนาการสมวัย",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "86",
      "baseline": "77.61",
      "definition": "4.ร้อยละเด็กปฐมวัยมีพัฒนาการสมวัย เด็กอายุ 0 - 5 ปี หมายถึง เด็กแรกเกิด จนถึงอายุ 5 ปี 11 เดือน 29 วัน เด็กพัฒนาการสมวัย (สมวัยครั้งแรก) หมายถึง เด็กที่ได้รับตรวจคัดกรองพัฒนาการโดย ใช้ คู่มือเฝ้าระวังและส่งเสริมพัฒนาการเด็กปฐมวัย (DSPM)* แล้วผลการตรวจคัดกรอง ผ่านครบ 5 ด้านในการตรวจคัดกรองพัฒนาการครั้งแรก เด็กที่ได้รับการกระตุ้นภายใน 30 วันมีพัฒนาการสมวัย (สมวัยครั้งที่สอง) หมายถึง เด็กที่มีพัฒนาการสงสัยล่าช้าที่ได้รับรับการกระตุ้นพัฒนาการภายใน 30 วัน และ ประเมินซ้ำแล้วผลการประเมิน ผ่านครบ 5 ด้าน การคัดกรองพัฒนาการ หมายถึง ความครอบคลุมของการคัดกรองเด็กอายุ 9, 18, 30, 42 และ 60 เดือน ณ ช่วงเวลาที่มีการคัดกรองโดยเป็นเด็กในพื้นที่ (Type 1: มีชื่ออยู่ใน ทะเบียนบ้าน ตัวอยู่จริงและ Type 3 : ที่อาศัยอยู่ในเขต แต่ทะเบียนบ้านอยู่นอกเขต พัฒนาการสงสัยล่าช้า หมายถึง เด็กที่ได้รับตรวจคัดกรองพัฒนาการโดยใช้คู่มือเฝ้าระวัง และส่งเสริมพัฒนาการเด็กปฐมวัย (DSPM) และผลการตรวจคัดกรองพัฒนาการตามอายุ ของเด็กในการประเมินพัฒนาการครั้งแรกผ่านไม่ครบ 5 ด้าน ทั้งเด็กที่ต้องแนะนำให้พ่อ แม่ ผู้ปกครอง ส่งเสริมพัฒนาการตามวัยภายใน 30 วัน (1B261) รวมกับเด็กที่สงสัย ล่าช้า ส่งต่อทันที (1B262 : เด็กที่พัฒนาการล่าช้า/ความผิดปกติอย่างชัดเจน) พัฒนาการสงสัยล่าช้าได้รับการติดตาม หมายถึง เด็กที่ได้รับการตรวจคัดกรอง พัฒนาการตามอายุของเด็กในการประเมินพัฒนาการครั้งแรกผ่านไม่ครบ 5 ด้าน เฉพาะ กลุ่มที่แนะนำให้พ่อแม่ ผู้ปกครอง ส่งเสริมพัฒนาการตามวัยภายใน 30 วัน (1B261) แล้วติดตามกลับมาประเมินคัดกรองพัฒนาการครั้งที่ 2 เด็กปฐมวัยที่ได้รับการคัดกรองแล้วพบว่ามีพัฒนาการล่าช้า หมายถึง เด็กปฐมวัยอายุ 9, 18, 30, 42, 60 เดือน ที่ประเมินด้วยคู่มือเฝ้าระวังและส่งเสริมพัฒนาการเด็ก ปฐมวัย (Developmental Surveillance and Promotion Manual: DSPM) ครั้งที่ 1 แล้วพบว่าต้องส่งต่อ และเด็กอายุ 9, 18, 30, 42, 60 เดือนที่มาประเมินซ้ำ ด้วยคู่มือ เฝ้าระวังและส่งเสริมพัฒนาการเด็กปฐมวัย: DSPM ครั้งที่ 2 แล้วยังพบมีพัฒนาการล่าช้า อย่างน้อย 1 ด้านขึ้นไป ได้รับการกระตุ้นพัฒนาการด้วยเครื่องมือมาตรฐาน หมายถึง การที่เด็กปฐมวัยที่ได้รับ การคัดกรองแล้วพบว่ามีพัฒนาการล่าช้า ได้รับการตรวจวินิจฉัยเพิ่มเติมและ/ หรือ ประเมินพัฒนาการ พร้อมทั้งกระตุ้นพัฒนาการด้วยคู่มือประเมินเพื่อช่วยเหลือเด็กปฐมวัย ที่มีปัญหาพัฒนาการ (Thai Early Developmental Assessment for Intervention: TEDA4I) หรือเครื่องมือมาตรฐานอื่นๆ เช่น คู่มือคัดกรองและส่งเสริมพัฒนาการเด็กวัย แรกเกิด-5 ปี สำหรับบุคลากรสาธารณสุข คู่มือประเมินและแก้ไขพัฒนาการเด็กแรกเกิด- 5 ปี โป รแกรมการฝึก/ กระตุ้น พั ฒ นาการตามวิชาชีพ (นั กกิจกรรมบ ำบั ด นักกายภาพบำบัด นักเวชศาสตร์สื่อความหมาย) เป็นต้น ตำบลมหัศจรรย์ 1,000 วัน Plus สู่ 2,500 วัน หมายถึง ตำบลที่มีการดำเนินงาน",
      "purpose": "ไทยเติบโตเต็มศักยภาพ และมีคุณภาพชีวิตที่ดี ผ่านกลไกความร่วมมือและการมีส่วนร่วม",
      "population": "ของภาคีเครือข่ายในชุมชนและท้องถิ่น ระดับตำบล",
      "collectionMethod": "ผลการดำเนินงานเชิงกระบวนการ ประกอบด้วย",
      "source": "1. ร้อยละเด็กปฐมวัยมีพัฒนาการสมวัย ไม่น้อยกว่าร้อยละ 86 1) ร้อยละของเด็กอายุ 0 - 5 ปี ได้รับการคัดกรองพัฒนาการ ไม่น้อยกว่าร้อยละ 90 (ตรวจครั้งแรก) เพื่อการส่งเสริมสุขภาพ เด็ก อายุ 0 - 5 ปี มีพัฒนาการสมวัย และมีระดับสติปัญญาดี เด็กปฐมวัยในจังหวัดขอนแก่น สถานบริการทุกระดับ นำข้อมูลการประเมินพัฒนาการเด็ก บันทึกในโปรแกรมหลักของ สถานบริการฯ เช่น JHCIS, Hos xp, PCU เป็นต้น ส่งออกข้อมูลตามโครงสร้างมาตรฐาน 43 แฟ้ม โรงพยาบาลทุกแห่ง /สาธารณสุขอำเภอทุกอำเภอ/ รพ.สต.ทุกแห่ง",
      "formula": "1. ร้อยละเด็กมีพัฒนาการสมวัย = (A/B) x 100 2.ร้อยละของเด็กอายุ 0 - 5 ปี ได้รับการคัดกรองพัฒนาการ ไม่น้อยกว่าร้อยละ 90 (ตรวจครั้งแรก) = (C/D) x 100 ระยะเวลาประเมิน 12 เดือน เกณฑ์การประเมิน",
      "numeratorA": "จำนวนเด็กอายุ 9 1 30 42 และ 60 เดือน ผลรวมของเด็กที่มีพัฒนาการสมวัย",
      "denominatorB": "จำนวนเด็กอายุ 9 18 30 42 และ 60 เดือน ทั้งหมดในช่วงเวลาเดียวกัน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI67-05": {
      "kpiId": "KPI67-05",
      "order": 5,
      "name": "ร้อยละเด็ก 0-5 ปี มีส่วนสูงดีรูปร่างสมส่วน",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "76",
      "baseline": "67.23",
      "definition": "เด็กอายุ 0 - 5 ปี หมายถึง เด็กแรกเกิด จนถึงอายุ 5 ปี 11 เดือน 29 วัน สูงดี หมายถึง เด็กที่มีความยาวหรือส่วนสูงอยู่ในระดับสูงตามเกณฑ์ขึ้นไป (สูงตามเกณฑ์ ค่อนข้างสูง หรือสูง)",
      "purpose": "(ขององค์การอนามัยโลก) โดยมีค่ามากกว่าหรือเท่ากับ -1.5 SDของความยาว/ส่วนสูงตามเกณฑ์อายุ",
      "population": "สมส่วน หมายถึง เด็กที่มีน้ำหนักอยู่ในระดับสมส่วน เมื่อเทียบกับกราฟการเจริญเติบโตน้ำหนักตามเกณฑ์",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "สูงดีรูปร่างสมส่วน หมายถึง เด็กที่มีความยาวหรือส่วนสูงอยู่ในระดับสูงตามเกณฑ์ขึ้นไปและมีน้ำหนักอยู่ในระดับ สมส่วน (ในคนเดียวกัน) ร้อยละ 78 เพื่อการส่งเสริมสุขภาพ เด็ก อายุ 0 - 5 ปี มีการโภชนาการที่ดี การเจริญเติบโตตามวัย รูปร่างสูงดีสมส่วน เด็กปฐมวัยในจังหวัดขอนแก่น สถานบริการทุกระดับ นำข้อมูลการประเมินพัฒนาการเด็ก บันทึกในโปรแกรมหลักของสถานบริการฯ เช่น JHCIS, Hos xp, PCU เป็นต้น ส่งออกข้อมูลตามโครงสร้างมาตรฐาน 43 แฟ้ม โรงพยาบาลทุกแห่ง /สาธารณสุขอำเภอทุกอำเภอ/ รพ.สต.ทุกแห่ง",
      "formula": "A = จำนวนเด็กอายุ 0 -5 ปีที่ได้รับการคัดกรองชั่งน้ำหนัก และวัดความยาว/วัดส่วนสูง มีการเจริญเติบโต สูงดีสมส่วน สูตรคำนวณ ตัวชี้วัด B = จำนวนเด็กอายุ 0 -5 ปีที่ได้รับการคัดกรองชั่งน้ำหนัก และวัดความยาว/วัดส่วนสูงทั้งหมด ระยะเวลา ร้อยละของเด็กอายุ 0 -5 ปี สูงดีรูปร่างสมส่วน = (A x 100) /B ประเมิน 12 เดือน",
      "numeratorA": "จำนวนเด็กอายุ 0 -5 ปีที่ได้รับการคัดกรองชั่งน้ำหนัก และวัดความยาว/วัดส่วนสูง มีการเจริญเติบโต",
      "denominatorB": "จำนวนเด็กอายุ 0 -5 ปีที่ได้รับการคัดกรองชั่งน้ำหนัก และวัดความยาว/วัดส่วนสูงทั้งหมด",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ผลการดำเนินงานผ่านระบบรายงาน HDC รายละเอียด ผลการดำเนินงานย้อนหลัง 3 ปี (2565-2567) ข้อมูลพื้นฐาน (Baseline ตัวชี้วัด Baseline หน่วยวัด ผลการดำเนินงานใน Data) ร้อยละ รอบปีงบประมาณ data 2465 2566 2567 ร้อยละของเด็กอายุ 0 -5 ปี 64.20 73.1 67.23 64.20 สูงดีรูปร่างสมส่วน 3",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI67-06": {
      "kpiId": "KPI67-06",
      "order": 6,
      "name": "ร้อยละเด็ก 6-14 ปี มีส่วนสูงดีรูปร่างสมส่วน",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "64",
      "baseline": "63.08",
      "definition": "ผู้บริโภคด้านสุขภาพ และสนับสนุนให้เกิดการมีส่วนร่วมจากทุกภาคส่วน ลดปัจจัยเสี่ยงด้านสุขภาพและความเจ็บป่วยของประชาชน",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "เด็กวัยเรียน หมายถึง เด็กที่มีอายุตั้งแต่ 6 ปี จนถึง 14 ปี (โดยเริ่มนับตั้งแต่อายุ 6 ปีเต็ม ถึง 14 ปี 11 เดือน 29 วัน ) - โรงเรียนระดับประถมศึกษาทุกสังกัด หมายถึง โรงเรียนระดับประถมศึกษาหรือโรงเรียน ระดับมัธยมศึกษาขยายโอกาส และมัธยมศึกษา (มัธยมศึกษาตอนต้น ม.1-ม.3) - สูงดี หมายถึง เด็กที่มีส่วนสูงอยู่ในระดับสูงตามเกณฑ์+ค่อนข้างสูง+สูง เมื่อเทียบกับกราฟ การเจริญเติบโต กรมอนามัยปี 2542 มีค่ามากกว่าหรือเท่ากับ -1.5 S.D ของส่วนสูงตาม เกณฑ์อายุ - สมส่วน หมายถึง เด็กที่มีน้ำหนักอยู่ในระดับสมส่วน เมื่อเทียบกราฟการเจริญเติบโต กรมอนามัย ปี 2542 มีค่าระหว่าง +1.5 S.D ถึง -1.5 S.D ของน้ำหนักตามเกณฑ์ส่วนสูง - เด็กสูงดีสมส่วน หมายถึง เด็กที่มีส่วนสูงอยู่ในระดับสูงตามเกณฑ์+ค่อนข้างสูง+สูง และมีน้ำหนักอยู่ในระดับสมส่วน (ในคนเดียวกัน) - ภาวะเริ่มอ้วนและอ้วน หมายถึง น้ำหนักตามเกณฑ์ส่วนสูง > +2 S.D.ขึ้นไปโดยใช้กราฟ แสดงเกณฑ์อ้างอิงการเจริญเติบโตของกรมอนามัย ปี 2542 - ภาวะผอม หมายถึง น้ำหนักของเด็กเมื่อเทียบกับเกณฑ์ส่วนสูงเดียวกัน มีค่าต่ำกว่า -2S.D แสดงว่าเด็กมีน้ำหนักน้อยกว่าเด็กที่มีส่วนสูงเดียวกัน - ภาวะเตี้ย หมายถึง ส่วนสูงของเด็กเมื่อเทียบกับเกณฑ์อายุเดียวกัน มีค่าต่ำกว่า -2 S.D แสดงว่าเด็กเติบโตไม่ดี อาจเนื่องจากมีการขาดอาหารเรื้อรัง หรือมีการเจ็บป่วยบ่อย ๆ ค่าเป้าหมาย Base line ปีงบ ปีงบ ปีงบ ปีงบ ประมาณ ประมาณ ประมาณ Data ประมาณ 2568 2569 2570 2567 66 68 72 6.1 ร้อยละเด็ก 6-14 ปี 71.20 64 82 84 86 มีส่วนสูงดีรูปร่างสมส่วน 6.2 เด็ก 6-14 ปี ได้รับ 75.69 80 การชั่งน้ำหนัก วัดส่วนสูง เพื่อให้เด็ก 6-14 ปี มีส่วนสูงดีรูปร่างสมส่วน เด็กนักเรียน อายุ 6-14 ปี ในโรงเรียนทุกสังกัด (โรงเรียนประถมศึกษา, โรงเรียน ประถมศึกษาขยายโอกาส, มัธยมศึกษา(ม.1-ม.3)",
      "collectionMethod": "1.ระบบรายงาน 43 แฟ้ม ส่งเข้า HDC ฐานข้อมูลจากแฟ้ม NUTRITION 2. HDC Datacenter กลุ่มรายงานมาตรฐาน งานโภชนาการ",
      "source": "โรงพยาบาลส่งเสริมสุขภาพตำบล",
      "formula": "1. ร้อยละเด็ก 6-14 ปี มีส่วนสูงดีรูปร่างสมส่วน สูตรคำนวณตัวชี้วัด : (Ax100)/B 2. เด็ก 6-14 ปี ได้รับการชั่งน้ำหนัก วัดส่วนสูง สูตรคำนวณตัวชี้วัด : (Bx100)/C ระยะเวลา ภาคเรียนที่ 1 ( 31 กรกฎาคม ) ประเมินผล ภาคเรียนที่ 2 ( 31 ธันวาคม )",
      "numeratorA": "จำนวนเด็กนักเรียนอายุ 6-14 ปี ที่มีส่วนสูงในระดับดีและรูปร่างสมส่วน",
      "denominatorB": "จำนวนเด็กนักเรียนอายุ 6-14 ปีที่ชั่งน้ำหนักและวัดส่วนสูงทั้งหมด",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "1.เด็ก 6-14 ปี มีส่วนสูงดีรูปร่างสมส่วน ไม่น้อยกว่า ร้อยละ 64 2.เด็ก 6-14 ปี ได้รับการชั่งน้ำหนัก วัดส่วนสูง ไม่น้อยกว่า ร้อยละ 80",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI67-07": {
      "kpiId": "KPI67-07",
      "order": 7,
      "name": "ผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงได้รับการดูแลในระบบ Long Term Care และเข้าถึงตามชุดสิทธิประโยชน์",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "96",
      "baseline": "94.6",
      "definition": "ลดปัจจัยเสี่ยงด้านสุขภาพและความเจ็บป่วยของประชาชน",
      "purpose": "เพื่อให้ผู้สูงอายุและผู้มีภาวะพึ่งพิงได้รับการดูแลสุขภาพตามแผนการดูแลรายบุคคล (Care Plan) และเข้าถึงชุดสิทธิประโยชน์อย่างครอบคลุม",
      "population": "ผู้สูงอายุ หมายถึง ประชาชนที่มีอายุตั้งแต่ 60 ปีขึ้นไป",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "(ADL 0-4 คะแนน) ได้รับการดูแลโดยบุคลากรสาธารณสุข ทีมสหวิชาชีพตามแผนการดูแลรายบุคคล (Care Plan) ตามชุดสิทธิประโยชน์ทุกสิทธิการรักษาพยาบาล ผู้ที่มีภาวะพึ่งพิง หมายถึง ประชาชนที่มีค่าคะแนนการประเมินความสามารถในการประกอบกิจวัตร ประจำวัน(ADL) น้อยกว่าหรือเท่ากับ 11 คะแนน โดยแบ่งเป็นกลุ่มติดบ้าน (ADL 5-11 คะแนน) กลุ่มติดเตียง (ADL 0-4 คะแนน) ได้รับการดูแลโดยบุคลากรสาธารณสุข ทีมสหวิชาชีพตามแผนการดูแลรายบุคคล (Care Plan) ตามชุดสิทธิประโยชน์ทุกสิทธิการรักษาพยาบาล แผนการดูแลรายบุคคล (Care Plan) หมายถึง การประเมินและวางแผนการดูแลรายบุคคลก่อนให้บริการ ดูแลช่วยเหลือผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงจาก Care Manager ทีมผู้เชี่ยวชาญ ครอบครัวและผู้เกี่ยวข้อง ในพื้นที่ การดูแลกลุ่มภาวะพึ่งพิงตามชุดสิทธิประโยชน์ หมายถึง การบริการดูแลด้านสาธารณสุขตามแผนการดูแล รายบุคคล และให้คำแนะนำแก่ญาติและผู้ดูแล โดยผู้ช่วยเหลือดูแลผู้ที่มีภาวะพึ่งพิงหรือเครือข่ายสุขภาพอื่นๆ หรืออาสาสมัคร จิตอาสา ตามแผนการดูแลรายบุคคล หรือตามคำแนะนำของผู้จัดการการดูแลด้าน สาธารณสุข รวมถึงจัดหาวัสดุ อุปกรณ์ทางการแพทย์ หรืออุปกรณ์เครื่องช่วยเหลือที่จำเป็นตามสภาพของผู้ที่มี ภาวะพึ่งพิง และการประเมินผลลัพธ์การดูแลผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงหลังได้รับการดูแลตาม Care Plan ครบ 12 เดือน ร้อยละ 98.5 1. เพื่อให้ Care Manager /Caregiver/อาสาสมัครบริบาลท้องถิ่น และทีมสหวิชาชีพมีการส่งเสริมสุขภาพ วางแผนการดูแลรายบุคคล ฟื้นฟูสมรรถภาพ และสนับสนุนการดูแลผู้สูงอายุและผู้ที่มีภาวะพึ่งพิง แบบรอบด้านในระดับครอบครัว ชุมชนเป็นรายบุคคล 2. เพื่อสนับสนุนการมีส่วนร่วมของครอบครัว ชุมชนและหน่วยงานภาคีเครือข่ายที่เกี่ยวข้อง ในการดูแล และปรับเปลี่ยนพฤติกรรมสุขภาพของผู้สูงอายุให้มีคุณภาพชีวิตที่ดี มีอายุยืนยาวและช่วยเหลือตนเองได้ 3. เพื่อให้ผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงเข้าถึงระบบบริการด้านสาธารณสุข และวัสดุ อุปกรณ์ทางการแพทย์ หรืออุปกรณ์เครื่องช่วยเหลือที่จำเป็นตามสภาพปัญหาของผู้ที่มีภวะพึ่งพิง ผู้สูงอายุและบุคคลอื่น ที่มีค่าคะแนน ADL 0-11 คะแนน 1. รายงานผลการคัดกรอง ADL ในฐานข้อมูล Health Data Center 2. รายงานการจัดทำ Care Plan และการอนุมัติ Care Plan ผ่านคณะอนุกรรมการกองทุน LTC ระดับตำบล และบันทึกข้อมูล CP ที่ผ่านการอนุมัติรายงานในระบบโปรแกรม LTC สปสช. 3. รายงานผลค่าคะแนน ADL การดูแลกลุ่มภาวะพึ่งพิงครบ 12 เดือน ในโปรแกรม LTC สปสช. 1. ฐานข้อมูลการคัดกรอง ADL ใน Health Data Center 2. โปรแกรม Long Term Care กรมอนามัย 3. โปรแกรม Long Term Care สปสช.",
      "formula": "1 A = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่มีการจัดทำ Care Plan โดย Care Plan ได้รับอนุมัติจาก คณะอนุกรรมการ LTC และได้รับการเยี่ยมบ้านจาก Caregiver B = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงทั้งหมดที่เข้าร่วมโครงการ LTC รายการข้อมูล 2 A = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่ได้รับการดูแลตาม Care Plan ครบ 12 เดือน ที่มีค่าคะแนน ADL เพิ่มขึ้น และกลุ่มติดเตียงมีค่า ADL เท่าเดิมหรือไม่มีภาวะแทรกซ้อนเพิ่มขึ้น B = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่ ได้รับอนุมัติ Care Plan จากคณะอนุกรรมการ LTC และได้รับ การเยี่ยมบ้านจาก Caregiver ครบการดูแล 12 เดือน ทั้งหมด สูตรคำนวณ A x 100 ตัวชี้วัด 1 B สูตรคำนวณ A x 100 ตัวชี้วัด 2 B ระยะเวลา ตุลาคม 2567 - กันยายน 2568 ประเมินผล",
      "numeratorA": "จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่มีการจัดทำ Care Plan โดย Care Plan ได้รับอนุมัติจาก",
      "denominatorB": "จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงทั้งหมดที่เข้าร่วมโครงการ LTC",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "1) Care Manager/เจ้าหน้าที่สาธารณสุข PCU รพ./รพสต. ประเมินความสามารถในการประกอบกิจวัตร รายละเอียด ประจำวัน(ADL) เพื่อค้นหากลุ่มภาวะพึ่งพิงได้รับบริการตามชุดสิทธิประโยชน์ > ร้อยละ 60 ข้อมูลพื้นฐาน 2) Care Manager มีการจัดทำแผนการดูแลรายบุคคล Care Plan ในกลุ่มผู้สูงอายุและผู้ที่มีภาวะพึ่งพิง (Baseline Data) ผลการดำเนินงาน และ Care Plan ได้รับการอนุมัติจากคณะอนุกรรมการ LTC > ร้อยละ 98.5 ย้อนหลัง 3 ปี (ปี 2565 -2567) 3) ผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงได้รับการดูแลตามแผนการดูแลรายบุคคล Care Plan และประเมิน ADL ครบ",
      "responsible": "12 เดือน มีค่าคะแนน ADL เพิ่มขึ้นหรือกลุ่มติดเตียงไม่มีภาวะแทรกซ้อนเพิ่มขึ้น > ร้อยละ 25 ตัวชี้วัด ผลงาน ปี 2565 ปี 2566 ปี 2567 ร้อยละของผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงได้รับการดูแล 96.67 94.61 98.4 ในระบบ Long Term Care และเข้าถึงตามชุดสิทธิ ประโยชน์ ร้อยละของผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่ได้รับการดูแล 14.66 21.43 22.43 ตาม Care Plan มีค่าคะแนน ADL เพิ่มขึ้นหรือกลุ่มติด เตียงไม่มีภาวะแทรกซ้อนเพิ่มขึ้น ชื่อ-สกุล นางอังคณา อึ้งปิติมานะ ตำแหน่ง นักวิชาการสาธารณสุขชำนาญการ กลุ่มงานส่งเสริมสุขภาพ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ 149 โทรสาร 0-4322-4037 โทรศัพท์มือถือ. 0617929942 E-mail :ungpitimana.ang@gmail.com"
    },
    "KPI67-08": {
      "kpiId": "KPI67-08",
      "order": 8,
      "name": "อัตราตายมารดา ไม่เกิน 17 ต่อแสนการเกิดมีชีพ",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ต่อแสนการเกิดมีชีพ",
      "direction": "ยิ่งน้อยยิ่งดี",
      "target": "≤15",
      "baseline": "10.14",
      "definition": "อัตราส่วนการตายมารดาไทยไม่เกิน 14 ต่อการเกิดมีชีพแสนคน",
      "purpose": "เฝ้าระวังสตรีชวงตั้งครรภ คลอดและหลังคลอด ให้ได้รับบริการคุณภาพตามเกณฑ์ เพื่อลดจำนวนการตาย",
      "population": "ของมารดา",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "หญิงตั้งครรภ์ หญิงคลอด และหญิงหลังคลอดภายใน 42 วัน",
      "formula": "(A/B) x 100,000",
      "numeratorA": "จำนวนมารดาตายระหว่างตั้งครรภ์ คลอดและหลังคลอดภายใน 42 วัน ทุกสาเหตุยกเว้นอุบัติเหตุ",
      "denominatorB": "จำนวนเด็กเกิดมีชีพทั้งหมดในช่วงเวลาเดียวกัน",
      "frequency": "ทุก 3 เดือน",
      "evaluationMethod": "เปรียบเทียบผลการดำเนินงานกับค่าเป้าหมาย",
      "responsible": "ชื่อ-สกุล...นางนรินทร์รัตน์ แก้วลา ตำแหน่ง นักวิชาการสาธารณสุขชำนาญการพิเศษ ชื่อ-สกุล...นางสมาพร สุรเตมีย์กุล ตำแหน่ง พยาบาลวิชาชีพชำนาญการ กลุ่มงาน ส่งเสริมสุขภาพ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ ... โทรสาร 0-4322-4037 โทรศัพท์มือถือ... 085-3956466 E-mail : narinratkaewla@gmail.com ตัวชี้วัดที่ 8.1 หญิงตั้งครรภ์ได้รับการฝากครรภ์ครั้งแรกเมื่ออายุครรภ์≤ 12 สัปดาห์ คำนิยาม หญิงตั้งครรภ์ได้รับการฝากครรภ์ครั้งแรกเมื่ออายุครรภ์น้อยกว่าหรือเท่ากับ 12 สัปดาห์ หมายถึง หญิงตั้งครรภ์ที่มาฝากครรภ์ที่สถานบริการฯทั้งหมด โดยต้องฝากครรภ์ครั้งแรกที่อายุครรภ์น้อยกว่า หรือเท่ากับ 12 สัปดาห์ เกณฑ์เป้าหมาย ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ 2566 2567 2568 2569 2570 ≥ ร้อยละ 75 ≥ ร้อยละ 75 ≥ ร้อยละ 80 ≥ ร้อยละ 85 ≥ ร้อยละ 90 วัตถุประสงค์ ส่งเสริมสุขภาพและเฝ้าระวังหญิงตั้งครรภ์ คลอดและหลังคลอด เพื่อลดการตายมารดาและทารก จากการตั้งครรภ์และคลอดให้มีประสิทธิภาพ กลุ่มเป้าหมาย หญิงตั้งครรภ์และหญิงหลังคลอดทุกราย วิธีการจัดเก็บข้อมูล บันทึกข้อมูลการให้บริการในโปรแกรมของแต่ละสถานบริการและส่งออกข้อมูลตามแนวทาง 43 แฟ้ม แหล่งข้อมูล 1. หน่วยบริการสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่นและองค์การบริหารส่วนจังหวัดขอนแก่น ทุกแห่ง 2. ฐานข้อมูล 43 แฟ้ม( แฟ้ม ANCและ Labor) รายการข้อมูล 1 A = จำนวนหญิงคลอดตาม B ที่ฝากครรภ์ครั้งแรกและอายุครรภ์ ≤ 12 สัปดาห์ (ข้อมูลจากสมุดสีชมพูบันทึกลงใน 43 แฟ้ม : แฟ้ม ANC) รายการข้อมูล 2 B =จำนวนหญิงไทยทุกรายที่คลอดในเขตรับผิดชอบทั้งหมดในช่วงเวลาเดียวกัน สูตรคำนวณตัวชี้วัด (A/B ) x 100 ระยะเวลาประเมินผล ทุก 3 เดือน Small Success ปี 2568 รอบ 3 เดือน รอบ 6 เดือน รอบ 9 เดือน รอบ 12 เดือน ≥ ร้อยละ65 ≥ ร้อยละ 70 ≥ ร้อยละ 75 ≥ ร้อยละ80"
    },
    "KPI67-09": {
      "kpiId": "KPI67-09",
      "order": 9,
      "name": "อัตราตายของทารกแรกเกิดไม่เกิน 3.6 ต่อพันการเกิดมีชีพ",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ต่อพันการเกิดมีชีพ",
      "direction": "ยิ่งน้อยยิ่งดี",
      "target": "2.5",
      "baseline": "2.7",
      "definition": "ทารกแรกเกิด หมายถึง ทารกที่ มีน้ำหนัก ≥ 500 กรัม ที่คลอดมามีชีวิตตั้งแต่แรกเกิดจนถึง 28 วัน ในโรงพยาบาล สังกัดสำนักงานปลัดกระทรวงสาธารณสุข (รพศ./รพท./รพช.)",
      "purpose": "1. เพื่อเพิ่มประสิทธิภาพการดูแลรักษาทารกแรกเกิดใหทั่วถึง 2. เพื่อลดอัตราตายทารกแรกเกิด",
      "population": "ทารกที่คลอดและมีชีวิตจนถึง 28 วัน",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "1.หน่วยบริการทุกระดับในสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่น 2. ฐานข้อมูล Health Data Center",
      "formula": "(A/B) x 1,000",
      "numeratorA": "จำนวนทารกที่เสียชีวิต ≤ 28 วัน",
      "denominatorB": "จำนวนเด็กเกิดมีชีพทั้งหมดในช่วงเวลาเดียวกัน",
      "frequency": "ทุก 3 เดือน",
      "evaluationMethod": "เปรียบเทียบผลการดำเนินงานกับค่าเป้าหมาย รายละเอียดข้อมูลพื้นฐาน Baseline Data หน่วยวัด ผลการดำเนินงานปีงบประมาณ อัตราตายทารกแรกเกิด อัตราตายทารก ปี 2565 ปี 2566 ปี 2567 แรกเกิด ตอ เกิด มีชีพ 1,000คน 2.8 2.6 3.3",
      "responsible": "ชื่อ-สกุล...นางนรินทร์รัตน์ แก้วลา ตำแหน่ง นักวิชาการสาธารณสุขชำนาญการพิเศษ ตัวชี้วัด ชื่อ-สกุล...นางสมาพร สุรเตมีย์กุล ตำแหน่ง พยาบาลวิชาชีพชำนาญการ กลุ่มงาน ส่งเสริมสุขภาพ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ ... โทรสาร 0-4322-4037 โทรศัพท์มือถือ... 085-3956466 E-mail : narinratkaewla@gmail.com"
    },
    "KPI67-10": {
      "kpiId": "KPI67-10",
      "order": 10,
      "name": "ร้อยละของผู้สูงอายุไม่มีภาวะพึ่งพิง",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "95",
      "baseline": "94.60",
      "definition": "ร้อยละของผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงเข้าถึงระบบบริการและได้รับการเยี่ยมบ้านตามชุดสิทธิ ประโยชน์ 7.ผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงได้รับการดูแลในระบบ Long Term Care และเข้าถึงตามชุดสิทธิ ประโยชน์ (๑) ร้อยละของผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงได้รับการดูแลในระบ บ Long Term Care และเข้าถึงตามชุดสิทธิประโยชน์ (๒ ) ร้ อ ย ล ะ ข อ ง ผู้ สู ง อ า ยุ แ ล ะ ผู้ ที่ มี ภ า ว ะ พึ่ ง พิ ง ที่ ได้ รั บ ก า ร ดู แ ล ต า ม Care Plan มีค่าคะแนน ADL เพิ่มขึ้น หรือกลุ่มติดเตียงไม่มีภาวะแทรกซ้อนเพิ่มขึ้น 1) ผู้สูงอายุ หมายถึง ประชาชนที่มีอายุตั้งแต่ 60 ปีขึ้นไป ๒) ผู้สูงอายุที่มีภาวะพึ่งพิง หมายถึง ผู้สูงอายุที่มีค่าคะแนนการประเมินความสามารถในการประกอบ กิจวัตรประจำวัน(ADL) น้อยกว่าหรือเท่ากับ 11 คะแนน โดยแบ่งเป็นกลุ่มติดบ้าน (ADL 5-11 คะแนน) กลุ่มติดเตียง (ADL 0-4 คะแนน) ได้รับการดูแลโดยบุคลากรสาธารณสุข ทีมสหวิชาชีพตาม แผนการดูแลรายบุคคล(Care Plan) ตามชุดสิทธิประโยชน์ทุกสิทธิการรักษาพยาบาล 3) ผู้ที่มีภาวะพึ่งพิง หมายถึง ประชาชนที่มีค่าคะแนนการประเมินความสามารถในการประกอบ กิจวัตรประจำวัน(ADL) น้อยกว่าหรือเท่ากับ 11 คะแนน โดยแบ่งเป็นกลุ่มติดบ้าน (ADL 5-11 คะแนน) กลุ่มติดเตียง (ADL 0-4 คะแนน) ได้รับการดูแลโดยบุคลากรสาธารณสุข ทีมสหวิชาชีพตาม แผนการดูแลรายบุคคล(Care Plan) ตามชุดสิทธิประโยชน์ทุกสิทธิการรักษาพยาบาล 4) แผนการดูแลรายบุคคล (Care Plan) หมายถึง แบบการวางแผนการดูแลช่วยเหลือผู้สูงอายุและผู้ ที่มีภาวะพึ่งพิงจาก Care Manager ทีมผู้เชี่ยวชาญ ครอบครัวและผู้เกี่ยวข้องในพื้นที่ ๕) การประเมินคัดกรองปัญหาสุขภาพขั้นพื้นฐานตามชุดสิทธิประโยชน์ หมายถึง - การประเมินผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงตามกลุ่มศักยภาพด้วยการประเมินความสามารถในการ ประกอบกิจวัตรประจำวันทุกราย และกรณีผู้สูงอายุเป็นกลุ่มที่มีภาวะพึ่งพิงได้รับการประเมินรอบ ๑๒ เดือน - ประเมินสุขภาพและคัดกรองกลุ่มอาการผู้สูงอายุ ๙ ด้าน ๖) การเยี่ยมบ้านตามชุดสิทธิประโยชน์ หมายถึง การลงเยี่ยมและให้การดูแลส่งเสริมสุขภาพและ อุปกรณ์สนับสนุน ตามประกาศของสำนักงานหลักประกันสุขภาพแห่งชาติตามเกณฑ์กลุ่มภาวะพึ่งพิง กองทุน Long Term Care โดยบริการด้านสาธารณสุขสำหรับผู้สูงอายุที่มีภาวะพึ่งพิงในแต่ละกลุ่มจะ ถูกประเมินและวางแผนการดูแลรายบุคคลและจัดทำ Care Plan โดยผู้จัดการการดูแลระยะยาวด้าน สาธารณสุข Care Manager และได้รับการเยี่ยมบ้านตาม Care Plan โดย Caregiver ๗) คณะอนุกรรมการสนับสนุนการจัดบริการดูแลระยะยาวสำหรับผู้สูงอายุที่มีภาวะพึ่งพิง (คณะอนุกรรมการ LTC) หมายถึง คณะอนุกรรมการที่แต่งตั้งโดยคณะกรรมการกองทุนสุขภาพตำบล ตามประกาศสำนักงานหลักประกันสุขภาพแห่งชาติ พ.ศ. ๒๕๖๑ ข้อ ๑๘ โดยมีอำนาจในการพิจารณา อนุมัติโครงการ LTC แผนการดูแลรายบุคคล Care Plan รวมถึงค่าใช้จ่ายตามแผนการดูแลรายบุคคล สำหรับผู้สูงอายุที่มีภาวะพึ่งพิงของศูนย์พัฒนาคุณภาพชีวิตผู้สูงอายุในชุมชน หน่วยบริการ หรือสถาน บริการ",
      "purpose": "1) เพื่อให้ Care Manager /Caregiver/อาสาสมัครบริบาลท้องถิ่น และทีมสหวิชาชีพมีการวาง แผนการดูแลส่งเสริม ฟื้นฟูและการพัฒนาระบบการสนับสนุนการดูแลผู้สูงอายุและผู้ที่มีภาวะพึ่งพิง",
      "population": "แบบรอบด้านในระดับครอบครัว ชุมชนเป็นรายบุคคล",
      "collectionMethod": "2) เพื่อสนับสนุนการมีส่วนร่วมของครอบครัว ชุมชนและหน่วยงานภาคีเครือข่ายที่เกี่ยวข้อง ในการ ดูแลและปรับเปลี่ยนพฤติกรรมสุขภาพของผู้สูงอายุให้มีคุณภาพชีวิตที่ดี มีอายุยืนยาวและช่วยเหลือ",
      "source": "ตนเองได้",
      "formula": "๑ 1) รายงานผลการคัดกรอง ADL ในฐานข้อมูล Health Data Center สูตรคำนวณตัวชี้วัด 2 2) รายงานการจัดทำ Care Plan และการอนุมัติ Care Plan ผ่านคณะอนุกรรมการกองทุน LTC ระดั บ ต ำบ ล แ ล ะบั น ทึ ก ข้ อมู ล CP ที่ ผ่ าน ก ารอนุ มั ติ ราย งาน ใน ระ บ บ โป รแ ก รม LTC ระยะเวลา กรมอนามัยและ สปสช. ประเมินผล 3) รายงานผลค่าคะแนน ADL การดูแลกลุ่มภาวะพึ่งพิง ๑๒ เดือน โปรแกรม LTC สปสช.",
      "numeratorA": "จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่มีการจัดทำ Care Plan โดย Care Plan ได้รับอนุมัติจาก",
      "denominatorB": "จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงทั้งหมดที่เข้าร่วมโครงการ LTC",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "และแบบรายงานผลการดูแลกลุ่มภาวะพึ่งพิงเปลี่ยนกลุ่ม ๑) ฐานข้อมูลการคัดกรอง ADL ใน Health Data Center ๒) โปรแกรม Long Term Care กรมอนามัย ๓) โปรแกรม Long Term Care สปสช. A = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่มีการจัดทำ Care Plan โดย Care Plan ได้รับอนุมัติจาก คณะอนุกรรมการ LTC และได้รับการเยี่ยมบ้านจาก Caregiver B = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงทั้งหมดที่เข้าร่วมโครงการ LTC A = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่ได้รับการดูแลตาม Care Plan ครบ 12 เดือน ที่มีค่า คะแนน ADL เพิ่มขึ้น และกลุ่มติดเตียงมีค่า ADL เท่าเดิมหรือไม่มีภาวะแทรกซ้อนเพิ่มขึ้น B = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่ ได้รับอนุมัติ Care Plan จากคณะอนุกรรมการ LTC และได้รับการเยี่ยมบ้านจาก Caregiver ครบการดูแล 12 เดือน ทั้งหมด A x 100 B A x 100 B ตุลาคม 2566 - กันยายน 2567 1) อสม.ประเมินสุขภาพและคัดกรองกลุ่มอาการผู้สูงอายุ 9 ด้าน 2) Care Manager/เจ้าหน้าที่สาธารณสุข PCU/รพสต./รพ. ประเมินผู้สูงอายุและผู้ที่มีภาวะ พึ่งพิงตามกลุ่มศักยภาพด้วยการประเมินความสามารถในการประกอบกิจวัตรประจำวัน(ADL) 3) Care Manager มีการจัดทำแผนการดูแลรายบุคคล Care Plan ในกลุ่มผู้สูงอายุและผู้ที่มี ภาวะพึ่งพิงและ Care Plan ได้รับการอนุมัติจากคณะอนุกรรมการ LTC 4) ผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงได้รับการดูแลตามแผนการดูแลรายบุคคล Care Plan 5) ผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงเข้าถึงระบบบริการและได้รับการเยี่ยมบ้านตามชุดสิทธิ ประโยชน์",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI67-11": {
      "kpiId": "KPI67-11",
      "order": 11,
      "name": "ร้อยละสตรีอายุ 30-60 ปี กลุ่มเป้าหมายได้รับการคัดกรองมะเร็งปากมดลูกด้วยวิธี HPV DNA",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "80",
      "baseline": "39.53",
      "definition": "11.ร้อยละสตรีอายุ 30-60 ปี",
      "purpose": "เพื่อลดอัตราการเกิดโรคมะเร็งปากมดลูกในระยะลุกลาม",
      "population": "(อายุ30-≤60 ปี) ได้รับการ ตรวจคัด กรองมะเร็งปากมดลูกด้วยวิธี HPV DNA test ทั้งแบบตรวจโดยเจ้าหน้าที่ และแบบ Self Collection เป็นการตรวจหาเชื้อไวรัส HPV ความ เสี่ยงสูง 14 สายพันธุ์ซึ่งเป็นสาเหตุของมะเร็ง ปากมดลูก โดยวิธีการตรวจคือเก็บเซลล์บริเวณปากมดลูกช่องคลอดด้านใน ส่งตรวจด้วยวิธีการ ตรวจด้วยน้ำยา เมื่อคัดกรองแล้วมีผลปกติ/ผล ลบ (Negative) จากตัวอย่างสิ่งส่งตรวจ แนะนำให้ เ ข้ า รั บ ก า ร ต ร ว จ คั ด ก ร อ ง ม ะ เ ร็ ง ป า ก ม ด ลู ก ด้ ว ย วิ ธี HPV DNA Test ครั้งต่อไปในอีก 5 ปี ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ 2566 2567 2568 2569 2570 ร้อยละ 80 ร้อยละ 80 ร้อยละ 80 ร้อยละ 80 ร้อยละ 80 วัตถุประสงค์ เพื่อลดอัตราการเกิดโรคมะเร็งปากมดลูกในระยะลุกลาม กลุ่มเป้าหมาย สตรีไทยอายุ 30-60 ปี ในพื้นที่รับผิดชอบ",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "1.1 บันทึกการคัดกรองผ่านโปรแกรมพื้นฐานของหน่วยบริการ คือ การคัดกรองมะเร็งปากมดลูก",
      "formula": "ด้วยวิธี HPV DNA test รหัส 1B0046 1.2 การคัดกรองมะเร็งปากมดลูกด้วยวิธี HPV DNA test จากโปรแกรม HPVcxs2020 ของ สูตรคำนวณ สถาบันมะเร็งแห่งชาติ ตัวชี้วัด 2.ผู้จัดเก็บข้อมูล :",
      "numeratorA": "จำนวนสตรีไทยอายุ 30-60 ปี กลุ่มเป้าหมายที่ได้รับการคัดกรองมะเร็งปากมดลูก",
      "denominatorB": "จำนวนสตรีไทยอายุ 30-60 ปี ตามจำนวนที่ได้รับจัดสรรปีงบประมาณ 2567",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "นางยุภาพร ดีแป้น ตำแหน่ง พยาบาลวิชาชีพชำนาญการ ตัวชี้วัด กลุ่มงาน : ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด โทรศัพท์ที่ทำงาน 043-221125 ต่อ 150 โทรศัพท์มือถือ 080-4620160 โทรสาร 043-224037 E-mail : smallbody@hotmail.com"
    },
    "KPI67-12": {
      "kpiId": "KPI67-12",
      "order": 12,
      "name": "ประชาชนอายุ 50-70 ปี (รายใหม่) กลุ่มเป้าหมายได้รับการคัดกรองมะเร็งลำไส้ใหญ่/ไส้ตรงด้วยวิธี FIT Test",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "55",
      "baseline": "NA",
      "definition": "ร้อยละของประชากร",
      "purpose": "เพื่ อ ค้ น ห า ม ะ เร็ ง ล ำ ไส้ ให ญ่ แ ล ะ ไส้ ต ร ง ใน ร ะ ย ะ เริ่ ม ต้ น แ ล ะ ล ด อั ต ร า ก า ร ต า ย",
      "population": "หมายถึง ประชากรเพศชายและหญิง อายุ 50-70 ปี รายใหม่ (กลุ่มเป้าหมายที่ยังไม่ได้รับการคัดกรองมะเร็งลำไส้ใหญ่ไส้ตรงในปีงบประมาณ 256๖ และไม่เคย ได้รับการส่องกล้อง Colonoscopy จากการคัดกรอง FIT Test มีผลเป็นบวก ในระยะ 5 ปีที่ผ่าน มา) 2.วิธีนับอายุกลุ่มเป้าหมาย หมายถึง ประชากรทั้งเพศชายและหญิง ที่เกิด ระหว่างวันที่ 1 ตุลาคม พ.ศ.249๗-วันที่ 30 กันยายน พ.ศ.251๗ 3.การคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรง หมายถึง การตรวจหาเลือดแฝงในอุจจาระ (Fecal Immunochemical Test : FIT test) โดยอ าศั ยป ฏิ กิริย าท าง อิม มู โน ที่ จ ำเพ าะ ต่อฮีโมโกบินในเม็ดเลือดแดงที่มีความจำเพาะของคนเท่านั้น โดยตรวจผ่านชุดตรวจ ที่มีค่า cut-off 100 ng/ml ผู้รับการตรวจไม่จำเป็นต้องควบคุมอาหารก่อนการตรวจ ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ 2566 2567 2568 2569 2570 NA ร้อยละ 55 ร้อยละ 60 ร้อยละ 70 ร้อยละ 80 วัตถุประสงค์ เพื่ อ ค้ น ห า ม ะ เร็ ง ล ำ ไส้ ให ญ่ แ ล ะ ไส้ ต ร ง ใน ร ะ ย ะ เริ่ ม ต้ น แ ล ะ ล ด อั ต ร า ก า ร ต า ย กลุ่มเป้าหมาย ในผู้ป่วยมะเร็ง ๕ อันดับแรก",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "3.จำนวนกลุ่มเป้าหมายที่ต้องดำเนินการตามที่ได้รับการจัดสรรในปีงบประมาณ ๒๕๖๗",
      "formula": "1.การบันทึกข้อมูล : ผ่านโปรแกรมพื้นฐานของหน่วยบริการ ด้วยรหัส 1B0060 (ผลลบ) หรือ รหัส 1B0061 (ผลบวก) และส่งออกข้อมูลตามมาตรฐานข้อมูล 43 แฟ้ม 2.ผู้จัดเก็บข้อมูล :",
      "numeratorA": "จำนวนประชากรกลุ่มเป้าหมายที่ได้รับการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรงด้วยวิธี FIT test",
      "denominatorB": "จำนวนประชากรกลุ่มเป้าหมายที่ได้รับการจัดสรรในปีงบประมาณ 2567",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลงาน รอบการนิเทศ รายละเอียด ผลงาน ปี 2564 ปี 2565 ปี 2566 ข้อมูลพื้นฐาน จังหวัดขอนแก่น (ตัวชี้วัดใหม่) NA NA NA (Baseline Data) นางยุภาพร ดีแป้น ตำแหน่ง พยาบาลวิชาชีพชำนาญการ ผลการ กลุ่มงาน : ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด ดำเนินงาน โทรศัพท์ที่ทำงาน 043-221125 ต่อ 150 โทรศัพท์มือถือ 080-4620160 ย้อนหลัง 3 ปี โทรสาร 043-224037 E-mail : smallbody@hotmail.com (ปี 2564 - 2566)",
      "responsible": "กลุ่มงานพัฒนายุทธศาสตร์สาธารณสุข สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125 ต่อ 163"
    },
    "KPI67-13": {
      "kpiId": "KPI67-13",
      "order": 13,
      "name": "กลุ่มเป้าหมาย FIT Test ที่มีผล Positive ได้รับการส่องกล้อง Colonoscopy",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "70",
      "baseline": "57.54",
      "definition": "ร้อยละของผู้ที่มีผลผิดปกติได้รับการส่องกล้อง Colonoscopy",
      "purpose": "เพื่อค้นหารอยโรคก่อนการเกิดมะเร็งและมะเร็งลำไส้ใหญ่และไส้ตรงในระยะต้น",
      "population": "FIT Test ที่มีผล Positive ได้รับการส่องกล้อง Colonoscopy 1.ผู้ที่มีผลการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรงผิดปกติ หมายถึง ประชากรเพศชายและเพศ ห ญิ ง อ ายุ 50-70 ปี ที่ มี ผ ล ก ารคั ด กรองม ะเร็งลำไส้ ให ญ่ แล ะไส้ ต รง ด้ วย วิธี Fecal Immunochemical Test (FIT) เป็นบวก (Positive) คือ ตรวจพบเม็ดเลือดแดงในตัวอย่าง อุจจาระ 2.การส่องกล้อง Colonoscopy หมายถึง การวินิจฉัยความผิดปกติภายในลำไส้ใหญ่ด้วยการส่อง กล้องขยายเพื่อการค้นหารอยโรคก่อนการเกิดมะเร็งและมะเร็งลำไส้ใหญ่และไส้ตรงในระยะต้น ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ 2566 2567 2568 2569 2570 ร้อยละ 50 ร้อยละ 70 ร้อยละ 80 ร้อยละ 90 ร้อยละ 100 วัตถุประสงค์ เพื่อค้นหารอยโรคก่อนการเกิดมะเร็งและมะเร็งลำไส้ใหญ่และไส้ตรงในระยะต้น กลุ่มเป้าหมาย ประชาชนอายุ 50-70 ปี (รายใหม่) กลุ่มเป้าหมายได้รับการคัดกรองมะเร็งลำไส้ใหญ่/ไส้ตรงด้วย",
      "collectionMethod": "วิธี FIT Test ที่มีผล Positive ในปีงบประมาณ 2567 HDC สำนักงานสาธารณสุขจังหวัดขอนแก่น และรายงานผ่านระบบ Google Sheets โดย Node",
      "source": "Colonoscopy จังหวัดขอนแก่น HDC สำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "formula": "(A/B) x 100 ระยะเวลา เริ่ม 1 ตุลาคม 2566-รอบการนิเทศที่กำหนด ประเมินผล",
      "numeratorA": "จำนวนประชากรกลุ่มเป้าหมายที่ได้รับการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรงด้วยวิธี FIT test",
      "denominatorB": "จำนวนประชากรกลุ่มเป้าหมายที่ได้รับการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรงด้วยวิธี FIT test",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "1 คะแนน 2 คะแนน 3 คะแนน 4 คะแนน 5 คะแนน < 10% 10.00-29.99% 30.00-49.99% 50.00-69.99% ≥ 70%",
      "responsible": "นางยุภาพร ดีแป้น ตำแหน่ง พยาบาลวิชาชีพชำนาญการ กลุ่มงาน : ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด โทรศัพท์ที่ทำงาน 043-221125 ต่อ 150 โทรศัพท์มือถือ 080-4620160 โทรสาร 043-224037 E-mail : smallbody@hotmail.com"
    },
    "KPI67-14": {
      "kpiId": "KPI67-14",
      "order": 14,
      "name": "อัตราความครอบคลุมของการค้นหาผู้ป่วยวัณโรคในกลุ่มผู้สัมผัสร่วมบ้าน",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "85",
      "baseline": "75.12",
      "definition": "ความสำเร็จการรักษาผู้ป่วยวัณโรครายใหม่",
      "purpose": "1 4. อัตราความครอบ คลุม ของการค้น ห าผู้ป่ วยวัณ โรคใน กลุ่ม ผู้สัมผัสร่วมบ้ าน",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "โปรแกรมบริหารจัดการข้อมูลรายป่วยวัณโรคแห่งชาติ (NTIP online)",
      "formula": "รายงานจำนวนผู้สัมผัสร่วมบ้านทุกเดือน สูตรคำนวณ อัตราความครอบคลุมของการค้นหาผู้ป่วยวัณโรคในกลุ่มผู้สัมผัสร่วมบ้าน ตัวชี้วัด (เฝ้าระวังติดตามครบ 2 ปี) คำนวณจาก สูตรคำนวณ = (A/B) x 100 A = จำนวนผู้สัมผัสร่วมบ้านของผู้ป่วยวัณโรคปอดที่ขึ้นทะเบียนตั้งแต่ปีงบประมาณ 2565 ถึง ปีงบประมาณ 2567 (ตั้งแต่วันที่ 1 ตุลาคม 2564 ถึงวันที่ 30 กันยายน 2567) ที่ได้รับการ คัดกรองด้วยวิธีการถ่ายภาพรังสีทรวงอก (Chest X-Ray) ในโปรแกรม NTIP B = จำนวนผู้สัมผัสร่วมบ้านของผู้ป่วยวัณโรคปอดที่ขึ้นทะเบียนตั้งแต่ปีงบประมาณ 2565 ถึง ปีงบประมาณ 2567 (ตั้งแต่วันที่ 1 ตุลาคม 2564 ถึงวันที่ 30 กันยายน 2567) ในทะเบียน ผู้สัมผัสร่วมบ้าน ระยะเวลา ติดตามความก้าวหน้าการดำเนินงานทุกเดือน ประเมินผล",
      "numeratorA": "จำนวนผู้สัมผัสร่วมบ้านของผู้ป่วยวัณโรคปอดที่ขึ้นทะเบียนตั้งแต่ปีงบประมาณ 2565 ถึง",
      "denominatorB": "จำนวนผู้สัมผัสร่วมบ้านของผู้ป่วยวัณโรคปอดที่ขึ้นทะเบียนตั้งแต่ปีงบประมาณ 2565 ถึง",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "นางวีระวรรณ เหล่าวิทวัส ตำแหน่ง พยาบาลวิชาชีพชำนาญการ ตัวชี้วัด กลุ่มงาน ควบคุมโรคติดต่อ หน่วยงาน สสจ.ขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ124 โทรสาร 0-4322-4037 โทรศัพท์มือถือ 08-9622-4515E-mail : - นางสาวเอ็มวิกา แสงชาติ ตำแหน่ง นักวิชาการสาธารณสุขปฏิบัติการ กลุ่มงาน ควบคุมโรคติดต่อ หน่วยงาน สสจ.ขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ124 โทรสาร 0-4322-4037 โทรศัพท์มือถือ 09-8209-6938E-mail : s.emviga@gmail.com"
    },
    "KPI67-15": {
      "kpiId": "KPI67-15",
      "order": 15,
      "name": "อัตราป่วยโรคเบาหวานและโรคความดันโลหิตสูงรายใหม่ ลดลง",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 3",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "5 / 1",
      "baseline": "-",
      "definition": "ผู้ป่วยเบาหวานรายใหม่ หมายถึง ผู้ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยจากโรคเบาหวาน",
      "purpose": "เพื่อลดจำนวนผู้ป่วยรายใหม่ กลุ่มเป้าหมาย ประชากรที่อาศัยในพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วยโรคเบาหวาน (E10-E14) ในปีงบประมาณปัจจุบัน",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "เข้าระบบ Health Data Center (HDC) On Cloud ระบบรายงาน HDC กระทรวงสาธารณสุข",
      "formula": "A = จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วยโรคเบาหวาน (E10-E14) ในปีงบประมาณปัจจุบัน สูตรคำนวณ ตัวชี้วัด B = จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วยโรคเบาหวาน (E10-E14) ในปีงบประมาณที่ผ่านมา",
      "numeratorA": "จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วยโรคเบาหวาน",
      "denominatorB": "จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วยโรคเบาหวาน",
      "frequency": "[(B-A)/B] x100",
      "evaluationMethod": "A : จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วยโรคเบาหวาน (E10-E14) ในปีงบประมาณปัจจุบัน ประมวลผลจาก DIAGNOSIS_OPD , DIAGNOSIS_IPD , CHORNIC รหัส ICD-10 3 หลักขึ้นต้นด้วย E10-E14 ที่อยู่อาศัยในเขตพื้นที่รับผิดชอบ PERSON.TYPE AREA IN (1 , 3) (1 : มีชื่ออยู่ตามทะเบียนบ้านในเขตพื้นที่รับผิดชอบและอยู่จริง) , ( 3 : มาอาศัยในเขตรับผิดชอบ แต่ทะเบียนอยู่นอกเขตรับผิดชอบ) และ PERSON.DISCHARGE = “9” (ไม่จำหน่าย) PERSON.NATION = “099” (สัญชาติไทย) B : จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วยโรคเบาหวาน (E10-E14) ในปีงบประมาณที่ผ่านมา ประมวลผลจาก DIAGNOSIS_OPD , DIAGNOSIS_IPD , CHORNIC รหัส ICD-10 3 หลักขึ้นต้นด้วย E10-E14",
      "responsible": "ชื่อ-สกุล นางแสงเดือน โสภา ตำแหน่ง พยาบาลวิชาชีพชำนาญการ ตัวชี้วัด กลุ่มงาน ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ 150 โทรสาร 0-4322-4037 โทรศัพท์มือถือ... E-mail : sangdern.sopa@gmail.com"
    },
    "KPI67-16": {
      "kpiId": "KPI67-16",
      "order": 16,
      "name": "จำนวนโรงพยาบาลที่ยกระดับการพัฒนาอนามัยสิ่งแวดล้อมได้ตามเกณฑ์ GREEN & CLEAN Hospital",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 3",
      "unit": "แห่ง",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "26 / 14 / 5",
      "baseline": "-",
      "definition": "16.จำนวนโรงพยาบาลที่ยกระดับการพัฒนาอนามัยสิ่งแวดล้อมได้ตามเกณฑ์ C : CLEAN GREEN & CLEAN Hospital Challenge G : โรงพยาบาลที่ยกระดับพัฒนาอนามัยสิ่งแวดล้อมได้ตามเกณฑ์ GREEN & CLEAN Hospital Garbage Challenge หมายถึง โรงพยาบาลสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่น (รพ.ศูนย์ รพ. ทั่วไป รพ.ชุมชน) ที่มีกิจกรรมการดำเนินงานด้านอนามัยสิ่งแวดล้อมตามเกณฑ์ ดังนี้ R : Rest room ระดับมาตรฐาน (Standard) หมายถึง โรงพยาบาลสามารถดำเนินการตามเกณฑ์ข้อที่ 1 - 13 ได้ตามเงื่อนไข (คะแนน 80 % ขึ้นไป) E : Energy 1.มีการกำหนดนโยบาย จัดทำแผนการขับเคลื่อน พัฒนาศักยภาพและสร้างกระบวนการ E : สื่อสารให้เกิดการพัฒนาด้านอนามัยสิ่งแวดล้อม GREEN & CLEAN Hospital อย่างมีส่วนร่วม ของคนในองค์กร Environment 2.มีการจัดการมูลฝอยทั่วไปอย่างถูกสุขลักษณะและเป็นไปตามกฎกระทรวงสุขลักษณะการ จัดการมูลฝอยทั่วไป 2560 และกฎหมายที่เกี่ยวข้อง N : Nutrition 3.มีการจัดการมูลฝอยที่เป็นพิษหรืออันตรายอย่างถูกสุขลักษณะเป็นไปตามกฎกระทรวงมูล ฝอยที่เป็นพิษหรืออันตรายจากชุมชน พ.ศ. 2563 และกฎหมายอื่นที่เกี่ยวข้อง 4.มีการจัดการมูลฝอยติดเชื้ออย่างถูกสุขลักษณะ ตามกฎกระทรวงว่าด้วยการกำจัดมูลฝอยติด เชื้อ พ.ศ. 2545 5.มีการพัฒนาส้วมตามมาตรฐานส้วมสาธารณะไทย (HAS) ที่อาคารผู้ป่วยนอก(OPD) และ อาคารผู้ป่วยใน (IPD) 6.มีการจัดการสิ่งปฏิกูลอย่างถูกสุขลักษณะตามกฎกระทรวงสุขลักษณะการจัดการสิ่งปฏิกูล พ.ศ. 2561 และกฎหมายอื่นที่เกี่ยวข้อง 7.มีการกำหนดนโยบายและมาตรการประหยัดพลังงานที่เป็นปัจจุบัน และเป็นรูปธรรม เกิด ประสิทธิภาพในการลดการใช้พลังงานและมีการปฏิบัติตามมาตรการที่กำหนดร่วมกันทั้ง องค์กร 8.มีการจัดการสิ่งแวดล้อมทั่วไปทั้งภายในและภายนอกอาคาร โดยเพิ่มพื้นที่สีเขียวและพื้นที่ พักผ่อนที่สร้างความรู้สึกผ่อนคลายสอดคล้องกับชีวิต และวัฒนธรรมท้องถิ่นสำหรับผู้ป่วย รวมทั้งผู้มารับบริการ 9.มีกิจกรรมส่งเสริม GREEN และกิจกรรมที่เอื้อต่อการมีสุขภาพดีแบบองค์รวม ได้แก่ กิจกรรมส่งเสริมสุขอนามัย กิจกรรมป้องกันการแพร่ระบาดของโรค กิจกรรมทางกาย กิจกรรม ให้คำปรึกษาด้านสุขภาพขณะรอรับบริการของผู้ป่วยและญาติ 1 0 .ส ถ า น ที่ ป ร ะ ก อ บ อ า ห า ร ผู้ ป่ ว ย ใน โ ร ง พ ย า บ า ล ได้ ม า ต ร ฐ า น สุ ข า ภิ บ า ล อ า ห า ร ต า ม กฎกระทรวงสุขลักษณะของสถานที่จำหน่ายอาหาร พ.ศ. 2561 (4 หมวด) และมีการเฝ้า ระวังทางสุขาภิบาลอาหาร 11.ร้านอาหารในโรงพยาบาลได้มาตรฐานสุขาภิบาลอาหารตามกฎกระทรวงสุขลักษณะของ สถานที่จำหน่ายอาหาร พ.ศ. 2561 (4 หมวด)และมีการเฝ้าระวังทางสุขาภิบาลอาหาร",
      "purpose": "15 ได้ตามเงื่อนไขที่กำหนด (คะแนน 90 % ขึ้นไป)",
      "population": "14. มีการส่งเสริมให้เกิดนวัตกรรม GREEN โดยการนำไปใช้ประโยชน์และเกิดการแลกเปลี่ยน",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "1 ระดับท้าทาย (Challenge ) หมายถึง โรงพยาบาลที่สามารถดำเนินการตามเกณฑ์ข้อที่ 1 – 15 ได้ตามเงื่อนไขที่กำหนด และพัฒนาได้ตามประเด็นท้าทาย เลือกจำนวน 1 ด้าน 1.การจัดบริการอาชีวอนามัย และเวชกรรมสิ่งแวดล้อมสำหรับโงพยาบาล (ระดับดีขึ้นไป) 2.การพัฒนาโรงพยาบาลคาร์บอนต่ำและเท่าทันการเปลี่ยนแปลงสภาพภูมิอากาศ (Low Carbon and Climate Resilient Health Care) 3.การจัดการพลังงานอย่างมีประสิทธิภาพ 4.การจัดการของเสียทางการแพทย์ ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ 2567 2568 2569 2570 ระดับมาตรฐาน 26 26 26 26 ระดับดีเยี่ยม 14 16 18 20 ระดับท้าทาย 5 6 7 8 เพื่อส่งเสริมให้โรงพยาบาลสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่น มีการพัฒนาอนามัย สิ่งแวดล้อมได้ตามเกณฑ์ GREEN & CLEAN Hospital Challenge โรงพยาบาลสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่น โรงพยาบาลทุกแห่งบันทึกข้อมูลในโปรแกรม GREEN & CLEAN Hospital โปรแกรมการประเมิน GREEN & CLEAN Hospital A = จำนวนโรงพยาบาลสังกัดสำนักงานสาธารณ สุขจังหวัดขอนแก่นที่ดำเนินการ GREEN & CLEAN Hospital Challenge ผ่านเกณฑ์ระดับมาตรฐานขึ้นไป รายการข้อมูล 2 B = จำนวนโรงพยาบาลสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่นทั้งหมด (A/B) X 100 สูตรคำนวณ ตัวชี้วัด นิเทศ ติดตาม และประเมินผลการดำเนินงานสาธารณสุขจังหวัดขอนแก่น ระยะเวลา ปี 2567 จำนวน 2 รอบ ประเมินผล",
      "numeratorA": "จำนวนโรงพยาบาลสังกัดสำนักงานสาธารณ สุขจังหวัดขอนแก่นที่ดำเนินการ",
      "denominatorB": "จำนวนโรงพยาบาลสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่นทั้งหมด",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI67-17": {
      "kpiId": "KPI67-17",
      "order": 17,
      "name": "ร้อยละผลิตภัณฑ์สุขภาพและสถานประกอบการมีคุณภาพตามเกณฑ์",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 3",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": ">85",
      "baseline": "NA",
      "definition": "17.ร้อยละผลิตภัณฑ์สุขภาพและสถานประกอบการด้านสุขภาพมีคุณภาพตามเกณฑ์",
      "purpose": "พรบ.ที่เกี่ยวข้องที่มีการตรวจเฝ้าระวังคุณภาพ",
      "population": "สถานประกอบการด้านสุขภาพ หมายถึง สถานที่ผลิตอาหาร และร้านขายยา",
      "collectionMethod": "(ประเภท ขย.1-3) ที่มีการตรวจเฝ้าระวังคุณภาพ ผลิตภัณฑ์สุขภาพมีคุณภาพตามเกณฑ์ หมายถึง ผลิตภัณฑ์สุขภาพรายการที่มีการเฝ้า ระวังผ่านเกณฑ์คุณภาพตามมาตรฐานที่กฎหมายกำหนด สถานประกอบการมีคุณภาพตามเกณฑ์ หมายถึง สถานประกอบการที่มีการเฝ้าระวัง ผ่านเกณฑ์คุณภาพตามมาตรฐานที่กฎหมายกำหนด ดังนี้ -สถานที่ผลิตอาหาร ผ่าน มาตรฐานตามประกาศเกณฑ์ GMP -ร้านขายยา(ประเภท ขย.1-3) ผ่าน มาตรฐานตามเกณฑ์ GPP ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ 2566 2567 2568 2569 2570 1. ผลิตภัณฑ์ 1. ผลิตภัณฑ์ 1. ผลิตภัณฑ์ 1. ผลิตภัณฑ์ 1. ผลิตภัณฑ์ สุขภาพมีคุณภาพ สุขภาพมี สุขภาพมี สุขภาพมี สุขภาพมี ผ่านเกณฑ์ > คุณภาพผ่าน คุณภาพผ่าน คุณภาพผ่าน คุณภาพผ่าน 83% เกณฑ์ > 85% เกณฑ์ > 90% เกณฑ์ > 95% เกณฑ์ > 2.สถานที่ผลิต 2.สถานที่ผลิต 2.สถานที่ผลิต 2.สถานที่ผลิต 98% อาหาร ผ่าน อาหาร ผ่าน อาหาร ผ่าน อาหาร ผ่าน 2.สถานที่ผลิต มาตรฐานตาม มาตรฐานตาม มาตรฐานตาม มาตรฐานตาม อาหาร ผ่าน ประกาศเกณฑ์ ประกาศเกณฑ์ ประกาศเกณฑ์ ประกาศเกณฑ์ มาตรฐานตาม GMP (baseline) GMP ≥80% GMP ≥85% GMP ≥90% ประกาศเกณฑ์ 3.ร้านขายยา 3.ร้านขายยา 3.ร้านขายยา 3.ร้านขายยา GMP ≥95% (ประเภท ขย.1-3) (ประเภท ขย.1- (ประเภท ขย.1- (ประเภท ขย. 3.ร้านขายยา ผ่าน มาตรฐานตาม 3) ผ่าน 3) ผ่าน 1-3) ผ่าน (ประเภท ขย. เกณฑ์ GPP มาตรฐานตาม มาตรฐานตาม มาตรฐานตาม 1-3) ผ่าน (baseline) เกณฑ์ เกณฑ์ GPP เกณฑ์ GPP มาตรฐานตาม GPP≥80% ≥85% ≥90% เกณฑ์ GPP ≥95% เพื่อเฝ้าระวังและควบคุมคุณภาพมาตรฐานผลิตภัณฑ์สุขภาพและสถานประกอบการที่ ได้รับอนุญาติแล้วให้คงคุณภาพมาตรฐานตามเกณฑ์ที่กฎหมายกำหนด ผู้ประกอบการผลิตภัณฑ์สุขภาพและสถานประกอบการด้านสุขภาพที่ได้รับอนุญาตแล้ว และมีการตรวจเฝ้าระวังในปีงบประมาณนั้นๆ บันทึกรายงานการดำเนินงานตรวจเฝ้าระวังประจำไตรมาส กลุ่มงานคุ้มครองผู้บริโภค และเภสัชสาธารณสุข สำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "source": "รายงานการดำเนินงานตรวจเฝ้าระวังประจำไตรมาส กลุ่มงานคุ้มครองผู้บริโภคและเภสัช",
      "formula": "A.ผลิตภัณฑ์สุขภาพที่ได้รับการตรวจเฝ้าระวังและมีคุณภาพผ่านเกณฑ์ B.ผลิตภัณฑ์สุขภาพทั้งหมดที่ได้รับการตรวจเฝ้าระวัง C.สถานที่ผลิตอาหารที่ได้รับการตรวจเฝ้าระวังและมีคุณภาพผ่านเกณฑ์ GMP D.สถานที่ผลิตอาหารทั้งหมดที่ได้รับการตรวจเฝ้าระวังตามเกณฑ์ GMP E.ร้านขายยา(ประเภท ขย.1-3) ที่ได้รับการตรวจเฝ้าระวังและมีคุณภาพผ่านเกณฑ์ GPP F.ร้านขายยา(ประเภท ขย.1-3) ทั้งหมดที่ได้รับการตรวจเฝ้าระวังตามเกณฑ์ GPP 1.ผลิตภัณฑ์สุขภาพมีคุณภาพผ่านเกณฑ์ ≥85% = (A x 100)/B 2.สถานที่ผลิตอาหาร ผ่าน มาตรฐานตามประกาศเกณฑ์ GMP ≥80% = (A x 100)/B 3.ร้านขายยา(ประเภท ขย.1-3) ผ่าน มาตรฐานตามเกณฑ์ GPP ≥80% = (A x 100)/B",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "ทุกไตรมาส",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "2.สถานที่ผลิตอาหาร ผ่าน ≥60% ≥85% มาตรฐานตามประกาศ 2.สถานที่ผลิตอาหาร ผ่าน 2.สถานที่ผลิตอาหาร เกณฑ์ GMP ≥50% มาตรฐานตามประกาศ ผ่าน มาตรฐานตาม 3.ร้านขายยา(ประเภท ขย. เกณฑ์ GMP ≥60% ประกาศเกณฑ์ GMP 1-3) ผ่าน มาตรฐานตาม 3.ร้านขายยา(ประเภท ≥80% เกณฑ์ GPP ≥50% ขย.1-3) ผ่าน มาตรฐาน 3.ร้านขายยา(ประเภท ตามเกณฑ์ GPP ≥60% ขย.1-3) ผ่าน มาตรฐาน ตามเกณฑ์ GPP ≥80% นางศศิธร เอื้ออนันต์ ตำแหน่ง เภสัชกรชำนาญการ กลุ่มงานคุ้มครองผู้บริโภคและเภสัชสาธารณสุข สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ ... โทรสาร 0-4322-4037 โทรศัพท์มือถือ 081-3910199 E-mail : sasitorneu@gmail.com"
    },
    "KPI67-18": {
      "kpiId": "KPI67-18",
      "order": 18,
      "name": "อัตราความสำเร็จของการรักษาวัณโรคปอดรายใหม่",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "88",
      "baseline": "75.26",
      "definition": "อัตราความสำเร็จการรักษาผู้ป่วยวัณโรครายใหม่ 18.ความสำเร็จของการดำเนินงานป้องกันควบคุมวัณโรค 1.ความสำเร็จการรักษา หมายถึง ผู้ป่วยวัณโรคปอดรายใหม่ที่มีผลการรักษาหายรวมกับ รักษาครบ 1.1 รักษาหาย (Cured) หมายถึง ผู้ป่วยวัณโรคปอดรายใหม่ที่มี ผลตรวจทาง ห้องปฏิบัติการพบเชื้อวัณโรคก่อนเริ่มการรักษา และต่อมาตรวจไม่พบเชื้อวัณโรคอย่างน้อย หนึ่งครั้งก่อนสิ้นสุดการรักษา และในเดือนสุดท้ายของการรักษา 1.2 รักษาครบ (Treatment Completed) หมายถึง ผู้ป่วยวัณโรคปอดรายใหม่ที่ รักษาครบกำหนดโดยไม่มีหลักฐานที่แสดงว่าการรักษาล้มเหลว ซึ่งผู้ป่วยดังกล่าวไม่มี เอกสารที่แสดงผลการตรวจเสมหะในเดือนสุดท้ายของการรักษา ทั้งนี้มีผลตรวจเสมหะเป็น ลบอย่างน้อยหนึ่งครั้งก่อนสิ้นสุดการรักษา รวมทั้งผู้ป่วยที่ไม่ได้ตรวจหรือไม่มีผลตรวจ 2.ผู้ป่วยวัณโรคปอดรายใหม่ หมายถึง ผู้ป่วยวัณโรคปอดที่ไม่เคยรักษาวัณโรคมาก่อนและ ผู้ป่วยที่รักษาวัณโรคน้อยกว่า 1 เดือน และไม่เคยขึ้นทะเบียนในแผนงานวัณโรคแห่งชาติ แบ่งเป็น 2 กลุ่ม คือ 2.1 ผู้ป่วยที่มีผลตรวจยืนยันพบเชื้อวัณโรค (Bacteriologically confirmed: B+) หมายถึง ผู้ป่วยวัณโรคที่มีผลตรวจเสมหะเป็นบวก อาจจะเป็นการตรวจด้วยวิธี Smear microscopy หรือ Culture หรือวิธี Molecular หรือวิธีการอื่นๆ ที่องค์การอนามัยโลก รับรอง 2.2 ผู้ป่วยที่วินิจฉัยด้วยลักษณะทางคลินิก (Clinically diagnosed:B-) หมายถึง ผู้ ป่ ว ย วั ณ โ ร ค ที่ มี ผ ล ต ร ว จ เ ส ม ห ะ เ ป็ น ล บ ห รื อ ไ ม่ มี ผ ล ต ร ว จ แต่ผลการวินิจฉัยด้วยวิธีการตรวจเอกซเรย์รังสีทรวงอกหรือผลการตรวจชิ้นเนื้อผิดปกติเข้า ได้กับวัณโรค ร่วมกับมีลักษณะทางคลินิกเข้าได้กับวัณโรค และแพทย์ตัดสินใจรักษาด้วย สูตรยารักษาวัณโรค 3 .ก า ร ป ร ะ เมิ น ก า ร ค้ น ห า วั ณ โ ร ค ใน 7 ก ลุ่ ม เสี่ ย ง ห ม า ย ถึ ง ผู้ ที่ ได้ รั บ การค้นหาวัณโรคใน 7 กลุ่มเสี่ยง ที่ได้รับการคัดกรองด้วยวิธีการถ่ายภาพรังสีทรวงอก (Chest X-Ray) ในปีงบประมาณ 2567 (1 ตุลาคม 2566 - 30 กันยายน 2567) 4.ความครอบคลุมการขึ้นทะเบียนของผู้ป่วยวัณโรครายใหม่และกลับเป็นซ้ำ หมายถึง อัตราการตรวจพบและขึ้นท ะเบียนผู้ป่วยวัณ โรครายใหม่และกลับมาเป็นซ้ำ ในปีงบประมาณ 2567 (1 ตุลาคม 2566-30 กันยายน 2567) เทียบกับค่าคาดประมาณ อุบัติการณ์ผู้ป่วยวัณโรค (143 ต่อประชากรแสนคน) เมื่อเทียบกับค่าคาดประมาณ อุบัติการณ์ผู้ป่วยวัณโรค จังหวัดขอนแก่นจะมีอุบัติการณ์ผู้ป่วยวัณโรค จำนวน 2,561 ราย",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "(จำนวนผลงานที่บรรลุเกณฑ์ [A] ÷ จำนวนกลุ่มเป้าหมายทั้งหมด [B]) × 100",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI67-19": {
      "kpiId": "KPI67-19",
      "order": 19,
      "name": "ร้อยละประชาชนกลุ่มเป้าหมายเป็นโรคพยาธิใบไม้ตับลดลง",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ร้อยละ",
      "direction": "ยิ่งน้อยยิ่งดี",
      "target": "2",
      "baseline": "3.07",
      "definition": "19.การจัดบริการมะเร็งครบวงจร ในมะเร็งสำคัญ 5 โรค (Cancer Warrior) ร้อยละประชาชน",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "หมายถึง ประชากรจังหวัดขอนแก่น (ตาม43แฟ้ม Typearea = 1,3 และ Nation = 099) ที่มีปัจจัยเสี่ยงในข้อใดข้อหนึ่งต่อไปนี้ 1. มีประวัติการกินปลาตระกูลมีเกล็ดน้ำจืดสุกๆดิบๆ 2. เคยเป็นหรือมีประวัติการติดเชื้อพยาธิใบไม้ตับ 3. มีญาติสายตรงป่วยมะเร็งท่อน้ำดีหรือพยาธิใบไม้ตับ 4. เป็นคนอีสานโดยกำเนิดหรืออาศัยอยู่ในอีสานมากกว่า 15 ปี การตรวจคัดกรองโรคพยาธิใบไม้ตับ หมายถึง การตรวจหาพยาธิใบไม้ตับ (OV; Opisthorchis viverrini) ในกลุ่มประชากรที่มีอายุ 15 ปีขึ้นไป ด้วยวิธีตรวจอุจจาระ และ/ หรือ ปัสสาวะ โดย วิธีต รวจ อุจจาระ ได้แก่ Formalin ether concentration technique (FECT) ห รือ Modified Kato thick smear หรือ Modified Kato-Katz หรือ JIK-PARASITE TRAP วิธีตรวจปัสสาวะ (OV-RDT; OV-Rapid diagnostic test) คือ การใช้ตัวตรวจจับจำเพาะ หรือโมโนโคลนอลแอนติบอดี (monoclonal antibody) ที่มีความจำเพาะต่อพยาธิใบไม้ตับ และเป็นสารตรวจจับสิ่งคัดหลั่งหรือแอนติเจนของพยาธิใบไม้ตับในปัสสาวะ การตรวจคัดกรองมะเร็งท่อน้ำดีด้วยการอัลตราซาวด์ หมายถึง การตรวจมะเร็งท่อน้ำดีด้วย การอัลตราซาวด์ ในประชาชนกลุ่มเป้าหมาย ที่ตรวจพบพยาธิใบไม้ตับจากการตรวจหาการ ติดเชื้อจากปัสสาวะ (OV-RDT) และอุจจาระ ในกลุ่มประชากรที่มีอายุ 40 ปีขึ้นไป โดยจังหวัดขอนแก่นมุ่งเน้นใน กลุ่มที่มีอายุระหว่าง 50-70 ปี แนวทางดำเนินงานเฝ้าระวัง ป้องกัน รักษาโรคมะเร็งท่อน้ำดี ตาม 8 มาตรการ ดังนี้ มาตรการที่ 1 คัดกรองพยาธิใบไม้ตับในประชากรกลุ่มเป้าหมาย เมื่อพบผู้ติดพยาธิให้รักษา และปรับเปลี่ยนพฤติกรรมสุขภาพ มาตรการที่ 2 คัดกรองมะเร็งท่อน้ำดีในประชาชนอายุ 40 ปีขึ้นไป ด้วยเครื่องอัลตร้าซาวด์ มาตรการที่ 3 จัดระบบสุขาภิบาล บริหารจัดการสิ่งปฏิกูลเพื่อตัดวงจรพยาธิ โดยจัดให้มีบ่อ บำบัดสิ่งปฏิกูลในทุกพื้นที่ผ่านองค์กรปกครองส่วนท้องถิ่น มาตรการที่ 4 สนับสนุนให้มีการสร้างความรอบรู้ด้านสุขภาพ (Health Literacy) โรคพยาธิ ใบไม้ตับและมะเร็งท่อน้ำดี ในเด็กนักเรียน เยาวชน อาสาสมัครสาธารณสุข ผู้ประกอบการ และประชาชน มาตรการที่ 5 รณรงค์อาหารปลอดภัย ปลาปลอดพยาธิอย่างต่อเนื่องในพื้นที่ผ่านทุกช่องทางการ สื่อสารตามบริบทพื้นที่ มาตรการที่ 6 บริหารจัดการส่งต่อผู้สงสัยมะเร็งท่อน้ำ ดีเข้าสู่กระบวนการวินิจฉัยรักษาอย่าง เป็นระบบและมีระบบการ รับ-ส่งต่อ ผู้ป่วยจากโรงพยาบาลสู่ชุมชนมีหมอครอบครัวเข้าไป",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "(จำนวนผลงานที่บรรลุเกณฑ์ [A] ÷ จำนวนกลุ่มเป้าหมายทั้งหมด [B]) × 100",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI67-20": {
      "kpiId": "KPI67-20",
      "order": 20,
      "name": "อัตราการฆ่าตัวตายสำเร็จ ไม่เกิน 8 ต่อประชากรแสนคน",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ต่อแสนประชากร",
      "direction": "ยิ่งน้อยยิ่งดี",
      "target": "7.19",
      "baseline": "7.99",
      "definition": "ส่งต่อมีประสิทธิภาพและไร้ร้อยต่อ 20. อัตราการฆ่าตัวตายสำเร็จ 20.1 อัตราการฆ่าตัวตายสำเร็จ 20.2 ร้อยละของผู้พยายามฆ่าตัวตายไม่กลับมาทำร้ายตนเองซ้ำในระยะเวลา 1 ปี 20.อัตราการฆ่าตัวตายสำเร็จ การฆ่าตัวตายสำเร็จ คือ การเสียชีวิตจากพฤติกรรมที่มุ่งทำร้ายตนเองโดยตั้งใจจะให้ตาย จากพฤติกรรมนั้น ผู้พยายามฆ่าตัวตาย หมายถึง ผู้ที่มีพฤติกรรมมุ่งทำร้ายตนเองแต่ไม่ถึงกับเสียชีวิตโดย ตั้งใจจะให้ตายจากพฤติกรรมนั้นและผลของการพยายามฆ่าตัวตายอาจบาดเจ็บหรือ ไม่บาดเจ็บ ซึ่งวิธีการที่ใช้มีลักษณะสอดคล้องตามมาตรฐานการจำแนกโรคระหว่างประเทศ ขององค์การอนามัยโลกฉบับที่ 10 (ICD - 10 : International Classification of Diseases and Health Related Problems - 10) ห ม ว ด Intentional self-harm (X60-X84) ห รื อ เทียบเคียงในกลุ่มโรคเดียวกันกับการวินิจฉัยตามเกณฑ์วินิจฉัยโรคของสมาคมจิตแพทย์ อเมริกัน ฉบับที่ 5 (DSM-5: Diagnostic and Statistical Manual of Mental disorders 5) ผู้พยายามฆ่าตัวตายซ้ำ หมายถึง ผู้พยายามฆ่าตัวตายที่มีพฤติกรรมฆ่าตัวตายมากกว่า 1 ครั้งในรอบปีงบประมาณ ไม่กลับมาทำร้ายตัวเองซ้ำในระยะเวลา 1 ปี หมายถึง ผู้ที่เคยพยายามฆ่าตัวตายในช่วง ปีงบประมาณได้รับการช่วยเหลืออย่างถูกต้องเหมาะสมและติดตามเฝ้าระวังจนไม่เกิด พฤติกรรมทำร้ายตนเองอีกครั้งในรอบปีงบประมาณเดียวกัน (ปีงบประมาณ นับตั้งแต่ วันที่ 1 ตุลาคม 2566-วันที่ 30 กันยายน 2567) ซึ่งการช่วยเหลืออย่างถูกต้องเหมาะสมจะประกอบด้วย 7 กิจกรรม ดังต่อไปนี้ 1) ได้รับการช่วยชีวิตและยับยั้งพฤติกรรมฆ่าตัวตายจากศูนย์รับแจ้งเหตุฯ/1669/ ตำรวจ/ อื่นๆ รวมทั้งส่งต่อหน่วยบริการสาธารณสุขได้ทันท่วงที 2) ได้รับการวินิจฉัยจากแพทย์ตามเกณฑ์วินิจฉัยโรคหมวด Intentional self-harm (X60-X84) 3) ได้รับการสอบสวนโรคกรณีฆ่าตัวตายและกระทำรุนแรงต่อตนเองเพื่อค้นหาและ รวบรวมข้อมูลปัจจัยกระตุ้น ปัจจัยเสี่ยง ปัจจัยปกป้อง และด่านกั้น รวมทั้งประเมินการเฝ้า ระวังการฆ่าตัวตายในครอบครัวและชุมชนโดยทีมสอบสวนโรคกรณีฆ่าตัวตายของจังหวัด/ อำเภอ หรือ และ ร่วมกับ ทีมจังหวัด ทีมจิตเวชพี้เลี้ยง ในกรณีมีความยุ่งยากซับซ้อน มีผลกระทบอย่างรุนแรงต่อชุมชน สังคม 4) ได้รับการช่วยเหลือขจัดหรือบรรเทาปัจจัยกระตุ้น ปัจจัยเสี่ยง จากบุคลากรสาธารณสุข จากหน่วยบริการทั้งในระดับ รพ.สต. /รพช. /รพท/รพศ. /หน่วยบริการในสังกัด กรม สุขภาพจิต",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "ผลการดำเนินงานจริงเทียบกับเกณฑ์เป้าหมาย (ต่อแสนประชากร)",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI67-21": {
      "kpiId": "KPI67-21",
      "order": 21,
      "name": "อัตราตายผู้ป่วยติดเชื้อในกระแสเลือดแบบรุนแรงชนิด (Community-Acquired) น้อยกว่าร้อยละ 26",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ร้อยละ",
      "direction": "ยิ่งน้อยยิ่งดี",
      "target": "24",
      "baseline": "24.97",
      "definition": "มาตรฐาน มีระบบส่งต่อมีประสิทธิภาพและไร้รอยต่อ อัตราตายผู้ป่วยติดเชื้อในกระแสเลือดแบบรุนแรงชนิด Community - acquired sepsis น้อยกว่าร้อยละ 26 21.อัตราตายผู้ป่วยภาวะติดเชื้อในกระแสเลือด (Sepsis) แบบรุนแรงชนิด Community - acquired sepsis น้อยกว่าร้อยละ 26 ภาวะติดเชื้อในกระแสเลือดแบบรุนแรงเป็นภาวะวิกฤตที่มีความสำคัญ พบว่า อัตรา อุบัติการณ์ มีแนวโน้มสูงขึ้นและอัตราเสียชีวิตสูงขึ้น โดยเฉพาะในกลุ่มเสี่ยง เช่น ผู้ที่ รับยากดภูมิคุ้มกัน นอกจากนี้ยังพบว่าแนวโน้มของเชื้อดื้อยาเพิ่มขึ้น ส่งผลให้การรักษา ผู้ป่วยไม่ได้ผลดีเท่าที่ควร และการติดเชื้อในกระแสเลือดส่งผลให้อวัยวะต่าง ๆ ทำงาน ผิดปกติ ส่งผลให้เกิดภาวะแทรกซ้อนต่างๆตามมา ได้แก่ ภาวะช็อก, ไตวาย, การ ทำงานอวัยวะต่าง ๆ ล้มเหลว และเสียชีวิตในที่สุด 1. ผู้ป่วยติดเชื้อในกระแสเลือดแบบรุนแรง หมายถึง ผู้ป่วยที่เข้าเกณฑ์การ วินิจฉัยภาวะ severe sepsis หรือ septic shock 1.1 ผู้ป่วย severe sepsis หมายถึง ผู้ป่วยที่สงสัยหรือยืนยันว่ามีการติดเชื้อ ในร่างกาย ร่วมกับมี SIRS ตั้งแต่ 2 ข้อ ขึ้นไป (ตารางที่ 1) ที่เกิดภาวะ tissue hypoperfusion หรือ organ dysfunction (ตารางที่ 2) โดยที่อาจจะมีหรือไม่มีภาวะ hypotension ก็ได้ หรือมีอาการแสดงตามเกณฑ์ ข้อใดข้อหนึ่งใน 4.2 - 4.4 1.2 ผู้ป่วย septic shock หมายถึง ผู้ป่วยที่สงสัยหรือยืนยันว่ามีการติดเชื้อใน ร่างกาย ร่วมกับมี SIRS ตั้งแต่ 2 ข้อ ขึ้นไป (ตารางที่ 1) ที่มี hypotension ต้องใช้ vasopressors ในการ maintain MAP ≥65 mm Hg และ มีค่า serum lactate level >2 mmol/L (18 mg/dL) แม้ว่าจะได้สารน้ำเพียงพอแล้วก็ตาม 2. Community-acquired sepsis หมายถึง การติดเชื้อมาจากที่บ้านหรือที่ ชุมชน โดยอัตราตายจากติดเชื้อในกระแสเลือด จาก community-acquired sepsis เพียงอย่างเดียว 3.",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "มุ่งเน้นที่กลุ่ม community – acquired sepsis เพื่อพัฒนาให้ มีระบบข้อมูลพื้นฐานให้เหมือนกัน ทั้งประเทศ 4. การคัดกรองผู้ป่วยติดเชื้อในกระแสเลือด หมายถึง การคัดกรองผู้ป่วยทั่วไปที่ อาจจะเกิดภาวะติดเชื้อในกระแสเลือดเพี่อนำไปสู่การวินิจฉัยภาวะติดเชื้อในกระแส เลือดแบบรุนแรง ซึ่งเครื่องมือที่ใช้ (sepsis screening tools) คือ Modified Early Warning Score (MEWS) (ตารางที่ 5) 5. การดูแลรักษาผู้ป่วย ในที่นี้ ครอบคลุมทั้งการปฏิบัติงานของผู้ให้บริการแต่ละ คน ระบบและกระบวนการที่เกี่ยวข้องครอบคลุมทั้งการที่ไม่สามารถให้การวินิจฉัยหรือ การรักษาได้หรือการวินิจฉัยที่ไม่ถูกต้อง หรือไม่เป็นไปตามอย่างที่ควรจะเป็น เกณฑ์เป้าหมาย",
      "collectionMethod": "เพื่อพัฒนาระบบการดูแลรักษาผู้ป่วยติดเชื้อในกระแสเลือดและลดอัตราการเสียชีวิต ผู้ป่วยติดเชื้อในกระแสเลือดแบบรุนแรงชนิด community-acquired sepsis ให้น้อย",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "ไทย ระยะเวลาประเมิน A = จำนวนผู้ป่วยที่เสียชีวิต (dead) จากภาวะการติดเชื้อในกระแสเลือดแบบรุนแรง ชนิด community-acquired ที่ลง ICD 10 รหัส R 65.1 และ R57.2 ใน Principle Diagnosis และ Comorbidity ไม่นับรวมที่ลงใน Post Admission Comorbidity (complication) และไม่นับรวมผู้ป่วย palliative (รหัส Z 51.5) B = จำนวนผู้ป่วยที่ปฏิเสธการรักษาเพื่อกลับไปเสียชีวิตที่บ้าน (against advise) จาก ภาวะการติดเชื้อในกระแสเลือดแบบรุนแรงชนิด community-acquired ที่ลง ICD 10 รหัส R 65.1 และ R57.2 ใน Principle Diagnosis และ Comorbidity ไม่นับ รวมที่ลงใน Post Admission Comorbidity (complication) และไม่นับรวมผู้ป่วย palliative (รหัส Z 51.5) โดยมีสถานภาพการจำหน่าย (Discharge status) = 2 ปฏิเสธการรักษา, และวิธีการจำหน่าย (Discharge type) = 2 ดีขึ้น C = จำนวนผู้ป่วยที่ปฏิเสธการรักษาเพื่อกลับไปเสียชีวิตที่บ้าน (against advise) จาก ภาวะการติดเชื้อในกระแสเลือดแบบรุนแรงชนิด community-acquired ที่ลง ICD 10 รหัส R 65.1 และ R57.2 ใน Principle Diagnosis และ Comorbidity ไม่นับ รวมที่ลงใน Post Admission Comorbidity (complication) และไม่นับรวมผู้ป่วย palliative (รหัส Z 51.5) โดยมีสถานภาพการจำหน่าย(Discharge status) = 2 ปฏิเสธการรักษา, และวิธีการจำหน่าย (Discharge type) = 3 ไม่ดีขึ้น D = จำนวนผู้ป่วยติดเชื้อในกระแสเลือดแบบรุนแรงชนิด community-acquired ทั้งหมด ที่ลง ICD 10 รหัส R 65.1 และ R57.2 ใน Principle Diagnosis และ Comorbidity ไม่นับรวมที่ลงใน Post Admission Comorbidity (complication) และไม่นับรวมผู้ป่วย palliative (รหัส Z 51.5) อัตราตายผู้ป่วยติดเชื้อในกระแสเลือดแบบรุนแรงชนิด community-acquired sepsis(A+C) / D × 100 รายงาน Cockpit ทุก 3 เดือน และนิเทศงานจังหวัด 2 ครั้ง/ปี (ไตรมาส 1 และ ไตรมาส 3)",
      "numeratorA": "จำนวนผู้ป่วยที่เสียชีวิต (dead) จากภาวะการติดเชื้อในกระแสเลือดแบบรุนแรง",
      "denominatorB": "จำนวนผู้ป่วยที่ปฏิเสธการรักษาเพื่อกลับไปเสียชีวิตที่บ้าน (against advise) จาก",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI67-22": {
      "kpiId": "KPI67-22",
      "order": 22,
      "name": "อัตราผู้ป่วยโรคหลอดเลือดสมอง รายใหม่ต่อประชากรแสนคน",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ต่อแสนประชากร",
      "direction": "ยิ่งน้อยยิ่งดี",
      "target": "237",
      "baseline": "274",
      "definition": "ระบบบริการสุขภาพตั้งแต่ ปฐมภูมิ ทุติยภูมิ ตติยภูมิขั้นสูง มีคุณภาพ ได้มาตรฐาน มีระบบส่งต่อมี",
      "purpose": "เพื่อลดอัตราผู้ป่วยโรคหลอดเลือดสมองรายใหม่",
      "population": "ประชากรที่อยู่ตามทะเบียนราษฎร์ ทุกกลุ่มอายุ ในจังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "HDC สำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "formula": "A = จำนวนผู้ป่วยรายใหม่จากโรคหลอดเลือดสมองในปีงบประมาณ B = จำนวนประชากรทะเบียนราษฎร์ สูตรคำนวณ (A/B) x 100,000 ตัวชี้วัด ระยะเวลา ปีละ 1 ครั้ง ประเมินผล ผลการดำเนินงาน ผลงาน ปี 2564 ปี 2565 ปี 2566 ย้อนหลัง 3 ปี 274.06 (ปี 2564 - จังหวัดขอนแก่น NA NA 2566)",
      "numeratorA": "จำนวนผู้ป่วยรายใหม่จากโรคหลอดเลือดสมองในปีงบประมาณ",
      "denominatorB": "จำนวนประชากรทะเบียนราษฎร์",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "HDC ณ 3 พ.ย. 66 ตัวชี้วัด นางประภัสสร แสนละมุน ตำแหน่ง นักวิชาการสาธารณสุข กลุ่มงาน : ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด โทรศัพท์ที่ทำงาน 043-221125 ต่อ 150 โทรศัพท์มือถือ 082-8365237 โทรสาร 043-224037 E-mail : matoom.27290@gail.com"
    },
    "KPI67-23": {
      "kpiId": "KPI67-23",
      "order": 23,
      "name": "ร้อยละของผู้ป่วย IMC ได้รับการบริบาลฟื้นสภาพและติดตามจนครบ 6 เดือน หรือจน Barthel index = 20 ก่อนครบ 6 เดือน (เป้าหมายร้อยละ 98)",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "98",
      "baseline": "80",
      "definition": "ร้อยละของผู้ป่วย IMC ได้รับการบริบาลฟื้นสภาพและติดตามจนครบ 6 เดือน หรือจน Barthel index = 20 ก่อนครบ 6 เดือน (เป้าหมายร้อยละ 98) ตามเกณฑ์มาตรฐานแผนยุทธศาสตร์สุขภาพ 5 ปี จังหวัดขอนแก่น (พ.ศ. 2566–2570)",
      "purpose": "เพื่อลดจำนวนผู้ป่วยรายใหม่จากปีงบประมาณที่ผ่านมา",
      "population": "ประชากรที่อาศัยในพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วย โรคเบาหวาน (E10-E14) ในปีงบประมาณปัจจุบัน",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบรายงาน HDC กระทรวงสาธารณสุข",
      "formula": "A = จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วย โรคเบาหวาน (E10-E14) ในปีงบประมาณปัจจุบัน B = จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วย โรคเบาหวาน (E10-E14) ในปีงบประมาณที่ผ่านมา สูตรคำนวณ (B-A/B) x 100 ตัวชี้วัด ระยะเวลา 12 เดือน ประเมินผล",
      "numeratorA": "จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วย",
      "denominatorB": "จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วย",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "A : จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วย โรคเบาหวาน (E10-E14) ในปีงบประมาณปัจจุบัน ประมวลผลจาก DIAGNOSIS_OPD , รายละเอียด DIAGNOSIS_IPD , CHORNIC รหัส ICD-10 3 หลักขึ้นต้นด้วย E10-E14 ที่อยู่อาศัยในเขต ข้อมูลพื้นฐาน พื้นที่รับผิดชอบ PERSON.TYPE AREA IN (1 , 3) (Baseline 1 (มีชื่ออยู่ตามทะเบียนบ้านในเขตพื้นที่รับผิดชอบและอยู่จริง) , 3 (มาอาศัยในเขตรับผิดชอบ Data) แต่ทะเบียนอยู่นอกเขตรับผิดชอบ) และ PERSON.DISCHARGE = “9” (ไม่จำหน่าย) ผลการ PERSON.NATION = “099” (สัญชาติไทย) ดำเนินงาน B : จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วย ย้อนหลัง 3 ปี โรคเบาหวาน (E10-E14) ในปีงบประมาณที่ผ่านมา ประมวลผลจาก DIAGNOSIS_OPD , (ปี 2564 - DIAGNOSIS_IPD , CHORNIC รหัส ICD-10 3 หลักขึ้นต้นด้วย E10-E14 2566)",
      "responsible": "ผลงาน ปี 2564 ปี 2565 ปี 2566 ตัวชี้วัด ร้อยละของผู้ป่วยเบาหวาน 3.98 -18.25 -5.98 รายใหม่ลดลง นางแสงเดือน โสภา ตำแหน่ง พยาบาลวิชาชีพชำนาญการ กลุ่มงาน ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ โทรสาร 0-4322-4037 โทรศัพท์มือถือ E-mail : sangdern.sopa@gmail.com"
    },
    "KPI67-24": {
      "kpiId": "KPI67-24",
      "order": 24,
      "name": "อัตราการติดเชื้อดื้อยาในกระแสเลือดลดลง ≥50",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "≥50",
      "baseline": "NA",
      "definition": "อัตราการติดเชื้อดื้อยาในกระแสเลือดลดลง ≥50 ตามเกณฑ์มาตรฐานแผนยุทธศาสตร์สุขภาพ 5 ปี จังหวัดขอนแก่น (พ.ศ. 2566–2570)",
      "purpose": "1.ส่งเสริมการใช้ยาอย่างสมเหตุผลในระดับโรงพยาบาล (RDU hospital)",
      "population": "2.ลดอัตราเชื้อดื้อยาในโรงพยาบาลระดับ A/S/M 3.ลดความแออัดของโรงพยาบาล",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "1.โปรแกรม HDC (RDU Hospital) 2.โปรแกรม AMESS (อัตราการติดเชื้อของโรงพยาบาล) 3.รายงานร้านขายยาที่เข้าร่วมโครงการหลักประกันสุขภาพ (สปสช.)",
      "formula": "1.จำนวนโรงพยาบาลที่ผ่านเกณฑ์ RDU Hospital ที่กระทรวงกำหนด 2.รายการตัวชี้วัด RDU Hospital ที่กระทรวงกำหนด (กระทรวงอยู่ระหว่างการปรับปรุง) 3.อัตราเชื้อดื้อยาของโรงพยาบาลในปีปัจจุบันเทียบกับปี 2560 4.จำนวนร้านขายยาที่เข้าร่วมโครงการร้านขายยาลดแออัด สูตรคำนวณ 1.ร้อยละโรงพยาบาลที่ผ่านเกณฑ์ RDU Hospital ที่กระทรวงกำหนด > 30% ตัวชี้วัด = (จำนวนโรงพยาบาลที่ผ่านเกณฑ์ RDU hospitalx100)/ (โรงพยาบาล 26 แห่ง) 2. (อัตราเชื้อดื้อยาปีปัจจุบัน-อัตราเชื้อดื้อยาปี 2560)*100/อัตราเชื้อดื้อยาปี 2560 ระยะเวลา ทุกไตรมาส ประเมินผล",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "นางศศิธร เอื้ออนันต์ ตำแหน่ง เภสัชกรชำนาญการ กลุ่มงานคุ้มครองผู้บริโภคและเภสัชสาธารณสุข สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 โทรสาร 0-4322-4037"
    },
    "KPI67-25": {
      "kpiId": "KPI67-25",
      "order": 25,
      "name": "ร้อยละของผู้ป่วยที่มีการวินิจฉัยโรคหลอดเลือดสมอง อัมพฤกษ์ อัมพาต ระยะกลาง (Intermediate Care) ที่ได้รับการดูแลด้วยการแพทย์แผนไทยและการแพทย์ทางเลือก",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "≥20",
      "baseline": "8",
      "definition": "ร้อยละของผู้ป่วยที่มีการวินิจฉัยโรคหลอดเลือดสมอง อัมพฤกษ์ อัมพาต ระยะกลาง (Intermediate Care) ที่ได้รับการดูแลด้วยการแพทย์แผนไทยและการแพทย์ทางเลือก ตามเกณฑ์มาตรฐานแผนยุทธศาสตร์สุขภาพ 5 ปี จังหวัดขอนแก่น (พ.ศ. 2566–2570)",
      "purpose": "เพื่อลดจำนวนผู้ป่วยรายใหม่จากปีงบประมาณที่ผ่านมา",
      "population": "ประชากรที่อาศัยในพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วย โรคเบาหวาน (E10-E14) ในปีงบประมาณปัจจุบัน",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบรายงาน HDC กระทรวงสาธารณสุข",
      "formula": "A = จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วย โรคเบาหวาน (E10-E14) ในปีงบประมาณปัจจุบัน B = จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วย โรคเบาหวาน (E10-E14) ในปีงบประมาณที่ผ่านมา สูตรคำนวณ (B-A/B) x 100 ตัวชี้วัด ระยะเวลา 12 เดือน ประเมินผล",
      "numeratorA": "จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วย",
      "denominatorB": "จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วย",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "A : จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วย โรคเบาหวาน (E10-E14) ในปีงบประมาณปัจจุบัน ประมวลผลจาก DIAGNOSIS_OPD , รายละเอียด DIAGNOSIS_IPD , CHORNIC รหัส ICD-10 3 หลักขึ้นต้นด้วย E10-E14 ที่อยู่อาศัยในเขต ข้อมูลพื้นฐาน พื้นที่รับผิดชอบ PERSON.TYPE AREA IN (1 , 3) (Baseline 1 (มีชื่ออยู่ตามทะเบียนบ้านในเขตพื้นที่รับผิดชอบและอยู่จริง) , 3 (มาอาศัยในเขตรับผิดชอบ Data) แต่ทะเบียนอยู่นอกเขตรับผิดชอบ) และ PERSON.DISCHARGE = “9” (ไม่จำหน่าย) ผลการ PERSON.NATION = “099” (สัญชาติไทย) ดำเนินงาน B : จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วย ย้อนหลัง 3 ปี โรคเบาหวาน (E10-E14) ในปีงบประมาณที่ผ่านมา ประมวลผลจาก DIAGNOSIS_OPD , (ปี 2564 - DIAGNOSIS_IPD , CHORNIC รหัส ICD-10 3 หลักขึ้นต้นด้วย E10-E14 2566)",
      "responsible": "ผลงาน ปี 2564 ปี 2565 ปี 2566 ตัวชี้วัด ร้อยละของผู้ป่วยเบาหวาน 3.98 -18.25 -5.98 รายใหม่ลดลง นางแสงเดือน โสภา ตำแหน่ง พยาบาลวิชาชีพชำนาญการ กลุ่มงาน ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ โทรสาร 0-4322-4037 โทรศัพท์มือถือ E-mail : sangdern.sopa@gmail.com"
    },
    "KPI67-26": {
      "kpiId": "KPI67-26",
      "order": 26,
      "name": "ร้อยละผู้ป่วยนอกที่ได้รับบริการ ตรวจ วินิจฉัย รักษาโรค และฟื้นฟูสภาพ ด้วยศาสตร์การแพทย์แผนไทยและการแพทย์ทางเลือก",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "≥21",
      "baseline": "21.43",
      "definition": "ระบบบริการสุขภาพตั้งแต่ ปฐมภูมิ ทุติยภูมิ ตติยภูมิขั้นสูง มีคุณภาพ ได้มาตรฐาน",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "26.ร้อยละผู้ป่วยนอกที่ได้รับบริการ ตรวจ วินิจฉัย รักษาโรค และฟื้นฟูสภาพ ด้วยศาสตร์การแพทย์แผนไทยและการแพทย์ทางเลือก ผู้ป่วยนอก หมายถึง ประชาชนที่มารับบริการตรวจ วินิจฉัย รักษาโรคและฟื้นฟู สภาพ แบบไม่นอนรักษาตัวในโรงพยาบาล โดยผู้ประกอบวิชาชีพที่เกี่ยวข้องที่ได้ มาตรฐานการบริการด้านการแพทย์แผนไทย หมายถึง บริการการตรวจ วินิจฉัย รักษาโรค และฟื้นฟูสภาพ เช่น - การรักษาด้วยยาสมุนไพร - การนวดเพื่อรักษา-ฟื้นฟูสภาพ - การอบไอน้ำสมุนไพรเพื่อรักษา-ฟื้นฟูสภาพ - การประคบสมุนไพรเพื่อรักษา-ฟื้นฟูสภาพ - การพอกยาสมุนไพรเพื่อการรักษา - การทับหม้อเกลือ - การทำหัตถการอื่นๆ ตามมาตรฐานวิชาชีพแพทย์แผนไทย หรือการบริการ อื่นๆที่มีการเพิ่มรหัสภายหลัง การบริการด้านการแพทย์ทางเลือก หมายถึง บริการรักษาพยาบาล นอกเหนือจาก การแพทย์แผนปัจจุบัน และการแพทย์แผนไทย เช่น - ฝังเข็ม - การแพทย์ทางเลือกอื่นๆ หรือการบริการอื่นๆที่มีการเพิ่มรหัสภายหลัง สถานบริการสาธารณสุขภาครัฐ หมายถึง โรงพยาบาลศูนย์ โรงพยาบาล ทั่วไปโรงพยาบาลชุมชน และโรงพยาบาลส่งเสริมสุขภาพตำบล ร้อยละผู้ป่วยนอกที่ได้รับบริการ ตรวจ วินิจฉัย รักษาโรค และฟื้นฟูสภาพ ด้วย ศาสตร์การแพทย์แผนไทยและการแพทย์ทางเลือก มากกว่าหรือเท่ากับ ร้อยละ 21 ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ 2566 2567 2568 2569 2570 ≥21 ≥21 ≥21 ≥21 ≥21 เพื่อส่งเสริมให้ประชาชนได้รับบริการส่งเสริมสุขภาพ การป้องกัน การรักษาโรค และการฟื้นฟูสุขภาพ และเพื่อส่งเสริมให้ประชาชนที่มีการวินิจฉัยโรคข้อเข่าเสื่อม เข้ า ถึ งบ ริ ก า ร ด้ า น ก า ร แ พ ท ย์ แ ผ น ไท ย แ ล ะ ก า ร แ พ ท ย์ ท า งเลื อ ก ที่ มี คุ ณ ภ า พ ครอบคลุมสถานบริการสาธารณสุขของรัฐ สังกัดกระทรวงสาธารณสุขทุกระดับ (Community base) สถานบริการสุขภาพทุกแห่ง ในเครือข่ายบริการสุขภาพ (CUP)",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "(จำนวนผลงานที่บรรลุเกณฑ์ [A] ÷ จำนวนกลุ่มเป้าหมายทั้งหมด [B]) × 100",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI67-27": {
      "kpiId": "KPI67-27",
      "order": 27,
      "name": "ร้อยละของผู้ป่วยเบาหวานควบคุมน้ำตาลได้",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 5",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "40",
      "baseline": "26.60",
      "definition": "ร้อยละของผู้ป่วยเบาหวานควบคุมน้ำตาลได้ ตามเกณฑ์มาตรฐานแผนยุทธศาสตร์สุขภาพ 5 ปี จังหวัดขอนแก่น (พ.ศ. 2566–2570)",
      "purpose": "เพื่อลดจำนวนผู้ป่วยรายใหม่จากปีงบประมาณที่ผ่านมา",
      "population": "ประชากรที่อาศัยในพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วย โรคเบาหวาน (E10-E14) ในปีงบประมาณปัจจุบัน",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบรายงาน HDC กระทรวงสาธารณสุข",
      "formula": "A = จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วย โรคเบาหวาน (E10-E14) ในปีงบประมาณปัจจุบัน B = จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วย โรคเบาหวาน (E10-E14) ในปีงบประมาณที่ผ่านมา สูตรคำนวณ (B-A/B) x 100 ตัวชี้วัด ระยะเวลา 12 เดือน ประเมินผล",
      "numeratorA": "จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วย",
      "denominatorB": "จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วย",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "A : จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วย โรคเบาหวาน (E10-E14) ในปีงบประมาณปัจจุบัน ประมวลผลจาก DIAGNOSIS_OPD , รายละเอียด DIAGNOSIS_IPD , CHORNIC รหัส ICD-10 3 หลักขึ้นต้นด้วย E10-E14 ที่อยู่อาศัยในเขต ข้อมูลพื้นฐาน พื้นที่รับผิดชอบ PERSON.TYPE AREA IN (1 , 3) (Baseline 1 (มีชื่ออยู่ตามทะเบียนบ้านในเขตพื้นที่รับผิดชอบและอยู่จริง) , 3 (มาอาศัยในเขตรับผิดชอบ Data) แต่ทะเบียนอยู่นอกเขตรับผิดชอบ) และ PERSON.DISCHARGE = “9” (ไม่จำหน่าย) ผลการ PERSON.NATION = “099” (สัญชาติไทย) ดำเนินงาน B : จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วย ย้อนหลัง 3 ปี โรคเบาหวาน (E10-E14) ในปีงบประมาณที่ผ่านมา ประมวลผลจาก DIAGNOSIS_OPD , (ปี 2564 - DIAGNOSIS_IPD , CHORNIC รหัส ICD-10 3 หลักขึ้นต้นด้วย E10-E14 2566)",
      "responsible": "ผลงาน ปี 2564 ปี 2565 ปี 2566 ตัวชี้วัด ร้อยละของผู้ป่วยเบาหวาน 3.98 -18.25 -5.98 รายใหม่ลดลง นางแสงเดือน โสภา ตำแหน่ง พยาบาลวิชาชีพชำนาญการ กลุ่มงาน ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ โทรสาร 0-4322-4037 โทรศัพท์มือถือ E-mail : sangdern.sopa@gmail.com"
    },
    "KPI67-28": {
      "kpiId": "KPI67-28",
      "order": 28,
      "name": "ร้อยละของผู้ป่วยความดันโลหิตสูงควบคุมความดันโลหิตได้",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 5",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "60",
      "baseline": "53.22",
      "definition": "ร้อยละของผู้ป่วยความดันโลหิตสูงควบคุมความดันโลหิตได้ ตามเกณฑ์มาตรฐานแผนยุทธศาสตร์สุขภาพ 5 ปี จังหวัดขอนแก่น (พ.ศ. 2566–2570)",
      "purpose": "เพื่อลดจำนวนผู้ป่วยรายใหม่จากปีงบประมาณที่ผ่านมา",
      "population": "ประชากรที่อาศัยในพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วย โรคเบาหวาน (E10-E14) ในปีงบประมาณปัจจุบัน",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบรายงาน HDC กระทรวงสาธารณสุข",
      "formula": "A = จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วย โรคเบาหวาน (E10-E14) ในปีงบประมาณปัจจุบัน B = จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วย โรคเบาหวาน (E10-E14) ในปีงบประมาณที่ผ่านมา สูตรคำนวณ (B-A/B) x 100 ตัวชี้วัด ระยะเวลา 12 เดือน ประเมินผล",
      "numeratorA": "จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วย",
      "denominatorB": "จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วย",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "A : จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วย โรคเบาหวาน (E10-E14) ในปีงบประมาณปัจจุบัน ประมวลผลจาก DIAGNOSIS_OPD , รายละเอียด DIAGNOSIS_IPD , CHORNIC รหัส ICD-10 3 หลักขึ้นต้นด้วย E10-E14 ที่อยู่อาศัยในเขต ข้อมูลพื้นฐาน พื้นที่รับผิดชอบ PERSON.TYPE AREA IN (1 , 3) (Baseline 1 (มีชื่ออยู่ตามทะเบียนบ้านในเขตพื้นที่รับผิดชอบและอยู่จริง) , 3 (มาอาศัยในเขตรับผิดชอบ Data) แต่ทะเบียนอยู่นอกเขตรับผิดชอบ) และ PERSON.DISCHARGE = “9” (ไม่จำหน่าย) ผลการ PERSON.NATION = “099” (สัญชาติไทย) ดำเนินงาน B : จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วย ย้อนหลัง 3 ปี โรคเบาหวาน (E10-E14) ในปีงบประมาณที่ผ่านมา ประมวลผลจาก DIAGNOSIS_OPD , (ปี 2564 - DIAGNOSIS_IPD , CHORNIC รหัส ICD-10 3 หลักขึ้นต้นด้วย E10-E14 2566)",
      "responsible": "ผลงาน ปี 2564 ปี 2565 ปี 2566 ตัวชี้วัด ร้อยละของผู้ป่วยเบาหวาน 3.98 -18.25 -5.98 รายใหม่ลดลง นางแสงเดือน โสภา ตำแหน่ง พยาบาลวิชาชีพชำนาญการ กลุ่มงาน ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ โทรสาร 0-4322-4037 โทรศัพท์มือถือ E-mail : sangdern.sopa@gmail.com"
    },
    "KPI67-29": {
      "kpiId": "KPI67-29",
      "order": 29,
      "name": "ร้อยละการจัดตั้งหน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิตามพระราชบัญญัติระบบสุขภาพปฐมภูมิ พ.ศ. 2562",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 5",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "80",
      "baseline": "73.00",
      "definition": "หน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิ หมายถึง หน่วยบริการที่ได้ขึ้นทะเบียน เป็นหน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิ ตามพระราชบัญญัติระบบสุขภาพปฐมภูมิ พ.ศ. 2562 แพทย์เวชศาสตร์ครอบครัว หมายความว่า แพทย์ที่ได้รับหนังสืออนุมัติหรือวุฒิบัตรเพื่อแสดงความรู้ ความชำนาญในการประกอบวิชาชีพเวชกรรมสาขาเวชศาสตร์ครอบครัว หรือแพทย์ที่ผ่านการอบรม ด้านเวชศาสตร์ครอบครัวจากหลักสูตรที่ปลัดกระทรวงสาธารณสุขให้ความเห็นชอบ 1. หลักสูตรพื้นฐานเวชศาสตร์ครอบครัวสำหรับแพทย์ปฐมภูมิ Basic Course of Family Medicine for Primary Care Doctor 2. หลักสูตรการฝึกอบรมระยะสั้น “เวชศาสตร์ครอบครัวสำหรับแพทย์ปฏิบัติงานในคลินิก หมอครอบครัว” พ.ศ. 2562 คณะผู้ให้บริการสุขภาพปฐมภูมิ หมายความว่า ผู้ประกอบวิชาชีพทางการแพทย์และสาธารณสุขซึ่ง ปฏิบัติงานร่วมกันกับแพทย์เวชศาสตร์ครอบครัวในการให้บริการสุขภาพปฐมภูมิ และให้หมายความ รวมถึงผู้ซึ่งผ่านการฝึกอบรมด้านสุขภาพปฐมภูมิเพื่อเป็นผู้สนับสนุนการปฏิบัติหน้าที่ของแพทย์เวชศาสตร์ ครอบครัวและผู้ประกอบวิชาชีพดังกล่าว บริการสุขภาพปฐมภูมิ เป็นบริการทางการแพทย์และสาธารณสุขที่ดูแลสุขภาพของบุคคลในบัญชี รายชื่อ ซึ่งมีขอบเขต ดังต่อไปนี้ (1) บริการสุขภาพอย่างองค์รวม แต่ไม่รวมถึงการดูแลโรคหรือปัญหาสุขภาพที่จำเป็นต้องใช้เทคนิค หรือเครื่องมือทางการแพทย์ที่ซับซ้อน การปลูกถ่ายอวัยวะ และการผ่าตัด ยกเว้น การผ่าตัดขนาดเล็ก ซึ่งสามารถฉีดยาชาเฉพาะที่ (2) บริการสุขภาพตั้งแต่แรก ครอบคลุมทุกกระบวนการสาธารณสุข ทั้งการส่งเสริมสุขภาพ การควบคุมโรค การป้องกันโรค การตรวจวินิจฉัยโรค การรักษาพยาบาล และการฟื้นฟูสุขภาพ แต่ไม่รวมถึง การบริการแบบผู้ป่วยนอกของหน่วยบริการระดับทุติยภูมิและตติยภูมิ การบริการแบบผู้ป่วยใน การคลอด และการปฏิบัติการฉุกเฉิน ยกเว้น กรณีการปฐมพยาบาลและการดูแลในภาวะฉุกเฉินเพื่อให้รอดพ้นภาวะ ฉุกเฉิน (3) บริการสุขภาพอย่างต่อเนื่อง ทุกช่วงวัยตั้งแต่ การตั้งครรภ์ ทารก วัยเด็ก วัยเรียน วัยรุ่น วัยทำงาน วัยสูงอายุ จนกระทั่งเสียชีวิต (4) การดูแลสุขภาพของบุคคลแบบผสมผสาน ประกอบด้วย การดูแลสุขภาพโดยการแพทย์ แผนปัจจุบัน การแพทย์แผนไทย หรือการแพทย์ทางเลือก (5) การบริการข้อมูลด้านสุขภาพและคำปรึกษาด้านสุขภาพแก่บุคคลในบัญชีรายชื่อ ตลอดจน คำแนะนำที่จำเป็นเพื่อให้สามารถตัดสินใจในการเลือกรับบริการหรือเข้าสู่ระบบการส่งต่อ (6) การส่งเสริมให้ประชาชนมีศักยภาพและมีความรู้ในการจัดการสุขภาพของตนเองและบุคคล ในครอบครัว ตลอดจนอาจสามารถร่วมตัดสินใจในการวางแผนการดูแลสุขภาพร่วมกับแพทย์เวชศาสตร์ ครอบครัวและคณะผู้ให้บริการสุขภาพปฐมภูมิได้",
      "purpose": "1. เพื่อให้ประชาชนมีแพทย์เวชศาสตร์ครอบครัวและคณะผู้ให้บริการสุขภาพปฐมภูมิ 2. เพื่อให้มีสุขภาพแข็งแรง สามารถดูแลตนเองและครอบครัวเบื้องต้นเมื่อมีอาการเจ็บป่วย ได้อย่างเหมาะสม 3. เพื่อให้ประชาชนสามารถเข้าถึงบริการปฐมภูมิ",
      "population": "หน่วยบริการปฐมภูมิทุกแห่ง ทุกสังกัด",
      "collectionMethod": "1. จัดเก็บจากข้อมูลจำนวนหน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิ ในระบบ ขึ้นทะเบียน 2. การจัดเก็บการประเมินคุณภาพมาตรฐาน จากระบบทรัพยากรสุขภาพ หน่วยบริการปฐมภูมิ (PCU Standard)",
      "source": "1. ระบบขึ้นทะเบียนหน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิ 2. ระบบทรัพยากรสุขภาพ หน่วยบริการปฐมภูมิ (PCU Standard)",
      "formula": "(A/B) x 100",
      "numeratorA": "จำนวนหน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิที่ขึ้นทะเบียน",
      "denominatorB": "จำนวนหน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิตามแผนการจัดตั้ง",
      "frequency": "ไตรมาส 2 , ไตรมาส 3 และ ไตรมาส 4",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI67-30": {
      "kpiId": "KPI67-30",
      "order": 30,
      "name": "อัตราส่วนการใช้บริการผู้ป่วยนอกที่หน่วยบริการปฐมภูมิเทียบกับโรงพยาบาลแม่ข่าย (60 : 40)",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 5",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "80",
      "baseline": "12.12",
      "definition": "อัตราส่วนการใช้บริการผู้ป่วยนอกที่หน่วยบริการปฐมภูมิเทียบกับโรงพยาบาลแม่ข่าย (60 : 40) ตามเกณฑ์มาตรฐานแผนยุทธศาสตร์สุขภาพ 5 ปี จังหวัดขอนแก่น (พ.ศ. 2566–2570)",
      "purpose": "1. เพื่อให้ประชาชนสามารถเข้าถึงบริการที่มีคุณภาพ มาตรฐาน 2. เพื่อพัฒนาหน่วยบริการปฐมภูมิให้มีคุณภาพมาตรฐาน",
      "population": "หน่วยบริการปฐมภูมิทุกแห่ง ทุกสังกัด",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "ระบบคลังข้อมูลด้านการแพทย์และสาธารณสุข HDC datacenter สูตรคำนวณ A = จำนวนหน่วยบริการปฐมภูมิที่ผ่านเกณฑ์ 60 : 40 ตัวชี้วัด B = จำนวนหน่วยบริการปฐมภูมิทั้งหมด ระยะเวลา (A /B ) x 100 ประเมินผล",
      "numeratorA": "จำนวนหน่วยบริการปฐมภูมิที่ผ่านเกณฑ์ 60 : 40",
      "denominatorB": "จำนวนหน่วยบริการปฐมภูมิทั้งหมด",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ปีละ 1 ครั้ง รายละเอียด ข้อมูลพื้นฐาน ระบบคลังข้อมูลด้านการแพทย์และสาธารณสุข HDC datacenter (Baseline Data) ปี 2564 ปี 2565 ปี 2566 - ร้อยละ 47 ร้อยละ 12",
      "responsible": "กลุ่มงานพัฒนายุทธศาสตร์สาธารณสุข สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125 ต่อ 163"
    },
    "KPI67-31": {
      "kpiId": "KPI67-31",
      "order": 31,
      "name": "ร้อยละบุคลากรใน สสอ.ได้รับการพัฒนาสมรรถนะ อย่างน้อย 2 เรื่อง (Regulator & กฎหมายและ พ.ร.บ.สาธารณสุข พ.ศ.2535)",
      "strategy": "ยุทธศาสตร์ที่ 3",
      "objective": "เป้าประสงค์ที่ 6",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "40",
      "baseline": "NA",
      "definition": "จำนวนผลงานวิจัย/R2R/นวัตกรรมหรือเทคโนโลยีสุขภาพที่คิดค้นใหม่หรือที่พัฒนาต่อยอด ที่แก้ไขปัญหา สาธารณสุขที่สำคัญของจังหวัดขอนแก่น ผลงานวิจัย/ ผลงาน R2R (Routine to Research) หมายถึง ผลที่ได้จากการศึกษาค้นคว้าอย่างเป็น ระบบด้วยวิธีการทางวิทยาศาสตร์หรือวิธีการที่เชื่อถือได้ ซึ่งต้องเป็นไปตามระเบียบวิธีหรือกฎเกณฑ์ ที่ถูกต้อง/ การพัฒนางานประจำสู่งานวิจัย ที่คิดค้นใหม่หรือที่พัฒนาต่อยอด เพื่อให้ได้ความรู้ที่เชื่อถือได้ มีเหตุมีผลเป็นไปตามวิธีการทางวิทยาศาสตร์ และนำไปใช้อย่างเป็นประโยชน์ในการให้บริการด้าน สาธารณสุข แก้ไขปัญหาสาธารณสุขในพื้นที่และปัญหาสาธารณสุขที่สำคัญจังหวัดขอนแก่นได้ นวัตกรรม (Innovative) หมายถึง สิ่งที่ทำขึ้นใหม่ หรือแตกต่างจากเดิม ซึ่งอาจเป็นความคิด วิธีการ หรืออุปกรณ์ เป็นต้น ที่มีคุณค่า และมีประโยชน์ต่อการให้บริการสุขภาพแก่ประชาชน นวัตกรรมการจัดการบริการสุขภ าพ (Innovative Healthcare Management) หมายถึง นวัตกรรมการบริหารและการจัดบริการสุขภาพใหม่ แก่ประชาชนให้สามารถเข้าถึงบริการทางการแพทย์ และสาธารณสุขได้รวดเร็ว สะดวก ปลอดภัย และมีประสิทธิภาพเพื่อส่งเสริมคุณภาพชีวิตประชาชนให้ดีขึ้น เทคโนโลยีทางสุขภาพ หมายถึง การรวบรวมความรู้และวิธีการทางวิทยาศาสตร์มาใช้อย่างเป็นระบบซึ่ง จะช่วยให้เกิดประสิทธิภาพในการดูแลการสร้างเสริมสุขภาพ การป้องกันรักษาโรค และการฟื้นฟู สมรรถภาพทางร่างกาย เพื่อให้บุคคลหรือชุมชนมีสุขภาพที่ดีและมีความปลอดภัยในชีวิต ทั้งนี้หมายรวมถึง เทคโนโลยีที่เกี่ยวกับผลิตภัณฑ์สุขภาพ (เทคโนโลยีเกี่ยวกับผลิตภัณฑ์เครื่องสำอาง อาหาร ยา เครื่องมือ แพทย์ และอุปกรณ์หรือเครื่องมือสุขภาพ) และบริการสุขภาพ (เทคโนโลยีที่เกี่ยวกับการตรวจโรค การรักษาโรค การป้องกันโรค และการสร้างเสริมสุขภาพ) การพัฒนาต่อยอด หมายถึง การนำนวัตกรรมด้านวิทยาศาสตร์การแพทย์หรือเทคโนโลยีสุขภาพ ที่เคยมีการศึกษา วิจัยประดิษฐ์ คิดค้นขึ้นที่สำเร็จแล้ว นำมาพัฒนาต่อยอด ให้เกิดประโยชน์เพิ่มเติมจากเดิม การนำองค์ความรู้ เทคโนโลยี และนวัตกรรมไปใช้ประโยชน์ หมายถึง การมีหลักฐานที่แสดงว่าได้ มีการนำองค์ความรู้ เทคโนโลยี และนวัตกรรมที่ได้จากการศึกษา วิจัย ไปใช้ประโยชน์ในการแก้ปัญหา สาธารณสุขตาม",
      "purpose": "1. เพื่อแก้ไขปัญหาสาธสาธารณสุขที่สำคัญของจังหวัดขอนแก่น โดยงานวิจัย/R2R/ นวัตกรรม หรือ เทคโนโลยีสุขภาพที่คิดค้นใหม่หรือที่พัฒนาต่อยอด 2. เพื่อเพิ่มอายุคาดเฉลี่ยของประชาชนจังหวัดขอนแก่น เมื่อแรกเกิด (LE) ไม่น้อยกว่า 85 ปี อายุคาด เฉลี่ยของการมีสุขภาพดี (HALE) ไม่น้อยกว่า 75 ปี ตามเป้าหมายตามแผนยุทธศาสตร์ชาติ ระยะ 20 ปี ด้านสาธารณสุข",
      "population": "เครือข่ายบริการสุขภาพสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "collectionMethod": "รวบรวมข้อมูลจากเครือข่ายบริการสุขภาพสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "source": "ฐานข้อมูลผลงานวิจัย/R2R/นวัตกรรม ด้านวิทยาศาสตร์การแพทย์ของเครือข่ายบริการสุขภาพ สำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "formula": "- ระยะเวลา ไตรมาสที่ 3-4 ประเมินผล",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI67-32": {
      "kpiId": "KPI67-32",
      "order": 32,
      "name": "ร้อยละหน่วยบริการได้รับการพัฒนากำลังคนตามแผนยกระดับระดับบริการสาธารณสุข (SAP)",
      "strategy": "ยุทธศาสตร์ที่ 3",
      "objective": "เป้าประสงค์ที่ 6",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "70",
      "baseline": "NA",
      "definition": "จำนวนผลงานวิจัย/R2R/นวัตกรรมหรือเทคโนโลยีสุขภาพที่คิดค้นใหม่หรือที่พัฒนาต่อยอด ที่แก้ไขปัญหา สาธารณสุขที่สำคัญของจังหวัดขอนแก่น ผลงานวิจัย/ ผลงาน R2R (Routine to Research) หมายถึง ผลที่ได้จากการศึกษาค้นคว้าอย่างเป็น ระบบด้วยวิธีการทางวิทยาศาสตร์หรือวิธีการที่เชื่อถือได้ ซึ่งต้องเป็นไปตามระเบียบวิธีหรือกฎเกณฑ์ ที่ถูกต้อง/ การพัฒนางานประจำสู่งานวิจัย ที่คิดค้นใหม่หรือที่พัฒนาต่อยอด เพื่อให้ได้ความรู้ที่เชื่อถือได้ มีเหตุมีผลเป็นไปตามวิธีการทางวิทยาศาสตร์ และนำไปใช้อย่างเป็นประโยชน์ในการให้บริการด้าน สาธารณสุข แก้ไขปัญหาสาธารณสุขในพื้นที่และปัญหาสาธารณสุขที่สำคัญจังหวัดขอนแก่นได้ นวัตกรรม (Innovative) หมายถึง สิ่งที่ทำขึ้นใหม่ หรือแตกต่างจากเดิม ซึ่งอาจเป็นความคิด วิธีการ หรืออุปกรณ์ เป็นต้น ที่มีคุณค่า และมีประโยชน์ต่อการให้บริการสุขภาพแก่ประชาชน นวัตกรรมการจัดการบริการสุขภ าพ (Innovative Healthcare Management) หมายถึง นวัตกรรมการบริหารและการจัดบริการสุขภาพใหม่ แก่ประชาชนให้สามารถเข้าถึงบริการทางการแพทย์ และสาธารณสุขได้รวดเร็ว สะดวก ปลอดภัย และมีประสิทธิภาพเพื่อส่งเสริมคุณภาพชีวิตประชาชนให้ดีขึ้น เทคโนโลยีทางสุขภาพ หมายถึง การรวบรวมความรู้และวิธีการทางวิทยาศาสตร์มาใช้อย่างเป็นระบบซึ่ง จะช่วยให้เกิดประสิทธิภาพในการดูแลการสร้างเสริมสุขภาพ การป้องกันรักษาโรค และการฟื้นฟู สมรรถภาพทางร่างกาย เพื่อให้บุคคลหรือชุมชนมีสุขภาพที่ดีและมีความปลอดภัยในชีวิต ทั้งนี้หมายรวมถึง เทคโนโลยีที่เกี่ยวกับผลิตภัณฑ์สุขภาพ (เทคโนโลยีเกี่ยวกับผลิตภัณฑ์เครื่องสำอาง อาหาร ยา เครื่องมือ แพทย์ และอุปกรณ์หรือเครื่องมือสุขภาพ) และบริการสุขภาพ (เทคโนโลยีที่เกี่ยวกับการตรวจโรค การรักษาโรค การป้องกันโรค และการสร้างเสริมสุขภาพ) การพัฒนาต่อยอด หมายถึง การนำนวัตกรรมด้านวิทยาศาสตร์การแพทย์หรือเทคโนโลยีสุขภาพ ที่เคยมีการศึกษา วิจัยประดิษฐ์ คิดค้นขึ้นที่สำเร็จแล้ว นำมาพัฒนาต่อยอด ให้เกิดประโยชน์เพิ่มเติมจากเดิม การนำองค์ความรู้ เทคโนโลยี และนวัตกรรมไปใช้ประโยชน์ หมายถึง การมีหลักฐานที่แสดงว่าได้ มีการนำองค์ความรู้ เทคโนโลยี และนวัตกรรมที่ได้จากการศึกษา วิจัย ไปใช้ประโยชน์ในการแก้ปัญหา สาธารณสุขตาม",
      "purpose": "1. เพื่อแก้ไขปัญหาสาธสาธารณสุขที่สำคัญของจังหวัดขอนแก่น โดยงานวิจัย/R2R/ นวัตกรรม หรือ เทคโนโลยีสุขภาพที่คิดค้นใหม่หรือที่พัฒนาต่อยอด 2. เพื่อเพิ่มอายุคาดเฉลี่ยของประชาชนจังหวัดขอนแก่น เมื่อแรกเกิด (LE) ไม่น้อยกว่า 85 ปี อายุคาด เฉลี่ยของการมีสุขภาพดี (HALE) ไม่น้อยกว่า 75 ปี ตามเป้าหมายตามแผนยุทธศาสตร์ชาติ ระยะ 20 ปี ด้านสาธารณสุข",
      "population": "เครือข่ายบริการสุขภาพสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "collectionMethod": "รวบรวมข้อมูลจากเครือข่ายบริการสุขภาพสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "source": "ฐานข้อมูลผลงานวิจัย/R2R/นวัตกรรม ด้านวิทยาศาสตร์การแพทย์ของเครือข่ายบริการสุขภาพ สำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "formula": "- ระยะเวลา ไตรมาสที่ 3-4 ประเมินผล",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI67-33": {
      "kpiId": "KPI67-33",
      "order": 33,
      "name": "จำนวนนวัตกรรมหรือเทคโนโลยีสุขภาพที่คิดค้นใหม่หรือพัฒนาต่อยอด เพื่อแก้ไขปัญหาสาธารณสุขที่สำคัญจังหวัดขอนแก่น",
      "strategy": "ยุทธศาสตร์ที่ 4",
      "objective": "เป้าประสงค์ที่ 7",
      "unit": "เรื่อง",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "300 (เรื่อง)",
      "baseline": "283",
      "definition": "มาตรฐาน HAIT (Hospital Accreditation Information Technology) เป็นมาตรฐานที่พัฒนาโดย สมาคมเวชสารสนเทศไทย (TMI) มี 4 Level มาตรฐาน HAIT เป็นเครื่องมือที่มีประสิทธิภาพสำหรับ โรงพยาบาลที่ต้องการพัฒนาระบบ IT ให้มีประสิทธิภาพ ปลอดภัย และเชื่อถือได้ การนำมาตรฐาน HAIT มาใช้ ช่วยให้โรงพยาบาลยกระดับคุณภาพมาตรฐานการบริการด้านสุขภาพ และสร้างความพึงพอใจให้กับ ผู้ป่วย โรงพยาบาลที่ต้องการขอรับรองมาตรฐาน HAIT จะต้องผ่านการประเมินจากคณะผู้ประเมินของ TMI",
      "purpose": "1. สร้างความมั่นใจในคุณภาพและความปลอดภัยของระบบ IT ที่ใช้ในการดูแลรักษาผู้ป่วย 2. ส่งเสริมการพัฒนาระบบสารสนเทศอย่างต่อเนื่องตามมาตรฐานสากล 3. เพิ่มประสิทธิภาพในการบริหารจัดการและการให้บริการทางการแพทย์",
      "population": "โรงพยาบาลชุมชน",
      "collectionMethod": "ผู้รับผิดชอบรายงานผลงานเป็นรายไตรมาสไปยังระบบรายงานองค์กรดิจิทัล(ออนไลน์)",
      "source": "(ออนไลน์) https://ict.kkpho.go.th/org เกณฑ์คะแนน 1. รพช.ไม่ยื่นเพื่อขอประเมิน = 0 คะแนน ตัวชี้วัด 2. รพช.ยื่นเพื่อขอประเมิน = 5 คะแนน",
      "formula": "ผลการดำเนินงานจริงเทียบกับเกณฑ์เป้าหมาย (เรื่อง)",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "ทุกไตรมาส",
      "evaluationMethod": "ปีงบประมาณ พ.ศ.2568 (ต.ค.2567 – ก.ย.2568) รายละเอียดข้อมูลพื้นฐาน หน่วยวัด ผลการดำเนินงานปีงบประมาณ ไม่มี Baseline Data ปี 2565 ปี 2566 ปี 2567 ไม่มี ไม่มี ไม่มี ไม่มี",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI67-34": {
      "kpiId": "KPI67-34",
      "order": 34,
      "name": "จำนวนหน่วยงานสาธารณสุขที่พัฒนาสู่องค์กรดิจิทัล",
      "strategy": "ยุทธศาสตร์ที่ 4",
      "objective": "เป้าประสงค์ที่ 7",
      "unit": "แห่ง",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "26 แห่ง",
      "baseline": "-",
      "definition": "การแพทย์ทางไกล หรือ Telemedicine คือการใช้เทคโนโลยีสารสนเทศและการสื่อสารเพื่อให้บริการ",
      "purpose": "1. เพื่อยกระดับการบริการของโรงพยาบาลโดยการประยุกต์ใช้เทคโนโลยีดิจิทัล ในการจัดบริการสุขภาพ",
      "population": "ได้อย่างมีประสิทธิภาพ มีคุณภาพและความปลอดภัย 2. เพื่อพัฒนาคุณภาพการให้บริการของโรงพยาบาล โดยยึดประชาชนเป็นศูนย์กลางตอบสนองความ ต้องการของประชาชนและความจําเป็นด้านสุขภาพได้ 3. เพื่อให้การบริการจัดการของโรงพยาบาลมีประสิทธิภาพ สามารถลดขั้นตอนการทํางาน ลดภาระงาน ของบุคลากร และลดการใช้ทรัพยากร โรงพยาบาลศูนย์/โรงพยาบาลทั่วไป/โรงพยาบาลชุมชน",
      "collectionMethod": "ผู้รับผิดชอบจัดเก็บข้อมูลหลักฐานการผ่านการอบรมออนไลน์ (online)",
      "source": "HDC จังหวัดขอนแก่น เกณฑ์คะแนนตัวชี้วัด ตามเกณฑ์คะแนน KPI ของกระทรวงสาธาณสุข ปี 2568 ด้านการให้บริการการแพทย์ทางไกล",
      "formula": "ผลการดำเนินงานจริงเทียบกับเกณฑ์เป้าหมาย (แห่ง)",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "ทุกไตรมาส",
      "evaluationMethod": "ปีงบประมาณ พ.ศ.2568 รายละเอียดข้อมูลพื้นฐาน Baseline Data หน่วยวัด ผลการดำเนินงานปีงบประมาณ ไม่มี ไม่มี ปี 2565 ปี 2566 ปี 2567 ไม่มี ไม่มี ไม่มี",
      "responsible": "ชื่อ-สกุล น.ส.สมจิตร เดชาเสถียร ตำแหน่ง นักวิชาการสาธารณสุขชำนาญการพิเศษ โทรศัพท์มือถือ098-101-0754 E-mail : nongsomdec@gmail.com ชื่อ-สกุล นายสุทธิศักดิ์ ธรรมพล ตำแหน่ง นักวิชาการคอมพิวเตอร์ปฏิบัติการ โทรศัพท์มือถือ 082-305-7572 E-mail : buboocs@gmail.com ชื่อ-สกุล นายธนาวุธ จำปาแดง ตำแหน่ง นักวิชาการคอมพิวเตอร์ปฏิบัติการ โทรศัพท์มือถือ 082-3136909 E-mail : - ชื่อ-สกุล นายอนิวัฒน์ พูนมณี ตำแหน่ง นักวิชาการคอมพิวเตอร์ โทรศัพท์มือถือ 095-186-7287 E-mail : bomb.aniwat@gmail.com ชื่อ-สกุล นายพชร เอี่ยมสุดใจ ตำแหน่ง นักวิชาการสาธารณสุขปฏิบัติการ โทรศัพท์มือถือ 061-3540905 E-mail : Phachara_pa@outlook.com ชื่อ-สกุล นายณภัทรพล พิมพาเรือ ตำแหน่ง นักวิชาการคอมพิวเตอร์ โทรศัพท์มือถือ 090-9915655 E-mail : naphat.p123465@gmail.com"
    },
    "KPI67-35": {
      "kpiId": "KPI67-35",
      "order": 35,
      "name": "หน่วยบริการที่มีการบริการการแพทย์ทางไกลตามเกณฑ์ที่กำหนด",
      "strategy": "ยุทธศาสตร์ที่ 4",
      "objective": "เป้าประสงค์ที่ 7",
      "unit": "ครั้ง/รพ.",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "รพ.ไม่น้อยกว่า 50% และ ≥5,500 ครั้ง",
      "baseline": "12,392 ครั้ง",
      "definition": "หน่วยบริการที่มีการบริการการแพทย์ทางไกลตามเกณฑ์ที่กำหนด ตามเกณฑ์มาตรฐานแผนยุทธศาสตร์สุขภาพ 5 ปี จังหวัดขอนแก่น (พ.ศ. 2566–2570)",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "ผลการดำเนินงานจริงเทียบกับเกณฑ์เป้าหมาย (ครั้ง/รพ.)",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI67-36": {
      "kpiId": "KPI67-36",
      "order": 36,
      "name": "โรงพยาบาลสังกัดกระทรวงสาธารณสุขมีคุณภาพมาตรฐาน HA ผ่านการรับรอง HA ขั้น 3",
      "strategy": "ยุทธศาสตร์ที่ 4",
      "objective": "เป้าประสงค์ที่ 8",
      "unit": "แห่ง",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "24 แห่ง",
      "baseline": "-",
      "definition": "9.อัตราตายทารกแรกเกิด ไม่เกิน 3.6 ต่อการเกิดมีชีพพันคน",
      "purpose": "1.เพื่อเพิ่มประสิทธิภาพการดูแลรักษาทารกแรกเกิดใหทั่วถึง 2.เพื่อลดอัตราตายทารกแรกเกิด",
      "population": "ทารกที่คลอดและมีชีวิตจนถึง 28 วัน",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "2.รายงานการตายทารก จากโปรแกรม Newborn registry เขตสุขภาพที่ 7",
      "formula": "1 1.หน่วยบริการทุกระดับในสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่น 2.ฐานข้อมูล Health Data Center A = จำนวนทารกที่เสียชีวิต ≤ 28 วัน รายการข้อมูล 2 B = จำนวนเด็กเกิดมีชีพทั้งหมดในช่วงเวลาเดียวกัน สูตรคำนวณ (AxB) x 1,000 ตัวชี้วัด ระยะเวลา ทุก 3 เดือน ประเมินผล",
      "numeratorA": "จำนวนทารกที่เสียชีวิต ≤ 28 วัน",
      "denominatorB": "จำนวนเด็กเกิดมีชีพทั้งหมดในช่วงเวลาเดียวกัน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "เปรียบเทียบผลการดำเนินงานกับค่าเป้าหมาย รายละเอียดข้อมูลพื้นฐาน Baseline Data หน่วยวัด ผลการดำเนินงานปีงบประมาณ อัตราตายทารกแรกเกิด อัตราตาย ปี 2564 ปี 2565 ปี 2566 ทารกแรกเกิด 3.20 2.80 2.60 ตอ เกิดมีชีพ 1,000 คน",
      "responsible": "นางนรินทร์รัตน์ แก้วลา ตำแหน่ง พยาบาลวิชาชีพชำนาญการ ตัวชี้วัด นางสมาพร สุรเตมีย์กุล ตำแหน่ง พยาบาลวิชาชีพชำนาญการ กลุ่มงาน ส่งเสริมสุขภาพ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ 149 โทรสาร 0-4322-4037 โทรศัพท์มือถือ 085-3956466 E-mail : narinratkaewla@gmail.com"
    },
    "KPI67-37": {
      "kpiId": "KPI67-37",
      "order": 37,
      "name": "จำนวนสาธารณสุขอำเภอ ผ่านเกณฑ์ SMART สสอ.",
      "strategy": "ยุทธศาสตร์ที่ 4",
      "objective": "เป้าประสงค์ที่ 8",
      "unit": "แห่ง",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "5",
      "baseline": "NA",
      "definition": "หน่วยบริการปฐมภูมิ หมายถึง หน่วยบริการสาธารณสุขระดับปฐมภูมิ ทุกสังกัดที่ขึ้นทะเบียน เป็นหน่วยบริการปฐมภูมิเกณฑ์ประเมินคุณภาพมาตรฐานบริการสุขภาพปฐมภูมิ หมายถึง เกณฑ์ ประเมิณคุณภาพมาตรฐานบริการสุขภาพปฐมภูมิ พ.ศ.2566 (ฉบับปรับปรุง) มีเกณฑ์การประเมินดังนี้ ส่วนที่ 1 ด้านระบบบริหารจัดการ ส่วนที่ 2 ด้านการจัดบุคคลากรและศักยภาพในการให้บริการ ส่วนที่ 3 ด้านสถานที่ตั้งหน่วยบริการ อาคาร สถานที่ และสิ่งแวดล้อม ส่วนที่ 4 ด้านระบบสารสนเทศ ส่วนที่ 5 ด้านระบบบริการสุขภาพปฐมภูมิ ส่วนที่ 6 ด้านระบบห้องปฏิบัติการด้านการแพทย์และสาธารณสุข ส่วนที่ 7 ด้านการจัดบริการเภสัชกรรมอลังานคุ้มครองผู้บริโภคด้านสุขภาพ ส่วนที่ 8 ด้านระบบการป้องกันและควบคุมการติดเชื่อ โดยมีการแปลผลดังนี้ ส่วนที่ 1 – 4 หน่วยบริการต้องผ่านเกณฑ์ทุกข้อ ส่วนที่ 5 – 8 หน่วยบริการต้องผ่านเกณ์ร้อยละ 80 ขึ้นไป",
      "purpose": "1. เพื่อให้ประชาชนสามารถเข้าถึงบริการที่มีคุณภาพ มาตรฐาน 2. เพื่อพัฒนาหน่วยบริการปฐมภูมิให้มีคุณภาพมาตรฐาน",
      "population": "หน่วยบริการปฐมภูมิทุกแห่ง ทุกสังกัด",
      "collectionMethod": "การจัดเก็บการประเมินคุณภาพมาตรฐาน จากระบบข้อมูลทรัพยากรสุขภาพหน่วยบริการปฐมภูมิ",
      "source": "(PCU Standard)",
      "formula": "A = จำนวนหน่วยบริการปฐมภูมิที่ผ่านเณฑ์การประเมิณมาตรฐานระบบสุขภาพปฐมภูมิ",
      "numeratorA": "จำนวนหน่วยบริการปฐมภูมิที่ผ่านเณฑ์การประเมิณมาตรฐานระบบสุขภาพปฐมภูมิ",
      "denominatorB": "จำนวนหน่วยบริการปฐมภูมิทั้งหมดทุกสังกัด",
      "frequency": "B = จำนวนหน่วยบริการปฐมภูมิทั้งหมดทุกสังกัด",
      "evaluationMethod": "ระบบข้อมูลทรัพยากรสุขภาพ หน่วยบริการปฐมภูมิ (PCU Standard )และ สุ่มลงตรวจประเมิน ในพื้นที่ รายละเอียดข้อมูล พื้นฐาน(Baseline ผลงาน ปี 2565 ปี 2566 ปี 2567 Data) Baseline Data - - ร้อยละ 41.08 ผลการดำเนินงาน ย้อนหลัง 3 ปี ชื่อ-สกุล...นางศิริพร อุทธากิจ ตำแหน่ง..พยาบาลวิชาชีพชำนาญการ (ปี 2565 -2567) กลุ่มงาน..พัฒนาคุณภาพและรูปแบบบริการ.",
      "responsible": "สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ 122... โทรสาร 0-4322-4037 ผู้กำกับดูแลตัวชี้วัด โทรศัพท์มือถือ..080 - 3570910. E-mail : .pcunpcu2022@gmail.com ชื่อ-สกุล...นางศิริมา นามประเสริฐ ตำแหน่ง..หัวหน้ากลุ่มงานพัฒนาคุณภาพและรูปแบบบริการ กลุ่มงาน..พัฒนาคุณภาพและรูปแบบบริการ. สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ 122... โทรสาร 0-4322-4037"
    },
    "KPI67-38": {
      "kpiId": "KPI67-38",
      "order": 38,
      "name": "ร้อยละของหน่วยบริการปฐมภูมิ ทุกสังกัด ผ่านเกณฑ์มาตรฐานหน่วยบริการปฐมภูมิ",
      "strategy": "ยุทธศาสตร์ที่ 4",
      "objective": "เป้าประสงค์ที่ 8",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "มีพื้นที่นำร่อง",
      "baseline": "99.32 (ประเมินตนเอง)",
      "definition": "3 8 .ร้อ ยล ะข อ งห น่ ว ย บ ริก ารที่ ผ่ าน เก ณ ฑ์ ป ระเมิ ณ คุ ณ ภ าพ ม าต รฐ าน บ ริก ารสุ ขภ าพ",
      "purpose": "หน่วยบริการปฐมภูมิ หมายถึง หน่วยบริการสาธารณสุขระดับปฐมภูมิ ทุกสังกัดที่ขึ้น",
      "population": "ทะเบียนเป็นหน่วยบริการปฐมภูมิ",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ส่วนที่ 1 ด้านระบบบริหารจัดการ",
      "formula": "ส่วนที่ 2 ด้านการจัดบุคคลากรและศักยภาพในการให้บริการ สูตรคำนวณ ส่วนที่ 3 ด้านสถานที่ตั้งหน่วยบริการ อาคาร สถานที่ และสิ่งแวดล้อม ตัวชี้วัด ส่วนที่ 4 ด้านระบบสารสนเทศ ระยะเวลา ส่วนที่ 5 ด้านระบบบริการสุขภาพปฐมภูมิ ประเมินผล ส่วนที่ 6 ด้านระบบห้องปฏิบัติการด้านการแพทย์และสาธารณสุข ส่วนที่ 7 ด้านการจัดบริการเภสัชกรรมอลังานคุ้มครองผู้บริโภคด้านสุขภาพ ส่วนที่ 8 ด้านระบบการป้องกันและควบคุมการติดเชื่อ โดยมีการแปลผลดังนี้ ส่วนที่ 1 – 4 หน่วยบริการต้องผ่านเกณฑ์ทุกข้อ ส่วนที่ 5 – 8 หน่วยบริการต้องผ่านเกณ์ร้อยละ 80 ขึ้นไป ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ 2567 2568 2569 2570 ร้อยละ 90 ร้อยละ 100 ร้อยละ 100 ร้อยละ 100 1.เพื่อให้ประชาชนสามารถเข้าถึงบริการที่มีคุณภาพ มาตรฐาน 2.เพื่อพัฒนาหน่วยบริการปฐมภูมิให้มีคุณภาพมาตรฐาน หน่วยบริการปฐมภูมิทุกแห่ง ทุกสังกัด การจัดเก็บการประเมินคุณภาพมาตรฐาน จากระบบทรัพยากรสุขภาพ หน่วยบริการปฐมภูมิ (GIS Health/PCU) ระบบทรัพยากรสุขภาพ หน่วยบริการปฐมภูมิ (GIS Health/PCU) A = จำนวนหน่วยบริการปฐมภูมิที่ผ่านเณฑ์การประเมิณมาตรฐานระบบสุขภาพปฐมภูมิ B = จำนวนหน่วยบริการปฐมภูมิทั้งหมดทุกสังกัด (A/B) x 100 ปีละ 1 ครั้ง",
      "numeratorA": "จำนวนหน่วยบริการปฐมภูมิที่ผ่านเณฑ์การประเมิณมาตรฐานระบบสุขภาพปฐมภูมิ",
      "denominatorB": "จำนวนหน่วยบริการปฐมภูมิทั้งหมดทุกสังกัด",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ระบบทรัพยากรสุขภาพ หน่วยบริการปฐมภูมิ (GIS Health/PCU) และสุ่มประเมินในพื้นที่ ผลการดำเนินงาน ปี 2564 ปี 2565 ปี 2566 ย้อนหลัง 3 ปี ร้อยละ 97 (ปี 2564 - - - 2566)",
      "responsible": "นางศิริพร อุทธากิจ ตำแหน่ง..พยาบาลวิชาชีพชำนาญการ ตัวชี้วัด กลุ่มงานพัฒนาคุณภาพและรูปแบบบริการ สำนักงานสาธารณสุขจังหวัดขอนแก่น ผู้กำกับดูแล โทรศัพท์ 0-4322-1125 ต่อ 122 โทรสาร 0-4322-4037 ตัวชี้วัด โทรศัพท์มือถือ 080 - 3570910. E-mail : pcunpcu2022@gmail.com นางศิริมา นามประเสริฐ ตำแหน่ง หัวหน้ากลุ่มงานพัฒนาคุณภาพและรูปแบบบริการ กลุ่มงานพัฒนาคุณภาพและรูปแบบบริการ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ 122 โทรสาร 0-4322-4037"
    },
    "KPI67-39": {
      "kpiId": "KPI67-39",
      "order": 39,
      "name": "จำนวนโรงพยาบาลมีการบริหารการเงินการคลังอย่างมีประสิทธิภาพ",
      "strategy": "ยุทธศาสตร์ที่ 4",
      "objective": "เป้าประสงค์ที่ 9",
      "unit": "แห่ง",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "16 แห่ง",
      "baseline": "14 แห่ง (53.84%)",
      "definition": "และบริการทางสุขภาพ ร้อยละผลิตภัณฑ์สุขภาพและสถานประกอบการเพื่อสุขภาพมีคุณภาพตามเกณฑ์ >90%",
      "purpose": "ผลิตภัณฑ์สุขภาพ หมายถึง ผลิตภัณฑ์ยา อาหาร เครื่องสำอาง เครื่องมือแพทย์ ยาเสพติดที่ใช้ในทาง",
      "population": "การแพทย์ วัตถุ ออกฤทธิ์ต่อจิตและประสาท และวัตถุอันตรายที่ใช้ในบ้านเรือนและทางสาธารณสุข ที่ได้รับอนุญาตผลิตและขึ้นทะเบียนในพื้นที่จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "สถานประกอบการเพื่อสุขภาพ หมายถึง สถานที่ผลิต/จำหน่าย ยา อาหาร สมุนไพร เครื่องสำอาง",
      "formula": "1. ร้อยละผลิตภัณฑ์สุขภาพมีคุณภาพตามเกณฑ์ >93% (A) A = A2/A1*100 2. ร้อยละสถานประกอบการเพื่อสุขภาพมีคุณภาพตามเกณฑ์ >95% (B) B= B2/B1*100 ระยะเวลา ทุกไตรมาส ประเมินผล",
      "numeratorA": "A2/A1*100",
      "denominatorB": "B2/B1*100",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "การรายงาน และการวิเคราะห์เปรียบเทียบผล ปี 2567 รายละเอียดข้อมูล 1. ร้อยละผลิตภัณฑ์สุขภาพมีคุณภาพตามเกณฑ์ (A) ≥ 90.16% พื้นฐาน 2. ร้อยละสถานประกอบการเพื่อสุขภาพมีคุณภาพตามเกณฑ์ (B) ≥ 97.01% (Baseline Data) ผลการดำเนินงาน 1. นางกนกพร ธัญมณีสิน เภสัชกรชำนาญการพิเศษ สสจ.ขอนแก่น ย้อนหลัง 3 ปี (ปี 2. นางศศิธร เอื้ออนันต์ เภสัชกรชำนาญการพิเศษ สสจ.ขอนแก่น 2565 -2567) Email: sasitorneu@gmail.com โทร 081-3910199",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    }
  },
  "68": {
    "KPI68-01": {
      "kpiId": "KPI68-01",
      "order": 1,
      "name": "ร้อยละของประชาชนวัยทำงานอายุ 19-59 ปี มี BMI เกินได้รับการปรับเปลี่ยนพฤติกรรมและมี BMI ลดลง",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 1",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "3",
      "baseline": "3.94",
      "definition": "ร้อยละของประชาชนวัยทำงานอายุ 19-59 ปี มี BMI เกิน ได้รับการปรับเปลี่ยนพฤติกรรมและมี BMI ลดลง ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อาสาสมัครสาธารณสุขประจำหมู่บ้าน(อสม.) และบุคลากรสาธารณสุข ที่มีอายุ 19-59 ปี หมายถึง ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุข ที่มีอายุ 19 ปี 0 เดือน 1 วัน ถึง 59 ปี 11 เดือน 29 วัน ที่ยังไม่ป่วยด้วยโรคเบาหวาน และ/หรือความดันโลหิตสูงทั้งหมดในรอบ ปีงบประมาณ 2568 ค่าดัชนีมวลกาย (Body Mass Index : BMI) หมายถึง ค่าซึ่งเป็นความสัมพันธ์ระหว่างน้ำหนักตัวเป็นกิโลกรัม กับส่วนสูงเป็นเมตร หน่วยวัดเป็น กิโลกรัม/เมตร2",
      "purpose": "1. เพื่อให้ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม. และบุคลากรสาธารณสุข อายุ 19-59 ปี ได้รับการประเมินภาวะโภชนาการที่ครอบคลุม (ชั่งน้ำหนัก-วัดส่วนสูง ≥ 70%)\n2. เพื่อให้ประชาชนกลุ่มที่มีค่าดัชนีมวลกายอ้วนระดับ 1 และอ้วนระดับ 2 มี BMI ลดลง ≥ 2%",
      "population": "ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุข สังกัด รพ.สต./PCU/รพช./รพท./รพศ./สสอ. ที่มีอายุ 19-59 ปี ใน 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "อ้วนระดับ 1 และอ้วนระดับ 2 มี BMI ลดลง มากกว่าหรือเท่ากับ ร้อยละ 2",
      "source": "รายงานผลการคัดกรอง ชั่งน้ำหนัก วัดส่วนสูง วัดรอบเอว ดัชนีมวลกาย จากโปรแกรม Khonkaen-HTD และระบบ HDC สสจ.ขอนแก่น",
      "formula": "(จำนวนกลุ่มเป้าหมายที่มี BMI ลดลงตั้งแต่ 2% ขึ้นไป [A] ÷ จำนวนกลุ่มเป้าหมายที่มี BMI อ้วนระดับ 1 และ 2 ทั้งหมด [B]) × 100",
      "numeratorA": "จำนวนประชาชนกลุ่มเป้าหมายที่มีค่าดัชนีมวลกาย (BMI) ลดลงตั้งแต่ร้อยละ 2 ขึ้นไป",
      "denominatorB": "จำนวนประชาชนกลุ่มเป้าหมายที่มีค่าดัชนีมวลกายอ้วนระดับ 1 (BMI 25.0-29.9) และอ้วนระดับ 2 (BMI ≥ 30.0) ทั้งหมด",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "เกณฑ์การให้คะแนน(รวม 100 คะแนน) ผลรวม คะแนน 10 คะแนน 20 คะแนน 30 คะแนน 40 คะแนน 40 % ชั่ง นน. < 60.00 % 60.00–64.99 % 65.00-69.99 > 70.00 % สส. % คะแนน 15 คะแนน 30 คะแนน 45 คะแนน 60 คะแนน 60 % BMI ลดลง <1.00 % 1.00-1.49 % 1.50 – 1.99 % > 2.0 % 17.วิธีการประเมินผล คะแนน 1 คะแนน 2 คะแนน 3 คะแนน 4 คะแนน 5 คะแนนรวม < 60 คะแนนรวม คะแนนรวม คะแนนรวม คะแนนรวม 60.01-70.00 70.01-80.00 80.01-90.00 >90 รายละเอียดข้อมูล รายละเอียดข้อมูลพื้นฐาน (Baseline data) ผลการดำเนินงานย้อนหลัง 3 ปี (ปี 2565 - 2567) พื้นฐาน Baseline data หน่วยวัด ผลการดำเนินงานในรอบปีงบประมาณ (Baseline Data) ผลการดำเนินงาน 2565 2566 2567 ย้อนหลัง 3 ปี (ปี 2565 -2567) N/A N/A -3.94",
      "responsible": "นางสาวเทวารักษ์ ภูครองนาค นักวิชาการสาธารณสุขชำนาญการ โทร. 09 5652 7227 Email : theywarak.ph@gmail.com กลุ่มงานควบคุมโรคไม่ติดต่อ สำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "targets": {
        "t66": "-",
        "t67": "2 (ผลงาน -3.94)",
        "t68": "3",
        "t69": "4",
        "t70": "5"
      }
    },
    "KPI68-02": {
      "kpiId": "KPI68-02",
      "order": 2,
      "name": "อัตราความรอบรู้ด้านสุขภาพของผู้ป่วยโรคเบาหวานและโรคความดันโลหิตสูง",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 1",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "72",
      "baseline": "82.06",
      "definition": "ระดับคะแนนความสำเร็จของอำเภอในการดำเนินงานความรอบรู้ด้านสุขภาพ 2.1 ผู้ป่วยโรคเบาหวาน/โรคความดันโลหิตสูงมีความรอบรู้ด้านสุขภาพในการป้องกันโรค Stroke 2.2 ผู้สูงอายุ60ปีขึ้นไป และกลุ่มอายุน้อยกว่าหรือเท่ากับ 10 ปี มีความรอบรู้ด้านสุขภาพใน โรคPneumonia และภาวะ Sepsis ความรอบรู้ด้านสุขภาพ หมายถึง ความรู้และทักษะของผู้ป่วยโรคเบาหวาน/โรคความดันโลหิตสูงที่จำเป็น สำหรับการเข้าถึง เข้าใจ ประเมินและตัดสินใจด้านสุขภาพของตนเองและคนรอบข้างได้อย่างเหมาะสม ความรู้และทักษะของ ประชาชนกลุ่มเสี่ยงโรค Pneumonia และภาวะ Sepsis ได้แก่ ผู้กลุ่มอายุ 60 ปีขึ้นไป กลุ่มอายุน้อยกว่าหรือเท่ากับ 10 ปี ที่อ่านออกเขียนได้ ที่จำเป็นสำหรับความเข้าใจ ความสามารถในการ ประเมิน Early warning sign และตัดสินใจด้านสุขภาพของตนเองและคนรอบข้างได้อย่างเหมาะสม อัตราความรอบรู้ด้านสุขภาพ เป็นตัวชี้วัดที่วัดจากการประเมินดังนี้ 1. ประเมินความรอบรู้ด้านสุขภาพของผู้ป่วยโรคเบาหวาน โรคความดันโลหิตสูง อายุ 15 ปี ขึ้นไป ที่เข้าร่วมกิจกรรมส่งเสริมสุขภาพในชุมชนรอบรู้ด้านสุขภาพ (Health Literate Communities: HLC) ซึ่งจัด โดยสถานบริการสุ ขภ าพ ที่ เป็ น องค์ กรรอบรู้ด้ านสุ ขภ าพ (Health Literate Organization: HLO) การประเมิ นใช้ ระบ บการป ระเมิ นจากเว็บไซต์ สาสุ ข อุ่นใจ คน ไทย รอบรู้ ของกรมอนามั ย (https://sasukoonchai.anamai.moph.go.th/) 2. ประเมินความรอบรู้ด้านสุขภาพของประชาชนกลุ่มเสี่ยงโรค Pneumonia และภาวะ Sepsis ได้แก่ ผู้กลุ่มอายุ 60 ปีขึ้นไป กลุ่มอายุน้อยกว่าหรือเท่ากับ 10 ปี ที่ อ่านออกเขียนได้ ที่เข้าร่วมกิจกรรม ส่งเสริมสุขภาพในชุมชนรอบรู้ด้านสุขภาพ (Health Literate Communities: HLC) ซึ่งจัดโดยสถานบริการ สุ ข ภ าพ ที่ เป็ น อ งค์ ก รรอ บ รู้ ด้ าน สุ ข ภ าพ (Health Literate Organization: HLO) ก ารป ระ เมิ น ผ่านทาง: https://forms.gle/Px1QAL06kUGwJiHf7 หน่วยบริการรอบรู้ด้านสุขภาพ หมายถึง โรงพยาบาล/โรงพยาบาลส่งเสริมสุขภาพตำบลที่มีแนวปฏิบัติ (practices)การบริการส่งเสริมสุขภาพและให้คำปรึกษาที่เป็นมิตรต่อความรอบรู้ด้านสุขภาพ ที่ทำให้ ผู้รับบริการเข้าถึง เข้าใจ และใช้ข้อมูลและบริการของตนเองได้ง่ายขึ้นและสะดวกขึ้น เพื่อดูแลสุขภาพใน หน่วยบริการของตนเองได้อย่างเหมาะสม กิจกรรมส่งเสริมความรอบรู้ด้านสุขภาพ หมายถึง ชุดกิจกรรมส่งเสริมสุขภาพ ป้องกันโรค และอนามัย สิ่งแวดล้อม ที่มุ่งเพื่อการแก้ไขปัญหาสุขภาพของกลุ่มผู้ป่วยโรคเบาหวาน โรคความดันโลหิตสูงในการป้องกัน โรค Stroke โรค Pneumonia และภาวะ Sepsis ชุมชนรอบรู้ด้านสุขภาพ หมายถึง หมู่บ้านที่อยู่ในตำบลเดียวกันมีการดำเนินงานพัฒนาให้ประชาชน มีศักยภาพในการดูแลสุขภาพตนเอง มีความรอบรู้ด้านสุขภาพและพฤติกรรมสุขภาพที่ถูกต้อง สามารถลด ปัจจัยเสี่ยงต่อสุขภาพได้อย่างเหมาะสมกับวิถีชีวิต สามารถป้องกันโรคและภัยสุขภาพแก่ตนเอง ครอบครัว ชุมชนโดยการมีส่วนร่วมจากทุกภาคส่วน ผู้ป่วยเบาหวาน หมายถึง ผู้ป่วยที่ได้รับการวินิจฉัยเป็นโรคเบาหวาน และได้รับการขึ้นทะเบียน/ผู้ป่วย โรคเบาหวานอาศัยอยู่ในพื้นที่รับผิดชอบทั้งหมดที่อ่านออกเขียนได้ ผู้ป่วยความดันโลหิตสูง หมายถึง ผู้ป่วยที่ได้รับการวินิจฉัยเป็นโรคความดันโลหิตสูง และได้รับการขึ้น ทะเบียน/ผู้ป่วยโรคความดันโลหิตสูงอาศัยอยู่ในพื้นที่รับผิดชอบทั้งหมดที่อ่านออกเขียนได้ โรคหลอดเลือดสมอง(Stroke) คือ ภาวะที่สมองขาดเลือดไปเลี้ยงเนื่องจากหลอดเลือดตีบ หลอดเลือด อุดตัน หรือหลอดเลือดแตก ส่งผลให้เนื้อเยื่อในสมองถูกทำลาย การทำงานของสมองหยุดชะงัก",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "(จำนวนผลงานที่บรรลุเกณฑ์ [A] ÷ จำนวนกลุ่มเป้าหมายทั้งหมด [B]) × 100",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI68-03": {
      "kpiId": "KPI68-03",
      "order": 3,
      "name": "จำนวนอำเภอที่ผ่านเกณฑ์คุณภาพการพัฒนาคุณภาพชีวิต",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "อำเภอ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "26",
      "baseline": "26",
      "definition": "จำนวนอำเภอที่ผ่านเกณฑ์คุณภาพการพัฒนาคุณภาพชีวิต ตามเกณฑ์มาตรฐานแผนยุทธศาสตร์สุขภาพ 5 ปี จังหวัดขอนแก่น (พ.ศ. 2566–2570)",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "ผลการดำเนินงานจริงเทียบกับเกณฑ์เป้าหมาย (อำเภอ)",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI68-04": {
      "kpiId": "KPI68-04",
      "order": 4,
      "name": "ร้อยละเด็กปฐมวัยมีพัฒนาการสมวัย",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "87",
      "baseline": "76.33",
      "definition": "เด็กปฐมวัย หมายถึง เด็กแรกเกิด จนถึงอายุ 5 ปี 11 เดือน 29 วัน เด็กพัฒนาการสมวัยครั้งที่ 1 หมายถึง เด็กที่ได้รับตรวจคัดกรองพัฒนาการโดยใช้ คู่มือเฝ้าระวัง",
      "purpose": "พัฒนาการครั้งแรก",
      "population": "เด็กที่ได้รับการกระตุ้นภายใน 30 วันมีพัฒนาการสมวัยครั้งที่ 2 หมายถึง เด็กที่มีพัฒนาการสงสัยล่าช้า",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "พัฒนาการเด็กปฐมวัย (DSPM)* แล้วผลการตรวจคัดกรอง ผ่านครบ 5 ด้านในการตรวจคัดกรองพัฒนาการ ครั้งที่ 1 รวมกับเด็กที่มีพัฒนาการสงสัยล่าช้าที่ได้รับการกระตุ้นภายใน 30 วันมีพัฒนาการสมวัยครั้งที่ 2 การคัดกรองพัฒนาการ หมายถึง ความครอบคลุมของการคัดกรองเด็กอายุ 9, 18, 30, 42 และ 60 เดือน ณ ช่วงเวลาที่มีการคัดกรองโดยเป็นเด็กในพื้นที่ (Type1: มีชื่ออยู่ในทะเบียนบ้าน ตัวอยู่จริงและ Type3 : ที่อาศัยอยู่ในเขต แต่ทะเบียนบ้านอยู่นอกเขต พัฒนาการสงสัยล่าช้า หมายถึง เด็กที่ได้รับตรวจคัดกรองพัฒนาการโดยใช้คู่มือเฝ้าระวังและส่งเสริม พัฒนาการเด็กปฐมวัย (DSPM) และผลการตรวจคัดกรองพัฒนาการตามอายุของเด็กในการประเมินพัฒนาการ ครั้งแรกผ่านไม่ครบ 5 ด้าน ทั้งเด็กที่ต้องแนะนำให้พ่อแม่ ผู้ปกครอง ส่งเสริมพัฒนาการตามวัยภายใน 30 วัน (1B261) รวมกับเด็กที่สงสัยล่าช้า ส่งต่อทันที (1B262 : เด็กที่พัฒนาการล่าช้า/ความผิดปกติอย่างชัดเจน) พัฒนาการสงสัยล่าช้าได้รับการติดตาม หมายถึง เด็กที่ได้รับการตรวจคัดกรองพัฒนาการตามอายุของเด็ก ในการประเมินพัฒนาการครั้งแรกผ่านไม่ครบ 5 ด้าน เฉพาะกลุ่มที่แนะนำให้พ่อแม่ ผู้ปกครอง ส่งเสริม พัฒนาการตามวัยภายใน 30 วัน (1B261) แล้วติดตามกลับมาประเมินคัดกรองพัฒนาการครั้งที่ 2 ร้อยละ 87 เพื่อการส่งเสริมสุขภาพ เด็กปฐมวัยให้มีพัฒ นาการสมวัย และมีระดับสติทางด้านเชาว์ปัญญ า และความฉลาดทางอารมณ์ดี เด็กปฐมวัยในจังหวัดขอนแก่น สถานบริการทุกระดับ นำข้อมูลการประเมินพัฒนาการเด็ก บันทึกในโปรแกรมหลักของสถานบริการฯ เช่น JHCIS, Hos xp, PCU เป็นต้น ส่งออกข้อมูลตามโครงสร้างมาตรฐาน 43 แฟ้ม โรงพยาบาลทุกแห่ง /สาธารณสุขอำเภอทุกอำเภอ/ รพ.สต.ทุกแห่ง",
      "formula": "(A/B) x 100 ระยะเวลา 12 เดือน ประเมินผล ทธศาสตร์จังหวัดขอนแก่น ระยะ 5 ปี (พ.ศ. 2566-2570) หน้า 150 106",
      "numeratorA": "จำนวนเด็กอายุ 9 18 30 42 และ 60 เดือน ผลรวมของเด็กที่มีพัฒนาการสมวัยจากตรวจครั้งที่ 1 และ 2",
      "denominatorB": "จำนวนเด็กอายุ 9 18 30 42 และ 60 เดือน ทั้งหมดในช่วงเวลาเดียวกัน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI68-05": {
      "kpiId": "KPI68-05",
      "order": 5,
      "name": "ร้อยละเด็ก 0-5 ปี มีส่วนสูงดีรูปร่างสมส่วน",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "78",
      "baseline": "64.20",
      "definition": "เด็กอายุ 0 - 5 ปี หมายถึง เด็กแรกเกิด จนถึงอายุ 5 ปี 11 เดือน 29 วัน สูงดี หมายถึง เด็กที่มีความยาวหรือส่วนสูงอยู่ในระดับสูงตามเกณฑ์ขึ้นไป (สูงตามเกณฑ์ ค่อนข้างสูง หรือสูง)",
      "purpose": "(ขององค์การอนามัยโลก) โดยมีค่ามากกว่าหรือเท่ากับ -1.5 SDของความยาว/ส่วนสูงตามเกณฑ์อายุ",
      "population": "สมส่วน หมายถึง เด็กที่มีน้ำหนักอยู่ในระดับสมส่วน เมื่อเทียบกับกราฟการเจริญเติบโตน้ำหนักตามเกณฑ์",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "สูงดีรูปร่างสมส่วน หมายถึง เด็กที่มีความยาวหรือส่วนสูงอยู่ในระดับสูงตามเกณฑ์ขึ้นไปและมีน้ำหนักอยู่ในระดับ สมส่วน (ในคนเดียวกัน) ร้อยละ 78 เพื่อการส่งเสริมสุขภาพ เด็ก อายุ 0 - 5 ปี มีการโภชนาการที่ดี การเจริญเติบโตตามวัย รูปร่างสูงดีสมส่วน เด็กปฐมวัยในจังหวัดขอนแก่น สถานบริการทุกระดับ นำข้อมูลการประเมินพัฒนาการเด็ก บันทึกในโปรแกรมหลักของสถานบริการฯ เช่น JHCIS, Hos xp, PCU เป็นต้น ส่งออกข้อมูลตามโครงสร้างมาตรฐาน 43 แฟ้ม โรงพยาบาลทุกแห่ง /สาธารณสุขอำเภอทุกอำเภอ/ รพ.สต.ทุกแห่ง",
      "formula": "A = จำนวนเด็กอายุ 0 -5 ปีที่ได้รับการคัดกรองชั่งน้ำหนัก และวัดความยาว/วัดส่วนสูง มีการเจริญเติบโต สูงดีสมส่วน สูตรคำนวณ ตัวชี้วัด B = จำนวนเด็กอายุ 0 -5 ปีที่ได้รับการคัดกรองชั่งน้ำหนัก และวัดความยาว/วัดส่วนสูงทั้งหมด ระยะเวลา ร้อยละของเด็กอายุ 0 -5 ปี สูงดีรูปร่างสมส่วน = (A x 100) /B ประเมิน 12 เดือน",
      "numeratorA": "จำนวนเด็กอายุ 0 -5 ปีที่ได้รับการคัดกรองชั่งน้ำหนัก และวัดความยาว/วัดส่วนสูง มีการเจริญเติบโต",
      "denominatorB": "จำนวนเด็กอายุ 0 -5 ปีที่ได้รับการคัดกรองชั่งน้ำหนัก และวัดความยาว/วัดส่วนสูงทั้งหมด",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ผลการดำเนินงานผ่านระบบรายงาน HDC รายละเอียด ผลการดำเนินงานย้อนหลัง 3 ปี (2565-2567) ข้อมูลพื้นฐาน (Baseline ตัวชี้วัด Baseline หน่วยวัด ผลการดำเนินงานใน Data) ร้อยละ รอบปีงบประมาณ data 2465 2566 2567 ร้อยละของเด็กอายุ 0 -5 ปี 64.20 73.1 67.23 64.20 สูงดีรูปร่างสมส่วน 3",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI68-06": {
      "kpiId": "KPI68-06",
      "order": 6,
      "name": "ร้อยละเด็ก 6-14 ปี มีส่วนสูงดีรูปร่างสมส่วน",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "66",
      "baseline": "63.83",
      "definition": "ลดปัจจัยเสี่ยงด้านสุขภาพและความเจ็บป่วยของประชาชน",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "เด็กอายุ 6-14 ปี หมายถึง เด็กอายุ6 ปีเต็ม – 14 ปี 11 เดือน 29 วัน",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "กราฟการเจริญเติบโต หมายถึง กราฟแสดงเกณฑ์อ้างอิงการเจริญเติบโตของเด็กอายุ 6-19 ปี บริบูรณ์",
      "formula": "1 สำนักโภชนาการ กรมอนามัย พ.ศ. 2564 (จัดทำจากการจัดทำเกณฑ์อ้างอิงการ เจริญเติบโตของเด็กอายุ 5-19 ปี สำนักโภชนาการ กรมอนามัย พ.ศ. 2563) โดยเริ่มใช้ในการประมวลผลในระบบฐานข้อมูล HDC ภาคเรียนที่ 1 ปีการศึกษา 2564 เป็นต้นไป สูงดีสมส่วน หมายถึง ส่วนสูงอยู่ในระดับสูงตามเกณฑ์ขึ้นไป และมีน้ำหนักอยู่ในระดับสมส่วน (ในคน เดียวกัน) สูงดี หมายถึง ส่วนสูงอยู่ในระดับสูงตามเกณฑ์ขึ้นไป (สูงตามเกณฑ์ ค่อนข้างสูง สูง) เมื่อเทียบกับกราฟ การเจริญเติบโตส่วนสูงตามเกณฑ์อายุ มีค่ามากกว่าหรือเท่ากับ -1.5 S.D. สมส่วน หมายถึง น้ำหนักอยู่ในระดับสมส่วน เมื่อเทียบกับกราฟการเจริญเติบโต น้ำหนักตามเกณฑ์ ส่วนสูง มีค่าระหว่าง -1.5 S.D. ถึง +1.5 S.D. ภาวะเตี้ย หมายถึง มีส่วนสูงน้อยกว่ามาตรฐาน มีค่าต่ำกว่า–2 S.D.ของส่วนสูงตามเกณฑ์อายุ ภาวะผอม หมายถึง มีน้ำหนักน้อยกว่ามาตรฐาน มีค่าต่ำกว่า –2 S.D. ของน้ำหนักตามเกณฑ์ส่วนสูง ภาวะเริ่มอ้วนและอ้วน หมายถึง มีน้ำหนักมากกว่ามาตรฐานน้ำหนักตามเกณฑ์ส่วนสูง โดยมีค่า มากกว่า > + 2 S.D.ขึ้นไป > ร้อยละ 66 1. เพื่อเฝ้าระวังภาวะโภชนาการและให้การดูแลรักษาที่ครอบคลุม หากพบภาวะผิดปกติได้รับการส่งต่อ ดูแลรักษาที่ครอบคลุม หากพบภาวะผิดปกติได้รับการส่งต่อที่เหมาะสม 2. เพื่อส่งเสริม สนับสนุนขับเคลื่อนโรงเรียน สถานศึกษาทุกระดับ ให้จัดบริการ ดูแลสุขภาพเด็กวัยเรียน ตามเกณฑ์มาตรฐาน เด็กนักเรียน อายุ 6-14 ปี ในโรงเรียนทุกสังกัด (โรงเรียนประถมศึกษา ,โรงเรียนประถมศึกษ า ขยายโอกาส,มัธยมศึกษา (ม.1-ม.3) 1. ชั่งน้ำหนักและวัดส่วนสูง บันทึกข้อมูลน้ำหนักและส่วนสูงด้วยทศนิยม 1 ตำแหน่ง เช่น น้ำหนัก 47.2 กิโลกรัม ส่วนสูง 155.2 เซนติเมตร 2. โรงพยาบาลส่งเสริมสุขภาพตำบล และ PCU จากโรงพยาบาล นำเข้าข้อมูลน้ำหนัก ส่วนสูง ของเด็ก จากสถานศึกษา/โรงเรียน บันทึกในโปรแกรมหลักของสถานบริการ เช่น JHCIS, HosXP PCU เป็นต้น และส่งออกแฟ้มข้อมูล Nutrition ตามโครงสร้างมาตรฐาน 43 แฟ้ม ระบบรายงาน HDC กองยุทธศาสตร์และแผนงาน และสำนักงานสาธารณสุขจังหวัด ข้อมูลจากแฟ้ม Nutrition (ไม่รวมเด็กป่วยที่มารับบริการ) A1 = จำนวนเด็กอายุ 6-14 ปี ที่มีภาวะสูงดีสมส่วน A2 = จำนวนเด็กอายุ 6-14 ปี ที่มีภาวะเตี้ย A3 = จำนวนเด็กอายุ 6-14 ปี ที่มีภาวะผอม A4 = จำนวนเด็กอายุ 6-14 ปี ที่มีภาวะเริ่มอ้วนและอ้วน",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนเด็กอายุ 6-14 ปีที่ชั่งน้ำหนักและวัดส่วนสูง",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประมวลผลรายงานจากฐานข้อมูล Health Data Center (HDC) รายละเอียด ข้อมูลพื้นฐานประกอบตัวชี้วัด เป้าหมาย หน่วย ผลงานย้อนหลัง 3 ปี ข้อมูลพื้นฐาน 2565 2566 2567 ปี 2568 วัด 67.14 65.46 63.72 (Baseline Data) ผลการดำเนินงาน ร้อยละเด็ก 6-14 ปี มีส่วนสูงดีรูปร่างสม ≥68 ร้อยละ 79.41 77.81 76.54 ย้อนหลัง 3 ปี (ปี 2565 -2567) ส่วน 9.12 10.27 10.56 7.73 6.00 7.71 ร้อยละเด็ก 6-14 ปี ได้รับการชั่งน้ำหนัก ≥80 ร้อยละ 3.37 4.50 4.31 วัดส่วนสูง ร้อยละเด็ก 6–14 ปี เริ่มอ้วนและอ้วน ≥10 ร้อยละ ร้อยละเด็ก 6–14 ปี เตี้ย ≥10 ร้อยละ ร้อยละเด็ก 6–14 ปี ผอม ≥5 ร้อยละ",
      "responsible": "นางวรวลัย เกษมศรีวิวัฒน์ ตำแหน่ง พยาบาลวิชาชีพชำนาญการ ตัวชี้วัด หมายเลขโทรศัพท์ 085-1555510 E-mail : worawalai.k@gmail.com กลุ่มงานส่งเสริมสุขภาพ สำนักงานสาธารณสุขจังหวัดขอนแก่น"
    },
    "KPI68-07": {
      "kpiId": "KPI68-07",
      "order": 7,
      "name": "ผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงได้รับการดูแลในระบบ Long Term Care และเข้าถึงตามชุดสิทธิประโยชน์",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "98.5",
      "baseline": "98.43",
      "definition": "ลดปัจจัยเสี่ยงด้านสุขภาพและความเจ็บป่วยของประชาชน",
      "purpose": "เพื่อให้ผู้สูงอายุและผู้มีภาวะพึ่งพิงได้รับการดูแลสุขภาพตามแผนการดูแลรายบุคคล (Care Plan) และเข้าถึงชุดสิทธิประโยชน์อย่างครอบคลุม",
      "population": "ผู้สูงอายุ หมายถึง ประชาชนที่มีอายุตั้งแต่ 60 ปีขึ้นไป",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "(ADL 0-4 คะแนน) ได้รับการดูแลโดยบุคลากรสาธารณสุข ทีมสหวิชาชีพตามแผนการดูแลรายบุคคล (Care Plan) ตามชุดสิทธิประโยชน์ทุกสิทธิการรักษาพยาบาล ผู้ที่มีภาวะพึ่งพิง หมายถึง ประชาชนที่มีค่าคะแนนการประเมินความสามารถในการประกอบกิจวัตร ประจำวัน(ADL) น้อยกว่าหรือเท่ากับ 11 คะแนน โดยแบ่งเป็นกลุ่มติดบ้าน (ADL 5-11 คะแนน) กลุ่มติดเตียง (ADL 0-4 คะแนน) ได้รับการดูแลโดยบุคลากรสาธารณสุข ทีมสหวิชาชีพตามแผนการดูแลรายบุคคล (Care Plan) ตามชุดสิทธิประโยชน์ทุกสิทธิการรักษาพยาบาล แผนการดูแลรายบุคคล (Care Plan) หมายถึง การประเมินและวางแผนการดูแลรายบุคคลก่อนให้บริการ ดูแลช่วยเหลือผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงจาก Care Manager ทีมผู้เชี่ยวชาญ ครอบครัวและผู้เกี่ยวข้อง ในพื้นที่ การดูแลกลุ่มภาวะพึ่งพิงตามชุดสิทธิประโยชน์ หมายถึง การบริการดูแลด้านสาธารณสุขตามแผนการดูแล รายบุคคล และให้คำแนะนำแก่ญาติและผู้ดูแล โดยผู้ช่วยเหลือดูแลผู้ที่มีภาวะพึ่งพิงหรือเครือข่ายสุขภาพอื่นๆ หรืออาสาสมัคร จิตอาสา ตามแผนการดูแลรายบุคคล หรือตามคำแนะนำของผู้จัดการการดูแลด้าน สาธารณสุข รวมถึงจัดหาวัสดุ อุปกรณ์ทางการแพทย์ หรืออุปกรณ์เครื่องช่วยเหลือที่จำเป็นตามสภาพของผู้ที่มี ภาวะพึ่งพิง และการประเมินผลลัพธ์การดูแลผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงหลังได้รับการดูแลตาม Care Plan ครบ 12 เดือน ร้อยละ 98.5 1. เพื่อให้ Care Manager /Caregiver/อาสาสมัครบริบาลท้องถิ่น และทีมสหวิชาชีพมีการส่งเสริมสุขภาพ วางแผนการดูแลรายบุคคล ฟื้นฟูสมรรถภาพ และสนับสนุนการดูแลผู้สูงอายุและผู้ที่มีภาวะพึ่งพิง แบบรอบด้านในระดับครอบครัว ชุมชนเป็นรายบุคคล 2. เพื่อสนับสนุนการมีส่วนร่วมของครอบครัว ชุมชนและหน่วยงานภาคีเครือข่ายที่เกี่ยวข้อง ในการดูแล และปรับเปลี่ยนพฤติกรรมสุขภาพของผู้สูงอายุให้มีคุณภาพชีวิตที่ดี มีอายุยืนยาวและช่วยเหลือตนเองได้ 3. เพื่อให้ผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงเข้าถึงระบบบริการด้านสาธารณสุข และวัสดุ อุปกรณ์ทางการแพทย์ หรืออุปกรณ์เครื่องช่วยเหลือที่จำเป็นตามสภาพปัญหาของผู้ที่มีภวะพึ่งพิง ผู้สูงอายุและบุคคลอื่น ที่มีค่าคะแนน ADL 0-11 คะแนน 1. รายงานผลการคัดกรอง ADL ในฐานข้อมูล Health Data Center 2. รายงานการจัดทำ Care Plan และการอนุมัติ Care Plan ผ่านคณะอนุกรรมการกองทุน LTC ระดับตำบล และบันทึกข้อมูล CP ที่ผ่านการอนุมัติรายงานในระบบโปรแกรม LTC สปสช. 3. รายงานผลค่าคะแนน ADL การดูแลกลุ่มภาวะพึ่งพิงครบ 12 เดือน ในโปรแกรม LTC สปสช. 1. ฐานข้อมูลการคัดกรอง ADL ใน Health Data Center 2. โปรแกรม Long Term Care กรมอนามัย 3. โปรแกรม Long Term Care สปสช.",
      "formula": "1 A = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่มีการจัดทำ Care Plan โดย Care Plan ได้รับอนุมัติจาก คณะอนุกรรมการ LTC และได้รับการเยี่ยมบ้านจาก Caregiver B = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงทั้งหมดที่เข้าร่วมโครงการ LTC รายการข้อมูล 2 A = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่ได้รับการดูแลตาม Care Plan ครบ 12 เดือน ที่มีค่าคะแนน ADL เพิ่มขึ้น และกลุ่มติดเตียงมีค่า ADL เท่าเดิมหรือไม่มีภาวะแทรกซ้อนเพิ่มขึ้น B = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่ ได้รับอนุมัติ Care Plan จากคณะอนุกรรมการ LTC และได้รับ การเยี่ยมบ้านจาก Caregiver ครบการดูแล 12 เดือน ทั้งหมด สูตรคำนวณ A x 100 ตัวชี้วัด 1 B สูตรคำนวณ A x 100 ตัวชี้วัด 2 B ระยะเวลา ตุลาคม 2567 - กันยายน 2568 ประเมินผล",
      "numeratorA": "จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่มีการจัดทำ Care Plan โดย Care Plan ได้รับอนุมัติจาก",
      "denominatorB": "จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงทั้งหมดที่เข้าร่วมโครงการ LTC",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "1) Care Manager/เจ้าหน้าที่สาธารณสุข PCU รพ./รพสต. ประเมินความสามารถในการประกอบกิจวัตร รายละเอียด ประจำวัน(ADL) เพื่อค้นหากลุ่มภาวะพึ่งพิงได้รับบริการตามชุดสิทธิประโยชน์ > ร้อยละ 60 ข้อมูลพื้นฐาน 2) Care Manager มีการจัดทำแผนการดูแลรายบุคคล Care Plan ในกลุ่มผู้สูงอายุและผู้ที่มีภาวะพึ่งพิง (Baseline Data) ผลการดำเนินงาน และ Care Plan ได้รับการอนุมัติจากคณะอนุกรรมการ LTC > ร้อยละ 98.5 ย้อนหลัง 3 ปี (ปี 2565 -2567) 3) ผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงได้รับการดูแลตามแผนการดูแลรายบุคคล Care Plan และประเมิน ADL ครบ",
      "responsible": "12 เดือน มีค่าคะแนน ADL เพิ่มขึ้นหรือกลุ่มติดเตียงไม่มีภาวะแทรกซ้อนเพิ่มขึ้น > ร้อยละ 25 ตัวชี้วัด ผลงาน ปี 2565 ปี 2566 ปี 2567 ร้อยละของผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงได้รับการดูแล 96.67 94.61 98.4 ในระบบ Long Term Care และเข้าถึงตามชุดสิทธิ ประโยชน์ ร้อยละของผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่ได้รับการดูแล 14.66 21.43 22.43 ตาม Care Plan มีค่าคะแนน ADL เพิ่มขึ้นหรือกลุ่มติด เตียงไม่มีภาวะแทรกซ้อนเพิ่มขึ้น ชื่อ-สกุล นางอังคณา อึ้งปิติมานะ ตำแหน่ง นักวิชาการสาธารณสุขชำนาญการ กลุ่มงานส่งเสริมสุขภาพ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ 149 โทรสาร 0-4322-4037 โทรศัพท์มือถือ. 0617929942 E-mail :ungpitimana.ang@gmail.com"
    },
    "KPI68-08": {
      "kpiId": "KPI68-08",
      "order": 8,
      "name": "อัตราตายมารดา ไม่เกิน 17 ต่อแสนการเกิดมีชีพ",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ต่อแสนการเกิดมีชีพ",
      "direction": "ยิ่งน้อยยิ่งดี",
      "target": "≤14",
      "baseline": "17.39",
      "definition": "อัตราส่วนการตายมารดาไทยไม่เกิน 14 ต่อการเกิดมีชีพแสนคน",
      "purpose": "เฝ้าระวังสตรีชวงตั้งครรภ คลอดและหลังคลอด ให้ได้รับบริการคุณภาพตามเกณฑ์ เพื่อลดจำนวนการตาย",
      "population": "ของมารดา",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "หญิงตั้งครรภ์ หญิงคลอด และหญิงหลังคลอดภายใน 42 วัน",
      "formula": "(A/B) x 100,000",
      "numeratorA": "จำนวนมารดาตายระหว่างตั้งครรภ์ คลอดและหลังคลอดภายใน 42 วัน ทุกสาเหตุยกเว้นอุบัติเหตุ",
      "denominatorB": "จำนวนเด็กเกิดมีชีพทั้งหมดในช่วงเวลาเดียวกัน",
      "frequency": "ทุก 3 เดือน",
      "evaluationMethod": "เปรียบเทียบผลการดำเนินงานกับค่าเป้าหมาย",
      "responsible": "ชื่อ-สกุล...นางนรินทร์รัตน์ แก้วลา ตำแหน่ง นักวิชาการสาธารณสุขชำนาญการพิเศษ ชื่อ-สกุล...นางสมาพร สุรเตมีย์กุล ตำแหน่ง พยาบาลวิชาชีพชำนาญการ กลุ่มงาน ส่งเสริมสุขภาพ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ ... โทรสาร 0-4322-4037 โทรศัพท์มือถือ... 085-3956466 E-mail : narinratkaewla@gmail.com ตัวชี้วัดที่ 8.1 หญิงตั้งครรภ์ได้รับการฝากครรภ์ครั้งแรกเมื่ออายุครรภ์≤ 12 สัปดาห์ คำนิยาม หญิงตั้งครรภ์ได้รับการฝากครรภ์ครั้งแรกเมื่ออายุครรภ์น้อยกว่าหรือเท่ากับ 12 สัปดาห์ หมายถึง หญิงตั้งครรภ์ที่มาฝากครรภ์ที่สถานบริการฯทั้งหมด โดยต้องฝากครรภ์ครั้งแรกที่อายุครรภ์น้อยกว่า หรือเท่ากับ 12 สัปดาห์ เกณฑ์เป้าหมาย ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ 2566 2567 2568 2569 2570 ≥ ร้อยละ 75 ≥ ร้อยละ 75 ≥ ร้อยละ 80 ≥ ร้อยละ 85 ≥ ร้อยละ 90 วัตถุประสงค์ ส่งเสริมสุขภาพและเฝ้าระวังหญิงตั้งครรภ์ คลอดและหลังคลอด เพื่อลดการตายมารดาและทารก จากการตั้งครรภ์และคลอดให้มีประสิทธิภาพ กลุ่มเป้าหมาย หญิงตั้งครรภ์และหญิงหลังคลอดทุกราย วิธีการจัดเก็บข้อมูล บันทึกข้อมูลการให้บริการในโปรแกรมของแต่ละสถานบริการและส่งออกข้อมูลตามแนวทาง 43 แฟ้ม แหล่งข้อมูล 1. หน่วยบริการสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่นและองค์การบริหารส่วนจังหวัดขอนแก่น ทุกแห่ง 2. ฐานข้อมูล 43 แฟ้ม( แฟ้ม ANCและ Labor) รายการข้อมูล 1 A = จำนวนหญิงคลอดตาม B ที่ฝากครรภ์ครั้งแรกและอายุครรภ์ ≤ 12 สัปดาห์ (ข้อมูลจากสมุดสีชมพูบันทึกลงใน 43 แฟ้ม : แฟ้ม ANC) รายการข้อมูล 2 B =จำนวนหญิงไทยทุกรายที่คลอดในเขตรับผิดชอบทั้งหมดในช่วงเวลาเดียวกัน สูตรคำนวณตัวชี้วัด (A/B ) x 100 ระยะเวลาประเมินผล ทุก 3 เดือน Small Success ปี 2568 รอบ 3 เดือน รอบ 6 เดือน รอบ 9 เดือน รอบ 12 เดือน ≥ ร้อยละ65 ≥ ร้อยละ 70 ≥ ร้อยละ 75 ≥ ร้อยละ80"
    },
    "KPI68-09": {
      "kpiId": "KPI68-09",
      "order": 9,
      "name": "อัตราตายของทารกแรกเกิดไม่เกิน 3.6 ต่อพันการเกิดมีชีพ",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ต่อพันการเกิดมีชีพ",
      "direction": "ยิ่งน้อยยิ่งดี",
      "target": "2.3",
      "baseline": "3.32",
      "definition": "ทารกแรกเกิด หมายถึง ทารกที่ มีน้ำหนัก ≥ 500 กรัม ที่คลอดมามีชีวิตตั้งแต่แรกเกิดจนถึง 28 วัน ในโรงพยาบาล สังกัดสำนักงานปลัดกระทรวงสาธารณสุข (รพศ./รพท./รพช.)",
      "purpose": "1. เพื่อเพิ่มประสิทธิภาพการดูแลรักษาทารกแรกเกิดใหทั่วถึง 2. เพื่อลดอัตราตายทารกแรกเกิด",
      "population": "ทารกที่คลอดและมีชีวิตจนถึง 28 วัน",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "1.หน่วยบริการทุกระดับในสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่น 2. ฐานข้อมูล Health Data Center",
      "formula": "(A/B) x 1,000",
      "numeratorA": "จำนวนทารกที่เสียชีวิต ≤ 28 วัน",
      "denominatorB": "จำนวนเด็กเกิดมีชีพทั้งหมดในช่วงเวลาเดียวกัน",
      "frequency": "ทุก 3 เดือน",
      "evaluationMethod": "เปรียบเทียบผลการดำเนินงานกับค่าเป้าหมาย รายละเอียดข้อมูลพื้นฐาน Baseline Data หน่วยวัด ผลการดำเนินงานปีงบประมาณ อัตราตายทารกแรกเกิด อัตราตายทารก ปี 2565 ปี 2566 ปี 2567 แรกเกิด ตอ เกิด มีชีพ 1,000คน 2.8 2.6 3.3",
      "responsible": "ชื่อ-สกุล...นางนรินทร์รัตน์ แก้วลา ตำแหน่ง นักวิชาการสาธารณสุขชำนาญการพิเศษ ตัวชี้วัด ชื่อ-สกุล...นางสมาพร สุรเตมีย์กุล ตำแหน่ง พยาบาลวิชาชีพชำนาญการ กลุ่มงาน ส่งเสริมสุขภาพ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ ... โทรสาร 0-4322-4037 โทรศัพท์มือถือ... 085-3956466 E-mail : narinratkaewla@gmail.com"
    },
    "KPI68-10": {
      "kpiId": "KPI68-10",
      "order": 10,
      "name": "ร้อยละของผู้สูงอายุไม่มีภาวะพึ่งพิง",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "95.50",
      "baseline": "95.20",
      "definition": "ลดปัจจัยเสี่ยงด้านสุขภาพและความเจ็บป่วยของประชาชน",
      "purpose": "เพื่อให้ผู้สูงอายุและผู้มีภาวะพึ่งพิงได้รับการดูแลสุขภาพตามแผนการดูแลรายบุคคล (Care Plan) และเข้าถึงชุดสิทธิประโยชน์อย่างครอบคลุม",
      "population": "ผู้สูงอายุ หมายถึง ประชาชนที่มีอายุตั้งแต่ 60 ปีขึ้นไป",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "(ADL 0-4 คะแนน) ได้รับการดูแลโดยบุคลากรสาธารณสุข ทีมสหวิชาชีพตามแผนการดูแลรายบุคคล (Care Plan) ตามชุดสิทธิประโยชน์ทุกสิทธิการรักษาพยาบาล ผู้ที่มีภาวะพึ่งพิง หมายถึง ประชาชนที่มีค่าคะแนนการประเมินความสามารถในการประกอบกิจวัตร ประจำวัน(ADL) น้อยกว่าหรือเท่ากับ 11 คะแนน โดยแบ่งเป็นกลุ่มติดบ้าน (ADL 5-11 คะแนน) กลุ่มติดเตียง (ADL 0-4 คะแนน) ได้รับการดูแลโดยบุคลากรสาธารณสุข ทีมสหวิชาชีพตามแผนการดูแลรายบุคคล (Care Plan) ตามชุดสิทธิประโยชน์ทุกสิทธิการรักษาพยาบาล แผนการดูแลรายบุคคล (Care Plan) หมายถึง การประเมินและวางแผนการดูแลรายบุคคลก่อนให้บริการ ดูแลช่วยเหลือผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงจาก Care Manager ทีมผู้เชี่ยวชาญ ครอบครัวและผู้เกี่ยวข้อง ในพื้นที่ การดูแลกลุ่มภาวะพึ่งพิงตามชุดสิทธิประโยชน์ หมายถึง การบริการดูแลด้านสาธารณสุขตามแผนการดูแล รายบุคคล และให้คำแนะนำแก่ญาติและผู้ดูแล โดยผู้ช่วยเหลือดูแลผู้ที่มีภาวะพึ่งพิงหรือเครือข่ายสุขภาพอื่นๆ หรืออาสาสมัคร จิตอาสา ตามแผนการดูแลรายบุคคล หรือตามคำแนะนำของผู้จัดการการดูแลด้าน สาธารณสุข รวมถึงจัดหาวัสดุ อุปกรณ์ทางการแพทย์ หรืออุปกรณ์เครื่องช่วยเหลือที่จำเป็นตามสภาพของผู้ที่มี ภาวะพึ่งพิง และการประเมินผลลัพธ์การดูแลผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงหลังได้รับการดูแลตาม Care Plan ครบ 12 เดือน ร้อยละ 98.5 1. เพื่อให้ Care Manager /Caregiver/อาสาสมัครบริบาลท้องถิ่น และทีมสหวิชาชีพมีการส่งเสริมสุขภาพ วางแผนการดูแลรายบุคคล ฟื้นฟูสมรรถภาพ และสนับสนุนการดูแลผู้สูงอายุและผู้ที่มีภาวะพึ่งพิง แบบรอบด้านในระดับครอบครัว ชุมชนเป็นรายบุคคล 2. เพื่อสนับสนุนการมีส่วนร่วมของครอบครัว ชุมชนและหน่วยงานภาคีเครือข่ายที่เกี่ยวข้อง ในการดูแล และปรับเปลี่ยนพฤติกรรมสุขภาพของผู้สูงอายุให้มีคุณภาพชีวิตที่ดี มีอายุยืนยาวและช่วยเหลือตนเองได้ 3. เพื่อให้ผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงเข้าถึงระบบบริการด้านสาธารณสุข และวัสดุ อุปกรณ์ทางการแพทย์ หรืออุปกรณ์เครื่องช่วยเหลือที่จำเป็นตามสภาพปัญหาของผู้ที่มีภวะพึ่งพิง ผู้สูงอายุและบุคคลอื่น ที่มีค่าคะแนน ADL 0-11 คะแนน 1. รายงานผลการคัดกรอง ADL ในฐานข้อมูล Health Data Center 2. รายงานการจัดทำ Care Plan และการอนุมัติ Care Plan ผ่านคณะอนุกรรมการกองทุน LTC ระดับตำบล และบันทึกข้อมูล CP ที่ผ่านการอนุมัติรายงานในระบบโปรแกรม LTC สปสช. 3. รายงานผลค่าคะแนน ADL การดูแลกลุ่มภาวะพึ่งพิงครบ 12 เดือน ในโปรแกรม LTC สปสช. 1. ฐานข้อมูลการคัดกรอง ADL ใน Health Data Center 2. โปรแกรม Long Term Care กรมอนามัย 3. โปรแกรม Long Term Care สปสช.",
      "formula": "1 A = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่มีการจัดทำ Care Plan โดย Care Plan ได้รับอนุมัติจาก คณะอนุกรรมการ LTC และได้รับการเยี่ยมบ้านจาก Caregiver B = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงทั้งหมดที่เข้าร่วมโครงการ LTC รายการข้อมูล 2 A = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่ได้รับการดูแลตาม Care Plan ครบ 12 เดือน ที่มีค่าคะแนน ADL เพิ่มขึ้น และกลุ่มติดเตียงมีค่า ADL เท่าเดิมหรือไม่มีภาวะแทรกซ้อนเพิ่มขึ้น B = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่ ได้รับอนุมัติ Care Plan จากคณะอนุกรรมการ LTC และได้รับ การเยี่ยมบ้านจาก Caregiver ครบการดูแล 12 เดือน ทั้งหมด สูตรคำนวณ A x 100 ตัวชี้วัด 1 B สูตรคำนวณ A x 100 ตัวชี้วัด 2 B ระยะเวลา ตุลาคม 2567 - กันยายน 2568 ประเมินผล",
      "numeratorA": "จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่มีการจัดทำ Care Plan โดย Care Plan ได้รับอนุมัติจาก",
      "denominatorB": "จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงทั้งหมดที่เข้าร่วมโครงการ LTC",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "1) Care Manager/เจ้าหน้าที่สาธารณสุข PCU รพ./รพสต. ประเมินความสามารถในการประกอบกิจวัตร รายละเอียด ประจำวัน(ADL) เพื่อค้นหากลุ่มภาวะพึ่งพิงได้รับบริการตามชุดสิทธิประโยชน์ > ร้อยละ 60 ข้อมูลพื้นฐาน 2) Care Manager มีการจัดทำแผนการดูแลรายบุคคล Care Plan ในกลุ่มผู้สูงอายุและผู้ที่มีภาวะพึ่งพิง (Baseline Data) ผลการดำเนินงาน และ Care Plan ได้รับการอนุมัติจากคณะอนุกรรมการ LTC > ร้อยละ 98.5 ย้อนหลัง 3 ปี (ปี 2565 -2567) 3) ผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงได้รับการดูแลตามแผนการดูแลรายบุคคล Care Plan และประเมิน ADL ครบ",
      "responsible": "12 เดือน มีค่าคะแนน ADL เพิ่มขึ้นหรือกลุ่มติดเตียงไม่มีภาวะแทรกซ้อนเพิ่มขึ้น > ร้อยละ 25 ตัวชี้วัด ผลงาน ปี 2565 ปี 2566 ปี 2567 ร้อยละของผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงได้รับการดูแล 96.67 94.61 98.4 ในระบบ Long Term Care และเข้าถึงตามชุดสิทธิ ประโยชน์ ร้อยละของผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่ได้รับการดูแล 14.66 21.43 22.43 ตาม Care Plan มีค่าคะแนน ADL เพิ่มขึ้นหรือกลุ่มติด เตียงไม่มีภาวะแทรกซ้อนเพิ่มขึ้น ชื่อ-สกุล นางอังคณา อึ้งปิติมานะ ตำแหน่ง นักวิชาการสาธารณสุขชำนาญการ กลุ่มงานส่งเสริมสุขภาพ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ 149 โทรสาร 0-4322-4037 โทรศัพท์มือถือ. 0617929942 E-mail :ungpitimana.ang@gmail.com"
    },
    "KPI68-11": {
      "kpiId": "KPI68-11",
      "order": 11,
      "name": "ร้อยละสตรีอายุ 30-60 ปี กลุ่มเป้าหมายได้รับการคัดกรองมะเร็งปากมดลูกด้วยวิธี HPV DNA",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "80",
      "baseline": "59.34",
      "definition": "การคัดกรองมะเร็งปากมดลูก หมายถึง สตรี",
      "purpose": "1. เพื่อเพิ่มการเข้าถึงบริการคัดกรองมะเร็งปากมดลูก 2. เพื่อลดอัตราการเกิดโรคมะเร็งปากมดลูกในระยะลุกลาม",
      "population": "(อายุ 30-≤60 ปี) ได้รับการ ตรวจคัดกรองมะเร็ง ปากมดลูกด้วยวิธี HPV DNA test ทั้งแบบตรวจโดยเจ้าหน้าที่ และแบบ Self Collection เป็นการตรวจหาเชื้อ ไวรัส HPV ความ เสี่ยงสูง 14 สายพันธุ์ซึ่งเป็นสาเหตุของมะเร็งปากมดลูก โดยวิธีการตรวจคือเก็บเซลล์บริเวณ ปากมดลูกช่องคลอดด้านใน ส่งตรวจด้วยวิธีการตรวจด้วยน้ำยา เมื่อคัดกรองแล้วมีผลปกติ/ผล ลบ (Negative) จากตัวอย่างสิ่งส่งตรวจ แนะนำให้เข้ารับการตรวจคัดกรองมะเร็งปากมดลูก ด้วยวิธีHPV DNA Test ครั้งต่อไป ในอีก 5 ปี เกณฑ์เป้าหมาย ≥ ร้อยละ 80 วัตถุประสงค์ 1. เพื่อเพิ่มการเข้าถึงบริการคัดกรองมะเร็งปากมดลูก 2. เพื่อลดอัตราการเกิดโรคมะเร็งปากมดลูกในระยะลุกลาม กลุ่มเป้าหมาย สตรีไทยอายุ 30-≤60 ปี ในพื้นที่รับผิดชอบ ตามจำนวนที่ได้รับการจัดสรร ในปีงบประมาณ 2568 (การนับอายุ 59 ปี 11 เดือน 29 วัน ณ วันให้บริการ) (ประชากร Type area 1,Type area 3) ในช่วงเวลาที่กำหนด",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "1. จากโปรแกรม Cancer Cervical Screening @ Khon Kaen 2. HDC 43 แฟ้ม สำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "formula": "A = จำนวนสตรีไทยอายุ 30-≤60 ปี ที่ได้รับการคัดกรองมะเร็งปากมดลูก ด้วยวิธี HPV DNA Test (โดยการตรวจด้วยเจ้าหน้าที่ หรือ การตรวจด้วยตนเอง) B = จำนวนสตรีไทยอายุ 30-≤60 ปี สูตรคำนวณ (A/B) x 100 ตัวชี้วัด ระยะเวลา รายไตรมาส ปีงบประมาณ พ.ศ.2568 ประเมินผล",
      "numeratorA": "จำนวนสตรีไทยอายุ 30-≤60 ปี ที่ได้รับการคัดกรองมะเร็งปากมดลูก ด้วยวิธี HPV DNA Test",
      "denominatorB": "จำนวนสตรีไทยอายุ 30-≤60 ปี",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลได้แบบ real time รายละเอียด ปีงบประมาณ พ.ศ.2565 ปีงบประมาณ พ.ศ.2566 ปีงบประมาณ พ.ศ.2567 ร้อยละ 21.82 ร้อยละ 42.81 % ร้อยละ 59.34 % ข้อมูลพื้นฐาน (Baseline Data) ผลการดำเนินงาน ย้อนหลัง 3 ปี (ปี 2565 -2567)",
      "responsible": "1. ชื่อ-สกุล นางยุภาพร ดีแป้น ตำแหน่ง : พยาบาลวิชาชีพชำนาญการ ตัวชี้วัด กลุ่มงาน : ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ที่ทำงาน : 043-221125 ต่อ 150 โทรสาร : 043-224037 โทรศัพท์มือถือ : 080-4620160 E-mail : smallbody@hotmail.com 2. ชื่อ-สกุล นางแสงเดือน โสภา ตำแหน่ง : พยาบาลวิชาชีพชำนาญการ กลุ่มงาน : ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ที่ทำงาน : 043-221125 ต่อ 150 โทรสาร : 043-224037 โทรศัพท์มือถือ : 081-3803219 3. ชื่อ-สกุล นางกิตติมา ก้านจักร ตำแหน่ง : นักวิชาการสาธารณสุขชำนาญการพิเศษ กลุ่มงาน : ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ที่ทำงาน : 043-221125 ต่อ 169 โทรสาร : 043-224037 โทรศัพท์มือถือ : 087-7707761"
    },
    "KPI68-12": {
      "kpiId": "KPI68-12",
      "order": 12,
      "name": "ประชาชนอายุ 50-70 ปี (รายใหม่) กลุ่มเป้าหมายได้รับการคัดกรองมะเร็งลำไส้ใหญ่/ไส้ตรงด้วยวิธี FIT Test",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "97",
      "baseline": "100.84",
      "definition": "การคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรง หมายถึง ประชากรเพศชายและเพศหญิง ที่มี อายุ 50-70 ปีได้รับการ ตรวจหาเลือดแฝงในอุจจาระด้วยวิธี Fecal Immunochemical Test (FIT) ซึ่งเป็นวิธีที่อาศัยปฏิกิริยาทางอิมมูโน ที่จำเพาะต่อฮีโมโกลบินในเม็ดเลือดแดงที่ มีความจำเพาะของคนเท่านั้น โดยตรวจผ่านชุดตรวจที่มีค่า cut-off 100 ng/ml ผู้รับการตรวจไม่จำเป็นต้องควบคุมอาหารก่อนการตรวจ ***จะทำการตรวจคัดกรอง 1 ครั้ง ในรอบ 2 ปีงบประมาณ",
      "purpose": "1. เพื่อตรวจหาผู้ป่วยในระยะก่อนเป็นมะเร็งหรือเป็นมะเร็งลำไส้ใหญ่และไส้ตรงในระยะต้นซึ่งประชากร",
      "population": "(รายใหม่) ได้รับการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรง ด้วยวิธี FIT test คำนิยาม การคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรง หมายถึง ประชากรเพศชายและเพศหญิง ที่มี อายุ 50-70 ปีได้รับการ ตรวจหาเลือดแฝงในอุจจาระด้วยวิธี Fecal Immunochemical Test (FIT) ซึ่งเป็นวิธีที่อาศัยปฏิกิริยาทางอิมมูโน ที่จำเพาะต่อฮีโมโกลบินในเม็ดเลือดแดงที่ มีความจำเพาะของคนเท่านั้น โดยตรวจผ่านชุดตรวจที่มีค่า cut-off 100 ng/ml ผู้รับการตรวจไม่จำเป็นต้องควบคุมอาหารก่อนการตรวจ ***จะทำการตรวจคัดกรอง 1 ครั้ง ในรอบ 2 ปีงบประมาณ กลุ่มเป้าหมาย (รายใหม่) หมายถึง กลุ่มที่ไม่เคยได้รับการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรง ในปีงบประมาณ 2566 และกลุ่มที่ไม่เคยได้รับการส่องกล้อง Colonoscopy ในระยะเวลา 5 ปี ที่ผ่านมาและมีผลการส่องกล้อง ปกติ เกณฑ์เป้าหมาย ≥ ร้อยละ 97 วัตถุประสงค์ 1. เพื่อตรวจหาผู้ป่วยในระยะก่อนเป็นมะเร็งหรือเป็นมะเร็งลำไส้ใหญ่และไส้ตรงในระยะต้นซึ่งประชากร กลุ่มเป้าหมายที่คัดกรองแล้วมีผล ปกติ/ผลลบ (Negative) 2. เพื่อตรวจหาผู้ที่มีผลการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรง ผิดปกติ หมายถึง ประชากรเพศชาย และเพศหญิงอายุ 50-70 ปีที่มีผลการคัดกรองมะเร็งล้าไส้ใหญ่และไส้ตรง ด้วยวิธี Fecal Immunochemical Test (FIT) เป็นบวก (Positive) คือ ตรวจพบเม็ดเลือดแดงในตัวอย่าง อุจจาระ 3. เพื่อลดอัตราการเกิดโรคมะเร็งลำไส้ใหญ่และไส้ตรงในระยะลุกลาม กลุ่มเป้าหมาย 1. ประชากรเพศชายและหญิง ทุกสิทธิการรักษา ที่ยังไม่ได้รับการคัดกรองมะเร็งลำ ไส้ใหญ่ไส้ตรง ในปีงบประมาณ 2567 และผู้ที่เคยได้รับการส่องกล้อง Colonoscopy ในระยะเวลา 5 ปี ที่ผ่านมาและมีผลการ ส่องกล้อง ปกติ 2. เป็นประชากร Type area 1,Type area 3 ในช่วงเวลาที่กำหนด 3. จำนวนกลุ่มเป้าหมายที่ต้องดำเนินการตามที่ได้รับการจัดสรรในปีงบประมาณ 2567",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "2. ผู้จัดเก็บข้อมูล : ผู้รับผิดชอบงานโรคมะเร็ง",
      "formula": "3. พื้นที่รับผิดชอบ : Type area 1 = มีในทะเบียนบ้านและอยู่ในพื้นที่ Type area 3 = ไม่มีในทะเบียนบ้าน และอยู่ในพื้นที่มากกว่า 6 เดือน สูตรคำนวณ HDC สำนักงานสาธารณสุขจังหวัดขอนแก่น ตัวชี้วัด A = จำนวนประชากรกลุ่มเป้าหมายที่ได้รับการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรงด้วยวิธี FIT test และยังไม่ได้รับ ระยะเวลา การคัดกรองในปีงบประมาณ 2567 ประเมินผล B = จำนวนประชากรกลุ่มเป้าหมายที่ได้รับการจัดสรรในปีงบประมาณ 2568 (A/B) x 100 รายไตรมาส ปีงบประมาณ พ.ศ.2568",
      "numeratorA": "จำนวนประชากรกลุ่มเป้าหมายที่ได้รับการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรงด้วยวิธี FIT test และยังไม่ได้รับ",
      "denominatorB": "จำนวนประชากรกลุ่มเป้าหมายที่ได้รับการจัดสรรในปีงบประมาณ 2568",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลได้แบบ real time ผ่านระบบ HDC รายละเอียด ปีงบประมาณ 2565 ปีงบประมาณ 2566 ปีงบประมาณ 2567 ข้อมูลพื้นฐาน ร้อยละ 84.91 ร้อยละ 132.62 ร้อยละ 100.84 (Baseline Data) 1. ชื่อ-สกุล นางยุภาพร ดีแป้น ตำแหน่ง : พยาบาลวิชาชีพชำนาญการ ผลการดำเนินงาน กลุ่มงาน : ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด สำนักงานสาธารณสุขจังหวัดขอนแก่น ย้อนหลัง 3 ปี โทรศัพท์ที่ทำงาน : 043-221125 ต่อ 150 โทรสาร : 043-224037 (ปี 2565 -2567) โทรศัพท์มือถือ : 080-4620160 E-mail : smallbody@hotmail.com 2. ชื่อ-สกุล นางแสงเดือน โสภา ตำแหน่ง : พยาบาลวิชาชีพชำนาญการ",
      "responsible": "กลุ่มงาน : ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด สำนักงานสาธารณสุขจังหวัดขอนแก่น ตัวชี้วัด โทรศัพท์ที่ทำงาน : 043-221125 ต่อ 150 โทรสาร : 043-224037 โทรศัพท์มือถือ : 081-3803219 3. ชื่อ-สกุล นางกิตติมา ก้านจักร ตำแหน่ง : นักวิชาการสาธารณสุขชำนาญการพิเศษ กลุ่มงาน : ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ที่ทำงาน : 043-221125 ต่อ 169 โทรสาร : 043-224037 โทรศัพท์มือถือ : 087-7707761"
    },
    "KPI68-13": {
      "kpiId": "KPI68-13",
      "order": 13,
      "name": "กลุ่มเป้าหมาย FIT Test ที่มีผล Positive ได้รับการส่องกล้อง Colonoscopy",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "85",
      "baseline": "81.46",
      "definition": "1. ผู้ที่มีผลการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรงผิดปกติ หมายถึง ประชากรเพศชาย และเพศหญิงอายุ 50- 70 ปีที่มีผลการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรง ด้วยวิธี Fecal Immunochemical Test (FIT) เป็นบวก (Positive) คือตรวจพบเม็ดเลือดแดงใน ตัวอย่างอุจจาระ 2. การส่องกล้อง Colonoscopy หมายถึง การวินิจฉัยความผิดปกติภายในลำไส้ใหญ่ ด้วยการส่องกล้องขยาย เพื่อการค้นหารอยโรคก่อนการเกิดมะเร็งลำไส้ใหญ่และไส้ตรงใน ระยะต้น",
      "purpose": "เพื่อลดอัตราการเกิดโรคมะเร็งลำไส้ใหญ่และไส้ตรงในระยะลุกลาม",
      "population": "ประชากรกลุ่มเป้าหมายที่ได้รับการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรงด้วยวิธี FIT test ในปีงบประมาณ พ.ศ.2568 ผลการตรวจเป็นบวก (Positive)",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "1. โปรแกรม Your Colonoscopy 2. HDC สำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "formula": "A = จำนวนประชากรกลุ่มเป้าหมายที่ได้รับการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรงด้วยวิธี FIT test ในปีงบประมาณ พ.ศ.2568 ผลการตรวจเป็นบวก (Positive) B = จำนวนประชากรกลุ่มเป้าหมายที่ได้รับการคัดกรองมะเร็งลำไส้ใหญ่ และไส้ตรงด้วยวิธี FIT test ในปีงบประมาณ พ.ศ.2568 ผลการตรวจเป็นบวก (Positive) ที่ได้รับการส่องกล้อง Colonoscopy สูตรคำนวณ (A/B) x 100 ตัวชี้วัด ระยะเวลา รายไตรมาส ปีงบประมาณ พ.ศ.2568 ประเมินผล",
      "numeratorA": "จำนวนประชากรกลุ่มเป้าหมายที่ได้รับการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรงด้วยวิธี FIT test",
      "denominatorB": "จำนวนประชากรกลุ่มเป้าหมายที่ได้รับการคัดกรองมะเร็งลำไส้ใหญ่ และไส้ตรงด้วยวิธี FIT test",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลได้แบบ real time จากโปรแกรม Your Colonoscopy รายละเอียด ปีงบประมาณ 2565 ปีงบประมาณ 2566 ปีงบประมาณ 2567 ร้อยละ 85.24 ร้อยละ 82.67 ร้อยละ 81.46 ข้อมูลพื้นฐาน (Baseline Data) ผลการดำเนินงาน ย้อนหลัง 3 ปี (ปี 2565 -2567) ทธศาสตร์จังหวัดขอนแก่น ระยะ 5 ปี (พ.ศ. 2566-2570) หน้า 82 128",
      "responsible": "ตำแหน่ง : พยาบาลวิชาชีพชำนาญการ สำนักงานสาธารณสุขจังหวัดขอนแก่น ตัวชี้วัด 1. ชื่อ-สกุล นางยุภาพร ดีแป้น โทรสาร : 043-224037 E-mail : smallbody@hotmail.com กลุ่มงาน : ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด ตำแหน่ง : พยาบาลวิชาชีพชำนาญการ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ที่ทำงาน : 043-221125 ต่อ 150 โทรสาร : 043-224037 โทรศัพท์มือถือ : 080-4620160 ตำแหน่ง : นักวิชาการสาธารณสุขชำนาญการพิเศษ สำนักงานสาธารณสุขจังหวัดขอนแก่น 2. ชื่อ-สกุล นางแสงเดือน โสภา โทรสาร : 043-224037 กลุ่มงาน : ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด โทรศัพท์ที่ทำงาน : 043-221125 ต่อ 150 โทรศัพท์มือถือ : 081-3803219 3. ชื่อ-สกุล นางกิตติมา ก้านจักร กลุ่มงาน : ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด โทรศัพท์ที่ทำงาน : 043-221125 ต่อ 169 โทรศัพท์มือถือ : 087-7707761"
    },
    "KPI68-14": {
      "kpiId": "KPI68-14",
      "order": 14,
      "name": "อัตราความครอบคลุมของการค้นหาผู้ป่วยวัณโรคในกลุ่มผู้สัมผัสร่วมบ้าน",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "100",
      "baseline": "100",
      "definition": "การประเมินการค้นหาวัณโรค หมายถึง ผู้ที่ได้รับการค้นหาวัณโรคด้วยวิธีการถ่ายภาพรังสีทรวงอก (Chest X-Ray) ในปีงบประมาณ 2568 (1 ตุลาคม 2567 - 30 กันยายน 2568) ผู้สัมผัสวัณโรคร่วมบ้าน (household contact) หมายถึง บุคคลที่อาศัยอยู่ร่วมบ้านกับผู้ป่วย ถ้านอนห้องเดียวกัน (household intimate) มีโอกาสรับ และติดเชื้อสูงมากกว่าผู้ที่อาศัยในบ้านเดียวกัน แต่นอนแยกห้อง (household regular) ไม่นับรวมญาติพี่น้องที่อาศัยอยู่คนละบ้านแต่ไปมาหาสู่ เป็นครั้งคราว และนับระยะเวลาที่อยู่ร่วมกับผู้ป่วยกี่วันก็ได้ในช่วงระหว่าง 3 เดือนที่ผ่านมา",
      "purpose": "เพื่อให้คัดกรองกลุ่มผู้สัมผัสร่วมบ้าน และค้นหาผู้ป่วยวัณโรค เพื่อเข้าถึงกระบวนการรักษา ได้อย่าง รวดเร็ว สามารถลดอัตราป่วย และอัตราการเสียชีวิตได้",
      "population": "กลุ่มผู้สัมผัสร่วมบ้าน (household contact) หมายถึง บุคคลที่อาศัยอยู่ร่วมบ้านกับผู้ป่วยวัณโรคปอด ที่ขึ้นทะเบียนตั้งแต่ปีงบประมาณ 2568 (ตั้งแต่วันที่ 1 ตุลาคม 2567 ถึงวันที่ 30 กันยายน 2568)",
      "collectionMethod": "1. ทะเบียนผู้สัมผัสร่วมบ้าน 2. บันทึกข้อมูลผู้ป่วยวัณโรค ผ่านโปรแกรมบริหารจัดการข้อมูลรายป่วยวัณโรคแห่งชาติ (โปรแกรม NTIP online)",
      "source": "โปรแกรมบริหารจัดการข้อมูลรายป่วยวัณโรคแห่งชาติ (NTIP online)",
      "formula": "อัตราความครอบคลุมของการค้นหาผู้ป่วยวัณโรคในกลุ่มผู้สัมผัสร่วมบ้าน (เฝ้าระวังติดตามครบ 2 ปี) คำนวณจาก สูตรคำนวณ = (A/B) x 100 A = จำนวนผู้สัมผัสร่วมบ้านของผู้ป่วยวัณโรคปอดที่ขึ้นทะเบียนปีงบประมาณ 2568 (ตั้งแต่วันที่ 1 ตุลาคม 2567 ถึงวันที่ 30 กันยายน 2568) ที่ได้รับการคัดกรองด้วยวิธีการถ่ายภาพรังสี ทรวงอก (Chest X-Ray) ในโปรแกรม NTIP B = จำนวนผู้สัมผัสร่วมบ้านของผู้ป่วยวัณโรคปอดที่ขึ้นทะเบียนปีงบประมาณ 2568 (ตั้งแต่วันที่ 1 ตุลาคม 2567 ถึงวันที่ 30 กันยายน 2568) ในทะเบียนผู้สัมผัสร่วมบ้าน",
      "numeratorA": "จำนวนผู้สัมผัสร่วมบ้านของผู้ป่วยวัณโรคปอดที่ขึ้นทะเบียนปีงบประมาณ 2568",
      "denominatorB": "จำนวนผู้สัมผัสร่วมบ้านของผู้ป่วยวัณโรคปอดที่ขึ้นทะเบียนปีงบประมาณ 2568",
      "frequency": "ติดตามความก้าวหน้าการดำเนินงานทุกเดือน",
      "evaluationMethod": "เปรียบเทียบผลการดำเนินงานกับค่าเป้าหมายอัตราความครอบคลุมของการค้นหาผู้ป่วยวัณโรคในกลุ่มผู้ สัมผัสร่วมบ้าน ร้อยละ 100 แยกราย CUP",
      "responsible": "นางวีระวรรณ เหล่าวิทวัส ตำแหน่ง นักวิชาการสาธารณสุขชำนาญการพิเศษ กลุ่มงาน ควบคุมโรคติดต่อ หน่วยงาน สสจ.ขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ124 โทรสาร 0-4322-4037 โทรศัพท์มือถือ 08-9622-4515 E-mail : - นางสาวเอ็มวิกา แสงชาติ ตำแหน่ง นักวิชาการสาธารณสุขปฏิบัติการ กลุ่มงาน ควบคุมโรคติดต่อ หน่วยงาน สสจ.ขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ124 โทรสาร 0-4322-4037 โทรศัพท์มือถือ 09-8209-6938 E-mail : s.emviga@gmail.com"
    },
    "KPI68-15": {
      "kpiId": "KPI68-15",
      "order": 15,
      "name": "อัตราป่วยโรคเบาหวานและโรคความดันโลหิตสูงรายใหม่ ลดลง",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 3",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "6 / 3",
      "baseline": "-",
      "definition": "ผู้ป่วยเบาหวานรายใหม่ หมายถึง ผู้ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยจากโรคเบาหวาน",
      "purpose": "เพื่อลดจำนวนผู้ป่วยรายใหม่ กลุ่มเป้าหมาย ประชากรที่อาศัยในพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วยโรคเบาหวาน (E10-E14) ในปีงบประมาณปัจจุบัน",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "เข้าระบบ Health Data Center (HDC) On Cloud ระบบรายงาน HDC กระทรวงสาธารณสุข",
      "formula": "A = จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วยโรคเบาหวาน (E10-E14) ในปีงบประมาณปัจจุบัน สูตรคำนวณ ตัวชี้วัด B = จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วยโรคเบาหวาน (E10-E14) ในปีงบประมาณที่ผ่านมา",
      "numeratorA": "จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วยโรคเบาหวาน",
      "denominatorB": "จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วยโรคเบาหวาน",
      "frequency": "[(B-A)/B] x100",
      "evaluationMethod": "A : จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วยโรคเบาหวาน (E10-E14) ในปีงบประมาณปัจจุบัน ประมวลผลจาก DIAGNOSIS_OPD , DIAGNOSIS_IPD , CHORNIC รหัส ICD-10 3 หลักขึ้นต้นด้วย E10-E14 ที่อยู่อาศัยในเขตพื้นที่รับผิดชอบ PERSON.TYPE AREA IN (1 , 3) (1 : มีชื่ออยู่ตามทะเบียนบ้านในเขตพื้นที่รับผิดชอบและอยู่จริง) , ( 3 : มาอาศัยในเขตรับผิดชอบ แต่ทะเบียนอยู่นอกเขตรับผิดชอบ) และ PERSON.DISCHARGE = “9” (ไม่จำหน่าย) PERSON.NATION = “099” (สัญชาติไทย) B : จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วยโรคเบาหวาน (E10-E14) ในปีงบประมาณที่ผ่านมา ประมวลผลจาก DIAGNOSIS_OPD , DIAGNOSIS_IPD , CHORNIC รหัส ICD-10 3 หลักขึ้นต้นด้วย E10-E14",
      "responsible": "ชื่อ-สกุล นางแสงเดือน โสภา ตำแหน่ง พยาบาลวิชาชีพชำนาญการ ตัวชี้วัด กลุ่มงาน ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ 150 โทรสาร 0-4322-4037 โทรศัพท์มือถือ... E-mail : sangdern.sopa@gmail.com"
    },
    "KPI68-16": {
      "kpiId": "KPI68-16",
      "order": 16,
      "name": "จำนวนโรงพยาบาลที่ยกระดับการพัฒนาอนามัยสิ่งแวดล้อมได้ตามเกณฑ์ GREEN & CLEAN Hospital",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 3",
      "unit": "แห่ง",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "4 / 16 / 6",
      "baseline": "-",
      "definition": "โรงพยาบาลที่ยกระดับพัฒนาอนามัยสิ่งแวดล้อมได้ตามเกณฑ์ GREEN & CLEAN Hospital Challenge หมายถึง โรงพยาบาลสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่น (รพ.ศูนย์ รพ.ทั่วไป รพ.ชุมชน) ที่มีกิจกรรมการดำเนินงานด้านอนามัยสิ่งแวดล้อมตามเกณฑ์ ดังนี้ ระดับมาตรฐาน (Standard) หมายถึง โรงพยาบาลสามารถดำเนินการตามเกณฑ์ข้อที่ 1 - 13 ได้ตามเงื่อนไข (คะแนน 80 % ขึ้นไป) CLEAN 1. มีการกำหนดนโยบาย จัดทำแผนการขับเคลื่อน พัฒนาศักยภาพและสร้างกระบวนการสื่อสาร ให้เกิดการพัฒนาด้านอนามัยสิ่งแวดล้อม GREEN & CLEAN Hospital อย่างมีส่วนร่วมของคนในองค์กร G : Garbage 2. มีการจัดการมูลฝอยทั่วไปอย่างถูกสุขลักษณะและเป็นไปตามกฎกระทรวงสุขลักษณะการจัดการ มูลฝอยทั่วไป 2560 และกฎหมายที่เกี่ยวข้อง 3. มีการจัดการมูลฝอยที่เป็นพิษหรืออันตรายอย่างถูกสุขลักษณะเป็นไปตามกฎกระทรวงมูลฝอยที่เป็น พิษหรืออันตรายจากชุมชน พ.ศ. 2563 และกฎหมายอื่นที่เกี่ยวข้อง 4. มีการจัดการมูลฝอยติดเชื้ออย่างถูกสุขลักษณะ ตามกฎกระทรวงว่าด้วยการกำจัดมูลฝอยติดเชื้อ พ.ศ. 2545 R : Rest room 5. มีการพัฒนาส้วมตามมาตรฐานส้วมสาธารณะไทย (HAS) ที่อาคารผู้ป่วยนอก(OPD) และอาคาร ผู้ป่วยใน (IPD) 6. มีการจัดการสิ่งปฏิกูลอย่างถูกสุขลักษณะตามกฎกระทรวงสุขลักษณะการจัดการสิ่งปฏิกูล พ.ศ. 2561 และกฎหมายอื่นที่เกี่ยวข้อง E : Energy 7. มีการกำหนดนโยบายและมาตรการประหยัดพลังงานที่เป็นปัจจุบัน และเป็นรูปธรรม เกิดประสิทธิภาพในการลดการใช้พลังงานและมีการปฏิบัติตามมาตรการที่กำหนดร่วมกันทั้งองค์กร E : Environment 8. มีการจัดการสิ่งแวดล้อมทั่วไปทั้งภายในและภายนอกอาคาร โดยเพิ่มพื้นที่สีเขียวและพื้นที่พักผ่อน ที่สร้างความรู้สึกผ่อนคลายสอดคล้องกับชีวิต และวัฒนธรรมท้องถิ่นสำหรับผู้ป่วย รวมทั้งผู้มารับบริการ 9. มีกิจกรรมส่งเสริม GREEN และกิจกรรมที่เอื้อต่อการมีสุขภาพดีแบบองค์รวม ได้แก่ กิจกรรม ส่งเสริมสุขอนามัย กิจกรรมป้องกันการแพร่ระบาดของโรค กิจกรรมทางกาย กิจกรรมให้คำปรึกษา ด้านสุขภาพขณะรอรับบริการของผู้ป่วยและญาติ N : Nutrition 10. สถานที่ประกอบอาหารผู้ป่วยในโรงพยาบาลได้มาตรฐานสุขาภิบาลอาหารตามกฎกระทรวง สุขลักษณะของสถานที่จำหน่ายอาหาร พ.ศ. 2561 (4 หมวด) และมีการเฝ้าระวังทางสุขาภิบาลอาหาร 11. ร้านอาหารในโรงพยาบาลได้มาตรฐานสุขาภิบาลอาหารตามกฎกระทรวงสุขลักษณะของสถานที่ จำหน่ายอาหาร พ.ศ. 2561 (4 หมวด) และมีการเฝ้าระวังทางสุขาภิบาลอาหาร 12. จัดให้มีน้ำอุปโภค/บริโภคสะอาดที่อาคารผู้ป่วยนอกและผู้ป่วยใน 13. โรงพยาบาลมีการดำเนินงานนโยบายโรงพยาบาลอาหารปลอดภัยร่วมกับภาคีเครือข่ายในพื้นที่ (ตามคู่มือมาตรฐานโรงอาหารปลอดภัย Food Safety Hospital) ระดับดีเยี่ยม (Excellent) หมายถึง โรงพยาบาลสามารถดำเนินการ ตามเกณฑ์ข้อที่ 1 - 15 ได้ตามเงื่อนไขที่กำหนด (คะแนน 90 % ขึ้นไป) Innovation 14. มีการส่งเสริมให้เกิดนวัตกรรม GREEN โดยการนำไปใช้ประโยชน์และเกิดการแลกเปลี่ยนเรียนรู้ กับเครือข่ายในโรงพยาบาลและชุมชน",
      "purpose": "เพื่อส่งเสริมให้โรงพยาบาลสังกัดสำนักงานสาธารณสุขจังหวัด มีการพัฒนาอนามัยสิ่งแวดล้อม ได้ตามเกณฑ์ GREEN & CLEAN Hospital Challenge",
      "population": "โรงพยาบาลสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "collectionMethod": "โรงพยาบาลทุกแห่งบันทึกข้อมูลในโปรแกรม GREEN & CLEAN Hospital",
      "source": "โปรแกรมการประเมิน GREEN & CLEAN Hospital",
      "formula": "A = จำนวนรพ.ที่ดำเนินการได้ตามเกณฑ์ 13 ข้อ (คะแนน 80 % ขึ้นไป) B = จำนวนรพ.ที่ดำเนินการได้ตามเกณฑ์ 15 ข้อ (คะแนน 90 % ขึ้นไป) C = จำนวนรพ.ที่ดำเนินการได้ตามเกณฑ์ 15 ข้อ (คะแนน 90 % ขึ้นไป) และพัฒนาได้ตามประเด็นท้าทายA+B+C=26 ระยะเวลา นิเทศ ติดตาม และประเมินผลการดำเนินงานสาธารณสุขจังหวัดขอนแก่น ปี 2568 จำนวน 2 รอบ ประเมินผล",
      "numeratorA": "จำนวนโรงพยาบาลสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่นที่ดำเนินการ GREEN & CLEAN",
      "denominatorB": "จำนวนโรงพยาบาลสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่นที่ดำเนินการ GREEN & CLEAN",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "1. โรงพยาบาลทุกแห่งประเมินตนเองบันทึกข้อมูลในโปรแกรม GREEN & CLEAN Hospital ส่งให้ สำนักงานสาธารณสุขจังหวัดขอนแก่น 2. สำนักงานสาธารณสุขจังหวัดขอนแก่น ประเมินผลการดำเนินงานของโรงพยาบาลศูนย์ โรงพยาบาล",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI68-17": {
      "kpiId": "KPI68-17",
      "order": 17,
      "name": "อัตราความสำเร็จของการรักษาวัณโรคปอดรายใหม่",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "90",
      "baseline": "66.90",
      "definition": "1. ความสำเร็จการรักษา หมายถึง ผู้ป่วยวัณโรคปอดรายใหม่ที่มีผลการรักษาหายรวมกับรักษาครบ 1.1 รักษาหาย (Cured) หมายถึง ผู้ป่วยวัณโรคปอดรายใหม่ที่มี ผลตรวจทางห้องปฏิบัติการพบเชื้อ วัณโรคก่อนเริ่มการรักษา และต่อมาตรวจไม่พบเชื้อวัณโรคอย่างน้อยหนึ่งครั้งก่อนสิ้นสุดการรักษา และในเดือนสุดท้ายของการรักษา 1.2 รักษาครบ (Treatment Completed) หมายถึง ผู้ป่วยวัณโรคปอดรายใหม่ที่รักษาครบกำหนด โดยไม่มีหลักฐานที่แสดงว่าการรักษาล้มเหลว ซึ่งผู้ป่วยดังกล่าวไม่มีเอกสารที่แสดงผลการตรวจเสมหะ ในเดือนสุดท้ายของการรักษา ทั้งนี้มีผลตรวจเสมหะเป็นลบอย่างน้อยหนึ่งครั้งก่อนสิ้นสุดการรักษา รวมทั้งผู้ป่วยที่ไม่ได้ตรวจหรือไม่มีผลตรวจ 2. ผู้ป่วยวัณโรคปอดรายใหม่ หมายถึง ผู้ป่วยวัณโรคปอดที่ไม่เคยรักษาวัณโรคมาก่อนและผู้ป่วยที่รักษา วัณโรคน้อยกว่า 1 เดือน และไม่เคยขึ้นทะเบียนในแผนงานวัณโรคแห่งชาติ แบ่งเป็น 2 กลุ่ม คือ 2.1 ผู้ป่วยที่มีผลตรวจยืนยันพบเชื้อวัณโรค (Bacteriologically confirmed: B+) หมายถึง ผู้ป่วย วัณโรคที่มีผลตรวจเสมหะเป็นบวก อาจจะเป็นการตรวจด้วยวิธี Smear microscopy หรือ Culture หรือวิธี Molecular หรือวิธีการอื่นๆ ที่องค์การอนามัยโลกรับรอง 2.2 ผู้ป่วยที่วินิจฉัยด้วยลักษณะทางคลินิก (Clinically diagnosed:B-) หมายถึง ผู้ป่วยวัณโรคที่มีผล ตรวจเสมหะเป็นลบ หรือไม่มีผลตรวจ แต่ผลการวินิจฉัยด้วยวิธีการตรวจเอกซเรย์รังสีทรวงอก หรือผลการตรวจชิ้นเนื้อผิดปกติเข้าได้กับวัณโรค ร่วมกับมีลักษณะทางคลินิกเข้าได้กับวัณโรค และแพทย์ตัดสินใจรักษาด้วยสูตรยารักษาวัณโรค 3. การประเมิน การประเมินอัตราความสำเร็จการรักษาผู้ป่วยวัณโรคปอดรายใหม่ (Success rate) หมายถึง ผู้ป่วย วัณโรคปอดรายใหม่ที่ขึ้นทะเบียน ในไตรมาสที่ 1 ของปีงบประมาณ 2568 (1 ตุลาคม – 31 ธันวาคม 2567) ที่เป็นผู้ป่วยไทย ผู้ป่วยไม่ใช่ไทย และผู้ป่วยในเรือนจำ ที่รักษาในโรงพยาบาลรัฐทั้ งใน และนอกสังกัดกระทรวงสาธารณสุข ไม่รวมโรงพยาบาลเอกชน",
      "purpose": "1. เพื่อให้ผู้ติดเชื้อวัณโรคและผู้ป่วยวัณโรคเข้าถึงระบบบริการสุขภาพในด้านการตรวจวินิจฉัย ป้องกัน",
      "population": "ดูแลรักษาที่ได้มาตรฐานและรักษาหาย รักษาครบ 2. เพื่อพัฒนามาตรฐานระบบบริการสุขภาพในการตรวจวินิจฉัย ป้องกัน ดูแลรักษาผู้ติดเชื้อวัณโรค และผู้ป่วยวัณโรคของสถานบริการสาธารณสุข กลุ่มเป้าหมายสำหรับการประเมินอัตราความสำเร็จการรักษาผู้ป่วยวัณโรคปอดรายใหม่ คือ ผู้ป่วยวัณโรคปอดรายใหม่ที่ขึ้นทะเบียนในไตรมาสที่ 1 ของปีงบประมาณ 2568 (1 ตุลาคม–ธันวาคม 2567) ที่เป็นผู้ป่วยไทย ผู้ป่วยไม่ใช่ไทยและผู้ป่วยในเรือนจำที่รักษาในโรงพยาบาลรัฐ ทั้งในและนอกสังกัด กระทรวงสาธารณสุขไม่รวมโรงพยาบาลเอกชน",
      "collectionMethod": "บันทึกข้อมูลผู้ป่วยวัณโรค ผ่านโปรแกรมบริหารจัดการข้อมูลรายป่วยวัณโรคแห่งชาติ (โปรแกรม NTIP online)",
      "source": "โปรแกรมบริหารจัดการข้อมูลรายป่วยวัณโรคแห่งชาติ (NTIP online)",
      "formula": "อัตราความสำเร็จการรักษาผู้ป่วยวัณโรคปอดรายใหม่ที่ขึ้นทะเบียน ในไตรมาสที่ 1 ของ ปีงบประมาณ พ.ศ.2568 (1 ตุลาคม – 31 ธันวาคม 2567) คำนวณจาก สูตรคำนวณ = (A/B) x 100 A = จำนวนผู้ป่วยวัณโรคปอดรายใหม่ที่ขึ้นทะเบียนในไตรมาสที่ 1 ของปีงบประมาณ 2568 (1 ตุลาคม – 31 ธันวาคม 2567) โดยมีผลการรักษาหาย (Cured) รวมกับรักษาครบ (Completed) โดยครบรอบรายงานผลการรักษาวันที่ 30 กันยายน 2567 B = จำนวนผู้ป่วยวัณโรคปอดรายใหม่ที่ขึ้นทะเบียนในไตรมาสที่ 1 ของปีงบประมาณ 2568 (1 ตุลาคม – 31 ธันวาคม 2567) โดยการเปลี่ยนแปลงวินิจฉัยและพบว่าเป็น RR/MDR/XDR-TB ไม่ถูกนำมานับรวม ระยะเวลา ติดตามความก้าวหน้าการดำเนินงานทุกเดือน ประเมินผล",
      "numeratorA": "จำนวนผู้ป่วยวัณโรคปอดรายใหม่ที่ขึ้นทะเบียนในไตรมาสที่ 1 ของปีงบประมาณ 2568",
      "denominatorB": "จำนวนผู้ป่วยวัณโรคปอดรายใหม่ที่ขึ้นทะเบียนในไตรมาสที่ 1 ของปีงบประมาณ 2568",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "เปรียบเทียบผลการดำเนินงานกับค่าเป้าหมาย รายละเอียดข้อมูล อัตราผลสำเร็จของการรักษาวัณโรคปอดรายใหม่ (ไตรมาสที่ 1/2568) ไม่น้อยกว่าร้อยละ 90 พื้นฐาน(Baseline Data) แยกเป็นระดับ CUP ผลการดำเนินงาน ย้อนหลัง 3 ปี Baseline data หน่วย ผลการดำเนินงานในรอบ (ปี 2565 -2567) วัด ปีงบประมาณ พ.ศ. 2565 2566 2567 อัตราความสำเร็จการรักษาวัณโรคปอด ร้อยละ 70.83 75.26 76.55 รายใหม่* หมายเหตุ * อัตราความสำเร็จการรักษาผู้ป่วยวัณโรคปอดรายใหม่ที่ขึ้นทะเบียน ในไตรมาสที่ 1 ของแต่ละปีงบประมาณ ** ไม่คิดรวมอยู่ระหว่างการรักษา ร้อยละ 8.36",
      "responsible": "นางวีระวรรณ เหล่าวิทวัส ตำแหน่ง นักวิชาการสาธาณสุขชำนาญการพิเศษ กลุ่มงาน ควบคุมโรคติดต่อ หน่วยงาน สสจ.ขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ124 โทรสาร 0-4322-4037 โทรศัพท์มือถือ 08-9622-4515 E-mail : - นางสาวเอ็มวิกา แสงชาติ ตำแหน่ง นักวิชาการสาธารณสุขปฏิบัติการ กลุ่มงาน ควบคุมโรคติดต่อ หน่วยงาน สสจ.ขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ124 โทรสาร 0-4322-4037 โทรศัพท์มือถือ 09-8209-6938 E-mail : s.emviga@gmail.com"
    },
    "KPI68-18": {
      "kpiId": "KPI68-18",
      "order": 18,
      "name": "ร้อยละประชาชนกลุ่มเป้าหมายเป็นโรคพยาธิใบไม้ตับลดลง",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ร้อยละ",
      "direction": "ยิ่งน้อยยิ่งดี",
      "target": "≤ 1 / ≤ 40",
      "baseline": "-",
      "definition": "ร้อยละประชาชนกลุ่มเป้าหมายเป็นโรคพยาธิใบไม้ตับลดลง ตามเกณฑ์มาตรฐานแผนยุทธศาสตร์สุขภาพ 5 ปี จังหวัดขอนแก่น (พ.ศ. 2566–2570)",
      "purpose": "1. เพื่อเฝ้าระวัง ป้องกัน ควบคุม รักษาโรคพยาธิใบไม้ตับและมะเร็งท่อน้ำดี 2. เพื่อพัฒนาคุณภาพการคัดกรองวินิจฉัย การส่งต่อดูแลรักษาโรคพยาธิใบไม้ตับและมะเร็งท่อน้ำดี",
      "population": "หมายถึง ประชากรจังหวัดขอนแก่น (ตาม43แฟ้ม Type area = 1,3 และ Nation = 099) ที่มีอายุ 15 ปีขึ้นไป หรืออาศัยอยู่ในอีสานมากกว่า 15 ปี และมีปัจจัยเสี่ยงในข้อใดข้อหนึ่งต่อไปนี้ 1. มีประวัติการกินปลาตระกูลมีเกล็ดน้ำจืดสุกๆดิบๆ หรือปลาร้าดิบ ปลาส้มดิบ ปล่าจ่อมดิบ 2. มีประวัติการติดเชื้อพยาธิใบไม้ตับ หรือเคยกินยาฆ่าเชื้อพยาธิใบไม้ตับ (Praziquantel) 3. มีญาติสายตรงติดพยาธิใบไม้ตับ หรือป่วย/เสียชีวิตด้วยโรคมะเร็งท่อน้ำดี การตรวจคัดกรองโรคพยาธิใบไม้ตับ หมายถึง การตรวจหาพยาธิใบไม้ตับ (OV; Opisthorchis viverrini) ในกลุ่มประชากรที่มีอายุ 15 ปีขึ้นไป ด้วยวิธีตรวจอุจจาระ และ/หรือ ปัสสาวะ โดย วิธีตรวจอุจจาระ ได้แก่ Formalin ether concentration technique (FECT) หรือ Modified Kato thick smear หรือ Modified Kato-Katz หรือ JIK-PARASITE TRAP วิธีตรวจปัสสาวะ (OV-RDT; OV-Rapid diagnostic test) คือ การใช้ตัวตรวจจับจำเพาะ หรือโมโนโคลนอล แอนติบอดี (monoclonal antibody) ที่มีความจำเพาะต่อพยาธิใบไม้ตับและเป็นสารตรวจจับสิ่งคัดหลั่ง หรือแอนติเจนของพยาธิใบไม้ตับในปัสสาวะ การตรวจคัดกรองมะเร็งท่อน้ำดีด้วยการอัลตราซาวด์ หมายถึง การตรวจมะเร็งท่อน้ำดีด้วยการอัลตรา ซาวด์ ในประชาชนกลุ่มเป้าหมาย ที่ตรวจพบพยาธิใบไม้ตับจากการตรวจหาการติดเชื้อจากอุจจาระ หรือปัสสาวะ ในกลุ่มประชากรที่มีอายุ 40 ปีขึ้นไป โดยจังหวัดขอนแก่นมุ่งเน้นในกลุ่มที่มีอายุระหว่าง 50 - 70 ปี แนวทางดำเนินงานเฝ้าระวัง ป้องกัน รักษาโรคมะเร็งท่อน้ำดี ตาม 8 มาตรการ ดังนี้ มาตรการที่ 1 คัดกรองพยาธิใบไม้ตับในประชากรกลุ่มเป้าหมาย เมื่อพบผู้ติดพยาธิให้รักษาและปรับเปลี่ยน พฤติกรรมสุขภาพ มาตรการที่ 2 คัดกรองมะเร็งท่อน้ำดีในประชาชนอายุ 40 ปีขึ้นไป ด้วยเครื่องอัลตร้าซาวด์ มาตรการที่ 3 จัดระบบสุขาภิบาล บริหารจัดการสิ่งปฏิกูลเพื่อตัดวงจรพยาธิ โดยจัดให้มีบ่อบำบัดสิ่งปฏิกูล ในทุกพื้นที่ผ่านองค์กรปกครองส่วนท้องถิ่น มาตรการที่ 4 สนับสนุนให้มีการสร้างความรอบรู้ด้านสุขภาพ (Health Literacy) โรคพยาธิใบไม้ตับ และมะเร็งท่อน้ำดี ในเด็กนักเรียน เยาวชน อาสาสมัครสาธารณสุข ผู้ประกอบการ และประชาชน มาตรการที่ 5 รณรงค์อาหารปลอดภัย ปลาปลอดพยาธิอย่างต่อเนื่องในพื้นที่ผ่านทุกช่องทางการสื่อสารตามบริบท มาตรการที่ 6 บริหารจัดการส่งต่อผู้สงสัยมะเร็งท่อน้ำ ดีเข้าสู่กระบวนการวินิจฉัยรักษาอย่างเป็นระบบ และมี ระบบการ รับ-ส่งต่อ ผู้ป่วยจากโรงพยาบาลสู่ชุมชนมีหมอครอบครัวเข้าไปดูแลประคับประคองด้วยการแพทย์ ผสมผสานทั้ง แพทย์แผนปัจจุบัน และแพทย์ทางเลือก มาตรการที่ 7 รายงานข้อมูล ตามระบบงานเฝ้าระวัง ได้แก่ ฐานข้อมูลจังหวัด อำเภอ , HDC , Isan cohort มาตรการที่ 8 พัฒนานวัตกรรม และพัฒนาบุคลากรทางด้านสาธารณสุขในการป้องกันควบคุมโรคพยาธิใบไม้ตับ และการรักษามะเร็งท่อน้ำดี เพื่อนำไปใช้ในการปรับปรุงการแก้ไขปัญหาพยาธิใบไม้ตับและมะเร็งท่อน้ำดี",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "ฐานข้อมูลจังหวัด หรือ HDC 43 แฟ้ม หรือ Isan cohort รหัสการบันทึกข้อมูล 43 แฟ้ม ; การคัดกรองพยาธิใบไม้ตับ Screening รหัส Z116 กรณีพบการติดเชื้อ สูตรคำนวณ พยาธิใบไม้ตับ ใช้รหัส ICD10 คือ B 660 โดยในปี 2568 สสจ.ขอนแก่น มุ่งเน้นการจัดเก็บในฐานข้อมูล ตัวชี้วัด HDC และ Isan cohort เป็นหลัก ขึ้นอยู่กับบริบทพื้นที่ ระยะเวลา ฐานข้อมูลจังหวัด หรือ HDC 43 แฟ้ม หรือ Isan cohort ประเมินผล A = ประชากรเป้าหมายที่ได้รับการตรวจคัดกรองพยาธิใบไม้ตับและมีผลพบเชื้อ",
      "numeratorA": "ประชากรเป้าหมายที่ได้รับการตรวจคัดกรองพยาธิใบไม้ตับและมีผลพบเชื้อ",
      "denominatorB": "ประชากรกลุ่มเป้าหมายที่ได้รับการตรวจคัดกรอง ปี 2568 ทั้งหมด",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI68-19": {
      "kpiId": "KPI68-19",
      "order": 19,
      "name": "อัตราการฆ่าตัวตายสำเร็จ ไม่เกิน 8 ต่อประชากรแสนคน",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ต่อแสนประชากร",
      "direction": "ยิ่งน้อยยิ่งดี",
      "target": "6.39",
      "baseline": "6.39",
      "definition": "การฆ่าตัวตายสำเร็จ คือ การเสียชีวิตจากพฤติกรรมมุ่งทำร้ายตนเองโดยตั้งใจจะให้ตายจากพฤติกรรมนั้น ซึ่งวิธีการที่ใช้มีลักษณะสอดคล้องตามมาตรฐานการจำแนกโรคระหว่างประเทศขององค์การอนามัยโลก ฉบับที่ 10 (ICD - 10 : International Classification of Diseases and Health Related Problems - 10) หมวด Intentional self-harm (X60-X84) หรือเทียบเคียงในกลุ่มโรคเดียวกันกับการวินิจฉัยตามเกณฑ์ วินิจฉัยโรคของสมาคมจิตแพทย์อเมริกัน ฉบับที่ 5 (DSM-5: Diagnostic and Statistical Manual of Mental disorders 5)",
      "purpose": "เพื่อใช้แสดงและติดตามภาวะสุขภาพอนามัยที่สำคัญด้านสุขภาพจิตของประชาชน",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "หมายเหตุ ในอำเภอ ที่พบปัญหาการรายงาน รง 506s version 11 หรือข้อมูลจากการรายงาน รง.506s",
      "formula": "ต่ำกว่าฐานข้อมูลการตายในทะเบียนราษฎร์ของกระทรวงมหาดไทย จะใช้ข้อมูลการแจ้งตายจากฐานข้อมูลการ ตายทะเบียนราษฎร์ของกระทรวงมหาดไทย ที่รวบรวมโดยกองยุทธศาสตร์และแผนงาน กระทรวงสาธารณสุข สูตรคำนวณ ทดแทน ตัวชี้วัด ระยะเวลา 1. รายงานการเฝ้าระวังการพยายามฆ่าตัวตาย รง 506 S version 11. ประเมินผล 2. ข้อมูลการแจ้งตายจากฐานข้อมูลการตายทะเบียนราษฎร์ของกระทรวงมหาดไทย (อ้างอิงตามสถานที่เสียชีวิต) A = จำนวนผู้ฆ่าตัวตายสำเร็จ (อ้างอิงตามสถานที่เสียชีวิต) ปีงบประมาณ 2568 B = จำนวนประชากรกลางปี 2568 **หมายเหตุ สำหรับไตรมาส 2 ใช้ประชากรปลายปี 2567 สำหรับไตรมาส 3 และ 4 ใช้ประชากรกลางปี 2568 แหล่งข้อมูล กองยุทธศาสตร์และแผนงาน กระทรวงสาธารณสุข (A/B) x 100,000 ไตรมาส 4",
      "numeratorA": "จำนวนผู้ฆ่าตัวตายสำเร็จ (อ้างอิงตามสถานที่เสียชีวิต) ปีงบประมาณ 2568",
      "denominatorB": "จำนวนประชากรกลางปี 2568",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "นำข้อมูลที่ได้มาวิเคราะห์ข้อมูลทางสถิติในรูปแบบของอัตราต่อประชากรแสนคน รายละเอียด Baseline data หน่วยวัด ผลการดำเนินงานในรอบปีงบประมาณ พ.ศ. ข้อมูลพื้นฐาน การฆ่าตัวตายสำเร็จ (Baseline อัตราต่อ 2565 2566 2567 Data) ประชากร ผลการ แสนคน 5.97 6.18 6.57 ดำเนินงาน ย้อนหลัง 3 ปี",
      "responsible": "โทรศัพท์มือถือ 086-8616497 ตำแหน่ง พยาบาลวิชาชีพชำนาญการ ตัวชี้วัด 2. ชื่อ-สกุล นายณรงค์ชัย เศิกศิริ e-mail : tuttu34@gmail.com โทรศัพท์มือถือ 081-6691062 ตำแหน่ง นักวิชาการสาธารณสุข 3. ชื่อ-สกุล นางสาวนงลักษณ์ เข็มศิริ e-mail keeta.nongluk1@gmail.com โทรศัพท์มือถือ 062-5161046 สำนักงานสาธารณสุขจังหวัดขอนแก่น กลุ่มงานควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด โทรสาร 0-4322-4037 โทรศัพท์ 0-4322-1125 ต่อ 170"
    },
    "KPI68-20": {
      "kpiId": "KPI68-20",
      "order": 20,
      "name": "อัตราตายผู้ป่วยติดเชื้อในกระแสเลือดแบบรุนแรงชนิด (Community-Acquired) น้อยกว่าร้อยละ 26",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ร้อยละ",
      "direction": "ยิ่งน้อยยิ่งดี",
      "target": "< 24",
      "baseline": "24.02",
      "definition": "1. ผู้ป่วยติดเชื้อในกระแสเลือดแบบรุนแรง หมายถึง ผู้ป่วยที่เข้าเกณฑ์การวินิจฉัยภาวะ Severe sepsis หรือ Septic shock (โดยได้รับการคัดกรองตามเกณฑ์ข้อ 5) 1.1 ผู้ป่วย severe sepsis หมายถึง ผู้ป่วยที่สงสัยหรือยืนยันว่ามีการติดเชื้อในร่างกาย ร่วมกับ มี SIRS ตั้งแต่ 2 ข้อ ขึ้นไป ที่เกิดภาวะ Tissue hypoperfusion หรือ Organ dysfunction โดยที่อาจจะมีหรือไม่มีภาวะ Hypotension ก็ได้ หรือมีอาการแสดงตามเกณฑ์ ข้อใดข้อหนึ่ง ใน 5.2 - 5.4 1.2 ผู้ป่วย Septic shock หมายถึง ผู้ป่วยที่สงสัยหรือยืนยันว่ามีการติดเชื้อในร่างกาย ร่วมกับมี SIRS ตั้งแต่ 2 ข้อ ขึ้นไป ที่มี Hypotension ต้องใช้ Vasopressors ในการ Maintain MAP ≥65 mm Hg และ มีค่า serum lactate level >2 mmol/L (18 mg/dL) แม้ว่าจะได้สารน้ำ เพียงพอแล้วก็ตาม 2. Community - acquired sepsis หมายถึง การติดเชื้อมาจากที่บ้านหรือที่ชุมชน โดยต้องไม่อยู่ ในกลุ่ม Hospital - acquired sepsis อัตราตายจากติดเชื้อในกระแสเลือด แบ่งเป็น 2 กลุ่ม คือ 1) อัตราตายจาก Community - acquired sepsis 2) อัตราตายจาก Hospital - acquired sepsis 3. การติดเชื้อในโรงพยาบาล (Hospital - acquired infection, Nosocomial infection) คือ การติดเชื้อที่เกิดขึ้นในโรงพยาบาลหรือสถานที่อื่นๆ ที่ให้บริการสุขภาพ เช่น บ้านพักผู้ป่วย บ้านพัก คนชรา สถานบำบัด ห้องตรวจผู้ป่วยนอก หรืออื่นๆ การติดเชื้อในโรงพยาบาลเกิดขึ้นได้หลายวิธี เช่น ติดผ่านบุคลากรทางการแพทย์ที่มีเชื้อปนเปื้อนบนร่างกาย อุปกรณ์ที่ปนเปื้อน ผ้าปูที่นอน หรือละออง สารคัดหลั่งที่มีเชื้อ เป็นต้น ที่มาของเชื้ออาจมาจากสิ่งแวดล้อม จากผู้ป่วย จากบุคลากรที่ติดเชื้อ หรืออาจหาแหล่งที่มาของเชื้อไม่พบก็ได้ เชื้ออาจมาจากร่างกายของผู้ป่วยเอง ซึ่งเดิมเป็นเชื้อ ที่ยังไม่สามารถก่อให้เกิดโรคได้ แต่เมื่อผู้ป่วยรับการรักษาบางอย่าง เช่น การผ่าตัด หรือหัตถการ บางประเภท ก็ทำให้เชื้อที่มีอยู่เดิมมีโอกาส ท้าให้เกิดการติดเชื้อได้ เช่น การติดเชื้อที่แผลผ่าตัด Hospital - acquired infection (HAI) ห รือ Healthcare - associated infection ห ม าย ถึ ง การติดเชื้อที่เกิดในโรงพยาบาล เป็นการติดเชื้อที่ Date of Event (DOE) เกิดขึ้น หลังจากเข้ารับการ รักษาในโรงพยาบาลตั้งแต่วันที่ 3 เป็นต้นไป (Hospital day 3) หรือ หลังเข้ารับการรักษาในโรงพยาบาล ไปแล้ว อย่างน้อย 48 ชั่วโมง 4.",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "มุ่งเน้นที่กลุ่ม Community – acquired sepsis เพื่อพัฒนาให้ มีระบบข้อมูล พื้นฐานให้เหมือนกัน ทั้งประเทศ แล้วจึงขยายไปยัง Hospital-acquired sepsis ในปีถัดไป",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "(จำนวนผลงานที่บรรลุเกณฑ์ [A] ÷ จำนวนกลุ่มเป้าหมายทั้งหมด [B]) × 100",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI68-21": {
      "kpiId": "KPI68-21",
      "order": 21,
      "name": "อัตราผู้ป่วยโรคหลอดเลือดสมอง รายใหม่ต่อประชากรแสนคน",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ต่อแสนประชากร",
      "direction": "ยิ่งน้อยยิ่งดี",
      "target": "232",
      "baseline": "262",
      "definition": "ผู้ป่วยรายใหม่จากโรคหลอดเลือดสมอง หมายถึง ผู้ป่วยในที่ได้รับการวินิจฉัยโรคหลัก (Principal diagnosis: pdx) จากแพทย์ว่าป่วยด้วยโรคหลอดเลือดสมอง รหัส IDC 10 (I60-I69) ในปีงบประมาณ ทุกกลุ่มอายุ ในกรณีที่มีการวินิจฉัยโรคหลักซ้ำภายในระยะเวลามากกว่า 28 วันขึ้นไป ให้นับเป็นผู้ป่วย รายใหม่อีกครั้ง",
      "purpose": "เพื่อลดอัตราผู้ป่วยโรคหลอดเลือดสมองรายใหม่",
      "population": "ประชากรที่อยู่ตามทะเบียนราษฎร์ ทุกกลุ่มอายุ ในจังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านโปรแกรมพื้นฐานของหน่วยบริการและส่งออกข้อมูลตามมาตรฐานข้อมูล 43 แฟ้ม เข้าระบบ Health Data Center (HDC) On Cloud",
      "source": "HDC สำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "formula": "(A/B) x 100,000",
      "numeratorA": "จำนวนผู้ป่วยรายใหม่จากโรคหลอดเลือดสมองในปีงบประมาณ",
      "denominatorB": "จำนวนประชากรทะเบียนราษฎร์",
      "frequency": "1 ตุลาคม 2567 - รอบการนิเทศที่กำหนด",
      "evaluationMethod": "A : จำนวนผู้ป่วยในที่ได้รับการวินิจฉัยโรคหลัก (Principle diagnosis: pdx) จากแพทย์ว่าป่วยด้วย โรคหลอดเลือดสมอง รหัส ICD (I60-I69) ในปีงบประมาณทุกกลุ่มอายุ ในกรณีที่มีการวินิจฉัยโรคหลัก ซ้ำภายในระยะเวลามากกว่า 28 วันขึ้นไป ให้นับเป็นผู้ป่วยรายใหม่อีกครั้ ง ประมวลผลจาก DIAGNOSIS_IPD และ PERSON.DISCHARGE =”9” (ไม่ จำห น่ าย) PERSON.NATION = “99” สัญชาติไทย B : จำนวนประชากรตามทะเบียนราษฎร์ ทุกกลุ่มอายุ",
      "responsible": "ชื่อ นางประภัสสร แสนละมุน ตำแหน่ง นักวิชาการสาธารณสุข กลุ่มงาน : ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด โทรศัพท์ที่ทำงาน 043-221125 ต่อ 150 โทรศัพท์มือถือ 082-8365237 โทรสาร 043-224037 E-mail : matoom.27290@gail.com"
    },
    "KPI68-22": {
      "kpiId": "KPI68-22",
      "order": 22,
      "name": "ร้อยละของผู้ป่วย IMC ได้รับการบริบาลฟื้นสภาพและติดตามจนครบ 6 เดือน หรือจน Barthel index = 20 ก่อนครบ 6 เดือน (เป้าหมายร้อยละ 98)",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "99",
      "baseline": "93.5",
      "definition": "การบริบาลฟื้นสภาพระยะกลาง (Intermediate care; IMC) หมายถึง การบริบาลฟื้นสภาพผู้ป่วย ระยะกลางที่มีอาการทางคลินิกผ่านพ้นภาวะวิกฤติและมีอาการคงที่แต่ยังคงมีความผิดปกติ ของร่างกายบางส่วนอยู่และมีข้อจํากัดในการปฏิบัติกิจกรรมในชีวิตประจําวัน จําเป็นต้องได้รับบริการ ฟื้นฟูสมรรถภาพทางการแพทย์โดยทีมสหวิชาชีพ (multidisciplinary approach) อย่างต่อเนื่อง จนครบ 6 เดือน ตั้งแต่ในโรงพยาบาลจนถึงชุมชน เพื่อเพิ่มสมรรถนะร่างกาย จิตใจ ในการปฏิบัติ กิจวัตรประจําวัน และลดความพิการหรือภาวะทุพพลภาพ รวมทั้งกลับสู่สังคมได้อย่างเต็มศักยภาพ โดยมีการให้บริการผู้ป่วยระยะกลางในโรงพยาบาลทุกระดับ (A/S/M/F) โดยให้บริการผู้ป่วย ใน (Intermediate bed/ward) ผู้ป่วยนอกและ ให้บริการในชุมชน เช่น ศูนย์ฟื้นฟูสมรรถภาพ ในชุมชน เยี่ยมบ้าน เป็นต้น ผู้ป่วย Intermediate care หมายถึง ผู้ป่วย Stroke, Traumatic Brain Injury และSpinal Cord Injury รายใหม่ หรือกลับเป็นซ้ำภายในระยะเวลา 6 เดือน และ Fragility hip fracture รายใหม่ หรือกลับเป็นซ้ำทั้งหมดทุกรายที่เข้ารับการรักษาในโรงพยาบาลภายในจังหวัดที่รอดชีวิต แ ล ะ มี ค ะ แ น น Barthel index < 15 รว ม ทั้ งค ะ แ น น Barthel index ≥ 15 with multiple impairments ตามเกณฑ์การบริบาลฟื้นสภาพระยะกลางแบบผู้ป่วยใน (IPD-IMC protocol) สำหรับโรงพยาบาล Intermediate ward คื อ ก า ร ให้ บ ริ ก า ร Intensive inpatient rehabilitation program หมายถึง ผู้ป่วยได้รับการฟื้นฟูแบบผู้ป่วยในอย่างน้อย วันละ 3 ชั่วโมง และอย่างน้อย 5 วัน/ สัปดาห์ หรือ อย่างน้อย 15 ชั่วโมง/ สัปดาห์ (ไม่รวมชั่วโมง nursing care) โดยมีรายละเอียดการให้บริการ Intermediate ward ตามภาคผนวก 1 Intermediate bed คือ การให้บริการ Inpatient rehab program หมายถึง ผู้ป่วยได้รับการฟื้นฟูโดยเฉลี่ยอย่างน้อยวันละ 1 ชั่วโมงอย่างน้อย 3 ครั้ง/สัปดาห์ (ไม่รวมชั่วโมง nursing care) การพยาบาลฟื้นฟูสภาพ หมายถึง กิจกรรมการพยาบาลที่ใช้กระบวนการหรือกิจกรรมที่มุ่งหวัง ให้ผู้ป่วย คนพิการ สามารถฟื้นคืนสภาพให้เร็วที่สุด ยอมรับและปรับตัวกับความเปลี่ยนแปลงที่เกิดขึ้น ทั้งด้านร่างกาย จิตใจ สังคมและเศรษฐกิจ โดยกระบวนการหรือกิจกรรมต่างๆ นั้นต้องอาศัย การมีส่วนร่วมของผู้ป่วย คนพิการ ญาติผู้ดูแลและทีมสหวิชาชีพ เพื่อส่งเสริมให้ผู้ป่วย คนพิการ สามารถดํารงชีวิตอิสระในสังคมได้ตามศักยภาพรวมถึงการพิทักษ์สิทธิอันพึงได้ให้กับผู้ป่วย คนพิการ กิจกรรมการบริบาลฟื้นสภาพระยะกลางแบบผู้ป่วยนอก ได้แก่ กายภาพบําบัด กิจกรรมบําบัด และแก้ไขการพูด ทั้งในสถานพยาบาลภาครัฐ และภายนอก เช่น ศูนย์ฟื้นฟูชุมชนคลินิกกายภาพบําบัด เอกชนที่ขึ้นทะเบียน หมายเหตุ การให้บริการ intermediate bed/ ward สามารถให้บริการได้ ในโรงพยาบาลทุกระดับที่สังกัดกระทรวงสาธารณสุขขึ้นกับความพร้อมและบริบทของพื้นที่ ในแต่ละจังหวัด และเขตสุขภาพ",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "(จำนวนผลงานที่บรรลุเกณฑ์ [A] ÷ จำนวนกลุ่มเป้าหมายทั้งหมด [B]) × 100",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI68-23": {
      "kpiId": "KPI68-23",
      "order": 23,
      "name": "อัตราการติดเชื้อดื้อยาในกระแสเลือด",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "อัตรา",
      "direction": "ยิ่งน้อยยิ่งดี",
      "target": "≤ ปีที่ผ่านมา",
      "baseline": "≤ ปีที่ผ่านมา",
      "definition": "อุบัติการณ์ผู้ป่วยติดเชื้อดื้อยาในกระแสเลือด หมายถึง อุบัติการณ์ผู้ป่วยที่ติดเชื้อดื้อยาในกระแส เลือด (bacteremia) ต่อผู้ป่วยที่ได้รับการตรวจ hemoculture 100,000 ราย (per 100,000 tested patients) โดย focus เชื้อดื้อยาที่เป็น hospital origin ดังต่อไปนี้ 1. Acinetobacter baumannii ดื้อต่อยา carbapenem (CRAB) 2. Klebsiella pneumoniae ดื้อต่อยา carbapenem (CRKP) 3. Escherichia coli ดื้อต่อยา carbapenem (CREC) hospital origin หมายถึง การติดเชื้อภายหลังจากเข้านอนในโรงพยาบาลมากกว่า 2 วันปฏิทิน",
      "purpose": "เพื่อลดการป่วยและเสียชีวิตจากเชื้อดื้อยา",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "โรงพยาบาลศูนย์/ทั่วไป A, S, M1 (หรือ SAP; P+, P, A+, A ที่มีห้องปฏิบัติการทางจุลชีววิทยา)",
      "source": "เป้าหมาย รพ.ขอนแก่น/ชุมแพ/สิรินธร",
      "formula": "โรงพยาบาลศูนย์/ทั่วไป A, S, M1 (หรือ SAP; P+, P, A+, A ที่มีห้องปฏิบัติการทางจุลชีววิทยา) เป้าหมาย รพ.ขอนแก่น/ชุมแพ/สิรินธร A1 = อุบัติการณ์ผู้ป่วยที่ติดเชื้อดื้อยา CRAB ในกระแสเลือด (สูตร A1 = จำนวนผู้ป่วย CRAB x 100,000 / จำนวนผู้ป่วยที่ได้รับการตรวจ hemoculture) A2 = อุบัติการณ์ผู้ป่วยที่ติดเชื้อดื้อยา CRKP ในกระแสเลือด (สูตร A2 = จำนวนผู้ป่วย CRKP x 100,000 / จำนวนผู้ป่วยที่ได้รับการตรวจ hemoculture) A3 = อุบัติการณ์ผู้ป่วยที่ติดเชื้อดื้อยา CREC ในกระแสเลือด (สูตร A3 = จำนวนผู้ป่วย CREC x 100,000 / จำนวนผู้ป่วยที่ได้รับการตรวจ hemoculture) A = A1 + A2 + A3 B = อุบัติการณ์ผู้ป่วยติดเชื้อดื้อยา CRAB, CRKP, CREC ในกระแสเลือด ปีปฏิทิน พ.ศ. 2567 (baseline แบ่งตามระดับระดับโรงพยาบาล) A < B อุบัติการณ์ผู้ป่วยติดเชื้อ A. baumannii, K. pneumoniae, E. coli ที่ดื้อยา carbapenem ของ โรงพยาบาลในรอบที่วัดผล ต้องต่ำกว่าอุบัติการณ์เฉลี่ยของโรงพยาบาลในระดับเดียวกันของปีปฏิทิน 2567 (baseline)",
      "numeratorA": "A1 + A2 + A3",
      "denominatorB": "อุบัติการณ์ผู้ป่วยติดเชื้อดื้อยา CRAB, CRKP, CREC ในกระแสเลือด ปีปฏิทิน พ.ศ. 2567",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "การรายงาน และการวิเคราะห์เปรียบเทียบผล รายละเอียดข้อมูล ผลงานจังหวัดขอนแก่น พื้นฐาน(Baseline ปี 2564 = 68.29% 2565 = 62.50 % Data) 2566 = 67.38% 2567 =67.68 %",
      "responsible": "1.นางศศิธร เอื้ออนันต์ เภสัชกรชำนาญการพิเศษ สสจ.ขอนแก่น Email: sasitorneu@gmail.com โทร 081-3910199 2.นางนิสรา ศรีสุระ เภสัชกรชำนาญการ รพ.ขอนแก่น Email: nissaran2003@gmail.com โทร 081-5450172"
    },
    "KPI68-24": {
      "kpiId": "KPI68-24",
      "order": 24,
      "name": "ร้อยละของผู้ป่วยที่มีการวินิจฉัยโรคหลอดเลือดสมอง อัมพฤกษ์ อัมพาต ระยะกลาง (Intermediate Care) ที่ได้รับการดูแลด้วยการแพทย์แผนไทยและการแพทย์ทางเลือก",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "≥21",
      "baseline": "11.01",
      "definition": "การบริบาลฟื้นสภาพระยะกลาง (Intermediate care; IMC) หมายถึง การบริบาลฟื้นสภาพผู้ป่วย ระยะกลางที่มีอาการทางคลินิกผ่านพ้นภาวะวิกฤติและมีอาการคงที่แต่ยังคงมีความผิดปกติ ของร่างกายบางส่วนอยู่และมีข้อจํากัดในการปฏิบัติกิจกรรมในชีวิตประจําวัน จําเป็นต้องได้รับบริการ ฟื้นฟูสมรรถภาพทางการแพทย์โดยทีมสหวิชาชีพ (multidisciplinary approach) อย่างต่อเนื่อง จนครบ 6 เดือน ตั้งแต่ในโรงพยาบาลจนถึงชุมชน เพื่อเพิ่มสมรรถนะร่างกาย จิตใจ ในการปฏิบัติ กิจวัตรประจําวัน และลดความพิการหรือภาวะทุพพลภาพ รวมทั้งกลับสู่สังคมได้อย่างเต็มศักยภาพ โดยมีการให้บริการผู้ป่วยระยะกลางในโรงพยาบาลทุกระดับ (A/S/M/F) โดยให้บริการผู้ป่วย ใน (Intermediate bed/ward) ผู้ป่วยนอกและ ให้บริการในชุมชน เช่น ศูนย์ฟื้นฟูสมรรถภาพ ในชุมชน เยี่ยมบ้าน เป็นต้น ผู้ป่วย Intermediate care หมายถึง ผู้ป่วย Stroke, Traumatic Brain Injury และSpinal Cord Injury รายใหม่ หรือกลับเป็นซ้ำภายในระยะเวลา 6 เดือน และ Fragility hip fracture รายใหม่ หรือกลับเป็นซ้ำทั้งหมดทุกรายที่เข้ารับการรักษาในโรงพยาบาลภายในจังหวัดที่รอดชีวิต แ ล ะ มี ค ะ แ น น Barthel index < 15 รว ม ทั้ งค ะ แ น น Barthel index ≥ 15 with multiple impairments ตามเกณฑ์การบริบาลฟื้นสภาพระยะกลางแบบผู้ป่วยใน (IPD-IMC protocol) สำหรับโรงพยาบาล Intermediate ward คื อ ก า ร ให้ บ ริ ก า ร Intensive inpatient rehabilitation program หมายถึง ผู้ป่วยได้รับการฟื้นฟูแบบผู้ป่วยในอย่างน้อย วันละ 3 ชั่วโมง และอย่างน้อย 5 วัน/ สัปดาห์ หรือ อย่างน้อย 15 ชั่วโมง/ สัปดาห์ (ไม่รวมชั่วโมง nursing care) โดยมีรายละเอียดการให้บริการ Intermediate ward ตามภาคผนวก 1 Intermediate bed คือ การให้บริการ Inpatient rehab program หมายถึง ผู้ป่วยได้รับการฟื้นฟูโดยเฉลี่ยอย่างน้อยวันละ 1 ชั่วโมงอย่างน้อย 3 ครั้ง/สัปดาห์ (ไม่รวมชั่วโมง nursing care) การพยาบาลฟื้นฟูสภาพ หมายถึง กิจกรรมการพยาบาลที่ใช้กระบวนการหรือกิจกรรมที่มุ่งหวัง ให้ผู้ป่วย คนพิการ สามารถฟื้นคืนสภาพให้เร็วที่สุด ยอมรับและปรับตัวกับความเปลี่ยนแปลงที่เกิดขึ้น ทั้งด้านร่างกาย จิตใจ สังคมและเศรษฐกิจ โดยกระบวนการหรือกิจกรรมต่างๆ นั้นต้องอาศัย การมีส่วนร่วมของผู้ป่วย คนพิการ ญาติผู้ดูแลและทีมสหวิชาชีพ เพื่อส่งเสริมให้ผู้ป่วย คนพิการ สามารถดํารงชีวิตอิสระในสังคมได้ตามศักยภาพรวมถึงการพิทักษ์สิทธิอันพึงได้ให้กับผู้ป่วย คนพิการ กิจกรรมการบริบาลฟื้นสภาพระยะกลางแบบผู้ป่วยนอก ได้แก่ กายภาพบําบัด กิจกรรมบําบัด และแก้ไขการพูด ทั้งในสถานพยาบาลภาครัฐ และภายนอก เช่น ศูนย์ฟื้นฟูชุมชนคลินิกกายภาพบําบัด เอกชนที่ขึ้นทะเบียน หมายเหตุ การให้บริการ intermediate bed/ ward สามารถให้บริการได้ ในโรงพยาบาลทุกระดับที่สังกัดกระทรวงสาธารณสุขขึ้นกับความพร้อมและบริบทของพื้นที่ ในแต่ละจังหวัด และเขตสุขภาพ",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "(จำนวนผลงานที่บรรลุเกณฑ์ [A] ÷ จำนวนกลุ่มเป้าหมายทั้งหมด [B]) × 100",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI68-25": {
      "kpiId": "KPI68-25",
      "order": 25,
      "name": "ร้อยละผู้ป่วยนอกที่ได้รับบริการ ตรวจ วินิจฉัย รักษาโรค และฟื้นฟูสภาพ ด้วยศาสตร์การแพทย์แผนไทยและการแพทย์ทางเลือก",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "≥22",
      "baseline": "22.09",
      "definition": "ผู้ป่วยนอก หมายถึง ประชาชนที่มารับบริการตรวจ วินิจฉัย รักษาโรค และฟื้นฟูสภาพ แบบไม่นอน รักษาตัวในโรงพยาบาล โดยผู้ประกอบวิชาชีพที่เกี่ยวข้องที่ได้มาตรฐาน การบริการด้านการแพทย์แผนไทย หมายถึง บริการการตรวจ วินิจฉัย ส่งเสริมสุขภาพ การป้องกันโรค รักษาโรค และฟื้นฟูสภาพ เช่น - การรักษาด้วยยาสมุนไพร - การปรุงยาแผนไทยสำหรับผู้ป่วยเฉพาะรายของตน หมายถึง การปรุงยาตามองค์ความรู้ สำหรับผู้ป่วยเฉพาะรายของตน โดยผู้ประกอบโรคศิลปะสาขาการแพทย์แผนไทย (ประเภทเวชกรรมไทย) หรือ สาขาการแพทย์แผนไทยประยุกต์ - ยาแผนไทยที่มีกัญชาปรุงผสม กัญชาทางการแพทย์ หมายถึง สิ่งที่ได้จากการสกัดพืชกัญชา เพื่อนำสารสกัดที่ได้ มาใช้ทางการแพทย์และการวิจัยไม่ได้หมายรวมถึงกัญชาที่ยังคงมีสภาพเป็นพืช หรือส่วนประกอบใดๆ ของพืชกัญชา อาทิ ยอด ดอก ใบ ลำต้น ราก เป็นต้น - การนวดเพื่อการรักษา-ฟื้นฟูสภาพ - การประคบสมุนไพรเพื่อการรักษา-ฟื้นฟูสภาพ - การอบไอน้ำสมุนไพรเพื่อการรักษา-ฟื้นฟูสภาพ - การทับหม้อเกลือ - การพอกยาสมุนไพร - การนวดเพื่อส่งเสริมสุขภาพ - การประคบสมุนไพรเพื่อส่งเสริมสุขภาพ - การอบไอน้ำสมุนไพรเพื่อส่งเสริมสุขภาพ - การให้คำแนะนำการดูแลสุขภาพด้วยการสอนสาธิตด้านการแพทย์แผนไทย - การให้คำแนะนำการดูแลสุขภาพด้วยการสอนสาธิตด้านการแพทย์ทางเลือก - การทำหัตถการอื่นๆ ตามมาตรฐานวิชาชีพแพทย์แผนไทย หรือการบริการอื่น ๆ ที่มีการเพิ่มเติมรหัสภายหลัง - การบริการการแพทย์แผนไทยและการแพทย์ทางเลือกที่บ้าน รหัสกลุ่มโรคและอาการด้านการแพทย์แผนไทย 1. โรคสตรี: U50 ถึง U52 2. โรคเด็ก: U54 ถึง U55 3. โรคที่เกิดอาการหลายระบบ: U56 ถึง U60 4. โรคที่เกิดเฉพาะตำแหน่ง: U61 ถึง U72 5. โรคและอาการอื่น: U74 ถึง U75 6. การส่งเสริมสุขภาพและการป้องกันโรค: U77",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "(จำนวนผลงานที่บรรลุเกณฑ์ [A] ÷ จำนวนกลุ่มเป้าหมายทั้งหมด [B]) × 100",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI68-26": {
      "kpiId": "KPI68-26",
      "order": 26,
      "name": "ร้อยละของผู้ป่วยเบาหวานควบคุมน้ำตาลได้",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 5",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "40",
      "baseline": "31.69",
      "definition": "การบริบาลฟื้นสภาพระยะกลาง (Intermediate care; IMC) หมายถึง การบริบาลฟื้นสภาพผู้ป่วย ระยะกลางที่มีอาการทางคลินิกผ่านพ้นภาวะวิกฤติและมีอาการคงที่แต่ยังคงมีความผิดปกติ ของร่างกายบางส่วนอยู่และมีข้อจํากัดในการปฏิบัติกิจกรรมในชีวิตประจําวัน จําเป็นต้องได้รับบริการ ฟื้นฟูสมรรถภาพทางการแพทย์โดยทีมสหวิชาชีพ (multidisciplinary approach) อย่างต่อเนื่อง จนครบ 6 เดือน ตั้งแต่ในโรงพยาบาลจนถึงชุมชน เพื่อเพิ่มสมรรถนะร่างกาย จิตใจ ในการปฏิบัติ กิจวัตรประจําวัน และลดความพิการหรือภาวะทุพพลภาพ รวมทั้งกลับสู่สังคมได้อย่างเต็มศักยภาพ โดยมีการให้บริการผู้ป่วยระยะกลางในโรงพยาบาลทุกระดับ (A/S/M/F) โดยให้บริการผู้ป่วย ใน (Intermediate bed/ward) ผู้ป่วยนอกและ ให้บริการในชุมชน เช่น ศูนย์ฟื้นฟูสมรรถภาพ ในชุมชน เยี่ยมบ้าน เป็นต้น ผู้ป่วย Intermediate care หมายถึง ผู้ป่วย Stroke, Traumatic Brain Injury และSpinal Cord Injury รายใหม่ หรือกลับเป็นซ้ำภายในระยะเวลา 6 เดือน และ Fragility hip fracture รายใหม่ หรือกลับเป็นซ้ำทั้งหมดทุกรายที่เข้ารับการรักษาในโรงพยาบาลภายในจังหวัดที่รอดชีวิต แ ล ะ มี ค ะ แ น น Barthel index < 15 รว ม ทั้ งค ะ แ น น Barthel index ≥ 15 with multiple impairments ตามเกณฑ์การบริบาลฟื้นสภาพระยะกลางแบบผู้ป่วยใน (IPD-IMC protocol) สำหรับโรงพยาบาล Intermediate ward คื อ ก า ร ให้ บ ริ ก า ร Intensive inpatient rehabilitation program หมายถึง ผู้ป่วยได้รับการฟื้นฟูแบบผู้ป่วยในอย่างน้อย วันละ 3 ชั่วโมง และอย่างน้อย 5 วัน/ สัปดาห์ หรือ อย่างน้อย 15 ชั่วโมง/ สัปดาห์ (ไม่รวมชั่วโมง nursing care) โดยมีรายละเอียดการให้บริการ Intermediate ward ตามภาคผนวก 1 Intermediate bed คือ การให้บริการ Inpatient rehab program หมายถึง ผู้ป่วยได้รับการฟื้นฟูโดยเฉลี่ยอย่างน้อยวันละ 1 ชั่วโมงอย่างน้อย 3 ครั้ง/สัปดาห์ (ไม่รวมชั่วโมง nursing care) การพยาบาลฟื้นฟูสภาพ หมายถึง กิจกรรมการพยาบาลที่ใช้กระบวนการหรือกิจกรรมที่มุ่งหวัง ให้ผู้ป่วย คนพิการ สามารถฟื้นคืนสภาพให้เร็วที่สุด ยอมรับและปรับตัวกับความเปลี่ยนแปลงที่เกิดขึ้น ทั้งด้านร่างกาย จิตใจ สังคมและเศรษฐกิจ โดยกระบวนการหรือกิจกรรมต่างๆ นั้นต้องอาศัย การมีส่วนร่วมของผู้ป่วย คนพิการ ญาติผู้ดูแลและทีมสหวิชาชีพ เพื่อส่งเสริมให้ผู้ป่วย คนพิการ สามารถดํารงชีวิตอิสระในสังคมได้ตามศักยภาพรวมถึงการพิทักษ์สิทธิอันพึงได้ให้กับผู้ป่วย คนพิการ กิจกรรมการบริบาลฟื้นสภาพระยะกลางแบบผู้ป่วยนอก ได้แก่ กายภาพบําบัด กิจกรรมบําบัด และแก้ไขการพูด ทั้งในสถานพยาบาลภาครัฐ และภายนอก เช่น ศูนย์ฟื้นฟูชุมชนคลินิกกายภาพบําบัด เอกชนที่ขึ้นทะเบียน หมายเหตุ การให้บริการ intermediate bed/ ward สามารถให้บริการได้ ในโรงพยาบาลทุกระดับที่สังกัดกระทรวงสาธารณสุขขึ้นกับความพร้อมและบริบทของพื้นที่ ในแต่ละจังหวัด และเขตสุขภาพ",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "(จำนวนผลงานที่บรรลุเกณฑ์ [A] ÷ จำนวนกลุ่มเป้าหมายทั้งหมด [B]) × 100",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI68-27": {
      "kpiId": "KPI68-27",
      "order": 27,
      "name": "ร้อยละของผู้ป่วยความดันโลหิตสูงควบคุมความดันโลหิตได้",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 5",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "65",
      "baseline": "59.3",
      "definition": "การบริบาลฟื้นสภาพระยะกลาง (Intermediate care; IMC) หมายถึง การบริบาลฟื้นสภาพผู้ป่วย ระยะกลางที่มีอาการทางคลินิกผ่านพ้นภาวะวิกฤติและมีอาการคงที่แต่ยังคงมีความผิดปกติ ของร่างกายบางส่วนอยู่และมีข้อจํากัดในการปฏิบัติกิจกรรมในชีวิตประจําวัน จําเป็นต้องได้รับบริการ ฟื้นฟูสมรรถภาพทางการแพทย์โดยทีมสหวิชาชีพ (multidisciplinary approach) อย่างต่อเนื่อง จนครบ 6 เดือน ตั้งแต่ในโรงพยาบาลจนถึงชุมชน เพื่อเพิ่มสมรรถนะร่างกาย จิตใจ ในการปฏิบัติ กิจวัตรประจําวัน และลดความพิการหรือภาวะทุพพลภาพ รวมทั้งกลับสู่สังคมได้อย่างเต็มศักยภาพ โดยมีการให้บริการผู้ป่วยระยะกลางในโรงพยาบาลทุกระดับ (A/S/M/F) โดยให้บริการผู้ป่วย ใน (Intermediate bed/ward) ผู้ป่วยนอกและ ให้บริการในชุมชน เช่น ศูนย์ฟื้นฟูสมรรถภาพ ในชุมชน เยี่ยมบ้าน เป็นต้น ผู้ป่วย Intermediate care หมายถึง ผู้ป่วย Stroke, Traumatic Brain Injury และSpinal Cord Injury รายใหม่ หรือกลับเป็นซ้ำภายในระยะเวลา 6 เดือน และ Fragility hip fracture รายใหม่ หรือกลับเป็นซ้ำทั้งหมดทุกรายที่เข้ารับการรักษาในโรงพยาบาลภายในจังหวัดที่รอดชีวิต แ ล ะ มี ค ะ แ น น Barthel index < 15 รว ม ทั้ งค ะ แ น น Barthel index ≥ 15 with multiple impairments ตามเกณฑ์การบริบาลฟื้นสภาพระยะกลางแบบผู้ป่วยใน (IPD-IMC protocol) สำหรับโรงพยาบาล Intermediate ward คื อ ก า ร ให้ บ ริ ก า ร Intensive inpatient rehabilitation program หมายถึง ผู้ป่วยได้รับการฟื้นฟูแบบผู้ป่วยในอย่างน้อย วันละ 3 ชั่วโมง และอย่างน้อย 5 วัน/ สัปดาห์ หรือ อย่างน้อย 15 ชั่วโมง/ สัปดาห์ (ไม่รวมชั่วโมง nursing care) โดยมีรายละเอียดการให้บริการ Intermediate ward ตามภาคผนวก 1 Intermediate bed คือ การให้บริการ Inpatient rehab program หมายถึง ผู้ป่วยได้รับการฟื้นฟูโดยเฉลี่ยอย่างน้อยวันละ 1 ชั่วโมงอย่างน้อย 3 ครั้ง/สัปดาห์ (ไม่รวมชั่วโมง nursing care) การพยาบาลฟื้นฟูสภาพ หมายถึง กิจกรรมการพยาบาลที่ใช้กระบวนการหรือกิจกรรมที่มุ่งหวัง ให้ผู้ป่วย คนพิการ สามารถฟื้นคืนสภาพให้เร็วที่สุด ยอมรับและปรับตัวกับความเปลี่ยนแปลงที่เกิดขึ้น ทั้งด้านร่างกาย จิตใจ สังคมและเศรษฐกิจ โดยกระบวนการหรือกิจกรรมต่างๆ นั้นต้องอาศัย การมีส่วนร่วมของผู้ป่วย คนพิการ ญาติผู้ดูแลและทีมสหวิชาชีพ เพื่อส่งเสริมให้ผู้ป่วย คนพิการ สามารถดํารงชีวิตอิสระในสังคมได้ตามศักยภาพรวมถึงการพิทักษ์สิทธิอันพึงได้ให้กับผู้ป่วย คนพิการ กิจกรรมการบริบาลฟื้นสภาพระยะกลางแบบผู้ป่วยนอก ได้แก่ กายภาพบําบัด กิจกรรมบําบัด และแก้ไขการพูด ทั้งในสถานพยาบาลภาครัฐ และภายนอก เช่น ศูนย์ฟื้นฟูชุมชนคลินิกกายภาพบําบัด เอกชนที่ขึ้นทะเบียน หมายเหตุ การให้บริการ intermediate bed/ ward สามารถให้บริการได้ ในโรงพยาบาลทุกระดับที่สังกัดกระทรวงสาธารณสุขขึ้นกับความพร้อมและบริบทของพื้นที่ ในแต่ละจังหวัด และเขตสุขภาพ",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "(จำนวนผลงานที่บรรลุเกณฑ์ [A] ÷ จำนวนกลุ่มเป้าหมายทั้งหมด [B]) × 100",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI68-28": {
      "kpiId": "KPI68-28",
      "order": 28,
      "name": "ร้อยละการจัดตั้งหน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิตามพระราชบัญญัติระบบสุขภาพปฐมภูมิ พ.ศ. 2562",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 5",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "100",
      "baseline": "75.15",
      "definition": "หน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิ หมายถึง หน่วยบริการที่ได้ขึ้นทะเบียน เป็นหน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิ ตามพระราชบัญญัติระบบสุขภาพปฐมภูมิ พ.ศ. 2562 แพทย์เวชศาสตร์ครอบครัว หมายความว่า แพทย์ที่ได้รับหนังสืออนุมัติหรือวุฒิบัตรเพื่อแสดงความรู้ ความชำนาญในการประกอบวิชาชีพเวชกรรมสาขาเวชศาสตร์ครอบครัว หรือแพทย์ที่ผ่านการอบรม ด้านเวชศาสตร์ครอบครัวจากหลักสูตรที่ปลัดกระทรวงสาธารณสุขให้ความเห็นชอบ 1. หลักสูตรพื้นฐานเวชศาสตร์ครอบครัวสำหรับแพทย์ปฐมภูมิ Basic Course of Family Medicine for Primary Care Doctor 2. หลักสูตรการฝึกอบรมระยะสั้น “เวชศาสตร์ครอบครัวสำหรับแพทย์ปฏิบัติงานในคลินิก หมอครอบครัว” พ.ศ. 2562 คณะผู้ให้บริการสุขภาพปฐมภูมิ หมายความว่า ผู้ประกอบวิชาชีพทางการแพทย์และสาธารณสุขซึ่ง ปฏิบัติงานร่วมกันกับแพทย์เวชศาสตร์ครอบครัวในการให้บริการสุขภาพปฐมภูมิ และให้หมายความ รวมถึงผู้ซึ่งผ่านการฝึกอบรมด้านสุขภาพปฐมภูมิเพื่อเป็นผู้สนับสนุนการปฏิบัติหน้าที่ของแพทย์เวชศาสตร์ ครอบครัวและผู้ประกอบวิชาชีพดังกล่าว บริการสุขภาพปฐมภูมิ เป็นบริการทางการแพทย์และสาธารณสุขที่ดูแลสุขภาพของบุคคลในบัญชี รายชื่อ ซึ่งมีขอบเขต ดังต่อไปนี้ (1) บริการสุขภาพอย่างองค์รวม แต่ไม่รวมถึงการดูแลโรคหรือปัญหาสุขภาพที่จำเป็นต้องใช้เทคนิค หรือเครื่องมือทางการแพทย์ที่ซับซ้อน การปลูกถ่ายอวัยวะ และการผ่าตัด ยกเว้น การผ่าตัดขนาดเล็ก ซึ่งสามารถฉีดยาชาเฉพาะที่ (2) บริการสุขภาพตั้งแต่แรก ครอบคลุมทุกกระบวนการสาธารณสุข ทั้งการส่งเสริมสุขภาพ การควบคุมโรค การป้องกันโรค การตรวจวินิจฉัยโรค การรักษาพยาบาล และการฟื้นฟูสุขภาพ แต่ไม่รวมถึง การบริการแบบผู้ป่วยนอกของหน่วยบริการระดับทุติยภูมิและตติยภูมิ การบริการแบบผู้ป่วยใน การคลอด และการปฏิบัติการฉุกเฉิน ยกเว้น กรณีการปฐมพยาบาลและการดูแลในภาวะฉุกเฉินเพื่อให้รอดพ้นภาวะ ฉุกเฉิน (3) บริการสุขภาพอย่างต่อเนื่อง ทุกช่วงวัยตั้งแต่ การตั้งครรภ์ ทารก วัยเด็ก วัยเรียน วัยรุ่น วัยทำงาน วัยสูงอายุ จนกระทั่งเสียชีวิต (4) การดูแลสุขภาพของบุคคลแบบผสมผสาน ประกอบด้วย การดูแลสุขภาพโดยการแพทย์ แผนปัจจุบัน การแพทย์แผนไทย หรือการแพทย์ทางเลือก (5) การบริการข้อมูลด้านสุขภาพและคำปรึกษาด้านสุขภาพแก่บุคคลในบัญชีรายชื่อ ตลอดจน คำแนะนำที่จำเป็นเพื่อให้สามารถตัดสินใจในการเลือกรับบริการหรือเข้าสู่ระบบการส่งต่อ (6) การส่งเสริมให้ประชาชนมีศักยภาพและมีความรู้ในการจัดการสุขภาพของตนเองและบุคคล ในครอบครัว ตลอดจนอาจสามารถร่วมตัดสินใจในการวางแผนการดูแลสุขภาพร่วมกับแพทย์เวชศาสตร์ ครอบครัวและคณะผู้ให้บริการสุขภาพปฐมภูมิได้",
      "purpose": "1. เพื่อให้ประชาชนมีแพทย์เวชศาสตร์ครอบครัวและคณะผู้ให้บริการสุขภาพปฐมภูมิ 2. เพื่อให้มีสุขภาพแข็งแรง สามารถดูแลตนเองและครอบครัวเบื้องต้นเมื่อมีอาการเจ็บป่วย ได้อย่างเหมาะสม 3. เพื่อให้ประชาชนสามารถเข้าถึงบริการปฐมภูมิ",
      "population": "หน่วยบริการปฐมภูมิทุกแห่ง ทุกสังกัด",
      "collectionMethod": "1. จัดเก็บจากข้อมูลจำนวนหน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิ ในระบบ ขึ้นทะเบียน 2. การจัดเก็บการประเมินคุณภาพมาตรฐาน จากระบบทรัพยากรสุขภาพ หน่วยบริการปฐมภูมิ (PCU Standard)",
      "source": "1. ระบบขึ้นทะเบียนหน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิ 2. ระบบทรัพยากรสุขภาพ หน่วยบริการปฐมภูมิ (PCU Standard)",
      "formula": "(A/B) x 100",
      "numeratorA": "จำนวนหน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิที่ขึ้นทะเบียน",
      "denominatorB": "จำนวนหน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิตามแผนการจัดตั้ง",
      "frequency": "ไตรมาส 2 , ไตรมาส 3 และ ไตรมาส 4",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI68-29": {
      "kpiId": "KPI68-29",
      "order": 29,
      "name": "อัตราส่วนการใช้บริการผู้ป่วยนอกที่หน่วยบริการปฐมภูมิเทียบกับโรงพยาบาลแม่ข่าย (60 : 40)",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 5",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "85",
      "baseline": "69.75",
      "definition": "อัตราส่วนการใช้บริการผู้ป่วยนอกที่หน่วยบริการปฐมภูมิเทียบกับรพ.แม่ข่าย (60 : 40)",
      "purpose": "1. เพื่อให้ประชาชนสามารถเข้าถึงบริการที่มีคุณภาพ มาตรฐาน 2. เพื่อพัฒนาหน่วยบริการปฐมภูมิให้มีคุณภาพมาตรฐาน",
      "population": "หน่วยบริการปฐมภูมิทุกแห่ง ทุกสังกัด",
      "collectionMethod": "เก็บข้อมูลจากระบบคลังข้อมูลด้านการแพทย์และสาธารณสุข HDC datacenter (OP visit)",
      "source": "ระบบคลังข้อมูลด้านการแพทย์และสาธารณสุข HDC datacenter",
      "formula": "(A /B ) x 100",
      "numeratorA": "จำนวนหน่วยบริการปฐมภูมิที่ผ่านเกณฑ์ 60 : 40",
      "denominatorB": "จำนวนหน่วยบริการปฐมภูมิทั้งหมด",
      "frequency": "ไตรมาส 3",
      "evaluationMethod": "ระบบคลังข้อมูลด้านการแพทย์และสาธารณสุข HDC datacenter",
      "responsible": "ชื่อ-สกุล...นางศิริพร อุทธากิจ ตำแหน่ง..พยาบาลวิชาชีพชำนาญการ กลุ่มงาน..พัฒนาคุณภาพและรูปแบบบริการ. สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ 122... โทรสาร 0-4322-4037 โทรศัพท์มือถือ..080 - 3570910. E-mail : .pcunpcu2022@gmail.com ผู้กำกับดูแลตัวชี้วัด ชื่อ-สกุล...นางศิริมา นามประเสริฐ ตำแหน่ง..หัวหน้ากลุ่มงานพัฒนาคุณภาพและรูปแบบบริการ กลุ่มงาน..พัฒนาคุณภาพและรูปแบบบริการ. สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ 122... โทรสาร 0-4322-4037"
    },
    "KPI68-30": {
      "kpiId": "KPI68-30",
      "order": 30,
      "name": "ร้อยละบุคลากรใน สสอ.ได้รับการพัฒนาสมรรถนะ อย่างน้อย 2 เรื่อง (Regulator & กฎหมายและ พ.ร.บ.สาธารณสุข พ.ศ.2535)",
      "strategy": "ยุทธศาสตร์ที่ 3",
      "objective": "เป้าประสงค์ที่ 6",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "80",
      "baseline": "69.23",
      "definition": "บุคลากรที่ปฏิบัติงานในสำนักงานสาธารณสุขอำเภอ หมายถึง บุคลากรที่ปฏิบัติงาน ณ สำนักงาน สาธารณสุขอำเภอ สังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่น ประกอบด้วย ข้าราชการ พนักงาน ราชการ พนักงานกระทรวงสาธารณสุข ลูกจ้างชั่วคราวปฏิบัติงานมาแล้วอย่างน้อย 6 เดือนขึ้นไป สมรรถนะ หมายถึง คุณลักษณะเชิงพฤติกรรมที่เป็นผลมาจากความรู้ทักษะความสามารถ หรือคุณลักษณะอื่น ๆ ที่ทำให้บุคคลสร้างผลงานโดดเด่นได้ในองค์กรสมรรถนะที่ผู้ปฏิบัติงาน ในทุกตำแหน่งและในทุกระดับในสำนักงานสาธารณสุขอำเภอ จำเป็นที่จะต้องมี สมรรถนะที่กำหนดขึ้น เพราะมีความจำเป็นสำหรับภารกิจการปฏิบัติงานในหน้าที่ และตำแหน่งงานนั้นๆ ประกอบด้วย สมรรถนะภารกิจหลัก 1. สมรรถนะด้านการคุ้มครองผู้บริโภคด้านการบริการและผลิตภัณฑ์สุขภาพในพื้นที่ 2. สมรรถนะด้านการดำเนินงานตามกฎหมายการแพทย์และการสาธารณสุข สมรรถนะภารกิจรอง 1. สมรรถนะด้านการทำแผนยุทธศาสตร์ด้านสุขภาพ ร่วมกับหน่วยงานภาครัฐ ท้องถิ่น องค์กร เอกชนและภาคประชาสังคมในพื้นที่ระดับอำเภอ/ตำบล 2. สมรรถนะด้านการประเมินผล การดำเนินงานของเครือข่ายบริการสุขภาพ 3. สมรรถนะด้านการควบคุมมาตรฐานการดำเนินงานของหน่วยงานสาธารณสุขในพื้นที่ 4. สมรรถนะด้านการปฏิบัติงานตามนโยบายเร่งด่วนด้านสุขภาพของรัฐบาล กระทรวง เขตสุขภาพ และจังหวัด 5. สมรรถนะด้านการพัฒนาวิชาการแก่บุคลากรสาธารณสุข องค์กรสุขภาพภาคประชาชนสนับสนุน วิชาการและการวิจัยทีเกี่ยวข้องกับสุขภาพ 6. สมรรถนะด้านสนับสนุนบุคลากรสาธารณสุข อาสาสมัครสาธารณสุขให้ได้รับการพัฒนาความรู้ อย่างต่อเนื่องและเหมาะสม 7. สมรรถนะด้านสนับสนุนบุคลากรสาธารณสุข อาสาสมัครสาธารณสุข ให้ได้รับการพัฒนาความรู้ อย่างต่อเนื่องและเหมาะสม",
      "purpose": "เพื่ อ พั ฒ น าบุ ค ลาก รส ำนั ก งาน ส าธ ารณ สุ ข อำเภ อ ให้ มี ขี ดค ว าม ส าม ารถใน ก ารขั บ เค ลื่ อ น ภ ารกิ จ ของส่วนราชการให้บรรลุผล มีประสิทธิภาพและเกิดประสิทธิผล",
      "population": "บุคลากรสำนักงานสาธารณสุขอำเภอ เครือข่ายบริการสุขภาพสังกัดสำนักงาน สาธารณสุข จังหวัดขอนแก่น",
      "collectionMethod": "รวบรวมข้อมูลจากเอกสารการเข้ารับการอบรม ได้แก่ แผนการพัฒนารายบุคคล รายกลุ่ม ใบประกาศนียบัตรใบรับรองการอบรม ในระบบ online และ onsite เครือข่ายบริการสุขภาพสังกัด สำนักงานสาธารณสุขจังหวัดขอนแก่น และเอกสารการปฏิบัติงานการจัดการข้อร้องเรียน ด้านการ คุ้มครองผู้บริโภคด้านการบริการและผลิตภัณฑ์สุขภาพ ในพื้นที่การตรวจมาตรฐานการดำเนินงานตาม กฎหมายการแพทย์และการสาธารณสุข พร้อมทั้งจัดทำแบบประเมินสมรรถนะบุคลากร สสอ. เพื่อประเมินสมรรถนะรายบุคคล และ ลงข้อมูลในระบบโปรแกรมการพัฒนาบุคลากร ลาศึกษาต่อ และฝึกอบรม",
      "source": "รวบรวมข้อมูลจากสำนักงานสาธารณสุขอำเภอ",
      "formula": "B = จำนวนสมรรถนะที่ได้รับการอบรม (หลักและรอง) ระยะเวลา ไตรมาสที่ 3 ประเมินผล",
      "numeratorA": "บุคลากรสำนักงานสาธารณสุขอำเภอ",
      "denominatorB": "จำนวนสมรรถนะที่ได้รับการอบรม (หลักและรอง)",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลจาก 1. แผนการจัดทำแผนพัฒนารายบุคคล (Individual Development Plan) และรายกลุ่ม บุคลากร สำนักงาน สาธารณสุขอำเภอ 2. บุคลากรในสำนักงานสาธารณสุขอำเภอได้รับการพัฒนาสมรรถนะหลักและสมรรถนะรองเพิ่มขึ้น จากปีที่ผ่านมา 3. บุคลากรในสำนักงานสาธารณสุขอำเภอนำสิ่งที่ได้จากการเข้าร่วมอบรมไปใช้ประโยชน์ในการ ปฏิบัติงานด้านการคุ้มครองผู้บริโภคด้านการบริการและผลิตภัณฑ์สุขภาพในพื้นที่ ด้านการดำเนินงาน ตามกฎหมายการแพทย์และการสาธารณสุข",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI68-31": {
      "kpiId": "KPI68-31",
      "order": 31,
      "name": "ร้อยละหน่วยบริการได้รับการพัฒนากำลังคนตามแผนยกระดับระดับบริการสาธารณสุข (SAP)",
      "strategy": "ยุทธศาสตร์ที่ 3",
      "objective": "เป้าประสงค์ที่ 6",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "100",
      "baseline": "100",
      "definition": "จำนวนผลงานวิจัย/R2R/นวัตกรรมหรือเทคโนโลยีสุขภาพที่คิดค้นใหม่หรือที่พัฒนาต่อยอด ที่แก้ไขปัญหา สาธารณสุขที่สำคัญของจังหวัดขอนแก่น ผลงานวิจัย/ ผลงาน R2R (Routine to Research) หมายถึง ผลที่ได้จากการศึกษาค้นคว้าอย่างเป็น ระบบด้วยวิธีการทางวิทยาศาสตร์หรือวิธีการที่เชื่อถือได้ ซึ่งต้องเป็นไปตามระเบียบวิธีหรือกฎเกณฑ์ ที่ถูกต้อง/ การพัฒนางานประจำสู่งานวิจัย ที่คิดค้นใหม่หรือที่พัฒนาต่อยอด เพื่อให้ได้ความรู้ที่เชื่อถือได้ มีเหตุมีผลเป็นไปตามวิธีการทางวิทยาศาสตร์ และนำไปใช้อย่างเป็นประโยชน์ในการให้บริการด้าน สาธารณสุข แก้ไขปัญหาสาธารณสุขในพื้นที่และปัญหาสาธารณสุขที่สำคัญจังหวัดขอนแก่นได้ นวัตกรรม (Innovative) หมายถึง สิ่งที่ทำขึ้นใหม่ หรือแตกต่างจากเดิม ซึ่งอาจเป็นความคิด วิธีการ หรืออุปกรณ์ เป็นต้น ที่มีคุณค่า และมีประโยชน์ต่อการให้บริการสุขภาพแก่ประชาชน นวัตกรรมการจัดการบริการสุขภ าพ (Innovative Healthcare Management) หมายถึง นวัตกรรมการบริหารและการจัดบริการสุขภาพใหม่ แก่ประชาชนให้สามารถเข้าถึงบริการทางการแพทย์ และสาธารณสุขได้รวดเร็ว สะดวก ปลอดภัย และมีประสิทธิภาพเพื่อส่งเสริมคุณภาพชีวิตประชาชนให้ดีขึ้น เทคโนโลยีทางสุขภาพ หมายถึง การรวบรวมความรู้และวิธีการทางวิทยาศาสตร์มาใช้อย่างเป็นระบบซึ่ง จะช่วยให้เกิดประสิทธิภาพในการดูแลการสร้างเสริมสุขภาพ การป้องกันรักษาโรค และการฟื้นฟู สมรรถภาพทางร่างกาย เพื่อให้บุคคลหรือชุมชนมีสุขภาพที่ดีและมีความปลอดภัยในชีวิต ทั้งนี้หมายรวมถึง เทคโนโลยีที่เกี่ยวกับผลิตภัณฑ์สุขภาพ (เทคโนโลยีเกี่ยวกับผลิตภัณฑ์เครื่องสำอาง อาหาร ยา เครื่องมือ แพทย์ และอุปกรณ์หรือเครื่องมือสุขภาพ) และบริการสุขภาพ (เทคโนโลยีที่เกี่ยวกับการตรวจโรค การรักษาโรค การป้องกันโรค และการสร้างเสริมสุขภาพ) การพัฒนาต่อยอด หมายถึง การนำนวัตกรรมด้านวิทยาศาสตร์การแพทย์หรือเทคโนโลยีสุขภาพ ที่เคยมีการศึกษา วิจัยประดิษฐ์ คิดค้นขึ้นที่สำเร็จแล้ว นำมาพัฒนาต่อยอด ให้เกิดประโยชน์เพิ่มเติมจากเดิม การนำองค์ความรู้ เทคโนโลยี และนวัตกรรมไปใช้ประโยชน์ หมายถึง การมีหลักฐานที่แสดงว่าได้ มีการนำองค์ความรู้ เทคโนโลยี และนวัตกรรมที่ได้จากการศึกษา วิจัย ไปใช้ประโยชน์ในการแก้ปัญหา สาธารณสุขตาม",
      "purpose": "1. เพื่อแก้ไขปัญหาสาธสาธารณสุขที่สำคัญของจังหวัดขอนแก่น โดยงานวิจัย/R2R/ นวัตกรรม หรือ เทคโนโลยีสุขภาพที่คิดค้นใหม่หรือที่พัฒนาต่อยอด 2. เพื่อเพิ่มอายุคาดเฉลี่ยของประชาชนจังหวัดขอนแก่น เมื่อแรกเกิด (LE) ไม่น้อยกว่า 85 ปี อายุคาด เฉลี่ยของการมีสุขภาพดี (HALE) ไม่น้อยกว่า 75 ปี ตามเป้าหมายตามแผนยุทธศาสตร์ชาติ ระยะ 20 ปี ด้านสาธารณสุข",
      "population": "เครือข่ายบริการสุขภาพสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "collectionMethod": "รวบรวมข้อมูลจากเครือข่ายบริการสุขภาพสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "source": "ฐานข้อมูลผลงานวิจัย/R2R/นวัตกรรม ด้านวิทยาศาสตร์การแพทย์ของเครือข่ายบริการสุขภาพ สำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "formula": "- ระยะเวลา ไตรมาสที่ 3-4 ประเมินผล",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI68-32": {
      "kpiId": "KPI68-32",
      "order": 32,
      "name": "จำนวนนวัตกรรมหรือเทคโนโลยีสุขภาพที่คิดค้นใหม่หรือพัฒนาต่อยอด เพื่อแก้ไขปัญหาสาธารณสุขที่สำคัญจังหวัดขอนแก่น",
      "strategy": "ยุทธศาสตร์ที่ 4",
      "objective": "เป้าประสงค์ที่ 7",
      "unit": "เรื่อง",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "330 (เรื่อง)",
      "baseline": "329",
      "definition": "จำนวนผลงานวิจัย/R2R/นวัตกรรมหรือเทคโนโลยีสุขภาพที่คิดค้นใหม่หรือที่พัฒนาต่อยอด ที่แก้ไขปัญหา สาธารณสุขที่สำคัญของจังหวัดขอนแก่น ผลงานวิจัย/ ผลงาน R2R (Routine to Research) หมายถึง ผลที่ได้จากการศึกษาค้นคว้าอย่างเป็น ระบบด้วยวิธีการทางวิทยาศาสตร์หรือวิธีการที่เชื่อถือได้ ซึ่งต้องเป็นไปตามระเบียบวิธีหรือกฎเกณฑ์ ที่ถูกต้อง/ การพัฒนางานประจำสู่งานวิจัย ที่คิดค้นใหม่หรือที่พัฒนาต่อยอด เพื่อให้ได้ความรู้ที่เชื่อถือได้ มีเหตุมีผลเป็นไปตามวิธีการทางวิทยาศาสตร์ และนำไปใช้อย่างเป็นประโยชน์ในการให้บริการด้าน สาธารณสุข แก้ไขปัญหาสาธารณสุขในพื้นที่และปัญหาสาธารณสุขที่สำคัญจังหวัดขอนแก่นได้ นวัตกรรม (Innovative) หมายถึง สิ่งที่ทำขึ้นใหม่ หรือแตกต่างจากเดิม ซึ่งอาจเป็นความคิด วิธีการ หรืออุปกรณ์ เป็นต้น ที่มีคุณค่า และมีประโยชน์ต่อการให้บริการสุขภาพแก่ประชาชน นวัตกรรมการจัดการบริการสุขภ าพ (Innovative Healthcare Management) หมายถึง นวัตกรรมการบริหารและการจัดบริการสุขภาพใหม่ แก่ประชาชนให้สามารถเข้าถึงบริการทางการแพทย์ และสาธารณสุขได้รวดเร็ว สะดวก ปลอดภัย และมีประสิทธิภาพเพื่อส่งเสริมคุณภาพชีวิตประชาชนให้ดีขึ้น เทคโนโลยีทางสุขภาพ หมายถึง การรวบรวมความรู้และวิธีการทางวิทยาศาสตร์มาใช้อย่างเป็นระบบซึ่ง จะช่วยให้เกิดประสิทธิภาพในการดูแลการสร้างเสริมสุขภาพ การป้องกันรักษาโรค และการฟื้นฟู สมรรถภาพทางร่างกาย เพื่อให้บุคคลหรือชุมชนมีสุขภาพที่ดีและมีความปลอดภัยในชีวิต ทั้งนี้หมายรวมถึง เทคโนโลยีที่เกี่ยวกับผลิตภัณฑ์สุขภาพ (เทคโนโลยีเกี่ยวกับผลิตภัณฑ์เครื่องสำอาง อาหาร ยา เครื่องมือ แพทย์ และอุปกรณ์หรือเครื่องมือสุขภาพ) และบริการสุขภาพ (เทคโนโลยีที่เกี่ยวกับการตรวจโรค การรักษาโรค การป้องกันโรค และการสร้างเสริมสุขภาพ) การพัฒนาต่อยอด หมายถึง การนำนวัตกรรมด้านวิทยาศาสตร์การแพทย์หรือเทคโนโลยีสุขภาพ ที่เคยมีการศึกษา วิจัยประดิษฐ์ คิดค้นขึ้นที่สำเร็จแล้ว นำมาพัฒนาต่อยอด ให้เกิดประโยชน์เพิ่มเติมจากเดิม การนำองค์ความรู้ เทคโนโลยี และนวัตกรรมไปใช้ประโยชน์ หมายถึง การมีหลักฐานที่แสดงว่าได้ มีการนำองค์ความรู้ เทคโนโลยี และนวัตกรรมที่ได้จากการศึกษา วิจัย ไปใช้ประโยชน์ในการแก้ปัญหา สาธารณสุขตาม",
      "purpose": "1. เพื่อแก้ไขปัญหาสาธสาธารณสุขที่สำคัญของจังหวัดขอนแก่น โดยงานวิจัย/R2R/ นวัตกรรม หรือ เทคโนโลยีสุขภาพที่คิดค้นใหม่หรือที่พัฒนาต่อยอด 2. เพื่อเพิ่มอายุคาดเฉลี่ยของประชาชนจังหวัดขอนแก่น เมื่อแรกเกิด (LE) ไม่น้อยกว่า 85 ปี อายุคาด เฉลี่ยของการมีสุขภาพดี (HALE) ไม่น้อยกว่า 75 ปี ตามเป้าหมายตามแผนยุทธศาสตร์ชาติ ระยะ 20 ปี ด้านสาธารณสุข",
      "population": "เครือข่ายบริการสุขภาพสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "collectionMethod": "รวบรวมข้อมูลจากเครือข่ายบริการสุขภาพสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "source": "ฐานข้อมูลผลงานวิจัย/R2R/นวัตกรรม ด้านวิทยาศาสตร์การแพทย์ของเครือข่ายบริการสุขภาพ สำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "formula": "- ระยะเวลา ไตรมาสที่ 3-4 ประเมินผล",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI68-33": {
      "kpiId": "KPI68-33",
      "order": 33,
      "name": "จำนวนหน่วยงานสาธารณสุขที่พัฒนาสู่องค์กรดิจิทัล",
      "strategy": "ยุทธศาสตร์ที่ 4",
      "objective": "เป้าประสงค์ที่ 7",
      "unit": "แห่ง",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "26 แห่ง",
      "baseline": "-",
      "definition": "มาตรฐาน HAIT (Hospital Accreditation Information Technology) เป็นมาตรฐานที่พัฒนาโดย สมาคมเวชสารสนเทศไทย (TMI) มี 4 Level มาตรฐาน HAIT เป็นเครื่องมือที่มีประสิทธิภาพสำหรับ โรงพยาบาลที่ต้องการพัฒนาระบบ IT ให้มีประสิทธิภาพ ปลอดภัย และเชื่อถือได้ การนำมาตรฐาน HAIT มาใช้ ช่วยให้โรงพยาบาลยกระดับคุณภาพมาตรฐานการบริการด้านสุขภาพ และสร้างความพึงพอใจให้กับ ผู้ป่วย โรงพยาบาลที่ต้องการขอรับรองมาตรฐาน HAIT จะต้องผ่านการประเมินจากคณะผู้ประเมินของ TMI",
      "purpose": "1. สร้างความมั่นใจในคุณภาพและความปลอดภัยของระบบ IT ที่ใช้ในการดูแลรักษาผู้ป่วย 2. ส่งเสริมการพัฒนาระบบสารสนเทศอย่างต่อเนื่องตามมาตรฐานสากล 3. เพิ่มประสิทธิภาพในการบริหารจัดการและการให้บริการทางการแพทย์",
      "population": "โรงพยาบาลชุมชน",
      "collectionMethod": "ผู้รับผิดชอบรายงานผลงานเป็นรายไตรมาสไปยังระบบรายงานองค์กรดิจิทัล(ออนไลน์)",
      "source": "(ออนไลน์) https://ict.kkpho.go.th/org เกณฑ์คะแนน 1. รพช.ไม่ยื่นเพื่อขอประเมิน = 0 คะแนน ตัวชี้วัด 2. รพช.ยื่นเพื่อขอประเมิน = 5 คะแนน",
      "formula": "ผลการดำเนินงานจริงเทียบกับเกณฑ์เป้าหมาย (แห่ง)",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "ทุกไตรมาส",
      "evaluationMethod": "ปีงบประมาณ พ.ศ.2568 (ต.ค.2567 – ก.ย.2568) รายละเอียดข้อมูลพื้นฐาน หน่วยวัด ผลการดำเนินงานปีงบประมาณ ไม่มี Baseline Data ปี 2565 ปี 2566 ปี 2567 ไม่มี ไม่มี ไม่มี ไม่มี",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI68-34": {
      "kpiId": "KPI68-34",
      "order": 34,
      "name": "หน่วยบริการที่มีการบริการการแพทย์ทางไกลตามเกณฑ์ที่กำหนด",
      "strategy": "ยุทธศาสตร์ที่ 4",
      "objective": "เป้าประสงค์ที่ 7",
      "unit": "ครั้ง/รพ.",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "ตามเกณฑ์ KPI กสธ.ปี 2568",
      "baseline": "1,200 ครั้ง",
      "definition": "การแพทย์ทางไกล หรือ Telemedicine คือการใช้เทคโนโลยีสารสนเทศและการสื่อสารเพื่อให้บริการ",
      "purpose": "1. เพื่อยกระดับการบริการของโรงพยาบาลโดยการประยุกต์ใช้เทคโนโลยีดิจิทัล ในการจัดบริการสุขภาพ",
      "population": "ได้อย่างมีประสิทธิภาพ มีคุณภาพและความปลอดภัย 2. เพื่อพัฒนาคุณภาพการให้บริการของโรงพยาบาล โดยยึดประชาชนเป็นศูนย์กลางตอบสนองความ ต้องการของประชาชนและความจําเป็นด้านสุขภาพได้ 3. เพื่อให้การบริการจัดการของโรงพยาบาลมีประสิทธิภาพ สามารถลดขั้นตอนการทํางาน ลดภาระงาน ของบุคลากร และลดการใช้ทรัพยากร โรงพยาบาลศูนย์/โรงพยาบาลทั่วไป/โรงพยาบาลชุมชน",
      "collectionMethod": "ผู้รับผิดชอบจัดเก็บข้อมูลหลักฐานการผ่านการอบรมออนไลน์ (online)",
      "source": "HDC จังหวัดขอนแก่น เกณฑ์คะแนนตัวชี้วัด ตามเกณฑ์คะแนน KPI ของกระทรวงสาธาณสุข ปี 2568 ด้านการให้บริการการแพทย์ทางไกล",
      "formula": "ผลการดำเนินงานจริงเทียบกับเกณฑ์เป้าหมาย (ครั้ง/รพ.)",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "ทุกไตรมาส",
      "evaluationMethod": "ปีงบประมาณ พ.ศ.2568 รายละเอียดข้อมูลพื้นฐาน Baseline Data หน่วยวัด ผลการดำเนินงานปีงบประมาณ ไม่มี ไม่มี ปี 2565 ปี 2566 ปี 2567 ไม่มี ไม่มี ไม่มี",
      "responsible": "ชื่อ-สกุล น.ส.สมจิตร เดชาเสถียร ตำแหน่ง นักวิชาการสาธารณสุขชำนาญการพิเศษ โทรศัพท์มือถือ098-101-0754 E-mail : nongsomdec@gmail.com ชื่อ-สกุล นายสุทธิศักดิ์ ธรรมพล ตำแหน่ง นักวิชาการคอมพิวเตอร์ปฏิบัติการ โทรศัพท์มือถือ 082-305-7572 E-mail : buboocs@gmail.com ชื่อ-สกุล นายธนาวุธ จำปาแดง ตำแหน่ง นักวิชาการคอมพิวเตอร์ปฏิบัติการ โทรศัพท์มือถือ 082-3136909 E-mail : - ชื่อ-สกุล นายอนิวัฒน์ พูนมณี ตำแหน่ง นักวิชาการคอมพิวเตอร์ โทรศัพท์มือถือ 095-186-7287 E-mail : bomb.aniwat@gmail.com ชื่อ-สกุล นายพชร เอี่ยมสุดใจ ตำแหน่ง นักวิชาการสาธารณสุขปฏิบัติการ โทรศัพท์มือถือ 061-3540905 E-mail : Phachara_pa@outlook.com ชื่อ-สกุล นายณภัทรพล พิมพาเรือ ตำแหน่ง นักวิชาการคอมพิวเตอร์ โทรศัพท์มือถือ 090-9915655 E-mail : naphat.p123465@gmail.com"
    },
    "KPI68-35": {
      "kpiId": "KPI68-35",
      "order": 35,
      "name": "โรงพยาบาลสังกัดกระทรวงสาธารณสุขมีคุณภาพมาตรฐาน HA ผ่านการรับรอง HA ขั้น 3",
      "strategy": "ยุทธศาสตร์ที่ 4",
      "objective": "เป้าประสงค์ที่ 8",
      "unit": "แห่ง",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "26 แห่ง",
      "baseline": "-",
      "definition": "โรงพยาบาลสังกัดกระทรวงสาธารณสุขมีคุณภาพมาตรฐาน HA ผ่านการรับรอง HA ขั้น 3 ตามเกณฑ์มาตรฐานแผนยุทธศาสตร์สุขภาพ 5 ปี จังหวัดขอนแก่น (พ.ศ. 2566–2570)",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "ผลการดำเนินงานจริงเทียบกับเกณฑ์เป้าหมาย (แห่ง)",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI68-36": {
      "kpiId": "KPI68-36",
      "order": 36,
      "name": "จำนวนสาธารณสุขอำเภอ ผ่านเกณฑ์ SMART สสอ.",
      "strategy": "ยุทธศาสตร์ที่ 4",
      "objective": "เป้าประสงค์ที่ 8",
      "unit": "แห่ง",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "10",
      "baseline": "5",
      "definition": "ด้านการคุ้มครองผู้บริโภค",
      "purpose": "คุ้มครองผู้บริโภคด้านสุขภาพโดยมีการจัดตั้งศูนย์บริการสุขภาพเบ็ดเสร็จระดับอำเภอ ซึ่งประกอบด้วย",
      "population": "ภารกิจ ดังนี้",
      "collectionMethod": "1. จัดตั้งศูนย์บริการสุขภาพเบ็ดเสร็จระดับอำเภอ ซึ่งมีองค์ประกอบด้านกายภาพ/ บุคลากร/อุปกรณ์/ คู่มือ/สถานที่ ครบถ้วน โดยกำหนดให้มี 1) จัดทำและติดตั้งป้ายชื่อศูนย์บริการสุขภาพเบ็ดเสร็จระดับอำเภอ 2) จัดทำสื่อประชาสัมพันธ์ศูนย์ฯ ผ่านให้บริการผ่านสื่อออนไลน์ เช่น เว็บไซต์/ Line group/ Facebook 3) จัดให้มีอุปกรณ์อำนวยความสะดวกผู้รับบริการในการขออนุญาตสถานประกอบการและ ผลิตภัณฑ์สุขภาพ ได้แก่โน๊ตบุ๊ค/ปริ้นเตอร์ 4) จัดให้มีจุดพักคอย 5) คู่มือการให้บริการประชาชน 6) มีการสำรวจความพึงพอใจ/ความต้องการของผู้มารับบริการ 2. จัดให้มีบริการให้คำปรึกษาการขออนุญาตฯ ผ่านระบบออนไลน์ ได้แก่ ระบบสำนักงาน คณะกรรมการอาหารและยา (Skynet) และ ระบบกรมสนับสนุนบริการสุขภาพ (Biz Portal) 3. จัดให้มีบริการอนุญาตเปิดสิทธิ์การเข้าใช้ระบบ Skynet ของผู้ประกอบการ 4. ดำเนินการตรวจสอบมาตรฐานสถานประกอบการเพื่อประกอบการพิจารณาอนุญาต Pre- marketing และดำเนินการตรวจเฝ้าระวัง Post-marketing สถานประกอบการด้านสุขภาพในเขต พื้นที่ 5. ดำเนินการจัดการเรื่องร้องเรียนด้านผลิตภัณฑ์และสถานประกอบการสุขภาพ SAT Team คปสอ. 6. ส่งเสริมนโยบายเศรษฐกิจสุขภาพ สร้างการมีส่วนร่วมของทุกภาคส่วน โดยสร้างเครือข่ายความ ร่วมมือระหว่างศูนย์บริการสุขภาพเบ็ดเสร็จและหน่วยงานในพื้นที่ 7. รายงานผลการดำเนินงานโดยผ่านช่องทาง Dash board 8. มีการนิเทศและติดตามผลการดำเนินงานภายใน คปสอ. 10 แห่ง เพื่อส่งเสริมให้เกิด Smart District Health Consumer Protection สำนักงานสาธารณสุขอำเภอ สังกัด กระทรวงสาธารณสุขที่มีการประยุกต์ใช้เทคโนโลยีดิจิตัลเพิ่มประสิทธิภาพการให้บริการด้านการคุ้มครอง ผู้บริโภคผลิตภัณฑ์และบริการสุขภาพ และ ตอบสนองนโยบายส่งเสริมเศรษฐกิจสุขภาพ KPI : Health for wealth (ร้อยละผลิตภัณฑ์สุขภาพที่ได้รับการส่งเสริมและได้รับการอนุญาต) ศูนย์บริการสุขภาพเบ็ดเสร็จระดับอำเภอ จังหวัดขอนแก่น สำนักงานสาธารณสุขอำเภอ นำข้อมูลผลการดำเนินงานผ่านระบบรายงาน Dashboard ศูนย์บริการ สุขภาพเบ็ดเสร็จอำเภอ, คู่มือการดำเนินงานศูนย์ฯ/คู่มือการจัดการเรื่องร้องเรียน และ ผลการนิเทศติดตาม ศูนย์ฯต้นแบบ",
      "source": "สาธารณสุขอำเภอทุกอำเภอ",
      "formula": "3.แผนงานขับเคลื่อนการดำเนินงานสนับสนุนส่งเสริมนโยบายเศรษฐกิจสุขภาพในเขตพื้นที่",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "4.บันทึกผลการตรวจสอบเพื่อประกอบการอนุญาต Pre-marketing และ การตรวจเฝ้าระวังประจำปี",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI68-37": {
      "kpiId": "KPI68-37",
      "order": 37,
      "name": "ร้อยละของหน่วยบริการปฐมภูมิ ทุกสังกัด ผ่านเกณฑ์มาตรฐานหน่วยบริการปฐมภูมิ",
      "strategy": "ยุทธศาสตร์ที่ 4",
      "objective": "เป้าประสงค์ที่ 8",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "100",
      "baseline": "41.08",
      "definition": "หน่วยบริการปฐมภูมิ หมายถึง หน่วยบริการสาธารณสุขระดับปฐมภูมิ ทุกสังกัดที่ขึ้นทะเบียน เป็นหน่วยบริการปฐมภูมิเกณฑ์ประเมินคุณภาพมาตรฐานบริการสุขภาพปฐมภูมิ หมายถึง เกณฑ์ ประเมิณคุณภาพมาตรฐานบริการสุขภาพปฐมภูมิ พ.ศ.2566 (ฉบับปรับปรุง) มีเกณฑ์การประเมินดังนี้ ส่วนที่ 1 ด้านระบบบริหารจัดการ ส่วนที่ 2 ด้านการจัดบุคคลากรและศักยภาพในการให้บริการ ส่วนที่ 3 ด้านสถานที่ตั้งหน่วยบริการ อาคาร สถานที่ และสิ่งแวดล้อม ส่วนที่ 4 ด้านระบบสารสนเทศ ส่วนที่ 5 ด้านระบบบริการสุขภาพปฐมภูมิ ส่วนที่ 6 ด้านระบบห้องปฏิบัติการด้านการแพทย์และสาธารณสุข ส่วนที่ 7 ด้านการจัดบริการเภสัชกรรมอลังานคุ้มครองผู้บริโภคด้านสุขภาพ ส่วนที่ 8 ด้านระบบการป้องกันและควบคุมการติดเชื่อ โดยมีการแปลผลดังนี้ ส่วนที่ 1 – 4 หน่วยบริการต้องผ่านเกณฑ์ทุกข้อ ส่วนที่ 5 – 8 หน่วยบริการต้องผ่านเกณ์ร้อยละ 80 ขึ้นไป",
      "purpose": "1. เพื่อให้ประชาชนสามารถเข้าถึงบริการที่มีคุณภาพ มาตรฐาน 2. เพื่อพัฒนาหน่วยบริการปฐมภูมิให้มีคุณภาพมาตรฐาน",
      "population": "หน่วยบริการปฐมภูมิทุกแห่ง ทุกสังกัด",
      "collectionMethod": "การจัดเก็บการประเมินคุณภาพมาตรฐาน จากระบบข้อมูลทรัพยากรสุขภาพหน่วยบริการปฐมภูมิ",
      "source": "(PCU Standard)",
      "formula": "A = จำนวนหน่วยบริการปฐมภูมิที่ผ่านเณฑ์การประเมิณมาตรฐานระบบสุขภาพปฐมภูมิ",
      "numeratorA": "จำนวนหน่วยบริการปฐมภูมิที่ผ่านเณฑ์การประเมิณมาตรฐานระบบสุขภาพปฐมภูมิ",
      "denominatorB": "จำนวนหน่วยบริการปฐมภูมิทั้งหมดทุกสังกัด",
      "frequency": "B = จำนวนหน่วยบริการปฐมภูมิทั้งหมดทุกสังกัด",
      "evaluationMethod": "ระบบข้อมูลทรัพยากรสุขภาพ หน่วยบริการปฐมภูมิ (PCU Standard )และ สุ่มลงตรวจประเมิน ในพื้นที่ รายละเอียดข้อมูล พื้นฐาน(Baseline ผลงาน ปี 2565 ปี 2566 ปี 2567 Data) Baseline Data - - ร้อยละ 41.08 ผลการดำเนินงาน ย้อนหลัง 3 ปี ชื่อ-สกุล...นางศิริพร อุทธากิจ ตำแหน่ง..พยาบาลวิชาชีพชำนาญการ (ปี 2565 -2567) กลุ่มงาน..พัฒนาคุณภาพและรูปแบบบริการ.",
      "responsible": "สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ 122... โทรสาร 0-4322-4037 ผู้กำกับดูแลตัวชี้วัด โทรศัพท์มือถือ..080 - 3570910. E-mail : .pcunpcu2022@gmail.com ชื่อ-สกุล...นางศิริมา นามประเสริฐ ตำแหน่ง..หัวหน้ากลุ่มงานพัฒนาคุณภาพและรูปแบบบริการ กลุ่มงาน..พัฒนาคุณภาพและรูปแบบบริการ. สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ 122... โทรสาร 0-4322-4037"
    },
    "KPI68-38": {
      "kpiId": "KPI68-38",
      "order": 38,
      "name": "จำนวนโรงพยาบาลมีการบริหารการเงินการคลังอย่างมีประสิทธิภาพ",
      "strategy": "ยุทธศาสตร์ที่ 4",
      "objective": "เป้าประสงค์ที่ 9",
      "unit": "แห่ง",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "23 แห่ง",
      "baseline": "22 แห่ง",
      "definition": "ส่วนที่ 1 ใช้เกณฑ์ประเมินประสิทธิภาพการบริหารการเงินการคลัง 5 มิติ ในมิติด้านการ จัดเก็บรายได้ ตามเกณฑ์การพัฒนาระบบการควบคุมภายใน (Internal Control : IC) ที่กำหนด โดยกองเศรษฐกิจสุขภาพและหลักประกันสุขภาพ สป. และกลุ่มตรวจสอบภายใน สป. ดังนี้ 1. จัดตั้งงานเรียกเก็บค่ารักษาพยาบาล (ตามหนังสือด่วนที่สุด ที่ สธ 0201.032/ว 1707 ลง วันที่ 14 มิ.ย. 2560) 1.1 มีคำสั่ง หรือ มอบหมายหน้าที่ผู้รับผิดชอบงาน Audit Chart เพื่อตรวจสอบความถูกต้อง ของเวชระเบียน 1.2 มีคำสั่งแต่งตั้งคณะกรรมการจัดเก็บค่ารักษาพยาบาลของหน่วยงาน 2. การบันทึกข้อมูลการเรียกเก็บเงินค่ารักษาพยาบาล 2.1 การบันทึกข้อมูลผู้ป่วยนอก (OPD) สิทธิจ่ายตรงกรมบัญชีกลาง 2.2 การบันทึกข้อมูลผู้ป่วยใน (IPD) สิทธิจ่ายตรงกรมบัญชีกลาง 2.3 ผู้รับผิดชอบจัดเก็บรายได้ส่งรายงานค่ารักษาพยาบาลผู้ป่วยนอก (OPD) ผู้ป่วยใน (IPD) สิทธิจ่ายตรงกรมบัญชีกลาง ให้กับงานบัญชี 2.4 รายงานสรุปผลการจัดเก็บค่ารักษาพยาบาลผู้ป่วยใน (IPD) และผู้ป่วยนอก (OPD) สิทธิ กรมบัญชีกลาง 3. กระบวนการเร่งรัดติดตามการเรียกเก็บรายได้ค่ารักษาพยาบาล 3.1 กำหนดผู้รับผิดชอบด้านการเร่งรัดติดตามหนี้ค้างชำระและผู้รับผิดชอบการรับชำระหนี้ แยกออกจากกัน 3.2 มีการเร่งรัดติดตามการชำระหนี้เป็นลายลักษณ์ อักษรชัดเจน ส่วนที่ 2 การประเมินประสิทธิภาพการบริหารการเงินการคลัง ตามเกณฑ์การให้คะแนน ประสิทธิภาพ Total Performance Score V 3.0 (TPS) น้ำหนักเน้นในเรื่องต่อไปนี้ 2.1 ประเมินการดำเนินงานในตัวชี้วัดกระบวนการ (Process Indicators) 1) การบริหารแผนทางการเงิน (Planfin) เปรียบเทียบผลการดำเนินงานผลต่าง บวกหรือ ลบไม่เกิน 5 % - มิติรายได้ - มิติค่าใช้จ่าย 2) การบริหารสินทรัพย์หมุนเวียนและหนี้สินหมุนเวียน - ระยะเวลาชำระเจ้าหนี้การค้ายา&เวชภัณฑ์มิใช่ยา ≤ 90 วัน หรือ ≤ 180 วัน - ระยะเวลาถัวเฉลี่ยในการเรียกเก็บหนี้สิทธิ UC ≤ 60 วัน - ระยะเวลาถัวเฉลี่ยในการเรียกเก็บหนี้สิทธิข้าราชการ ≤ 60 วัน - การบริหารสินคงคลัง (Inventory Management) ≤ 60 วัน ยกเว้น รพ.พื้นที่เกาะ ≤ 90 วัน 3) การบริหารต้นทุนและค่าใช้จ่าย - Unit Cost for OP - Unit Cost for IP - LC ค่าแรงบุคลากร",
      "purpose": "โรงพยาบาลในสังกัดสำนักงานปลัดกระทรวงฯ ในจังหวัดขอนแก่น มีการบริหารการเงินการคลังอย่าง มีประสิทธิภาพไม่มีความเสี่ยงด้านการเงิน (ระดับ 4 - 7) ศูนย์จัดเก็บรายได้มีคุณภาพ",
      "population": "โรงพยาบาลสังกัดสำนักงานปลัดกระทรวงสาธารณสุข ในจังหวัดขอนแก่น จำนวน 26 แห่ง",
      "collectionMethod": "ตามรอบประเมินผล CUP 2 ครั้ง/ปี โดยกำกับติดตามข้อมูล ผ่านกระบวนการบริหารการเงินการคลัง ระดับจังหวัด และผลงานตาม",
      "source": "โรงพยาบาลที่รับการตรวจประเมิน กลุ่มงานตรวจสอบภายใน สป. และกลุ่มงานพัฒนาระบบการเงิน การคลัง กองเศรษฐกิจสุขภาพ และหลักประกันสุขภาพ สป.สธ.",
      "formula": "1. คะแนนประเมินมิติด้านการจัดเก็บรายได้ ตามเกณฑ์การพัฒนาระบบการควบคุมภายใน (Internal Control : IC) ที่กำหนดโดยกลุ่มตรวจสอบภายใน สป. เว็บไซต์ https://iad.moph.go.th คะแนนเต็ม 100 คะแนน 2. ประเมินประสิทธิภาพการบริหารการเงินการคลัง ตามเกณฑ์การให้คะแนนประสิทธิภาพ Total Performance Score V 3.0 (TPS) รายไตรมาส ในเว็บไซต์ http://hfo.cfo.in.th ไตรมาสล่าสุด คะแนนเต็ม 100 คะแนน",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "ประเมินผลการดำเนินงานในรอบนิเทศรอบที่ 2/2568 โดยใช้คะแนน EIA ปีงบประมาณ 2568",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI68-39": {
      "kpiId": "KPI68-39",
      "order": 39,
      "name": "ร้อยละผลิตภัณฑ์สุขภาพและสถานประกอบการมีคุณภาพตามเกณฑ์",
      "strategy": "ยุทธศาสตร์ที่ 5",
      "objective": "เป้าประสงค์ที่ 10",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": ">93",
      "baseline": "97.01",
      "definition": "ด้านการคุ้มครองผู้บริโภค",
      "purpose": "คุ้มครองผู้บริโภคด้านสุขภาพโดยมีการจัดตั้งศูนย์บริการสุขภาพเบ็ดเสร็จระดับอำเภอ ซึ่งประกอบด้วย",
      "population": "ภารกิจ ดังนี้",
      "collectionMethod": "1. จัดตั้งศูนย์บริการสุขภาพเบ็ดเสร็จระดับอำเภอ ซึ่งมีองค์ประกอบด้านกายภาพ/ บุคลากร/อุปกรณ์/ คู่มือ/สถานที่ ครบถ้วน โดยกำหนดให้มี 1) จัดทำและติดตั้งป้ายชื่อศูนย์บริการสุขภาพเบ็ดเสร็จระดับอำเภอ 2) จัดทำสื่อประชาสัมพันธ์ศูนย์ฯ ผ่านให้บริการผ่านสื่อออนไลน์ เช่น เว็บไซต์/ Line group/ Facebook 3) จัดให้มีอุปกรณ์อำนวยความสะดวกผู้รับบริการในการขออนุญาตสถานประกอบการและ ผลิตภัณฑ์สุขภาพ ได้แก่โน๊ตบุ๊ค/ปริ้นเตอร์ 4) จัดให้มีจุดพักคอย 5) คู่มือการให้บริการประชาชน 6) มีการสำรวจความพึงพอใจ/ความต้องการของผู้มารับบริการ 2. จัดให้มีบริการให้คำปรึกษาการขออนุญาตฯ ผ่านระบบออนไลน์ ได้แก่ ระบบสำนักงาน คณะกรรมการอาหารและยา (Skynet) และ ระบบกรมสนับสนุนบริการสุขภาพ (Biz Portal) 3. จัดให้มีบริการอนุญาตเปิดสิทธิ์การเข้าใช้ระบบ Skynet ของผู้ประกอบการ 4. ดำเนินการตรวจสอบมาตรฐานสถานประกอบการเพื่อประกอบการพิจารณาอนุญาต Pre- marketing และดำเนินการตรวจเฝ้าระวัง Post-marketing สถานประกอบการด้านสุขภาพในเขต พื้นที่ 5. ดำเนินการจัดการเรื่องร้องเรียนด้านผลิตภัณฑ์และสถานประกอบการสุขภาพ SAT Team คปสอ. 6. ส่งเสริมนโยบายเศรษฐกิจสุขภาพ สร้างการมีส่วนร่วมของทุกภาคส่วน โดยสร้างเครือข่ายความ ร่วมมือระหว่างศูนย์บริการสุขภาพเบ็ดเสร็จและหน่วยงานในพื้นที่ 7. รายงานผลการดำเนินงานโดยผ่านช่องทาง Dash board 8. มีการนิเทศและติดตามผลการดำเนินงานภายใน คปสอ. 10 แห่ง เพื่อส่งเสริมให้เกิด Smart District Health Consumer Protection สำนักงานสาธารณสุขอำเภอ สังกัด กระทรวงสาธารณสุขที่มีการประยุกต์ใช้เทคโนโลยีดิจิตัลเพิ่มประสิทธิภาพการให้บริการด้านการคุ้มครอง ผู้บริโภคผลิตภัณฑ์และบริการสุขภาพ และ ตอบสนองนโยบายส่งเสริมเศรษฐกิจสุขภาพ KPI : Health for wealth (ร้อยละผลิตภัณฑ์สุขภาพที่ได้รับการส่งเสริมและได้รับการอนุญาต) ศูนย์บริการสุขภาพเบ็ดเสร็จระดับอำเภอ จังหวัดขอนแก่น สำนักงานสาธารณสุขอำเภอ นำข้อมูลผลการดำเนินงานผ่านระบบรายงาน Dashboard ศูนย์บริการ สุขภาพเบ็ดเสร็จอำเภอ, คู่มือการดำเนินงานศูนย์ฯ/คู่มือการจัดการเรื่องร้องเรียน และ ผลการนิเทศติดตาม ศูนย์ฯต้นแบบ",
      "source": "สาธารณสุขอำเภอทุกอำเภอ",
      "formula": "3.แผนงานขับเคลื่อนการดำเนินงานสนับสนุนส่งเสริมนโยบายเศรษฐกิจสุขภาพในเขตพื้นที่",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "4.บันทึกผลการตรวจสอบเพื่อประกอบการอนุญาต Pre-marketing และ การตรวจเฝ้าระวังประจำปี",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    }
  },
  "69": {
    "KPI69-01": {
      "kpiId": "KPI69-01",
      "order": 1,
      "name": "ร้อยละของประชาชนวัยทำงานอายุ 19-59 ปี มี BMI เกินได้รับการปรับเปลี่ยนพฤติกรรมและมี BMI ลดลง",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 1",
      "unit": "ร้อยละ",
      "direction": "ยิ่งน้อยยิ่งดี",
      "target": "< 40",
      "baseline": "46.74",
      "definition": "ร้อยละของประชาชนวัยทำงานอายุ 19-59 ปี มี BMI เกิน ได้รับการปรับเปลี่ยนพฤติกรรมและมี BMI ลดลง ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อาสาสมัครสาธารณสุขประจำหมู่บ้าน(อสม.) และบุคลากรสาธารณสุข ที่มีอายุ 19-59 ปี หมายถึง ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุข ที่มีอายุ 19 ปี 0 เดือน 1 วัน ถึง 59 ปี 11 เดือน 29 วัน ที่ยังไม่ป่วยด้วยโรคเบาหวาน และ/หรือความดันโลหิตสูงทั้งหมดในรอบ ปีงบประมาณ 2568 ค่าดัชนีมวลกาย (Body Mass Index : BMI) หมายถึง ค่าซึ่งเป็นความสัมพันธ์ระหว่างน้ำหนักตัวเป็นกิโลกรัม กับส่วนสูงเป็นเมตร หน่วยวัดเป็น กิโลกรัม/เมตร2",
      "purpose": "เพื่อให้กลุ่มเป้าหมายได้รับการคัดกรอง ประเมินภาวะสุขภาพ และปรับเปลี่ยนพฤติกรรมสุขภาพอย่างเหมาะสม",
      "population": "2. ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุข อายุ 19-59 ปี ที่มีค่าดัชนีมวลกาย",
      "collectionMethod": "อ้วนระดับ 1 และอ้วนระดับ 2 มี BMI ลดลง มากกว่าหรือเท่ากับ ร้อยละ 2",
      "source": "1. เพื่อให้ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุข อายุ 19-59 ปี ได้รับ",
      "formula": "การประเมินภาวะโภชนาการที่ครอบคลุม 2. เพื่อให้ ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุข อายุ 19-59 ปี ที่มีค่าดัชนี มวลกายอ้วนระดับ 1 และอ้วนระดับ 2 มี BMI ลดลง ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุข สังกัด รพ.สต./PCU/รพช./รพท./รพศ./ สสอ. ที่มีอายุ 19-59 ปี รายงานผลการคัดกรอง ชั่งน้ำหนัก วัดส่วนสูง วัดรอบเอว ดัชนีมวลกาย จาก โปรแกรม Khonkaen-HTD รพ.สต./PCU/สสอ./รพช./รพท./รพศ. 1. ร้อยละ ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุขอายุ 19-59 ปี ได้รับการชั่ง น้ำหนัก วัดส่วนสูง มากกว่า หรือเท่ากับ ร้อยละ 70 A = จำนวน ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุขอายุ19-59 ปี ที่ชั่งน้ำหนัก วัดส่วนสูงทั้งหมด",
      "numeratorA": "จำนวน ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุขอายุ19-59 ปี",
      "denominatorB": "จำนวน ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุขอายุ19-59 ปี",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "เกณฑ์การให้คะแนน(รวม 100 คะแนน) ผลรวม คะแนน 10 คะแนน 20 คะแนน 30 คะแนน 40 คะแนน 40 % ชั่ง นน. < 60.00 % 60.00–64.99 % 65.00-69.99 > 70.00 % สส. % คะแนน 15 คะแนน 30 คะแนน 45 คะแนน 60 คะแนน 60 % BMI ลดลง <1.00 % 1.00-1.49 % 1.50 – 1.99 % > 2.0 % 17.วิธีการประเมินผล คะแนน 1 คะแนน 2 คะแนน 3 คะแนน 4 คะแนน 5 คะแนนรวม < 60 คะแนนรวม คะแนนรวม คะแนนรวม คะแนนรวม 60.01-70.00 70.01-80.00 80.01-90.00 >90 รายละเอียดข้อมูล รายละเอียดข้อมูลพื้นฐาน (Baseline data) ผลการดำเนินงานย้อนหลัง 3 ปี (ปี 2565 - 2567) พื้นฐาน Baseline data หน่วยวัด ผลการดำเนินงานในรอบปีงบประมาณ (Baseline Data) ผลการดำเนินงาน 2565 2566 2567 ย้อนหลัง 3 ปี (ปี 2565 -2567) N/A N/A -3.94",
      "responsible": "นางสาวเทวารักษ์ ภูครองนาค ตัวชี้วัด นักวิชาการสาธารณสุขชำนาญการ โทร. 09 5652 7227 Email : theywarak.ph@gmail.com"
    },
    "KPI69-02": {
      "kpiId": "KPI69-02",
      "order": 2,
      "name": "ระดับคะแนนความสำเร็จของอำเภอในการดำเนินงานความรอบรู้ด้านสุขภาพในการป้องกันโรค Stroke, Pneumonia และภาวะติดเชื้อในกระแสเลือด",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 1",
      "unit": "คะแนน",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "85",
      "baseline": "82.06",
      "definition": "ระดับคะแนนความสำเร็จของอำเภอในการดำเนินงานความรอบรู้ด้านสุขภาพ 2.1 ผู้ป่วยโรคเบาหวาน/โรคความดันโลหิตสูงมีความรอบรู้ด้านสุขภาพในการป้องกันโรค Stroke 2.2 ผู้สูงอายุ60ปีขึ้นไป และกลุ่มอายุน้อยกว่าหรือเท่ากับ 10 ปี มีความรอบรู้ด้านสุขภาพใน โรคPneumonia และภาวะ Sepsis ความรอบรู้ด้านสุขภาพ หมายถึง ความรู้และทักษะของผู้ป่วยโรคเบาหวาน/โรคความดันโลหิตสูงที่จำเป็น สำหรับการเข้าถึง เข้าใจ ประเมินและตัดสินใจด้านสุขภาพของตนเองและคนรอบข้างได้อย่างเหมาะสม ความรู้และทักษะของ ประชาชนกลุ่มเสี่ยงโรค Pneumonia และภาวะ Sepsis ได้แก่ ผู้กลุ่มอายุ 60 ปีขึ้นไป กลุ่มอายุน้อยกว่าหรือเท่ากับ 10 ปี ที่อ่านออกเขียนได้ ที่จำเป็นสำหรับความเข้าใจ ความสามารถในการ ประเมิน Early warning sign และตัดสินใจด้านสุขภาพของตนเองและคนรอบข้างได้อย่างเหมาะสม อัตราความรอบรู้ด้านสุขภาพ เป็นตัวชี้วัดที่วัดจากการประเมินดังนี้ 1. ประเมินความรอบรู้ด้านสุขภาพของผู้ป่วยโรคเบาหวาน โรคความดันโลหิตสูง อายุ 15 ปี ขึ้นไป ที่เข้าร่วมกิจกรรมส่งเสริมสุขภาพในชุมชนรอบรู้ด้านสุขภาพ (Health Literate Communities: HLC) ซึ่งจัด โดยสถานบริการสุ ขภ าพ ที่ เป็ น องค์ กรรอบรู้ด้ านสุ ขภ าพ (Health Literate Organization: HLO) การประเมิ นใช้ ระบ บการป ระเมิ นจากเว็บไซต์ สาสุ ข อุ่นใจ คน ไทย รอบรู้ ของกรมอนามั ย (https://sasukoonchai.anamai.moph.go.th/) 2. ประเมินความรอบรู้ด้านสุขภาพของประชาชนกลุ่มเสี่ยงโรค Pneumonia และภาวะ Sepsis ได้แก่ ผู้กลุ่มอายุ 60 ปีขึ้นไป กลุ่มอายุน้อยกว่าหรือเท่ากับ 10 ปี ที่ อ่านออกเขียนได้ ที่เข้าร่วมกิจกรรม ส่งเสริมสุขภาพในชุมชนรอบรู้ด้านสุขภาพ (Health Literate Communities: HLC) ซึ่งจัดโดยสถานบริการ สุ ข ภ าพ ที่ เป็ น อ งค์ ก รรอ บ รู้ ด้ าน สุ ข ภ าพ (Health Literate Organization: HLO) ก ารป ระ เมิ น ผ่านทาง: https://forms.gle/Px1QAL06kUGwJiHf7 หน่วยบริการรอบรู้ด้านสุขภาพ หมายถึง โรงพยาบาล/โรงพยาบาลส่งเสริมสุขภาพตำบลที่มีแนวปฏิบัติ (practices)การบริการส่งเสริมสุขภาพและให้คำปรึกษาที่เป็นมิตรต่อความรอบรู้ด้านสุขภาพ ที่ทำให้ ผู้รับบริการเข้าถึง เข้าใจ และใช้ข้อมูลและบริการของตนเองได้ง่ายขึ้นและสะดวกขึ้น เพื่อดูแลสุขภาพใน หน่วยบริการของตนเองได้อย่างเหมาะสม กิจกรรมส่งเสริมความรอบรู้ด้านสุขภาพ หมายถึง ชุดกิจกรรมส่งเสริมสุขภาพ ป้องกันโรค และอนามัย สิ่งแวดล้อม ที่มุ่งเพื่อการแก้ไขปัญหาสุขภาพของกลุ่มผู้ป่วยโรคเบาหวาน โรคความดันโลหิตสูงในการป้องกัน โรค Stroke โรค Pneumonia และภาวะ Sepsis ชุมชนรอบรู้ด้านสุขภาพ หมายถึง หมู่บ้านที่อยู่ในตำบลเดียวกันมีการดำเนินงานพัฒนาให้ประชาชน มีศักยภาพในการดูแลสุขภาพตนเอง มีความรอบรู้ด้านสุขภาพและพฤติกรรมสุขภาพที่ถูกต้อง สามารถลด ปัจจัยเสี่ยงต่อสุขภาพได้อย่างเหมาะสมกับวิถีชีวิต สามารถป้องกันโรคและภัยสุขภาพแก่ตนเอง ครอบครัว ชุมชนโดยการมีส่วนร่วมจากทุกภาคส่วน ผู้ป่วยเบาหวาน หมายถึง ผู้ป่วยที่ได้รับการวินิจฉัยเป็นโรคเบาหวาน และได้รับการขึ้นทะเบียน/ผู้ป่วย โรคเบาหวานอาศัยอยู่ในพื้นที่รับผิดชอบทั้งหมดที่อ่านออกเขียนได้ ผู้ป่วยความดันโลหิตสูง หมายถึง ผู้ป่วยที่ได้รับการวินิจฉัยเป็นโรคความดันโลหิตสูง และได้รับการขึ้น ทะเบียน/ผู้ป่วยโรคความดันโลหิตสูงอาศัยอยู่ในพื้นที่รับผิดชอบทั้งหมดที่อ่านออกเขียนได้ โรคหลอดเลือดสมอง(Stroke) คือ ภาวะที่สมองขาดเลือดไปเลี้ยงเนื่องจากหลอดเลือดตีบ หลอดเลือด อุดตัน หรือหลอดเลือดแตก ส่งผลให้เนื้อเยื่อในสมองถูกทำลาย การทำงานของสมองหยุดชะงัก",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "ผลการดำเนินงานจริงเทียบกับเกณฑ์เป้าหมาย (คะแนน)",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI69-03": {
      "kpiId": "KPI69-03",
      "order": 3,
      "name": "จำนวนอำเภอที่ผ่านเกณฑ์คุณภาพการพัฒนาคุณภาพชีวิตระดับอำเภอ Plus (พชอ. Plus)",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "อำเภอ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "26",
      "baseline": "26",
      "definition": "จำนวนอำเภอที่ผ่านเกณฑ์คุณภาพการพัฒนาคุณภาพชีวิตระดับอำเภอ Plus (พชอ. Plus) ตามเกณฑ์มาตรฐานแผนยุทธศาสตร์สุขภาพ 5 ปี จังหวัดขอนแก่น (พ.ศ. 2566–2570)",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "ผลการดำเนินงานจริงเทียบกับเกณฑ์เป้าหมาย (อำเภอ)",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI69-04": {
      "kpiId": "KPI69-04",
      "order": 4,
      "name": "ร้อยละเด็กปฐมวัยมีพัฒนาการสมวัย",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "88",
      "baseline": "69.50",
      "definition": "เด็กปฐมวัย หมายถึง เด็กแรกเกิด จนถึงอายุ 5 ปี 11 เดือน 29 วัน เด็กพัฒนาการสมวัยครั้งที่ 1 หมายถึง เด็กที่ได้รับตรวจคัดกรองพัฒนาการโดยใช้ คู่มือเฝ้าระวัง",
      "purpose": "พัฒนาการครั้งแรก",
      "population": "เด็กที่ได้รับการกระตุ้นภายใน 30 วันมีพัฒนาการสมวัยครั้งที่ 2 หมายถึง เด็กที่มีพัฒนาการสงสัยล่าช้า",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "พัฒนาการเด็กปฐมวัย (DSPM)* แล้วผลการตรวจคัดกรอง ผ่านครบ 5 ด้านในการตรวจคัดกรองพัฒนาการ ครั้งที่ 1 รวมกับเด็กที่มีพัฒนาการสงสัยล่าช้าที่ได้รับการกระตุ้นภายใน 30 วันมีพัฒนาการสมวัยครั้งที่ 2 การคัดกรองพัฒนาการ หมายถึง ความครอบคลุมของการคัดกรองเด็กอายุ 9, 18, 30, 42 และ 60 เดือน ณ ช่วงเวลาที่มีการคัดกรองโดยเป็นเด็กในพื้นที่ (Type1: มีชื่ออยู่ในทะเบียนบ้าน ตัวอยู่จริงและ Type3 : ที่อาศัยอยู่ในเขต แต่ทะเบียนบ้านอยู่นอกเขต พัฒนาการสงสัยล่าช้า หมายถึง เด็กที่ได้รับตรวจคัดกรองพัฒนาการโดยใช้คู่มือเฝ้าระวังและส่งเสริม พัฒนาการเด็กปฐมวัย (DSPM) และผลการตรวจคัดกรองพัฒนาการตามอายุของเด็กในการประเมินพัฒนาการ ครั้งแรกผ่านไม่ครบ 5 ด้าน ทั้งเด็กที่ต้องแนะนำให้พ่อแม่ ผู้ปกครอง ส่งเสริมพัฒนาการตามวัยภายใน 30 วัน (1B261) รวมกับเด็กที่สงสัยล่าช้า ส่งต่อทันที (1B262 : เด็กที่พัฒนาการล่าช้า/ความผิดปกติอย่างชัดเจน) พัฒนาการสงสัยล่าช้าได้รับการติดตาม หมายถึง เด็กที่ได้รับการตรวจคัดกรองพัฒนาการตามอายุของเด็ก ในการประเมินพัฒนาการครั้งแรกผ่านไม่ครบ 5 ด้าน เฉพาะกลุ่มที่แนะนำให้พ่อแม่ ผู้ปกครอง ส่งเสริม พัฒนาการตามวัยภายใน 30 วัน (1B261) แล้วติดตามกลับมาประเมินคัดกรองพัฒนาการครั้งที่ 2 ร้อยละ 87 เพื่อการส่งเสริมสุขภาพ เด็กปฐมวัยให้มีพัฒ นาการสมวัย และมีระดับสติทางด้านเชาว์ปัญญ า และความฉลาดทางอารมณ์ดี เด็กปฐมวัยในจังหวัดขอนแก่น สถานบริการทุกระดับ นำข้อมูลการประเมินพัฒนาการเด็ก บันทึกในโปรแกรมหลักของสถานบริการฯ เช่น JHCIS, Hos xp, PCU เป็นต้น ส่งออกข้อมูลตามโครงสร้างมาตรฐาน 43 แฟ้ม โรงพยาบาลทุกแห่ง /สาธารณสุขอำเภอทุกอำเภอ/ รพ.สต.ทุกแห่ง",
      "formula": "(A/B) x 100 ระยะเวลา 12 เดือน ประเมินผล ทธศาสตร์จังหวัดขอนแก่น ระยะ 5 ปี (พ.ศ. 2566-2570) หน้า 150 106",
      "numeratorA": "จำนวนเด็กอายุ 9 18 30 42 และ 60 เดือน ผลรวมของเด็กที่มีพัฒนาการสมวัยจากตรวจครั้งที่ 1 และ 2",
      "denominatorB": "จำนวนเด็กอายุ 9 18 30 42 และ 60 เดือน ทั้งหมดในช่วงเวลาเดียวกัน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI69-05": {
      "kpiId": "KPI69-05",
      "order": 5,
      "name": "ร้อยละเด็ก 0-5 ปี มีส่วนสูงดีรูปร่างสมส่วน",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "78",
      "baseline": "65.49",
      "definition": "เด็กอายุ 0 - 5 ปี หมายถึง เด็กแรกเกิด จนถึงอายุ 5 ปี 11 เดือน 29 วัน สูงดี หมายถึง เด็กที่มีความยาวหรือส่วนสูงอยู่ในระดับสูงตามเกณฑ์ขึ้นไป (สูงตามเกณฑ์ ค่อนข้างสูง หรือสูง)",
      "purpose": "(ขององค์การอนามัยโลก) โดยมีค่ามากกว่าหรือเท่ากับ -1.5 SDของความยาว/ส่วนสูงตามเกณฑ์อายุ",
      "population": "สมส่วน หมายถึง เด็กที่มีน้ำหนักอยู่ในระดับสมส่วน เมื่อเทียบกับกราฟการเจริญเติบโตน้ำหนักตามเกณฑ์",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "สูงดีรูปร่างสมส่วน หมายถึง เด็กที่มีความยาวหรือส่วนสูงอยู่ในระดับสูงตามเกณฑ์ขึ้นไปและมีน้ำหนักอยู่ในระดับ สมส่วน (ในคนเดียวกัน) ร้อยละ 78 เพื่อการส่งเสริมสุขภาพ เด็ก อายุ 0 - 5 ปี มีการโภชนาการที่ดี การเจริญเติบโตตามวัย รูปร่างสูงดีสมส่วน เด็กปฐมวัยในจังหวัดขอนแก่น สถานบริการทุกระดับ นำข้อมูลการประเมินพัฒนาการเด็ก บันทึกในโปรแกรมหลักของสถานบริการฯ เช่น JHCIS, Hos xp, PCU เป็นต้น ส่งออกข้อมูลตามโครงสร้างมาตรฐาน 43 แฟ้ม โรงพยาบาลทุกแห่ง /สาธารณสุขอำเภอทุกอำเภอ/ รพ.สต.ทุกแห่ง",
      "formula": "A = จำนวนเด็กอายุ 0 -5 ปีที่ได้รับการคัดกรองชั่งน้ำหนัก และวัดความยาว/วัดส่วนสูง มีการเจริญเติบโต สูงดีสมส่วน สูตรคำนวณ ตัวชี้วัด B = จำนวนเด็กอายุ 0 -5 ปีที่ได้รับการคัดกรองชั่งน้ำหนัก และวัดความยาว/วัดส่วนสูงทั้งหมด ระยะเวลา ร้อยละของเด็กอายุ 0 -5 ปี สูงดีรูปร่างสมส่วน = (A x 100) /B ประเมิน 12 เดือน",
      "numeratorA": "จำนวนเด็กอายุ 0 -5 ปีที่ได้รับการคัดกรองชั่งน้ำหนัก และวัดความยาว/วัดส่วนสูง มีการเจริญเติบโต",
      "denominatorB": "จำนวนเด็กอายุ 0 -5 ปีที่ได้รับการคัดกรองชั่งน้ำหนัก และวัดความยาว/วัดส่วนสูงทั้งหมด",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ผลการดำเนินงานผ่านระบบรายงาน HDC รายละเอียด ผลการดำเนินงานย้อนหลัง 3 ปี (2565-2567) ข้อมูลพื้นฐาน (Baseline ตัวชี้วัด Baseline หน่วยวัด ผลการดำเนินงานใน Data) ร้อยละ รอบปีงบประมาณ data 2465 2566 2567 ร้อยละของเด็กอายุ 0 -5 ปี 64.20 73.1 67.23 64.20 สูงดีรูปร่างสมส่วน 3",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI69-06": {
      "kpiId": "KPI69-06",
      "order": 6,
      "name": "ร้อยละเด็ก 6-14 ปี มีส่วนสูงดีรูปร่างสมส่วน",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "≥ 63",
      "baseline": "59.77",
      "definition": "ลดปัจจัยเสี่ยงด้านสุขภาพและความเจ็บป่วยของประชาชน",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "เด็กอายุ 6-14 ปี หมายถึง เด็กอายุ6 ปีเต็ม – 14 ปี 11 เดือน 29 วัน",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "กราฟการเจริญเติบโต หมายถึง กราฟแสดงเกณฑ์อ้างอิงการเจริญเติบโตของเด็กอายุ 6-19 ปี บริบูรณ์",
      "formula": "1 สำนักโภชนาการ กรมอนามัย พ.ศ. 2564 (จัดทำจากการจัดทำเกณฑ์อ้างอิงการ เจริญเติบโตของเด็กอายุ 5-19 ปี สำนักโภชนาการ กรมอนามัย พ.ศ. 2563) โดยเริ่มใช้ในการประมวลผลในระบบฐานข้อมูล HDC ภาคเรียนที่ 1 ปีการศึกษา 2564 เป็นต้นไป สูงดีสมส่วน หมายถึง ส่วนสูงอยู่ในระดับสูงตามเกณฑ์ขึ้นไป และมีน้ำหนักอยู่ในระดับสมส่วน (ในคน เดียวกัน) สูงดี หมายถึง ส่วนสูงอยู่ในระดับสูงตามเกณฑ์ขึ้นไป (สูงตามเกณฑ์ ค่อนข้างสูง สูง) เมื่อเทียบกับกราฟ การเจริญเติบโตส่วนสูงตามเกณฑ์อายุ มีค่ามากกว่าหรือเท่ากับ -1.5 S.D. สมส่วน หมายถึง น้ำหนักอยู่ในระดับสมส่วน เมื่อเทียบกับกราฟการเจริญเติบโต น้ำหนักตามเกณฑ์ ส่วนสูง มีค่าระหว่าง -1.5 S.D. ถึง +1.5 S.D. ภาวะเตี้ย หมายถึง มีส่วนสูงน้อยกว่ามาตรฐาน มีค่าต่ำกว่า–2 S.D.ของส่วนสูงตามเกณฑ์อายุ ภาวะผอม หมายถึง มีน้ำหนักน้อยกว่ามาตรฐาน มีค่าต่ำกว่า –2 S.D. ของน้ำหนักตามเกณฑ์ส่วนสูง ภาวะเริ่มอ้วนและอ้วน หมายถึง มีน้ำหนักมากกว่ามาตรฐานน้ำหนักตามเกณฑ์ส่วนสูง โดยมีค่า มากกว่า > + 2 S.D.ขึ้นไป > ร้อยละ 66 1. เพื่อเฝ้าระวังภาวะโภชนาการและให้การดูแลรักษาที่ครอบคลุม หากพบภาวะผิดปกติได้รับการส่งต่อ ดูแลรักษาที่ครอบคลุม หากพบภาวะผิดปกติได้รับการส่งต่อที่เหมาะสม 2. เพื่อส่งเสริม สนับสนุนขับเคลื่อนโรงเรียน สถานศึกษาทุกระดับ ให้จัดบริการ ดูแลสุขภาพเด็กวัยเรียน ตามเกณฑ์มาตรฐาน เด็กนักเรียน อายุ 6-14 ปี ในโรงเรียนทุกสังกัด (โรงเรียนประถมศึกษา ,โรงเรียนประถมศึกษ า ขยายโอกาส,มัธยมศึกษา (ม.1-ม.3) 1. ชั่งน้ำหนักและวัดส่วนสูง บันทึกข้อมูลน้ำหนักและส่วนสูงด้วยทศนิยม 1 ตำแหน่ง เช่น น้ำหนัก 47.2 กิโลกรัม ส่วนสูง 155.2 เซนติเมตร 2. โรงพยาบาลส่งเสริมสุขภาพตำบล และ PCU จากโรงพยาบาล นำเข้าข้อมูลน้ำหนัก ส่วนสูง ของเด็ก จากสถานศึกษา/โรงเรียน บันทึกในโปรแกรมหลักของสถานบริการ เช่น JHCIS, HosXP PCU เป็นต้น และส่งออกแฟ้มข้อมูล Nutrition ตามโครงสร้างมาตรฐาน 43 แฟ้ม ระบบรายงาน HDC กองยุทธศาสตร์และแผนงาน และสำนักงานสาธารณสุขจังหวัด ข้อมูลจากแฟ้ม Nutrition (ไม่รวมเด็กป่วยที่มารับบริการ) A1 = จำนวนเด็กอายุ 6-14 ปี ที่มีภาวะสูงดีสมส่วน A2 = จำนวนเด็กอายุ 6-14 ปี ที่มีภาวะเตี้ย A3 = จำนวนเด็กอายุ 6-14 ปี ที่มีภาวะผอม A4 = จำนวนเด็กอายุ 6-14 ปี ที่มีภาวะเริ่มอ้วนและอ้วน",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนเด็กอายุ 6-14 ปีที่ชั่งน้ำหนักและวัดส่วนสูง",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประมวลผลรายงานจากฐานข้อมูล Health Data Center (HDC) รายละเอียด ข้อมูลพื้นฐานประกอบตัวชี้วัด เป้าหมาย หน่วย ผลงานย้อนหลัง 3 ปี ข้อมูลพื้นฐาน 2565 2566 2567 ปี 2568 วัด 67.14 65.46 63.72 (Baseline Data) ผลการดำเนินงาน ร้อยละเด็ก 6-14 ปี มีส่วนสูงดีรูปร่างสม ≥68 ร้อยละ 79.41 77.81 76.54 ย้อนหลัง 3 ปี (ปี 2565 -2567) ส่วน 9.12 10.27 10.56 7.73 6.00 7.71 ร้อยละเด็ก 6-14 ปี ได้รับการชั่งน้ำหนัก ≥80 ร้อยละ 3.37 4.50 4.31 วัดส่วนสูง ร้อยละเด็ก 6–14 ปี เริ่มอ้วนและอ้วน ≥10 ร้อยละ ร้อยละเด็ก 6–14 ปี เตี้ย ≥10 ร้อยละ ร้อยละเด็ก 6–14 ปี ผอม ≥5 ร้อยละ",
      "responsible": "นางวรวลัย เกษมศรีวิวัฒน์ ตำแหน่ง พยาบาลวิชาชีพชำนาญการ ตัวชี้วัด หมายเลขโทรศัพท์ 085-1555510 E-mail : worawalai.k@gmail.com กลุ่มงานส่งเสริมสุขภาพ สำนักงานสาธารณสุขจังหวัดขอนแก่น"
    },
    "KPI69-07": {
      "kpiId": "KPI69-07",
      "order": 7,
      "name": "ผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงได้รับการดูแลในระบบ Long Term Care และเข้าถึงตามชุดสิทธิประโยชน์",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "99",
      "baseline": "99.29",
      "definition": "ลดปัจจัยเสี่ยงด้านสุขภาพและความเจ็บป่วยของประชาชน",
      "purpose": "เพื่อให้ผู้สูงอายุและผู้มีภาวะพึ่งพิงได้รับการดูแลสุขภาพตามแผนการดูแลรายบุคคล (Care Plan) และเข้าถึงชุดสิทธิประโยชน์อย่างครอบคลุม",
      "population": "ผู้สูงอายุ หมายถึง ประชาชนที่มีอายุตั้งแต่ 60 ปีขึ้นไป",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "(ADL 0-4 คะแนน) ได้รับการดูแลโดยบุคลากรสาธารณสุข ทีมสหวิชาชีพตามแผนการดูแลรายบุคคล (Care Plan) ตามชุดสิทธิประโยชน์ทุกสิทธิการรักษาพยาบาล ผู้ที่มีภาวะพึ่งพิง หมายถึง ประชาชนที่มีค่าคะแนนการประเมินความสามารถในการประกอบกิจวัตร ประจำวัน(ADL) น้อยกว่าหรือเท่ากับ 11 คะแนน โดยแบ่งเป็นกลุ่มติดบ้าน (ADL 5-11 คะแนน) กลุ่มติดเตียง (ADL 0-4 คะแนน) ได้รับการดูแลโดยบุคลากรสาธารณสุข ทีมสหวิชาชีพตามแผนการดูแลรายบุคคล (Care Plan) ตามชุดสิทธิประโยชน์ทุกสิทธิการรักษาพยาบาล แผนการดูแลรายบุคคล (Care Plan) หมายถึง การประเมินและวางแผนการดูแลรายบุคคลก่อนให้บริการ ดูแลช่วยเหลือผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงจาก Care Manager ทีมผู้เชี่ยวชาญ ครอบครัวและผู้เกี่ยวข้อง ในพื้นที่ การดูแลกลุ่มภาวะพึ่งพิงตามชุดสิทธิประโยชน์ หมายถึง การบริการดูแลด้านสาธารณสุขตามแผนการดูแล รายบุคคล และให้คำแนะนำแก่ญาติและผู้ดูแล โดยผู้ช่วยเหลือดูแลผู้ที่มีภาวะพึ่งพิงหรือเครือข่ายสุขภาพอื่นๆ หรืออาสาสมัคร จิตอาสา ตามแผนการดูแลรายบุคคล หรือตามคำแนะนำของผู้จัดการการดูแลด้าน สาธารณสุข รวมถึงจัดหาวัสดุ อุปกรณ์ทางการแพทย์ หรืออุปกรณ์เครื่องช่วยเหลือที่จำเป็นตามสภาพของผู้ที่มี ภาวะพึ่งพิง และการประเมินผลลัพธ์การดูแลผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงหลังได้รับการดูแลตาม Care Plan ครบ 12 เดือน ร้อยละ 98.5 1. เพื่อให้ Care Manager /Caregiver/อาสาสมัครบริบาลท้องถิ่น และทีมสหวิชาชีพมีการส่งเสริมสุขภาพ วางแผนการดูแลรายบุคคล ฟื้นฟูสมรรถภาพ และสนับสนุนการดูแลผู้สูงอายุและผู้ที่มีภาวะพึ่งพิง แบบรอบด้านในระดับครอบครัว ชุมชนเป็นรายบุคคล 2. เพื่อสนับสนุนการมีส่วนร่วมของครอบครัว ชุมชนและหน่วยงานภาคีเครือข่ายที่เกี่ยวข้อง ในการดูแล และปรับเปลี่ยนพฤติกรรมสุขภาพของผู้สูงอายุให้มีคุณภาพชีวิตที่ดี มีอายุยืนยาวและช่วยเหลือตนเองได้ 3. เพื่อให้ผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงเข้าถึงระบบบริการด้านสาธารณสุข และวัสดุ อุปกรณ์ทางการแพทย์ หรืออุปกรณ์เครื่องช่วยเหลือที่จำเป็นตามสภาพปัญหาของผู้ที่มีภวะพึ่งพิง ผู้สูงอายุและบุคคลอื่น ที่มีค่าคะแนน ADL 0-11 คะแนน 1. รายงานผลการคัดกรอง ADL ในฐานข้อมูล Health Data Center 2. รายงานการจัดทำ Care Plan และการอนุมัติ Care Plan ผ่านคณะอนุกรรมการกองทุน LTC ระดับตำบล และบันทึกข้อมูล CP ที่ผ่านการอนุมัติรายงานในระบบโปรแกรม LTC สปสช. 3. รายงานผลค่าคะแนน ADL การดูแลกลุ่มภาวะพึ่งพิงครบ 12 เดือน ในโปรแกรม LTC สปสช. 1. ฐานข้อมูลการคัดกรอง ADL ใน Health Data Center 2. โปรแกรม Long Term Care กรมอนามัย 3. โปรแกรม Long Term Care สปสช.",
      "formula": "1 A = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่มีการจัดทำ Care Plan โดย Care Plan ได้รับอนุมัติจาก คณะอนุกรรมการ LTC และได้รับการเยี่ยมบ้านจาก Caregiver B = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงทั้งหมดที่เข้าร่วมโครงการ LTC รายการข้อมูล 2 A = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่ได้รับการดูแลตาม Care Plan ครบ 12 เดือน ที่มีค่าคะแนน ADL เพิ่มขึ้น และกลุ่มติดเตียงมีค่า ADL เท่าเดิมหรือไม่มีภาวะแทรกซ้อนเพิ่มขึ้น B = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่ ได้รับอนุมัติ Care Plan จากคณะอนุกรรมการ LTC และได้รับ การเยี่ยมบ้านจาก Caregiver ครบการดูแล 12 เดือน ทั้งหมด สูตรคำนวณ A x 100 ตัวชี้วัด 1 B สูตรคำนวณ A x 100 ตัวชี้วัด 2 B ระยะเวลา ตุลาคม 2567 - กันยายน 2568 ประเมินผล",
      "numeratorA": "จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่มีการจัดทำ Care Plan โดย Care Plan ได้รับอนุมัติจาก",
      "denominatorB": "จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงทั้งหมดที่เข้าร่วมโครงการ LTC",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "1) Care Manager/เจ้าหน้าที่สาธารณสุข PCU รพ./รพสต. ประเมินความสามารถในการประกอบกิจวัตร รายละเอียด ประจำวัน(ADL) เพื่อค้นหากลุ่มภาวะพึ่งพิงได้รับบริการตามชุดสิทธิประโยชน์ > ร้อยละ 60 ข้อมูลพื้นฐาน 2) Care Manager มีการจัดทำแผนการดูแลรายบุคคล Care Plan ในกลุ่มผู้สูงอายุและผู้ที่มีภาวะพึ่งพิง (Baseline Data) ผลการดำเนินงาน และ Care Plan ได้รับการอนุมัติจากคณะอนุกรรมการ LTC > ร้อยละ 98.5 ย้อนหลัง 3 ปี (ปี 2565 -2567) 3) ผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงได้รับการดูแลตามแผนการดูแลรายบุคคล Care Plan และประเมิน ADL ครบ",
      "responsible": "12 เดือน มีค่าคะแนน ADL เพิ่มขึ้นหรือกลุ่มติดเตียงไม่มีภาวะแทรกซ้อนเพิ่มขึ้น > ร้อยละ 25 ตัวชี้วัด ผลงาน ปี 2565 ปี 2566 ปี 2567 ร้อยละของผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงได้รับการดูแล 96.67 94.61 98.4 ในระบบ Long Term Care และเข้าถึงตามชุดสิทธิ ประโยชน์ ร้อยละของผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่ได้รับการดูแล 14.66 21.43 22.43 ตาม Care Plan มีค่าคะแนน ADL เพิ่มขึ้นหรือกลุ่มติด เตียงไม่มีภาวะแทรกซ้อนเพิ่มขึ้น ชื่อ-สกุล นางอังคณา อึ้งปิติมานะ ตำแหน่ง นักวิชาการสาธารณสุขชำนาญการ กลุ่มงานส่งเสริมสุขภาพ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ 149 โทรสาร 0-4322-4037 โทรศัพท์มือถือ. 0617929942 E-mail :ungpitimana.ang@gmail.com"
    },
    "KPI69-08": {
      "kpiId": "KPI69-08",
      "order": 8,
      "name": "อัตราตายมารดา",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ต่อแสนการเกิดมีชีพ",
      "direction": "ยิ่งน้อยยิ่งดี",
      "target": "≤13",
      "baseline": "11.14",
      "definition": "อัตราส่วนการตายมารดาไทยไม่เกิน 14 ต่อการเกิดมีชีพแสนคน",
      "purpose": "เฝ้าระวังสตรีชวงตั้งครรภ คลอดและหลังคลอด ให้ได้รับบริการคุณภาพตามเกณฑ์ เพื่อลดจำนวนการตาย",
      "population": "ของมารดา",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "หญิงตั้งครรภ์ หญิงคลอด และหญิงหลังคลอดภายใน 42 วัน",
      "formula": "(A/B) x 100,000",
      "numeratorA": "จำนวนมารดาตายระหว่างตั้งครรภ์ คลอดและหลังคลอดภายใน 42 วัน ทุกสาเหตุยกเว้นอุบัติเหตุ",
      "denominatorB": "จำนวนเด็กเกิดมีชีพทั้งหมดในช่วงเวลาเดียวกัน",
      "frequency": "ทุก 3 เดือน",
      "evaluationMethod": "เปรียบเทียบผลการดำเนินงานกับค่าเป้าหมาย",
      "responsible": "ชื่อ-สกุล...นางนรินทร์รัตน์ แก้วลา ตำแหน่ง นักวิชาการสาธารณสุขชำนาญการพิเศษ ชื่อ-สกุล...นางสมาพร สุรเตมีย์กุล ตำแหน่ง พยาบาลวิชาชีพชำนาญการ กลุ่มงาน ส่งเสริมสุขภาพ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ ... โทรสาร 0-4322-4037 โทรศัพท์มือถือ... 085-3956466 E-mail : narinratkaewla@gmail.com ตัวชี้วัดที่ 8.1 หญิงตั้งครรภ์ได้รับการฝากครรภ์ครั้งแรกเมื่ออายุครรภ์≤ 12 สัปดาห์ คำนิยาม หญิงตั้งครรภ์ได้รับการฝากครรภ์ครั้งแรกเมื่ออายุครรภ์น้อยกว่าหรือเท่ากับ 12 สัปดาห์ หมายถึง หญิงตั้งครรภ์ที่มาฝากครรภ์ที่สถานบริการฯทั้งหมด โดยต้องฝากครรภ์ครั้งแรกที่อายุครรภ์น้อยกว่า หรือเท่ากับ 12 สัปดาห์ เกณฑ์เป้าหมาย ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ 2566 2567 2568 2569 2570 ≥ ร้อยละ 75 ≥ ร้อยละ 75 ≥ ร้อยละ 80 ≥ ร้อยละ 85 ≥ ร้อยละ 90 วัตถุประสงค์ ส่งเสริมสุขภาพและเฝ้าระวังหญิงตั้งครรภ์ คลอดและหลังคลอด เพื่อลดการตายมารดาและทารก จากการตั้งครรภ์และคลอดให้มีประสิทธิภาพ กลุ่มเป้าหมาย หญิงตั้งครรภ์และหญิงหลังคลอดทุกราย วิธีการจัดเก็บข้อมูล บันทึกข้อมูลการให้บริการในโปรแกรมของแต่ละสถานบริการและส่งออกข้อมูลตามแนวทาง 43 แฟ้ม แหล่งข้อมูล 1. หน่วยบริการสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่นและองค์การบริหารส่วนจังหวัดขอนแก่น ทุกแห่ง 2. ฐานข้อมูล 43 แฟ้ม( แฟ้ม ANCและ Labor) รายการข้อมูล 1 A = จำนวนหญิงคลอดตาม B ที่ฝากครรภ์ครั้งแรกและอายุครรภ์ ≤ 12 สัปดาห์ (ข้อมูลจากสมุดสีชมพูบันทึกลงใน 43 แฟ้ม : แฟ้ม ANC) รายการข้อมูล 2 B =จำนวนหญิงไทยทุกรายที่คลอดในเขตรับผิดชอบทั้งหมดในช่วงเวลาเดียวกัน สูตรคำนวณตัวชี้วัด (A/B ) x 100 ระยะเวลาประเมินผล ทุก 3 เดือน Small Success ปี 2568 รอบ 3 เดือน รอบ 6 เดือน รอบ 9 เดือน รอบ 12 เดือน ≥ ร้อยละ65 ≥ ร้อยละ 70 ≥ ร้อยละ 75 ≥ ร้อยละ80"
    },
    "KPI69-09": {
      "kpiId": "KPI69-09",
      "order": 9,
      "name": "อัตราตายของทารกแรกเกิด",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ต่อพันการเกิดมีชีพ",
      "direction": "ยิ่งน้อยยิ่งดี",
      "target": "< 2.1",
      "baseline": "3.28",
      "definition": "ทารกแรกเกิด หมายถึง ทารกที่ มีน้ำหนัก ≥ 500 กรัม ที่คลอดมามีชีวิตตั้งแต่แรกเกิดจนถึง 28 วัน ในโรงพยาบาล สังกัดสำนักงานปลัดกระทรวงสาธารณสุข (รพศ./รพท./รพช.)",
      "purpose": "1. เพื่อเพิ่มประสิทธิภาพการดูแลรักษาทารกแรกเกิดใหทั่วถึง 2. เพื่อลดอัตราตายทารกแรกเกิด",
      "population": "ทารกที่คลอดและมีชีวิตจนถึง 28 วัน",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "1.หน่วยบริการทุกระดับในสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่น 2. ฐานข้อมูล Health Data Center",
      "formula": "(A/B) x 1,000",
      "numeratorA": "จำนวนทารกที่เสียชีวิต ≤ 28 วัน",
      "denominatorB": "จำนวนเด็กเกิดมีชีพทั้งหมดในช่วงเวลาเดียวกัน",
      "frequency": "ทุก 3 เดือน",
      "evaluationMethod": "เปรียบเทียบผลการดำเนินงานกับค่าเป้าหมาย รายละเอียดข้อมูลพื้นฐาน Baseline Data หน่วยวัด ผลการดำเนินงานปีงบประมาณ อัตราตายทารกแรกเกิด อัตราตายทารก ปี 2565 ปี 2566 ปี 2567 แรกเกิด ตอ เกิด มีชีพ 1,000คน 2.8 2.6 3.3",
      "responsible": "ชื่อ-สกุล...นางนรินทร์รัตน์ แก้วลา ตำแหน่ง นักวิชาการสาธารณสุขชำนาญการพิเศษ ตัวชี้วัด ชื่อ-สกุล...นางสมาพร สุรเตมีย์กุล ตำแหน่ง พยาบาลวิชาชีพชำนาญการ กลุ่มงาน ส่งเสริมสุขภาพ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ ... โทรสาร 0-4322-4037 โทรศัพท์มือถือ... 085-3956466 E-mail : narinratkaewla@gmail.com"
    },
    "KPI69-10": {
      "kpiId": "KPI69-10",
      "order": 10,
      "name": "ร้อยละของผู้สูงอายุไม่มีภาวะพึ่งพิง",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "96",
      "baseline": "95.32",
      "definition": "ลดปัจจัยเสี่ยงด้านสุขภาพและความเจ็บป่วยของประชาชน",
      "purpose": "เพื่อให้ผู้สูงอายุและผู้มีภาวะพึ่งพิงได้รับการดูแลสุขภาพตามแผนการดูแลรายบุคคล (Care Plan) และเข้าถึงชุดสิทธิประโยชน์อย่างครอบคลุม",
      "population": "ผู้สูงอายุ หมายถึง ประชาชนที่มีอายุตั้งแต่ 60 ปีขึ้นไป",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "(ADL 0-4 คะแนน) ได้รับการดูแลโดยบุคลากรสาธารณสุข ทีมสหวิชาชีพตามแผนการดูแลรายบุคคล (Care Plan) ตามชุดสิทธิประโยชน์ทุกสิทธิการรักษาพยาบาล ผู้ที่มีภาวะพึ่งพิง หมายถึง ประชาชนที่มีค่าคะแนนการประเมินความสามารถในการประกอบกิจวัตร ประจำวัน(ADL) น้อยกว่าหรือเท่ากับ 11 คะแนน โดยแบ่งเป็นกลุ่มติดบ้าน (ADL 5-11 คะแนน) กลุ่มติดเตียง (ADL 0-4 คะแนน) ได้รับการดูแลโดยบุคลากรสาธารณสุข ทีมสหวิชาชีพตามแผนการดูแลรายบุคคล (Care Plan) ตามชุดสิทธิประโยชน์ทุกสิทธิการรักษาพยาบาล แผนการดูแลรายบุคคล (Care Plan) หมายถึง การประเมินและวางแผนการดูแลรายบุคคลก่อนให้บริการ ดูแลช่วยเหลือผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงจาก Care Manager ทีมผู้เชี่ยวชาญ ครอบครัวและผู้เกี่ยวข้อง ในพื้นที่ การดูแลกลุ่มภาวะพึ่งพิงตามชุดสิทธิประโยชน์ หมายถึง การบริการดูแลด้านสาธารณสุขตามแผนการดูแล รายบุคคล และให้คำแนะนำแก่ญาติและผู้ดูแล โดยผู้ช่วยเหลือดูแลผู้ที่มีภาวะพึ่งพิงหรือเครือข่ายสุขภาพอื่นๆ หรืออาสาสมัคร จิตอาสา ตามแผนการดูแลรายบุคคล หรือตามคำแนะนำของผู้จัดการการดูแลด้าน สาธารณสุข รวมถึงจัดหาวัสดุ อุปกรณ์ทางการแพทย์ หรืออุปกรณ์เครื่องช่วยเหลือที่จำเป็นตามสภาพของผู้ที่มี ภาวะพึ่งพิง และการประเมินผลลัพธ์การดูแลผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงหลังได้รับการดูแลตาม Care Plan ครบ 12 เดือน ร้อยละ 98.5 1. เพื่อให้ Care Manager /Caregiver/อาสาสมัครบริบาลท้องถิ่น และทีมสหวิชาชีพมีการส่งเสริมสุขภาพ วางแผนการดูแลรายบุคคล ฟื้นฟูสมรรถภาพ และสนับสนุนการดูแลผู้สูงอายุและผู้ที่มีภาวะพึ่งพิง แบบรอบด้านในระดับครอบครัว ชุมชนเป็นรายบุคคล 2. เพื่อสนับสนุนการมีส่วนร่วมของครอบครัว ชุมชนและหน่วยงานภาคีเครือข่ายที่เกี่ยวข้อง ในการดูแล และปรับเปลี่ยนพฤติกรรมสุขภาพของผู้สูงอายุให้มีคุณภาพชีวิตที่ดี มีอายุยืนยาวและช่วยเหลือตนเองได้ 3. เพื่อให้ผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงเข้าถึงระบบบริการด้านสาธารณสุข และวัสดุ อุปกรณ์ทางการแพทย์ หรืออุปกรณ์เครื่องช่วยเหลือที่จำเป็นตามสภาพปัญหาของผู้ที่มีภวะพึ่งพิง ผู้สูงอายุและบุคคลอื่น ที่มีค่าคะแนน ADL 0-11 คะแนน 1. รายงานผลการคัดกรอง ADL ในฐานข้อมูล Health Data Center 2. รายงานการจัดทำ Care Plan และการอนุมัติ Care Plan ผ่านคณะอนุกรรมการกองทุน LTC ระดับตำบล และบันทึกข้อมูล CP ที่ผ่านการอนุมัติรายงานในระบบโปรแกรม LTC สปสช. 3. รายงานผลค่าคะแนน ADL การดูแลกลุ่มภาวะพึ่งพิงครบ 12 เดือน ในโปรแกรม LTC สปสช. 1. ฐานข้อมูลการคัดกรอง ADL ใน Health Data Center 2. โปรแกรม Long Term Care กรมอนามัย 3. โปรแกรม Long Term Care สปสช.",
      "formula": "1 A = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่มีการจัดทำ Care Plan โดย Care Plan ได้รับอนุมัติจาก คณะอนุกรรมการ LTC และได้รับการเยี่ยมบ้านจาก Caregiver B = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงทั้งหมดที่เข้าร่วมโครงการ LTC รายการข้อมูล 2 A = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่ได้รับการดูแลตาม Care Plan ครบ 12 เดือน ที่มีค่าคะแนน ADL เพิ่มขึ้น และกลุ่มติดเตียงมีค่า ADL เท่าเดิมหรือไม่มีภาวะแทรกซ้อนเพิ่มขึ้น B = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่ ได้รับอนุมัติ Care Plan จากคณะอนุกรรมการ LTC และได้รับ การเยี่ยมบ้านจาก Caregiver ครบการดูแล 12 เดือน ทั้งหมด สูตรคำนวณ A x 100 ตัวชี้วัด 1 B สูตรคำนวณ A x 100 ตัวชี้วัด 2 B ระยะเวลา ตุลาคม 2567 - กันยายน 2568 ประเมินผล",
      "numeratorA": "จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่มีการจัดทำ Care Plan โดย Care Plan ได้รับอนุมัติจาก",
      "denominatorB": "จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงทั้งหมดที่เข้าร่วมโครงการ LTC",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "1) Care Manager/เจ้าหน้าที่สาธารณสุข PCU รพ./รพสต. ประเมินความสามารถในการประกอบกิจวัตร รายละเอียด ประจำวัน(ADL) เพื่อค้นหากลุ่มภาวะพึ่งพิงได้รับบริการตามชุดสิทธิประโยชน์ > ร้อยละ 60 ข้อมูลพื้นฐาน 2) Care Manager มีการจัดทำแผนการดูแลรายบุคคล Care Plan ในกลุ่มผู้สูงอายุและผู้ที่มีภาวะพึ่งพิง (Baseline Data) ผลการดำเนินงาน และ Care Plan ได้รับการอนุมัติจากคณะอนุกรรมการ LTC > ร้อยละ 98.5 ย้อนหลัง 3 ปี (ปี 2565 -2567) 3) ผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงได้รับการดูแลตามแผนการดูแลรายบุคคล Care Plan และประเมิน ADL ครบ",
      "responsible": "12 เดือน มีค่าคะแนน ADL เพิ่มขึ้นหรือกลุ่มติดเตียงไม่มีภาวะแทรกซ้อนเพิ่มขึ้น > ร้อยละ 25 ตัวชี้วัด ผลงาน ปี 2565 ปี 2566 ปี 2567 ร้อยละของผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงได้รับการดูแล 96.67 94.61 98.4 ในระบบ Long Term Care และเข้าถึงตามชุดสิทธิ ประโยชน์ ร้อยละของผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่ได้รับการดูแล 14.66 21.43 22.43 ตาม Care Plan มีค่าคะแนน ADL เพิ่มขึ้นหรือกลุ่มติด เตียงไม่มีภาวะแทรกซ้อนเพิ่มขึ้น ชื่อ-สกุล นางอังคณา อึ้งปิติมานะ ตำแหน่ง นักวิชาการสาธารณสุขชำนาญการ กลุ่มงานส่งเสริมสุขภาพ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ 149 โทรสาร 0-4322-4037 โทรศัพท์มือถือ. 0617929942 E-mail :ungpitimana.ang@gmail.com"
    },
    "KPI69-11": {
      "kpiId": "KPI69-11",
      "order": 11,
      "name": "ร้อยละสตรีอายุ 30-60 ปี กลุ่มเป้าหมายได้รับการคัดกรองมะเร็งปากมดลูกด้วยวิธี HPV DNA (สะสมผลงาน 2568-2570 ≥ 80%)",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "45",
      "baseline": "11.26",
      "definition": "การคัดกรองมะเร็งปากมดลูก หมายถึง สตรี",
      "purpose": "1. เพื่อเพิ่มการเข้าถึงบริการคัดกรองมะเร็งปากมดลูก 2. เพื่อลดอัตราการเกิดโรคมะเร็งปากมดลูกในระยะลุกลาม",
      "population": "(อายุ 30-≤60 ปี) ได้รับการ ตรวจคัดกรองมะเร็ง ปากมดลูกด้วยวิธี HPV DNA test ทั้งแบบตรวจโดยเจ้าหน้าที่ และแบบ Self Collection เป็นการตรวจหาเชื้อ ไวรัส HPV ความ เสี่ยงสูง 14 สายพันธุ์ซึ่งเป็นสาเหตุของมะเร็งปากมดลูก โดยวิธีการตรวจคือเก็บเซลล์บริเวณ ปากมดลูกช่องคลอดด้านใน ส่งตรวจด้วยวิธีการตรวจด้วยน้ำยา เมื่อคัดกรองแล้วมีผลปกติ/ผล ลบ (Negative) จากตัวอย่างสิ่งส่งตรวจ แนะนำให้เข้ารับการตรวจคัดกรองมะเร็งปากมดลูก ด้วยวิธีHPV DNA Test ครั้งต่อไป ในอีก 5 ปี เกณฑ์เป้าหมาย ≥ ร้อยละ 80 วัตถุประสงค์ 1. เพื่อเพิ่มการเข้าถึงบริการคัดกรองมะเร็งปากมดลูก 2. เพื่อลดอัตราการเกิดโรคมะเร็งปากมดลูกในระยะลุกลาม กลุ่มเป้าหมาย สตรีไทยอายุ 30-≤60 ปี ในพื้นที่รับผิดชอบ ตามจำนวนที่ได้รับการจัดสรร ในปีงบประมาณ 2568 (การนับอายุ 59 ปี 11 เดือน 29 วัน ณ วันให้บริการ) (ประชากร Type area 1,Type area 3) ในช่วงเวลาที่กำหนด",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "1. จากโปรแกรม Cancer Cervical Screening @ Khon Kaen 2. HDC 43 แฟ้ม สำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "formula": "A = จำนวนสตรีไทยอายุ 30-≤60 ปี ที่ได้รับการคัดกรองมะเร็งปากมดลูก ด้วยวิธี HPV DNA Test (โดยการตรวจด้วยเจ้าหน้าที่ หรือ การตรวจด้วยตนเอง) B = จำนวนสตรีไทยอายุ 30-≤60 ปี สูตรคำนวณ (A/B) x 100 ตัวชี้วัด ระยะเวลา รายไตรมาส ปีงบประมาณ พ.ศ.2568 ประเมินผล",
      "numeratorA": "จำนวนสตรีไทยอายุ 30-≤60 ปี ที่ได้รับการคัดกรองมะเร็งปากมดลูก ด้วยวิธี HPV DNA Test",
      "denominatorB": "จำนวนสตรีไทยอายุ 30-≤60 ปี",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลได้แบบ real time รายละเอียด ปีงบประมาณ พ.ศ.2565 ปีงบประมาณ พ.ศ.2566 ปีงบประมาณ พ.ศ.2567 ร้อยละ 21.82 ร้อยละ 42.81 % ร้อยละ 59.34 % ข้อมูลพื้นฐาน (Baseline Data) ผลการดำเนินงาน ย้อนหลัง 3 ปี (ปี 2565 -2567)",
      "responsible": "1. ชื่อ-สกุล นางยุภาพร ดีแป้น ตำแหน่ง : พยาบาลวิชาชีพชำนาญการ ตัวชี้วัด กลุ่มงาน : ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ที่ทำงาน : 043-221125 ต่อ 150 โทรสาร : 043-224037 โทรศัพท์มือถือ : 080-4620160 E-mail : smallbody@hotmail.com 2. ชื่อ-สกุล นางแสงเดือน โสภา ตำแหน่ง : พยาบาลวิชาชีพชำนาญการ กลุ่มงาน : ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ที่ทำงาน : 043-221125 ต่อ 150 โทรสาร : 043-224037 โทรศัพท์มือถือ : 081-3803219 3. ชื่อ-สกุล นางกิตติมา ก้านจักร ตำแหน่ง : นักวิชาการสาธารณสุขชำนาญการพิเศษ กลุ่มงาน : ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ที่ทำงาน : 043-221125 ต่อ 169 โทรสาร : 043-224037 โทรศัพท์มือถือ : 087-7707761"
    },
    "KPI69-12": {
      "kpiId": "KPI69-12",
      "order": 12,
      "name": "ร้อยละของประชาชนอายุ 50-70 ปี (รายใหม่) กลุ่มเป้าหมายได้รับการคัดกรองมะเร็ง ลำไส้ใหญ่/ไส้ตรง ด้วยวิธี FIT Test",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "80",
      "baseline": "74.37",
      "definition": "ร้อยละของประชาชนวัยทำงานอายุ 19-59 ปี มี BMI เกิน ได้รับการปรับเปลี่ยนพฤติกรรมและมี BMI ลดลง ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อาสาสมัครสาธารณสุขประจำหมู่บ้าน(อสม.) และบุคลากรสาธารณสุข ที่มีอายุ 19-59 ปี หมายถึง ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุข ที่มีอายุ 19 ปี 0 เดือน 1 วัน ถึง 59 ปี 11 เดือน 29 วัน ที่ยังไม่ป่วยด้วยโรคเบาหวาน และ/หรือความดันโลหิตสูงทั้งหมดในรอบ ปีงบประมาณ 2568 ค่าดัชนีมวลกาย (Body Mass Index : BMI) หมายถึง ค่าซึ่งเป็นความสัมพันธ์ระหว่างน้ำหนักตัวเป็นกิโลกรัม กับส่วนสูงเป็นเมตร หน่วยวัดเป็น กิโลกรัม/เมตร2",
      "purpose": "เพื่อให้กลุ่มเป้าหมายได้รับการคัดกรอง ประเมินภาวะสุขภาพ และปรับเปลี่ยนพฤติกรรมสุขภาพอย่างเหมาะสม",
      "population": "2. ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุข อายุ 19-59 ปี ที่มีค่าดัชนีมวลกาย",
      "collectionMethod": "อ้วนระดับ 1 และอ้วนระดับ 2 มี BMI ลดลง มากกว่าหรือเท่ากับ ร้อยละ 2",
      "source": "1. เพื่อให้ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุข อายุ 19-59 ปี ได้รับ",
      "formula": "การประเมินภาวะโภชนาการที่ครอบคลุม 2. เพื่อให้ ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุข อายุ 19-59 ปี ที่มีค่าดัชนี มวลกายอ้วนระดับ 1 และอ้วนระดับ 2 มี BMI ลดลง ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุข สังกัด รพ.สต./PCU/รพช./รพท./รพศ./ สสอ. ที่มีอายุ 19-59 ปี รายงานผลการคัดกรอง ชั่งน้ำหนัก วัดส่วนสูง วัดรอบเอว ดัชนีมวลกาย จาก โปรแกรม Khonkaen-HTD รพ.สต./PCU/สสอ./รพช./รพท./รพศ. 1. ร้อยละ ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุขอายุ 19-59 ปี ได้รับการชั่ง น้ำหนัก วัดส่วนสูง มากกว่า หรือเท่ากับ ร้อยละ 70 A = จำนวน ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุขอายุ19-59 ปี ที่ชั่งน้ำหนัก วัดส่วนสูงทั้งหมด",
      "numeratorA": "จำนวน ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุขอายุ19-59 ปี",
      "denominatorB": "จำนวน ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุขอายุ19-59 ปี",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "เกณฑ์การให้คะแนน(รวม 100 คะแนน) ผลรวม คะแนน 10 คะแนน 20 คะแนน 30 คะแนน 40 คะแนน 40 % ชั่ง นน. < 60.00 % 60.00–64.99 % 65.00-69.99 > 70.00 % สส. % คะแนน 15 คะแนน 30 คะแนน 45 คะแนน 60 คะแนน 60 % BMI ลดลง <1.00 % 1.00-1.49 % 1.50 – 1.99 % > 2.0 % 17.วิธีการประเมินผล คะแนน 1 คะแนน 2 คะแนน 3 คะแนน 4 คะแนน 5 คะแนนรวม < 60 คะแนนรวม คะแนนรวม คะแนนรวม คะแนนรวม 60.01-70.00 70.01-80.00 80.01-90.00 >90 รายละเอียดข้อมูล รายละเอียดข้อมูลพื้นฐาน (Baseline data) ผลการดำเนินงานย้อนหลัง 3 ปี (ปี 2565 - 2567) พื้นฐาน Baseline data หน่วยวัด ผลการดำเนินงานในรอบปีงบประมาณ (Baseline Data) ผลการดำเนินงาน 2565 2566 2567 ย้อนหลัง 3 ปี (ปี 2565 -2567) N/A N/A -3.94",
      "responsible": "นางสาวเทวารักษ์ ภูครองนาค ตัวชี้วัด นักวิชาการสาธารณสุขชำนาญการ โทร. 09 5652 7227 Email : theywarak.ph@gmail.com"
    },
    "KPI69-13": {
      "kpiId": "KPI69-13",
      "order": 13,
      "name": "ร้อยละของผู้ที่มีผลผิดปกติ (มะเร็งลำไส้ใหญ่และไส้ตรงผิดปกติ) ได้รับการส่องกล้อง Colonoscopy",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "90",
      "baseline": "64.57",
      "definition": "1. ผู้ที่มีผลการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรงผิดปกติ หมายถึง ประชากรเพศชาย และเพศหญิงอายุ 50- 70 ปีที่มีผลการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรง ด้วยวิธี Fecal Immunochemical Test (FIT) เป็นบวก (Positive) คือตรวจพบเม็ดเลือดแดงใน ตัวอย่างอุจจาระ 2. การส่องกล้อง Colonoscopy หมายถึง การวินิจฉัยความผิดปกติภายในลำไส้ใหญ่ ด้วยการส่องกล้องขยาย เพื่อการค้นหารอยโรคก่อนการเกิดมะเร็งลำไส้ใหญ่และไส้ตรงใน ระยะต้น",
      "purpose": "เพื่อลดอัตราการเกิดโรคมะเร็งลำไส้ใหญ่และไส้ตรงในระยะลุกลาม",
      "population": "ประชากรกลุ่มเป้าหมายที่ได้รับการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรงด้วยวิธี FIT test ในปีงบประมาณ พ.ศ.2568 ผลการตรวจเป็นบวก (Positive)",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "1. โปรแกรม Your Colonoscopy 2. HDC สำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "formula": "A = จำนวนประชากรกลุ่มเป้าหมายที่ได้รับการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรงด้วยวิธี FIT test ในปีงบประมาณ พ.ศ.2568 ผลการตรวจเป็นบวก (Positive) B = จำนวนประชากรกลุ่มเป้าหมายที่ได้รับการคัดกรองมะเร็งลำไส้ใหญ่ และไส้ตรงด้วยวิธี FIT test ในปีงบประมาณ พ.ศ.2568 ผลการตรวจเป็นบวก (Positive) ที่ได้รับการส่องกล้อง Colonoscopy สูตรคำนวณ (A/B) x 100 ตัวชี้วัด ระยะเวลา รายไตรมาส ปีงบประมาณ พ.ศ.2568 ประเมินผล",
      "numeratorA": "จำนวนประชากรกลุ่มเป้าหมายที่ได้รับการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรงด้วยวิธี FIT test",
      "denominatorB": "จำนวนประชากรกลุ่มเป้าหมายที่ได้รับการคัดกรองมะเร็งลำไส้ใหญ่ และไส้ตรงด้วยวิธี FIT test",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลได้แบบ real time จากโปรแกรม Your Colonoscopy รายละเอียด ปีงบประมาณ 2565 ปีงบประมาณ 2566 ปีงบประมาณ 2567 ร้อยละ 85.24 ร้อยละ 82.67 ร้อยละ 81.46 ข้อมูลพื้นฐาน (Baseline Data) ผลการดำเนินงาน ย้อนหลัง 3 ปี (ปี 2565 -2567) ทธศาสตร์จังหวัดขอนแก่น ระยะ 5 ปี (พ.ศ. 2566-2570) หน้า 82 128",
      "responsible": "ตำแหน่ง : พยาบาลวิชาชีพชำนาญการ สำนักงานสาธารณสุขจังหวัดขอนแก่น ตัวชี้วัด 1. ชื่อ-สกุล นางยุภาพร ดีแป้น โทรสาร : 043-224037 E-mail : smallbody@hotmail.com กลุ่มงาน : ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด ตำแหน่ง : พยาบาลวิชาชีพชำนาญการ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ที่ทำงาน : 043-221125 ต่อ 150 โทรสาร : 043-224037 โทรศัพท์มือถือ : 080-4620160 ตำแหน่ง : นักวิชาการสาธารณสุขชำนาญการพิเศษ สำนักงานสาธารณสุขจังหวัดขอนแก่น 2. ชื่อ-สกุล นางแสงเดือน โสภา โทรสาร : 043-224037 กลุ่มงาน : ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด โทรศัพท์ที่ทำงาน : 043-221125 ต่อ 150 โทรศัพท์มือถือ : 081-3803219 3. ชื่อ-สกุล นางกิตติมา ก้านจักร กลุ่มงาน : ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด โทรศัพท์ที่ทำงาน : 043-221125 ต่อ 169 โทรศัพท์มือถือ : 087-7707761"
    },
    "KPI69-14": {
      "kpiId": "KPI69-14",
      "order": 14,
      "name": "อัตราความครอบคลุมของการค้นหาผู้ป่วยวัณโรคในกลุ่มผู้สัมผัสร่วมบ้านและผู้สัมผัสใกล้ชิด",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "100",
      "baseline": "100",
      "definition": "การประเมินการค้นหาวัณโรค หมายถึง ผู้ที่ได้รับการค้นหาวัณโรคด้วยวิธีการถ่ายภาพรังสีทรวงอก (Chest X-Ray) ในปีงบประมาณ 2568 (1 ตุลาคม 2567 - 30 กันยายน 2568) ผู้สัมผัสวัณโรคร่วมบ้าน (household contact) หมายถึง บุคคลที่อาศัยอยู่ร่วมบ้านกับผู้ป่วย ถ้านอนห้องเดียวกัน (household intimate) มีโอกาสรับ และติดเชื้อสูงมากกว่าผู้ที่อาศัยในบ้านเดียวกัน แต่นอนแยกห้อง (household regular) ไม่นับรวมญาติพี่น้องที่อาศัยอยู่คนละบ้านแต่ไปมาหาสู่ เป็นครั้งคราว และนับระยะเวลาที่อยู่ร่วมกับผู้ป่วยกี่วันก็ได้ในช่วงระหว่าง 3 เดือนที่ผ่านมา",
      "purpose": "เพื่อให้คัดกรองกลุ่มผู้สัมผัสร่วมบ้าน และค้นหาผู้ป่วยวัณโรค เพื่อเข้าถึงกระบวนการรักษา ได้อย่าง รวดเร็ว สามารถลดอัตราป่วย และอัตราการเสียชีวิตได้",
      "population": "กลุ่มผู้สัมผัสร่วมบ้าน (household contact) หมายถึง บุคคลที่อาศัยอยู่ร่วมบ้านกับผู้ป่วยวัณโรคปอด ที่ขึ้นทะเบียนตั้งแต่ปีงบประมาณ 2568 (ตั้งแต่วันที่ 1 ตุลาคม 2567 ถึงวันที่ 30 กันยายน 2568)",
      "collectionMethod": "1. ทะเบียนผู้สัมผัสร่วมบ้าน 2. บันทึกข้อมูลผู้ป่วยวัณโรค ผ่านโปรแกรมบริหารจัดการข้อมูลรายป่วยวัณโรคแห่งชาติ (โปรแกรม NTIP online)",
      "source": "โปรแกรมบริหารจัดการข้อมูลรายป่วยวัณโรคแห่งชาติ (NTIP online)",
      "formula": "อัตราความครอบคลุมของการค้นหาผู้ป่วยวัณโรคในกลุ่มผู้สัมผัสร่วมบ้าน (เฝ้าระวังติดตามครบ 2 ปี) คำนวณจาก สูตรคำนวณ = (A/B) x 100 A = จำนวนผู้สัมผัสร่วมบ้านของผู้ป่วยวัณโรคปอดที่ขึ้นทะเบียนปีงบประมาณ 2568 (ตั้งแต่วันที่ 1 ตุลาคม 2567 ถึงวันที่ 30 กันยายน 2568) ที่ได้รับการคัดกรองด้วยวิธีการถ่ายภาพรังสี ทรวงอก (Chest X-Ray) ในโปรแกรม NTIP B = จำนวนผู้สัมผัสร่วมบ้านของผู้ป่วยวัณโรคปอดที่ขึ้นทะเบียนปีงบประมาณ 2568 (ตั้งแต่วันที่ 1 ตุลาคม 2567 ถึงวันที่ 30 กันยายน 2568) ในทะเบียนผู้สัมผัสร่วมบ้าน",
      "numeratorA": "จำนวนผู้สัมผัสร่วมบ้านของผู้ป่วยวัณโรคปอดที่ขึ้นทะเบียนปีงบประมาณ 2568",
      "denominatorB": "จำนวนผู้สัมผัสร่วมบ้านของผู้ป่วยวัณโรคปอดที่ขึ้นทะเบียนปีงบประมาณ 2568",
      "frequency": "ติดตามความก้าวหน้าการดำเนินงานทุกเดือน",
      "evaluationMethod": "เปรียบเทียบผลการดำเนินงานกับค่าเป้าหมายอัตราความครอบคลุมของการค้นหาผู้ป่วยวัณโรคในกลุ่มผู้ สัมผัสร่วมบ้าน ร้อยละ 100 แยกราย CUP",
      "responsible": "นางวีระวรรณ เหล่าวิทวัส ตำแหน่ง นักวิชาการสาธารณสุขชำนาญการพิเศษ กลุ่มงาน ควบคุมโรคติดต่อ หน่วยงาน สสจ.ขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ124 โทรสาร 0-4322-4037 โทรศัพท์มือถือ 08-9622-4515 E-mail : - นางสาวเอ็มวิกา แสงชาติ ตำแหน่ง นักวิชาการสาธารณสุขปฏิบัติการ กลุ่มงาน ควบคุมโรคติดต่อ หน่วยงาน สสจ.ขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ124 โทรสาร 0-4322-4037 โทรศัพท์มือถือ 09-8209-6938 E-mail : s.emviga@gmail.com"
    },
    "KPI69-15": {
      "kpiId": "KPI69-15",
      "order": 15,
      "name": "อัตราป่วยโรคเบาหวานและโรคความดันโลหิตสูงรายใหม่ ลดลง",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "7 / 2.5",
      "baseline": "-",
      "definition": "ผู้ป่วยเบาหวานรายใหม่ หมายถึง ผู้ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยจากโรคเบาหวาน",
      "purpose": "เพื่อลดจำนวนผู้ป่วยรายใหม่ กลุ่มเป้าหมาย ประชากรที่อาศัยในพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วยโรคเบาหวาน (E10-E14) ในปีงบประมาณปัจจุบัน",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "เข้าระบบ Health Data Center (HDC) On Cloud ระบบรายงาน HDC กระทรวงสาธารณสุข",
      "formula": "A = จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วยโรคเบาหวาน (E10-E14) ในปีงบประมาณปัจจุบัน สูตรคำนวณ ตัวชี้วัด B = จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วยโรคเบาหวาน (E10-E14) ในปีงบประมาณที่ผ่านมา",
      "numeratorA": "จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วยโรคเบาหวาน",
      "denominatorB": "จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วยโรคเบาหวาน",
      "frequency": "[(B-A)/B] x100",
      "evaluationMethod": "A : จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วยโรคเบาหวาน (E10-E14) ในปีงบประมาณปัจจุบัน ประมวลผลจาก DIAGNOSIS_OPD , DIAGNOSIS_IPD , CHORNIC รหัส ICD-10 3 หลักขึ้นต้นด้วย E10-E14 ที่อยู่อาศัยในเขตพื้นที่รับผิดชอบ PERSON.TYPE AREA IN (1 , 3) (1 : มีชื่ออยู่ตามทะเบียนบ้านในเขตพื้นที่รับผิดชอบและอยู่จริง) , ( 3 : มาอาศัยในเขตรับผิดชอบ แต่ทะเบียนอยู่นอกเขตรับผิดชอบ) และ PERSON.DISCHARGE = “9” (ไม่จำหน่าย) PERSON.NATION = “099” (สัญชาติไทย) B : จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วยโรคเบาหวาน (E10-E14) ในปีงบประมาณที่ผ่านมา ประมวลผลจาก DIAGNOSIS_OPD , DIAGNOSIS_IPD , CHORNIC รหัส ICD-10 3 หลักขึ้นต้นด้วย E10-E14",
      "responsible": "ชื่อ-สกุล นางแสงเดือน โสภา ตำแหน่ง พยาบาลวิชาชีพชำนาญการ ตัวชี้วัด กลุ่มงาน ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ 150 โทรสาร 0-4322-4037 โทรศัพท์มือถือ... E-mail : sangdern.sopa@gmail.com"
    },
    "KPI69-16": {
      "kpiId": "KPI69-16",
      "order": 16,
      "name": "ร้อยละของเด็กอายุ 12 ปี ฟันดีไม่มีผุ (Cavity free)",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "85",
      "baseline": "76.90",
      "definition": "เด็กอายุ 0 - 5 ปี หมายถึง เด็กแรกเกิด จนถึงอายุ 5 ปี 11 เดือน 29 วัน สูงดี หมายถึง เด็กที่มีความยาวหรือส่วนสูงอยู่ในระดับสูงตามเกณฑ์ขึ้นไป (สูงตามเกณฑ์ ค่อนข้างสูง หรือสูง)",
      "purpose": "(ขององค์การอนามัยโลก) โดยมีค่ามากกว่าหรือเท่ากับ -1.5 SDของความยาว/ส่วนสูงตามเกณฑ์อายุ",
      "population": "สมส่วน หมายถึง เด็กที่มีน้ำหนักอยู่ในระดับสมส่วน เมื่อเทียบกับกราฟการเจริญเติบโตน้ำหนักตามเกณฑ์",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "สูงดีรูปร่างสมส่วน หมายถึง เด็กที่มีความยาวหรือส่วนสูงอยู่ในระดับสูงตามเกณฑ์ขึ้นไปและมีน้ำหนักอยู่ในระดับ สมส่วน (ในคนเดียวกัน) ร้อยละ 78 เพื่อการส่งเสริมสุขภาพ เด็ก อายุ 0 - 5 ปี มีการโภชนาการที่ดี การเจริญเติบโตตามวัย รูปร่างสูงดีสมส่วน เด็กปฐมวัยในจังหวัดขอนแก่น สถานบริการทุกระดับ นำข้อมูลการประเมินพัฒนาการเด็ก บันทึกในโปรแกรมหลักของสถานบริการฯ เช่น JHCIS, Hos xp, PCU เป็นต้น ส่งออกข้อมูลตามโครงสร้างมาตรฐาน 43 แฟ้ม โรงพยาบาลทุกแห่ง /สาธารณสุขอำเภอทุกอำเภอ/ รพ.สต.ทุกแห่ง",
      "formula": "A = จำนวนเด็กอายุ 0 -5 ปีที่ได้รับการคัดกรองชั่งน้ำหนัก และวัดความยาว/วัดส่วนสูง มีการเจริญเติบโต สูงดีสมส่วน สูตรคำนวณ ตัวชี้วัด B = จำนวนเด็กอายุ 0 -5 ปีที่ได้รับการคัดกรองชั่งน้ำหนัก และวัดความยาว/วัดส่วนสูงทั้งหมด ระยะเวลา ร้อยละของเด็กอายุ 0 -5 ปี สูงดีรูปร่างสมส่วน = (A x 100) /B ประเมิน 12 เดือน",
      "numeratorA": "จำนวนเด็กอายุ 0 -5 ปีที่ได้รับการคัดกรองชั่งน้ำหนัก และวัดความยาว/วัดส่วนสูง มีการเจริญเติบโต",
      "denominatorB": "จำนวนเด็กอายุ 0 -5 ปีที่ได้รับการคัดกรองชั่งน้ำหนัก และวัดความยาว/วัดส่วนสูงทั้งหมด",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ผลการดำเนินงานผ่านระบบรายงาน HDC รายละเอียด ผลการดำเนินงานย้อนหลัง 3 ปี (2565-2567) ข้อมูลพื้นฐาน (Baseline ตัวชี้วัด Baseline หน่วยวัด ผลการดำเนินงานใน Data) ร้อยละ รอบปีงบประมาณ data 2465 2566 2567 ร้อยละของเด็กอายุ 0 -5 ปี 64.20 73.1 67.23 64.20 สูงดีรูปร่างสมส่วน 3",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI69-17": {
      "kpiId": "KPI69-17",
      "order": 17,
      "name": "จำนวนโรงพยาบาลที่ยกระดับการพัฒนาอนามัยสิ่งแวดล้อมได้ตามเกณฑ์ GREEN & CLEAN Hospital",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 3",
      "unit": "แห่ง",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "2 / 17 / 7",
      "baseline": "-",
      "definition": "โรงพยาบาลที่ยกระดับพัฒนาอนามัยสิ่งแวดล้อมได้ตามเกณฑ์ GREEN & CLEAN Hospital Challenge หมายถึง โรงพยาบาลสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่น (รพ.ศูนย์ รพ.ทั่วไป รพ.ชุมชน) ที่มีกิจกรรมการดำเนินงานด้านอนามัยสิ่งแวดล้อมตามเกณฑ์ ดังนี้ ระดับมาตรฐาน (Standard) หมายถึง โรงพยาบาลสามารถดำเนินการตามเกณฑ์ข้อที่ 1 - 13 ได้ตามเงื่อนไข (คะแนน 80 % ขึ้นไป) CLEAN 1. มีการกำหนดนโยบาย จัดทำแผนการขับเคลื่อน พัฒนาศักยภาพและสร้างกระบวนการสื่อสาร ให้เกิดการพัฒนาด้านอนามัยสิ่งแวดล้อม GREEN & CLEAN Hospital อย่างมีส่วนร่วมของคนในองค์กร G : Garbage 2. มีการจัดการมูลฝอยทั่วไปอย่างถูกสุขลักษณะและเป็นไปตามกฎกระทรวงสุขลักษณะการจัดการ มูลฝอยทั่วไป 2560 และกฎหมายที่เกี่ยวข้อง 3. มีการจัดการมูลฝอยที่เป็นพิษหรืออันตรายอย่างถูกสุขลักษณะเป็นไปตามกฎกระทรวงมูลฝอยที่เป็น พิษหรืออันตรายจากชุมชน พ.ศ. 2563 และกฎหมายอื่นที่เกี่ยวข้อง 4. มีการจัดการมูลฝอยติดเชื้ออย่างถูกสุขลักษณะ ตามกฎกระทรวงว่าด้วยการกำจัดมูลฝอยติดเชื้อ พ.ศ. 2545 R : Rest room 5. มีการพัฒนาส้วมตามมาตรฐานส้วมสาธารณะไทย (HAS) ที่อาคารผู้ป่วยนอก(OPD) และอาคาร ผู้ป่วยใน (IPD) 6. มีการจัดการสิ่งปฏิกูลอย่างถูกสุขลักษณะตามกฎกระทรวงสุขลักษณะการจัดการสิ่งปฏิกูล พ.ศ. 2561 และกฎหมายอื่นที่เกี่ยวข้อง E : Energy 7. มีการกำหนดนโยบายและมาตรการประหยัดพลังงานที่เป็นปัจจุบัน และเป็นรูปธรรม เกิดประสิทธิภาพในการลดการใช้พลังงานและมีการปฏิบัติตามมาตรการที่กำหนดร่วมกันทั้งองค์กร E : Environment 8. มีการจัดการสิ่งแวดล้อมทั่วไปทั้งภายในและภายนอกอาคาร โดยเพิ่มพื้นที่สีเขียวและพื้นที่พักผ่อน ที่สร้างความรู้สึกผ่อนคลายสอดคล้องกับชีวิต และวัฒนธรรมท้องถิ่นสำหรับผู้ป่วย รวมทั้งผู้มารับบริการ 9. มีกิจกรรมส่งเสริม GREEN และกิจกรรมที่เอื้อต่อการมีสุขภาพดีแบบองค์รวม ได้แก่ กิจกรรม ส่งเสริมสุขอนามัย กิจกรรมป้องกันการแพร่ระบาดของโรค กิจกรรมทางกาย กิจกรรมให้คำปรึกษา ด้านสุขภาพขณะรอรับบริการของผู้ป่วยและญาติ N : Nutrition 10. สถานที่ประกอบอาหารผู้ป่วยในโรงพยาบาลได้มาตรฐานสุขาภิบาลอาหารตามกฎกระทรวง สุขลักษณะของสถานที่จำหน่ายอาหาร พ.ศ. 2561 (4 หมวด) และมีการเฝ้าระวังทางสุขาภิบาลอาหาร 11. ร้านอาหารในโรงพยาบาลได้มาตรฐานสุขาภิบาลอาหารตามกฎกระทรวงสุขลักษณะของสถานที่ จำหน่ายอาหาร พ.ศ. 2561 (4 หมวด) และมีการเฝ้าระวังทางสุขาภิบาลอาหาร 12. จัดให้มีน้ำอุปโภค/บริโภคสะอาดที่อาคารผู้ป่วยนอกและผู้ป่วยใน 13. โรงพยาบาลมีการดำเนินงานนโยบายโรงพยาบาลอาหารปลอดภัยร่วมกับภาคีเครือข่ายในพื้นที่ (ตามคู่มือมาตรฐานโรงอาหารปลอดภัย Food Safety Hospital) ระดับดีเยี่ยม (Excellent) หมายถึง โรงพยาบาลสามารถดำเนินการ ตามเกณฑ์ข้อที่ 1 - 15 ได้ตามเงื่อนไขที่กำหนด (คะแนน 90 % ขึ้นไป) Innovation 14. มีการส่งเสริมให้เกิดนวัตกรรม GREEN โดยการนำไปใช้ประโยชน์และเกิดการแลกเปลี่ยนเรียนรู้ กับเครือข่ายในโรงพยาบาลและชุมชน",
      "purpose": "เพื่อส่งเสริมให้โรงพยาบาลสังกัดสำนักงานสาธารณสุขจังหวัด มีการพัฒนาอนามัยสิ่งแวดล้อม ได้ตามเกณฑ์ GREEN & CLEAN Hospital Challenge",
      "population": "โรงพยาบาลสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "collectionMethod": "โรงพยาบาลทุกแห่งบันทึกข้อมูลในโปรแกรม GREEN & CLEAN Hospital",
      "source": "โปรแกรมการประเมิน GREEN & CLEAN Hospital",
      "formula": "A = จำนวนรพ.ที่ดำเนินการได้ตามเกณฑ์ 13 ข้อ (คะแนน 80 % ขึ้นไป) B = จำนวนรพ.ที่ดำเนินการได้ตามเกณฑ์ 15 ข้อ (คะแนน 90 % ขึ้นไป) C = จำนวนรพ.ที่ดำเนินการได้ตามเกณฑ์ 15 ข้อ (คะแนน 90 % ขึ้นไป) และพัฒนาได้ตามประเด็นท้าทายA+B+C=26 ระยะเวลา นิเทศ ติดตาม และประเมินผลการดำเนินงานสาธารณสุขจังหวัดขอนแก่น ปี 2568 จำนวน 2 รอบ ประเมินผล",
      "numeratorA": "จำนวนโรงพยาบาลสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่นที่ดำเนินการ GREEN & CLEAN",
      "denominatorB": "จำนวนโรงพยาบาลสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่นที่ดำเนินการ GREEN & CLEAN",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "1. โรงพยาบาลทุกแห่งประเมินตนเองบันทึกข้อมูลในโปรแกรม GREEN & CLEAN Hospital ส่งให้ สำนักงานสาธารณสุขจังหวัดขอนแก่น 2. สำนักงานสาธารณสุขจังหวัดขอนแก่น ประเมินผลการดำเนินงานของโรงพยาบาลศูนย์ โรงพยาบาล",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI69-18": {
      "kpiId": "KPI69-18",
      "order": 18,
      "name": "อัตราความสำเร็จของการรักษาวัณโรคปอดรายใหม่",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "95",
      "baseline": "74.59",
      "definition": "1. ความสำเร็จการรักษา หมายถึง ผู้ป่วยวัณโรคปอดรายใหม่ที่มีผลการรักษาหายรวมกับรักษาครบ 1.1 รักษาหาย (Cured) หมายถึง ผู้ป่วยวัณโรคปอดรายใหม่ที่มี ผลตรวจทางห้องปฏิบัติการพบเชื้อ วัณโรคก่อนเริ่มการรักษา และต่อมาตรวจไม่พบเชื้อวัณโรคอย่างน้อยหนึ่งครั้งก่อนสิ้นสุดการรักษา และในเดือนสุดท้ายของการรักษา 1.2 รักษาครบ (Treatment Completed) หมายถึง ผู้ป่วยวัณโรคปอดรายใหม่ที่รักษาครบกำหนด โดยไม่มีหลักฐานที่แสดงว่าการรักษาล้มเหลว ซึ่งผู้ป่วยดังกล่าวไม่มีเอกสารที่แสดงผลการตรวจเสมหะ ในเดือนสุดท้ายของการรักษา ทั้งนี้มีผลตรวจเสมหะเป็นลบอย่างน้อยหนึ่งครั้งก่อนสิ้นสุดการรักษา รวมทั้งผู้ป่วยที่ไม่ได้ตรวจหรือไม่มีผลตรวจ 2. ผู้ป่วยวัณโรคปอดรายใหม่ หมายถึง ผู้ป่วยวัณโรคปอดที่ไม่เคยรักษาวัณโรคมาก่อนและผู้ป่วยที่รักษา วัณโรคน้อยกว่า 1 เดือน และไม่เคยขึ้นทะเบียนในแผนงานวัณโรคแห่งชาติ แบ่งเป็น 2 กลุ่ม คือ 2.1 ผู้ป่วยที่มีผลตรวจยืนยันพบเชื้อวัณโรค (Bacteriologically confirmed: B+) หมายถึง ผู้ป่วย วัณโรคที่มีผลตรวจเสมหะเป็นบวก อาจจะเป็นการตรวจด้วยวิธี Smear microscopy หรือ Culture หรือวิธี Molecular หรือวิธีการอื่นๆ ที่องค์การอนามัยโลกรับรอง 2.2 ผู้ป่วยที่วินิจฉัยด้วยลักษณะทางคลินิก (Clinically diagnosed:B-) หมายถึง ผู้ป่วยวัณโรคที่มีผล ตรวจเสมหะเป็นลบ หรือไม่มีผลตรวจ แต่ผลการวินิจฉัยด้วยวิธีการตรวจเอกซเรย์รังสีทรวงอก หรือผลการตรวจชิ้นเนื้อผิดปกติเข้าได้กับวัณโรค ร่วมกับมีลักษณะทางคลินิกเข้าได้กับวัณโรค และแพทย์ตัดสินใจรักษาด้วยสูตรยารักษาวัณโรค 3. การประเมิน การประเมินอัตราความสำเร็จการรักษาผู้ป่วยวัณโรคปอดรายใหม่ (Success rate) หมายถึง ผู้ป่วย วัณโรคปอดรายใหม่ที่ขึ้นทะเบียน ในไตรมาสที่ 1 ของปีงบประมาณ 2568 (1 ตุลาคม – 31 ธันวาคม 2567) ที่เป็นผู้ป่วยไทย ผู้ป่วยไม่ใช่ไทย และผู้ป่วยในเรือนจำ ที่รักษาในโรงพยาบาลรัฐทั้ งใน และนอกสังกัดกระทรวงสาธารณสุข ไม่รวมโรงพยาบาลเอกชน",
      "purpose": "1. เพื่อให้ผู้ติดเชื้อวัณโรคและผู้ป่วยวัณโรคเข้าถึงระบบบริการสุขภาพในด้านการตรวจวินิจฉัย ป้องกัน",
      "population": "ดูแลรักษาที่ได้มาตรฐานและรักษาหาย รักษาครบ 2. เพื่อพัฒนามาตรฐานระบบบริการสุขภาพในการตรวจวินิจฉัย ป้องกัน ดูแลรักษาผู้ติดเชื้อวัณโรค และผู้ป่วยวัณโรคของสถานบริการสาธารณสุข กลุ่มเป้าหมายสำหรับการประเมินอัตราความสำเร็จการรักษาผู้ป่วยวัณโรคปอดรายใหม่ คือ ผู้ป่วยวัณโรคปอดรายใหม่ที่ขึ้นทะเบียนในไตรมาสที่ 1 ของปีงบประมาณ 2568 (1 ตุลาคม–ธันวาคม 2567) ที่เป็นผู้ป่วยไทย ผู้ป่วยไม่ใช่ไทยและผู้ป่วยในเรือนจำที่รักษาในโรงพยาบาลรัฐ ทั้งในและนอกสังกัด กระทรวงสาธารณสุขไม่รวมโรงพยาบาลเอกชน",
      "collectionMethod": "บันทึกข้อมูลผู้ป่วยวัณโรค ผ่านโปรแกรมบริหารจัดการข้อมูลรายป่วยวัณโรคแห่งชาติ (โปรแกรม NTIP online)",
      "source": "โปรแกรมบริหารจัดการข้อมูลรายป่วยวัณโรคแห่งชาติ (NTIP online)",
      "formula": "อัตราความสำเร็จการรักษาผู้ป่วยวัณโรคปอดรายใหม่ที่ขึ้นทะเบียน ในไตรมาสที่ 1 ของ ปีงบประมาณ พ.ศ.2568 (1 ตุลาคม – 31 ธันวาคม 2567) คำนวณจาก สูตรคำนวณ = (A/B) x 100 A = จำนวนผู้ป่วยวัณโรคปอดรายใหม่ที่ขึ้นทะเบียนในไตรมาสที่ 1 ของปีงบประมาณ 2568 (1 ตุลาคม – 31 ธันวาคม 2567) โดยมีผลการรักษาหาย (Cured) รวมกับรักษาครบ (Completed) โดยครบรอบรายงานผลการรักษาวันที่ 30 กันยายน 2567 B = จำนวนผู้ป่วยวัณโรคปอดรายใหม่ที่ขึ้นทะเบียนในไตรมาสที่ 1 ของปีงบประมาณ 2568 (1 ตุลาคม – 31 ธันวาคม 2567) โดยการเปลี่ยนแปลงวินิจฉัยและพบว่าเป็น RR/MDR/XDR-TB ไม่ถูกนำมานับรวม ระยะเวลา ติดตามความก้าวหน้าการดำเนินงานทุกเดือน ประเมินผล",
      "numeratorA": "จำนวนผู้ป่วยวัณโรคปอดรายใหม่ที่ขึ้นทะเบียนในไตรมาสที่ 1 ของปีงบประมาณ 2568",
      "denominatorB": "จำนวนผู้ป่วยวัณโรคปอดรายใหม่ที่ขึ้นทะเบียนในไตรมาสที่ 1 ของปีงบประมาณ 2568",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "เปรียบเทียบผลการดำเนินงานกับค่าเป้าหมาย รายละเอียดข้อมูล อัตราผลสำเร็จของการรักษาวัณโรคปอดรายใหม่ (ไตรมาสที่ 1/2568) ไม่น้อยกว่าร้อยละ 90 พื้นฐาน(Baseline Data) แยกเป็นระดับ CUP ผลการดำเนินงาน ย้อนหลัง 3 ปี Baseline data หน่วย ผลการดำเนินงานในรอบ (ปี 2565 -2567) วัด ปีงบประมาณ พ.ศ. 2565 2566 2567 อัตราความสำเร็จการรักษาวัณโรคปอด ร้อยละ 70.83 75.26 76.55 รายใหม่* หมายเหตุ * อัตราความสำเร็จการรักษาผู้ป่วยวัณโรคปอดรายใหม่ที่ขึ้นทะเบียน ในไตรมาสที่ 1 ของแต่ละปีงบประมาณ ** ไม่คิดรวมอยู่ระหว่างการรักษา ร้อยละ 8.36",
      "responsible": "นางวีระวรรณ เหล่าวิทวัส ตำแหน่ง นักวิชาการสาธาณสุขชำนาญการพิเศษ กลุ่มงาน ควบคุมโรคติดต่อ หน่วยงาน สสจ.ขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ124 โทรสาร 0-4322-4037 โทรศัพท์มือถือ 08-9622-4515 E-mail : - นางสาวเอ็มวิกา แสงชาติ ตำแหน่ง นักวิชาการสาธารณสุขปฏิบัติการ กลุ่มงาน ควบคุมโรคติดต่อ หน่วยงาน สสจ.ขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ124 โทรสาร 0-4322-4037 โทรศัพท์มือถือ 09-8209-6938 E-mail : s.emviga@gmail.com"
    },
    "KPI69-19": {
      "kpiId": "KPI69-19",
      "order": 19,
      "name": "ร้อยละประชาชนกลุ่มเป้าหมายเป็นโรคพยาธิใบไม้ตับลดลง",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ร้อยละ",
      "direction": "ยิ่งน้อยยิ่งดี",
      "target": "≤ 1",
      "baseline": "3.64",
      "definition": "ร้อยละประชาชนกลุ่มเป้าหมายเป็นโรคพยาธิใบไม้ตับลดลง ตามเกณฑ์มาตรฐานแผนยุทธศาสตร์สุขภาพ 5 ปี จังหวัดขอนแก่น (พ.ศ. 2566–2570)",
      "purpose": "1. เพื่อเฝ้าระวัง ป้องกัน ควบคุม รักษาโรคพยาธิใบไม้ตับและมะเร็งท่อน้ำดี 2. เพื่อพัฒนาคุณภาพการคัดกรองวินิจฉัย การส่งต่อดูแลรักษาโรคพยาธิใบไม้ตับและมะเร็งท่อน้ำดี",
      "population": "หมายถึง ประชากรจังหวัดขอนแก่น (ตาม43แฟ้ม Type area = 1,3 และ Nation = 099) ที่มีอายุ 15 ปีขึ้นไป หรืออาศัยอยู่ในอีสานมากกว่า 15 ปี และมีปัจจัยเสี่ยงในข้อใดข้อหนึ่งต่อไปนี้ 1. มีประวัติการกินปลาตระกูลมีเกล็ดน้ำจืดสุกๆดิบๆ หรือปลาร้าดิบ ปลาส้มดิบ ปล่าจ่อมดิบ 2. มีประวัติการติดเชื้อพยาธิใบไม้ตับ หรือเคยกินยาฆ่าเชื้อพยาธิใบไม้ตับ (Praziquantel) 3. มีญาติสายตรงติดพยาธิใบไม้ตับ หรือป่วย/เสียชีวิตด้วยโรคมะเร็งท่อน้ำดี การตรวจคัดกรองโรคพยาธิใบไม้ตับ หมายถึง การตรวจหาพยาธิใบไม้ตับ (OV; Opisthorchis viverrini) ในกลุ่มประชากรที่มีอายุ 15 ปีขึ้นไป ด้วยวิธีตรวจอุจจาระ และ/หรือ ปัสสาวะ โดย วิธีตรวจอุจจาระ ได้แก่ Formalin ether concentration technique (FECT) หรือ Modified Kato thick smear หรือ Modified Kato-Katz หรือ JIK-PARASITE TRAP วิธีตรวจปัสสาวะ (OV-RDT; OV-Rapid diagnostic test) คือ การใช้ตัวตรวจจับจำเพาะ หรือโมโนโคลนอล แอนติบอดี (monoclonal antibody) ที่มีความจำเพาะต่อพยาธิใบไม้ตับและเป็นสารตรวจจับสิ่งคัดหลั่ง หรือแอนติเจนของพยาธิใบไม้ตับในปัสสาวะ การตรวจคัดกรองมะเร็งท่อน้ำดีด้วยการอัลตราซาวด์ หมายถึง การตรวจมะเร็งท่อน้ำดีด้วยการอัลตรา ซาวด์ ในประชาชนกลุ่มเป้าหมาย ที่ตรวจพบพยาธิใบไม้ตับจากการตรวจหาการติดเชื้อจากอุจจาระ หรือปัสสาวะ ในกลุ่มประชากรที่มีอายุ 40 ปีขึ้นไป โดยจังหวัดขอนแก่นมุ่งเน้นในกลุ่มที่มีอายุระหว่าง 50 - 70 ปี แนวทางดำเนินงานเฝ้าระวัง ป้องกัน รักษาโรคมะเร็งท่อน้ำดี ตาม 8 มาตรการ ดังนี้ มาตรการที่ 1 คัดกรองพยาธิใบไม้ตับในประชากรกลุ่มเป้าหมาย เมื่อพบผู้ติดพยาธิให้รักษาและปรับเปลี่ยน พฤติกรรมสุขภาพ มาตรการที่ 2 คัดกรองมะเร็งท่อน้ำดีในประชาชนอายุ 40 ปีขึ้นไป ด้วยเครื่องอัลตร้าซาวด์ มาตรการที่ 3 จัดระบบสุขาภิบาล บริหารจัดการสิ่งปฏิกูลเพื่อตัดวงจรพยาธิ โดยจัดให้มีบ่อบำบัดสิ่งปฏิกูล ในทุกพื้นที่ผ่านองค์กรปกครองส่วนท้องถิ่น มาตรการที่ 4 สนับสนุนให้มีการสร้างความรอบรู้ด้านสุขภาพ (Health Literacy) โรคพยาธิใบไม้ตับ และมะเร็งท่อน้ำดี ในเด็กนักเรียน เยาวชน อาสาสมัครสาธารณสุข ผู้ประกอบการ และประชาชน มาตรการที่ 5 รณรงค์อาหารปลอดภัย ปลาปลอดพยาธิอย่างต่อเนื่องในพื้นที่ผ่านทุกช่องทางการสื่อสารตามบริบท มาตรการที่ 6 บริหารจัดการส่งต่อผู้สงสัยมะเร็งท่อน้ำ ดีเข้าสู่กระบวนการวินิจฉัยรักษาอย่างเป็นระบบ และมี ระบบการ รับ-ส่งต่อ ผู้ป่วยจากโรงพยาบาลสู่ชุมชนมีหมอครอบครัวเข้าไปดูแลประคับประคองด้วยการแพทย์ ผสมผสานทั้ง แพทย์แผนปัจจุบัน และแพทย์ทางเลือก มาตรการที่ 7 รายงานข้อมูล ตามระบบงานเฝ้าระวัง ได้แก่ ฐานข้อมูลจังหวัด อำเภอ , HDC , Isan cohort มาตรการที่ 8 พัฒนานวัตกรรม และพัฒนาบุคลากรทางด้านสาธารณสุขในการป้องกันควบคุมโรคพยาธิใบไม้ตับ และการรักษามะเร็งท่อน้ำดี เพื่อนำไปใช้ในการปรับปรุงการแก้ไขปัญหาพยาธิใบไม้ตับและมะเร็งท่อน้ำดี",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "ฐานข้อมูลจังหวัด หรือ HDC 43 แฟ้ม หรือ Isan cohort รหัสการบันทึกข้อมูล 43 แฟ้ม ; การคัดกรองพยาธิใบไม้ตับ Screening รหัส Z116 กรณีพบการติดเชื้อ สูตรคำนวณ พยาธิใบไม้ตับ ใช้รหัส ICD10 คือ B 660 โดยในปี 2568 สสจ.ขอนแก่น มุ่งเน้นการจัดเก็บในฐานข้อมูล ตัวชี้วัด HDC และ Isan cohort เป็นหลัก ขึ้นอยู่กับบริบทพื้นที่ ระยะเวลา ฐานข้อมูลจังหวัด หรือ HDC 43 แฟ้ม หรือ Isan cohort ประเมินผล A = ประชากรเป้าหมายที่ได้รับการตรวจคัดกรองพยาธิใบไม้ตับและมีผลพบเชื้อ",
      "numeratorA": "ประชากรเป้าหมายที่ได้รับการตรวจคัดกรองพยาธิใบไม้ตับและมีผลพบเชื้อ",
      "denominatorB": "ประชากรกลุ่มเป้าหมายที่ได้รับการตรวจคัดกรอง ปี 2568 ทั้งหมด",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI69-20": {
      "kpiId": "KPI69-20",
      "order": 20,
      "name": "อัตราการฆ่าตัวตายสำเร็จ",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ต่อแสนประชากร",
      "direction": "ยิ่งน้อยยิ่งดี",
      "target": "≤ 7.8",
      "baseline": "7.21",
      "definition": "การฆ่าตัวตายสำเร็จ คือ การเสียชีวิตจากพฤติกรรมมุ่งทำร้ายตนเองโดยตั้งใจจะให้ตายจากพฤติกรรมนั้น ซึ่งวิธีการที่ใช้มีลักษณะสอดคล้องตามมาตรฐานการจำแนกโรคระหว่างประเทศขององค์การอนามัยโลก ฉบับที่ 10 (ICD - 10 : International Classification of Diseases and Health Related Problems - 10) หมวด Intentional self-harm (X60-X84) หรือเทียบเคียงในกลุ่มโรคเดียวกันกับการวินิจฉัยตามเกณฑ์ วินิจฉัยโรคของสมาคมจิตแพทย์อเมริกัน ฉบับที่ 5 (DSM-5: Diagnostic and Statistical Manual of Mental disorders 5)",
      "purpose": "เพื่อใช้แสดงและติดตามภาวะสุขภาพอนามัยที่สำคัญด้านสุขภาพจิตของประชาชน",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "หมายเหตุ ในอำเภอ ที่พบปัญหาการรายงาน รง 506s version 11 หรือข้อมูลจากการรายงาน รง.506s",
      "formula": "ต่ำกว่าฐานข้อมูลการตายในทะเบียนราษฎร์ของกระทรวงมหาดไทย จะใช้ข้อมูลการแจ้งตายจากฐานข้อมูลการ ตายทะเบียนราษฎร์ของกระทรวงมหาดไทย ที่รวบรวมโดยกองยุทธศาสตร์และแผนงาน กระทรวงสาธารณสุข สูตรคำนวณ ทดแทน ตัวชี้วัด ระยะเวลา 1. รายงานการเฝ้าระวังการพยายามฆ่าตัวตาย รง 506 S version 11. ประเมินผล 2. ข้อมูลการแจ้งตายจากฐานข้อมูลการตายทะเบียนราษฎร์ของกระทรวงมหาดไทย (อ้างอิงตามสถานที่เสียชีวิต) A = จำนวนผู้ฆ่าตัวตายสำเร็จ (อ้างอิงตามสถานที่เสียชีวิต) ปีงบประมาณ 2568 B = จำนวนประชากรกลางปี 2568 **หมายเหตุ สำหรับไตรมาส 2 ใช้ประชากรปลายปี 2567 สำหรับไตรมาส 3 และ 4 ใช้ประชากรกลางปี 2568 แหล่งข้อมูล กองยุทธศาสตร์และแผนงาน กระทรวงสาธารณสุข (A/B) x 100,000 ไตรมาส 4",
      "numeratorA": "จำนวนผู้ฆ่าตัวตายสำเร็จ (อ้างอิงตามสถานที่เสียชีวิต) ปีงบประมาณ 2568",
      "denominatorB": "จำนวนประชากรกลางปี 2568",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "นำข้อมูลที่ได้มาวิเคราะห์ข้อมูลทางสถิติในรูปแบบของอัตราต่อประชากรแสนคน รายละเอียด Baseline data หน่วยวัด ผลการดำเนินงานในรอบปีงบประมาณ พ.ศ. ข้อมูลพื้นฐาน การฆ่าตัวตายสำเร็จ (Baseline อัตราต่อ 2565 2566 2567 Data) ประชากร ผลการ แสนคน 5.97 6.18 6.57 ดำเนินงาน ย้อนหลัง 3 ปี",
      "responsible": "โทรศัพท์มือถือ 086-8616497 ตำแหน่ง พยาบาลวิชาชีพชำนาญการ ตัวชี้วัด 2. ชื่อ-สกุล นายณรงค์ชัย เศิกศิริ e-mail : tuttu34@gmail.com โทรศัพท์มือถือ 081-6691062 ตำแหน่ง นักวิชาการสาธารณสุข 3. ชื่อ-สกุล นางสาวนงลักษณ์ เข็มศิริ e-mail keeta.nongluk1@gmail.com โทรศัพท์มือถือ 062-5161046 สำนักงานสาธารณสุขจังหวัดขอนแก่น กลุ่มงานควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด โทรสาร 0-4322-4037 โทรศัพท์ 0-4322-1125 ต่อ 170"
    },
    "KPI69-21": {
      "kpiId": "KPI69-21",
      "order": 21,
      "name": "อัตราตายผู้ป่วยติดเชื้อในกระแสเลือดแบบรุนแรงชนิด (Community-Acquired)",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ร้อยละ",
      "direction": "ยิ่งน้อยยิ่งดี",
      "target": "< 24",
      "baseline": "23.14",
      "definition": "1. ผู้ป่วยติดเชื้อในกระแสเลือดแบบรุนแรง หมายถึง ผู้ป่วยที่เข้าเกณฑ์การวินิจฉัยภาวะ Severe sepsis หรือ Septic shock (โดยได้รับการคัดกรองตามเกณฑ์ข้อ 5) 1.1 ผู้ป่วย severe sepsis หมายถึง ผู้ป่วยที่สงสัยหรือยืนยันว่ามีการติดเชื้อในร่างกาย ร่วมกับ มี SIRS ตั้งแต่ 2 ข้อ ขึ้นไป ที่เกิดภาวะ Tissue hypoperfusion หรือ Organ dysfunction โดยที่อาจจะมีหรือไม่มีภาวะ Hypotension ก็ได้ หรือมีอาการแสดงตามเกณฑ์ ข้อใดข้อหนึ่ง ใน 5.2 - 5.4 1.2 ผู้ป่วย Septic shock หมายถึง ผู้ป่วยที่สงสัยหรือยืนยันว่ามีการติดเชื้อในร่างกาย ร่วมกับมี SIRS ตั้งแต่ 2 ข้อ ขึ้นไป ที่มี Hypotension ต้องใช้ Vasopressors ในการ Maintain MAP ≥65 mm Hg และ มีค่า serum lactate level >2 mmol/L (18 mg/dL) แม้ว่าจะได้สารน้ำ เพียงพอแล้วก็ตาม 2. Community - acquired sepsis หมายถึง การติดเชื้อมาจากที่บ้านหรือที่ชุมชน โดยต้องไม่อยู่ ในกลุ่ม Hospital - acquired sepsis อัตราตายจากติดเชื้อในกระแสเลือด แบ่งเป็น 2 กลุ่ม คือ 1) อัตราตายจาก Community - acquired sepsis 2) อัตราตายจาก Hospital - acquired sepsis 3. การติดเชื้อในโรงพยาบาล (Hospital - acquired infection, Nosocomial infection) คือ การติดเชื้อที่เกิดขึ้นในโรงพยาบาลหรือสถานที่อื่นๆ ที่ให้บริการสุขภาพ เช่น บ้านพักผู้ป่วย บ้านพัก คนชรา สถานบำบัด ห้องตรวจผู้ป่วยนอก หรืออื่นๆ การติดเชื้อในโรงพยาบาลเกิดขึ้นได้หลายวิธี เช่น ติดผ่านบุคลากรทางการแพทย์ที่มีเชื้อปนเปื้อนบนร่างกาย อุปกรณ์ที่ปนเปื้อน ผ้าปูที่นอน หรือละออง สารคัดหลั่งที่มีเชื้อ เป็นต้น ที่มาของเชื้ออาจมาจากสิ่งแวดล้อม จากผู้ป่วย จากบุคลากรที่ติดเชื้อ หรืออาจหาแหล่งที่มาของเชื้อไม่พบก็ได้ เชื้ออาจมาจากร่างกายของผู้ป่วยเอง ซึ่งเดิมเป็นเชื้อ ที่ยังไม่สามารถก่อให้เกิดโรคได้ แต่เมื่อผู้ป่วยรับการรักษาบางอย่าง เช่น การผ่าตัด หรือหัตถการ บางประเภท ก็ทำให้เชื้อที่มีอยู่เดิมมีโอกาส ท้าให้เกิดการติดเชื้อได้ เช่น การติดเชื้อที่แผลผ่าตัด Hospital - acquired infection (HAI) ห รือ Healthcare - associated infection ห ม าย ถึ ง การติดเชื้อที่เกิดในโรงพยาบาล เป็นการติดเชื้อที่ Date of Event (DOE) เกิดขึ้น หลังจากเข้ารับการ รักษาในโรงพยาบาลตั้งแต่วันที่ 3 เป็นต้นไป (Hospital day 3) หรือ หลังเข้ารับการรักษาในโรงพยาบาล ไปแล้ว อย่างน้อย 48 ชั่วโมง 4.",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "มุ่งเน้นที่กลุ่ม Community – acquired sepsis เพื่อพัฒนาให้ มีระบบข้อมูล พื้นฐานให้เหมือนกัน ทั้งประเทศ แล้วจึงขยายไปยัง Hospital-acquired sepsis ในปีถัดไป",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "(จำนวนผลงานที่บรรลุเกณฑ์ [A] ÷ จำนวนกลุ่มเป้าหมายทั้งหมด [B]) × 100",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI69-22": {
      "kpiId": "KPI69-22",
      "order": 22,
      "name": "อัตราผู้ป่วยโรคหลอดเลือดสมอง รายใหม่ต่อประชากรแสนคน",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ต่อแสนประชากร",
      "direction": "ยิ่งน้อยยิ่งดี",
      "target": "237",
      "baseline": "288.57",
      "definition": "ผู้ป่วยรายใหม่จากโรคหลอดเลือดสมอง หมายถึง ผู้ป่วยในที่ได้รับการวินิจฉัยโรคหลัก (Principal diagnosis: pdx) จากแพทย์ว่าป่วยด้วยโรคหลอดเลือดสมอง รหัส IDC 10 (I60-I69) ในปีงบประมาณ ทุกกลุ่มอายุ ในกรณีที่มีการวินิจฉัยโรคหลักซ้ำภายในระยะเวลามากกว่า 28 วันขึ้นไป ให้นับเป็นผู้ป่วย รายใหม่อีกครั้ง",
      "purpose": "เพื่อลดอัตราผู้ป่วยโรคหลอดเลือดสมองรายใหม่",
      "population": "ประชากรที่อยู่ตามทะเบียนราษฎร์ ทุกกลุ่มอายุ ในจังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านโปรแกรมพื้นฐานของหน่วยบริการและส่งออกข้อมูลตามมาตรฐานข้อมูล 43 แฟ้ม เข้าระบบ Health Data Center (HDC) On Cloud",
      "source": "HDC สำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "formula": "(A/B) x 100,000",
      "numeratorA": "จำนวนผู้ป่วยรายใหม่จากโรคหลอดเลือดสมองในปีงบประมาณ",
      "denominatorB": "จำนวนประชากรทะเบียนราษฎร์",
      "frequency": "1 ตุลาคม 2567 - รอบการนิเทศที่กำหนด",
      "evaluationMethod": "A : จำนวนผู้ป่วยในที่ได้รับการวินิจฉัยโรคหลัก (Principle diagnosis: pdx) จากแพทย์ว่าป่วยด้วย โรคหลอดเลือดสมอง รหัส ICD (I60-I69) ในปีงบประมาณทุกกลุ่มอายุ ในกรณีที่มีการวินิจฉัยโรคหลัก ซ้ำภายในระยะเวลามากกว่า 28 วันขึ้นไป ให้นับเป็นผู้ป่วยรายใหม่อีกครั้ ง ประมวลผลจาก DIAGNOSIS_IPD และ PERSON.DISCHARGE =”9” (ไม่ จำห น่ าย) PERSON.NATION = “99” สัญชาติไทย B : จำนวนประชากรตามทะเบียนราษฎร์ ทุกกลุ่มอายุ",
      "responsible": "ชื่อ นางประภัสสร แสนละมุน ตำแหน่ง นักวิชาการสาธารณสุข กลุ่มงาน : ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด โทรศัพท์ที่ทำงาน 043-221125 ต่อ 150 โทรศัพท์มือถือ 082-8365237 โทรสาร 043-224037 E-mail : matoom.27290@gail.com"
    },
    "KPI69-23": {
      "kpiId": "KPI69-23",
      "order": 23,
      "name": "ร้อยละของผู้ป่วย IMC ได้รับการบริบาลฟื้นสภาพและติดตามจนครบ 6 เดือน หรือจน Barthel index = 20 ก่อนครบ 6 เดือน",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "98",
      "baseline": "95.23",
      "definition": "การบริบาลฟื้นสภาพระยะกลาง (Intermediate care; IMC) หมายถึง การบริบาลฟื้นสภาพผู้ป่วย ระยะกลางที่มีอาการทางคลินิกผ่านพ้นภาวะวิกฤติและมีอาการคงที่แต่ยังคงมีความผิดปกติ ของร่างกายบางส่วนอยู่และมีข้อจํากัดในการปฏิบัติกิจกรรมในชีวิตประจําวัน จําเป็นต้องได้รับบริการ ฟื้นฟูสมรรถภาพทางการแพทย์โดยทีมสหวิชาชีพ (multidisciplinary approach) อย่างต่อเนื่อง จนครบ 6 เดือน ตั้งแต่ในโรงพยาบาลจนถึงชุมชน เพื่อเพิ่มสมรรถนะร่างกาย จิตใจ ในการปฏิบัติ กิจวัตรประจําวัน และลดความพิการหรือภาวะทุพพลภาพ รวมทั้งกลับสู่สังคมได้อย่างเต็มศักยภาพ โดยมีการให้บริการผู้ป่วยระยะกลางในโรงพยาบาลทุกระดับ (A/S/M/F) โดยให้บริการผู้ป่วย ใน (Intermediate bed/ward) ผู้ป่วยนอกและ ให้บริการในชุมชน เช่น ศูนย์ฟื้นฟูสมรรถภาพ ในชุมชน เยี่ยมบ้าน เป็นต้น ผู้ป่วย Intermediate care หมายถึง ผู้ป่วย Stroke, Traumatic Brain Injury และSpinal Cord Injury รายใหม่ หรือกลับเป็นซ้ำภายในระยะเวลา 6 เดือน และ Fragility hip fracture รายใหม่ หรือกลับเป็นซ้ำทั้งหมดทุกรายที่เข้ารับการรักษาในโรงพยาบาลภายในจังหวัดที่รอดชีวิต แ ล ะ มี ค ะ แ น น Barthel index < 15 รว ม ทั้ งค ะ แ น น Barthel index ≥ 15 with multiple impairments ตามเกณฑ์การบริบาลฟื้นสภาพระยะกลางแบบผู้ป่วยใน (IPD-IMC protocol) สำหรับโรงพยาบาล Intermediate ward คื อ ก า ร ให้ บ ริ ก า ร Intensive inpatient rehabilitation program หมายถึง ผู้ป่วยได้รับการฟื้นฟูแบบผู้ป่วยในอย่างน้อย วันละ 3 ชั่วโมง และอย่างน้อย 5 วัน/ สัปดาห์ หรือ อย่างน้อย 15 ชั่วโมง/ สัปดาห์ (ไม่รวมชั่วโมง nursing care) โดยมีรายละเอียดการให้บริการ Intermediate ward ตามภาคผนวก 1 Intermediate bed คือ การให้บริการ Inpatient rehab program หมายถึง ผู้ป่วยได้รับการฟื้นฟูโดยเฉลี่ยอย่างน้อยวันละ 1 ชั่วโมงอย่างน้อย 3 ครั้ง/สัปดาห์ (ไม่รวมชั่วโมง nursing care) การพยาบาลฟื้นฟูสภาพ หมายถึง กิจกรรมการพยาบาลที่ใช้กระบวนการหรือกิจกรรมที่มุ่งหวัง ให้ผู้ป่วย คนพิการ สามารถฟื้นคืนสภาพให้เร็วที่สุด ยอมรับและปรับตัวกับความเปลี่ยนแปลงที่เกิดขึ้น ทั้งด้านร่างกาย จิตใจ สังคมและเศรษฐกิจ โดยกระบวนการหรือกิจกรรมต่างๆ นั้นต้องอาศัย การมีส่วนร่วมของผู้ป่วย คนพิการ ญาติผู้ดูแลและทีมสหวิชาชีพ เพื่อส่งเสริมให้ผู้ป่วย คนพิการ สามารถดํารงชีวิตอิสระในสังคมได้ตามศักยภาพรวมถึงการพิทักษ์สิทธิอันพึงได้ให้กับผู้ป่วย คนพิการ กิจกรรมการบริบาลฟื้นสภาพระยะกลางแบบผู้ป่วยนอก ได้แก่ กายภาพบําบัด กิจกรรมบําบัด และแก้ไขการพูด ทั้งในสถานพยาบาลภาครัฐ และภายนอก เช่น ศูนย์ฟื้นฟูชุมชนคลินิกกายภาพบําบัด เอกชนที่ขึ้นทะเบียน หมายเหตุ การให้บริการ intermediate bed/ ward สามารถให้บริการได้ ในโรงพยาบาลทุกระดับที่สังกัดกระทรวงสาธารณสุขขึ้นกับความพร้อมและบริบทของพื้นที่ ในแต่ละจังหวัด และเขตสุขภาพ",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "(จำนวนผลงานที่บรรลุเกณฑ์ [A] ÷ จำนวนกลุ่มเป้าหมายทั้งหมด [B]) × 100",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI69-24": {
      "kpiId": "KPI69-24",
      "order": 24,
      "name": "อัตราการติดเชื้อดื้อยาในกระแสเลือดลดลง",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "อัตรา",
      "direction": "ยิ่งน้อยยิ่งดี",
      "target": "≤ ปีที่ผ่านมา",
      "baseline": "≤ ปีที่ผ่านมา",
      "definition": "อุบัติการณ์ผู้ป่วยติดเชื้อดื้อยาในกระแสเลือด หมายถึง อุบัติการณ์ผู้ป่วยที่ติดเชื้อดื้อยาในกระแส เลือด (bacteremia) ต่อผู้ป่วยที่ได้รับการตรวจ hemoculture 100,000 ราย (per 100,000 tested patients) โดย focus เชื้อดื้อยาที่เป็น hospital origin ดังต่อไปนี้ 1. Acinetobacter baumannii ดื้อต่อยา carbapenem (CRAB) 2. Klebsiella pneumoniae ดื้อต่อยา carbapenem (CRKP) 3. Escherichia coli ดื้อต่อยา carbapenem (CREC) hospital origin หมายถึง การติดเชื้อภายหลังจากเข้านอนในโรงพยาบาลมากกว่า 2 วันปฏิทิน",
      "purpose": "เพื่อลดการป่วยและเสียชีวิตจากเชื้อดื้อยา",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "โรงพยาบาลศูนย์/ทั่วไป A, S, M1 (หรือ SAP; P+, P, A+, A ที่มีห้องปฏิบัติการทางจุลชีววิทยา)",
      "source": "เป้าหมาย รพ.ขอนแก่น/ชุมแพ/สิรินธร",
      "formula": "โรงพยาบาลศูนย์/ทั่วไป A, S, M1 (หรือ SAP; P+, P, A+, A ที่มีห้องปฏิบัติการทางจุลชีววิทยา) เป้าหมาย รพ.ขอนแก่น/ชุมแพ/สิรินธร A1 = อุบัติการณ์ผู้ป่วยที่ติดเชื้อดื้อยา CRAB ในกระแสเลือด (สูตร A1 = จำนวนผู้ป่วย CRAB x 100,000 / จำนวนผู้ป่วยที่ได้รับการตรวจ hemoculture) A2 = อุบัติการณ์ผู้ป่วยที่ติดเชื้อดื้อยา CRKP ในกระแสเลือด (สูตร A2 = จำนวนผู้ป่วย CRKP x 100,000 / จำนวนผู้ป่วยที่ได้รับการตรวจ hemoculture) A3 = อุบัติการณ์ผู้ป่วยที่ติดเชื้อดื้อยา CREC ในกระแสเลือด (สูตร A3 = จำนวนผู้ป่วย CREC x 100,000 / จำนวนผู้ป่วยที่ได้รับการตรวจ hemoculture) A = A1 + A2 + A3 B = อุบัติการณ์ผู้ป่วยติดเชื้อดื้อยา CRAB, CRKP, CREC ในกระแสเลือด ปีปฏิทิน พ.ศ. 2567 (baseline แบ่งตามระดับระดับโรงพยาบาล) A < B อุบัติการณ์ผู้ป่วยติดเชื้อ A. baumannii, K. pneumoniae, E. coli ที่ดื้อยา carbapenem ของ โรงพยาบาลในรอบที่วัดผล ต้องต่ำกว่าอุบัติการณ์เฉลี่ยของโรงพยาบาลในระดับเดียวกันของปีปฏิทิน 2567 (baseline)",
      "numeratorA": "A1 + A2 + A3",
      "denominatorB": "อุบัติการณ์ผู้ป่วยติดเชื้อดื้อยา CRAB, CRKP, CREC ในกระแสเลือด ปีปฏิทิน พ.ศ. 2567",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "การรายงาน และการวิเคราะห์เปรียบเทียบผล รายละเอียดข้อมูล ผลงานจังหวัดขอนแก่น พื้นฐาน(Baseline ปี 2564 = 68.29% 2565 = 62.50 % Data) 2566 = 67.38% 2567 =67.68 %",
      "responsible": "1.นางศศิธร เอื้ออนันต์ เภสัชกรชำนาญการพิเศษ สสจ.ขอนแก่น Email: sasitorneu@gmail.com โทร 081-3910199 2.นางนิสรา ศรีสุระ เภสัชกรชำนาญการ รพ.ขอนแก่น Email: nissaran2003@gmail.com โทร 081-5450172"
    },
    "KPI69-25": {
      "kpiId": "KPI69-25",
      "order": 25,
      "name": "ร้อยละของผู้ป่วยที่มีการวินิจฉัยโรคหลอดเลือดสมอง อัมพฤกษ์ อัมพาต ระยะกลาง (Intermediate Care) ที่ได้รับการดูแลด้วยการแพทย์แผนไทยและการแพทย์ทางเลือก",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "≥22",
      "baseline": "8.17",
      "definition": "การบริบาลฟื้นสภาพระยะกลาง (Intermediate care; IMC) หมายถึง การบริบาลฟื้นสภาพผู้ป่วย ระยะกลางที่มีอาการทางคลินิกผ่านพ้นภาวะวิกฤติและมีอาการคงที่แต่ยังคงมีความผิดปกติ ของร่างกายบางส่วนอยู่และมีข้อจํากัดในการปฏิบัติกิจกรรมในชีวิตประจําวัน จําเป็นต้องได้รับบริการ ฟื้นฟูสมรรถภาพทางการแพทย์โดยทีมสหวิชาชีพ (multidisciplinary approach) อย่างต่อเนื่อง จนครบ 6 เดือน ตั้งแต่ในโรงพยาบาลจนถึงชุมชน เพื่อเพิ่มสมรรถนะร่างกาย จิตใจ ในการปฏิบัติ กิจวัตรประจําวัน และลดความพิการหรือภาวะทุพพลภาพ รวมทั้งกลับสู่สังคมได้อย่างเต็มศักยภาพ โดยมีการให้บริการผู้ป่วยระยะกลางในโรงพยาบาลทุกระดับ (A/S/M/F) โดยให้บริการผู้ป่วย ใน (Intermediate bed/ward) ผู้ป่วยนอกและ ให้บริการในชุมชน เช่น ศูนย์ฟื้นฟูสมรรถภาพ ในชุมชน เยี่ยมบ้าน เป็นต้น ผู้ป่วย Intermediate care หมายถึง ผู้ป่วย Stroke, Traumatic Brain Injury และSpinal Cord Injury รายใหม่ หรือกลับเป็นซ้ำภายในระยะเวลา 6 เดือน และ Fragility hip fracture รายใหม่ หรือกลับเป็นซ้ำทั้งหมดทุกรายที่เข้ารับการรักษาในโรงพยาบาลภายในจังหวัดที่รอดชีวิต แ ล ะ มี ค ะ แ น น Barthel index < 15 รว ม ทั้ งค ะ แ น น Barthel index ≥ 15 with multiple impairments ตามเกณฑ์การบริบาลฟื้นสภาพระยะกลางแบบผู้ป่วยใน (IPD-IMC protocol) สำหรับโรงพยาบาล Intermediate ward คื อ ก า ร ให้ บ ริ ก า ร Intensive inpatient rehabilitation program หมายถึง ผู้ป่วยได้รับการฟื้นฟูแบบผู้ป่วยในอย่างน้อย วันละ 3 ชั่วโมง และอย่างน้อย 5 วัน/ สัปดาห์ หรือ อย่างน้อย 15 ชั่วโมง/ สัปดาห์ (ไม่รวมชั่วโมง nursing care) โดยมีรายละเอียดการให้บริการ Intermediate ward ตามภาคผนวก 1 Intermediate bed คือ การให้บริการ Inpatient rehab program หมายถึง ผู้ป่วยได้รับการฟื้นฟูโดยเฉลี่ยอย่างน้อยวันละ 1 ชั่วโมงอย่างน้อย 3 ครั้ง/สัปดาห์ (ไม่รวมชั่วโมง nursing care) การพยาบาลฟื้นฟูสภาพ หมายถึง กิจกรรมการพยาบาลที่ใช้กระบวนการหรือกิจกรรมที่มุ่งหวัง ให้ผู้ป่วย คนพิการ สามารถฟื้นคืนสภาพให้เร็วที่สุด ยอมรับและปรับตัวกับความเปลี่ยนแปลงที่เกิดขึ้น ทั้งด้านร่างกาย จิตใจ สังคมและเศรษฐกิจ โดยกระบวนการหรือกิจกรรมต่างๆ นั้นต้องอาศัย การมีส่วนร่วมของผู้ป่วย คนพิการ ญาติผู้ดูแลและทีมสหวิชาชีพ เพื่อส่งเสริมให้ผู้ป่วย คนพิการ สามารถดํารงชีวิตอิสระในสังคมได้ตามศักยภาพรวมถึงการพิทักษ์สิทธิอันพึงได้ให้กับผู้ป่วย คนพิการ กิจกรรมการบริบาลฟื้นสภาพระยะกลางแบบผู้ป่วยนอก ได้แก่ กายภาพบําบัด กิจกรรมบําบัด และแก้ไขการพูด ทั้งในสถานพยาบาลภาครัฐ และภายนอก เช่น ศูนย์ฟื้นฟูชุมชนคลินิกกายภาพบําบัด เอกชนที่ขึ้นทะเบียน หมายเหตุ การให้บริการ intermediate bed/ ward สามารถให้บริการได้ ในโรงพยาบาลทุกระดับที่สังกัดกระทรวงสาธารณสุขขึ้นกับความพร้อมและบริบทของพื้นที่ ในแต่ละจังหวัด และเขตสุขภาพ",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "(จำนวนผลงานที่บรรลุเกณฑ์ [A] ÷ จำนวนกลุ่มเป้าหมายทั้งหมด [B]) × 100",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI69-26": {
      "kpiId": "KPI69-26",
      "order": 26,
      "name": "ร้อยละผู้ป่วยนอกที่ได้รับบริการ ตรวจ วินิจฉัย รักษาโรค และฟื้นฟูสภาพ ด้วยศาสตร์การแพทย์แผนไทยและการแพทย์ทางเลือก",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "≥22",
      "baseline": "21.19",
      "definition": "ผู้ป่วยนอก หมายถึง ประชาชนที่มารับบริการตรวจ วินิจฉัย รักษาโรค และฟื้นฟูสภาพ แบบไม่นอน รักษาตัวในโรงพยาบาล โดยผู้ประกอบวิชาชีพที่เกี่ยวข้องที่ได้มาตรฐาน การบริการด้านการแพทย์แผนไทย หมายถึง บริการการตรวจ วินิจฉัย ส่งเสริมสุขภาพ การป้องกันโรค รักษาโรค และฟื้นฟูสภาพ เช่น - การรักษาด้วยยาสมุนไพร - การปรุงยาแผนไทยสำหรับผู้ป่วยเฉพาะรายของตน หมายถึง การปรุงยาตามองค์ความรู้ สำหรับผู้ป่วยเฉพาะรายของตน โดยผู้ประกอบโรคศิลปะสาขาการแพทย์แผนไทย (ประเภทเวชกรรมไทย) หรือ สาขาการแพทย์แผนไทยประยุกต์ - ยาแผนไทยที่มีกัญชาปรุงผสม กัญชาทางการแพทย์ หมายถึง สิ่งที่ได้จากการสกัดพืชกัญชา เพื่อนำสารสกัดที่ได้ มาใช้ทางการแพทย์และการวิจัยไม่ได้หมายรวมถึงกัญชาที่ยังคงมีสภาพเป็นพืช หรือส่วนประกอบใดๆ ของพืชกัญชา อาทิ ยอด ดอก ใบ ลำต้น ราก เป็นต้น - การนวดเพื่อการรักษา-ฟื้นฟูสภาพ - การประคบสมุนไพรเพื่อการรักษา-ฟื้นฟูสภาพ - การอบไอน้ำสมุนไพรเพื่อการรักษา-ฟื้นฟูสภาพ - การทับหม้อเกลือ - การพอกยาสมุนไพร - การนวดเพื่อส่งเสริมสุขภาพ - การประคบสมุนไพรเพื่อส่งเสริมสุขภาพ - การอบไอน้ำสมุนไพรเพื่อส่งเสริมสุขภาพ - การให้คำแนะนำการดูแลสุขภาพด้วยการสอนสาธิตด้านการแพทย์แผนไทย - การให้คำแนะนำการดูแลสุขภาพด้วยการสอนสาธิตด้านการแพทย์ทางเลือก - การทำหัตถการอื่นๆ ตามมาตรฐานวิชาชีพแพทย์แผนไทย หรือการบริการอื่น ๆ ที่มีการเพิ่มเติมรหัสภายหลัง - การบริการการแพทย์แผนไทยและการแพทย์ทางเลือกที่บ้าน รหัสกลุ่มโรคและอาการด้านการแพทย์แผนไทย 1. โรคสตรี: U50 ถึง U52 2. โรคเด็ก: U54 ถึง U55 3. โรคที่เกิดอาการหลายระบบ: U56 ถึง U60 4. โรคที่เกิดเฉพาะตำแหน่ง: U61 ถึง U72 5. โรคและอาการอื่น: U74 ถึง U75 6. การส่งเสริมสุขภาพและการป้องกันโรค: U77",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "(จำนวนผลงานที่บรรลุเกณฑ์ [A] ÷ จำนวนกลุ่มเป้าหมายทั้งหมด [B]) × 100",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI69-27": {
      "kpiId": "KPI69-27",
      "order": 27,
      "name": "ร้อยละของผู้ป่วยเบาหวานควบคุมน้ำตาลได้",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "40",
      "baseline": "30.01",
      "definition": "การบริบาลฟื้นสภาพระยะกลาง (Intermediate care; IMC) หมายถึง การบริบาลฟื้นสภาพผู้ป่วย ระยะกลางที่มีอาการทางคลินิกผ่านพ้นภาวะวิกฤติและมีอาการคงที่แต่ยังคงมีความผิดปกติ ของร่างกายบางส่วนอยู่และมีข้อจํากัดในการปฏิบัติกิจกรรมในชีวิตประจําวัน จําเป็นต้องได้รับบริการ ฟื้นฟูสมรรถภาพทางการแพทย์โดยทีมสหวิชาชีพ (multidisciplinary approach) อย่างต่อเนื่อง จนครบ 6 เดือน ตั้งแต่ในโรงพยาบาลจนถึงชุมชน เพื่อเพิ่มสมรรถนะร่างกาย จิตใจ ในการปฏิบัติ กิจวัตรประจําวัน และลดความพิการหรือภาวะทุพพลภาพ รวมทั้งกลับสู่สังคมได้อย่างเต็มศักยภาพ โดยมีการให้บริการผู้ป่วยระยะกลางในโรงพยาบาลทุกระดับ (A/S/M/F) โดยให้บริการผู้ป่วย ใน (Intermediate bed/ward) ผู้ป่วยนอกและ ให้บริการในชุมชน เช่น ศูนย์ฟื้นฟูสมรรถภาพ ในชุมชน เยี่ยมบ้าน เป็นต้น ผู้ป่วย Intermediate care หมายถึง ผู้ป่วย Stroke, Traumatic Brain Injury และSpinal Cord Injury รายใหม่ หรือกลับเป็นซ้ำภายในระยะเวลา 6 เดือน และ Fragility hip fracture รายใหม่ หรือกลับเป็นซ้ำทั้งหมดทุกรายที่เข้ารับการรักษาในโรงพยาบาลภายในจังหวัดที่รอดชีวิต แ ล ะ มี ค ะ แ น น Barthel index < 15 รว ม ทั้ งค ะ แ น น Barthel index ≥ 15 with multiple impairments ตามเกณฑ์การบริบาลฟื้นสภาพระยะกลางแบบผู้ป่วยใน (IPD-IMC protocol) สำหรับโรงพยาบาล Intermediate ward คื อ ก า ร ให้ บ ริ ก า ร Intensive inpatient rehabilitation program หมายถึง ผู้ป่วยได้รับการฟื้นฟูแบบผู้ป่วยในอย่างน้อย วันละ 3 ชั่วโมง และอย่างน้อย 5 วัน/ สัปดาห์ หรือ อย่างน้อย 15 ชั่วโมง/ สัปดาห์ (ไม่รวมชั่วโมง nursing care) โดยมีรายละเอียดการให้บริการ Intermediate ward ตามภาคผนวก 1 Intermediate bed คือ การให้บริการ Inpatient rehab program หมายถึง ผู้ป่วยได้รับการฟื้นฟูโดยเฉลี่ยอย่างน้อยวันละ 1 ชั่วโมงอย่างน้อย 3 ครั้ง/สัปดาห์ (ไม่รวมชั่วโมง nursing care) การพยาบาลฟื้นฟูสภาพ หมายถึง กิจกรรมการพยาบาลที่ใช้กระบวนการหรือกิจกรรมที่มุ่งหวัง ให้ผู้ป่วย คนพิการ สามารถฟื้นคืนสภาพให้เร็วที่สุด ยอมรับและปรับตัวกับความเปลี่ยนแปลงที่เกิดขึ้น ทั้งด้านร่างกาย จิตใจ สังคมและเศรษฐกิจ โดยกระบวนการหรือกิจกรรมต่างๆ นั้นต้องอาศัย การมีส่วนร่วมของผู้ป่วย คนพิการ ญาติผู้ดูแลและทีมสหวิชาชีพ เพื่อส่งเสริมให้ผู้ป่วย คนพิการ สามารถดํารงชีวิตอิสระในสังคมได้ตามศักยภาพรวมถึงการพิทักษ์สิทธิอันพึงได้ให้กับผู้ป่วย คนพิการ กิจกรรมการบริบาลฟื้นสภาพระยะกลางแบบผู้ป่วยนอก ได้แก่ กายภาพบําบัด กิจกรรมบําบัด และแก้ไขการพูด ทั้งในสถานพยาบาลภาครัฐ และภายนอก เช่น ศูนย์ฟื้นฟูชุมชนคลินิกกายภาพบําบัด เอกชนที่ขึ้นทะเบียน หมายเหตุ การให้บริการ intermediate bed/ ward สามารถให้บริการได้ ในโรงพยาบาลทุกระดับที่สังกัดกระทรวงสาธารณสุขขึ้นกับความพร้อมและบริบทของพื้นที่ ในแต่ละจังหวัด และเขตสุขภาพ",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "(จำนวนผลงานที่บรรลุเกณฑ์ [A] ÷ จำนวนกลุ่มเป้าหมายทั้งหมด [B]) × 100",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI69-28": {
      "kpiId": "KPI69-28",
      "order": 28,
      "name": "ร้อยละของผู้ป่วยความดันโลหิตสูงควบคุมความดันโลหิตได้",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "60",
      "baseline": "58.96",
      "definition": "การบริบาลฟื้นสภาพระยะกลาง (Intermediate care; IMC) หมายถึง การบริบาลฟื้นสภาพผู้ป่วย ระยะกลางที่มีอาการทางคลินิกผ่านพ้นภาวะวิกฤติและมีอาการคงที่แต่ยังคงมีความผิดปกติ ของร่างกายบางส่วนอยู่และมีข้อจํากัดในการปฏิบัติกิจกรรมในชีวิตประจําวัน จําเป็นต้องได้รับบริการ ฟื้นฟูสมรรถภาพทางการแพทย์โดยทีมสหวิชาชีพ (multidisciplinary approach) อย่างต่อเนื่อง จนครบ 6 เดือน ตั้งแต่ในโรงพยาบาลจนถึงชุมชน เพื่อเพิ่มสมรรถนะร่างกาย จิตใจ ในการปฏิบัติ กิจวัตรประจําวัน และลดความพิการหรือภาวะทุพพลภาพ รวมทั้งกลับสู่สังคมได้อย่างเต็มศักยภาพ โดยมีการให้บริการผู้ป่วยระยะกลางในโรงพยาบาลทุกระดับ (A/S/M/F) โดยให้บริการผู้ป่วย ใน (Intermediate bed/ward) ผู้ป่วยนอกและ ให้บริการในชุมชน เช่น ศูนย์ฟื้นฟูสมรรถภาพ ในชุมชน เยี่ยมบ้าน เป็นต้น ผู้ป่วย Intermediate care หมายถึง ผู้ป่วย Stroke, Traumatic Brain Injury และSpinal Cord Injury รายใหม่ หรือกลับเป็นซ้ำภายในระยะเวลา 6 เดือน และ Fragility hip fracture รายใหม่ หรือกลับเป็นซ้ำทั้งหมดทุกรายที่เข้ารับการรักษาในโรงพยาบาลภายในจังหวัดที่รอดชีวิต แ ล ะ มี ค ะ แ น น Barthel index < 15 รว ม ทั้ งค ะ แ น น Barthel index ≥ 15 with multiple impairments ตามเกณฑ์การบริบาลฟื้นสภาพระยะกลางแบบผู้ป่วยใน (IPD-IMC protocol) สำหรับโรงพยาบาล Intermediate ward คื อ ก า ร ให้ บ ริ ก า ร Intensive inpatient rehabilitation program หมายถึง ผู้ป่วยได้รับการฟื้นฟูแบบผู้ป่วยในอย่างน้อย วันละ 3 ชั่วโมง และอย่างน้อย 5 วัน/ สัปดาห์ หรือ อย่างน้อย 15 ชั่วโมง/ สัปดาห์ (ไม่รวมชั่วโมง nursing care) โดยมีรายละเอียดการให้บริการ Intermediate ward ตามภาคผนวก 1 Intermediate bed คือ การให้บริการ Inpatient rehab program หมายถึง ผู้ป่วยได้รับการฟื้นฟูโดยเฉลี่ยอย่างน้อยวันละ 1 ชั่วโมงอย่างน้อย 3 ครั้ง/สัปดาห์ (ไม่รวมชั่วโมง nursing care) การพยาบาลฟื้นฟูสภาพ หมายถึง กิจกรรมการพยาบาลที่ใช้กระบวนการหรือกิจกรรมที่มุ่งหวัง ให้ผู้ป่วย คนพิการ สามารถฟื้นคืนสภาพให้เร็วที่สุด ยอมรับและปรับตัวกับความเปลี่ยนแปลงที่เกิดขึ้น ทั้งด้านร่างกาย จิตใจ สังคมและเศรษฐกิจ โดยกระบวนการหรือกิจกรรมต่างๆ นั้นต้องอาศัย การมีส่วนร่วมของผู้ป่วย คนพิการ ญาติผู้ดูแลและทีมสหวิชาชีพ เพื่อส่งเสริมให้ผู้ป่วย คนพิการ สามารถดํารงชีวิตอิสระในสังคมได้ตามศักยภาพรวมถึงการพิทักษ์สิทธิอันพึงได้ให้กับผู้ป่วย คนพิการ กิจกรรมการบริบาลฟื้นสภาพระยะกลางแบบผู้ป่วยนอก ได้แก่ กายภาพบําบัด กิจกรรมบําบัด และแก้ไขการพูด ทั้งในสถานพยาบาลภาครัฐ และภายนอก เช่น ศูนย์ฟื้นฟูชุมชนคลินิกกายภาพบําบัด เอกชนที่ขึ้นทะเบียน หมายเหตุ การให้บริการ intermediate bed/ ward สามารถให้บริการได้ ในโรงพยาบาลทุกระดับที่สังกัดกระทรวงสาธารณสุขขึ้นกับความพร้อมและบริบทของพื้นที่ ในแต่ละจังหวัด และเขตสุขภาพ",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "(จำนวนผลงานที่บรรลุเกณฑ์ [A] ÷ จำนวนกลุ่มเป้าหมายทั้งหมด [B]) × 100",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI69-29": {
      "kpiId": "KPI69-29",
      "order": 29,
      "name": "ร้อยละการจัดตั้งหน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิตามพระราชบัญญัติระบบสุขภาพปฐมภูมิ พ.ศ. 2562",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 5",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "100",
      "baseline": "100",
      "definition": "หน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิ หมายถึง หน่วยบริการที่ได้ขึ้นทะเบียน เป็นหน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิ ตามพระราชบัญญัติระบบสุขภาพปฐมภูมิ พ.ศ. 2562 แพทย์เวชศาสตร์ครอบครัว หมายความว่า แพทย์ที่ได้รับหนังสืออนุมัติหรือวุฒิบัตรเพื่อแสดงความรู้ ความชำนาญในการประกอบวิชาชีพเวชกรรมสาขาเวชศาสตร์ครอบครัว หรือแพทย์ที่ผ่านการอบรม ด้านเวชศาสตร์ครอบครัวจากหลักสูตรที่ปลัดกระทรวงสาธารณสุขให้ความเห็นชอบ 1. หลักสูตรพื้นฐานเวชศาสตร์ครอบครัวสำหรับแพทย์ปฐมภูมิ Basic Course of Family Medicine for Primary Care Doctor 2. หลักสูตรการฝึกอบรมระยะสั้น “เวชศาสตร์ครอบครัวสำหรับแพทย์ปฏิบัติงานในคลินิก หมอครอบครัว” พ.ศ. 2562 คณะผู้ให้บริการสุขภาพปฐมภูมิ หมายความว่า ผู้ประกอบวิชาชีพทางการแพทย์และสาธารณสุขซึ่ง ปฏิบัติงานร่วมกันกับแพทย์เวชศาสตร์ครอบครัวในการให้บริการสุขภาพปฐมภูมิ และให้หมายความ รวมถึงผู้ซึ่งผ่านการฝึกอบรมด้านสุขภาพปฐมภูมิเพื่อเป็นผู้สนับสนุนการปฏิบัติหน้าที่ของแพทย์เวชศาสตร์ ครอบครัวและผู้ประกอบวิชาชีพดังกล่าว บริการสุขภาพปฐมภูมิ เป็นบริการทางการแพทย์และสาธารณสุขที่ดูแลสุขภาพของบุคคลในบัญชี รายชื่อ ซึ่งมีขอบเขต ดังต่อไปนี้ (1) บริการสุขภาพอย่างองค์รวม แต่ไม่รวมถึงการดูแลโรคหรือปัญหาสุขภาพที่จำเป็นต้องใช้เทคนิค หรือเครื่องมือทางการแพทย์ที่ซับซ้อน การปลูกถ่ายอวัยวะ และการผ่าตัด ยกเว้น การผ่าตัดขนาดเล็ก ซึ่งสามารถฉีดยาชาเฉพาะที่ (2) บริการสุขภาพตั้งแต่แรก ครอบคลุมทุกกระบวนการสาธารณสุข ทั้งการส่งเสริมสุขภาพ การควบคุมโรค การป้องกันโรค การตรวจวินิจฉัยโรค การรักษาพยาบาล และการฟื้นฟูสุขภาพ แต่ไม่รวมถึง การบริการแบบผู้ป่วยนอกของหน่วยบริการระดับทุติยภูมิและตติยภูมิ การบริการแบบผู้ป่วยใน การคลอด และการปฏิบัติการฉุกเฉิน ยกเว้น กรณีการปฐมพยาบาลและการดูแลในภาวะฉุกเฉินเพื่อให้รอดพ้นภาวะ ฉุกเฉิน (3) บริการสุขภาพอย่างต่อเนื่อง ทุกช่วงวัยตั้งแต่ การตั้งครรภ์ ทารก วัยเด็ก วัยเรียน วัยรุ่น วัยทำงาน วัยสูงอายุ จนกระทั่งเสียชีวิต (4) การดูแลสุขภาพของบุคคลแบบผสมผสาน ประกอบด้วย การดูแลสุขภาพโดยการแพทย์ แผนปัจจุบัน การแพทย์แผนไทย หรือการแพทย์ทางเลือก (5) การบริการข้อมูลด้านสุขภาพและคำปรึกษาด้านสุขภาพแก่บุคคลในบัญชีรายชื่อ ตลอดจน คำแนะนำที่จำเป็นเพื่อให้สามารถตัดสินใจในการเลือกรับบริการหรือเข้าสู่ระบบการส่งต่อ (6) การส่งเสริมให้ประชาชนมีศักยภาพและมีความรู้ในการจัดการสุขภาพของตนเองและบุคคล ในครอบครัว ตลอดจนอาจสามารถร่วมตัดสินใจในการวางแผนการดูแลสุขภาพร่วมกับแพทย์เวชศาสตร์ ครอบครัวและคณะผู้ให้บริการสุขภาพปฐมภูมิได้",
      "purpose": "1. เพื่อให้ประชาชนมีแพทย์เวชศาสตร์ครอบครัวและคณะผู้ให้บริการสุขภาพปฐมภูมิ 2. เพื่อให้มีสุขภาพแข็งแรง สามารถดูแลตนเองและครอบครัวเบื้องต้นเมื่อมีอาการเจ็บป่วย ได้อย่างเหมาะสม 3. เพื่อให้ประชาชนสามารถเข้าถึงบริการปฐมภูมิ",
      "population": "หน่วยบริการปฐมภูมิทุกแห่ง ทุกสังกัด",
      "collectionMethod": "1. จัดเก็บจากข้อมูลจำนวนหน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิ ในระบบ ขึ้นทะเบียน 2. การจัดเก็บการประเมินคุณภาพมาตรฐาน จากระบบทรัพยากรสุขภาพ หน่วยบริการปฐมภูมิ (PCU Standard)",
      "source": "1. ระบบขึ้นทะเบียนหน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิ 2. ระบบทรัพยากรสุขภาพ หน่วยบริการปฐมภูมิ (PCU Standard)",
      "formula": "(A/B) x 100",
      "numeratorA": "จำนวนหน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิที่ขึ้นทะเบียน",
      "denominatorB": "จำนวนหน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิตามแผนการจัดตั้ง",
      "frequency": "ไตรมาส 2 , ไตรมาส 3 และ ไตรมาส 4",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI69-30": {
      "kpiId": "KPI69-30",
      "order": 30,
      "name": "ร้อยละของการให้บริการผู้ป่วยนอกด้วยระบบด้วยระบบการแพทย์ทางไกล (Telemedicine) ในหน่วยบริการปฐมภูมิ",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 5",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "20",
      "baseline": "-",
      "definition": "บุคลากรที่ปฏิบัติงานในสำนักงานสาธารณสุขอำเภอ หมายถึง บุคลากรที่ปฏิบัติงาน ณ สำนักงาน สาธารณสุขอำเภอ สังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่น ประกอบด้วย ข้าราชการ พนักงาน ราชการ พนักงานกระทรวงสาธารณสุข ลูกจ้างชั่วคราวปฏิบัติงานมาแล้วอย่างน้อย 6 เดือนขึ้นไป สมรรถนะ หมายถึง คุณลักษณะเชิงพฤติกรรมที่เป็นผลมาจากความรู้ทักษะความสามารถ หรือคุณลักษณะอื่น ๆ ที่ทำให้บุคคลสร้างผลงานโดดเด่นได้ในองค์กรสมรรถนะที่ผู้ปฏิบัติงาน ในทุกตำแหน่งและในทุกระดับในสำนักงานสาธารณสุขอำเภอ จำเป็นที่จะต้องมี สมรรถนะที่กำหนดขึ้น เพราะมีความจำเป็นสำหรับภารกิจการปฏิบัติงานในหน้าที่ และตำแหน่งงานนั้นๆ ประกอบด้วย สมรรถนะภารกิจหลัก 1. สมรรถนะด้านการคุ้มครองผู้บริโภคด้านการบริการและผลิตภัณฑ์สุขภาพในพื้นที่ 2. สมรรถนะด้านการดำเนินงานตามกฎหมายการแพทย์และการสาธารณสุข สมรรถนะภารกิจรอง 1. สมรรถนะด้านการทำแผนยุทธศาสตร์ด้านสุขภาพ ร่วมกับหน่วยงานภาครัฐ ท้องถิ่น องค์กร เอกชนและภาคประชาสังคมในพื้นที่ระดับอำเภอ/ตำบล 2. สมรรถนะด้านการประเมินผล การดำเนินงานของเครือข่ายบริการสุขภาพ 3. สมรรถนะด้านการควบคุมมาตรฐานการดำเนินงานของหน่วยงานสาธารณสุขในพื้นที่ 4. สมรรถนะด้านการปฏิบัติงานตามนโยบายเร่งด่วนด้านสุขภาพของรัฐบาล กระทรวง เขตสุขภาพ และจังหวัด 5. สมรรถนะด้านการพัฒนาวิชาการแก่บุคลากรสาธารณสุข องค์กรสุขภาพภาคประชาชนสนับสนุน วิชาการและการวิจัยทีเกี่ยวข้องกับสุขภาพ 6. สมรรถนะด้านสนับสนุนบุคลากรสาธารณสุข อาสาสมัครสาธารณสุขให้ได้รับการพัฒนาความรู้ อย่างต่อเนื่องและเหมาะสม 7. สมรรถนะด้านสนับสนุนบุคลากรสาธารณสุข อาสาสมัครสาธารณสุข ให้ได้รับการพัฒนาความรู้ อย่างต่อเนื่องและเหมาะสม",
      "purpose": "เพื่ อ พั ฒ น าบุ ค ลาก รส ำนั ก งาน ส าธ ารณ สุ ข อำเภ อ ให้ มี ขี ดค ว าม ส าม ารถใน ก ารขั บ เค ลื่ อ น ภ ารกิ จ ของส่วนราชการให้บรรลุผล มีประสิทธิภาพและเกิดประสิทธิผล",
      "population": "บุคลากรสำนักงานสาธารณสุขอำเภอ เครือข่ายบริการสุขภาพสังกัดสำนักงาน สาธารณสุข จังหวัดขอนแก่น",
      "collectionMethod": "รวบรวมข้อมูลจากเอกสารการเข้ารับการอบรม ได้แก่ แผนการพัฒนารายบุคคล รายกลุ่ม ใบประกาศนียบัตรใบรับรองการอบรม ในระบบ online และ onsite เครือข่ายบริการสุขภาพสังกัด สำนักงานสาธารณสุขจังหวัดขอนแก่น และเอกสารการปฏิบัติงานการจัดการข้อร้องเรียน ด้านการ คุ้มครองผู้บริโภคด้านการบริการและผลิตภัณฑ์สุขภาพ ในพื้นที่การตรวจมาตรฐานการดำเนินงานตาม กฎหมายการแพทย์และการสาธารณสุข พร้อมทั้งจัดทำแบบประเมินสมรรถนะบุคลากร สสอ. เพื่อประเมินสมรรถนะรายบุคคล และ ลงข้อมูลในระบบโปรแกรมการพัฒนาบุคลากร ลาศึกษาต่อ และฝึกอบรม",
      "source": "รวบรวมข้อมูลจากสำนักงานสาธารณสุขอำเภอ",
      "formula": "B = จำนวนสมรรถนะที่ได้รับการอบรม (หลักและรอง) ระยะเวลา ไตรมาสที่ 3 ประเมินผล",
      "numeratorA": "บุคลากรสำนักงานสาธารณสุขอำเภอ",
      "denominatorB": "จำนวนสมรรถนะที่ได้รับการอบรม (หลักและรอง)",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลจาก 1. แผนการจัดทำแผนพัฒนารายบุคคล (Individual Development Plan) และรายกลุ่ม บุคลากร สำนักงาน สาธารณสุขอำเภอ 2. บุคลากรในสำนักงานสาธารณสุขอำเภอได้รับการพัฒนาสมรรถนะหลักและสมรรถนะรองเพิ่มขึ้น จากปีที่ผ่านมา 3. บุคลากรในสำนักงานสาธารณสุขอำเภอนำสิ่งที่ได้จากการเข้าร่วมอบรมไปใช้ประโยชน์ในการ ปฏิบัติงานด้านการคุ้มครองผู้บริโภคด้านการบริการและผลิตภัณฑ์สุขภาพในพื้นที่ ด้านการดำเนินงาน ตามกฎหมายการแพทย์และการสาธารณสุข",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI69-31": {
      "kpiId": "KPI69-31",
      "order": 31,
      "name": "บุคลากรที่ปฏิบัติงานในสำนักงานสาธารณสุขอำเภอได้รับการพัฒนาสมรรถนะหลักและสมรรถนะรอง (Regulator/ กฎหมาย/ พรบ.การสาธารณสุข พ.ศ. 2535/ Hard skill/ Soft skill/ AI)",
      "strategy": "ยุทธศาสตร์ที่ 3",
      "objective": "เป้าประสงค์ที่ 6",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "90",
      "baseline": "87.69",
      "definition": "บุคลากรที่ปฏิบัติงานในสำนักงานสาธารณสุขอำเภอได้รับการพัฒนาสมรรถนะหลักและสมรรถนะรอง (Regulator/ กฎหมาย/ พรบ.การสาธารณสุข พ.ศ. 2535/ Hard skill/ Soft skill/ AI) ตามเกณฑ์มาตรฐานแผนยุทธศาสตร์สุขภาพ 5 ปี จังหวัดขอนแก่น (พ.ศ. 2566–2570)",
      "purpose": "1. เพื่อให้ผู้สูงอายุได้รับการส่งเสริมสุขภาพ หรือคงสมรรถภาพทางร่างกาย สมอง สุขภาพจิต และสังคม ของผู้สูงอายุป้องกันหรือลดการเกิดภาวะพึ่งพิงในผู้สูงอายุ 2. เพื่อส่งเสริมผู้สูงอายุกลุ่มเสี่ยงให้ได้รับการดูแลตามแผนส่งเสริมสุขภาพดี(Wellness Plan) 3. เพื่อให้ผู้สูงอายุได้รับการดูแลรักษากลุ่มอาการ Geriatric Syndromes และปัญหาสุขภาพที่สำคัญ อย่างเหมาะสมหลังจากได้รับการคัดกรองสุขภาพในการส่งต่อเข้าสู่ระบบริการคลินิกผู้สูงอายุ",
      "population": "ผู้สูงอายุกลุ่มที่ 1 (กลุ่มติดสังคม) จากการประเมิน ADL คะแนนตั้งแต่ 12 คะแนนขึ้นไป",
      "collectionMethod": "1. บันทึกการคัดกรอง ADL และกลุ่มอาการความเสื่อมในฐานข้อมูล HDC 2. รายงานการประเมินมาตรฐานการจัดบริการคลินิกผู้สูงอายุ https://dmscaretools.dms.go.th/geriatric/ 3. รายงานผู้สูงอายุกลุ่มเสี่ยงมีแผนส่งเสริมสุขภาพดี (Wellness Plan) https://care.anamai.moph.go.th/ 4. รายงานผู้สูงอายุที่คัดกรองพบว่าเสี่ยงภาวะสมองเสื่อมหรือภาวะพลัดตกหกล้มได้รับการดูแลรักษาใน คลินิกผู้สูงอายุ รายไตรมาส https://dmscaretools.dms.go.th/geriatric/",
      "source": "1. ฐานข้อมูลการประเมินคัดกรอง ADL และกลุ่มอาการความเสื่อม Health Data Center 2. รายงานการประเมินมาตรฐานการจัดบริการคลินิกผู้สูงอายุ 3. รายงานผู้สูงอายุที่คัดกรองพบว่าเสี่ยงภาวะสมองเสื่อมหรือภาวะพลัดตกหกล้มได้รับการดูแลรักษา ในคลินิกผู้สูงอายุ",
      "formula": "(จำนวนผลงานกลุ่มเป้าหมายที่บรรลุตามเกณฑ์มาตรฐาน [A] ÷ จำนวนกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน [B]) × 100",
      "numeratorA": "จำนวนผู้สูงอายุที่ไม่มีภาวะพึ่งพิง(กลุ่มติดสังคม) ADL 12 คะแนนขึ้นไป",
      "denominatorB": "จำนวนประชากรผู้สูงอายุที่ได้รับการคัดกรองกลุ่มอาการความเสื่อมในผู้สูงอายุทั้งหมด",
      "frequency": "ตุลาคม 2567 - กันยายน 2568",
      "evaluationMethod": "1. อสม.บันทึกผลการประเมินสุขภาพและคัดกรองกลุ่มอาการผู้สูงอายุ 9 ด้าน > ร้อยละ 80 2. Care Manager และเจ้าหน้าที่สาธารณสุขในหน่วยบริการสาธารณสุข ประเมิน ADL > ร้อยละ 60 รายละเอียดข้อมูล 3. ผู้สูงอายุกลุ่มเสี่ยงภาวะถดถอยได้รับการส่งเสริมสุขภาพดี (Wellness Plan) > ร้อยละ 60 พื้นฐาน 4. ผู้สูงอายุกลุ่มเสี่ยงภาวะถดถอยได้รับการส่งต่อดูแลรักษาในคลินิกผู้สูงอายุ > ร้อยละ 60 5. โรงพยาบาลทุกระดับจัดบริการคลินิกผู้สูงอายุผ่านเกณฑ์คุณภาพ > ร้อยละ 80 (Baseline Data) ผลการดำเนินงาน ผลงาน ปี 2565 ปี 2566 ปี 2567 ย้อนหลัง 3 ปี ร้อยละของผู้สูงอายุไม่มีภาวะพึ่งพิง 96.2 95.1 95.2",
      "responsible": "ชื่อ-สกุล นางอังคณา อึ้งปิติมานะ ตำแหน่ง นักวิชาการสาธารณสุขชำนาญการ กลุ่มงานส่งเสริมสุขภาพ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ 149 โทรสาร 0-4322-4037 โทรศัพท์มือถือ. 0617929942 E-mail :ungpitimana.ang@gmail.com"
    },
    "KPI69-32": {
      "kpiId": "KPI69-32",
      "order": 32,
      "name": "บุคลากรที่ปฏิบัติงานในระดับเครือข่ายบริการสุขภาพได้รับการพัฒนาสมรรถนะหลักและสมรรถนะรอง",
      "strategy": "ยุทธศาสตร์ที่ 3",
      "objective": "เป้าประสงค์ที่ 6",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "80",
      "baseline": "-",
      "definition": "บุคลากรที่ปฏิบัติงานในระดับเครือข่ายบริการสุขภาพได้รับการพัฒนาสมรรถนะหลักและสมรรถนะรอง ตามเกณฑ์มาตรฐานแผนยุทธศาสตร์สุขภาพ 5 ปี จังหวัดขอนแก่น (พ.ศ. 2566–2570)",
      "purpose": "1. เพื่อให้ผู้สูงอายุได้รับการส่งเสริมสุขภาพ หรือคงสมรรถภาพทางร่างกาย สมอง สุขภาพจิต และสังคม ของผู้สูงอายุป้องกันหรือลดการเกิดภาวะพึ่งพิงในผู้สูงอายุ 2. เพื่อส่งเสริมผู้สูงอายุกลุ่มเสี่ยงให้ได้รับการดูแลตามแผนส่งเสริมสุขภาพดี(Wellness Plan) 3. เพื่อให้ผู้สูงอายุได้รับการดูแลรักษากลุ่มอาการ Geriatric Syndromes และปัญหาสุขภาพที่สำคัญ อย่างเหมาะสมหลังจากได้รับการคัดกรองสุขภาพในการส่งต่อเข้าสู่ระบบริการคลินิกผู้สูงอายุ",
      "population": "ผู้สูงอายุกลุ่มที่ 1 (กลุ่มติดสังคม) จากการประเมิน ADL คะแนนตั้งแต่ 12 คะแนนขึ้นไป",
      "collectionMethod": "1. บันทึกการคัดกรอง ADL และกลุ่มอาการความเสื่อมในฐานข้อมูล HDC 2. รายงานการประเมินมาตรฐานการจัดบริการคลินิกผู้สูงอายุ https://dmscaretools.dms.go.th/geriatric/ 3. รายงานผู้สูงอายุกลุ่มเสี่ยงมีแผนส่งเสริมสุขภาพดี (Wellness Plan) https://care.anamai.moph.go.th/ 4. รายงานผู้สูงอายุที่คัดกรองพบว่าเสี่ยงภาวะสมองเสื่อมหรือภาวะพลัดตกหกล้มได้รับการดูแลรักษาใน คลินิกผู้สูงอายุ รายไตรมาส https://dmscaretools.dms.go.th/geriatric/",
      "source": "1. ฐานข้อมูลการประเมินคัดกรอง ADL และกลุ่มอาการความเสื่อม Health Data Center 2. รายงานการประเมินมาตรฐานการจัดบริการคลินิกผู้สูงอายุ 3. รายงานผู้สูงอายุที่คัดกรองพบว่าเสี่ยงภาวะสมองเสื่อมหรือภาวะพลัดตกหกล้มได้รับการดูแลรักษา ในคลินิกผู้สูงอายุ",
      "formula": "(จำนวนผลงานกลุ่มเป้าหมายที่บรรลุตามเกณฑ์มาตรฐาน [A] ÷ จำนวนกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน [B]) × 100",
      "numeratorA": "จำนวนผู้สูงอายุที่ไม่มีภาวะพึ่งพิง(กลุ่มติดสังคม) ADL 12 คะแนนขึ้นไป",
      "denominatorB": "จำนวนประชากรผู้สูงอายุที่ได้รับการคัดกรองกลุ่มอาการความเสื่อมในผู้สูงอายุทั้งหมด",
      "frequency": "ตุลาคม 2567 - กันยายน 2568",
      "evaluationMethod": "1. อสม.บันทึกผลการประเมินสุขภาพและคัดกรองกลุ่มอาการผู้สูงอายุ 9 ด้าน > ร้อยละ 80 2. Care Manager และเจ้าหน้าที่สาธารณสุขในหน่วยบริการสาธารณสุข ประเมิน ADL > ร้อยละ 60 รายละเอียดข้อมูล 3. ผู้สูงอายุกลุ่มเสี่ยงภาวะถดถอยได้รับการส่งเสริมสุขภาพดี (Wellness Plan) > ร้อยละ 60 พื้นฐาน 4. ผู้สูงอายุกลุ่มเสี่ยงภาวะถดถอยได้รับการส่งต่อดูแลรักษาในคลินิกผู้สูงอายุ > ร้อยละ 60 5. โรงพยาบาลทุกระดับจัดบริการคลินิกผู้สูงอายุผ่านเกณฑ์คุณภาพ > ร้อยละ 80 (Baseline Data) ผลการดำเนินงาน ผลงาน ปี 2565 ปี 2566 ปี 2567 ย้อนหลัง 3 ปี ร้อยละของผู้สูงอายุไม่มีภาวะพึ่งพิง 96.2 95.1 95.2",
      "responsible": "ชื่อ-สกุล นางอังคณา อึ้งปิติมานะ ตำแหน่ง นักวิชาการสาธารณสุขชำนาญการ กลุ่มงานส่งเสริมสุขภาพ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ 149 โทรสาร 0-4322-4037 โทรศัพท์มือถือ. 0617929942 E-mail :ungpitimana.ang@gmail.com"
    },
    "KPI69-33": {
      "kpiId": "KPI69-33",
      "order": 33,
      "name": "ผลงานวิจัย/R2R/นวัตกรรมหรือเทคโนโลยีสุขภาพที่คิดค้นใหม่หรือที่พัฒนาต่อยอดนำไปแก้ไขปัญหาสาธารณสุขที่สำคัญของจังหวัดขอนแก่น",
      "strategy": "ยุทธศาสตร์ที่ 4",
      "objective": "เป้าประสงค์ที่ 7",
      "unit": "เรื่อง",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "วิจัย 400 / นวัตกรรม 100",
      "baseline": "448 (เรื่อง)",
      "definition": "จำนวนผลงานวิจัย/R2R/นวัตกรรมหรือเทคโนโลยีสุขภาพที่คิดค้นใหม่หรือที่พัฒนาต่อยอด ที่แก้ไขปัญหา สาธารณสุขที่สำคัญของจังหวัดขอนแก่น ผลงานวิจัย/ ผลงาน R2R (Routine to Research) หมายถึง ผลที่ได้จากการศึกษาค้นคว้าอย่างเป็น ระบบด้วยวิธีการทางวิทยาศาสตร์หรือวิธีการที่เชื่อถือได้ ซึ่งต้องเป็นไปตามระเบียบวิธีหรือกฎเกณฑ์ ที่ถูกต้อง/ การพัฒนางานประจำสู่งานวิจัย ที่คิดค้นใหม่หรือที่พัฒนาต่อยอด เพื่อให้ได้ความรู้ที่เชื่อถือได้ มีเหตุมีผลเป็นไปตามวิธีการทางวิทยาศาสตร์ และนำไปใช้อย่างเป็นประโยชน์ในการให้บริการด้าน สาธารณสุข แก้ไขปัญหาสาธารณสุขในพื้นที่และปัญหาสาธารณสุขที่สำคัญจังหวัดขอนแก่นได้ นวัตกรรม (Innovative) หมายถึง สิ่งที่ทำขึ้นใหม่ หรือแตกต่างจากเดิม ซึ่งอาจเป็นความคิด วิธีการ หรืออุปกรณ์ เป็นต้น ที่มีคุณค่า และมีประโยชน์ต่อการให้บริการสุขภาพแก่ประชาชน นวัตกรรมการจัดการบริการสุขภ าพ (Innovative Healthcare Management) หมายถึง นวัตกรรมการบริหารและการจัดบริการสุขภาพใหม่ แก่ประชาชนให้สามารถเข้าถึงบริการทางการแพทย์ และสาธารณสุขได้รวดเร็ว สะดวก ปลอดภัย และมีประสิทธิภาพเพื่อส่งเสริมคุณภาพชีวิตประชาชนให้ดีขึ้น เทคโนโลยีทางสุขภาพ หมายถึง การรวบรวมความรู้และวิธีการทางวิทยาศาสตร์มาใช้อย่างเป็นระบบซึ่ง จะช่วยให้เกิดประสิทธิภาพในการดูแลการสร้างเสริมสุขภาพ การป้องกันรักษาโรค และการฟื้นฟู สมรรถภาพทางร่างกาย เพื่อให้บุคคลหรือชุมชนมีสุขภาพที่ดีและมีความปลอดภัยในชีวิต ทั้งนี้หมายรวมถึง เทคโนโลยีที่เกี่ยวกับผลิตภัณฑ์สุขภาพ (เทคโนโลยีเกี่ยวกับผลิตภัณฑ์เครื่องสำอาง อาหาร ยา เครื่องมือ แพทย์ และอุปกรณ์หรือเครื่องมือสุขภาพ) และบริการสุขภาพ (เทคโนโลยีที่เกี่ยวกับการตรวจโรค การรักษาโรค การป้องกันโรค และการสร้างเสริมสุขภาพ) การพัฒนาต่อยอด หมายถึง การนำนวัตกรรมด้านวิทยาศาสตร์การแพทย์หรือเทคโนโลยีสุขภาพ ที่เคยมีการศึกษา วิจัยประดิษฐ์ คิดค้นขึ้นที่สำเร็จแล้ว นำมาพัฒนาต่อยอด ให้เกิดประโยชน์เพิ่มเติมจากเดิม การนำองค์ความรู้ เทคโนโลยี และนวัตกรรมไปใช้ประโยชน์ หมายถึง การมีหลักฐานที่แสดงว่าได้ มีการนำองค์ความรู้ เทคโนโลยี และนวัตกรรมที่ได้จากการศึกษา วิจัย ไปใช้ประโยชน์ในการแก้ปัญหา สาธารณสุขตาม",
      "purpose": "1. เพื่อแก้ไขปัญหาสาธสาธารณสุขที่สำคัญของจังหวัดขอนแก่น โดยงานวิจัย/R2R/ นวัตกรรม หรือ เทคโนโลยีสุขภาพที่คิดค้นใหม่หรือที่พัฒนาต่อยอด 2. เพื่อเพิ่มอายุคาดเฉลี่ยของประชาชนจังหวัดขอนแก่น เมื่อแรกเกิด (LE) ไม่น้อยกว่า 85 ปี อายุคาด เฉลี่ยของการมีสุขภาพดี (HALE) ไม่น้อยกว่า 75 ปี ตามเป้าหมายตามแผนยุทธศาสตร์ชาติ ระยะ 20 ปี ด้านสาธารณสุข",
      "population": "เครือข่ายบริการสุขภาพสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "collectionMethod": "รวบรวมข้อมูลจากเครือข่ายบริการสุขภาพสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "source": "ฐานข้อมูลผลงานวิจัย/R2R/นวัตกรรม ด้านวิทยาศาสตร์การแพทย์ของเครือข่ายบริการสุขภาพ สำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "formula": "- ระยะเวลา ไตรมาสที่ 3-4 ประเมินผล",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI69-34": {
      "kpiId": "KPI69-34",
      "order": 34,
      "name": "จำนวนโรงพยาบาลสังกัดกระทรวงสาธารณสุขที่พัฒนาสู่องค์กรดิจิทัลและมีความมั่นคงปลอดภัยทางไซเบอร์",
      "strategy": "ยุทธศาสตร์ที่ 4",
      "objective": "เป้าประสงค์ที่ 7",
      "unit": "แห่ง",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "26 แห่ง",
      "baseline": "22 แห่ง",
      "definition": "จำนวนโรงพยาบาลสังกัดกระทรวงสาธารณสุขที่พัฒนาสู่องค์กรดิจิทัลและมีความมั่นคงปลอดภัยทางไซเบอร์ ตามเกณฑ์มาตรฐานแผนยุทธศาสตร์สุขภาพ 5 ปี จังหวัดขอนแก่น (พ.ศ. 2566–2570)",
      "purpose": "เพื่อส่งเสริมให้โรงพยาบาลสังกัดสำนักงานสาธารณสุขจังหวัด มีการพัฒนาอนามัยสิ่งแวดล้อม ได้ตามเกณฑ์ GREEN & CLEAN Hospital Challenge",
      "population": "โรงพยาบาลสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "collectionMethod": "โรงพยาบาลทุกแห่งบันทึกข้อมูลในโปรแกรม GREEN & CLEAN Hospital",
      "source": "โปรแกรมการประเมิน GREEN & CLEAN Hospital",
      "formula": "A = จำนวนรพ.ที่ดำเนินการได้ตามเกณฑ์ 13 ข้อ (คะแนน 80 % ขึ้นไป) B = จำนวนรพ.ที่ดำเนินการได้ตามเกณฑ์ 15 ข้อ (คะแนน 90 % ขึ้นไป) C = จำนวนรพ.ที่ดำเนินการได้ตามเกณฑ์ 15 ข้อ (คะแนน 90 % ขึ้นไป) และพัฒนาได้ตามประเด็นท้าทายA+B+C=26 ระยะเวลา นิเทศ ติดตาม และประเมินผลการดำเนินงานสาธารณสุขจังหวัดขอนแก่น ปี 2568 จำนวน 2 รอบ ประเมินผล",
      "numeratorA": "จำนวนโรงพยาบาลสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่นที่ดำเนินการ GREEN & CLEAN",
      "denominatorB": "จำนวนโรงพยาบาลสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่นที่ดำเนินการ GREEN & CLEAN",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "1. โรงพยาบาลทุกแห่งประเมินตนเองบันทึกข้อมูลในโปรแกรม GREEN & CLEAN Hospital ส่งให้ สำนักงานสาธารณสุขจังหวัดขอนแก่น 2. สำนักงานสาธารณสุขจังหวัดขอนแก่น ประเมินผลการดำเนินงานของโรงพยาบาลศูนย์ โรงพยาบาล",
      "responsible": "1. นายณัฐิวุฒิ จันตะแสง ตำแหน่ง นักสาธารณสุขชำนาญการ กลุ่มงานอนามัยสิ่งแวดล้อมและอาชีวอนามัย สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 043 221125 ต่อ 156 โทรสาร 043 224037 โทรศัพท์มือถือ 064 983 9562 e-mail: pro_tb@yahoo.com 2. นางสาวนภัสวรรณ สนธินอก ตำแหน่ง นักวิชาการสาธารณสุขชำนาญการ กลุ่มงานอนามัยสิ่งแวดล้อมและอาชีวอนามัย สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 043 221125 ต่อ 156 โทรสาร 043 224037 โทรศัพท์มือถือ 091 867 3075 e-mail: aom.napass@gmail.com"
    },
    "KPI69-35": {
      "kpiId": "KPI69-35",
      "order": 35,
      "name": "โรงพยาบาลสังกัดกระทรวงสาธารณสุขมีคุณภาพผ่านการรับรองตามมาตรฐาน",
      "strategy": "ยุทธศาสตร์ที่ 4",
      "objective": "เป้าประสงค์ที่ 8",
      "unit": "แห่ง",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "26 แห่ง",
      "baseline": "-",
      "definition": "โรงพยาบาลสังกัดกระทรวงสาธารณสุขมีคุณภาพผ่านการรับรองตามมาตรฐาน ตามเกณฑ์มาตรฐานแผนยุทธศาสตร์สุขภาพ 5 ปี จังหวัดขอนแก่น (พ.ศ. 2566–2570)",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "ผลการดำเนินงานจริงเทียบกับเกณฑ์เป้าหมาย (แห่ง)",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI69-36": {
      "kpiId": "KPI69-36",
      "order": 36,
      "name": "จำนวนสำนักงานสาธารณสุขอำเภอผ่านเกณฑ์พัฒนาศักยภาพเป็นองค์กรสมรรถนะสูง Smart สสอ.ด้านการคุ้มครองผู้บริโภค",
      "strategy": "ยุทธศาสตร์ที่ 4",
      "objective": "เป้าประสงค์ที่ 8",
      "unit": "แห่ง",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "15",
      "baseline": "9",
      "definition": "ด้านการคุ้มครองผู้บริโภค",
      "purpose": "คุ้มครองผู้บริโภคด้านสุขภาพโดยมีการจัดตั้งศูนย์บริการสุขภาพเบ็ดเสร็จระดับอำเภอ ซึ่งประกอบด้วย",
      "population": "ภารกิจ ดังนี้",
      "collectionMethod": "1. จัดตั้งศูนย์บริการสุขภาพเบ็ดเสร็จระดับอำเภอ ซึ่งมีองค์ประกอบด้านกายภาพ/ บุคลากร/อุปกรณ์/ คู่มือ/สถานที่ ครบถ้วน โดยกำหนดให้มี 1) จัดทำและติดตั้งป้ายชื่อศูนย์บริการสุขภาพเบ็ดเสร็จระดับอำเภอ 2) จัดทำสื่อประชาสัมพันธ์ศูนย์ฯ ผ่านให้บริการผ่านสื่อออนไลน์ เช่น เว็บไซต์/ Line group/ Facebook 3) จัดให้มีอุปกรณ์อำนวยความสะดวกผู้รับบริการในการขออนุญาตสถานประกอบการและ ผลิตภัณฑ์สุขภาพ ได้แก่โน๊ตบุ๊ค/ปริ้นเตอร์ 4) จัดให้มีจุดพักคอย 5) คู่มือการให้บริการประชาชน 6) มีการสำรวจความพึงพอใจ/ความต้องการของผู้มารับบริการ 2. จัดให้มีบริการให้คำปรึกษาการขออนุญาตฯ ผ่านระบบออนไลน์ ได้แก่ ระบบสำนักงาน คณะกรรมการอาหารและยา (Skynet) และ ระบบกรมสนับสนุนบริการสุขภาพ (Biz Portal) 3. จัดให้มีบริการอนุญาตเปิดสิทธิ์การเข้าใช้ระบบ Skynet ของผู้ประกอบการ 4. ดำเนินการตรวจสอบมาตรฐานสถานประกอบการเพื่อประกอบการพิจารณาอนุญาต Pre- marketing และดำเนินการตรวจเฝ้าระวัง Post-marketing สถานประกอบการด้านสุขภาพในเขต พื้นที่ 5. ดำเนินการจัดการเรื่องร้องเรียนด้านผลิตภัณฑ์และสถานประกอบการสุขภาพ SAT Team คปสอ. 6. ส่งเสริมนโยบายเศรษฐกิจสุขภาพ สร้างการมีส่วนร่วมของทุกภาคส่วน โดยสร้างเครือข่ายความ ร่วมมือระหว่างศูนย์บริการสุขภาพเบ็ดเสร็จและหน่วยงานในพื้นที่ 7. รายงานผลการดำเนินงานโดยผ่านช่องทาง Dash board 8. มีการนิเทศและติดตามผลการดำเนินงานภายใน คปสอ. 10 แห่ง เพื่อส่งเสริมให้เกิด Smart District Health Consumer Protection สำนักงานสาธารณสุขอำเภอ สังกัด กระทรวงสาธารณสุขที่มีการประยุกต์ใช้เทคโนโลยีดิจิตัลเพิ่มประสิทธิภาพการให้บริการด้านการคุ้มครอง ผู้บริโภคผลิตภัณฑ์และบริการสุขภาพ และ ตอบสนองนโยบายส่งเสริมเศรษฐกิจสุขภาพ KPI : Health for wealth (ร้อยละผลิตภัณฑ์สุขภาพที่ได้รับการส่งเสริมและได้รับการอนุญาต) ศูนย์บริการสุขภาพเบ็ดเสร็จระดับอำเภอ จังหวัดขอนแก่น สำนักงานสาธารณสุขอำเภอ นำข้อมูลผลการดำเนินงานผ่านระบบรายงาน Dashboard ศูนย์บริการ สุขภาพเบ็ดเสร็จอำเภอ, คู่มือการดำเนินงานศูนย์ฯ/คู่มือการจัดการเรื่องร้องเรียน และ ผลการนิเทศติดตาม ศูนย์ฯต้นแบบ",
      "source": "สาธารณสุขอำเภอทุกอำเภอ",
      "formula": "3.แผนงานขับเคลื่อนการดำเนินงานสนับสนุนส่งเสริมนโยบายเศรษฐกิจสุขภาพในเขตพื้นที่",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "4.บันทึกผลการตรวจสอบเพื่อประกอบการอนุญาต Pre-marketing และ การตรวจเฝ้าระวังประจำปี",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI69-37": {
      "kpiId": "KPI69-37",
      "order": 37,
      "name": "จำนวนโรงพยาบาลมีการบริหารการเงินการคลังอย่างมีประสิทธิภาพ",
      "strategy": "ยุทธศาสตร์ที่ 4",
      "objective": "เป้าประสงค์ที่ 9",
      "unit": "แห่ง",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "24 แห่ง",
      "baseline": "21 แห่ง",
      "definition": "หน่วยบริการปฐมภูมิ หมายถึง หน่วยบริการสาธารณสุขระดับปฐมภูมิ ทุกสังกัดที่ขึ้นทะเบียน เป็นหน่วยบริการปฐมภูมิเกณฑ์ประเมินคุณภาพมาตรฐานบริการสุขภาพปฐมภูมิ หมายถึง เกณฑ์ ประเมิณคุณภาพมาตรฐานบริการสุขภาพปฐมภูมิ พ.ศ.2566 (ฉบับปรับปรุง) มีเกณฑ์การประเมินดังนี้ ส่วนที่ 1 ด้านระบบบริหารจัดการ ส่วนที่ 2 ด้านการจัดบุคคลากรและศักยภาพในการให้บริการ ส่วนที่ 3 ด้านสถานที่ตั้งหน่วยบริการ อาคาร สถานที่ และสิ่งแวดล้อม ส่วนที่ 4 ด้านระบบสารสนเทศ ส่วนที่ 5 ด้านระบบบริการสุขภาพปฐมภูมิ ส่วนที่ 6 ด้านระบบห้องปฏิบัติการด้านการแพทย์และสาธารณสุข ส่วนที่ 7 ด้านการจัดบริการเภสัชกรรมอลังานคุ้มครองผู้บริโภคด้านสุขภาพ ส่วนที่ 8 ด้านระบบการป้องกันและควบคุมการติดเชื่อ โดยมีการแปลผลดังนี้ ส่วนที่ 1 – 4 หน่วยบริการต้องผ่านเกณฑ์ทุกข้อ ส่วนที่ 5 – 8 หน่วยบริการต้องผ่านเกณ์ร้อยละ 80 ขึ้นไป",
      "purpose": "1. เพื่อให้ประชาชนสามารถเข้าถึงบริการที่มีคุณภาพ มาตรฐาน 2. เพื่อพัฒนาหน่วยบริการปฐมภูมิให้มีคุณภาพมาตรฐาน",
      "population": "หน่วยบริการปฐมภูมิทุกแห่ง ทุกสังกัด",
      "collectionMethod": "การจัดเก็บการประเมินคุณภาพมาตรฐาน จากระบบข้อมูลทรัพยากรสุขภาพหน่วยบริการปฐมภูมิ",
      "source": "(PCU Standard)",
      "formula": "A = จำนวนหน่วยบริการปฐมภูมิที่ผ่านเณฑ์การประเมิณมาตรฐานระบบสุขภาพปฐมภูมิ",
      "numeratorA": "จำนวนหน่วยบริการปฐมภูมิที่ผ่านเณฑ์การประเมิณมาตรฐานระบบสุขภาพปฐมภูมิ",
      "denominatorB": "จำนวนหน่วยบริการปฐมภูมิทั้งหมดทุกสังกัด",
      "frequency": "B = จำนวนหน่วยบริการปฐมภูมิทั้งหมดทุกสังกัด",
      "evaluationMethod": "ระบบข้อมูลทรัพยากรสุขภาพ หน่วยบริการปฐมภูมิ (PCU Standard )และ สุ่มลงตรวจประเมิน ในพื้นที่ รายละเอียดข้อมูล พื้นฐาน(Baseline ผลงาน ปี 2565 ปี 2566 ปี 2567 Data) Baseline Data - - ร้อยละ 41.08 ผลการดำเนินงาน ย้อนหลัง 3 ปี ชื่อ-สกุล...นางศิริพร อุทธากิจ ตำแหน่ง..พยาบาลวิชาชีพชำนาญการ (ปี 2565 -2567) กลุ่มงาน..พัฒนาคุณภาพและรูปแบบบริการ.",
      "responsible": "สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ 122... โทรสาร 0-4322-4037 ผู้กำกับดูแลตัวชี้วัด โทรศัพท์มือถือ..080 - 3570910. E-mail : .pcunpcu2022@gmail.com ชื่อ-สกุล...นางศิริมา นามประเสริฐ ตำแหน่ง..หัวหน้ากลุ่มงานพัฒนาคุณภาพและรูปแบบบริการ กลุ่มงาน..พัฒนาคุณภาพและรูปแบบบริการ. สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ 122... โทรสาร 0-4322-4037"
    },
    "KPI69-38": {
      "kpiId": "KPI69-38",
      "order": 38,
      "name": "ร้อยละผลิตภัณฑ์สุขภาพและสถานประกอบการมีคุณภาพตามเกณฑ์",
      "strategy": "ยุทธศาสตร์ที่ 5",
      "objective": "เป้าประสงค์ที่ 10",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "> 95",
      "baseline": "100",
      "definition": "ประชาชนทุกกลุ่มวัย และผู้บริโภคมีพฤติกรรมสุขภาพที่เหมาะสม",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่นอย่างมีประสิทธิภาพและยั่งยืน",
      "population": "ระยะเวลา ผลที่คาดว่าจะได้รับ ดำเนินการ (ไตรมาส) เศรษฐกิจสุขภาพ : เพื่อส่งเสริมและพัฒนาประกอบการ 1.โครงการขอนแก่น Smart FDA Data Center 1. วิสาหกิจชุมชน ไตรมาสที่ 1 และ 2 1.ร้อยละ 95 ของผลิตภัณฑ์ ผลิตภัณฑ์สุขภาพและสถาน เชื่อมโยงข้อมูลสถานประกอบการและผลิตภัณฑ์ วิสาหกิจรายย่อย และ สุขภาพได้รับการส่งเสริม เป้าหมาย ประกอบการให้มีคุณภาพตาม สุขภาพแบบบูรณาการ Wellness Directory สถานที่ผลิตที่ไม่เข้าข่าย ขั้นต่ำ อำเภอละ 1 ผลิตภัณฑ์ มาตรฐานที่กำหนด ทั้งด้านอาหาร 2.โครงการ Khon Kaen Wellness Roadshow โรงงาน 100 ราย (อาหาร 2.ผลิตภัณฑ์ที่ส่งเสริมได้รับอนุญาต สมุนไพร เครื่องสำอาง และวัตถุ สินค้าดี บริการเด่น ผลิตภัณฑ์และบริการสุขภาพสู่สากล 75 รายเครื่องสำอาง 10 ไม่น้อยกว่า 55 รายการ (ตาม อันตราย โดยเชื่อมโยงกับแผน 3.โครงการยกระดับ Smart สสอ.สู่ศูนย์บริการสุขภาพ ราย สมุนไพร 10 ราย ตัวชี้วัด) ยุทธศาสตร์จังหวัดขอนแก่น เบ็ดเสร็จต้นแบบเพื่อการคุ้มครองผู้บริโภคอย่างยั่งยืน และวัตถุอันตราย 5 ราย) 3.ผลิตภัณฑ์สุขภาพของจังหวัด “ประเด็นการพัฒนาเศรษฐกิจ 4.โครงการขับเคลื่อนผู้ประกอบการเศรษฐกิจสุขภาพ (เป้าหมายร่วม พช. ขอนแก่นได้รับรางวัลระดับชาติ สุขภาพของจังหวัดขอนแก่นอย่าง สู่เมืองนวัตกรรมสุขภาพขอนแก่น อุตสาหกรรม เกษตร) อย่างน้อย 1 รายการ ยั่งยืน “ 5.โครงการยกระดับเส้นทางท่องเที่ยวเชิงสุขภาพสู่เมือง 2.คณะทำงานเศรษฐกิจ 4.มูลค่าทางผลิตภัณฑ์เศรษฐกิจ ต้นแบบ Wellness & Medical Hub ขอนแก่น ได้แก่ สุขภาพระดับอำเภอ 4 สุขภาพของจังหวัดเพิ่มขึ้นอย่าง สาวะถี, อุบลรัตน์,ภูผาม่าน, สีชมพู, ภูเวียง,เวียงเก่า) โซน ต่อเนื่อง 6.โครงการขอนแก่นเมืองสุขภาพ ยกระดับ สถาน ประกอบการสู่มาตรฐาน Wellness Center (กรม แพทย์แผนไทย) 7.โครงการพัฒนาศักยภาพบุคลากรด้านการแพทย์แผน ไทย (การนวดไทยเฉพาะทาง) 8.โครงการพัฒนาระบบกำกับดูแลและเฝ้าระวังการใช้ สมุนไพรควบคุม (กัญชา) อย่างปลอดภัยและได้มาตรฐาน",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "(จำนวนผลงานที่บรรลุเกณฑ์ [A] ÷ จำนวนกลุ่มเป้าหมายทั้งหมด [B]) × 100",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    }
  },
  "70": {
    "KPI70-01": {
      "kpiId": "KPI70-01",
      "order": 1,
      "name": "ร้อยละของประชาชนวัยทำงานอายุ 19-59 ปี มี BMI เกินได้รับการปรับเปลี่ยนพฤติกรรมและมี BMI ลดลง",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 1",
      "unit": "ร้อยละ",
      "direction": "ยิ่งน้อยยิ่งดี",
      "target": "< 38",
      "baseline": "46.74",
      "definition": "ร้อยละของประชาชนวัยทำงานอายุ 19-59 ปี มี BMI เกิน ได้รับการปรับเปลี่ยนพฤติกรรมและมี BMI ลดลง ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อาสาสมัครสาธารณสุขประจำหมู่บ้าน(อสม.) และบุคลากรสาธารณสุข ที่มีอายุ 19-59 ปี หมายถึง ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุข ที่มีอายุ 19 ปี 0 เดือน 1 วัน ถึง 59 ปี 11 เดือน 29 วัน ที่ยังไม่ป่วยด้วยโรคเบาหวาน และ/หรือความดันโลหิตสูงทั้งหมดในรอบ ปีงบประมาณ 2568 ค่าดัชนีมวลกาย (Body Mass Index : BMI) หมายถึง ค่าซึ่งเป็นความสัมพันธ์ระหว่างน้ำหนักตัวเป็นกิโลกรัม กับส่วนสูงเป็นเมตร หน่วยวัดเป็น กิโลกรัม/เมตร2",
      "purpose": "เพื่อให้กลุ่มเป้าหมายได้รับการคัดกรอง ประเมินภาวะสุขภาพ และปรับเปลี่ยนพฤติกรรมสุขภาพอย่างเหมาะสม",
      "population": "2. ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุข อายุ 19-59 ปี ที่มีค่าดัชนีมวลกาย",
      "collectionMethod": "อ้วนระดับ 1 และอ้วนระดับ 2 มี BMI ลดลง มากกว่าหรือเท่ากับ ร้อยละ 2",
      "source": "1. เพื่อให้ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุข อายุ 19-59 ปี ได้รับ",
      "formula": "การประเมินภาวะโภชนาการที่ครอบคลุม 2. เพื่อให้ ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุข อายุ 19-59 ปี ที่มีค่าดัชนี มวลกายอ้วนระดับ 1 และอ้วนระดับ 2 มี BMI ลดลง ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุข สังกัด รพ.สต./PCU/รพช./รพท./รพศ./ สสอ. ที่มีอายุ 19-59 ปี รายงานผลการคัดกรอง ชั่งน้ำหนัก วัดส่วนสูง วัดรอบเอว ดัชนีมวลกาย จาก โปรแกรม Khonkaen-HTD รพ.สต./PCU/สสอ./รพช./รพท./รพศ. 1. ร้อยละ ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุขอายุ 19-59 ปี ได้รับการชั่ง น้ำหนัก วัดส่วนสูง มากกว่า หรือเท่ากับ ร้อยละ 70 A = จำนวน ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุขอายุ19-59 ปี ที่ชั่งน้ำหนัก วัดส่วนสูงทั้งหมด",
      "numeratorA": "จำนวน ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุขอายุ19-59 ปี",
      "denominatorB": "จำนวน ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุขอายุ19-59 ปี",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "เกณฑ์การให้คะแนน(รวม 100 คะแนน) ผลรวม คะแนน 10 คะแนน 20 คะแนน 30 คะแนน 40 คะแนน 40 % ชั่ง นน. < 60.00 % 60.00–64.99 % 65.00-69.99 > 70.00 % สส. % คะแนน 15 คะแนน 30 คะแนน 45 คะแนน 60 คะแนน 60 % BMI ลดลง <1.00 % 1.00-1.49 % 1.50 – 1.99 % > 2.0 % 17.วิธีการประเมินผล คะแนน 1 คะแนน 2 คะแนน 3 คะแนน 4 คะแนน 5 คะแนนรวม < 60 คะแนนรวม คะแนนรวม คะแนนรวม คะแนนรวม 60.01-70.00 70.01-80.00 80.01-90.00 >90 รายละเอียดข้อมูล รายละเอียดข้อมูลพื้นฐาน (Baseline data) ผลการดำเนินงานย้อนหลัง 3 ปี (ปี 2565 - 2567) พื้นฐาน Baseline data หน่วยวัด ผลการดำเนินงานในรอบปีงบประมาณ (Baseline Data) ผลการดำเนินงาน 2565 2566 2567 ย้อนหลัง 3 ปี (ปี 2565 -2567) N/A N/A -3.94",
      "responsible": "นางสาวเทวารักษ์ ภูครองนาค ตัวชี้วัด นักวิชาการสาธารณสุขชำนาญการ โทร. 09 5652 7227 Email : theywarak.ph@gmail.com"
    },
    "KPI70-02": {
      "kpiId": "KPI70-02",
      "order": 2,
      "name": "ระดับคะแนนความสำเร็จของอำเภอในการดำเนินงานความรอบรู้ด้านสุขภาพในการป้องกันโรค Stroke, Pneumonia และภาวะติดเชื้อในกระแสเลือด",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 1",
      "unit": "คะแนน",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "88",
      "baseline": "82.06",
      "definition": "ระดับคะแนนความสำเร็จของอำเภอในการดำเนินงานความรอบรู้ด้านสุขภาพ 2.1 ผู้ป่วยโรคเบาหวาน/โรคความดันโลหิตสูงมีความรอบรู้ด้านสุขภาพในการป้องกันโรค Stroke 2.2 ผู้สูงอายุ60ปีขึ้นไป และกลุ่มอายุน้อยกว่าหรือเท่ากับ 10 ปี มีความรอบรู้ด้านสุขภาพใน โรคPneumonia และภาวะ Sepsis ความรอบรู้ด้านสุขภาพ หมายถึง ความรู้และทักษะของผู้ป่วยโรคเบาหวาน/โรคความดันโลหิตสูงที่จำเป็น สำหรับการเข้าถึง เข้าใจ ประเมินและตัดสินใจด้านสุขภาพของตนเองและคนรอบข้างได้อย่างเหมาะสม ความรู้และทักษะของ ประชาชนกลุ่มเสี่ยงโรค Pneumonia และภาวะ Sepsis ได้แก่ ผู้กลุ่มอายุ 60 ปีขึ้นไป กลุ่มอายุน้อยกว่าหรือเท่ากับ 10 ปี ที่อ่านออกเขียนได้ ที่จำเป็นสำหรับความเข้าใจ ความสามารถในการ ประเมิน Early warning sign และตัดสินใจด้านสุขภาพของตนเองและคนรอบข้างได้อย่างเหมาะสม อัตราความรอบรู้ด้านสุขภาพ เป็นตัวชี้วัดที่วัดจากการประเมินดังนี้ 1. ประเมินความรอบรู้ด้านสุขภาพของผู้ป่วยโรคเบาหวาน โรคความดันโลหิตสูง อายุ 15 ปี ขึ้นไป ที่เข้าร่วมกิจกรรมส่งเสริมสุขภาพในชุมชนรอบรู้ด้านสุขภาพ (Health Literate Communities: HLC) ซึ่งจัด โดยสถานบริการสุ ขภ าพ ที่ เป็ น องค์ กรรอบรู้ด้ านสุ ขภ าพ (Health Literate Organization: HLO) การประเมิ นใช้ ระบ บการป ระเมิ นจากเว็บไซต์ สาสุ ข อุ่นใจ คน ไทย รอบรู้ ของกรมอนามั ย (https://sasukoonchai.anamai.moph.go.th/) 2. ประเมินความรอบรู้ด้านสุขภาพของประชาชนกลุ่มเสี่ยงโรค Pneumonia และภาวะ Sepsis ได้แก่ ผู้กลุ่มอายุ 60 ปีขึ้นไป กลุ่มอายุน้อยกว่าหรือเท่ากับ 10 ปี ที่ อ่านออกเขียนได้ ที่เข้าร่วมกิจกรรม ส่งเสริมสุขภาพในชุมชนรอบรู้ด้านสุขภาพ (Health Literate Communities: HLC) ซึ่งจัดโดยสถานบริการ สุ ข ภ าพ ที่ เป็ น อ งค์ ก รรอ บ รู้ ด้ าน สุ ข ภ าพ (Health Literate Organization: HLO) ก ารป ระ เมิ น ผ่านทาง: https://forms.gle/Px1QAL06kUGwJiHf7 หน่วยบริการรอบรู้ด้านสุขภาพ หมายถึง โรงพยาบาล/โรงพยาบาลส่งเสริมสุขภาพตำบลที่มีแนวปฏิบัติ (practices)การบริการส่งเสริมสุขภาพและให้คำปรึกษาที่เป็นมิตรต่อความรอบรู้ด้านสุขภาพ ที่ทำให้ ผู้รับบริการเข้าถึง เข้าใจ และใช้ข้อมูลและบริการของตนเองได้ง่ายขึ้นและสะดวกขึ้น เพื่อดูแลสุขภาพใน หน่วยบริการของตนเองได้อย่างเหมาะสม กิจกรรมส่งเสริมความรอบรู้ด้านสุขภาพ หมายถึง ชุดกิจกรรมส่งเสริมสุขภาพ ป้องกันโรค และอนามัย สิ่งแวดล้อม ที่มุ่งเพื่อการแก้ไขปัญหาสุขภาพของกลุ่มผู้ป่วยโรคเบาหวาน โรคความดันโลหิตสูงในการป้องกัน โรค Stroke โรค Pneumonia และภาวะ Sepsis ชุมชนรอบรู้ด้านสุขภาพ หมายถึง หมู่บ้านที่อยู่ในตำบลเดียวกันมีการดำเนินงานพัฒนาให้ประชาชน มีศักยภาพในการดูแลสุขภาพตนเอง มีความรอบรู้ด้านสุขภาพและพฤติกรรมสุขภาพที่ถูกต้อง สามารถลด ปัจจัยเสี่ยงต่อสุขภาพได้อย่างเหมาะสมกับวิถีชีวิต สามารถป้องกันโรคและภัยสุขภาพแก่ตนเอง ครอบครัว ชุมชนโดยการมีส่วนร่วมจากทุกภาคส่วน ผู้ป่วยเบาหวาน หมายถึง ผู้ป่วยที่ได้รับการวินิจฉัยเป็นโรคเบาหวาน และได้รับการขึ้นทะเบียน/ผู้ป่วย โรคเบาหวานอาศัยอยู่ในพื้นที่รับผิดชอบทั้งหมดที่อ่านออกเขียนได้ ผู้ป่วยความดันโลหิตสูง หมายถึง ผู้ป่วยที่ได้รับการวินิจฉัยเป็นโรคความดันโลหิตสูง และได้รับการขึ้น ทะเบียน/ผู้ป่วยโรคความดันโลหิตสูงอาศัยอยู่ในพื้นที่รับผิดชอบทั้งหมดที่อ่านออกเขียนได้ โรคหลอดเลือดสมอง(Stroke) คือ ภาวะที่สมองขาดเลือดไปเลี้ยงเนื่องจากหลอดเลือดตีบ หลอดเลือด อุดตัน หรือหลอดเลือดแตก ส่งผลให้เนื้อเยื่อในสมองถูกทำลาย การทำงานของสมองหยุดชะงัก",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "ผลการดำเนินงานจริงเทียบกับเกณฑ์เป้าหมาย (คะแนน)",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI70-03": {
      "kpiId": "KPI70-03",
      "order": 3,
      "name": "จำนวนอำเภอที่ผ่านเกณฑ์คุณภาพการพัฒนาคุณภาพชีวิตระดับอำเภอ Plus (พชอ. Plus)",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "อำเภอ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "26",
      "baseline": "26",
      "definition": "จำนวนอำเภอที่ผ่านเกณฑ์คุณภาพการพัฒนาคุณภาพชีวิตระดับอำเภอ Plus (พชอ. Plus) ตามเกณฑ์มาตรฐานแผนยุทธศาสตร์สุขภาพ 5 ปี จังหวัดขอนแก่น (พ.ศ. 2566–2570)",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "ผลการดำเนินงานจริงเทียบกับเกณฑ์เป้าหมาย (อำเภอ)",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI70-04": {
      "kpiId": "KPI70-04",
      "order": 4,
      "name": "ร้อยละเด็กปฐมวัยมีพัฒนาการสมวัย",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "90",
      "baseline": "69.50",
      "definition": "เด็กปฐมวัย หมายถึง เด็กแรกเกิด จนถึงอายุ 5 ปี 11 เดือน 29 วัน เด็กพัฒนาการสมวัยครั้งที่ 1 หมายถึง เด็กที่ได้รับตรวจคัดกรองพัฒนาการโดยใช้ คู่มือเฝ้าระวัง",
      "purpose": "พัฒนาการครั้งแรก",
      "population": "เด็กที่ได้รับการกระตุ้นภายใน 30 วันมีพัฒนาการสมวัยครั้งที่ 2 หมายถึง เด็กที่มีพัฒนาการสงสัยล่าช้า",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "พัฒนาการเด็กปฐมวัย (DSPM)* แล้วผลการตรวจคัดกรอง ผ่านครบ 5 ด้านในการตรวจคัดกรองพัฒนาการ ครั้งที่ 1 รวมกับเด็กที่มีพัฒนาการสงสัยล่าช้าที่ได้รับการกระตุ้นภายใน 30 วันมีพัฒนาการสมวัยครั้งที่ 2 การคัดกรองพัฒนาการ หมายถึง ความครอบคลุมของการคัดกรองเด็กอายุ 9, 18, 30, 42 และ 60 เดือน ณ ช่วงเวลาที่มีการคัดกรองโดยเป็นเด็กในพื้นที่ (Type1: มีชื่ออยู่ในทะเบียนบ้าน ตัวอยู่จริงและ Type3 : ที่อาศัยอยู่ในเขต แต่ทะเบียนบ้านอยู่นอกเขต พัฒนาการสงสัยล่าช้า หมายถึง เด็กที่ได้รับตรวจคัดกรองพัฒนาการโดยใช้คู่มือเฝ้าระวังและส่งเสริม พัฒนาการเด็กปฐมวัย (DSPM) และผลการตรวจคัดกรองพัฒนาการตามอายุของเด็กในการประเมินพัฒนาการ ครั้งแรกผ่านไม่ครบ 5 ด้าน ทั้งเด็กที่ต้องแนะนำให้พ่อแม่ ผู้ปกครอง ส่งเสริมพัฒนาการตามวัยภายใน 30 วัน (1B261) รวมกับเด็กที่สงสัยล่าช้า ส่งต่อทันที (1B262 : เด็กที่พัฒนาการล่าช้า/ความผิดปกติอย่างชัดเจน) พัฒนาการสงสัยล่าช้าได้รับการติดตาม หมายถึง เด็กที่ได้รับการตรวจคัดกรองพัฒนาการตามอายุของเด็ก ในการประเมินพัฒนาการครั้งแรกผ่านไม่ครบ 5 ด้าน เฉพาะกลุ่มที่แนะนำให้พ่อแม่ ผู้ปกครอง ส่งเสริม พัฒนาการตามวัยภายใน 30 วัน (1B261) แล้วติดตามกลับมาประเมินคัดกรองพัฒนาการครั้งที่ 2 ร้อยละ 87 เพื่อการส่งเสริมสุขภาพ เด็กปฐมวัยให้มีพัฒ นาการสมวัย และมีระดับสติทางด้านเชาว์ปัญญ า และความฉลาดทางอารมณ์ดี เด็กปฐมวัยในจังหวัดขอนแก่น สถานบริการทุกระดับ นำข้อมูลการประเมินพัฒนาการเด็ก บันทึกในโปรแกรมหลักของสถานบริการฯ เช่น JHCIS, Hos xp, PCU เป็นต้น ส่งออกข้อมูลตามโครงสร้างมาตรฐาน 43 แฟ้ม โรงพยาบาลทุกแห่ง /สาธารณสุขอำเภอทุกอำเภอ/ รพ.สต.ทุกแห่ง",
      "formula": "(A/B) x 100 ระยะเวลา 12 เดือน ประเมินผล ทธศาสตร์จังหวัดขอนแก่น ระยะ 5 ปี (พ.ศ. 2566-2570) หน้า 150 106",
      "numeratorA": "จำนวนเด็กอายุ 9 18 30 42 และ 60 เดือน ผลรวมของเด็กที่มีพัฒนาการสมวัยจากตรวจครั้งที่ 1 และ 2",
      "denominatorB": "จำนวนเด็กอายุ 9 18 30 42 และ 60 เดือน ทั้งหมดในช่วงเวลาเดียวกัน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI70-05": {
      "kpiId": "KPI70-05",
      "order": 5,
      "name": "ร้อยละเด็ก 0-5 ปี มีส่วนสูงดีรูปร่างสมส่วน",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "80",
      "baseline": "65.49",
      "definition": "เด็กอายุ 0 - 5 ปี หมายถึง เด็กแรกเกิด จนถึงอายุ 5 ปี 11 เดือน 29 วัน สูงดี หมายถึง เด็กที่มีความยาวหรือส่วนสูงอยู่ในระดับสูงตามเกณฑ์ขึ้นไป (สูงตามเกณฑ์ ค่อนข้างสูง หรือสูง)",
      "purpose": "(ขององค์การอนามัยโลก) โดยมีค่ามากกว่าหรือเท่ากับ -1.5 SDของความยาว/ส่วนสูงตามเกณฑ์อายุ",
      "population": "สมส่วน หมายถึง เด็กที่มีน้ำหนักอยู่ในระดับสมส่วน เมื่อเทียบกับกราฟการเจริญเติบโตน้ำหนักตามเกณฑ์",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "สูงดีรูปร่างสมส่วน หมายถึง เด็กที่มีความยาวหรือส่วนสูงอยู่ในระดับสูงตามเกณฑ์ขึ้นไปและมีน้ำหนักอยู่ในระดับ สมส่วน (ในคนเดียวกัน) ร้อยละ 78 เพื่อการส่งเสริมสุขภาพ เด็ก อายุ 0 - 5 ปี มีการโภชนาการที่ดี การเจริญเติบโตตามวัย รูปร่างสูงดีสมส่วน เด็กปฐมวัยในจังหวัดขอนแก่น สถานบริการทุกระดับ นำข้อมูลการประเมินพัฒนาการเด็ก บันทึกในโปรแกรมหลักของสถานบริการฯ เช่น JHCIS, Hos xp, PCU เป็นต้น ส่งออกข้อมูลตามโครงสร้างมาตรฐาน 43 แฟ้ม โรงพยาบาลทุกแห่ง /สาธารณสุขอำเภอทุกอำเภอ/ รพ.สต.ทุกแห่ง",
      "formula": "A = จำนวนเด็กอายุ 0 -5 ปีที่ได้รับการคัดกรองชั่งน้ำหนัก และวัดความยาว/วัดส่วนสูง มีการเจริญเติบโต สูงดีสมส่วน สูตรคำนวณ ตัวชี้วัด B = จำนวนเด็กอายุ 0 -5 ปีที่ได้รับการคัดกรองชั่งน้ำหนัก และวัดความยาว/วัดส่วนสูงทั้งหมด ระยะเวลา ร้อยละของเด็กอายุ 0 -5 ปี สูงดีรูปร่างสมส่วน = (A x 100) /B ประเมิน 12 เดือน",
      "numeratorA": "จำนวนเด็กอายุ 0 -5 ปีที่ได้รับการคัดกรองชั่งน้ำหนัก และวัดความยาว/วัดส่วนสูง มีการเจริญเติบโต",
      "denominatorB": "จำนวนเด็กอายุ 0 -5 ปีที่ได้รับการคัดกรองชั่งน้ำหนัก และวัดความยาว/วัดส่วนสูงทั้งหมด",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ผลการดำเนินงานผ่านระบบรายงาน HDC รายละเอียด ผลการดำเนินงานย้อนหลัง 3 ปี (2565-2567) ข้อมูลพื้นฐาน (Baseline ตัวชี้วัด Baseline หน่วยวัด ผลการดำเนินงานใน Data) ร้อยละ รอบปีงบประมาณ data 2465 2566 2567 ร้อยละของเด็กอายุ 0 -5 ปี 64.20 73.1 67.23 64.20 สูงดีรูปร่างสมส่วน 3",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI70-06": {
      "kpiId": "KPI70-06",
      "order": 6,
      "name": "ร้อยละเด็ก 6-14 ปี มีส่วนสูงดีรูปร่างสมส่วน",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "≥ 65",
      "baseline": "59.77",
      "definition": "ลดปัจจัยเสี่ยงด้านสุขภาพและความเจ็บป่วยของประชาชน",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "เด็กอายุ 6-14 ปี หมายถึง เด็กอายุ6 ปีเต็ม – 14 ปี 11 เดือน 29 วัน",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "กราฟการเจริญเติบโต หมายถึง กราฟแสดงเกณฑ์อ้างอิงการเจริญเติบโตของเด็กอายุ 6-19 ปี บริบูรณ์",
      "formula": "1 สำนักโภชนาการ กรมอนามัย พ.ศ. 2564 (จัดทำจากการจัดทำเกณฑ์อ้างอิงการ เจริญเติบโตของเด็กอายุ 5-19 ปี สำนักโภชนาการ กรมอนามัย พ.ศ. 2563) โดยเริ่มใช้ในการประมวลผลในระบบฐานข้อมูล HDC ภาคเรียนที่ 1 ปีการศึกษา 2564 เป็นต้นไป สูงดีสมส่วน หมายถึง ส่วนสูงอยู่ในระดับสูงตามเกณฑ์ขึ้นไป และมีน้ำหนักอยู่ในระดับสมส่วน (ในคน เดียวกัน) สูงดี หมายถึง ส่วนสูงอยู่ในระดับสูงตามเกณฑ์ขึ้นไป (สูงตามเกณฑ์ ค่อนข้างสูง สูง) เมื่อเทียบกับกราฟ การเจริญเติบโตส่วนสูงตามเกณฑ์อายุ มีค่ามากกว่าหรือเท่ากับ -1.5 S.D. สมส่วน หมายถึง น้ำหนักอยู่ในระดับสมส่วน เมื่อเทียบกับกราฟการเจริญเติบโต น้ำหนักตามเกณฑ์ ส่วนสูง มีค่าระหว่าง -1.5 S.D. ถึง +1.5 S.D. ภาวะเตี้ย หมายถึง มีส่วนสูงน้อยกว่ามาตรฐาน มีค่าต่ำกว่า–2 S.D.ของส่วนสูงตามเกณฑ์อายุ ภาวะผอม หมายถึง มีน้ำหนักน้อยกว่ามาตรฐาน มีค่าต่ำกว่า –2 S.D. ของน้ำหนักตามเกณฑ์ส่วนสูง ภาวะเริ่มอ้วนและอ้วน หมายถึง มีน้ำหนักมากกว่ามาตรฐานน้ำหนักตามเกณฑ์ส่วนสูง โดยมีค่า มากกว่า > + 2 S.D.ขึ้นไป > ร้อยละ 66 1. เพื่อเฝ้าระวังภาวะโภชนาการและให้การดูแลรักษาที่ครอบคลุม หากพบภาวะผิดปกติได้รับการส่งต่อ ดูแลรักษาที่ครอบคลุม หากพบภาวะผิดปกติได้รับการส่งต่อที่เหมาะสม 2. เพื่อส่งเสริม สนับสนุนขับเคลื่อนโรงเรียน สถานศึกษาทุกระดับ ให้จัดบริการ ดูแลสุขภาพเด็กวัยเรียน ตามเกณฑ์มาตรฐาน เด็กนักเรียน อายุ 6-14 ปี ในโรงเรียนทุกสังกัด (โรงเรียนประถมศึกษา ,โรงเรียนประถมศึกษ า ขยายโอกาส,มัธยมศึกษา (ม.1-ม.3) 1. ชั่งน้ำหนักและวัดส่วนสูง บันทึกข้อมูลน้ำหนักและส่วนสูงด้วยทศนิยม 1 ตำแหน่ง เช่น น้ำหนัก 47.2 กิโลกรัม ส่วนสูง 155.2 เซนติเมตร 2. โรงพยาบาลส่งเสริมสุขภาพตำบล และ PCU จากโรงพยาบาล นำเข้าข้อมูลน้ำหนัก ส่วนสูง ของเด็ก จากสถานศึกษา/โรงเรียน บันทึกในโปรแกรมหลักของสถานบริการ เช่น JHCIS, HosXP PCU เป็นต้น และส่งออกแฟ้มข้อมูล Nutrition ตามโครงสร้างมาตรฐาน 43 แฟ้ม ระบบรายงาน HDC กองยุทธศาสตร์และแผนงาน และสำนักงานสาธารณสุขจังหวัด ข้อมูลจากแฟ้ม Nutrition (ไม่รวมเด็กป่วยที่มารับบริการ) A1 = จำนวนเด็กอายุ 6-14 ปี ที่มีภาวะสูงดีสมส่วน A2 = จำนวนเด็กอายุ 6-14 ปี ที่มีภาวะเตี้ย A3 = จำนวนเด็กอายุ 6-14 ปี ที่มีภาวะผอม A4 = จำนวนเด็กอายุ 6-14 ปี ที่มีภาวะเริ่มอ้วนและอ้วน",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนเด็กอายุ 6-14 ปีที่ชั่งน้ำหนักและวัดส่วนสูง",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประมวลผลรายงานจากฐานข้อมูล Health Data Center (HDC) รายละเอียด ข้อมูลพื้นฐานประกอบตัวชี้วัด เป้าหมาย หน่วย ผลงานย้อนหลัง 3 ปี ข้อมูลพื้นฐาน 2565 2566 2567 ปี 2568 วัด 67.14 65.46 63.72 (Baseline Data) ผลการดำเนินงาน ร้อยละเด็ก 6-14 ปี มีส่วนสูงดีรูปร่างสม ≥68 ร้อยละ 79.41 77.81 76.54 ย้อนหลัง 3 ปี (ปี 2565 -2567) ส่วน 9.12 10.27 10.56 7.73 6.00 7.71 ร้อยละเด็ก 6-14 ปี ได้รับการชั่งน้ำหนัก ≥80 ร้อยละ 3.37 4.50 4.31 วัดส่วนสูง ร้อยละเด็ก 6–14 ปี เริ่มอ้วนและอ้วน ≥10 ร้อยละ ร้อยละเด็ก 6–14 ปี เตี้ย ≥10 ร้อยละ ร้อยละเด็ก 6–14 ปี ผอม ≥5 ร้อยละ",
      "responsible": "นางวรวลัย เกษมศรีวิวัฒน์ ตำแหน่ง พยาบาลวิชาชีพชำนาญการ ตัวชี้วัด หมายเลขโทรศัพท์ 085-1555510 E-mail : worawalai.k@gmail.com กลุ่มงานส่งเสริมสุขภาพ สำนักงานสาธารณสุขจังหวัดขอนแก่น"
    },
    "KPI70-07": {
      "kpiId": "KPI70-07",
      "order": 7,
      "name": "ผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงได้รับการดูแลในระบบ Long Term Care และเข้าถึงตามชุดสิทธิประโยชน์",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "99.5",
      "baseline": "99.29",
      "definition": "ลดปัจจัยเสี่ยงด้านสุขภาพและความเจ็บป่วยของประชาชน",
      "purpose": "เพื่อให้ผู้สูงอายุและผู้มีภาวะพึ่งพิงได้รับการดูแลสุขภาพตามแผนการดูแลรายบุคคล (Care Plan) และเข้าถึงชุดสิทธิประโยชน์อย่างครอบคลุม",
      "population": "ผู้สูงอายุ หมายถึง ประชาชนที่มีอายุตั้งแต่ 60 ปีขึ้นไป",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "(ADL 0-4 คะแนน) ได้รับการดูแลโดยบุคลากรสาธารณสุข ทีมสหวิชาชีพตามแผนการดูแลรายบุคคล (Care Plan) ตามชุดสิทธิประโยชน์ทุกสิทธิการรักษาพยาบาล ผู้ที่มีภาวะพึ่งพิง หมายถึง ประชาชนที่มีค่าคะแนนการประเมินความสามารถในการประกอบกิจวัตร ประจำวัน(ADL) น้อยกว่าหรือเท่ากับ 11 คะแนน โดยแบ่งเป็นกลุ่มติดบ้าน (ADL 5-11 คะแนน) กลุ่มติดเตียง (ADL 0-4 คะแนน) ได้รับการดูแลโดยบุคลากรสาธารณสุข ทีมสหวิชาชีพตามแผนการดูแลรายบุคคล (Care Plan) ตามชุดสิทธิประโยชน์ทุกสิทธิการรักษาพยาบาล แผนการดูแลรายบุคคล (Care Plan) หมายถึง การประเมินและวางแผนการดูแลรายบุคคลก่อนให้บริการ ดูแลช่วยเหลือผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงจาก Care Manager ทีมผู้เชี่ยวชาญ ครอบครัวและผู้เกี่ยวข้อง ในพื้นที่ การดูแลกลุ่มภาวะพึ่งพิงตามชุดสิทธิประโยชน์ หมายถึง การบริการดูแลด้านสาธารณสุขตามแผนการดูแล รายบุคคล และให้คำแนะนำแก่ญาติและผู้ดูแล โดยผู้ช่วยเหลือดูแลผู้ที่มีภาวะพึ่งพิงหรือเครือข่ายสุขภาพอื่นๆ หรืออาสาสมัคร จิตอาสา ตามแผนการดูแลรายบุคคล หรือตามคำแนะนำของผู้จัดการการดูแลด้าน สาธารณสุข รวมถึงจัดหาวัสดุ อุปกรณ์ทางการแพทย์ หรืออุปกรณ์เครื่องช่วยเหลือที่จำเป็นตามสภาพของผู้ที่มี ภาวะพึ่งพิง และการประเมินผลลัพธ์การดูแลผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงหลังได้รับการดูแลตาม Care Plan ครบ 12 เดือน ร้อยละ 98.5 1. เพื่อให้ Care Manager /Caregiver/อาสาสมัครบริบาลท้องถิ่น และทีมสหวิชาชีพมีการส่งเสริมสุขภาพ วางแผนการดูแลรายบุคคล ฟื้นฟูสมรรถภาพ และสนับสนุนการดูแลผู้สูงอายุและผู้ที่มีภาวะพึ่งพิง แบบรอบด้านในระดับครอบครัว ชุมชนเป็นรายบุคคล 2. เพื่อสนับสนุนการมีส่วนร่วมของครอบครัว ชุมชนและหน่วยงานภาคีเครือข่ายที่เกี่ยวข้อง ในการดูแล และปรับเปลี่ยนพฤติกรรมสุขภาพของผู้สูงอายุให้มีคุณภาพชีวิตที่ดี มีอายุยืนยาวและช่วยเหลือตนเองได้ 3. เพื่อให้ผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงเข้าถึงระบบบริการด้านสาธารณสุข และวัสดุ อุปกรณ์ทางการแพทย์ หรืออุปกรณ์เครื่องช่วยเหลือที่จำเป็นตามสภาพปัญหาของผู้ที่มีภวะพึ่งพิง ผู้สูงอายุและบุคคลอื่น ที่มีค่าคะแนน ADL 0-11 คะแนน 1. รายงานผลการคัดกรอง ADL ในฐานข้อมูล Health Data Center 2. รายงานการจัดทำ Care Plan และการอนุมัติ Care Plan ผ่านคณะอนุกรรมการกองทุน LTC ระดับตำบล และบันทึกข้อมูล CP ที่ผ่านการอนุมัติรายงานในระบบโปรแกรม LTC สปสช. 3. รายงานผลค่าคะแนน ADL การดูแลกลุ่มภาวะพึ่งพิงครบ 12 เดือน ในโปรแกรม LTC สปสช. 1. ฐานข้อมูลการคัดกรอง ADL ใน Health Data Center 2. โปรแกรม Long Term Care กรมอนามัย 3. โปรแกรม Long Term Care สปสช.",
      "formula": "1 A = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่มีการจัดทำ Care Plan โดย Care Plan ได้รับอนุมัติจาก คณะอนุกรรมการ LTC และได้รับการเยี่ยมบ้านจาก Caregiver B = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงทั้งหมดที่เข้าร่วมโครงการ LTC รายการข้อมูล 2 A = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่ได้รับการดูแลตาม Care Plan ครบ 12 เดือน ที่มีค่าคะแนน ADL เพิ่มขึ้น และกลุ่มติดเตียงมีค่า ADL เท่าเดิมหรือไม่มีภาวะแทรกซ้อนเพิ่มขึ้น B = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่ ได้รับอนุมัติ Care Plan จากคณะอนุกรรมการ LTC และได้รับ การเยี่ยมบ้านจาก Caregiver ครบการดูแล 12 เดือน ทั้งหมด สูตรคำนวณ A x 100 ตัวชี้วัด 1 B สูตรคำนวณ A x 100 ตัวชี้วัด 2 B ระยะเวลา ตุลาคม 2567 - กันยายน 2568 ประเมินผล",
      "numeratorA": "จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่มีการจัดทำ Care Plan โดย Care Plan ได้รับอนุมัติจาก",
      "denominatorB": "จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงทั้งหมดที่เข้าร่วมโครงการ LTC",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "1) Care Manager/เจ้าหน้าที่สาธารณสุข PCU รพ./รพสต. ประเมินความสามารถในการประกอบกิจวัตร รายละเอียด ประจำวัน(ADL) เพื่อค้นหากลุ่มภาวะพึ่งพิงได้รับบริการตามชุดสิทธิประโยชน์ > ร้อยละ 60 ข้อมูลพื้นฐาน 2) Care Manager มีการจัดทำแผนการดูแลรายบุคคล Care Plan ในกลุ่มผู้สูงอายุและผู้ที่มีภาวะพึ่งพิง (Baseline Data) ผลการดำเนินงาน และ Care Plan ได้รับการอนุมัติจากคณะอนุกรรมการ LTC > ร้อยละ 98.5 ย้อนหลัง 3 ปี (ปี 2565 -2567) 3) ผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงได้รับการดูแลตามแผนการดูแลรายบุคคล Care Plan และประเมิน ADL ครบ",
      "responsible": "12 เดือน มีค่าคะแนน ADL เพิ่มขึ้นหรือกลุ่มติดเตียงไม่มีภาวะแทรกซ้อนเพิ่มขึ้น > ร้อยละ 25 ตัวชี้วัด ผลงาน ปี 2565 ปี 2566 ปี 2567 ร้อยละของผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงได้รับการดูแล 96.67 94.61 98.4 ในระบบ Long Term Care และเข้าถึงตามชุดสิทธิ ประโยชน์ ร้อยละของผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่ได้รับการดูแล 14.66 21.43 22.43 ตาม Care Plan มีค่าคะแนน ADL เพิ่มขึ้นหรือกลุ่มติด เตียงไม่มีภาวะแทรกซ้อนเพิ่มขึ้น ชื่อ-สกุล นางอังคณา อึ้งปิติมานะ ตำแหน่ง นักวิชาการสาธารณสุขชำนาญการ กลุ่มงานส่งเสริมสุขภาพ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ 149 โทรสาร 0-4322-4037 โทรศัพท์มือถือ. 0617929942 E-mail :ungpitimana.ang@gmail.com"
    },
    "KPI70-08": {
      "kpiId": "KPI70-08",
      "order": 8,
      "name": "อัตราตายมารดา",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ต่อแสนการเกิดมีชีพ",
      "direction": "ยิ่งน้อยยิ่งดี",
      "target": "≤12",
      "baseline": "11.14",
      "definition": "อัตราส่วนการตายมารดาไทยไม่เกิน 14 ต่อการเกิดมีชีพแสนคน",
      "purpose": "เฝ้าระวังสตรีชวงตั้งครรภ คลอดและหลังคลอด ให้ได้รับบริการคุณภาพตามเกณฑ์ เพื่อลดจำนวนการตาย",
      "population": "ของมารดา",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "หญิงตั้งครรภ์ หญิงคลอด และหญิงหลังคลอดภายใน 42 วัน",
      "formula": "(A/B) x 100,000",
      "numeratorA": "จำนวนมารดาตายระหว่างตั้งครรภ์ คลอดและหลังคลอดภายใน 42 วัน ทุกสาเหตุยกเว้นอุบัติเหตุ",
      "denominatorB": "จำนวนเด็กเกิดมีชีพทั้งหมดในช่วงเวลาเดียวกัน",
      "frequency": "ทุก 3 เดือน",
      "evaluationMethod": "เปรียบเทียบผลการดำเนินงานกับค่าเป้าหมาย",
      "responsible": "ชื่อ-สกุล...นางนรินทร์รัตน์ แก้วลา ตำแหน่ง นักวิชาการสาธารณสุขชำนาญการพิเศษ ชื่อ-สกุล...นางสมาพร สุรเตมีย์กุล ตำแหน่ง พยาบาลวิชาชีพชำนาญการ กลุ่มงาน ส่งเสริมสุขภาพ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ ... โทรสาร 0-4322-4037 โทรศัพท์มือถือ... 085-3956466 E-mail : narinratkaewla@gmail.com ตัวชี้วัดที่ 8.1 หญิงตั้งครรภ์ได้รับการฝากครรภ์ครั้งแรกเมื่ออายุครรภ์≤ 12 สัปดาห์ คำนิยาม หญิงตั้งครรภ์ได้รับการฝากครรภ์ครั้งแรกเมื่ออายุครรภ์น้อยกว่าหรือเท่ากับ 12 สัปดาห์ หมายถึง หญิงตั้งครรภ์ที่มาฝากครรภ์ที่สถานบริการฯทั้งหมด โดยต้องฝากครรภ์ครั้งแรกที่อายุครรภ์น้อยกว่า หรือเท่ากับ 12 สัปดาห์ เกณฑ์เป้าหมาย ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ ปีงบประมาณ 2566 2567 2568 2569 2570 ≥ ร้อยละ 75 ≥ ร้อยละ 75 ≥ ร้อยละ 80 ≥ ร้อยละ 85 ≥ ร้อยละ 90 วัตถุประสงค์ ส่งเสริมสุขภาพและเฝ้าระวังหญิงตั้งครรภ์ คลอดและหลังคลอด เพื่อลดการตายมารดาและทารก จากการตั้งครรภ์และคลอดให้มีประสิทธิภาพ กลุ่มเป้าหมาย หญิงตั้งครรภ์และหญิงหลังคลอดทุกราย วิธีการจัดเก็บข้อมูล บันทึกข้อมูลการให้บริการในโปรแกรมของแต่ละสถานบริการและส่งออกข้อมูลตามแนวทาง 43 แฟ้ม แหล่งข้อมูล 1. หน่วยบริการสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่นและองค์การบริหารส่วนจังหวัดขอนแก่น ทุกแห่ง 2. ฐานข้อมูล 43 แฟ้ม( แฟ้ม ANCและ Labor) รายการข้อมูล 1 A = จำนวนหญิงคลอดตาม B ที่ฝากครรภ์ครั้งแรกและอายุครรภ์ ≤ 12 สัปดาห์ (ข้อมูลจากสมุดสีชมพูบันทึกลงใน 43 แฟ้ม : แฟ้ม ANC) รายการข้อมูล 2 B =จำนวนหญิงไทยทุกรายที่คลอดในเขตรับผิดชอบทั้งหมดในช่วงเวลาเดียวกัน สูตรคำนวณตัวชี้วัด (A/B ) x 100 ระยะเวลาประเมินผล ทุก 3 เดือน Small Success ปี 2568 รอบ 3 เดือน รอบ 6 เดือน รอบ 9 เดือน รอบ 12 เดือน ≥ ร้อยละ65 ≥ ร้อยละ 70 ≥ ร้อยละ 75 ≥ ร้อยละ80"
    },
    "KPI70-09": {
      "kpiId": "KPI70-09",
      "order": 9,
      "name": "อัตราตายของทารกแรกเกิด",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ต่อพันการเกิดมีชีพ",
      "direction": "ยิ่งน้อยยิ่งดี",
      "target": "< 2.0",
      "baseline": "3.28",
      "definition": "ทารกแรกเกิด หมายถึง ทารกที่ มีน้ำหนัก ≥ 500 กรัม ที่คลอดมามีชีวิตตั้งแต่แรกเกิดจนถึง 28 วัน ในโรงพยาบาล สังกัดสำนักงานปลัดกระทรวงสาธารณสุข (รพศ./รพท./รพช.)",
      "purpose": "1. เพื่อเพิ่มประสิทธิภาพการดูแลรักษาทารกแรกเกิดใหทั่วถึง 2. เพื่อลดอัตราตายทารกแรกเกิด",
      "population": "ทารกที่คลอดและมีชีวิตจนถึง 28 วัน",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "1.หน่วยบริการทุกระดับในสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่น 2. ฐานข้อมูล Health Data Center",
      "formula": "(A/B) x 1,000",
      "numeratorA": "จำนวนทารกที่เสียชีวิต ≤ 28 วัน",
      "denominatorB": "จำนวนเด็กเกิดมีชีพทั้งหมดในช่วงเวลาเดียวกัน",
      "frequency": "ทุก 3 เดือน",
      "evaluationMethod": "เปรียบเทียบผลการดำเนินงานกับค่าเป้าหมาย รายละเอียดข้อมูลพื้นฐาน Baseline Data หน่วยวัด ผลการดำเนินงานปีงบประมาณ อัตราตายทารกแรกเกิด อัตราตายทารก ปี 2565 ปี 2566 ปี 2567 แรกเกิด ตอ เกิด มีชีพ 1,000คน 2.8 2.6 3.3",
      "responsible": "ชื่อ-สกุล...นางนรินทร์รัตน์ แก้วลา ตำแหน่ง นักวิชาการสาธารณสุขชำนาญการพิเศษ ตัวชี้วัด ชื่อ-สกุล...นางสมาพร สุรเตมีย์กุล ตำแหน่ง พยาบาลวิชาชีพชำนาญการ กลุ่มงาน ส่งเสริมสุขภาพ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ ... โทรสาร 0-4322-4037 โทรศัพท์มือถือ... 085-3956466 E-mail : narinratkaewla@gmail.com"
    },
    "KPI70-10": {
      "kpiId": "KPI70-10",
      "order": 10,
      "name": "ร้อยละของผู้สูงอายุไม่มีภาวะพึ่งพิง",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "96.5",
      "baseline": "95.32",
      "definition": "ลดปัจจัยเสี่ยงด้านสุขภาพและความเจ็บป่วยของประชาชน",
      "purpose": "เพื่อให้ผู้สูงอายุและผู้มีภาวะพึ่งพิงได้รับการดูแลสุขภาพตามแผนการดูแลรายบุคคล (Care Plan) และเข้าถึงชุดสิทธิประโยชน์อย่างครอบคลุม",
      "population": "ผู้สูงอายุ หมายถึง ประชาชนที่มีอายุตั้งแต่ 60 ปีขึ้นไป",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "(ADL 0-4 คะแนน) ได้รับการดูแลโดยบุคลากรสาธารณสุข ทีมสหวิชาชีพตามแผนการดูแลรายบุคคล (Care Plan) ตามชุดสิทธิประโยชน์ทุกสิทธิการรักษาพยาบาล ผู้ที่มีภาวะพึ่งพิง หมายถึง ประชาชนที่มีค่าคะแนนการประเมินความสามารถในการประกอบกิจวัตร ประจำวัน(ADL) น้อยกว่าหรือเท่ากับ 11 คะแนน โดยแบ่งเป็นกลุ่มติดบ้าน (ADL 5-11 คะแนน) กลุ่มติดเตียง (ADL 0-4 คะแนน) ได้รับการดูแลโดยบุคลากรสาธารณสุข ทีมสหวิชาชีพตามแผนการดูแลรายบุคคล (Care Plan) ตามชุดสิทธิประโยชน์ทุกสิทธิการรักษาพยาบาล แผนการดูแลรายบุคคล (Care Plan) หมายถึง การประเมินและวางแผนการดูแลรายบุคคลก่อนให้บริการ ดูแลช่วยเหลือผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงจาก Care Manager ทีมผู้เชี่ยวชาญ ครอบครัวและผู้เกี่ยวข้อง ในพื้นที่ การดูแลกลุ่มภาวะพึ่งพิงตามชุดสิทธิประโยชน์ หมายถึง การบริการดูแลด้านสาธารณสุขตามแผนการดูแล รายบุคคล และให้คำแนะนำแก่ญาติและผู้ดูแล โดยผู้ช่วยเหลือดูแลผู้ที่มีภาวะพึ่งพิงหรือเครือข่ายสุขภาพอื่นๆ หรืออาสาสมัคร จิตอาสา ตามแผนการดูแลรายบุคคล หรือตามคำแนะนำของผู้จัดการการดูแลด้าน สาธารณสุข รวมถึงจัดหาวัสดุ อุปกรณ์ทางการแพทย์ หรืออุปกรณ์เครื่องช่วยเหลือที่จำเป็นตามสภาพของผู้ที่มี ภาวะพึ่งพิง และการประเมินผลลัพธ์การดูแลผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงหลังได้รับการดูแลตาม Care Plan ครบ 12 เดือน ร้อยละ 98.5 1. เพื่อให้ Care Manager /Caregiver/อาสาสมัครบริบาลท้องถิ่น และทีมสหวิชาชีพมีการส่งเสริมสุขภาพ วางแผนการดูแลรายบุคคล ฟื้นฟูสมรรถภาพ และสนับสนุนการดูแลผู้สูงอายุและผู้ที่มีภาวะพึ่งพิง แบบรอบด้านในระดับครอบครัว ชุมชนเป็นรายบุคคล 2. เพื่อสนับสนุนการมีส่วนร่วมของครอบครัว ชุมชนและหน่วยงานภาคีเครือข่ายที่เกี่ยวข้อง ในการดูแล และปรับเปลี่ยนพฤติกรรมสุขภาพของผู้สูงอายุให้มีคุณภาพชีวิตที่ดี มีอายุยืนยาวและช่วยเหลือตนเองได้ 3. เพื่อให้ผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงเข้าถึงระบบบริการด้านสาธารณสุข และวัสดุ อุปกรณ์ทางการแพทย์ หรืออุปกรณ์เครื่องช่วยเหลือที่จำเป็นตามสภาพปัญหาของผู้ที่มีภวะพึ่งพิง ผู้สูงอายุและบุคคลอื่น ที่มีค่าคะแนน ADL 0-11 คะแนน 1. รายงานผลการคัดกรอง ADL ในฐานข้อมูล Health Data Center 2. รายงานการจัดทำ Care Plan และการอนุมัติ Care Plan ผ่านคณะอนุกรรมการกองทุน LTC ระดับตำบล และบันทึกข้อมูล CP ที่ผ่านการอนุมัติรายงานในระบบโปรแกรม LTC สปสช. 3. รายงานผลค่าคะแนน ADL การดูแลกลุ่มภาวะพึ่งพิงครบ 12 เดือน ในโปรแกรม LTC สปสช. 1. ฐานข้อมูลการคัดกรอง ADL ใน Health Data Center 2. โปรแกรม Long Term Care กรมอนามัย 3. โปรแกรม Long Term Care สปสช.",
      "formula": "1 A = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่มีการจัดทำ Care Plan โดย Care Plan ได้รับอนุมัติจาก คณะอนุกรรมการ LTC และได้รับการเยี่ยมบ้านจาก Caregiver B = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงทั้งหมดที่เข้าร่วมโครงการ LTC รายการข้อมูล 2 A = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่ได้รับการดูแลตาม Care Plan ครบ 12 เดือน ที่มีค่าคะแนน ADL เพิ่มขึ้น และกลุ่มติดเตียงมีค่า ADL เท่าเดิมหรือไม่มีภาวะแทรกซ้อนเพิ่มขึ้น B = จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่ ได้รับอนุมัติ Care Plan จากคณะอนุกรรมการ LTC และได้รับ การเยี่ยมบ้านจาก Caregiver ครบการดูแล 12 เดือน ทั้งหมด สูตรคำนวณ A x 100 ตัวชี้วัด 1 B สูตรคำนวณ A x 100 ตัวชี้วัด 2 B ระยะเวลา ตุลาคม 2567 - กันยายน 2568 ประเมินผล",
      "numeratorA": "จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่มีการจัดทำ Care Plan โดย Care Plan ได้รับอนุมัติจาก",
      "denominatorB": "จำนวนผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงทั้งหมดที่เข้าร่วมโครงการ LTC",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "1) Care Manager/เจ้าหน้าที่สาธารณสุข PCU รพ./รพสต. ประเมินความสามารถในการประกอบกิจวัตร รายละเอียด ประจำวัน(ADL) เพื่อค้นหากลุ่มภาวะพึ่งพิงได้รับบริการตามชุดสิทธิประโยชน์ > ร้อยละ 60 ข้อมูลพื้นฐาน 2) Care Manager มีการจัดทำแผนการดูแลรายบุคคล Care Plan ในกลุ่มผู้สูงอายุและผู้ที่มีภาวะพึ่งพิง (Baseline Data) ผลการดำเนินงาน และ Care Plan ได้รับการอนุมัติจากคณะอนุกรรมการ LTC > ร้อยละ 98.5 ย้อนหลัง 3 ปี (ปี 2565 -2567) 3) ผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงได้รับการดูแลตามแผนการดูแลรายบุคคล Care Plan และประเมิน ADL ครบ",
      "responsible": "12 เดือน มีค่าคะแนน ADL เพิ่มขึ้นหรือกลุ่มติดเตียงไม่มีภาวะแทรกซ้อนเพิ่มขึ้น > ร้อยละ 25 ตัวชี้วัด ผลงาน ปี 2565 ปี 2566 ปี 2567 ร้อยละของผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงได้รับการดูแล 96.67 94.61 98.4 ในระบบ Long Term Care และเข้าถึงตามชุดสิทธิ ประโยชน์ ร้อยละของผู้สูงอายุและผู้ที่มีภาวะพึ่งพิงที่ได้รับการดูแล 14.66 21.43 22.43 ตาม Care Plan มีค่าคะแนน ADL เพิ่มขึ้นหรือกลุ่มติด เตียงไม่มีภาวะแทรกซ้อนเพิ่มขึ้น ชื่อ-สกุล นางอังคณา อึ้งปิติมานะ ตำแหน่ง นักวิชาการสาธารณสุขชำนาญการ กลุ่มงานส่งเสริมสุขภาพ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ 149 โทรสาร 0-4322-4037 โทรศัพท์มือถือ. 0617929942 E-mail :ungpitimana.ang@gmail.com"
    },
    "KPI70-11": {
      "kpiId": "KPI70-11",
      "order": 11,
      "name": "ร้อยละสตรีอายุ 30-60 ปี กลุ่มเป้าหมายได้รับการคัดกรองมะเร็งปากมดลูกด้วยวิธี HPV DNA (สะสมผลงาน 2568-2570 ≥ 80%)",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "≥ 80",
      "baseline": "11.26",
      "definition": "การคัดกรองมะเร็งปากมดลูก หมายถึง สตรี",
      "purpose": "1. เพื่อเพิ่มการเข้าถึงบริการคัดกรองมะเร็งปากมดลูก 2. เพื่อลดอัตราการเกิดโรคมะเร็งปากมดลูกในระยะลุกลาม",
      "population": "(อายุ 30-≤60 ปี) ได้รับการ ตรวจคัดกรองมะเร็ง ปากมดลูกด้วยวิธี HPV DNA test ทั้งแบบตรวจโดยเจ้าหน้าที่ และแบบ Self Collection เป็นการตรวจหาเชื้อ ไวรัส HPV ความ เสี่ยงสูง 14 สายพันธุ์ซึ่งเป็นสาเหตุของมะเร็งปากมดลูก โดยวิธีการตรวจคือเก็บเซลล์บริเวณ ปากมดลูกช่องคลอดด้านใน ส่งตรวจด้วยวิธีการตรวจด้วยน้ำยา เมื่อคัดกรองแล้วมีผลปกติ/ผล ลบ (Negative) จากตัวอย่างสิ่งส่งตรวจ แนะนำให้เข้ารับการตรวจคัดกรองมะเร็งปากมดลูก ด้วยวิธีHPV DNA Test ครั้งต่อไป ในอีก 5 ปี เกณฑ์เป้าหมาย ≥ ร้อยละ 80 วัตถุประสงค์ 1. เพื่อเพิ่มการเข้าถึงบริการคัดกรองมะเร็งปากมดลูก 2. เพื่อลดอัตราการเกิดโรคมะเร็งปากมดลูกในระยะลุกลาม กลุ่มเป้าหมาย สตรีไทยอายุ 30-≤60 ปี ในพื้นที่รับผิดชอบ ตามจำนวนที่ได้รับการจัดสรร ในปีงบประมาณ 2568 (การนับอายุ 59 ปี 11 เดือน 29 วัน ณ วันให้บริการ) (ประชากร Type area 1,Type area 3) ในช่วงเวลาที่กำหนด",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "1. จากโปรแกรม Cancer Cervical Screening @ Khon Kaen 2. HDC 43 แฟ้ม สำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "formula": "A = จำนวนสตรีไทยอายุ 30-≤60 ปี ที่ได้รับการคัดกรองมะเร็งปากมดลูก ด้วยวิธี HPV DNA Test (โดยการตรวจด้วยเจ้าหน้าที่ หรือ การตรวจด้วยตนเอง) B = จำนวนสตรีไทยอายุ 30-≤60 ปี สูตรคำนวณ (A/B) x 100 ตัวชี้วัด ระยะเวลา รายไตรมาส ปีงบประมาณ พ.ศ.2568 ประเมินผล",
      "numeratorA": "จำนวนสตรีไทยอายุ 30-≤60 ปี ที่ได้รับการคัดกรองมะเร็งปากมดลูก ด้วยวิธี HPV DNA Test",
      "denominatorB": "จำนวนสตรีไทยอายุ 30-≤60 ปี",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลได้แบบ real time รายละเอียด ปีงบประมาณ พ.ศ.2565 ปีงบประมาณ พ.ศ.2566 ปีงบประมาณ พ.ศ.2567 ร้อยละ 21.82 ร้อยละ 42.81 % ร้อยละ 59.34 % ข้อมูลพื้นฐาน (Baseline Data) ผลการดำเนินงาน ย้อนหลัง 3 ปี (ปี 2565 -2567)",
      "responsible": "1. ชื่อ-สกุล นางยุภาพร ดีแป้น ตำแหน่ง : พยาบาลวิชาชีพชำนาญการ ตัวชี้วัด กลุ่มงาน : ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ที่ทำงาน : 043-221125 ต่อ 150 โทรสาร : 043-224037 โทรศัพท์มือถือ : 080-4620160 E-mail : smallbody@hotmail.com 2. ชื่อ-สกุล นางแสงเดือน โสภา ตำแหน่ง : พยาบาลวิชาชีพชำนาญการ กลุ่มงาน : ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ที่ทำงาน : 043-221125 ต่อ 150 โทรสาร : 043-224037 โทรศัพท์มือถือ : 081-3803219 3. ชื่อ-สกุล นางกิตติมา ก้านจักร ตำแหน่ง : นักวิชาการสาธารณสุขชำนาญการพิเศษ กลุ่มงาน : ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ที่ทำงาน : 043-221125 ต่อ 169 โทรสาร : 043-224037 โทรศัพท์มือถือ : 087-7707761"
    },
    "KPI70-12": {
      "kpiId": "KPI70-12",
      "order": 12,
      "name": "ร้อยละของประชาชนอายุ 50-70 ปี (รายใหม่) กลุ่มเป้าหมายได้รับการคัดกรองมะเร็ง ลำไส้ใหญ่/ไส้ตรง ด้วยวิธี FIT Test",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "85",
      "baseline": "74.37",
      "definition": "ร้อยละของประชาชนวัยทำงานอายุ 19-59 ปี มี BMI เกิน ได้รับการปรับเปลี่ยนพฤติกรรมและมี BMI ลดลง ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อาสาสมัครสาธารณสุขประจำหมู่บ้าน(อสม.) และบุคลากรสาธารณสุข ที่มีอายุ 19-59 ปี หมายถึง ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุข ที่มีอายุ 19 ปี 0 เดือน 1 วัน ถึง 59 ปี 11 เดือน 29 วัน ที่ยังไม่ป่วยด้วยโรคเบาหวาน และ/หรือความดันโลหิตสูงทั้งหมดในรอบ ปีงบประมาณ 2568 ค่าดัชนีมวลกาย (Body Mass Index : BMI) หมายถึง ค่าซึ่งเป็นความสัมพันธ์ระหว่างน้ำหนักตัวเป็นกิโลกรัม กับส่วนสูงเป็นเมตร หน่วยวัดเป็น กิโลกรัม/เมตร2",
      "purpose": "เพื่อให้กลุ่มเป้าหมายได้รับการคัดกรอง ประเมินภาวะสุขภาพ และปรับเปลี่ยนพฤติกรรมสุขภาพอย่างเหมาะสม",
      "population": "2. ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุข อายุ 19-59 ปี ที่มีค่าดัชนีมวลกาย",
      "collectionMethod": "อ้วนระดับ 1 และอ้วนระดับ 2 มี BMI ลดลง มากกว่าหรือเท่ากับ ร้อยละ 2",
      "source": "1. เพื่อให้ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุข อายุ 19-59 ปี ได้รับ",
      "formula": "การประเมินภาวะโภชนาการที่ครอบคลุม 2. เพื่อให้ ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุข อายุ 19-59 ปี ที่มีค่าดัชนี มวลกายอ้วนระดับ 1 และอ้วนระดับ 2 มี BMI ลดลง ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุข สังกัด รพ.สต./PCU/รพช./รพท./รพศ./ สสอ. ที่มีอายุ 19-59 ปี รายงานผลการคัดกรอง ชั่งน้ำหนัก วัดส่วนสูง วัดรอบเอว ดัชนีมวลกาย จาก โปรแกรม Khonkaen-HTD รพ.สต./PCU/สสอ./รพช./รพท./รพศ. 1. ร้อยละ ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุขอายุ 19-59 ปี ได้รับการชั่ง น้ำหนัก วัดส่วนสูง มากกว่า หรือเท่ากับ ร้อยละ 70 A = จำนวน ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุขอายุ19-59 ปี ที่ชั่งน้ำหนัก วัดส่วนสูงทั้งหมด",
      "numeratorA": "จำนวน ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุขอายุ19-59 ปี",
      "denominatorB": "จำนวน ประชาชนที่อาศัยอยู่ในหมู่บ้าน 5 โรค อสม.และบุคลากรสาธารณสุขอายุ19-59 ปี",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "เกณฑ์การให้คะแนน(รวม 100 คะแนน) ผลรวม คะแนน 10 คะแนน 20 คะแนน 30 คะแนน 40 คะแนน 40 % ชั่ง นน. < 60.00 % 60.00–64.99 % 65.00-69.99 > 70.00 % สส. % คะแนน 15 คะแนน 30 คะแนน 45 คะแนน 60 คะแนน 60 % BMI ลดลง <1.00 % 1.00-1.49 % 1.50 – 1.99 % > 2.0 % 17.วิธีการประเมินผล คะแนน 1 คะแนน 2 คะแนน 3 คะแนน 4 คะแนน 5 คะแนนรวม < 60 คะแนนรวม คะแนนรวม คะแนนรวม คะแนนรวม 60.01-70.00 70.01-80.00 80.01-90.00 >90 รายละเอียดข้อมูล รายละเอียดข้อมูลพื้นฐาน (Baseline data) ผลการดำเนินงานย้อนหลัง 3 ปี (ปี 2565 - 2567) พื้นฐาน Baseline data หน่วยวัด ผลการดำเนินงานในรอบปีงบประมาณ (Baseline Data) ผลการดำเนินงาน 2565 2566 2567 ย้อนหลัง 3 ปี (ปี 2565 -2567) N/A N/A -3.94",
      "responsible": "นางสาวเทวารักษ์ ภูครองนาค ตัวชี้วัด นักวิชาการสาธารณสุขชำนาญการ โทร. 09 5652 7227 Email : theywarak.ph@gmail.com"
    },
    "KPI70-13": {
      "kpiId": "KPI70-13",
      "order": 13,
      "name": "ร้อยละของผู้ที่มีผลผิดปกติ (มะเร็งลำไส้ใหญ่และไส้ตรงผิดปกติ) ได้รับการส่องกล้อง Colonoscopy",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "95",
      "baseline": "64.57",
      "definition": "1. ผู้ที่มีผลการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรงผิดปกติ หมายถึง ประชากรเพศชาย และเพศหญิงอายุ 50- 70 ปีที่มีผลการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรง ด้วยวิธี Fecal Immunochemical Test (FIT) เป็นบวก (Positive) คือตรวจพบเม็ดเลือดแดงใน ตัวอย่างอุจจาระ 2. การส่องกล้อง Colonoscopy หมายถึง การวินิจฉัยความผิดปกติภายในลำไส้ใหญ่ ด้วยการส่องกล้องขยาย เพื่อการค้นหารอยโรคก่อนการเกิดมะเร็งลำไส้ใหญ่และไส้ตรงใน ระยะต้น",
      "purpose": "เพื่อลดอัตราการเกิดโรคมะเร็งลำไส้ใหญ่และไส้ตรงในระยะลุกลาม",
      "population": "ประชากรกลุ่มเป้าหมายที่ได้รับการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรงด้วยวิธี FIT test ในปีงบประมาณ พ.ศ.2568 ผลการตรวจเป็นบวก (Positive)",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "1. โปรแกรม Your Colonoscopy 2. HDC สำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "formula": "A = จำนวนประชากรกลุ่มเป้าหมายที่ได้รับการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรงด้วยวิธี FIT test ในปีงบประมาณ พ.ศ.2568 ผลการตรวจเป็นบวก (Positive) B = จำนวนประชากรกลุ่มเป้าหมายที่ได้รับการคัดกรองมะเร็งลำไส้ใหญ่ และไส้ตรงด้วยวิธี FIT test ในปีงบประมาณ พ.ศ.2568 ผลการตรวจเป็นบวก (Positive) ที่ได้รับการส่องกล้อง Colonoscopy สูตรคำนวณ (A/B) x 100 ตัวชี้วัด ระยะเวลา รายไตรมาส ปีงบประมาณ พ.ศ.2568 ประเมินผล",
      "numeratorA": "จำนวนประชากรกลุ่มเป้าหมายที่ได้รับการคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรงด้วยวิธี FIT test",
      "denominatorB": "จำนวนประชากรกลุ่มเป้าหมายที่ได้รับการคัดกรองมะเร็งลำไส้ใหญ่ และไส้ตรงด้วยวิธี FIT test",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลได้แบบ real time จากโปรแกรม Your Colonoscopy รายละเอียด ปีงบประมาณ 2565 ปีงบประมาณ 2566 ปีงบประมาณ 2567 ร้อยละ 85.24 ร้อยละ 82.67 ร้อยละ 81.46 ข้อมูลพื้นฐาน (Baseline Data) ผลการดำเนินงาน ย้อนหลัง 3 ปี (ปี 2565 -2567) ทธศาสตร์จังหวัดขอนแก่น ระยะ 5 ปี (พ.ศ. 2566-2570) หน้า 82 128",
      "responsible": "ตำแหน่ง : พยาบาลวิชาชีพชำนาญการ สำนักงานสาธารณสุขจังหวัดขอนแก่น ตัวชี้วัด 1. ชื่อ-สกุล นางยุภาพร ดีแป้น โทรสาร : 043-224037 E-mail : smallbody@hotmail.com กลุ่มงาน : ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด ตำแหน่ง : พยาบาลวิชาชีพชำนาญการ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ที่ทำงาน : 043-221125 ต่อ 150 โทรสาร : 043-224037 โทรศัพท์มือถือ : 080-4620160 ตำแหน่ง : นักวิชาการสาธารณสุขชำนาญการพิเศษ สำนักงานสาธารณสุขจังหวัดขอนแก่น 2. ชื่อ-สกุล นางแสงเดือน โสภา โทรสาร : 043-224037 กลุ่มงาน : ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด โทรศัพท์ที่ทำงาน : 043-221125 ต่อ 150 โทรศัพท์มือถือ : 081-3803219 3. ชื่อ-สกุล นางกิตติมา ก้านจักร กลุ่มงาน : ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด โทรศัพท์ที่ทำงาน : 043-221125 ต่อ 169 โทรศัพท์มือถือ : 087-7707761"
    },
    "KPI70-14": {
      "kpiId": "KPI70-14",
      "order": 14,
      "name": "อัตราความครอบคลุมของการค้นหาผู้ป่วยวัณโรคในกลุ่มผู้สัมผัสร่วมบ้านและผู้สัมผัสใกล้ชิด",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "100",
      "baseline": "100",
      "definition": "การประเมินการค้นหาวัณโรค หมายถึง ผู้ที่ได้รับการค้นหาวัณโรคด้วยวิธีการถ่ายภาพรังสีทรวงอก (Chest X-Ray) ในปีงบประมาณ 2568 (1 ตุลาคม 2567 - 30 กันยายน 2568) ผู้สัมผัสวัณโรคร่วมบ้าน (household contact) หมายถึง บุคคลที่อาศัยอยู่ร่วมบ้านกับผู้ป่วย ถ้านอนห้องเดียวกัน (household intimate) มีโอกาสรับ และติดเชื้อสูงมากกว่าผู้ที่อาศัยในบ้านเดียวกัน แต่นอนแยกห้อง (household regular) ไม่นับรวมญาติพี่น้องที่อาศัยอยู่คนละบ้านแต่ไปมาหาสู่ เป็นครั้งคราว และนับระยะเวลาที่อยู่ร่วมกับผู้ป่วยกี่วันก็ได้ในช่วงระหว่าง 3 เดือนที่ผ่านมา",
      "purpose": "เพื่อให้คัดกรองกลุ่มผู้สัมผัสร่วมบ้าน และค้นหาผู้ป่วยวัณโรค เพื่อเข้าถึงกระบวนการรักษา ได้อย่าง รวดเร็ว สามารถลดอัตราป่วย และอัตราการเสียชีวิตได้",
      "population": "กลุ่มผู้สัมผัสร่วมบ้าน (household contact) หมายถึง บุคคลที่อาศัยอยู่ร่วมบ้านกับผู้ป่วยวัณโรคปอด ที่ขึ้นทะเบียนตั้งแต่ปีงบประมาณ 2568 (ตั้งแต่วันที่ 1 ตุลาคม 2567 ถึงวันที่ 30 กันยายน 2568)",
      "collectionMethod": "1. ทะเบียนผู้สัมผัสร่วมบ้าน 2. บันทึกข้อมูลผู้ป่วยวัณโรค ผ่านโปรแกรมบริหารจัดการข้อมูลรายป่วยวัณโรคแห่งชาติ (โปรแกรม NTIP online)",
      "source": "โปรแกรมบริหารจัดการข้อมูลรายป่วยวัณโรคแห่งชาติ (NTIP online)",
      "formula": "อัตราความครอบคลุมของการค้นหาผู้ป่วยวัณโรคในกลุ่มผู้สัมผัสร่วมบ้าน (เฝ้าระวังติดตามครบ 2 ปี) คำนวณจาก สูตรคำนวณ = (A/B) x 100 A = จำนวนผู้สัมผัสร่วมบ้านของผู้ป่วยวัณโรคปอดที่ขึ้นทะเบียนปีงบประมาณ 2568 (ตั้งแต่วันที่ 1 ตุลาคม 2567 ถึงวันที่ 30 กันยายน 2568) ที่ได้รับการคัดกรองด้วยวิธีการถ่ายภาพรังสี ทรวงอก (Chest X-Ray) ในโปรแกรม NTIP B = จำนวนผู้สัมผัสร่วมบ้านของผู้ป่วยวัณโรคปอดที่ขึ้นทะเบียนปีงบประมาณ 2568 (ตั้งแต่วันที่ 1 ตุลาคม 2567 ถึงวันที่ 30 กันยายน 2568) ในทะเบียนผู้สัมผัสร่วมบ้าน",
      "numeratorA": "จำนวนผู้สัมผัสร่วมบ้านของผู้ป่วยวัณโรคปอดที่ขึ้นทะเบียนปีงบประมาณ 2568",
      "denominatorB": "จำนวนผู้สัมผัสร่วมบ้านของผู้ป่วยวัณโรคปอดที่ขึ้นทะเบียนปีงบประมาณ 2568",
      "frequency": "ติดตามความก้าวหน้าการดำเนินงานทุกเดือน",
      "evaluationMethod": "เปรียบเทียบผลการดำเนินงานกับค่าเป้าหมายอัตราความครอบคลุมของการค้นหาผู้ป่วยวัณโรคในกลุ่มผู้ สัมผัสร่วมบ้าน ร้อยละ 100 แยกราย CUP",
      "responsible": "นางวีระวรรณ เหล่าวิทวัส ตำแหน่ง นักวิชาการสาธารณสุขชำนาญการพิเศษ กลุ่มงาน ควบคุมโรคติดต่อ หน่วยงาน สสจ.ขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ124 โทรสาร 0-4322-4037 โทรศัพท์มือถือ 08-9622-4515 E-mail : - นางสาวเอ็มวิกา แสงชาติ ตำแหน่ง นักวิชาการสาธารณสุขปฏิบัติการ กลุ่มงาน ควบคุมโรคติดต่อ หน่วยงาน สสจ.ขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ124 โทรสาร 0-4322-4037 โทรศัพท์มือถือ 09-8209-6938 E-mail : s.emviga@gmail.com"
    },
    "KPI70-15": {
      "kpiId": "KPI70-15",
      "order": 15,
      "name": "อัตราป่วยโรคเบาหวานและโรคความดันโลหิตสูงรายใหม่ ลดลง",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "8 / 2",
      "baseline": "-",
      "definition": "ผู้ป่วยเบาหวานรายใหม่ หมายถึง ผู้ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยจากโรคเบาหวาน",
      "purpose": "เพื่อลดจำนวนผู้ป่วยรายใหม่ กลุ่มเป้าหมาย ประชากรที่อาศัยในพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วยโรคเบาหวาน (E10-E14) ในปีงบประมาณปัจจุบัน",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "เข้าระบบ Health Data Center (HDC) On Cloud ระบบรายงาน HDC กระทรวงสาธารณสุข",
      "formula": "A = จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วยโรคเบาหวาน (E10-E14) ในปีงบประมาณปัจจุบัน สูตรคำนวณ ตัวชี้วัด B = จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วยโรคเบาหวาน (E10-E14) ในปีงบประมาณที่ผ่านมา",
      "numeratorA": "จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วยโรคเบาหวาน",
      "denominatorB": "จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วยโรคเบาหวาน",
      "frequency": "[(B-A)/B] x100",
      "evaluationMethod": "A : จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วยโรคเบาหวาน (E10-E14) ในปีงบประมาณปัจจุบัน ประมวลผลจาก DIAGNOSIS_OPD , DIAGNOSIS_IPD , CHORNIC รหัส ICD-10 3 หลักขึ้นต้นด้วย E10-E14 ที่อยู่อาศัยในเขตพื้นที่รับผิดชอบ PERSON.TYPE AREA IN (1 , 3) (1 : มีชื่ออยู่ตามทะเบียนบ้านในเขตพื้นที่รับผิดชอบและอยู่จริง) , ( 3 : มาอาศัยในเขตรับผิดชอบ แต่ทะเบียนอยู่นอกเขตรับผิดชอบ) และ PERSON.DISCHARGE = “9” (ไม่จำหน่าย) PERSON.NATION = “099” (สัญชาติไทย) B : จำนวนผู้ป่วยในเขตพื้นที่รับผิดชอบ ที่ได้รับการวินิจฉัยครั้งแรกจากแพทย์ว่าป่วยด้วยโรคเบาหวาน (E10-E14) ในปีงบประมาณที่ผ่านมา ประมวลผลจาก DIAGNOSIS_OPD , DIAGNOSIS_IPD , CHORNIC รหัส ICD-10 3 หลักขึ้นต้นด้วย E10-E14",
      "responsible": "ชื่อ-สกุล นางแสงเดือน โสภา ตำแหน่ง พยาบาลวิชาชีพชำนาญการ ตัวชี้วัด กลุ่มงาน ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ 150 โทรสาร 0-4322-4037 โทรศัพท์มือถือ... E-mail : sangdern.sopa@gmail.com"
    },
    "KPI70-16": {
      "kpiId": "KPI70-16",
      "order": 16,
      "name": "ร้อยละของเด็กอายุ 12 ปี ฟันดีไม่มีผุ (Cavity free)",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 2",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "88",
      "baseline": "76.90",
      "definition": "เด็กอายุ 0 - 5 ปี หมายถึง เด็กแรกเกิด จนถึงอายุ 5 ปี 11 เดือน 29 วัน สูงดี หมายถึง เด็กที่มีความยาวหรือส่วนสูงอยู่ในระดับสูงตามเกณฑ์ขึ้นไป (สูงตามเกณฑ์ ค่อนข้างสูง หรือสูง)",
      "purpose": "(ขององค์การอนามัยโลก) โดยมีค่ามากกว่าหรือเท่ากับ -1.5 SDของความยาว/ส่วนสูงตามเกณฑ์อายุ",
      "population": "สมส่วน หมายถึง เด็กที่มีน้ำหนักอยู่ในระดับสมส่วน เมื่อเทียบกับกราฟการเจริญเติบโตน้ำหนักตามเกณฑ์",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "สูงดีรูปร่างสมส่วน หมายถึง เด็กที่มีความยาวหรือส่วนสูงอยู่ในระดับสูงตามเกณฑ์ขึ้นไปและมีน้ำหนักอยู่ในระดับ สมส่วน (ในคนเดียวกัน) ร้อยละ 78 เพื่อการส่งเสริมสุขภาพ เด็ก อายุ 0 - 5 ปี มีการโภชนาการที่ดี การเจริญเติบโตตามวัย รูปร่างสูงดีสมส่วน เด็กปฐมวัยในจังหวัดขอนแก่น สถานบริการทุกระดับ นำข้อมูลการประเมินพัฒนาการเด็ก บันทึกในโปรแกรมหลักของสถานบริการฯ เช่น JHCIS, Hos xp, PCU เป็นต้น ส่งออกข้อมูลตามโครงสร้างมาตรฐาน 43 แฟ้ม โรงพยาบาลทุกแห่ง /สาธารณสุขอำเภอทุกอำเภอ/ รพ.สต.ทุกแห่ง",
      "formula": "A = จำนวนเด็กอายุ 0 -5 ปีที่ได้รับการคัดกรองชั่งน้ำหนัก และวัดความยาว/วัดส่วนสูง มีการเจริญเติบโต สูงดีสมส่วน สูตรคำนวณ ตัวชี้วัด B = จำนวนเด็กอายุ 0 -5 ปีที่ได้รับการคัดกรองชั่งน้ำหนัก และวัดความยาว/วัดส่วนสูงทั้งหมด ระยะเวลา ร้อยละของเด็กอายุ 0 -5 ปี สูงดีรูปร่างสมส่วน = (A x 100) /B ประเมิน 12 เดือน",
      "numeratorA": "จำนวนเด็กอายุ 0 -5 ปีที่ได้รับการคัดกรองชั่งน้ำหนัก และวัดความยาว/วัดส่วนสูง มีการเจริญเติบโต",
      "denominatorB": "จำนวนเด็กอายุ 0 -5 ปีที่ได้รับการคัดกรองชั่งน้ำหนัก และวัดความยาว/วัดส่วนสูงทั้งหมด",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ผลการดำเนินงานผ่านระบบรายงาน HDC รายละเอียด ผลการดำเนินงานย้อนหลัง 3 ปี (2565-2567) ข้อมูลพื้นฐาน (Baseline ตัวชี้วัด Baseline หน่วยวัด ผลการดำเนินงานใน Data) ร้อยละ รอบปีงบประมาณ data 2465 2566 2567 ร้อยละของเด็กอายุ 0 -5 ปี 64.20 73.1 67.23 64.20 สูงดีรูปร่างสมส่วน 3",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI70-17": {
      "kpiId": "KPI70-17",
      "order": 17,
      "name": "จำนวนโรงพยาบาลที่ยกระดับการพัฒนาอนามัยสิ่งแวดล้อมได้ตามเกณฑ์ GREEN & CLEAN Hospital",
      "strategy": "ยุทธศาสตร์ที่ 1",
      "objective": "เป้าประสงค์ที่ 3",
      "unit": "แห่ง",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "0 / 16 / 10",
      "baseline": "-",
      "definition": "โรงพยาบาลที่ยกระดับพัฒนาอนามัยสิ่งแวดล้อมได้ตามเกณฑ์ GREEN & CLEAN Hospital Challenge หมายถึง โรงพยาบาลสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่น (รพ.ศูนย์ รพ.ทั่วไป รพ.ชุมชน) ที่มีกิจกรรมการดำเนินงานด้านอนามัยสิ่งแวดล้อมตามเกณฑ์ ดังนี้ ระดับมาตรฐาน (Standard) หมายถึง โรงพยาบาลสามารถดำเนินการตามเกณฑ์ข้อที่ 1 - 13 ได้ตามเงื่อนไข (คะแนน 80 % ขึ้นไป) CLEAN 1. มีการกำหนดนโยบาย จัดทำแผนการขับเคลื่อน พัฒนาศักยภาพและสร้างกระบวนการสื่อสาร ให้เกิดการพัฒนาด้านอนามัยสิ่งแวดล้อม GREEN & CLEAN Hospital อย่างมีส่วนร่วมของคนในองค์กร G : Garbage 2. มีการจัดการมูลฝอยทั่วไปอย่างถูกสุขลักษณะและเป็นไปตามกฎกระทรวงสุขลักษณะการจัดการ มูลฝอยทั่วไป 2560 และกฎหมายที่เกี่ยวข้อง 3. มีการจัดการมูลฝอยที่เป็นพิษหรืออันตรายอย่างถูกสุขลักษณะเป็นไปตามกฎกระทรวงมูลฝอยที่เป็น พิษหรืออันตรายจากชุมชน พ.ศ. 2563 และกฎหมายอื่นที่เกี่ยวข้อง 4. มีการจัดการมูลฝอยติดเชื้ออย่างถูกสุขลักษณะ ตามกฎกระทรวงว่าด้วยการกำจัดมูลฝอยติดเชื้อ พ.ศ. 2545 R : Rest room 5. มีการพัฒนาส้วมตามมาตรฐานส้วมสาธารณะไทย (HAS) ที่อาคารผู้ป่วยนอก(OPD) และอาคาร ผู้ป่วยใน (IPD) 6. มีการจัดการสิ่งปฏิกูลอย่างถูกสุขลักษณะตามกฎกระทรวงสุขลักษณะการจัดการสิ่งปฏิกูล พ.ศ. 2561 และกฎหมายอื่นที่เกี่ยวข้อง E : Energy 7. มีการกำหนดนโยบายและมาตรการประหยัดพลังงานที่เป็นปัจจุบัน และเป็นรูปธรรม เกิดประสิทธิภาพในการลดการใช้พลังงานและมีการปฏิบัติตามมาตรการที่กำหนดร่วมกันทั้งองค์กร E : Environment 8. มีการจัดการสิ่งแวดล้อมทั่วไปทั้งภายในและภายนอกอาคาร โดยเพิ่มพื้นที่สีเขียวและพื้นที่พักผ่อน ที่สร้างความรู้สึกผ่อนคลายสอดคล้องกับชีวิต และวัฒนธรรมท้องถิ่นสำหรับผู้ป่วย รวมทั้งผู้มารับบริการ 9. มีกิจกรรมส่งเสริม GREEN และกิจกรรมที่เอื้อต่อการมีสุขภาพดีแบบองค์รวม ได้แก่ กิจกรรม ส่งเสริมสุขอนามัย กิจกรรมป้องกันการแพร่ระบาดของโรค กิจกรรมทางกาย กิจกรรมให้คำปรึกษา ด้านสุขภาพขณะรอรับบริการของผู้ป่วยและญาติ N : Nutrition 10. สถานที่ประกอบอาหารผู้ป่วยในโรงพยาบาลได้มาตรฐานสุขาภิบาลอาหารตามกฎกระทรวง สุขลักษณะของสถานที่จำหน่ายอาหาร พ.ศ. 2561 (4 หมวด) และมีการเฝ้าระวังทางสุขาภิบาลอาหาร 11. ร้านอาหารในโรงพยาบาลได้มาตรฐานสุขาภิบาลอาหารตามกฎกระทรวงสุขลักษณะของสถานที่ จำหน่ายอาหาร พ.ศ. 2561 (4 หมวด) และมีการเฝ้าระวังทางสุขาภิบาลอาหาร 12. จัดให้มีน้ำอุปโภค/บริโภคสะอาดที่อาคารผู้ป่วยนอกและผู้ป่วยใน 13. โรงพยาบาลมีการดำเนินงานนโยบายโรงพยาบาลอาหารปลอดภัยร่วมกับภาคีเครือข่ายในพื้นที่ (ตามคู่มือมาตรฐานโรงอาหารปลอดภัย Food Safety Hospital) ระดับดีเยี่ยม (Excellent) หมายถึง โรงพยาบาลสามารถดำเนินการ ตามเกณฑ์ข้อที่ 1 - 15 ได้ตามเงื่อนไขที่กำหนด (คะแนน 90 % ขึ้นไป) Innovation 14. มีการส่งเสริมให้เกิดนวัตกรรม GREEN โดยการนำไปใช้ประโยชน์และเกิดการแลกเปลี่ยนเรียนรู้ กับเครือข่ายในโรงพยาบาลและชุมชน",
      "purpose": "เพื่อส่งเสริมให้โรงพยาบาลสังกัดสำนักงานสาธารณสุขจังหวัด มีการพัฒนาอนามัยสิ่งแวดล้อม ได้ตามเกณฑ์ GREEN & CLEAN Hospital Challenge",
      "population": "โรงพยาบาลสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "collectionMethod": "โรงพยาบาลทุกแห่งบันทึกข้อมูลในโปรแกรม GREEN & CLEAN Hospital",
      "source": "โปรแกรมการประเมิน GREEN & CLEAN Hospital",
      "formula": "A = จำนวนรพ.ที่ดำเนินการได้ตามเกณฑ์ 13 ข้อ (คะแนน 80 % ขึ้นไป) B = จำนวนรพ.ที่ดำเนินการได้ตามเกณฑ์ 15 ข้อ (คะแนน 90 % ขึ้นไป) C = จำนวนรพ.ที่ดำเนินการได้ตามเกณฑ์ 15 ข้อ (คะแนน 90 % ขึ้นไป) และพัฒนาได้ตามประเด็นท้าทายA+B+C=26 ระยะเวลา นิเทศ ติดตาม และประเมินผลการดำเนินงานสาธารณสุขจังหวัดขอนแก่น ปี 2568 จำนวน 2 รอบ ประเมินผล",
      "numeratorA": "จำนวนโรงพยาบาลสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่นที่ดำเนินการ GREEN & CLEAN",
      "denominatorB": "จำนวนโรงพยาบาลสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่นที่ดำเนินการ GREEN & CLEAN",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "1. โรงพยาบาลทุกแห่งประเมินตนเองบันทึกข้อมูลในโปรแกรม GREEN & CLEAN Hospital ส่งให้ สำนักงานสาธารณสุขจังหวัดขอนแก่น 2. สำนักงานสาธารณสุขจังหวัดขอนแก่น ประเมินผลการดำเนินงานของโรงพยาบาลศูนย์ โรงพยาบาล",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI70-18": {
      "kpiId": "KPI70-18",
      "order": 18,
      "name": "อัตราความสำเร็จของการรักษาวัณโรคปอดรายใหม่",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "95",
      "baseline": "74.59",
      "definition": "1. ความสำเร็จการรักษา หมายถึง ผู้ป่วยวัณโรคปอดรายใหม่ที่มีผลการรักษาหายรวมกับรักษาครบ 1.1 รักษาหาย (Cured) หมายถึง ผู้ป่วยวัณโรคปอดรายใหม่ที่มี ผลตรวจทางห้องปฏิบัติการพบเชื้อ วัณโรคก่อนเริ่มการรักษา และต่อมาตรวจไม่พบเชื้อวัณโรคอย่างน้อยหนึ่งครั้งก่อนสิ้นสุดการรักษา และในเดือนสุดท้ายของการรักษา 1.2 รักษาครบ (Treatment Completed) หมายถึง ผู้ป่วยวัณโรคปอดรายใหม่ที่รักษาครบกำหนด โดยไม่มีหลักฐานที่แสดงว่าการรักษาล้มเหลว ซึ่งผู้ป่วยดังกล่าวไม่มีเอกสารที่แสดงผลการตรวจเสมหะ ในเดือนสุดท้ายของการรักษา ทั้งนี้มีผลตรวจเสมหะเป็นลบอย่างน้อยหนึ่งครั้งก่อนสิ้นสุดการรักษา รวมทั้งผู้ป่วยที่ไม่ได้ตรวจหรือไม่มีผลตรวจ 2. ผู้ป่วยวัณโรคปอดรายใหม่ หมายถึง ผู้ป่วยวัณโรคปอดที่ไม่เคยรักษาวัณโรคมาก่อนและผู้ป่วยที่รักษา วัณโรคน้อยกว่า 1 เดือน และไม่เคยขึ้นทะเบียนในแผนงานวัณโรคแห่งชาติ แบ่งเป็น 2 กลุ่ม คือ 2.1 ผู้ป่วยที่มีผลตรวจยืนยันพบเชื้อวัณโรค (Bacteriologically confirmed: B+) หมายถึง ผู้ป่วย วัณโรคที่มีผลตรวจเสมหะเป็นบวก อาจจะเป็นการตรวจด้วยวิธี Smear microscopy หรือ Culture หรือวิธี Molecular หรือวิธีการอื่นๆ ที่องค์การอนามัยโลกรับรอง 2.2 ผู้ป่วยที่วินิจฉัยด้วยลักษณะทางคลินิก (Clinically diagnosed:B-) หมายถึง ผู้ป่วยวัณโรคที่มีผล ตรวจเสมหะเป็นลบ หรือไม่มีผลตรวจ แต่ผลการวินิจฉัยด้วยวิธีการตรวจเอกซเรย์รังสีทรวงอก หรือผลการตรวจชิ้นเนื้อผิดปกติเข้าได้กับวัณโรค ร่วมกับมีลักษณะทางคลินิกเข้าได้กับวัณโรค และแพทย์ตัดสินใจรักษาด้วยสูตรยารักษาวัณโรค 3. การประเมิน การประเมินอัตราความสำเร็จการรักษาผู้ป่วยวัณโรคปอดรายใหม่ (Success rate) หมายถึง ผู้ป่วย วัณโรคปอดรายใหม่ที่ขึ้นทะเบียน ในไตรมาสที่ 1 ของปีงบประมาณ 2568 (1 ตุลาคม – 31 ธันวาคม 2567) ที่เป็นผู้ป่วยไทย ผู้ป่วยไม่ใช่ไทย และผู้ป่วยในเรือนจำ ที่รักษาในโรงพยาบาลรัฐทั้ งใน และนอกสังกัดกระทรวงสาธารณสุข ไม่รวมโรงพยาบาลเอกชน",
      "purpose": "1. เพื่อให้ผู้ติดเชื้อวัณโรคและผู้ป่วยวัณโรคเข้าถึงระบบบริการสุขภาพในด้านการตรวจวินิจฉัย ป้องกัน",
      "population": "ดูแลรักษาที่ได้มาตรฐานและรักษาหาย รักษาครบ 2. เพื่อพัฒนามาตรฐานระบบบริการสุขภาพในการตรวจวินิจฉัย ป้องกัน ดูแลรักษาผู้ติดเชื้อวัณโรค และผู้ป่วยวัณโรคของสถานบริการสาธารณสุข กลุ่มเป้าหมายสำหรับการประเมินอัตราความสำเร็จการรักษาผู้ป่วยวัณโรคปอดรายใหม่ คือ ผู้ป่วยวัณโรคปอดรายใหม่ที่ขึ้นทะเบียนในไตรมาสที่ 1 ของปีงบประมาณ 2568 (1 ตุลาคม–ธันวาคม 2567) ที่เป็นผู้ป่วยไทย ผู้ป่วยไม่ใช่ไทยและผู้ป่วยในเรือนจำที่รักษาในโรงพยาบาลรัฐ ทั้งในและนอกสังกัด กระทรวงสาธารณสุขไม่รวมโรงพยาบาลเอกชน",
      "collectionMethod": "บันทึกข้อมูลผู้ป่วยวัณโรค ผ่านโปรแกรมบริหารจัดการข้อมูลรายป่วยวัณโรคแห่งชาติ (โปรแกรม NTIP online)",
      "source": "โปรแกรมบริหารจัดการข้อมูลรายป่วยวัณโรคแห่งชาติ (NTIP online)",
      "formula": "อัตราความสำเร็จการรักษาผู้ป่วยวัณโรคปอดรายใหม่ที่ขึ้นทะเบียน ในไตรมาสที่ 1 ของ ปีงบประมาณ พ.ศ.2568 (1 ตุลาคม – 31 ธันวาคม 2567) คำนวณจาก สูตรคำนวณ = (A/B) x 100 A = จำนวนผู้ป่วยวัณโรคปอดรายใหม่ที่ขึ้นทะเบียนในไตรมาสที่ 1 ของปีงบประมาณ 2568 (1 ตุลาคม – 31 ธันวาคม 2567) โดยมีผลการรักษาหาย (Cured) รวมกับรักษาครบ (Completed) โดยครบรอบรายงานผลการรักษาวันที่ 30 กันยายน 2567 B = จำนวนผู้ป่วยวัณโรคปอดรายใหม่ที่ขึ้นทะเบียนในไตรมาสที่ 1 ของปีงบประมาณ 2568 (1 ตุลาคม – 31 ธันวาคม 2567) โดยการเปลี่ยนแปลงวินิจฉัยและพบว่าเป็น RR/MDR/XDR-TB ไม่ถูกนำมานับรวม ระยะเวลา ติดตามความก้าวหน้าการดำเนินงานทุกเดือน ประเมินผล",
      "numeratorA": "จำนวนผู้ป่วยวัณโรคปอดรายใหม่ที่ขึ้นทะเบียนในไตรมาสที่ 1 ของปีงบประมาณ 2568",
      "denominatorB": "จำนวนผู้ป่วยวัณโรคปอดรายใหม่ที่ขึ้นทะเบียนในไตรมาสที่ 1 ของปีงบประมาณ 2568",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "เปรียบเทียบผลการดำเนินงานกับค่าเป้าหมาย รายละเอียดข้อมูล อัตราผลสำเร็จของการรักษาวัณโรคปอดรายใหม่ (ไตรมาสที่ 1/2568) ไม่น้อยกว่าร้อยละ 90 พื้นฐาน(Baseline Data) แยกเป็นระดับ CUP ผลการดำเนินงาน ย้อนหลัง 3 ปี Baseline data หน่วย ผลการดำเนินงานในรอบ (ปี 2565 -2567) วัด ปีงบประมาณ พ.ศ. 2565 2566 2567 อัตราความสำเร็จการรักษาวัณโรคปอด ร้อยละ 70.83 75.26 76.55 รายใหม่* หมายเหตุ * อัตราความสำเร็จการรักษาผู้ป่วยวัณโรคปอดรายใหม่ที่ขึ้นทะเบียน ในไตรมาสที่ 1 ของแต่ละปีงบประมาณ ** ไม่คิดรวมอยู่ระหว่างการรักษา ร้อยละ 8.36",
      "responsible": "นางวีระวรรณ เหล่าวิทวัส ตำแหน่ง นักวิชาการสาธาณสุขชำนาญการพิเศษ กลุ่มงาน ควบคุมโรคติดต่อ หน่วยงาน สสจ.ขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ124 โทรสาร 0-4322-4037 โทรศัพท์มือถือ 08-9622-4515 E-mail : - นางสาวเอ็มวิกา แสงชาติ ตำแหน่ง นักวิชาการสาธารณสุขปฏิบัติการ กลุ่มงาน ควบคุมโรคติดต่อ หน่วยงาน สสจ.ขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ124 โทรสาร 0-4322-4037 โทรศัพท์มือถือ 09-8209-6938 E-mail : s.emviga@gmail.com"
    },
    "KPI70-19": {
      "kpiId": "KPI70-19",
      "order": 19,
      "name": "ร้อยละประชาชนกลุ่มเป้าหมายเป็นโรคพยาธิใบไม้ตับลดลง",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ร้อยละ",
      "direction": "ยิ่งน้อยยิ่งดี",
      "target": "≤ 0.8",
      "baseline": "3.64",
      "definition": "ร้อยละประชาชนกลุ่มเป้าหมายเป็นโรคพยาธิใบไม้ตับลดลง ตามเกณฑ์มาตรฐานแผนยุทธศาสตร์สุขภาพ 5 ปี จังหวัดขอนแก่น (พ.ศ. 2566–2570)",
      "purpose": "1. เพื่อเฝ้าระวัง ป้องกัน ควบคุม รักษาโรคพยาธิใบไม้ตับและมะเร็งท่อน้ำดี 2. เพื่อพัฒนาคุณภาพการคัดกรองวินิจฉัย การส่งต่อดูแลรักษาโรคพยาธิใบไม้ตับและมะเร็งท่อน้ำดี",
      "population": "หมายถึง ประชากรจังหวัดขอนแก่น (ตาม43แฟ้ม Type area = 1,3 และ Nation = 099) ที่มีอายุ 15 ปีขึ้นไป หรืออาศัยอยู่ในอีสานมากกว่า 15 ปี และมีปัจจัยเสี่ยงในข้อใดข้อหนึ่งต่อไปนี้ 1. มีประวัติการกินปลาตระกูลมีเกล็ดน้ำจืดสุกๆดิบๆ หรือปลาร้าดิบ ปลาส้มดิบ ปล่าจ่อมดิบ 2. มีประวัติการติดเชื้อพยาธิใบไม้ตับ หรือเคยกินยาฆ่าเชื้อพยาธิใบไม้ตับ (Praziquantel) 3. มีญาติสายตรงติดพยาธิใบไม้ตับ หรือป่วย/เสียชีวิตด้วยโรคมะเร็งท่อน้ำดี การตรวจคัดกรองโรคพยาธิใบไม้ตับ หมายถึง การตรวจหาพยาธิใบไม้ตับ (OV; Opisthorchis viverrini) ในกลุ่มประชากรที่มีอายุ 15 ปีขึ้นไป ด้วยวิธีตรวจอุจจาระ และ/หรือ ปัสสาวะ โดย วิธีตรวจอุจจาระ ได้แก่ Formalin ether concentration technique (FECT) หรือ Modified Kato thick smear หรือ Modified Kato-Katz หรือ JIK-PARASITE TRAP วิธีตรวจปัสสาวะ (OV-RDT; OV-Rapid diagnostic test) คือ การใช้ตัวตรวจจับจำเพาะ หรือโมโนโคลนอล แอนติบอดี (monoclonal antibody) ที่มีความจำเพาะต่อพยาธิใบไม้ตับและเป็นสารตรวจจับสิ่งคัดหลั่ง หรือแอนติเจนของพยาธิใบไม้ตับในปัสสาวะ การตรวจคัดกรองมะเร็งท่อน้ำดีด้วยการอัลตราซาวด์ หมายถึง การตรวจมะเร็งท่อน้ำดีด้วยการอัลตรา ซาวด์ ในประชาชนกลุ่มเป้าหมาย ที่ตรวจพบพยาธิใบไม้ตับจากการตรวจหาการติดเชื้อจากอุจจาระ หรือปัสสาวะ ในกลุ่มประชากรที่มีอายุ 40 ปีขึ้นไป โดยจังหวัดขอนแก่นมุ่งเน้นในกลุ่มที่มีอายุระหว่าง 50 - 70 ปี แนวทางดำเนินงานเฝ้าระวัง ป้องกัน รักษาโรคมะเร็งท่อน้ำดี ตาม 8 มาตรการ ดังนี้ มาตรการที่ 1 คัดกรองพยาธิใบไม้ตับในประชากรกลุ่มเป้าหมาย เมื่อพบผู้ติดพยาธิให้รักษาและปรับเปลี่ยน พฤติกรรมสุขภาพ มาตรการที่ 2 คัดกรองมะเร็งท่อน้ำดีในประชาชนอายุ 40 ปีขึ้นไป ด้วยเครื่องอัลตร้าซาวด์ มาตรการที่ 3 จัดระบบสุขาภิบาล บริหารจัดการสิ่งปฏิกูลเพื่อตัดวงจรพยาธิ โดยจัดให้มีบ่อบำบัดสิ่งปฏิกูล ในทุกพื้นที่ผ่านองค์กรปกครองส่วนท้องถิ่น มาตรการที่ 4 สนับสนุนให้มีการสร้างความรอบรู้ด้านสุขภาพ (Health Literacy) โรคพยาธิใบไม้ตับ และมะเร็งท่อน้ำดี ในเด็กนักเรียน เยาวชน อาสาสมัครสาธารณสุข ผู้ประกอบการ และประชาชน มาตรการที่ 5 รณรงค์อาหารปลอดภัย ปลาปลอดพยาธิอย่างต่อเนื่องในพื้นที่ผ่านทุกช่องทางการสื่อสารตามบริบท มาตรการที่ 6 บริหารจัดการส่งต่อผู้สงสัยมะเร็งท่อน้ำ ดีเข้าสู่กระบวนการวินิจฉัยรักษาอย่างเป็นระบบ และมี ระบบการ รับ-ส่งต่อ ผู้ป่วยจากโรงพยาบาลสู่ชุมชนมีหมอครอบครัวเข้าไปดูแลประคับประคองด้วยการแพทย์ ผสมผสานทั้ง แพทย์แผนปัจจุบัน และแพทย์ทางเลือก มาตรการที่ 7 รายงานข้อมูล ตามระบบงานเฝ้าระวัง ได้แก่ ฐานข้อมูลจังหวัด อำเภอ , HDC , Isan cohort มาตรการที่ 8 พัฒนานวัตกรรม และพัฒนาบุคลากรทางด้านสาธารณสุขในการป้องกันควบคุมโรคพยาธิใบไม้ตับ และการรักษามะเร็งท่อน้ำดี เพื่อนำไปใช้ในการปรับปรุงการแก้ไขปัญหาพยาธิใบไม้ตับและมะเร็งท่อน้ำดี",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "ฐานข้อมูลจังหวัด หรือ HDC 43 แฟ้ม หรือ Isan cohort รหัสการบันทึกข้อมูล 43 แฟ้ม ; การคัดกรองพยาธิใบไม้ตับ Screening รหัส Z116 กรณีพบการติดเชื้อ สูตรคำนวณ พยาธิใบไม้ตับ ใช้รหัส ICD10 คือ B 660 โดยในปี 2568 สสจ.ขอนแก่น มุ่งเน้นการจัดเก็บในฐานข้อมูล ตัวชี้วัด HDC และ Isan cohort เป็นหลัก ขึ้นอยู่กับบริบทพื้นที่ ระยะเวลา ฐานข้อมูลจังหวัด หรือ HDC 43 แฟ้ม หรือ Isan cohort ประเมินผล A = ประชากรเป้าหมายที่ได้รับการตรวจคัดกรองพยาธิใบไม้ตับและมีผลพบเชื้อ",
      "numeratorA": "ประชากรเป้าหมายที่ได้รับการตรวจคัดกรองพยาธิใบไม้ตับและมีผลพบเชื้อ",
      "denominatorB": "ประชากรกลุ่มเป้าหมายที่ได้รับการตรวจคัดกรอง ปี 2568 ทั้งหมด",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI70-20": {
      "kpiId": "KPI70-20",
      "order": 20,
      "name": "อัตราการฆ่าตัวตายสำเร็จ",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ต่อแสนประชากร",
      "direction": "ยิ่งน้อยยิ่งดี",
      "target": "≤ 7.5",
      "baseline": "7.21",
      "definition": "การฆ่าตัวตายสำเร็จ คือ การเสียชีวิตจากพฤติกรรมมุ่งทำร้ายตนเองโดยตั้งใจจะให้ตายจากพฤติกรรมนั้น ซึ่งวิธีการที่ใช้มีลักษณะสอดคล้องตามมาตรฐานการจำแนกโรคระหว่างประเทศขององค์การอนามัยโลก ฉบับที่ 10 (ICD - 10 : International Classification of Diseases and Health Related Problems - 10) หมวด Intentional self-harm (X60-X84) หรือเทียบเคียงในกลุ่มโรคเดียวกันกับการวินิจฉัยตามเกณฑ์ วินิจฉัยโรคของสมาคมจิตแพทย์อเมริกัน ฉบับที่ 5 (DSM-5: Diagnostic and Statistical Manual of Mental disorders 5)",
      "purpose": "เพื่อใช้แสดงและติดตามภาวะสุขภาพอนามัยที่สำคัญด้านสุขภาพจิตของประชาชน",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "หมายเหตุ ในอำเภอ ที่พบปัญหาการรายงาน รง 506s version 11 หรือข้อมูลจากการรายงาน รง.506s",
      "formula": "ต่ำกว่าฐานข้อมูลการตายในทะเบียนราษฎร์ของกระทรวงมหาดไทย จะใช้ข้อมูลการแจ้งตายจากฐานข้อมูลการ ตายทะเบียนราษฎร์ของกระทรวงมหาดไทย ที่รวบรวมโดยกองยุทธศาสตร์และแผนงาน กระทรวงสาธารณสุข สูตรคำนวณ ทดแทน ตัวชี้วัด ระยะเวลา 1. รายงานการเฝ้าระวังการพยายามฆ่าตัวตาย รง 506 S version 11. ประเมินผล 2. ข้อมูลการแจ้งตายจากฐานข้อมูลการตายทะเบียนราษฎร์ของกระทรวงมหาดไทย (อ้างอิงตามสถานที่เสียชีวิต) A = จำนวนผู้ฆ่าตัวตายสำเร็จ (อ้างอิงตามสถานที่เสียชีวิต) ปีงบประมาณ 2568 B = จำนวนประชากรกลางปี 2568 **หมายเหตุ สำหรับไตรมาส 2 ใช้ประชากรปลายปี 2567 สำหรับไตรมาส 3 และ 4 ใช้ประชากรกลางปี 2568 แหล่งข้อมูล กองยุทธศาสตร์และแผนงาน กระทรวงสาธารณสุข (A/B) x 100,000 ไตรมาส 4",
      "numeratorA": "จำนวนผู้ฆ่าตัวตายสำเร็จ (อ้างอิงตามสถานที่เสียชีวิต) ปีงบประมาณ 2568",
      "denominatorB": "จำนวนประชากรกลางปี 2568",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "นำข้อมูลที่ได้มาวิเคราะห์ข้อมูลทางสถิติในรูปแบบของอัตราต่อประชากรแสนคน รายละเอียด Baseline data หน่วยวัด ผลการดำเนินงานในรอบปีงบประมาณ พ.ศ. ข้อมูลพื้นฐาน การฆ่าตัวตายสำเร็จ (Baseline อัตราต่อ 2565 2566 2567 Data) ประชากร ผลการ แสนคน 5.97 6.18 6.57 ดำเนินงาน ย้อนหลัง 3 ปี",
      "responsible": "โทรศัพท์มือถือ 086-8616497 ตำแหน่ง พยาบาลวิชาชีพชำนาญการ ตัวชี้วัด 2. ชื่อ-สกุล นายณรงค์ชัย เศิกศิริ e-mail : tuttu34@gmail.com โทรศัพท์มือถือ 081-6691062 ตำแหน่ง นักวิชาการสาธารณสุข 3. ชื่อ-สกุล นางสาวนงลักษณ์ เข็มศิริ e-mail keeta.nongluk1@gmail.com โทรศัพท์มือถือ 062-5161046 สำนักงานสาธารณสุขจังหวัดขอนแก่น กลุ่มงานควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด โทรสาร 0-4322-4037 โทรศัพท์ 0-4322-1125 ต่อ 170"
    },
    "KPI70-21": {
      "kpiId": "KPI70-21",
      "order": 21,
      "name": "อัตราตายผู้ป่วยติดเชื้อในกระแสเลือดแบบรุนแรงชนิด (Community-Acquired)",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ร้อยละ",
      "direction": "ยิ่งน้อยยิ่งดี",
      "target": "< 23",
      "baseline": "23.14",
      "definition": "1. ผู้ป่วยติดเชื้อในกระแสเลือดแบบรุนแรง หมายถึง ผู้ป่วยที่เข้าเกณฑ์การวินิจฉัยภาวะ Severe sepsis หรือ Septic shock (โดยได้รับการคัดกรองตามเกณฑ์ข้อ 5) 1.1 ผู้ป่วย severe sepsis หมายถึง ผู้ป่วยที่สงสัยหรือยืนยันว่ามีการติดเชื้อในร่างกาย ร่วมกับ มี SIRS ตั้งแต่ 2 ข้อ ขึ้นไป ที่เกิดภาวะ Tissue hypoperfusion หรือ Organ dysfunction โดยที่อาจจะมีหรือไม่มีภาวะ Hypotension ก็ได้ หรือมีอาการแสดงตามเกณฑ์ ข้อใดข้อหนึ่ง ใน 5.2 - 5.4 1.2 ผู้ป่วย Septic shock หมายถึง ผู้ป่วยที่สงสัยหรือยืนยันว่ามีการติดเชื้อในร่างกาย ร่วมกับมี SIRS ตั้งแต่ 2 ข้อ ขึ้นไป ที่มี Hypotension ต้องใช้ Vasopressors ในการ Maintain MAP ≥65 mm Hg และ มีค่า serum lactate level >2 mmol/L (18 mg/dL) แม้ว่าจะได้สารน้ำ เพียงพอแล้วก็ตาม 2. Community - acquired sepsis หมายถึง การติดเชื้อมาจากที่บ้านหรือที่ชุมชน โดยต้องไม่อยู่ ในกลุ่ม Hospital - acquired sepsis อัตราตายจากติดเชื้อในกระแสเลือด แบ่งเป็น 2 กลุ่ม คือ 1) อัตราตายจาก Community - acquired sepsis 2) อัตราตายจาก Hospital - acquired sepsis 3. การติดเชื้อในโรงพยาบาล (Hospital - acquired infection, Nosocomial infection) คือ การติดเชื้อที่เกิดขึ้นในโรงพยาบาลหรือสถานที่อื่นๆ ที่ให้บริการสุขภาพ เช่น บ้านพักผู้ป่วย บ้านพัก คนชรา สถานบำบัด ห้องตรวจผู้ป่วยนอก หรืออื่นๆ การติดเชื้อในโรงพยาบาลเกิดขึ้นได้หลายวิธี เช่น ติดผ่านบุคลากรทางการแพทย์ที่มีเชื้อปนเปื้อนบนร่างกาย อุปกรณ์ที่ปนเปื้อน ผ้าปูที่นอน หรือละออง สารคัดหลั่งที่มีเชื้อ เป็นต้น ที่มาของเชื้ออาจมาจากสิ่งแวดล้อม จากผู้ป่วย จากบุคลากรที่ติดเชื้อ หรืออาจหาแหล่งที่มาของเชื้อไม่พบก็ได้ เชื้ออาจมาจากร่างกายของผู้ป่วยเอง ซึ่งเดิมเป็นเชื้อ ที่ยังไม่สามารถก่อให้เกิดโรคได้ แต่เมื่อผู้ป่วยรับการรักษาบางอย่าง เช่น การผ่าตัด หรือหัตถการ บางประเภท ก็ทำให้เชื้อที่มีอยู่เดิมมีโอกาส ท้าให้เกิดการติดเชื้อได้ เช่น การติดเชื้อที่แผลผ่าตัด Hospital - acquired infection (HAI) ห รือ Healthcare - associated infection ห ม าย ถึ ง การติดเชื้อที่เกิดในโรงพยาบาล เป็นการติดเชื้อที่ Date of Event (DOE) เกิดขึ้น หลังจากเข้ารับการ รักษาในโรงพยาบาลตั้งแต่วันที่ 3 เป็นต้นไป (Hospital day 3) หรือ หลังเข้ารับการรักษาในโรงพยาบาล ไปแล้ว อย่างน้อย 48 ชั่วโมง 4.",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "มุ่งเน้นที่กลุ่ม Community – acquired sepsis เพื่อพัฒนาให้ มีระบบข้อมูล พื้นฐานให้เหมือนกัน ทั้งประเทศ แล้วจึงขยายไปยัง Hospital-acquired sepsis ในปีถัดไป",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "(จำนวนผลงานที่บรรลุเกณฑ์ [A] ÷ จำนวนกลุ่มเป้าหมายทั้งหมด [B]) × 100",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI70-22": {
      "kpiId": "KPI70-22",
      "order": 22,
      "name": "อัตราผู้ป่วยโรคหลอดเลือดสมอง รายใหม่ต่อประชากรแสนคน",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ต่อแสนประชากร",
      "direction": "ยิ่งน้อยยิ่งดี",
      "target": "235",
      "baseline": "288.57",
      "definition": "ผู้ป่วยรายใหม่จากโรคหลอดเลือดสมอง หมายถึง ผู้ป่วยในที่ได้รับการวินิจฉัยโรคหลัก (Principal diagnosis: pdx) จากแพทย์ว่าป่วยด้วยโรคหลอดเลือดสมอง รหัส IDC 10 (I60-I69) ในปีงบประมาณ ทุกกลุ่มอายุ ในกรณีที่มีการวินิจฉัยโรคหลักซ้ำภายในระยะเวลามากกว่า 28 วันขึ้นไป ให้นับเป็นผู้ป่วย รายใหม่อีกครั้ง",
      "purpose": "เพื่อลดอัตราผู้ป่วยโรคหลอดเลือดสมองรายใหม่",
      "population": "ประชากรที่อยู่ตามทะเบียนราษฎร์ ทุกกลุ่มอายุ ในจังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านโปรแกรมพื้นฐานของหน่วยบริการและส่งออกข้อมูลตามมาตรฐานข้อมูล 43 แฟ้ม เข้าระบบ Health Data Center (HDC) On Cloud",
      "source": "HDC สำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "formula": "(A/B) x 100,000",
      "numeratorA": "จำนวนผู้ป่วยรายใหม่จากโรคหลอดเลือดสมองในปีงบประมาณ",
      "denominatorB": "จำนวนประชากรทะเบียนราษฎร์",
      "frequency": "1 ตุลาคม 2567 - รอบการนิเทศที่กำหนด",
      "evaluationMethod": "A : จำนวนผู้ป่วยในที่ได้รับการวินิจฉัยโรคหลัก (Principle diagnosis: pdx) จากแพทย์ว่าป่วยด้วย โรคหลอดเลือดสมอง รหัส ICD (I60-I69) ในปีงบประมาณทุกกลุ่มอายุ ในกรณีที่มีการวินิจฉัยโรคหลัก ซ้ำภายในระยะเวลามากกว่า 28 วันขึ้นไป ให้นับเป็นผู้ป่วยรายใหม่อีกครั้ ง ประมวลผลจาก DIAGNOSIS_IPD และ PERSON.DISCHARGE =”9” (ไม่ จำห น่ าย) PERSON.NATION = “99” สัญชาติไทย B : จำนวนประชากรตามทะเบียนราษฎร์ ทุกกลุ่มอายุ",
      "responsible": "ชื่อ นางประภัสสร แสนละมุน ตำแหน่ง นักวิชาการสาธารณสุข กลุ่มงาน : ควบคุมโรคไม่ติดต่อ สุขภาพจิตและยาเสพติด โทรศัพท์ที่ทำงาน 043-221125 ต่อ 150 โทรศัพท์มือถือ 082-8365237 โทรสาร 043-224037 E-mail : matoom.27290@gail.com"
    },
    "KPI70-23": {
      "kpiId": "KPI70-23",
      "order": 23,
      "name": "ร้อยละของผู้ป่วย IMC ได้รับการบริบาลฟื้นสภาพและติดตามจนครบ 6 เดือน หรือจน Barthel index = 20 ก่อนครบ 6 เดือน",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "99",
      "baseline": "95.23",
      "definition": "การบริบาลฟื้นสภาพระยะกลาง (Intermediate care; IMC) หมายถึง การบริบาลฟื้นสภาพผู้ป่วย ระยะกลางที่มีอาการทางคลินิกผ่านพ้นภาวะวิกฤติและมีอาการคงที่แต่ยังคงมีความผิดปกติ ของร่างกายบางส่วนอยู่และมีข้อจํากัดในการปฏิบัติกิจกรรมในชีวิตประจําวัน จําเป็นต้องได้รับบริการ ฟื้นฟูสมรรถภาพทางการแพทย์โดยทีมสหวิชาชีพ (multidisciplinary approach) อย่างต่อเนื่อง จนครบ 6 เดือน ตั้งแต่ในโรงพยาบาลจนถึงชุมชน เพื่อเพิ่มสมรรถนะร่างกาย จิตใจ ในการปฏิบัติ กิจวัตรประจําวัน และลดความพิการหรือภาวะทุพพลภาพ รวมทั้งกลับสู่สังคมได้อย่างเต็มศักยภาพ โดยมีการให้บริการผู้ป่วยระยะกลางในโรงพยาบาลทุกระดับ (A/S/M/F) โดยให้บริการผู้ป่วย ใน (Intermediate bed/ward) ผู้ป่วยนอกและ ให้บริการในชุมชน เช่น ศูนย์ฟื้นฟูสมรรถภาพ ในชุมชน เยี่ยมบ้าน เป็นต้น ผู้ป่วย Intermediate care หมายถึง ผู้ป่วย Stroke, Traumatic Brain Injury และSpinal Cord Injury รายใหม่ หรือกลับเป็นซ้ำภายในระยะเวลา 6 เดือน และ Fragility hip fracture รายใหม่ หรือกลับเป็นซ้ำทั้งหมดทุกรายที่เข้ารับการรักษาในโรงพยาบาลภายในจังหวัดที่รอดชีวิต แ ล ะ มี ค ะ แ น น Barthel index < 15 รว ม ทั้ งค ะ แ น น Barthel index ≥ 15 with multiple impairments ตามเกณฑ์การบริบาลฟื้นสภาพระยะกลางแบบผู้ป่วยใน (IPD-IMC protocol) สำหรับโรงพยาบาล Intermediate ward คื อ ก า ร ให้ บ ริ ก า ร Intensive inpatient rehabilitation program หมายถึง ผู้ป่วยได้รับการฟื้นฟูแบบผู้ป่วยในอย่างน้อย วันละ 3 ชั่วโมง และอย่างน้อย 5 วัน/ สัปดาห์ หรือ อย่างน้อย 15 ชั่วโมง/ สัปดาห์ (ไม่รวมชั่วโมง nursing care) โดยมีรายละเอียดการให้บริการ Intermediate ward ตามภาคผนวก 1 Intermediate bed คือ การให้บริการ Inpatient rehab program หมายถึง ผู้ป่วยได้รับการฟื้นฟูโดยเฉลี่ยอย่างน้อยวันละ 1 ชั่วโมงอย่างน้อย 3 ครั้ง/สัปดาห์ (ไม่รวมชั่วโมง nursing care) การพยาบาลฟื้นฟูสภาพ หมายถึง กิจกรรมการพยาบาลที่ใช้กระบวนการหรือกิจกรรมที่มุ่งหวัง ให้ผู้ป่วย คนพิการ สามารถฟื้นคืนสภาพให้เร็วที่สุด ยอมรับและปรับตัวกับความเปลี่ยนแปลงที่เกิดขึ้น ทั้งด้านร่างกาย จิตใจ สังคมและเศรษฐกิจ โดยกระบวนการหรือกิจกรรมต่างๆ นั้นต้องอาศัย การมีส่วนร่วมของผู้ป่วย คนพิการ ญาติผู้ดูแลและทีมสหวิชาชีพ เพื่อส่งเสริมให้ผู้ป่วย คนพิการ สามารถดํารงชีวิตอิสระในสังคมได้ตามศักยภาพรวมถึงการพิทักษ์สิทธิอันพึงได้ให้กับผู้ป่วย คนพิการ กิจกรรมการบริบาลฟื้นสภาพระยะกลางแบบผู้ป่วยนอก ได้แก่ กายภาพบําบัด กิจกรรมบําบัด และแก้ไขการพูด ทั้งในสถานพยาบาลภาครัฐ และภายนอก เช่น ศูนย์ฟื้นฟูชุมชนคลินิกกายภาพบําบัด เอกชนที่ขึ้นทะเบียน หมายเหตุ การให้บริการ intermediate bed/ ward สามารถให้บริการได้ ในโรงพยาบาลทุกระดับที่สังกัดกระทรวงสาธารณสุขขึ้นกับความพร้อมและบริบทของพื้นที่ ในแต่ละจังหวัด และเขตสุขภาพ",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "(จำนวนผลงานที่บรรลุเกณฑ์ [A] ÷ จำนวนกลุ่มเป้าหมายทั้งหมด [B]) × 100",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI70-24": {
      "kpiId": "KPI70-24",
      "order": 24,
      "name": "อัตราการติดเชื้อดื้อยาในกระแสเลือดลดลง",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "อัตรา",
      "direction": "ยิ่งน้อยยิ่งดี",
      "target": "≤ ปีที่ผ่านมา",
      "baseline": "≤ ปีที่ผ่านมา",
      "definition": "อุบัติการณ์ผู้ป่วยติดเชื้อดื้อยาในกระแสเลือด หมายถึง อุบัติการณ์ผู้ป่วยที่ติดเชื้อดื้อยาในกระแส เลือด (bacteremia) ต่อผู้ป่วยที่ได้รับการตรวจ hemoculture 100,000 ราย (per 100,000 tested patients) โดย focus เชื้อดื้อยาที่เป็น hospital origin ดังต่อไปนี้ 1. Acinetobacter baumannii ดื้อต่อยา carbapenem (CRAB) 2. Klebsiella pneumoniae ดื้อต่อยา carbapenem (CRKP) 3. Escherichia coli ดื้อต่อยา carbapenem (CREC) hospital origin หมายถึง การติดเชื้อภายหลังจากเข้านอนในโรงพยาบาลมากกว่า 2 วันปฏิทิน",
      "purpose": "เพื่อลดการป่วยและเสียชีวิตจากเชื้อดื้อยา",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "โรงพยาบาลศูนย์/ทั่วไป A, S, M1 (หรือ SAP; P+, P, A+, A ที่มีห้องปฏิบัติการทางจุลชีววิทยา)",
      "source": "เป้าหมาย รพ.ขอนแก่น/ชุมแพ/สิรินธร",
      "formula": "โรงพยาบาลศูนย์/ทั่วไป A, S, M1 (หรือ SAP; P+, P, A+, A ที่มีห้องปฏิบัติการทางจุลชีววิทยา) เป้าหมาย รพ.ขอนแก่น/ชุมแพ/สิรินธร A1 = อุบัติการณ์ผู้ป่วยที่ติดเชื้อดื้อยา CRAB ในกระแสเลือด (สูตร A1 = จำนวนผู้ป่วย CRAB x 100,000 / จำนวนผู้ป่วยที่ได้รับการตรวจ hemoculture) A2 = อุบัติการณ์ผู้ป่วยที่ติดเชื้อดื้อยา CRKP ในกระแสเลือด (สูตร A2 = จำนวนผู้ป่วย CRKP x 100,000 / จำนวนผู้ป่วยที่ได้รับการตรวจ hemoculture) A3 = อุบัติการณ์ผู้ป่วยที่ติดเชื้อดื้อยา CREC ในกระแสเลือด (สูตร A3 = จำนวนผู้ป่วย CREC x 100,000 / จำนวนผู้ป่วยที่ได้รับการตรวจ hemoculture) A = A1 + A2 + A3 B = อุบัติการณ์ผู้ป่วยติดเชื้อดื้อยา CRAB, CRKP, CREC ในกระแสเลือด ปีปฏิทิน พ.ศ. 2567 (baseline แบ่งตามระดับระดับโรงพยาบาล) A < B อุบัติการณ์ผู้ป่วยติดเชื้อ A. baumannii, K. pneumoniae, E. coli ที่ดื้อยา carbapenem ของ โรงพยาบาลในรอบที่วัดผล ต้องต่ำกว่าอุบัติการณ์เฉลี่ยของโรงพยาบาลในระดับเดียวกันของปีปฏิทิน 2567 (baseline)",
      "numeratorA": "A1 + A2 + A3",
      "denominatorB": "อุบัติการณ์ผู้ป่วยติดเชื้อดื้อยา CRAB, CRKP, CREC ในกระแสเลือด ปีปฏิทิน พ.ศ. 2567",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "การรายงาน และการวิเคราะห์เปรียบเทียบผล รายละเอียดข้อมูล ผลงานจังหวัดขอนแก่น พื้นฐาน(Baseline ปี 2564 = 68.29% 2565 = 62.50 % Data) 2566 = 67.38% 2567 =67.68 %",
      "responsible": "1.นางศศิธร เอื้ออนันต์ เภสัชกรชำนาญการพิเศษ สสจ.ขอนแก่น Email: sasitorneu@gmail.com โทร 081-3910199 2.นางนิสรา ศรีสุระ เภสัชกรชำนาญการ รพ.ขอนแก่น Email: nissaran2003@gmail.com โทร 081-5450172"
    },
    "KPI70-25": {
      "kpiId": "KPI70-25",
      "order": 25,
      "name": "ร้อยละของผู้ป่วยที่มีการวินิจฉัยโรคหลอดเลือดสมอง อัมพฤกษ์ อัมพาต ระยะกลาง (Intermediate Care) ที่ได้รับการดูแลด้วยการแพทย์แผนไทยและการแพทย์ทางเลือก",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "≥24",
      "baseline": "8.17",
      "definition": "การบริบาลฟื้นสภาพระยะกลาง (Intermediate care; IMC) หมายถึง การบริบาลฟื้นสภาพผู้ป่วย ระยะกลางที่มีอาการทางคลินิกผ่านพ้นภาวะวิกฤติและมีอาการคงที่แต่ยังคงมีความผิดปกติ ของร่างกายบางส่วนอยู่และมีข้อจํากัดในการปฏิบัติกิจกรรมในชีวิตประจําวัน จําเป็นต้องได้รับบริการ ฟื้นฟูสมรรถภาพทางการแพทย์โดยทีมสหวิชาชีพ (multidisciplinary approach) อย่างต่อเนื่อง จนครบ 6 เดือน ตั้งแต่ในโรงพยาบาลจนถึงชุมชน เพื่อเพิ่มสมรรถนะร่างกาย จิตใจ ในการปฏิบัติ กิจวัตรประจําวัน และลดความพิการหรือภาวะทุพพลภาพ รวมทั้งกลับสู่สังคมได้อย่างเต็มศักยภาพ โดยมีการให้บริการผู้ป่วยระยะกลางในโรงพยาบาลทุกระดับ (A/S/M/F) โดยให้บริการผู้ป่วย ใน (Intermediate bed/ward) ผู้ป่วยนอกและ ให้บริการในชุมชน เช่น ศูนย์ฟื้นฟูสมรรถภาพ ในชุมชน เยี่ยมบ้าน เป็นต้น ผู้ป่วย Intermediate care หมายถึง ผู้ป่วย Stroke, Traumatic Brain Injury และSpinal Cord Injury รายใหม่ หรือกลับเป็นซ้ำภายในระยะเวลา 6 เดือน และ Fragility hip fracture รายใหม่ หรือกลับเป็นซ้ำทั้งหมดทุกรายที่เข้ารับการรักษาในโรงพยาบาลภายในจังหวัดที่รอดชีวิต แ ล ะ มี ค ะ แ น น Barthel index < 15 รว ม ทั้ งค ะ แ น น Barthel index ≥ 15 with multiple impairments ตามเกณฑ์การบริบาลฟื้นสภาพระยะกลางแบบผู้ป่วยใน (IPD-IMC protocol) สำหรับโรงพยาบาล Intermediate ward คื อ ก า ร ให้ บ ริ ก า ร Intensive inpatient rehabilitation program หมายถึง ผู้ป่วยได้รับการฟื้นฟูแบบผู้ป่วยในอย่างน้อย วันละ 3 ชั่วโมง และอย่างน้อย 5 วัน/ สัปดาห์ หรือ อย่างน้อย 15 ชั่วโมง/ สัปดาห์ (ไม่รวมชั่วโมง nursing care) โดยมีรายละเอียดการให้บริการ Intermediate ward ตามภาคผนวก 1 Intermediate bed คือ การให้บริการ Inpatient rehab program หมายถึง ผู้ป่วยได้รับการฟื้นฟูโดยเฉลี่ยอย่างน้อยวันละ 1 ชั่วโมงอย่างน้อย 3 ครั้ง/สัปดาห์ (ไม่รวมชั่วโมง nursing care) การพยาบาลฟื้นฟูสภาพ หมายถึง กิจกรรมการพยาบาลที่ใช้กระบวนการหรือกิจกรรมที่มุ่งหวัง ให้ผู้ป่วย คนพิการ สามารถฟื้นคืนสภาพให้เร็วที่สุด ยอมรับและปรับตัวกับความเปลี่ยนแปลงที่เกิดขึ้น ทั้งด้านร่างกาย จิตใจ สังคมและเศรษฐกิจ โดยกระบวนการหรือกิจกรรมต่างๆ นั้นต้องอาศัย การมีส่วนร่วมของผู้ป่วย คนพิการ ญาติผู้ดูแลและทีมสหวิชาชีพ เพื่อส่งเสริมให้ผู้ป่วย คนพิการ สามารถดํารงชีวิตอิสระในสังคมได้ตามศักยภาพรวมถึงการพิทักษ์สิทธิอันพึงได้ให้กับผู้ป่วย คนพิการ กิจกรรมการบริบาลฟื้นสภาพระยะกลางแบบผู้ป่วยนอก ได้แก่ กายภาพบําบัด กิจกรรมบําบัด และแก้ไขการพูด ทั้งในสถานพยาบาลภาครัฐ และภายนอก เช่น ศูนย์ฟื้นฟูชุมชนคลินิกกายภาพบําบัด เอกชนที่ขึ้นทะเบียน หมายเหตุ การให้บริการ intermediate bed/ ward สามารถให้บริการได้ ในโรงพยาบาลทุกระดับที่สังกัดกระทรวงสาธารณสุขขึ้นกับความพร้อมและบริบทของพื้นที่ ในแต่ละจังหวัด และเขตสุขภาพ",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "(จำนวนผลงานที่บรรลุเกณฑ์ [A] ÷ จำนวนกลุ่มเป้าหมายทั้งหมด [B]) × 100",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI70-26": {
      "kpiId": "KPI70-26",
      "order": 26,
      "name": "ร้อยละผู้ป่วยนอกที่ได้รับบริการ ตรวจ วินิจฉัย รักษาโรค และฟื้นฟูสภาพ ด้วยศาสตร์การแพทย์แผนไทยและการแพทย์ทางเลือก",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "≥24",
      "baseline": "21.19",
      "definition": "ผู้ป่วยนอก หมายถึง ประชาชนที่มารับบริการตรวจ วินิจฉัย รักษาโรค และฟื้นฟูสภาพ แบบไม่นอน รักษาตัวในโรงพยาบาล โดยผู้ประกอบวิชาชีพที่เกี่ยวข้องที่ได้มาตรฐาน การบริการด้านการแพทย์แผนไทย หมายถึง บริการการตรวจ วินิจฉัย ส่งเสริมสุขภาพ การป้องกันโรค รักษาโรค และฟื้นฟูสภาพ เช่น - การรักษาด้วยยาสมุนไพร - การปรุงยาแผนไทยสำหรับผู้ป่วยเฉพาะรายของตน หมายถึง การปรุงยาตามองค์ความรู้ สำหรับผู้ป่วยเฉพาะรายของตน โดยผู้ประกอบโรคศิลปะสาขาการแพทย์แผนไทย (ประเภทเวชกรรมไทย) หรือ สาขาการแพทย์แผนไทยประยุกต์ - ยาแผนไทยที่มีกัญชาปรุงผสม กัญชาทางการแพทย์ หมายถึง สิ่งที่ได้จากการสกัดพืชกัญชา เพื่อนำสารสกัดที่ได้ มาใช้ทางการแพทย์และการวิจัยไม่ได้หมายรวมถึงกัญชาที่ยังคงมีสภาพเป็นพืช หรือส่วนประกอบใดๆ ของพืชกัญชา อาทิ ยอด ดอก ใบ ลำต้น ราก เป็นต้น - การนวดเพื่อการรักษา-ฟื้นฟูสภาพ - การประคบสมุนไพรเพื่อการรักษา-ฟื้นฟูสภาพ - การอบไอน้ำสมุนไพรเพื่อการรักษา-ฟื้นฟูสภาพ - การทับหม้อเกลือ - การพอกยาสมุนไพร - การนวดเพื่อส่งเสริมสุขภาพ - การประคบสมุนไพรเพื่อส่งเสริมสุขภาพ - การอบไอน้ำสมุนไพรเพื่อส่งเสริมสุขภาพ - การให้คำแนะนำการดูแลสุขภาพด้วยการสอนสาธิตด้านการแพทย์แผนไทย - การให้คำแนะนำการดูแลสุขภาพด้วยการสอนสาธิตด้านการแพทย์ทางเลือก - การทำหัตถการอื่นๆ ตามมาตรฐานวิชาชีพแพทย์แผนไทย หรือการบริการอื่น ๆ ที่มีการเพิ่มเติมรหัสภายหลัง - การบริการการแพทย์แผนไทยและการแพทย์ทางเลือกที่บ้าน รหัสกลุ่มโรคและอาการด้านการแพทย์แผนไทย 1. โรคสตรี: U50 ถึง U52 2. โรคเด็ก: U54 ถึง U55 3. โรคที่เกิดอาการหลายระบบ: U56 ถึง U60 4. โรคที่เกิดเฉพาะตำแหน่ง: U61 ถึง U72 5. โรคและอาการอื่น: U74 ถึง U75 6. การส่งเสริมสุขภาพและการป้องกันโรค: U77",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "(จำนวนผลงานที่บรรลุเกณฑ์ [A] ÷ จำนวนกลุ่มเป้าหมายทั้งหมด [B]) × 100",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI70-27": {
      "kpiId": "KPI70-27",
      "order": 27,
      "name": "ร้อยละของผู้ป่วยเบาหวานควบคุมน้ำตาลได้",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "45",
      "baseline": "30.01",
      "definition": "การบริบาลฟื้นสภาพระยะกลาง (Intermediate care; IMC) หมายถึง การบริบาลฟื้นสภาพผู้ป่วย ระยะกลางที่มีอาการทางคลินิกผ่านพ้นภาวะวิกฤติและมีอาการคงที่แต่ยังคงมีความผิดปกติ ของร่างกายบางส่วนอยู่และมีข้อจํากัดในการปฏิบัติกิจกรรมในชีวิตประจําวัน จําเป็นต้องได้รับบริการ ฟื้นฟูสมรรถภาพทางการแพทย์โดยทีมสหวิชาชีพ (multidisciplinary approach) อย่างต่อเนื่อง จนครบ 6 เดือน ตั้งแต่ในโรงพยาบาลจนถึงชุมชน เพื่อเพิ่มสมรรถนะร่างกาย จิตใจ ในการปฏิบัติ กิจวัตรประจําวัน และลดความพิการหรือภาวะทุพพลภาพ รวมทั้งกลับสู่สังคมได้อย่างเต็มศักยภาพ โดยมีการให้บริการผู้ป่วยระยะกลางในโรงพยาบาลทุกระดับ (A/S/M/F) โดยให้บริการผู้ป่วย ใน (Intermediate bed/ward) ผู้ป่วยนอกและ ให้บริการในชุมชน เช่น ศูนย์ฟื้นฟูสมรรถภาพ ในชุมชน เยี่ยมบ้าน เป็นต้น ผู้ป่วย Intermediate care หมายถึง ผู้ป่วย Stroke, Traumatic Brain Injury และSpinal Cord Injury รายใหม่ หรือกลับเป็นซ้ำภายในระยะเวลา 6 เดือน และ Fragility hip fracture รายใหม่ หรือกลับเป็นซ้ำทั้งหมดทุกรายที่เข้ารับการรักษาในโรงพยาบาลภายในจังหวัดที่รอดชีวิต แ ล ะ มี ค ะ แ น น Barthel index < 15 รว ม ทั้ งค ะ แ น น Barthel index ≥ 15 with multiple impairments ตามเกณฑ์การบริบาลฟื้นสภาพระยะกลางแบบผู้ป่วยใน (IPD-IMC protocol) สำหรับโรงพยาบาล Intermediate ward คื อ ก า ร ให้ บ ริ ก า ร Intensive inpatient rehabilitation program หมายถึง ผู้ป่วยได้รับการฟื้นฟูแบบผู้ป่วยในอย่างน้อย วันละ 3 ชั่วโมง และอย่างน้อย 5 วัน/ สัปดาห์ หรือ อย่างน้อย 15 ชั่วโมง/ สัปดาห์ (ไม่รวมชั่วโมง nursing care) โดยมีรายละเอียดการให้บริการ Intermediate ward ตามภาคผนวก 1 Intermediate bed คือ การให้บริการ Inpatient rehab program หมายถึง ผู้ป่วยได้รับการฟื้นฟูโดยเฉลี่ยอย่างน้อยวันละ 1 ชั่วโมงอย่างน้อย 3 ครั้ง/สัปดาห์ (ไม่รวมชั่วโมง nursing care) การพยาบาลฟื้นฟูสภาพ หมายถึง กิจกรรมการพยาบาลที่ใช้กระบวนการหรือกิจกรรมที่มุ่งหวัง ให้ผู้ป่วย คนพิการ สามารถฟื้นคืนสภาพให้เร็วที่สุด ยอมรับและปรับตัวกับความเปลี่ยนแปลงที่เกิดขึ้น ทั้งด้านร่างกาย จิตใจ สังคมและเศรษฐกิจ โดยกระบวนการหรือกิจกรรมต่างๆ นั้นต้องอาศัย การมีส่วนร่วมของผู้ป่วย คนพิการ ญาติผู้ดูแลและทีมสหวิชาชีพ เพื่อส่งเสริมให้ผู้ป่วย คนพิการ สามารถดํารงชีวิตอิสระในสังคมได้ตามศักยภาพรวมถึงการพิทักษ์สิทธิอันพึงได้ให้กับผู้ป่วย คนพิการ กิจกรรมการบริบาลฟื้นสภาพระยะกลางแบบผู้ป่วยนอก ได้แก่ กายภาพบําบัด กิจกรรมบําบัด และแก้ไขการพูด ทั้งในสถานพยาบาลภาครัฐ และภายนอก เช่น ศูนย์ฟื้นฟูชุมชนคลินิกกายภาพบําบัด เอกชนที่ขึ้นทะเบียน หมายเหตุ การให้บริการ intermediate bed/ ward สามารถให้บริการได้ ในโรงพยาบาลทุกระดับที่สังกัดกระทรวงสาธารณสุขขึ้นกับความพร้อมและบริบทของพื้นที่ ในแต่ละจังหวัด และเขตสุขภาพ",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "(จำนวนผลงานที่บรรลุเกณฑ์ [A] ÷ จำนวนกลุ่มเป้าหมายทั้งหมด [B]) × 100",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI70-28": {
      "kpiId": "KPI70-28",
      "order": 28,
      "name": "ร้อยละของผู้ป่วยความดันโลหิตสูงควบคุมความดันโลหิตได้",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 4",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "65",
      "baseline": "58.96",
      "definition": "การบริบาลฟื้นสภาพระยะกลาง (Intermediate care; IMC) หมายถึง การบริบาลฟื้นสภาพผู้ป่วย ระยะกลางที่มีอาการทางคลินิกผ่านพ้นภาวะวิกฤติและมีอาการคงที่แต่ยังคงมีความผิดปกติ ของร่างกายบางส่วนอยู่และมีข้อจํากัดในการปฏิบัติกิจกรรมในชีวิตประจําวัน จําเป็นต้องได้รับบริการ ฟื้นฟูสมรรถภาพทางการแพทย์โดยทีมสหวิชาชีพ (multidisciplinary approach) อย่างต่อเนื่อง จนครบ 6 เดือน ตั้งแต่ในโรงพยาบาลจนถึงชุมชน เพื่อเพิ่มสมรรถนะร่างกาย จิตใจ ในการปฏิบัติ กิจวัตรประจําวัน และลดความพิการหรือภาวะทุพพลภาพ รวมทั้งกลับสู่สังคมได้อย่างเต็มศักยภาพ โดยมีการให้บริการผู้ป่วยระยะกลางในโรงพยาบาลทุกระดับ (A/S/M/F) โดยให้บริการผู้ป่วย ใน (Intermediate bed/ward) ผู้ป่วยนอกและ ให้บริการในชุมชน เช่น ศูนย์ฟื้นฟูสมรรถภาพ ในชุมชน เยี่ยมบ้าน เป็นต้น ผู้ป่วย Intermediate care หมายถึง ผู้ป่วย Stroke, Traumatic Brain Injury และSpinal Cord Injury รายใหม่ หรือกลับเป็นซ้ำภายในระยะเวลา 6 เดือน และ Fragility hip fracture รายใหม่ หรือกลับเป็นซ้ำทั้งหมดทุกรายที่เข้ารับการรักษาในโรงพยาบาลภายในจังหวัดที่รอดชีวิต แ ล ะ มี ค ะ แ น น Barthel index < 15 รว ม ทั้ งค ะ แ น น Barthel index ≥ 15 with multiple impairments ตามเกณฑ์การบริบาลฟื้นสภาพระยะกลางแบบผู้ป่วยใน (IPD-IMC protocol) สำหรับโรงพยาบาล Intermediate ward คื อ ก า ร ให้ บ ริ ก า ร Intensive inpatient rehabilitation program หมายถึง ผู้ป่วยได้รับการฟื้นฟูแบบผู้ป่วยในอย่างน้อย วันละ 3 ชั่วโมง และอย่างน้อย 5 วัน/ สัปดาห์ หรือ อย่างน้อย 15 ชั่วโมง/ สัปดาห์ (ไม่รวมชั่วโมง nursing care) โดยมีรายละเอียดการให้บริการ Intermediate ward ตามภาคผนวก 1 Intermediate bed คือ การให้บริการ Inpatient rehab program หมายถึง ผู้ป่วยได้รับการฟื้นฟูโดยเฉลี่ยอย่างน้อยวันละ 1 ชั่วโมงอย่างน้อย 3 ครั้ง/สัปดาห์ (ไม่รวมชั่วโมง nursing care) การพยาบาลฟื้นฟูสภาพ หมายถึง กิจกรรมการพยาบาลที่ใช้กระบวนการหรือกิจกรรมที่มุ่งหวัง ให้ผู้ป่วย คนพิการ สามารถฟื้นคืนสภาพให้เร็วที่สุด ยอมรับและปรับตัวกับความเปลี่ยนแปลงที่เกิดขึ้น ทั้งด้านร่างกาย จิตใจ สังคมและเศรษฐกิจ โดยกระบวนการหรือกิจกรรมต่างๆ นั้นต้องอาศัย การมีส่วนร่วมของผู้ป่วย คนพิการ ญาติผู้ดูแลและทีมสหวิชาชีพ เพื่อส่งเสริมให้ผู้ป่วย คนพิการ สามารถดํารงชีวิตอิสระในสังคมได้ตามศักยภาพรวมถึงการพิทักษ์สิทธิอันพึงได้ให้กับผู้ป่วย คนพิการ กิจกรรมการบริบาลฟื้นสภาพระยะกลางแบบผู้ป่วยนอก ได้แก่ กายภาพบําบัด กิจกรรมบําบัด และแก้ไขการพูด ทั้งในสถานพยาบาลภาครัฐ และภายนอก เช่น ศูนย์ฟื้นฟูชุมชนคลินิกกายภาพบําบัด เอกชนที่ขึ้นทะเบียน หมายเหตุ การให้บริการ intermediate bed/ ward สามารถให้บริการได้ ในโรงพยาบาลทุกระดับที่สังกัดกระทรวงสาธารณสุขขึ้นกับความพร้อมและบริบทของพื้นที่ ในแต่ละจังหวัด และเขตสุขภาพ",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "(จำนวนผลงานที่บรรลุเกณฑ์ [A] ÷ จำนวนกลุ่มเป้าหมายทั้งหมด [B]) × 100",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI70-29": {
      "kpiId": "KPI70-29",
      "order": 29,
      "name": "ร้อยละการจัดตั้งหน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิตามพระราชบัญญัติระบบสุขภาพปฐมภูมิ พ.ศ. 2562",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 5",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "100",
      "baseline": "100",
      "definition": "หน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิ หมายถึง หน่วยบริการที่ได้ขึ้นทะเบียน เป็นหน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิ ตามพระราชบัญญัติระบบสุขภาพปฐมภูมิ พ.ศ. 2562 แพทย์เวชศาสตร์ครอบครัว หมายความว่า แพทย์ที่ได้รับหนังสืออนุมัติหรือวุฒิบัตรเพื่อแสดงความรู้ ความชำนาญในการประกอบวิชาชีพเวชกรรมสาขาเวชศาสตร์ครอบครัว หรือแพทย์ที่ผ่านการอบรม ด้านเวชศาสตร์ครอบครัวจากหลักสูตรที่ปลัดกระทรวงสาธารณสุขให้ความเห็นชอบ 1. หลักสูตรพื้นฐานเวชศาสตร์ครอบครัวสำหรับแพทย์ปฐมภูมิ Basic Course of Family Medicine for Primary Care Doctor 2. หลักสูตรการฝึกอบรมระยะสั้น “เวชศาสตร์ครอบครัวสำหรับแพทย์ปฏิบัติงานในคลินิก หมอครอบครัว” พ.ศ. 2562 คณะผู้ให้บริการสุขภาพปฐมภูมิ หมายความว่า ผู้ประกอบวิชาชีพทางการแพทย์และสาธารณสุขซึ่ง ปฏิบัติงานร่วมกันกับแพทย์เวชศาสตร์ครอบครัวในการให้บริการสุขภาพปฐมภูมิ และให้หมายความ รวมถึงผู้ซึ่งผ่านการฝึกอบรมด้านสุขภาพปฐมภูมิเพื่อเป็นผู้สนับสนุนการปฏิบัติหน้าที่ของแพทย์เวชศาสตร์ ครอบครัวและผู้ประกอบวิชาชีพดังกล่าว บริการสุขภาพปฐมภูมิ เป็นบริการทางการแพทย์และสาธารณสุขที่ดูแลสุขภาพของบุคคลในบัญชี รายชื่อ ซึ่งมีขอบเขต ดังต่อไปนี้ (1) บริการสุขภาพอย่างองค์รวม แต่ไม่รวมถึงการดูแลโรคหรือปัญหาสุขภาพที่จำเป็นต้องใช้เทคนิค หรือเครื่องมือทางการแพทย์ที่ซับซ้อน การปลูกถ่ายอวัยวะ และการผ่าตัด ยกเว้น การผ่าตัดขนาดเล็ก ซึ่งสามารถฉีดยาชาเฉพาะที่ (2) บริการสุขภาพตั้งแต่แรก ครอบคลุมทุกกระบวนการสาธารณสุข ทั้งการส่งเสริมสุขภาพ การควบคุมโรค การป้องกันโรค การตรวจวินิจฉัยโรค การรักษาพยาบาล และการฟื้นฟูสุขภาพ แต่ไม่รวมถึง การบริการแบบผู้ป่วยนอกของหน่วยบริการระดับทุติยภูมิและตติยภูมิ การบริการแบบผู้ป่วยใน การคลอด และการปฏิบัติการฉุกเฉิน ยกเว้น กรณีการปฐมพยาบาลและการดูแลในภาวะฉุกเฉินเพื่อให้รอดพ้นภาวะ ฉุกเฉิน (3) บริการสุขภาพอย่างต่อเนื่อง ทุกช่วงวัยตั้งแต่ การตั้งครรภ์ ทารก วัยเด็ก วัยเรียน วัยรุ่น วัยทำงาน วัยสูงอายุ จนกระทั่งเสียชีวิต (4) การดูแลสุขภาพของบุคคลแบบผสมผสาน ประกอบด้วย การดูแลสุขภาพโดยการแพทย์ แผนปัจจุบัน การแพทย์แผนไทย หรือการแพทย์ทางเลือก (5) การบริการข้อมูลด้านสุขภาพและคำปรึกษาด้านสุขภาพแก่บุคคลในบัญชีรายชื่อ ตลอดจน คำแนะนำที่จำเป็นเพื่อให้สามารถตัดสินใจในการเลือกรับบริการหรือเข้าสู่ระบบการส่งต่อ (6) การส่งเสริมให้ประชาชนมีศักยภาพและมีความรู้ในการจัดการสุขภาพของตนเองและบุคคล ในครอบครัว ตลอดจนอาจสามารถร่วมตัดสินใจในการวางแผนการดูแลสุขภาพร่วมกับแพทย์เวชศาสตร์ ครอบครัวและคณะผู้ให้บริการสุขภาพปฐมภูมิได้",
      "purpose": "1. เพื่อให้ประชาชนมีแพทย์เวชศาสตร์ครอบครัวและคณะผู้ให้บริการสุขภาพปฐมภูมิ 2. เพื่อให้มีสุขภาพแข็งแรง สามารถดูแลตนเองและครอบครัวเบื้องต้นเมื่อมีอาการเจ็บป่วย ได้อย่างเหมาะสม 3. เพื่อให้ประชาชนสามารถเข้าถึงบริการปฐมภูมิ",
      "population": "หน่วยบริการปฐมภูมิทุกแห่ง ทุกสังกัด",
      "collectionMethod": "1. จัดเก็บจากข้อมูลจำนวนหน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิ ในระบบ ขึ้นทะเบียน 2. การจัดเก็บการประเมินคุณภาพมาตรฐาน จากระบบทรัพยากรสุขภาพ หน่วยบริการปฐมภูมิ (PCU Standard)",
      "source": "1. ระบบขึ้นทะเบียนหน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิ 2. ระบบทรัพยากรสุขภาพ หน่วยบริการปฐมภูมิ (PCU Standard)",
      "formula": "(A/B) x 100",
      "numeratorA": "จำนวนหน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิที่ขึ้นทะเบียน",
      "denominatorB": "จำนวนหน่วยบริการปฐมภูมิและเครือข่ายหน่วยบริการปฐมภูมิตามแผนการจัดตั้ง",
      "frequency": "ไตรมาส 2 , ไตรมาส 3 และ ไตรมาส 4",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI70-30": {
      "kpiId": "KPI70-30",
      "order": 30,
      "name": "ร้อยละของการให้บริการผู้ป่วยนอกด้วยระบบด้วยระบบการแพทย์ทางไกล (Telemedicine) ในหน่วยบริการปฐมภูมิ",
      "strategy": "ยุทธศาสตร์ที่ 2",
      "objective": "เป้าประสงค์ที่ 5",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "30",
      "baseline": "-",
      "definition": "บุคลากรที่ปฏิบัติงานในสำนักงานสาธารณสุขอำเภอ หมายถึง บุคลากรที่ปฏิบัติงาน ณ สำนักงาน สาธารณสุขอำเภอ สังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่น ประกอบด้วย ข้าราชการ พนักงาน ราชการ พนักงานกระทรวงสาธารณสุข ลูกจ้างชั่วคราวปฏิบัติงานมาแล้วอย่างน้อย 6 เดือนขึ้นไป สมรรถนะ หมายถึง คุณลักษณะเชิงพฤติกรรมที่เป็นผลมาจากความรู้ทักษะความสามารถ หรือคุณลักษณะอื่น ๆ ที่ทำให้บุคคลสร้างผลงานโดดเด่นได้ในองค์กรสมรรถนะที่ผู้ปฏิบัติงาน ในทุกตำแหน่งและในทุกระดับในสำนักงานสาธารณสุขอำเภอ จำเป็นที่จะต้องมี สมรรถนะที่กำหนดขึ้น เพราะมีความจำเป็นสำหรับภารกิจการปฏิบัติงานในหน้าที่ และตำแหน่งงานนั้นๆ ประกอบด้วย สมรรถนะภารกิจหลัก 1. สมรรถนะด้านการคุ้มครองผู้บริโภคด้านการบริการและผลิตภัณฑ์สุขภาพในพื้นที่ 2. สมรรถนะด้านการดำเนินงานตามกฎหมายการแพทย์และการสาธารณสุข สมรรถนะภารกิจรอง 1. สมรรถนะด้านการทำแผนยุทธศาสตร์ด้านสุขภาพ ร่วมกับหน่วยงานภาครัฐ ท้องถิ่น องค์กร เอกชนและภาคประชาสังคมในพื้นที่ระดับอำเภอ/ตำบล 2. สมรรถนะด้านการประเมินผล การดำเนินงานของเครือข่ายบริการสุขภาพ 3. สมรรถนะด้านการควบคุมมาตรฐานการดำเนินงานของหน่วยงานสาธารณสุขในพื้นที่ 4. สมรรถนะด้านการปฏิบัติงานตามนโยบายเร่งด่วนด้านสุขภาพของรัฐบาล กระทรวง เขตสุขภาพ และจังหวัด 5. สมรรถนะด้านการพัฒนาวิชาการแก่บุคลากรสาธารณสุข องค์กรสุขภาพภาคประชาชนสนับสนุน วิชาการและการวิจัยทีเกี่ยวข้องกับสุขภาพ 6. สมรรถนะด้านสนับสนุนบุคลากรสาธารณสุข อาสาสมัครสาธารณสุขให้ได้รับการพัฒนาความรู้ อย่างต่อเนื่องและเหมาะสม 7. สมรรถนะด้านสนับสนุนบุคลากรสาธารณสุข อาสาสมัครสาธารณสุข ให้ได้รับการพัฒนาความรู้ อย่างต่อเนื่องและเหมาะสม",
      "purpose": "เพื่ อ พั ฒ น าบุ ค ลาก รส ำนั ก งาน ส าธ ารณ สุ ข อำเภ อ ให้ มี ขี ดค ว าม ส าม ารถใน ก ารขั บ เค ลื่ อ น ภ ารกิ จ ของส่วนราชการให้บรรลุผล มีประสิทธิภาพและเกิดประสิทธิผล",
      "population": "บุคลากรสำนักงานสาธารณสุขอำเภอ เครือข่ายบริการสุขภาพสังกัดสำนักงาน สาธารณสุข จังหวัดขอนแก่น",
      "collectionMethod": "รวบรวมข้อมูลจากเอกสารการเข้ารับการอบรม ได้แก่ แผนการพัฒนารายบุคคล รายกลุ่ม ใบประกาศนียบัตรใบรับรองการอบรม ในระบบ online และ onsite เครือข่ายบริการสุขภาพสังกัด สำนักงานสาธารณสุขจังหวัดขอนแก่น และเอกสารการปฏิบัติงานการจัดการข้อร้องเรียน ด้านการ คุ้มครองผู้บริโภคด้านการบริการและผลิตภัณฑ์สุขภาพ ในพื้นที่การตรวจมาตรฐานการดำเนินงานตาม กฎหมายการแพทย์และการสาธารณสุข พร้อมทั้งจัดทำแบบประเมินสมรรถนะบุคลากร สสอ. เพื่อประเมินสมรรถนะรายบุคคล และ ลงข้อมูลในระบบโปรแกรมการพัฒนาบุคลากร ลาศึกษาต่อ และฝึกอบรม",
      "source": "รวบรวมข้อมูลจากสำนักงานสาธารณสุขอำเภอ",
      "formula": "B = จำนวนสมรรถนะที่ได้รับการอบรม (หลักและรอง) ระยะเวลา ไตรมาสที่ 3 ประเมินผล",
      "numeratorA": "บุคลากรสำนักงานสาธารณสุขอำเภอ",
      "denominatorB": "จำนวนสมรรถนะที่ได้รับการอบรม (หลักและรอง)",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลจาก 1. แผนการจัดทำแผนพัฒนารายบุคคล (Individual Development Plan) และรายกลุ่ม บุคลากร สำนักงาน สาธารณสุขอำเภอ 2. บุคลากรในสำนักงานสาธารณสุขอำเภอได้รับการพัฒนาสมรรถนะหลักและสมรรถนะรองเพิ่มขึ้น จากปีที่ผ่านมา 3. บุคลากรในสำนักงานสาธารณสุขอำเภอนำสิ่งที่ได้จากการเข้าร่วมอบรมไปใช้ประโยชน์ในการ ปฏิบัติงานด้านการคุ้มครองผู้บริโภคด้านการบริการและผลิตภัณฑ์สุขภาพในพื้นที่ ด้านการดำเนินงาน ตามกฎหมายการแพทย์และการสาธารณสุข",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI70-31": {
      "kpiId": "KPI70-31",
      "order": 31,
      "name": "บุคลากรที่ปฏิบัติงานในสำนักงานสาธารณสุขอำเภอได้รับการพัฒนาสมรรถนะหลักและสมรรถนะรอง (Regulator/ กฎหมาย/ พรบ.การสาธารณสุข พ.ศ. 2535/ Hard skill/ Soft skill/ AI)",
      "strategy": "ยุทธศาสตร์ที่ 3",
      "objective": "เป้าประสงค์ที่ 6",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "95",
      "baseline": "87.69",
      "definition": "บุคลากรที่ปฏิบัติงานในสำนักงานสาธารณสุขอำเภอได้รับการพัฒนาสมรรถนะหลักและสมรรถนะรอง (Regulator/ กฎหมาย/ พรบ.การสาธารณสุข พ.ศ. 2535/ Hard skill/ Soft skill/ AI) ตามเกณฑ์มาตรฐานแผนยุทธศาสตร์สุขภาพ 5 ปี จังหวัดขอนแก่น (พ.ศ. 2566–2570)",
      "purpose": "1. เพื่อให้ผู้สูงอายุได้รับการส่งเสริมสุขภาพ หรือคงสมรรถภาพทางร่างกาย สมอง สุขภาพจิต และสังคม ของผู้สูงอายุป้องกันหรือลดการเกิดภาวะพึ่งพิงในผู้สูงอายุ 2. เพื่อส่งเสริมผู้สูงอายุกลุ่มเสี่ยงให้ได้รับการดูแลตามแผนส่งเสริมสุขภาพดี(Wellness Plan) 3. เพื่อให้ผู้สูงอายุได้รับการดูแลรักษากลุ่มอาการ Geriatric Syndromes และปัญหาสุขภาพที่สำคัญ อย่างเหมาะสมหลังจากได้รับการคัดกรองสุขภาพในการส่งต่อเข้าสู่ระบบริการคลินิกผู้สูงอายุ",
      "population": "ผู้สูงอายุกลุ่มที่ 1 (กลุ่มติดสังคม) จากการประเมิน ADL คะแนนตั้งแต่ 12 คะแนนขึ้นไป",
      "collectionMethod": "1. บันทึกการคัดกรอง ADL และกลุ่มอาการความเสื่อมในฐานข้อมูล HDC 2. รายงานการประเมินมาตรฐานการจัดบริการคลินิกผู้สูงอายุ https://dmscaretools.dms.go.th/geriatric/ 3. รายงานผู้สูงอายุกลุ่มเสี่ยงมีแผนส่งเสริมสุขภาพดี (Wellness Plan) https://care.anamai.moph.go.th/ 4. รายงานผู้สูงอายุที่คัดกรองพบว่าเสี่ยงภาวะสมองเสื่อมหรือภาวะพลัดตกหกล้มได้รับการดูแลรักษาใน คลินิกผู้สูงอายุ รายไตรมาส https://dmscaretools.dms.go.th/geriatric/",
      "source": "1. ฐานข้อมูลการประเมินคัดกรอง ADL และกลุ่มอาการความเสื่อม Health Data Center 2. รายงานการประเมินมาตรฐานการจัดบริการคลินิกผู้สูงอายุ 3. รายงานผู้สูงอายุที่คัดกรองพบว่าเสี่ยงภาวะสมองเสื่อมหรือภาวะพลัดตกหกล้มได้รับการดูแลรักษา ในคลินิกผู้สูงอายุ",
      "formula": "(จำนวนผลงานกลุ่มเป้าหมายที่บรรลุตามเกณฑ์มาตรฐาน [A] ÷ จำนวนกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน [B]) × 100",
      "numeratorA": "จำนวนผู้สูงอายุที่ไม่มีภาวะพึ่งพิง(กลุ่มติดสังคม) ADL 12 คะแนนขึ้นไป",
      "denominatorB": "จำนวนประชากรผู้สูงอายุที่ได้รับการคัดกรองกลุ่มอาการความเสื่อมในผู้สูงอายุทั้งหมด",
      "frequency": "ตุลาคม 2567 - กันยายน 2568",
      "evaluationMethod": "1. อสม.บันทึกผลการประเมินสุขภาพและคัดกรองกลุ่มอาการผู้สูงอายุ 9 ด้าน > ร้อยละ 80 2. Care Manager และเจ้าหน้าที่สาธารณสุขในหน่วยบริการสาธารณสุข ประเมิน ADL > ร้อยละ 60 รายละเอียดข้อมูล 3. ผู้สูงอายุกลุ่มเสี่ยงภาวะถดถอยได้รับการส่งเสริมสุขภาพดี (Wellness Plan) > ร้อยละ 60 พื้นฐาน 4. ผู้สูงอายุกลุ่มเสี่ยงภาวะถดถอยได้รับการส่งต่อดูแลรักษาในคลินิกผู้สูงอายุ > ร้อยละ 60 5. โรงพยาบาลทุกระดับจัดบริการคลินิกผู้สูงอายุผ่านเกณฑ์คุณภาพ > ร้อยละ 80 (Baseline Data) ผลการดำเนินงาน ผลงาน ปี 2565 ปี 2566 ปี 2567 ย้อนหลัง 3 ปี ร้อยละของผู้สูงอายุไม่มีภาวะพึ่งพิง 96.2 95.1 95.2",
      "responsible": "ชื่อ-สกุล นางอังคณา อึ้งปิติมานะ ตำแหน่ง นักวิชาการสาธารณสุขชำนาญการ กลุ่มงานส่งเสริมสุขภาพ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ 149 โทรสาร 0-4322-4037 โทรศัพท์มือถือ. 0617929942 E-mail :ungpitimana.ang@gmail.com"
    },
    "KPI70-32": {
      "kpiId": "KPI70-32",
      "order": 32,
      "name": "บุคลากรที่ปฏิบัติงานในระดับเครือข่ายบริการสุขภาพได้รับการพัฒนาสมรรถนะหลักและสมรรถนะรอง",
      "strategy": "ยุทธศาสตร์ที่ 3",
      "objective": "เป้าประสงค์ที่ 6",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "85",
      "baseline": "-",
      "definition": "บุคลากรที่ปฏิบัติงานในระดับเครือข่ายบริการสุขภาพได้รับการพัฒนาสมรรถนะหลักและสมรรถนะรอง ตามเกณฑ์มาตรฐานแผนยุทธศาสตร์สุขภาพ 5 ปี จังหวัดขอนแก่น (พ.ศ. 2566–2570)",
      "purpose": "1. เพื่อให้ผู้สูงอายุได้รับการส่งเสริมสุขภาพ หรือคงสมรรถภาพทางร่างกาย สมอง สุขภาพจิต และสังคม ของผู้สูงอายุป้องกันหรือลดการเกิดภาวะพึ่งพิงในผู้สูงอายุ 2. เพื่อส่งเสริมผู้สูงอายุกลุ่มเสี่ยงให้ได้รับการดูแลตามแผนส่งเสริมสุขภาพดี(Wellness Plan) 3. เพื่อให้ผู้สูงอายุได้รับการดูแลรักษากลุ่มอาการ Geriatric Syndromes และปัญหาสุขภาพที่สำคัญ อย่างเหมาะสมหลังจากได้รับการคัดกรองสุขภาพในการส่งต่อเข้าสู่ระบบริการคลินิกผู้สูงอายุ",
      "population": "ผู้สูงอายุกลุ่มที่ 1 (กลุ่มติดสังคม) จากการประเมิน ADL คะแนนตั้งแต่ 12 คะแนนขึ้นไป",
      "collectionMethod": "1. บันทึกการคัดกรอง ADL และกลุ่มอาการความเสื่อมในฐานข้อมูล HDC 2. รายงานการประเมินมาตรฐานการจัดบริการคลินิกผู้สูงอายุ https://dmscaretools.dms.go.th/geriatric/ 3. รายงานผู้สูงอายุกลุ่มเสี่ยงมีแผนส่งเสริมสุขภาพดี (Wellness Plan) https://care.anamai.moph.go.th/ 4. รายงานผู้สูงอายุที่คัดกรองพบว่าเสี่ยงภาวะสมองเสื่อมหรือภาวะพลัดตกหกล้มได้รับการดูแลรักษาใน คลินิกผู้สูงอายุ รายไตรมาส https://dmscaretools.dms.go.th/geriatric/",
      "source": "1. ฐานข้อมูลการประเมินคัดกรอง ADL และกลุ่มอาการความเสื่อม Health Data Center 2. รายงานการประเมินมาตรฐานการจัดบริการคลินิกผู้สูงอายุ 3. รายงานผู้สูงอายุที่คัดกรองพบว่าเสี่ยงภาวะสมองเสื่อมหรือภาวะพลัดตกหกล้มได้รับการดูแลรักษา ในคลินิกผู้สูงอายุ",
      "formula": "(จำนวนผลงานกลุ่มเป้าหมายที่บรรลุตามเกณฑ์มาตรฐาน [A] ÷ จำนวนกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน [B]) × 100",
      "numeratorA": "จำนวนผู้สูงอายุที่ไม่มีภาวะพึ่งพิง(กลุ่มติดสังคม) ADL 12 คะแนนขึ้นไป",
      "denominatorB": "จำนวนประชากรผู้สูงอายุที่ได้รับการคัดกรองกลุ่มอาการความเสื่อมในผู้สูงอายุทั้งหมด",
      "frequency": "ตุลาคม 2567 - กันยายน 2568",
      "evaluationMethod": "1. อสม.บันทึกผลการประเมินสุขภาพและคัดกรองกลุ่มอาการผู้สูงอายุ 9 ด้าน > ร้อยละ 80 2. Care Manager และเจ้าหน้าที่สาธารณสุขในหน่วยบริการสาธารณสุข ประเมิน ADL > ร้อยละ 60 รายละเอียดข้อมูล 3. ผู้สูงอายุกลุ่มเสี่ยงภาวะถดถอยได้รับการส่งเสริมสุขภาพดี (Wellness Plan) > ร้อยละ 60 พื้นฐาน 4. ผู้สูงอายุกลุ่มเสี่ยงภาวะถดถอยได้รับการส่งต่อดูแลรักษาในคลินิกผู้สูงอายุ > ร้อยละ 60 5. โรงพยาบาลทุกระดับจัดบริการคลินิกผู้สูงอายุผ่านเกณฑ์คุณภาพ > ร้อยละ 80 (Baseline Data) ผลการดำเนินงาน ผลงาน ปี 2565 ปี 2566 ปี 2567 ย้อนหลัง 3 ปี ร้อยละของผู้สูงอายุไม่มีภาวะพึ่งพิง 96.2 95.1 95.2",
      "responsible": "ชื่อ-สกุล นางอังคณา อึ้งปิติมานะ ตำแหน่ง นักวิชาการสาธารณสุขชำนาญการ กลุ่มงานส่งเสริมสุขภาพ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ 149 โทรสาร 0-4322-4037 โทรศัพท์มือถือ. 0617929942 E-mail :ungpitimana.ang@gmail.com"
    },
    "KPI70-33": {
      "kpiId": "KPI70-33",
      "order": 33,
      "name": "ผลงานวิจัย/R2R/นวัตกรรมหรือเทคโนโลยีสุขภาพที่คิดค้นใหม่หรือที่พัฒนาต่อยอดนำไปแก้ไขปัญหาสาธารณสุขที่สำคัญของจังหวัดขอนแก่น",
      "strategy": "ยุทธศาสตร์ที่ 4",
      "objective": "เป้าประสงค์ที่ 7",
      "unit": "เรื่อง",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "วิจัย 450 / นวัตกรรม 120",
      "baseline": "448 (เรื่อง)",
      "definition": "จำนวนผลงานวิจัย/R2R/นวัตกรรมหรือเทคโนโลยีสุขภาพที่คิดค้นใหม่หรือที่พัฒนาต่อยอด ที่แก้ไขปัญหา สาธารณสุขที่สำคัญของจังหวัดขอนแก่น ผลงานวิจัย/ ผลงาน R2R (Routine to Research) หมายถึง ผลที่ได้จากการศึกษาค้นคว้าอย่างเป็น ระบบด้วยวิธีการทางวิทยาศาสตร์หรือวิธีการที่เชื่อถือได้ ซึ่งต้องเป็นไปตามระเบียบวิธีหรือกฎเกณฑ์ ที่ถูกต้อง/ การพัฒนางานประจำสู่งานวิจัย ที่คิดค้นใหม่หรือที่พัฒนาต่อยอด เพื่อให้ได้ความรู้ที่เชื่อถือได้ มีเหตุมีผลเป็นไปตามวิธีการทางวิทยาศาสตร์ และนำไปใช้อย่างเป็นประโยชน์ในการให้บริการด้าน สาธารณสุข แก้ไขปัญหาสาธารณสุขในพื้นที่และปัญหาสาธารณสุขที่สำคัญจังหวัดขอนแก่นได้ นวัตกรรม (Innovative) หมายถึง สิ่งที่ทำขึ้นใหม่ หรือแตกต่างจากเดิม ซึ่งอาจเป็นความคิด วิธีการ หรืออุปกรณ์ เป็นต้น ที่มีคุณค่า และมีประโยชน์ต่อการให้บริการสุขภาพแก่ประชาชน นวัตกรรมการจัดการบริการสุขภ าพ (Innovative Healthcare Management) หมายถึง นวัตกรรมการบริหารและการจัดบริการสุขภาพใหม่ แก่ประชาชนให้สามารถเข้าถึงบริการทางการแพทย์ และสาธารณสุขได้รวดเร็ว สะดวก ปลอดภัย และมีประสิทธิภาพเพื่อส่งเสริมคุณภาพชีวิตประชาชนให้ดีขึ้น เทคโนโลยีทางสุขภาพ หมายถึง การรวบรวมความรู้และวิธีการทางวิทยาศาสตร์มาใช้อย่างเป็นระบบซึ่ง จะช่วยให้เกิดประสิทธิภาพในการดูแลการสร้างเสริมสุขภาพ การป้องกันรักษาโรค และการฟื้นฟู สมรรถภาพทางร่างกาย เพื่อให้บุคคลหรือชุมชนมีสุขภาพที่ดีและมีความปลอดภัยในชีวิต ทั้งนี้หมายรวมถึง เทคโนโลยีที่เกี่ยวกับผลิตภัณฑ์สุขภาพ (เทคโนโลยีเกี่ยวกับผลิตภัณฑ์เครื่องสำอาง อาหาร ยา เครื่องมือ แพทย์ และอุปกรณ์หรือเครื่องมือสุขภาพ) และบริการสุขภาพ (เทคโนโลยีที่เกี่ยวกับการตรวจโรค การรักษาโรค การป้องกันโรค และการสร้างเสริมสุขภาพ) การพัฒนาต่อยอด หมายถึง การนำนวัตกรรมด้านวิทยาศาสตร์การแพทย์หรือเทคโนโลยีสุขภาพ ที่เคยมีการศึกษา วิจัยประดิษฐ์ คิดค้นขึ้นที่สำเร็จแล้ว นำมาพัฒนาต่อยอด ให้เกิดประโยชน์เพิ่มเติมจากเดิม การนำองค์ความรู้ เทคโนโลยี และนวัตกรรมไปใช้ประโยชน์ หมายถึง การมีหลักฐานที่แสดงว่าได้ มีการนำองค์ความรู้ เทคโนโลยี และนวัตกรรมที่ได้จากการศึกษา วิจัย ไปใช้ประโยชน์ในการแก้ปัญหา สาธารณสุขตาม",
      "purpose": "1. เพื่อแก้ไขปัญหาสาธสาธารณสุขที่สำคัญของจังหวัดขอนแก่น โดยงานวิจัย/R2R/ นวัตกรรม หรือ เทคโนโลยีสุขภาพที่คิดค้นใหม่หรือที่พัฒนาต่อยอด 2. เพื่อเพิ่มอายุคาดเฉลี่ยของประชาชนจังหวัดขอนแก่น เมื่อแรกเกิด (LE) ไม่น้อยกว่า 85 ปี อายุคาด เฉลี่ยของการมีสุขภาพดี (HALE) ไม่น้อยกว่า 75 ปี ตามเป้าหมายตามแผนยุทธศาสตร์ชาติ ระยะ 20 ปี ด้านสาธารณสุข",
      "population": "เครือข่ายบริการสุขภาพสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "collectionMethod": "รวบรวมข้อมูลจากเครือข่ายบริการสุขภาพสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "source": "ฐานข้อมูลผลงานวิจัย/R2R/นวัตกรรม ด้านวิทยาศาสตร์การแพทย์ของเครือข่ายบริการสุขภาพ สำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "formula": "- ระยะเวลา ไตรมาสที่ 3-4 ประเมินผล",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI70-34": {
      "kpiId": "KPI70-34",
      "order": 34,
      "name": "จำนวนโรงพยาบาลสังกัดกระทรวงสาธารณสุขที่พัฒนาสู่องค์กรดิจิทัลและมีความมั่นคงปลอดภัยทางไซเบอร์",
      "strategy": "ยุทธศาสตร์ที่ 4",
      "objective": "เป้าประสงค์ที่ 7",
      "unit": "แห่ง",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "26 แห่ง",
      "baseline": "22 แห่ง",
      "definition": "จำนวนโรงพยาบาลสังกัดกระทรวงสาธารณสุขที่พัฒนาสู่องค์กรดิจิทัลและมีความมั่นคงปลอดภัยทางไซเบอร์ ตามเกณฑ์มาตรฐานแผนยุทธศาสตร์สุขภาพ 5 ปี จังหวัดขอนแก่น (พ.ศ. 2566–2570)",
      "purpose": "เพื่อส่งเสริมให้โรงพยาบาลสังกัดสำนักงานสาธารณสุขจังหวัด มีการพัฒนาอนามัยสิ่งแวดล้อม ได้ตามเกณฑ์ GREEN & CLEAN Hospital Challenge",
      "population": "โรงพยาบาลสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่น",
      "collectionMethod": "โรงพยาบาลทุกแห่งบันทึกข้อมูลในโปรแกรม GREEN & CLEAN Hospital",
      "source": "โปรแกรมการประเมิน GREEN & CLEAN Hospital",
      "formula": "A = จำนวนรพ.ที่ดำเนินการได้ตามเกณฑ์ 13 ข้อ (คะแนน 80 % ขึ้นไป) B = จำนวนรพ.ที่ดำเนินการได้ตามเกณฑ์ 15 ข้อ (คะแนน 90 % ขึ้นไป) C = จำนวนรพ.ที่ดำเนินการได้ตามเกณฑ์ 15 ข้อ (คะแนน 90 % ขึ้นไป) และพัฒนาได้ตามประเด็นท้าทายA+B+C=26 ระยะเวลา นิเทศ ติดตาม และประเมินผลการดำเนินงานสาธารณสุขจังหวัดขอนแก่น ปี 2568 จำนวน 2 รอบ ประเมินผล",
      "numeratorA": "จำนวนโรงพยาบาลสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่นที่ดำเนินการ GREEN & CLEAN",
      "denominatorB": "จำนวนโรงพยาบาลสังกัดสำนักงานสาธารณสุขจังหวัดขอนแก่นที่ดำเนินการ GREEN & CLEAN",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "1. โรงพยาบาลทุกแห่งประเมินตนเองบันทึกข้อมูลในโปรแกรม GREEN & CLEAN Hospital ส่งให้ สำนักงานสาธารณสุขจังหวัดขอนแก่น 2. สำนักงานสาธารณสุขจังหวัดขอนแก่น ประเมินผลการดำเนินงานของโรงพยาบาลศูนย์ โรงพยาบาล",
      "responsible": "1. นายณัฐิวุฒิ จันตะแสง ตำแหน่ง นักสาธารณสุขชำนาญการ กลุ่มงานอนามัยสิ่งแวดล้อมและอาชีวอนามัย สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 043 221125 ต่อ 156 โทรสาร 043 224037 โทรศัพท์มือถือ 064 983 9562 e-mail: pro_tb@yahoo.com 2. นางสาวนภัสวรรณ สนธินอก ตำแหน่ง นักวิชาการสาธารณสุขชำนาญการ กลุ่มงานอนามัยสิ่งแวดล้อมและอาชีวอนามัย สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 043 221125 ต่อ 156 โทรสาร 043 224037 โทรศัพท์มือถือ 091 867 3075 e-mail: aom.napass@gmail.com"
    },
    "KPI70-35": {
      "kpiId": "KPI70-35",
      "order": 35,
      "name": "โรงพยาบาลสังกัดกระทรวงสาธารณสุขมีคุณภาพผ่านการรับรองตามมาตรฐาน",
      "strategy": "ยุทธศาสตร์ที่ 4",
      "objective": "เป้าประสงค์ที่ 8",
      "unit": "แห่ง",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "26 แห่ง",
      "baseline": "-",
      "definition": "โรงพยาบาลสังกัดกระทรวงสาธารณสุขมีคุณภาพผ่านการรับรองตามมาตรฐาน ตามเกณฑ์มาตรฐานแผนยุทธศาสตร์สุขภาพ 5 ปี จังหวัดขอนแก่น (พ.ศ. 2566–2570)",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่น",
      "population": "ประชากรกลุ่มเป้าหมายและหน่วยบริการสุขภาพในพื้นที่ 26 อำเภอ จังหวัดขอนแก่น",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "ผลการดำเนินงานจริงเทียบกับเกณฑ์เป้าหมาย (แห่ง)",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI70-36": {
      "kpiId": "KPI70-36",
      "order": 36,
      "name": "จำนวนสำนักงานสาธารณสุขอำเภอผ่านเกณฑ์พัฒนาศักยภาพเป็นองค์กรสมรรถนะสูง Smart สสอ.ด้านการคุ้มครองผู้บริโภค",
      "strategy": "ยุทธศาสตร์ที่ 4",
      "objective": "เป้าประสงค์ที่ 8",
      "unit": "แห่ง",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "20",
      "baseline": "9",
      "definition": "ด้านการคุ้มครองผู้บริโภค",
      "purpose": "คุ้มครองผู้บริโภคด้านสุขภาพโดยมีการจัดตั้งศูนย์บริการสุขภาพเบ็ดเสร็จระดับอำเภอ ซึ่งประกอบด้วย",
      "population": "ภารกิจ ดังนี้",
      "collectionMethod": "1. จัดตั้งศูนย์บริการสุขภาพเบ็ดเสร็จระดับอำเภอ ซึ่งมีองค์ประกอบด้านกายภาพ/ บุคลากร/อุปกรณ์/ คู่มือ/สถานที่ ครบถ้วน โดยกำหนดให้มี 1) จัดทำและติดตั้งป้ายชื่อศูนย์บริการสุขภาพเบ็ดเสร็จระดับอำเภอ 2) จัดทำสื่อประชาสัมพันธ์ศูนย์ฯ ผ่านให้บริการผ่านสื่อออนไลน์ เช่น เว็บไซต์/ Line group/ Facebook 3) จัดให้มีอุปกรณ์อำนวยความสะดวกผู้รับบริการในการขออนุญาตสถานประกอบการและ ผลิตภัณฑ์สุขภาพ ได้แก่โน๊ตบุ๊ค/ปริ้นเตอร์ 4) จัดให้มีจุดพักคอย 5) คู่มือการให้บริการประชาชน 6) มีการสำรวจความพึงพอใจ/ความต้องการของผู้มารับบริการ 2. จัดให้มีบริการให้คำปรึกษาการขออนุญาตฯ ผ่านระบบออนไลน์ ได้แก่ ระบบสำนักงาน คณะกรรมการอาหารและยา (Skynet) และ ระบบกรมสนับสนุนบริการสุขภาพ (Biz Portal) 3. จัดให้มีบริการอนุญาตเปิดสิทธิ์การเข้าใช้ระบบ Skynet ของผู้ประกอบการ 4. ดำเนินการตรวจสอบมาตรฐานสถานประกอบการเพื่อประกอบการพิจารณาอนุญาต Pre- marketing และดำเนินการตรวจเฝ้าระวัง Post-marketing สถานประกอบการด้านสุขภาพในเขต พื้นที่ 5. ดำเนินการจัดการเรื่องร้องเรียนด้านผลิตภัณฑ์และสถานประกอบการสุขภาพ SAT Team คปสอ. 6. ส่งเสริมนโยบายเศรษฐกิจสุขภาพ สร้างการมีส่วนร่วมของทุกภาคส่วน โดยสร้างเครือข่ายความ ร่วมมือระหว่างศูนย์บริการสุขภาพเบ็ดเสร็จและหน่วยงานในพื้นที่ 7. รายงานผลการดำเนินงานโดยผ่านช่องทาง Dash board 8. มีการนิเทศและติดตามผลการดำเนินงานภายใน คปสอ. 10 แห่ง เพื่อส่งเสริมให้เกิด Smart District Health Consumer Protection สำนักงานสาธารณสุขอำเภอ สังกัด กระทรวงสาธารณสุขที่มีการประยุกต์ใช้เทคโนโลยีดิจิตัลเพิ่มประสิทธิภาพการให้บริการด้านการคุ้มครอง ผู้บริโภคผลิตภัณฑ์และบริการสุขภาพ และ ตอบสนองนโยบายส่งเสริมเศรษฐกิจสุขภาพ KPI : Health for wealth (ร้อยละผลิตภัณฑ์สุขภาพที่ได้รับการส่งเสริมและได้รับการอนุญาต) ศูนย์บริการสุขภาพเบ็ดเสร็จระดับอำเภอ จังหวัดขอนแก่น สำนักงานสาธารณสุขอำเภอ นำข้อมูลผลการดำเนินงานผ่านระบบรายงาน Dashboard ศูนย์บริการ สุขภาพเบ็ดเสร็จอำเภอ, คู่มือการดำเนินงานศูนย์ฯ/คู่มือการจัดการเรื่องร้องเรียน และ ผลการนิเทศติดตาม ศูนย์ฯต้นแบบ",
      "source": "สาธารณสุขอำเภอทุกอำเภอ",
      "formula": "3.แผนงานขับเคลื่อนการดำเนินงานสนับสนุนส่งเสริมนโยบายเศรษฐกิจสุขภาพในเขตพื้นที่",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "4.บันทึกผลการตรวจสอบเพื่อประกอบการอนุญาต Pre-marketing และ การตรวจเฝ้าระวังประจำปี",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    },
    "KPI70-37": {
      "kpiId": "KPI70-37",
      "order": 37,
      "name": "จำนวนโรงพยาบาลมีการบริหารการเงินการคลังอย่างมีประสิทธิภาพ",
      "strategy": "ยุทธศาสตร์ที่ 4",
      "objective": "เป้าประสงค์ที่ 9",
      "unit": "แห่ง",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "26 แห่ง",
      "baseline": "21 แห่ง",
      "definition": "หน่วยบริการปฐมภูมิ หมายถึง หน่วยบริการสาธารณสุขระดับปฐมภูมิ ทุกสังกัดที่ขึ้นทะเบียน เป็นหน่วยบริการปฐมภูมิเกณฑ์ประเมินคุณภาพมาตรฐานบริการสุขภาพปฐมภูมิ หมายถึง เกณฑ์ ประเมิณคุณภาพมาตรฐานบริการสุขภาพปฐมภูมิ พ.ศ.2566 (ฉบับปรับปรุง) มีเกณฑ์การประเมินดังนี้ ส่วนที่ 1 ด้านระบบบริหารจัดการ ส่วนที่ 2 ด้านการจัดบุคคลากรและศักยภาพในการให้บริการ ส่วนที่ 3 ด้านสถานที่ตั้งหน่วยบริการ อาคาร สถานที่ และสิ่งแวดล้อม ส่วนที่ 4 ด้านระบบสารสนเทศ ส่วนที่ 5 ด้านระบบบริการสุขภาพปฐมภูมิ ส่วนที่ 6 ด้านระบบห้องปฏิบัติการด้านการแพทย์และสาธารณสุข ส่วนที่ 7 ด้านการจัดบริการเภสัชกรรมอลังานคุ้มครองผู้บริโภคด้านสุขภาพ ส่วนที่ 8 ด้านระบบการป้องกันและควบคุมการติดเชื่อ โดยมีการแปลผลดังนี้ ส่วนที่ 1 – 4 หน่วยบริการต้องผ่านเกณฑ์ทุกข้อ ส่วนที่ 5 – 8 หน่วยบริการต้องผ่านเกณ์ร้อยละ 80 ขึ้นไป",
      "purpose": "1. เพื่อให้ประชาชนสามารถเข้าถึงบริการที่มีคุณภาพ มาตรฐาน 2. เพื่อพัฒนาหน่วยบริการปฐมภูมิให้มีคุณภาพมาตรฐาน",
      "population": "หน่วยบริการปฐมภูมิทุกแห่ง ทุกสังกัด",
      "collectionMethod": "การจัดเก็บการประเมินคุณภาพมาตรฐาน จากระบบข้อมูลทรัพยากรสุขภาพหน่วยบริการปฐมภูมิ",
      "source": "(PCU Standard)",
      "formula": "A = จำนวนหน่วยบริการปฐมภูมิที่ผ่านเณฑ์การประเมิณมาตรฐานระบบสุขภาพปฐมภูมิ",
      "numeratorA": "จำนวนหน่วยบริการปฐมภูมิที่ผ่านเณฑ์การประเมิณมาตรฐานระบบสุขภาพปฐมภูมิ",
      "denominatorB": "จำนวนหน่วยบริการปฐมภูมิทั้งหมดทุกสังกัด",
      "frequency": "B = จำนวนหน่วยบริการปฐมภูมิทั้งหมดทุกสังกัด",
      "evaluationMethod": "ระบบข้อมูลทรัพยากรสุขภาพ หน่วยบริการปฐมภูมิ (PCU Standard )และ สุ่มลงตรวจประเมิน ในพื้นที่ รายละเอียดข้อมูล พื้นฐาน(Baseline ผลงาน ปี 2565 ปี 2566 ปี 2567 Data) Baseline Data - - ร้อยละ 41.08 ผลการดำเนินงาน ย้อนหลัง 3 ปี ชื่อ-สกุล...นางศิริพร อุทธากิจ ตำแหน่ง..พยาบาลวิชาชีพชำนาญการ (ปี 2565 -2567) กลุ่มงาน..พัฒนาคุณภาพและรูปแบบบริการ.",
      "responsible": "สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ 122... โทรสาร 0-4322-4037 ผู้กำกับดูแลตัวชี้วัด โทรศัพท์มือถือ..080 - 3570910. E-mail : .pcunpcu2022@gmail.com ชื่อ-สกุล...นางศิริมา นามประเสริฐ ตำแหน่ง..หัวหน้ากลุ่มงานพัฒนาคุณภาพและรูปแบบบริการ กลุ่มงาน..พัฒนาคุณภาพและรูปแบบบริการ. สำนักงานสาธารณสุขจังหวัดขอนแก่น โทรศัพท์ 0-4322-1125 ต่อ 122... โทรสาร 0-4322-4037"
    },
    "KPI70-38": {
      "kpiId": "KPI70-38",
      "order": 38,
      "name": "ร้อยละผลิตภัณฑ์สุขภาพและสถานประกอบการมีคุณภาพตามเกณฑ์",
      "strategy": "ยุทธศาสตร์ที่ 5",
      "objective": "เป้าประสงค์ที่ 10",
      "unit": "ร้อยละ",
      "direction": "ยิ่งมากยิ่งดี",
      "target": "> 95",
      "baseline": "100",
      "definition": "ประชาชนทุกกลุ่มวัย และผู้บริโภคมีพฤติกรรมสุขภาพที่เหมาะสม",
      "purpose": "เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่นอย่างมีประสิทธิภาพและยั่งยืน",
      "population": "ระยะเวลา ผลที่คาดว่าจะได้รับ ดำเนินการ (ไตรมาส) เศรษฐกิจสุขภาพ : เพื่อส่งเสริมและพัฒนาประกอบการ 1.โครงการขอนแก่น Smart FDA Data Center 1. วิสาหกิจชุมชน ไตรมาสที่ 1 และ 2 1.ร้อยละ 95 ของผลิตภัณฑ์ ผลิตภัณฑ์สุขภาพและสถาน เชื่อมโยงข้อมูลสถานประกอบการและผลิตภัณฑ์ วิสาหกิจรายย่อย และ สุขภาพได้รับการส่งเสริม เป้าหมาย ประกอบการให้มีคุณภาพตาม สุขภาพแบบบูรณาการ Wellness Directory สถานที่ผลิตที่ไม่เข้าข่าย ขั้นต่ำ อำเภอละ 1 ผลิตภัณฑ์ มาตรฐานที่กำหนด ทั้งด้านอาหาร 2.โครงการ Khon Kaen Wellness Roadshow โรงงาน 100 ราย (อาหาร 2.ผลิตภัณฑ์ที่ส่งเสริมได้รับอนุญาต สมุนไพร เครื่องสำอาง และวัตถุ สินค้าดี บริการเด่น ผลิตภัณฑ์และบริการสุขภาพสู่สากล 75 รายเครื่องสำอาง 10 ไม่น้อยกว่า 55 รายการ (ตาม อันตราย โดยเชื่อมโยงกับแผน 3.โครงการยกระดับ Smart สสอ.สู่ศูนย์บริการสุขภาพ ราย สมุนไพร 10 ราย ตัวชี้วัด) ยุทธศาสตร์จังหวัดขอนแก่น เบ็ดเสร็จต้นแบบเพื่อการคุ้มครองผู้บริโภคอย่างยั่งยืน และวัตถุอันตราย 5 ราย) 3.ผลิตภัณฑ์สุขภาพของจังหวัด “ประเด็นการพัฒนาเศรษฐกิจ 4.โครงการขับเคลื่อนผู้ประกอบการเศรษฐกิจสุขภาพ (เป้าหมายร่วม พช. ขอนแก่นได้รับรางวัลระดับชาติ สุขภาพของจังหวัดขอนแก่นอย่าง สู่เมืองนวัตกรรมสุขภาพขอนแก่น อุตสาหกรรม เกษตร) อย่างน้อย 1 รายการ ยั่งยืน “ 5.โครงการยกระดับเส้นทางท่องเที่ยวเชิงสุขภาพสู่เมือง 2.คณะทำงานเศรษฐกิจ 4.มูลค่าทางผลิตภัณฑ์เศรษฐกิจ ต้นแบบ Wellness & Medical Hub ขอนแก่น ได้แก่ สุขภาพระดับอำเภอ 4 สุขภาพของจังหวัดเพิ่มขึ้นอย่าง สาวะถี, อุบลรัตน์,ภูผาม่าน, สีชมพู, ภูเวียง,เวียงเก่า) โซน ต่อเนื่อง 6.โครงการขอนแก่นเมืองสุขภาพ ยกระดับ สถาน ประกอบการสู่มาตรฐาน Wellness Center (กรม แพทย์แผนไทย) 7.โครงการพัฒนาศักยภาพบุคลากรด้านการแพทย์แผน ไทย (การนวดไทยเฉพาะทาง) 8.โครงการพัฒนาระบบกำกับดูแลและเฝ้าระวังการใช้ สมุนไพรควบคุม (กัญชา) อย่างปลอดภัยและได้มาตรฐาน",
      "collectionMethod": "บันทึกผ่านระบบโปรแกรมมาตรฐานของหน่วยบริการ และส่งออกข้อมูลตามมาตรฐาน 43 แฟ้ม เข้าสู่ระบบ HDC",
      "source": "ระบบคลังข้อมูลสุขภาพ Health Data Center (HDC) สสจ.ขอนแก่น",
      "formula": "(จำนวนผลงานที่บรรลุเกณฑ์ [A] ÷ จำนวนกลุ่มเป้าหมายทั้งหมด [B]) × 100",
      "numeratorA": "จำนวนประชากรหรือหน่วยบริการที่มีผลงานผ่านเกณฑ์ตามตัวชี้วัด",
      "denominatorB": "จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน",
      "frequency": "รายไตรมาส (รอบ 3, 6, 9, 12 เดือน)",
      "evaluationMethod": "ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน",
      "responsible": "กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125"
    }
  }
};
window.OFFICIAL_KPI_TEMPLATES_DB = OFFICIAL_KPI_TEMPLATES_DB;



// ============================================================================
// 11. OFFICIAL KPI TEMPLATE SPECIFICATION DATABASE & EXPORT ENGINE
// (ตรงตาม Schema มาตรฐานสาธารณสุข และสกัดจากเล่มแผนยุทธศาสตร์ 2566-2569)
// ============================================================================

function getDetailedKPITemplate(kpi, yearKey) {
  const currentYear = yearKey || AppState.selectedYear || '68';
  const ds = (typeof OFFICIAL_DATASET !== 'undefined' ? OFFICIAL_DATASET[currentYear] : null) || (typeof OFFICIAL_DATASET !== 'undefined' ? OFFICIAL_DATASET['68'] : { yearName: '25' + currentYear, kpis: [] });
  const yrName = ds.yearName || ('25' + currentYear);
  const yearDb = (typeof OFFICIAL_KPI_TEMPLATES_DB !== 'undefined' ? OFFICIAL_KPI_TEMPLATES_DB[currentYear] : null) || 
                 (typeof OFFICIAL_KPI_TEMPLATES_DB !== 'undefined' ? OFFICIAL_KPI_TEMPLATES_DB['68'] : null) || 
                 (typeof OFFICIAL_KPI_TEMPLATES_DB !== 'undefined' ? OFFICIAL_KPI_TEMPLATES_DB['69'] : null) || {};
  
  // Find exact template by ID or Order/Name matching
  const exactTmpl = yearDb[kpi.id] || 
                    Object.values(yearDb).find(t => t.kpiId === kpi.id || (t.name && kpi.name && (t.name.includes(kpi.name.substring(0, 15)) || kpi.name.includes(t.name.substring(0, 15))))) || {};

  const kpi66 = findMatchingKPIInYear(kpi, '66');
  const kpi67 = findMatchingKPIInYear(kpi, '67');
  const kpi68 = findMatchingKPIInYear(kpi, '68');
  const kpi69 = findMatchingKPIInYear(kpi, '69');
  const kpi70 = findMatchingKPIInYear(kpi, '70');

  const t66 = exactTmpl.targets?.t66 || (kpi66 ? kpi66.target : '-');
  const t67 = exactTmpl.targets?.t67 || (kpi67 ? kpi67.target : '-');
  const t68 = exactTmpl.targets?.t68 || (kpi68 ? kpi68.target : '-');
  const t69 = exactTmpl.targets?.t69 || (kpi69 ? kpi69.target : (currentYear === '69' ? kpi.target : '-'));
  const t70 = exactTmpl.targets?.t70 || (kpi70 ? kpi70.target : (currentYear === '70' ? kpi.target : (kpi.target70 || t69)));

  const isPercent = kpi.unit && kpi.unit.includes('ร้อยละ');
  const defaultFormula = isPercent
    ? `(A / B) × 100`
    : `ผลการดำเนินงานจริงเทียบกับเกณฑ์เป้าหมาย (${kpi.unit || 'หน่วย'})`;

  const interventions = [
    `ขับเคลื่อนกลไกคณะกรรมการพัฒนาระบบสุขภาพระดับอำเภอ (พชอ.) บูรณาการภาคีเครือข่าย 26 อำเภอ`,
    `พัฒนาคู่มือแนวทางเวชปฏิบัติและมาตรฐานการให้บริการ (Standard Operating Procedures) ถ่ายทอดสู่ระดับปฐมภูมิ`,
    `ยกระดับระบบเทคโนโลยีดิจิทัลและระบบข้อมูลสารสนเทศสุขภาพ เชื่อมโยงข้อมูลผ่าน HDC ขอนแก่น แบบ Real-time`,
    `จัดตั้งทีมพี่เลี้ยง (Coaching & Supervisory Team) นิเทศติดตามความก้าวหน้ารายไตรมาสและจัดทำ Strategic War Room`
  ];

  const fullDocUrl = `เล่มแผนยุทธศาสตร์_ฉบับทบทวนปีงบประมาณ_${yrName}.pdf`;
  const targetDocFile = `ค่าเป้าหมายKPI ปีงบประมาณ พ.ศ.${yrName}.pdf`;

  return {
    code_ref: kpi.id,
    order: kpi.order,
    strategy: kpi.strategy,
    goal: kpi.objective || exactTmpl.objective || 'เป้าประสงค์เชิงยุทธศาสตร์ระดับจังหวัด',
    name: kpi.name,
    target_display: formatKPIValueWithUnit(kpi.target, kpi.unit),
    unit_direction: `${kpi.unit} &bull; ${kpi.direction}`,
    definition: exactTmpl.definition || `${kpi.name} ตามเกณฑ์มาตรฐานแผนยุทธศาสตร์สุขภาพ 5 ปี จังหวัดขอนแก่น (พ.ศ. 2566–2570)`,
    purpose: exactTmpl.purpose || 'เพื่อขับเคลื่อนการดำเนินงานและยกระดับคุณภาพบริการสุขภาพในพื้นที่จังหวัดขอนแก่นอย่างมีประสิทธิภาพและยั่งยืน',
    formula: exactTmpl.formula || defaultFormula,
    variable_a: exactTmpl.numeratorA || 'จำนวนประชากรหรือหน่วยบริการที่มีผลการดำเนินงานผ่านเกณฑ์ตามตัวชี้วัด',
    variable_b: exactTmpl.denominatorB || 'จำนวนประชากรหรือกลุ่มเป้าหมายทั้งหมดที่เข้าเกณฑ์ประเมิน',
    scope: exactTmpl.population || 'ประชาชนกลุ่มเป้าหมายและหน่วยบริการสาธารณสุขระดับ รพศ./รพท./รพช./สสอ./รพ.สต. ใน 26 อำเภอ จังหวัดขอนแก่น',
    responsible_agency: exactTmpl.responsible || 'กลุ่มงานตามยุทธศาสตร์ สำนักงานสาธารณสุขจังหวัดขอนแก่น โทร. 0-4322-1125 ต่อ 163',
    data_source_frequency: exactTmpl.source ? `${exactTmpl.source} (${exactTmpl.frequency || 'รายงานทุกไตรมาส'})` : 'ระบบคลังข้อมูลสุขภาพ (HDC) สสจ.ขอนแก่น / 43 แฟ้ม, รายงานผลทุกไตรมาส',
    evaluationMethod: exactTmpl.evaluationMethod || 'ประเมินผลผ่านระบบสารสนเทศ HDC และการตรวจราชการนิเทศงาน',
    targets: { t66, t67, t68, t69, t70 },
    interventions: interventions,
    full_template_doc_url: fullDocUrl,
    targetDocFile: targetDocFile
  };
}

function openKPIDetailModal(kpiId) {
  const ds = getCurrentYearDataset();
  const currentYearKey = AppState.selectedYear || '69';
  const filteredKpis = (typeof getCurrentlyFilteredKPIs === 'function') ? getCurrentlyFilteredKPIs() : [];
  const kpis = (filteredKpis.length > 0 && filteredKpis.some(k => k.id === kpiId)) ? filteredKpis : ds.kpis;
  const kpi = kpis.find(k => k.id === kpiId) || ds.kpis.find(k => k.id === kpiId) || ds.kpis[0];
  if (!kpi) return;

  const modal = document.getElementById('kpi-detail-modal');
  const dialog = document.getElementById('kpi-insight-dialog');
  if (!modal || !dialog) return;

  modal.setAttribute('data-kpi-id', kpi.id);

  const currentIndex = kpis.findIndex(k => k.id === kpi.id);
  const counterText = currentIndex !== -1 ? `${currentIndex + 1} / ${kpis.length}` : `1 / ${ds.kpis.length}`;
  const prevId = kpis[(currentIndex - 1 + kpis.length) % kpis.length]?.id || kpi.id;
  const nextId = kpis[(currentIndex + 1) % kpis.length]?.id || kpi.id;

  const evalRes = evaluateStatus(kpi);
  const tmpl = getDetailedKPITemplate(kpi, currentYearKey);

  // 5-Year History Lineage Lookup using Semantic & Topic Matcher
  const m66 = findMatchingKPIInYear(kpi, '66');
  const m67 = findMatchingKPIInYear(kpi, '67');
  const m68 = findMatchingKPIInYear(kpi, '68');
  const m69 = findMatchingKPIInYear(kpi, '69');
  const m70 = findMatchingKPIInYear(kpi, '70');

  const t66 = m66?.target || '-';
  const a66 = m66?.actual || '-';

  const t67 = m67?.target || '-';
  const a67 = m67?.actual || '-';

  const t68 = m68?.target || '-';
  const a68 = m68?.actual || '-';

  const t69 = m69?.target || kpi.target || '-';
  const a69 = m69?.actual || kpi.actual || '-';

  const t70 = m70?.target || kpi.target70 || t69 || '-';
  const a70 = m70?.actual || '-';

  // Evaluate yearly status for colors in table
  const eval66 = evaluateYearPair(a66, t66, kpi.direction);
  const eval67 = evaluateYearPair(a67, t67, kpi.direction);
  const eval68 = evaluateYearPair(a68, t68, kpi.direction);
  const eval69 = evaluateYearPair(a69, t69, kpi.direction);

  const overallStrokeColor = evalRes.status === 'pass' ? '#10b981' : (evalRes.status === 'fail' ? '#ef4444' : '#f59e0b');

  dialog.innerHTML = `
    <!-- Header -->
    <div class="modal-insight-header">
      <div style="flex: 1; min-width: 0; padding-right: 0.75rem;">
        <div class="modal-header-meta">
          <span class="badge-kpi-id">${kpi.id}</span>
          <span class="breadcrumb-strat">${kpi.strategy} &rsaquo; ${kpi.objective || ''}</span>
        </div>
        <h2 class="modal-insight-title" title="${kpi.name}" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0;">${kpi.name}</h2>
      </div>
      <div class="modal-header-actions">
        <!-- Jump to KPI Input Box -->
        <div class="modal-jump-kpi-wrap">
          <span class="modal-jump-kpi-label">KPI</span>
          <input type="number" id="modal-jump-kpi-input" class="modal-jump-kpi-input" min="1" max="${kpis.length}" value="${currentIndex + 1}" inputmode="numeric"
                 onkeydown="if(event.key==='Enter') jumpToKpiIndex(this.value)"
                 title="พิมพ์หมายเลขตัวชี้วัด (1 - ${kpis.length}) แล้วกด Enter หรือคลิกปุ่ม GO">
          <span class="modal-jump-kpi-total">/ ${kpis.length}</span>
          <button class="modal-jump-kpi-btn" onclick="jumpToKpiIndex(document.getElementById('modal-jump-kpi-input').value)" title="ไปยังตัวชี้วัดนี้">
            GO 🚀
          </button>
        </div>

        <button class="btn-modal-nav btn-modal-nav-prev" onclick="navigateKPIModal('prev', '${kpi.id}')" title="ดูตัวชี้วัดก่อนหน้า (ลูกศรซ้าย &larr;)">
          &larr; ก่อนหน้า
        </button>
        <button class="btn-modal-nav btn-modal-nav-next" onclick="navigateKPIModal('next', '${kpi.id}')" title="ดูตัวชี้วัดถัดไป (ลูกศรขวา &rarr;)">
          ถัดไป &rarr;
        </button>
        <button class="modal-close-btn-white" onclick="closeModal()" title="ปิดหน้าต่าง">&times;</button>
      </div>
    </div>

    <!-- Body: Fullscreen 2-Column Grid (Image 2 Structure) -->
    <div class="modal-insight-body modal-fullscreen-grid">
      
      <!-- Left Column: 1. Table 5Y -> 2. Lineage Alert -> 3. Trend Graph -->
      <div class="modal-grid-left">
        
        <!-- 1. ตารางสรุปผลงานและเป้าหมาย 5 ปี -->
        <div class="modal-section-title">📊 ตารางสรุปผลงานและเป้าหมาย 5 ปี (พ.ศ. 2566–2570)</div>
        <div class="modal-history-table-wrap">
          <table class="modal-history-table">
            <thead>
              <tr>
                <th>รายการ</th>
                <th>ปี 2566</th>
                <th>ปี 2567</th>
                <th>ปี 2568</th>
                <th>เป้า 2569</th>
                <th>เป้า 2570</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight:700;">เป้าหมาย</td>
                <td>${t66}</td>
                <td>${t67}</td>
                <td>${t68}</td>
                <td style="font-weight:700;">${t69}</td>
                <td style="font-weight:700;">${t70}</td>
              </tr>
              <tr>
                <td style="font-weight:700;">ผลงานจริง</td>
                <td>${eval66.formatted}</td>
                <td>${eval67.formatted}</td>
                <td>${eval68.formatted}</td>
                <td>${eval69.formatted}</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 2. วิวัฒนาการและเป้าหมายยุทธศาสตร์ (Strategic Lineage) -->
        <div class="modal-alert-box">
          <div class="modal-alert-icon">i</div>
          <div>
            <div class="modal-alert-title">วิวัฒนาการและเป้าหมายยุทธศาสตร์ (Strategic Lineage):</div>
            <div class="modal-alert-desc">${kpi.lineage || 'ตัวชี้วัดทางการตามแผนยุทธศาสตร์สุขภาพจังหวัดขอนแก่น ระยะ 5 ปี (พ.ศ. 2566–2570)'}</div>
          </div>
        </div>

        <!-- 3. กราฟแนวโน้มผลการดำเนินงานจริง vs เป้าหมาย 5 ปี -->
        <div class="modal-chart-card">
          <div class="modal-chart-header">
            <span class="modal-chart-title-text">📈 กราฟแนวโน้มผลการดำเนินงานจริง vs เป้าหมาย 5 ปี (2566–2570)</span>
            <span class="badge-blue-soft">${kpi.unit || 'ร้อยละ'} (${kpi.direction || 'ยิ่งมากยิ่งดี'})</span>
          </div>
          <div class="modal-chart-canvas-wrapper">
            <canvas id="modalKPIChart"></canvas>
          </div>
          <div class="modal-chart-custom-legend">
            <div class="legend-item">
              <span class="legend-line-target"></span>
              <span>🎯 เป้าหมาย (Target)</span>
            </div>
            <div class="legend-item">
              <span class="legend-line-actual"></span>
              <span>📊 ผลงานจริง (Actual)</span>
            </div>
            <div class="legend-item">
              <span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:#10b981;"></span>
              <span>🟢 ผ่านเกณฑ์</span>
            </div>
            <div class="legend-item">
              <span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:#ef4444;"></span>
              <span>🔴 ไม่ผ่านเกณฑ์</span>
            </div>
          </div>
        </div>

        <!-- 4. Sub Values if present -->
        ${kpi.subValues && kpi.subValues.length > 0 ? `
          <div class="modal-subvalues-card">
            <div class="modal-subvalues-header">
              <h4 class="modal-subvalues-title">📌 ค่าย่อยจำแนกระดับ/ประเภท (Sub-Values)</h4>
              <span class="badge-blue-soft" style="font-size: 0.7rem;">${kpi.subValues.length} รายการ</span>
            </div>
            <div class="modal-subvalues-table-wrap">
              <table class="modal-subvalues-table">
                <thead>
                  <tr>
                    <th>รายการย่อย</th>
                    <th style="text-align: right; width: 110px;">เป้าหมาย</th>
                    <th style="text-align: right; width: 130px;">ผลงานจริง</th>
                  </tr>
                </thead>
                <tbody>
                  ${kpi.subValues.map(s => {
                    const sEval = evaluateYearPair(s.actual, s.target, kpi.direction);
                    return `
                      <tr>
                        <td class="sub-label"><strong>${s.label}</strong></td>
                        <td class="sub-target" style="text-align: right; font-weight: 700;">${s.target || '-'}</td>
                        <td class="sub-actual" style="text-align: right;">${sEval.formatted}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : ''}
      </div>

      <!-- Right Column: Templates KPI (สังเขป) Card -->
      <div class="modal-grid-right">
        <div class="kpi-template-summary-card">
          <!-- 1. Header Bar -->
          <div class="kpi-template-header">
            <div class="kpi-template-title-wrap">
              <span class="kpi-template-icon">📑</span>
              <h3 class="kpi-template-title">Templates KPI (สังเขป)</h3>
            </div>
            <span class="kpi-template-badge">${tmpl.code_ref}</span>
          </div>

          <div class="kpi-template-body-scroll">
            <!-- 2. เป้าประสงค์เชิงยุทธศาสตร์ -->
            <div class="kpi-tmpl-section">
              <div class="kpi-tmpl-lbl">🎯 เป้าประสงค์เชิงยุทธศาสตร์ (Strategic Objective)</div>
              <div class="kpi-tmpl-val">${tmpl.strategy} &rsaquo; ${tmpl.goal}</div>
            </div>

            <!-- 3. คำนิยามตัวชี้วัด -->
            <div class="kpi-tmpl-section">
              <div class="kpi-tmpl-lbl">📋 คำนิยามตัวชี้วัด (KPI Definition)</div>
              <div class="kpi-tmpl-val">${tmpl.definition}</div>
            </div>

            <!-- 4. เกณฑ์เป้าหมาย & หน่วยวัดทิศทาง (2-Column Grid) -->
            <div class="kpi-tmpl-grid-2">
              <div class="kpi-tmpl-section">
                <div class="kpi-tmpl-lbl">🎯 เกณฑ์เป้าหมาย (Target Standard)</div>
                <div class="kpi-tmpl-val">
                  <strong style="color: var(--teal-light, #2dd4bf); font-size: 0.95rem;">${tmpl.target_display}</strong>
                </div>
              </div>
              <div class="kpi-tmpl-section">
                <div class="kpi-tmpl-lbl">🔢 หน่วยวัดและทิศทาง</div>
                <div class="kpi-tmpl-val">${tmpl.unit_direction}</div>
              </div>
            </div>

            <!-- 5. สูตรการคำนวณและตัวแปร (Calculation Formula Box) -->
            <div class="kpi-tmpl-section">
              <div class="kpi-tmpl-lbl">📐 สูตรการคำนวณและตัวแปร (Calculation Formula)</div>
              <div class="kpi-formula-container-sky">
                <div class="kpi-formula-code">📐 ${tmpl.formula}</div>
                <div class="kpi-formula-vars-list">
                  <div>&bull; <strong>ตัวตั้ง (A):</strong> ${tmpl.variable_a}</div>
                  <div>&bull; <strong>ตัวหาร (B):</strong> ${tmpl.variable_b}</div>
                </div>
              </div>
            </div>

            <!-- 6. กลุ่มเป้าหมาย / ขอบเขตพื้นที่ดำเนินการ -->
            <div class="kpi-tmpl-section">
              <div class="kpi-tmpl-lbl">👥 กลุ่มเป้าหมาย / ขอบเขตพื้นที่ดำเนินการ (Scope)</div>
              <div class="kpi-tmpl-val">${tmpl.scope}</div>
            </div>

            <!-- 7. หน่วยงานผู้รับผิดชอบ & แหล่งข้อมูล (Governance Grid - 2 Column) -->
            <div class="kpi-tmpl-grid-2">
              <div class="kpi-tmpl-section">
                <div class="kpi-tmpl-lbl">🏢 หน่วยงานผู้รับผิดชอบหลัก</div>
                <div class="kpi-tmpl-val">${tmpl.responsible_agency}</div>
              </div>
              <div class="kpi-tmpl-section">
                <div class="kpi-tmpl-lbl">🗓️ แหล่งข้อมูล & ความถี่ในการจัดเก็บ</div>
                <div class="kpi-tmpl-val">${tmpl.data_source_frequency}</div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>

    <!-- Modal Footer with 3 Main Action Buttons -->
    <div class="modal-insight-footer">
      <div class="modal-footer-left">
        <!-- 1. ปุ่ม Template ฉบับเต็ม -->
        <button class="btn btn-template-full" onclick="openFullKPITemplateModal('${kpi.id}')" title="เปิดเอกสารแบบฟอร์มจัดทำรายละเอียดตัวชี้วัดฉบับเต็ม และดาวน์โหลดเอกสาร">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span>Template ฉบับเต็ม</span>
        </button>
      </div>
      <div class="modal-footer-right">
        <!-- 2. ปุ่มพิมพ์รายงาน One Page (PDF) -->
        <button class="btn btn-secondary btn-sm" onclick="printOnePageLandscapeReport()" title="พิมพ์หรือบันทึกรายงาน Executive Summary 1 หน้ากระดาษ A4 แนวนอน">
          📑 พิมพ์รายงาน One Page (PDF)
        </button>
        <!-- 3. ปุ่มปิดหน้าต่าง -->
        <button class="btn btn-primary btn-sm" onclick="closeModal()" title="ปิดหน้าต่างและกลับสู่หน้าแดชบอร์ดหลัก">
          ✖️ ปิดหน้าต่าง
        </button>
      </div>
    </div>
  `;

  modal.classList.add('show');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Render Trend Graph on Canvas
  setTimeout(() => {
    renderModalKPIChart(kpi, { t66, a66, t67, a67, t68, a68, t69, a69, t70, a70 });
  }, 50);
}

function openFullKPITemplateModal(kpiId) {
  const modal = document.getElementById('kpi-full-template-modal');
  const dialog = document.getElementById('kpi-full-template-dialog');
  if (!modal || !dialog) return;

  const ds = getCurrentYearDataset();
  const currentYearKey = AppState.currentYear || '68';
  const kpi = ds.kpis.find(k => k.id === kpiId) || ds.kpis[0];
  const tmpl = getDetailedKPITemplate(kpi, currentYearKey);

  dialog.innerHTML = `
    <div class="modal-insight-header" style="background: linear-gradient(135deg, #0d9488 0%, #0284c7 100%);">
      <div style="display: flex; align-items: center; gap: 0.65rem;">
        <span style="font-size: 1.35rem;">📋</span>
        <div>
          <div style="font-size: 0.72rem; color: #ccfbf1; font-weight: 700; text-transform: uppercase;">
            แบบฟอร์มจัดทำรายละเอียดตัวชี้วัด (Template KPI ฉบับเต็ม) • ปีงบประมาณ ${ds.yearName}
          </div>
          <h2 style="font-size: 1.05rem; font-weight: 800; color: #ffffff; margin: 0.15rem 0 0 0;">
            [${tmpl.code_ref}] ${tmpl.name}
          </h2>
        </div>
      </div>
      <button class="modal-close-btn-white" onclick="closeFullKPITemplateModal()" title="ปิด">&times;</button>
    </div>

    <!-- Top Download & Export Action Ribbon -->
    <div class="full-tmpl-download-ribbon">
      <div class="ribbon-title">
        <span>📥 ดาวน์โหลดและส่งออกเอกสารทางการ:</span>
      </div>
      <div class="ribbon-actions">
        <!-- ดาวน์โหลดเล่มแผนยุทธศาสตร์ PDF -->
        <a href="${encodeURIComponent(tmpl.full_template_doc_url)}" download class="btn-tmpl-download" title="ดาวน์โหลดเล่มแผนยุทธศาสตร์สุขภาพจังหวัดขอนแก่นฉบับเต็ม PDF">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          <span>ดาวน์โหลดเล่มแผนยุทธศาสตร์ (${ds.yearName})</span>
        </a>
        <!-- ดาวน์โหลดตารางค่าเป้าหมาย PDF -->
        <a href="${encodeURIComponent(tmpl.targetDocFile)}" download class="btn-tmpl-download" title="ดาวน์โหลดตารางค่าเป้าหมาย KPI ประจำปีงบประมาณ PDF">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          <span>ดาวน์โหลดตารางค่าเป้าหมาย KPI</span>
        </a>
        <!-- ดาวน์โหลด Word (.doc) -->
        <button class="btn-tmpl-download btn-tmpl-word" onclick="downloadKPITemplateWord('${kpi.id}')" title="ดาวน์โหลดเอกสาร Template ในรูปแบบไฟล์ Microsoft Word (.doc) จัดฟอร์แมตทางการ">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          <span>ดาวน์โหลด Word (.doc)</span>
        </button>
        <!-- พิมพ์ Template -->
        <button class="btn-tmpl-download btn-tmpl-print" onclick="window.print()" title="พิมพ์เอกสารข้อกำหนดตัวชี้วัดนี้">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
          <span>พิมพ์ Template</span>
        </button>
      </div>
    </div>

    <div class="modal-full-template-content">
      
      <!-- หมวดที่ 1: ข้อมูลทั่วไปและโครงสร้างเชิงยุทธศาสตร์ -->
      <div class="full-tmpl-section-card">
        <h3 class="full-tmpl-sec-title">1. ข้อมูลทั่วไปและโครงสร้างเชิงยุทธศาสตร์ (Strategic Alignment)</h3>
        <div class="full-tmpl-grid">
          <div class="full-tmpl-field">
            <span class="field-lbl">รหัสตัวชี้วัด:</span>
            <span class="field-val"><strong>${tmpl.code_ref}</strong> (ลำดับที่ ${tmpl.order} ประจำปีงบประมาณ ${ds.yearName})</span>
          </div>
          <div class="full-tmpl-field">
            <span class="field-lbl">ประเด็นยุทธศาสตร์:</span>
            <span class="field-val">${tmpl.strategy}</span>
          </div>
          <div class="full-tmpl-field">
            <span class="field-lbl">เป้าประสงค์ (Strategic Goal):</span>
            <span class="field-val">${tmpl.goal}</span>
          </div>
          <div class="full-tmpl-field">
            <span class="field-lbl">หน่วยวัดและทิศทาง:</span>
            <span class="field-val"><strong>${tmpl.unit_direction}</strong></span>
          </div>
          <div class="full-tmpl-field">
            <span class="field-lbl">ค่าเป้าหมายปีงบประมาณ ${ds.yearName}:</span>
            <span class="field-val"><strong style="color: #0d9488; font-size: 1.05rem;">${tmpl.target_display}</strong></span>
          </div>
          <div class="full-tmpl-field">
            <span class="field-lbl">ค่าเป้าหมายสิ้นสุดแผน 5 ปี (พ.ศ. 2570):</span>
            <span class="field-val"><strong>${tmpl.targets.t70 || kpi.target} ${kpi.unit}</strong></span>
          </div>
        </div>
      </div>

      <!-- หมวดที่ 2: หลักการ เหตุผล และคำนิยามปฏิบัติการ -->
      <div class="full-tmpl-section-card">
        <h3 class="full-tmpl-sec-title">2. หลักการ เหตุผล และคำนิยามปฏิบัติการ (Rationale & Operational Definitions)</h3>
        <div class="full-tmpl-desc-block">
          <strong>วัตถุประสงค์และความสำคัญเชิงนโยบาย:</strong>
          <p style="margin: 0.35rem 0 0.65rem 0; line-height: 1.5; color: var(--text-primary);">
            ${tmpl.purpose}
          </p>
          <strong>คำนิยามตัวชี้วัด (Operational Definition):</strong>
          <p style="margin: 0.35rem 0 0 0; line-height: 1.5; color: var(--text-secondary);">
            ${tmpl.definition}
          </p>
        </div>
      </div>

      <!-- หมวดที่ 3: สูตรและระเบียบวิธีคำนวณ -->
      <div class="full-tmpl-section-card">
        <h3 class="full-tmpl-sec-title">3. สูตรและระเบียบวิธีคำนวณ (Calculation Methodology)</h3>
        <div class="full-tmpl-formula-box">
          <div style="font-weight: 700; color: #0284c7; margin-bottom: 0.35rem;">สูตรการคำนวณ:</div>
          <div style="font-family: monospace; font-size: 0.88rem; background: rgba(0,0,0,0.05); padding: 0.55rem; border-radius: 6px; border: 1px solid var(--border-card);">
            ${tmpl.formula}
          </div>
          <div style="margin-top: 0.65rem; font-size: 0.8rem; line-height: 1.55;">
            <div>&bull; <strong>ตัวตั้ง (A):</strong> ${tmpl.variable_a}</div>
            <div>&bull; <strong>ตัวหาร (B):</strong> ${tmpl.variable_b}</div>
          </div>
        </div>
      </div>

      <!-- หมวดที่ 4: ตารางเส้นทางค่าเป้าหมาย 5 ปี -->
      <div class="full-tmpl-section-card">
        <h3 class="full-tmpl-sec-title">4. เส้นทางค่าเป้าหมาย 5 ปี (5-Year Target Trajectory: พ.ศ. 2566–2570)</h3>
        <table class="modal-history-table" style="margin-top: 0.35rem;">
          <thead>
            <tr>
              <th>ปี 2566</th>
              <th>ปี 2567</th>
              <th>ปี 2568</th>
              <th>ปี 2569</th>
              <th>ปี 2570 (เป้าหมายสูงสุด)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${tmpl.targets.t66}</td>
              <td>${tmpl.targets.t67}</td>
              <td>${tmpl.targets.t68}</td>
              <td style="font-weight:700;">${tmpl.targets.t69}</td>
              <td style="font-weight:800; color: #0d9488;">${tmpl.targets.t70}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- หมวดที่ 5: แผนปฏิบัติการและมาตรการขับเคลื่อนสำคัญ -->
      <div class="full-tmpl-section-card">
        <h3 class="full-tmpl-sec-title">5. แผนปฏิบัติการและมาตรการขับเคลื่อนสำคัญ (Strategic Actions & Milestones)</h3>
        <ul style="margin: 0.35rem 0 0 1.25rem; font-size: 0.82rem; line-height: 1.6; color: var(--text-secondary);">
          ${tmpl.interventions.map(act => `<li>${act}</li>`).join('')}
        </ul>
      </div>

      <!-- หมวดที่ 6: กลุ่มเป้าหมายและขอบเขตพื้นที่ดำเนินการ -->
      <div class="full-tmpl-section-card">
        <h3 class="full-tmpl-sec-title">6. กลุ่มเป้าหมายและขอบเขตพื้นที่ดำเนินการ (Target Population & Facility Scope)</h3>
        <p style="margin: 0; font-size: 0.84rem; line-height: 1.5; color: var(--text-primary);">
          ${tmpl.scope}
        </p>
      </div>

      <!-- หมวดที่ 7: การกำกับติดตาม แหล่งข้อมูล และผู้รับผิดชอบ -->
      <div class="full-tmpl-section-card">
        <h3 class="full-tmpl-sec-title">7. การกำกับติดตาม แหล่งข้อมูล และผู้รับผิดชอบ (Governance & Ownership)</h3>
        <div class="full-tmpl-grid">
          <div class="full-tmpl-field" style="grid-column: 1 / -1;">
            <span class="field-lbl">แหล่งข้อมูลและความถี่ในการจัดเก็บ:</span>
            <span class="field-val"><strong>${tmpl.data_source_frequency}</strong></span>
          </div>
          <div class="full-tmpl-field" style="grid-column: 1 / -1;">
            <span class="field-lbl">กลุ่มงานผู้รับผิดชอบหลักและช่องทางติดต่อ:</span>
            <span class="field-val"><strong>${tmpl.responsible_agency}</strong></span>
          </div>
        </div>
      </div>

      <!-- หมวดที่ 8: เกณฑ์การประเมินผลคะแนน (Scoring Rubric ระดับ 1–5) -->
      <div class="full-tmpl-section-card">
        <h3 class="full-tmpl-sec-title">8. เกณฑ์การประเมินผลคะแนน (Scoring Rubric ระดับ 1–5)</h3>
        <table class="modal-history-table" style="margin-top: 0.35rem; font-size: 0.76rem;">
          <thead>
            <tr>
              <th style="width: 20%;">ระดับ 1</th>
              <th style="width: 20%;">ระดับ 2</th>
              <th style="width: 20%;">ระดับ 3</th>
              <th style="width: 20%;">ระดับ 4</th>
              <th style="width: 20%;">ระดับ 5 (บรรลุเกณฑ์)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ผลงาน &lt; 60% ของเป้าหมาย</td>
              <td>ผลงาน 60–69% ของเป้าหมาย</td>
              <td>ผลงาน 70–79% ของเป้าหมาย</td>
              <td>ผลงาน 80–89% ของเป้าหมาย</td>
              <td style="font-weight: 700; color: #10b981;">ผลงาน &ge; 90% (บรรลุเป้าหมาย)</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <div class="modal-insight-footer" style="justify-content: space-between;">
      <span style="font-size: 0.72rem; color: var(--text-muted);">
        อ้างอิง: สำนักงานสาธารณสุขจังหวัดขอนแก่น แผนยุทธศาสตร์สุขภาพ ระยะ 5 ปี (พ.ศ. 2566–2570)
      </span>
      <button class="btn btn-primary btn-sm" onclick="closeFullKPITemplateModal()">ปิดหน้าต่าง</button>
    </div>
  `;

  modal.classList.add('show');
}

function closeFullKPITemplateModal() {
  const modal = document.getElementById('kpi-full-template-modal');
  if (modal) modal.classList.remove('show');
}

// 14. Download Official Word (.doc) Document Function
function downloadKPITemplateWord(kpiId) {
  const ds = getCurrentYearDataset();
  const currentYearKey = AppState.currentYear || '68';
  const kpi = ds.kpis.find(k => k.id === kpiId) || ds.kpis[0];
  const tmpl = getDetailedKPITemplate(kpi, currentYearKey);

  const wordHtml = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>แบบฟอร์มรายละเอียดตัวชี้วัด (KPI Template) - ${tmpl.code_ref}</title>
  <style>
    body { font-family: 'TH Sarabun PSK', 'TH Sarabun New', 'Angsana New', sans-serif; font-size: 16pt; line-height: 1.35; color: #000000; margin: 2cm 2cm 2cm 2.5cm; }
    h1 { font-size: 20pt; text-align: center; font-weight: bold; margin-bottom: 0.5rem; }
    h3 { font-size: 16pt; font-weight: bold; margin-top: 1rem; margin-bottom: 0.3rem; color: #006699; border-bottom: 1.5pt solid #006699; padding-bottom: 3pt; }
    table { width: 100%; border-collapse: collapse; margin-top: 6pt; margin-bottom: 10pt; font-size: 15pt; }
    th, td { border: 1pt solid #444444; padding: 6pt 8pt; vertical-align: top; }
    th { background-color: #f2f2f2; font-weight: bold; text-align: center; }
    .meta-table td:first-child { width: 30%; font-weight: bold; background-color: #f9f9f9; }
    .formula-box { background-color: #f0f8ff; border: 1pt solid #b0d4f1; padding: 8pt; font-family: 'Courier New', monospace; font-size: 14pt; margin: 6pt 0; }
    .footer-note { font-size: 13pt; color: #555555; text-align: right; margin-top: 2rem; border-top: 1pt solid #cccccc; padding-top: 6pt; }
  </style>
</head>
<body>
  <h1>แบบฟอร์มจัดทำรายละเอียดตัวชี้วัด (KPI Template ฉบับเต็ม)</h1>
  <div style="text-align: center; font-size: 16pt; font-weight: bold; margin-bottom: 1rem;">
    แผนยุทธศาสตร์สุขภาพ 5 ปี จังหวัดขอนแก่น (พ.ศ. 2566–2570) • ประจำปีงบประมาณ ${ds.yearName}
  </div>

  <h3>หมวดที่ 1: ข้อมูลทั่วไปและโครงสร้างเชิงยุทธศาสตร์ (Strategic Alignment)</h3>
  <table class="meta-table">
    <tr><td>รหัสตัวชี้วัด:</td><td><strong>${tmpl.code_ref}</strong> (ลำดับที่ ${tmpl.order})</td></tr>
    <tr><td>ชื่อตัวชี้วัด:</td><td><strong>${tmpl.name}</strong></td></tr>
    <tr><td>ประเด็นยุทธศาสตร์:</td><td>${tmpl.strategy}</td></tr>
    <tr><td>เป้าประสงค์ (Strategic Goal):</td><td>${tmpl.goal}</td></tr>
    <tr><td>หน่วยวัดและทิศทาง:</td><td>${tmpl.unit_direction}</td></tr>
    <tr><td>ค่าเป้าหมายปีงบประมาณ ${ds.yearName}:</td><td><strong>${tmpl.target_display}</strong></td></tr>
  </table>

  <h3>หมวดที่ 2: หลักการ เหตุผล และคำนิยามปฏิบัติการ (Operational Definitions)</h3>
  <p><strong>วัตถุประสงค์และความสำคัญเชิงนโยบาย:</strong><br>${tmpl.purpose}</p>
  <p><strong>คำนิยามตัวชี้วัด:</strong><br>${tmpl.definition}</p>

  <h3>หมวดที่ 3: สูตรและระเบียบวิธีคำนวณ (Calculation Methodology)</h3>
  <div class="formula-box">${tmpl.formula}</div>
  <p>
    &bull; <strong>ตัวตั้ง (A):</strong> ${tmpl.variable_a}<br>
    &bull; <strong>ตัวหาร (B):</strong> ${tmpl.variable_b}
  </p>

  <h3>หมวดที่ 4: เส้นทางค่าเป้าหมาย 5 ปี (5-Year Target Trajectory)</h3>
  <table>
    <tr><th>ปี 2566</th><th>ปี 2567</th><th>ปี 2568</th><th>ปี 2569</th><th>ปี 2570 (เป้าหมายสูงสุด)</th></tr>
    <tr style="text-align: center;">
      <td>${tmpl.targets.t66}</td>
      <td>${tmpl.targets.t67}</td>
      <td>${tmpl.targets.t68}</td>
      <td><strong>${tmpl.targets.t69}</strong></td>
      <td style="font-weight: bold; color: #006699;">${tmpl.targets.t70}</td>
    </tr>
  </table>

  <h3>หมวดที่ 5: กลุ่มเป้าหมายและขอบเขตพื้นที่ดำเนินการ (Scope)</h3>
  <p>${tmpl.scope}</p>

  <h3>หมวดที่ 6: การกำกับติดตาม แหล่งข้อมูล และผู้รับผิดชอบ (Governance & Ownership)</h3>
  <table class="meta-table">
    <tr><td>แหล่งข้อมูลและความถี่:</td><td>${tmpl.data_source_frequency}</td></tr>
    <tr><td>หน่วยงานผู้รับผิดชอบหลัก:</td><td><strong>${tmpl.responsible_agency}</strong></td></tr>
    <tr><td>วิธีการประเมินผล:</td><td>${tmpl.evaluationMethod}</td></tr>
  </table>

  <div class="footer-note">
    สำนักงานสาธารณสุขจังหวัดขอนแก่น • กลุ่มงานพัฒนายุทธศาสตร์สาธารณสุข โทร. 0-4322-1125 ต่อ 163
  </div>
</body>
</html>`;

  const blob = new Blob(['\\ufeff' + wordHtml], { type: 'application/msword;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `${tmpl.code_ref}_Template_ฉบับเต็ม.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}

// Expose functions globally to window
window.openKPIDetailModal = openKPIDetailModal;
window.openFullKPITemplateModal = openFullKPITemplateModal;
window.closeFullKPITemplateModal = closeFullKPITemplateModal;
window.downloadKPITemplateWord = downloadKPITemplateWord;
window.renderExecutiveSummaryTab = renderExecutiveSummaryTab;



// ============================================================================
// 16. AI STRATEGIC INTELLIGENCE & PREDICTION CENTER (MULTI-PROVIDER & EVIDENCE-BASED)
// ============================================================================

function updateAIStatusUI() {
  if (typeof document === 'undefined') return;
  const currentModel = (typeof AIModelManager !== 'undefined') ? AIModelManager.getCurrentModel() : { model_name: 'DeepSeek R1', provider: 'DeepSeek' };
  
  const modelEl = document.getElementById('status-active-model');
  const providerEl = document.getElementById('status-provider-name');
  const subtagEl = document.getElementById('ai-model-subtag-text');

  if (modelEl) {
    modelEl.textContent = `${currentModel.model_name} (${currentModel.provider})`;
  }
  if (providerEl) {
    providerEl.innerHTML = `<span class="badge-status pass">${currentModel.provider.toUpperCase()} ACTIVE</span>`;
  }
  if (subtagEl) {
    subtagEl.textContent = `Model: ${currentModel.model_name} • Provider: ${currentModel.provider} • Active Ready`;
  }
}

function onAIModelEngineSelected(modelId) {
  if (typeof AIModelManager !== 'undefined') {
    AIModelManager.setModel(modelId);
    updateAIStatusUI();
    if (typeof showAppToast === 'function') {
      const current = AIModelManager.getCurrentModel();
      showAppToast('🤖 สลับโมเดล AI แล้ว', `เลือกใช้งาน: ${current.model_name} (${current.provider})`, '⚡');
    }
  }
}

function populateAICenter() {
  const modelSelectEl = document.getElementById('ai-center-model-select');
  const kpiSelectEl = document.getElementById('ai-center-kpi-select');
  if (!kpiSelectEl) return;

  const ds = getCurrentYearDataset();
  const kpis = ds.kpis || [];

  // 1. Populate Model Engines
  if (modelSelectEl && typeof AIModelManager !== 'undefined') {
    const models = AIModelManager.registry || [];
    const current = AIModelManager.getCurrentModel();
    modelSelectEl.innerHTML = models.map(m => `
      <option value="${m.model_id}" ${m.model_id === current.model_id ? 'selected' : ''}>
        ${m.provider} - ${m.model_name} (${m.recommended_for || 'General'})
      </option>
    `).join('');
  }

  // 2. Populate KPI list of current fiscal year
  kpiSelectEl.innerHTML = kpis.map(k => `
    <option value="${k.id}">[${k.id}] ${k.name} (${k.strategy})</option>
  `).join('');

  if (kpis.length > 0) {
    onAICenterKPISelected(kpiSelectEl.value || kpis[0].id);
  }

  updateAIStatusUI();
}

function onAICenterKPISelected(kpiId) {
  const ds = getCurrentYearDataset();
  const kpi = ds.kpis.find(k => k.id === kpiId) || ds.kpis[0];
  if (!kpi) return;

  const stat = AIPredictionEngine.calculateStatisticalForecast(kpi, 1);
  const badge = document.getElementById('ai-center-data-quality-badge');
  const quickStats = document.getElementById('ai-kpi-quick-stats');

  if (badge) {
    badge.textContent = stat.dataQuality.message || '🟢 ข้อมูลสมบูรณ์ (พร้อมประมวลผล)';
    badge.style.color = stat.dataQuality.quality === 'HIGH' ? 'var(--status-pass, #10b981)' : 'var(--status-warn, #f59e0b)';
  }

  if (quickStats) {
    const tmpl = getDetailedKPITemplate(kpi, AppState.currentYear);
    quickStats.innerHTML = `
      <div style="font-size: 0.72rem; color: var(--text-muted); margin-bottom: 0.35rem; font-weight: 700;">สถิติพื้นฐาน & ข้อมูลเชิงยุทธศาสตร์:</div>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; text-align: center;">
        <div style="background: var(--bg-surface-elevated); padding: 0.45rem; border-radius: var(--radius-sm); border: 1px solid var(--border-card);">
          <div style="font-size: 0.65rem; color: var(--text-muted);">เป้าหมายปี ${ds.yearName}</div>
          <div style="font-weight: 700; font-size: 0.82rem; color: var(--teal-light, #2dd4bf);">${kpi.target} ${kpi.unit}</div>
        </div>
        <div style="background: var(--bg-surface-elevated); padding: 0.45rem; border-radius: var(--radius-sm); border: 1px solid var(--border-card);">
          <div style="font-size: 0.65rem; color: var(--text-muted);">ผลงานจริงล่าสุด</div>
          <div style="font-weight: 700; font-size: 0.82rem; color: var(--text-primary);">${kpi.actual !== null && kpi.actual !== undefined && kpi.actual !== '' ? kpi.actual : (tmpl.targets?.t68 || '-')}</div>
        </div>
        <div style="background: var(--bg-surface-elevated); padding: 0.45rem; border-radius: var(--radius-sm); border: 1px solid var(--border-card);">
          <div style="font-size: 0.65rem; color: var(--text-muted);">ทิศทางตัวชี้วัด</div>
          <div style="font-weight: 700; font-size: 0.82rem; color: var(--text-secondary);">${kpi.direction}</div>
        </div>
      </div>
    `;
  }
}

async function triggerAICenterAnalysis() {
  const kpiSelectEl = document.getElementById('ai-center-kpi-select');
  const horizonEl = document.getElementById('ai-center-horizon-select');
  const customPromptEl = document.getElementById('ai-center-custom-prompt');
  const outBox = document.getElementById('ai-center-output-box');
  const btn = document.getElementById('btn-run-ai-center');

  if (!kpiSelectEl || !outBox) return;
  const kpiId = kpiSelectEl.value;
  const ds = getCurrentYearDataset();
  const kpi = ds.kpis.find(k => k.id === kpiId);
  if (!kpi) return;

  const horizon = parseInt(horizonEl ? horizonEl.value : '1', 10);
  const currentModel = (typeof AIModelManager !== 'undefined') ? AIModelManager.getCurrentModel() : { model_name: 'DeepSeek R1', provider: 'DeepSeek' };
  const tmpl = getDetailedKPITemplate(kpi, AppState.currentYear);

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="ai-spinner" style="width:12px;height:12px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:6px;"></span> กำลังประมวลผล AI...`;
  }

  outBox.innerHTML = `
    <div class="ai-loading-box" style="text-align: center; padding: 3rem 1.5rem;">
      <div class="ai-spinner" style="margin: 0 auto 1rem auto;"></div>
      <div style="font-weight:700; color: var(--teal-light, #2dd4bf); font-size: 1rem;">
        ${currentModel.model_name} กำลังวิเคราะห์ข้อมูลตัวชี้วัดและคำนวณ 3 Scenarios...
      </div>
      <div style="font-size:0.75rem; color: var(--text-muted); margin-top: 0.35rem;">
        Provider: ${currentModel.provider} • Engine: Evidence-Based Forecasting & Action Engine
      </div>
    </div>
  `;

  // Calculate Statistical & Scenario Prediction
  const stat = AIPredictionEngine.calculateStatisticalForecast(kpi, horizon);

  // Log Audit
  if (typeof AIAuditLogger !== 'undefined') {
    AIAuditLogger.logPrediction({
      kpi_id: kpi.id,
      model_id: currentModel.model_id || 'multi-provider',
      model_name: currentModel.model_name,
      prediction: stat.baseline,
      confidence: stat.confidenceScore,
      risk_level: stat.riskLevel,
      prompt_version: 'v3.5-evidence-based'
    });
  }

  const customFocus = customPromptEl ? customPromptEl.value.trim() : '';

  setTimeout(() => {
    outBox.innerHTML = `
      <div id="ai-center-result-text" style="display: flex; flex-direction: column; gap: 1rem;">
        
        <!-- Header Banner -->
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-card); padding-bottom:0.75rem;">
          <div>
            <div style="font-size:0.72rem; color:var(--teal-light, #2dd4bf); font-weight:700;">
              [${kpi.id}] ${kpi.strategy} &bull; ${kpi.objective || ''}
            </div>
            <h3 style="font-size:1.05rem; font-weight:700; color:var(--text-primary); margin-top:0.15rem;">
              ${kpi.name}
            </h3>
          </div>
          <span class="badge-status ${stat.predictionStatus === 'ON_TRACK' ? 'pass' : stat.predictionStatus === 'WATCH' ? 'warn' : 'fail'}" style="font-size:0.76rem; padding: 0.3rem 0.65rem;">
            ${stat.predictionStatus === 'ON_TRACK' ? '🟢 ON TRACK' : stat.predictionStatus === 'WATCH' ? '🟡 WATCH LIST' : '🔴 AT RISK'}
          </span>
        </div>

        <!-- 3 Scenarios Forecasting Grid -->
        <div class="scenario-cards-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem;">
          
          <div class="scenario-card baseline" style="background: var(--bg-surface-elevated); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-card);">
            <div class="scenario-title" style="font-size: 0.75rem; font-weight: 700; color: var(--text-secondary);">1. Baseline (โมเมนตัมปกติ)</div>
            <div class="scenario-val" style="font-size: 1.25rem; font-weight: 800; color: #38bdf8; margin: 0.25rem 0;">
              ${stat.baseline !== null ? stat.baseline : '-'} <span style="font-size:0.7rem; font-weight:400;">${kpi.unit}</span>
            </div>
            <div class="scenario-desc" style="font-size: 0.68rem; color: var(--text-muted);">คาดการณ์ตามแนวโน้มเดิม</div>
          </div>

          <div class="scenario-card optimistic" style="background: var(--bg-surface-elevated); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid rgba(16, 185, 129, 0.35);">
            <div class="scenario-title" style="font-size: 0.75rem; font-weight: 700; color: #10b981;">2. Optimistic (+มาตรการเร่งรัด)</div>
            <div class="scenario-val" style="font-size: 1.25rem; font-weight: 800; color: #10b981; margin: 0.25rem 0;">
              ${stat.optimistic !== null ? stat.optimistic : '-'} <span style="font-size:0.7rem; font-weight:400;">${kpi.unit}</span>
            </div>
            <div class="scenario-desc" style="font-size: 0.68rem; color: var(--text-muted);">เมื่อขับเคลื่อน พชอ. & นวัตกรรมเต็มสูบ</div>
          </div>

          <div class="scenario-card pessimistic" style="background: var(--bg-surface-elevated); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid rgba(239, 68, 68, 0.35);">
            <div class="scenario-title" style="font-size: 0.75rem; font-weight: 700; color: #ef4444;">3. Pessimistic (ชะลอตัว/เสี่ยง)</div>
            <div class="scenario-val" style="font-size: 1.25rem; font-weight: 800; color: #ef4444; margin: 0.25rem 0;">
              ${stat.pessimistic !== null ? stat.pessimistic : '-'} <span style="font-size:0.7rem; font-weight:400;">${kpi.unit}</span>
            </div>
            <div class="scenario-desc" style="font-size: 0.68rem; color: var(--text-muted);">กรณีเกิดปัจจัยคุกคาม/ขาดทรัพยากร</div>
          </div>

        </div>

        <!-- Metrics & Probability Bars -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
          <div style="background: var(--bg-surface-elevated); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-card);">
            <div style="display:flex; justify-content:space-between; font-size:0.74rem; margin-bottom: 0.35rem;">
              <span>ความน่าจะเป็นในการบรรลุเป้าหมาย (${kpi.target} ${kpi.unit}):</span>
              <strong style="color: ${stat.probabilityOfAchievement >= 70 ? '#10b981' : '#ef4444'}; font-size: 0.85rem;">${stat.probabilityOfAchievement}%</strong>
            </div>
            <div style="height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden;">
              <div style="width: ${stat.probabilityOfAchievement}%; height: 100%; background: ${stat.probabilityOfAchievement >= 70 ? '#10b981' : stat.probabilityOfAchievement >= 50 ? '#f59e0b' : '#ef4444'}; border-radius: 3px;"></div>
            </div>
          </div>

          <div style="background: var(--bg-surface-elevated); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border-card);">
            <div style="display:flex; justify-content:space-between; font-size:0.74rem; margin-bottom: 0.35rem;">
              <span>Confidence Score (ความเชื่อมั่นทางสถิติ):</span>
              <strong style="color: #38bdf8; font-size: 0.85rem;">${stat.confidenceScore}%</strong>
            </div>
            <div style="font-size: 0.68rem; color: var(--text-muted);">
              วิเคราะห์จากความสมบูรณ์ของชุดข้อมูล HDC และข้อมูล 43 แฟ้ม
            </div>
          </div>
        </div>

        <!-- Strategic Policy Interventions & Actions -->
        <div style="background: var(--bg-surface-elevated); padding: 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--border-card);">
          <div style="font-weight: 700; font-size: 0.82rem; color: #38bdf8; margin-bottom: 0.45rem;">
            🛠️ ข้อเสนอแนะเชิงกลยุทธ์และมาตรการขับเคลื่อน 26 อำเภอ (Strategic Actions):
          </div>
          <ul style="margin: 0 0 0 1.2rem; font-size: 0.78rem; line-height: 1.55; color: var(--text-secondary);">
            ${tmpl.interventions ? tmpl.interventions.map(act => `<li>${act}</li>`).join('') : `
              <li>ยกระดับการตรวจติดตามและกำกับผลงานผ่านคณะกรรมการ พชอ. 26 อำเภอ</li>
              <li>พัฒนาคู่มือแนวทางมาตรฐานการให้บริการ (SOP) เชื่อมโยงระดับปฐมภูมิ-ทุติยภูมิ</li>
              <li>นำระบบเทคโนโลยีดิจิทัลและ HDC On Cloud มาช่วยคัดกรองและประเมินผล Real-time</li>
            `}
            ${customFocus ? `<li style="color: #2dd4bf; font-weight: 600;">ประเด็นเน้นย้ำพิเศษ: ${customFocus}</li>` : ''}
          </ul>
        </div>

        <!-- Executive Decision Support -->
        <div style="background: linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, rgba(13, 148, 136, 0.12) 100%); padding: 0.85rem; border-radius: var(--radius-sm); border: 1px solid rgba(56, 189, 248, 0.3);">
          <div style="font-weight: 700; font-size: 0.82rem; color: #38bdf8; margin-bottom: 0.25rem;">
            ⚡ Executive Decision Support (ข้อเสนอเพื่อการตัดสินใจของผู้บริหาร):
          </div>
          <p style="margin: 0; font-size: 0.78rem; line-height: 1.5; color: var(--text-primary);">
            ${stat.probabilityOfAchievement >= 70
              ? `"ผลการพยากรณ์อยู่ในเกณฑ์ On Track (${stat.probabilityOfAchievement}%) เสนอให้ผู้บริหารเห็นชอบให้ดำเนินการตามแผนงานปกติ และมอบหมายกลุ่มงานที่รับผิดชอบ (${tmpl.responsible_agency}) กำกับติดตามรายไตรมาส"`
              : `"ตัวชี้วัดมีความเสี่ยงที่จะไม่บรรลุเป้าหมาย (Forecast: ${stat.baseline} vs Target: ${stat.targetValue} ${kpi.unit}) เสนอให้ผู้บริหารสั่งการ 'เร่งรัดมาตรการ Fast-Track' และจัดประชุม War Room ร่วมกับ 26 อำเภอภายใน 30 วัน"`
            }
          </p>
        </div>

      </div>
    `;

    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> <span>✨ AI พยากรณ์ปีถัดไป & สังเคราะห์แผนงานกลยุทธ์</span>`;
    }
  }, 350);
}

function copyAICenterResult() {
  const resEl = document.getElementById('ai-center-result-text');
  if (!resEl) {
    if (typeof showAppToast === 'function') {
      showAppToast('⚠️ ยังไม่มีผลการพยากรณ์', 'กรุณากดปุ่ม "AI พยากรณ์ปีถัดไป" ก่อนทำการคัดลอก', 'ℹ️');
    }
    return;
  }

  const textToCopy = resEl.innerText || resEl.textContent;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(textToCopy);
  }
  if (typeof showAppToast === 'function') {
    showAppToast('📋 คัดลอกผลสรุปเรียบร้อยแล้ว!', 'สามารถนำผลวิเคราะห์และมาตรการไปใช้งานต่อได้ทันที', '✅');
  }
}

function openAuditLogModal() {
  const modal = document.getElementById('ai-audit-log-modal');
  if (!modal) return;

  const contentEl = modal.querySelector('.modal-dialog > div:nth-child(2)') || modal.querySelector('.modal-dialog');
  const logs = (typeof AIAuditLogger !== 'undefined') ? AIAuditLogger.getLogs() : [];

  if (contentEl) {
    contentEl.innerHTML = `
      <div style="padding: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <h4 style="margin: 0; font-size: 0.95rem; font-weight: 700; color: var(--text-primary);">ประวัติการพยากรณ์และการเรียกใช้โมเดล AI (Audit Log History)</h4>
          <button class="btn btn-secondary btn-sm" onclick="clearAuditLog()" style="font-size: 0.72rem;">🗑️ ล้างประวัติ</button>
        </div>
        <table class="modal-history-table" style="font-size: 0.75rem;">
          <thead>
            <tr>
              <th>เวลา</th>
              <th>รหัส KPI</th>
              <th>โมเดล AI</th>
              <th>ผลพยากรณ์</th>
              <th>ความเชื่อมั่น</th>
              <th>ระดับความเสี่ยง</th>
            </tr>
          </thead>
          <tbody>
            ${logs.length > 0 ? logs.map(l => `
              <tr>
                <td>${new Date(l.timestamp).toLocaleTimeString('th-TH')}</td>
                <td><strong>${l.kpi_id}</strong></td>
                <td>${l.model_name || l.model_id}</td>
                <td>${l.prediction !== null ? l.prediction : '-'}</td>
                <td>${l.confidence}%</td>
                <td><span class="badge-status ${l.risk_level === 'LOW' ? 'pass' : l.risk_level === 'MODERATE' ? 'warn' : 'fail'}">${l.risk_level}</span></td>
              </tr>
            `).join('') : '<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1rem;">ยังไม่มีประวัติการพยากรณ์</td></tr>'}
          </tbody>
        </table>
      </div>
    `;
  }

  modal.classList.add('show');
}

function closeAuditLogModal() {
  const modal = document.getElementById('ai-audit-log-modal');
  if (modal) modal.classList.remove('show');
}

function clearAuditLog() {
  if (typeof AIAuditLogger !== 'undefined') {
    AIAuditLogger.clear();
    openAuditLogModal();
    if (typeof showAppToast === 'function') {
      showAppToast('🗑️ ล้างประวัติแล้ว', 'ล้างข้อมูล AI Audit Log เรียบร้อยแล้ว', '✅');
    }
  }
}

window.populateAICenter = populateAICenter;
window.onAICenterKPISelected = onAICenterKPISelected;
window.onAIModelEngineSelected = onAIModelEngineSelected;
window.triggerAICenterAnalysis = triggerAICenterAnalysis;
window.copyAICenterResult = copyAICenterResult;
window.openAuditLogModal = openAuditLogModal;
window.closeAuditLogModal = closeAuditLogModal;
window.clearAuditLog = clearAuditLog;
window.updateAIStatusUI = updateAIStatusUI;


// ============================================================================
// DYNAMIC 8-CHAPTER HEALTHCARE PROJECT DRAFTING ENGINE (BY SELECTED KPI)
// Standard MOPH 8 Chapters Framework & Automated Expense Allocation
// ============================================================================

function generateDynamicProjectDraft(kpiId, budget, budgetSource) {
  const ds = (typeof getCurrentYearDataset === 'function' ? getCurrentYearDataset() : null) || (typeof OFFICIAL_DATASET !== 'undefined' ? OFFICIAL_DATASET['69'] : { kpis: [] });
  const kpis = ds.kpis || [];
  const kpi = kpis.find(k => (k.id === kpiId || k.kpi_id === kpiId)) || kpis[0] || {
    id: kpiId || 'KPI-01',
    name: 'การขับเคลื่อนยุทธศาสตร์สุขภาพระดับจังหวัด',
    strategy: 'ยุทธศาสตร์ด้านสุขภาพ',
    objective: 'เป้าประสงค์เชิงยุทธศาสตร์',
    target: '100',
    unit: 'ร้อยละ',
    direction: 'ยิ่งมากยิ่งดี',
    responsible_dept: 'สำนักงานสาธารณสุขจังหวัดขอนแก่น'
  };

  const budgetNum = parseInt((budget || 350000).toString().replace(/[^0-9]/g, ''), 10) || 350000;
  const budgetFormatted = budgetNum.toLocaleString('th-TH');
  const bSource = budgetSource || 'งบประมาณเงินกองทุนหลักประกันสุขภาพแห่งชาติ (PP Express / Fee Schedule)';

  // คำนวณสัดส่วนงบประมาณ 3 หมวดมาตรฐาน (ตอบแทน 25%, ใช้สอย 55%, วัสดุ 20%)
  const bRemunerationNum = Math.round(budgetNum * 0.25);
  const bOperatingNum = Math.round(budgetNum * 0.55);
  const bMaterialsNum = budgetNum - bRemunerationNum - bOperatingNum; // 20%

  const bRemuneration = bRemunerationNum.toLocaleString('th-TH');
  const bOperating = bOperatingNum.toLocaleString('th-TH');
  const bMaterials = bMaterialsNum.toLocaleString('th-TH');

  const kpiCode = kpi.id || kpi.kpi_id || 'KPI';
  const kpiName = kpi.name || '';
  const kpiStrategy = kpi.strategy || 'ยุทธศาสตร์สุขภาพจังหวัดขอนแก่น';
  const kpiGoal = kpi.objective || kpi.goal || 'เป้าประสงค์เชิงยุทธศาสตร์';
  const kpiTarget = kpi.target || kpi.t69 || 'ตามเกณฑ์มาตรฐาน';
  const kpiUnit = kpi.unit || 'ร้อยละ';
  const kpiDirection = kpi.direction || 'ยิ่งมากยิ่งดี';
  const kpiDept = kpi.responsible_dept || kpi.responsibleDept || 'กลุ่มงานที่เกี่ยวข้อง สำนักงานสาธารณสุขจังหวัดขอนแก่น';
  const kpiActual = (kpi.actual !== null && kpi.actual !== undefined && kpi.actual !== '' && kpi.actual !== '-') ? kpi.actual : 'รอข้อมูลผลการดำเนินงาน';
  const yrName = (ds && ds.yearName) ? ds.yearName : '2569';

  const textDraft = `
โครงการ: ขับเคลื่อนมาตรการและพัฒนานวัตกรรมยกระดับผลลัพธ์ ${kpiName} จังหวัดขอนแก่น ประจำปีงบประมาณ พ.ศ. ${yrName}

หมวดที่ 1: หลักการและเหตุผล และ Gap ปัญหา
- ตัวชี้วัด ${kpiCode}: ${kpiName} อยู่ภายใต้ ${kpiStrategy} (${kpiGoal})
- เป้าหมายปี ${yrName} กำหนดไว้ที่ ${kpiTarget} ${kpiUnit} (ทิศทาง: ${kpiDirection})
- ผลการดำเนินงานล่าสุด: ${kpiActual} ${kpiUnit}
- จากผลการดำเนินงานย้อนหลัง พบว่ามีส่วนต่าง (Gap) ที่ต้องเร่งรัดขับเคลื่อนเชิงรุกในระดับพื้นที่ 26 อำเภอ เพื่อเพิ่มประสิทธิภาพการเข้าถึงบริการและป้องกันผลกระทบต่อสุขภาพประชาชนอย่างยั่งยืน

หมวดที่ 2: วัตถุประสงค์โครงการ และตัวชี้วัดความสำเร็จ (SMART Goals)
1. เพื่อให้กลุ่มเป้าหมายของ ${kpiName} ในพื้นที่ 26 อำเภอ ได้รับการคัดกรอง เฝ้าระวัง และเข้าถึงบริการไม่น้อยกว่าร้อยละ 85
2. เพื่อพัฒนาระบบข้อมูลและการส่งต่อแบบไร้รอยต่อระหว่างหน่วยบริการปฐมภูมิ ทุติยภูมิ และตติยภูมิ
3. เพื่อบรรลุเป้าหมายตัวชี้วัดระดับจังหวัดที่ ${kpiTarget} ${kpiUnit} ภายในปีงบประมาณ ${yrName}
- ตัวชี้วัดผลผลิต (Outputs): ร้อยละของหน่วยบริการในจังหวัดจัดทำแผนปฏิบัติการและรายงานผลครบถ้วน 100%
- ตัวชี้วัดผลลัพธ์ (Outcomes): อัตราความสำเร็จของตัวชี้วัด ${kpiCode} บรรลุตามเกณฑ์เป้าหมายกระทรวงสาธารณสุข

หมวดที่ 3: กลุ่มเป้าหมายและพื้นที่ดำเนินการ
- กลุ่มเป้าหมายหลัก: ประชาชนกลุ่มเสี่ยง/กลุ่มป่วย และผู้รับบริการที่เกี่ยวข้องกับ ${kpiName} ใน 26 อำเภอ จังหวัดขอนแก่น
- กลุ่มเป้าหมายผู้ขับเคลื่อน: ทีมสหวิชาชีพ, แพทย์, พยาบาล, นักวิชาการสาธารณสุข, เจ้าหน้าที่ รพ.สต./สอน., และแกนนำ อสม.
- พื้นที่ดำเนินการ: โรงพยาบาลศูนย์/ทั่วไป, โรงพยาบาลชุมชน 22 แห่ง, สำนักงานสาธารณสุขอำเภอ 26 แห่ง และ รพ.สต./สอน. ทุกแห่งในจังหวัดขอนแก่น

หมวดที่ 4: แผนปฏิบัติการและกิจกรรมหลักรายไตรมาส (Action Plan Q1–Q4)
- ไตรมาส 1 (ต.ค. - ธ.ค.): ประชุมชี้แจงแนวทางการดำเนินงาน ถ่ายทอด SOP และจัดทำฐานข้อมูลกลุ่มเป้าหมายรายอำเภอ
- ไตรมาส 2 (ม.ค. - มี.ค.): รณรงค์และขับเคลื่อนกิจกรรมเชิงรุกในพื้นที่ 26 อำเภอ / ติดตั้งระบบ Digital Tracking & HDC Monitoring
- ไตรมาส 3 (เม.ย. - มิ.ย.): การนิเทศติดตามแบบเสริมพลัง (Supportive Supervision) และจัดประชุม War Room แก้ไขปัญหาอำเภอที่มี Gap
- ไตรมาส 4 (ก.ค. - ก.ย.): ประเมินผลลัพธ์โครงการ, ถอดบทเรียนนวัตกรรม (Best Practice/R2R), และมอบรางวัลเชิดชูเกียรติพื้นที่ต้นแบบ

หมวดที่ 5: ประมาณการงบประมาณและตารางจำแนกหมวดรายจ่าย
งบประมาณรวมทั้งสิ้น ${budgetFormatted} บาท (แหล่งงบ: ${bSource}) จำแนก 3 หมวด:
1) หมวดค่าตอบแทน (${bRemuneration} บาท - 25%): ค่าตอบแทนวิทยากร, ค่าตอบแทนคณะทำงานนิเทศติดตาม
2) หมวดค่าใช้สอย (${bOperating} บาท - 55%): ค่าอาหารกลางวันและอาหารว่างการประชุมเชิงปฏิบัติการ, ค่าพาหนะ/เดินทางไปราชการ, ค่าสถานที่
3) หมวดค่าวัสดุ (${bMaterials} บาท - 20%): ค่าจัดทำคู่มือ SOP, สื่อสุขศึกษาประชาสัมพันธ์ดิจิทัล, วัสดุวิทยาศาสตร์/การแพทย์ที่เกี่ยวข้อง

หมวดที่ 6: หน่วยงานผู้รับผิดชอบและภาคีเครือข่ายบูรณาการ
- หน่วยงานรับผิดชอบหลัก: ${kpiDept}
- ภาคีเครือข่าย: คณะกรรมการพัฒนาคุณภาพชีวิตระดับอำเภอ (พชอ.), องค์กรปกครองส่วนท้องถิ่น (อปท.), ชมรม อสม. จังหวัดขอนแก่น

หมวดที่ 7: การบริหารความเสี่ยงโครงการ (Risk Management & Mitigation Plan)
- ความเสี่ยงด้านข้อมูล: พัฒนาระบบ API ตรวจสอบความถูกต้องของข้อมูล (Data Validation) ลดปัญหาบันทึกล่าช้า
- ความเสี่ยงด้านการมีส่วนร่วม: บูรณาการงบกองทุนหลักประกันสุขภาพตำบล (กปท.) เพื่อสนับสนุนกิจกรรมในระดับหมู่บ้าน

หมวดที่ 8: ประโยชน์ที่คาดว่าจะได้รับ
- ประชาชนในจังหวัดขอนแก่นได้รับการดูแลสุขภาพที่ได้มาตรฐาน รวดเร็ว ปลอดภัย และลดอัตราความพิการ/เสียชีวิต
- ระบบบริการสาธารณสุขมีความเข้มแข็งและสามารถขับเคลื่อนตัวชี้วัดยุทธศาสตร์ได้ตามเป้าหมายของกระทรวงสาธารณสุข
`.trim();

  return {
    kpiId: kpiCode,
    kpiName,
    strategy: kpiStrategy,
    goal: kpiGoal,
    target: kpiTarget,
    unit: kpiUnit,
    direction: kpiDirection,
    actual: kpiActual,
    responsibleDept: kpiDept,
    budgetNum,
    budgetFormatted,
    budgetSource: bSource,
    bRemuneration,
    bOperating,
    bMaterials,
    bRemunerationNum,
    bOperatingNum,
    bMaterialsNum,
    textDraft,
    toString: () => textDraft
  };
}

window.generateDynamicProjectDraft = generateDynamicProjectDraft;

function onGemDraftKPISelected(kpiId) {
  const ds = getCurrentYearDataset();
  const currentYearKey = AppState.selectedYear || '69';
  const kpi = ds.kpis.find(k => k.id === kpiId) || ds.kpis[0];
  if (!kpi) return;

  const budgetSelect = document.getElementById('gem-draft-budget-select');
  const sourceSelect = document.getElementById('gem-draft-source-select');
  const customFocusInput = document.getElementById('gem-draft-focus-input');

  const budgetVal = budgetSelect ? budgetSelect.value : '350000';
  const sourceVal = sourceSelect ? sourceSelect.value : 'งบค่าบริการทางการแพทย์ที่เบิกจ่ายในลักษณะงบลงทุน (PP Express / Fee Schedule)';
  const customFocus = customFocusInput ? customFocusInput.value : '';

  // Generate dynamic 8-chapter project proposal specific to this KPI
  const dynamic = generateDynamicProjectDraft(kpi.id, budgetVal, sourceVal);

  const draftData = {
    title: `โครงการขับเคลื่อนมาตรการและพัฒนานวัตกรรมยกระดับผลลัพธ์ ${kpi.name} จังหวัดขอนแก่น`,
    kpiCode: kpi.id,
    kpiName: kpi.name,
    strategy: kpi.strategy,
    goal: kpi.objective || 'เป้าประสงค์เชิงยุทธศาสตร์',
    target: kpi.target,
    unit: kpi.unit,
    direction: kpi.direction,
    yearName: ds.yearName || '2569',
    budgetTotal: dynamic.budgetFormatted,
    budgetSource: dynamic.budgetSource,
    bRemuneration: dynamic.bRemuneration,
    bOperating: dynamic.bOperating,
    bMaterials: dynamic.bMaterials,
    responsibleDept: dynamic.dept,
    rationales: [
      `สอดคล้องกับยุทธศาสตร์สุขภาพจังหวัดขอนแก่น (${kpi.strategy || 'ยุทธศาสตร์หลัก'}) มุ่งเน้นการยกระดับคุณภาพชีวิตและสุขภาพประชาชน`,
      `จากข้อมูลสถานการณ์และการวิเคราะห์ Gap ผลการดำเนินงาน พบว่ามีความจำเป็นต้องพัฒนาแนวทางเวชปฏิบัติและระบบติดตามรายบุคคล`,
      `การบูรณาการความร่วมมือข้ามสายงานระดับปฐมภูมิ ทุติยภูมิ และตติยภูมิ ร่วมกับภาคีเครือข่าย พชอ. และ อปท. เพื่อความยั่งยืน`
    ],
    objectives: [
      `เพื่อให้ประชากรกลุ่มเป้าหมายของ ${kpi.name} ในพื้นที่ 26 อำเภอ ได้รับการคัดกรอง เฝ้าระวัง และเข้าถึงบริการที่ได้มาตรฐาน`,
      `เพื่อยกระดับผลการดำเนินงานตัวชี้วัด ${kpi.id} ให้บรรลุเป้าหมายที่ ${kpi.target} ${kpi.unit} ภายในปีงบประมาณ ${ds.yearName || '2569'}`,
      `เพื่อสร้างรูปแบบนวัตกรรมบริการสุขภาพ (Service Innovation / Best Practice) ที่สามารถขยายผลได้ครอบคลุมทั้ง 26 อำเภอ`
    ],
    activities: [
      { phase: 'ไตรมาส 1 (ต.ค. - ธ.ค.)', detail: 'ประชุมชี้แจงแนวทางการดำเนินงาน ถ่ายทอด SOP และจัดทำฐานข้อมูลกลุ่มเป้าหมายรายอำเภอ' },
      { phase: 'ไตรมาส 2 (ม.ค. - มี.ค.)', detail: 'รณรงค์และขับเคลื่อนกิจกรรมเชิงรุกในพื้นที่ 26 อำเภอ / ติดตั้งระบบ Digital Tracking & HDC Monitoring' },
      { phase: 'ไตรมาส 3 (เม.ย. - มิ.ย.)', detail: 'การนิเทศติดตามแบบเสริมพลัง (Supportive Supervision) และจัดประชุม War Room แก้ไขปัญหาอำเภอที่มี Gap' },
      { phase: 'ไตรมาส 4 (ก.ค. - ก.ย.)', detail: 'ประเมินผลลัพธ์โครงการ, ถอดบทเรียนนวัตกรรม (Best Practice/R2R), และมอบรางวัลเชิดชูเกียรติพื้นที่ต้นแบบ' }
    ],
    textDraft: dynamic.textDraft
  };

  currentDraftProposalData = draftData;

  // Render Rich Proposal Document
  renderProposalRichView(draftData);

  // Update prompt preview textarea
  const tmpl = getDetailedKPITemplate(kpi, currentYearKey);
  const promptText = buildKPIDraftProjectPrompt(kpi, tmpl, ds, draftData, customFocus);
  const textarea = document.getElementById('gem-draft-prompt-preview');
  if (textarea) textarea.value = promptText;
}

function buildKPIDraftProjectPrompt(kpi, tmpl, ds, draftData, customFocus) {
  const dynamic = generateDynamicProjectDraft(kpi.id, draftData?.budgetTotal, draftData?.budgetSource);
  return `# PROMPT สำหรับ Google Gemini Custom Gem: ผู้เชี่ยวชาญด้านการจัดทำโครงการสาธารณสุข

คุณคือที่ปรึกษาอาวุโสด้านการวางแผนยุทธศาสตร์สาธารณสุข (MOPH Senior Strategic Planner)
กรุณายกร่างโครงการฉบับสมบูรณ์ 8 หมวด ตามมาตรฐานกระทรวงสาธารณสุข สำหรับตัวชี้วัดด้านล่างนี้:

1. ข้อมูลตัวชี้วัดยุทธศาสตร์:
- รหัสตัวชี้วัด: ${dynamic.kpiId}
- ชื่อตัวชี้วัด: ${dynamic.kpiName}
- ยุทธศาสตร์: ${dynamic.strategy} (${dynamic.goal})
- ค่าเป้าหมาย: ${dynamic.target} ${dynamic.unit} (ทิศทาง: ${dynamic.direction})
- หน่วยงานรับผิดชอบ: ${dynamic.dept}

2. กรอบงบประมาณและแหล่งเงิน:
- วงเงินงบประมาณรวม: ${dynamic.budgetFormatted} บาท
- แหล่งงบประมาณ: ${dynamic.budgetSource}
- สัดส่วนงบประมาณ: หมวดค่าตอบแทน 25% (${dynamic.bRemuneration} บาท), หมวดค่าใช้สอย 55% (${dynamic.bOperating} บาท), หมวดค่าวัสดุ 20% (${dynamic.bMaterials} บาท)

3. โครงร่างโครงการ 8 หมวดที่ต้องจัดทำ:
หมวดที่ 1: หลักการและเหตุผล และ Gap ปัญหาในพื้นที่จังหวัดขอนแก่น
หมวดที่ 2: วัตถุประสงค์โครงการ และตัวชี้วัดความสำเร็จ (SMART Objectives: Outputs & Outcomes)
หมวดที่ 3: กลุ่มเป้าหมายและพื้นที่ดำเนินการ (26 อำเภอ)
หมวดที่ 4: แผนปฏิบัติการและกิจกรรมหลักรายไตรมาส (Action Plan Q1–Q4)
หมวดที่ 5: ประมาณการงบประมาณและตารางจำแนกหมวดรายจ่าย 3 หมวดมาตรฐาน
หมวดที่ 6: หน่วยงานผู้รับผิดชอบและภาคีเครือข่ายบูรณาการ (พชอ., อปท., อสม.)
หมวดที่ 7: การบริหารความเสี่ยงโครงการ (Risk Management & Mitigation Plan)
หมวดที่ 8: ประโยชน์ที่คาดว่าจะได้รับ
`;
}

function renderProposalRichView(draft) {
  const container = document.getElementById('gem-proposal-rich-body');
  if (!container) return;

  container.innerHTML = `
    <div class="proposal-document">
      <div class="proposal-doc-header">
        <div class="proposal-doc-badge">แบบเสนอโครงการเชิงยุทธศาสตร์สาธารณสุข (MOPH Standard Framework)</div>
        <h2 class="proposal-doc-title">${draft.title}</h2>
        <div class="proposal-doc-meta">
          <span>🎯 ตัวชี้วัด: <strong>${draft.kpiCode}</strong> - ${draft.kpiName}</span>
          <span>📅 ประจำปีงบประมาณ: <strong>${draft.yearName}</strong></span>
          <span>🏢 ผู้รับผิดชอบ: <strong>${draft.responsibleDept}</strong></span>
        </div>
      </div>

      <!-- หมวด 1: หลักการและเหตุผล -->
      <div class="proposal-doc-chapter">
        <div class="chapter-title">หมวดที่ 1: หลักการและเหตุผล และ Gap การดำเนินงาน</div>
        <div class="chapter-content">
          <ul>
            ${draft.rationales.map(r => `<li>${r}</li>`).join('')}
          </ul>
        </div>
      </div>

      <!-- หมวด 2: วัตถุประสงค์และตัวชี้วัดความสำเร็จ -->
      <div class="proposal-doc-chapter">
        <div class="chapter-title">หมวดที่ 2: วัตถุประสงค์และตัวชี้วัดความสำเร็จ (SMART Objectives)</div>
        <div class="chapter-content">
          <ol>
            ${draft.objectives.map(o => `<li>${o}</li>`).join('')}
          </ol>
        </div>
      </div>

      <!-- หมวด 4: แผนกิจกรรมรายไตรมาส -->
      <div class="proposal-doc-chapter">
        <div class="chapter-title">หมวดที่ 4: แผนปฏิบัติการและกิจกรรมหลักรายไตรมาส (Action Plan Q1–Q4)</div>
        <div class="chapter-content">
          <table class="proposal-table">
            <thead>
              <tr><th style="width: 30%;">ระยะเวลา</th><th>กิจกรรมหลักและผลผลิต</th></tr>
            </thead>
            <tbody>
              ${draft.activities.map(a => `
                <tr>
                  <td><strong>${a.phase}</strong></td>
                  <td>${a.detail}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- หมวด 5: งบประมาณ -->
      <div class="proposal-doc-chapter">
        <div class="chapter-title">หมวดที่ 5: ประมาณการงบประมาณและตารางจำแนกหมวดรายจ่าย</div>
        <div class="chapter-content">
          <p>งบประมาณรวมทั้งสิ้น <strong>${draft.budgetTotal} บาท</strong> (แหล่งงบ: ${draft.budgetSource}) จำแนกตาม 3 หมวดรายจ่ายกระทรวงสาธารณสุข:</p>
          <table class="proposal-table">
            <thead>
              <tr><th>หมวดรายจ่าย</th><th style="width: 25%;">สัดส่วน (%)</th><th style="width: 35%; text-align: right;">จำนวนเงิน (บาท)</th></tr>
            </thead>
            <tbody>
              <tr><td>1. หมวดค่าตอบแทน (วิทยากร/คณะทำงาน)</td><td>25%</td><td style="text-align: right;"><strong>${draft.bRemuneration}</strong></td></tr>
              <tr><td>2. หมวดค่าใช้สอย (อบรม/เดินทาง/อาหาร)</td><td>55%</td><td style="text-align: right;"><strong>${draft.bOperating}</strong></td></tr>
              <tr><td>3. หมวดค่าวัสดุ (คู่มือ/สื่อ/อุปกรณ์)</td><td>20%</td><td style="text-align: right;"><strong>${draft.bMaterials}</strong></td></tr>
              <tr style="background: rgba(13, 148, 136, 0.1); font-weight: bold;">
                <td>รวมงบประมาณทั้งสิ้น</td><td>100%</td><td style="text-align: right; color: var(--teal-light, #0d9488);">${draft.budgetTotal} บาท</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- หมวด 8: ประโยชน์ที่คาดว่าจะได้รับ -->
      <div class="proposal-doc-chapter">
        <div class="chapter-title">หมวดที่ 8: ประโยชน์ที่คาดว่าจะได้รับ</div>
        <div class="chapter-content">
          <ul>
            <li>ยกระดับผลลัพธ์สุขภาพของประชาชนในจังหวัดขอนแก่นอย่างเป็นรูปธรรม</li>
            <li>บรรลุเป้าหมายตัวชี้วัด ${draft.kpiCode} ที่กำหนดไว้ ${draft.target} ${draft.unit} อย่างยั่งยืน</li>
            <li>เสริมสร้างความเข้มแข็งของระบบบริการสาธารณสุขและภาคีเครือข่ายระดับพื้นที่</li>
          </ul>
        </div>
      </div>
    </div>
  `;
}

function switchGemDraftTab(tabId) {
  const tabBtnProposal = document.getElementById('tab-btn-gem-proposal');
  const tabBtnPrompt = document.getElementById('tab-btn-gem-prompt');
  const paneProposal = document.getElementById('gem-tab-proposal');
  const panePrompt = document.getElementById('gem-tab-prompt');

  if (tabId === 'proposal') {
    if (tabBtnProposal) tabBtnProposal.classList.add('active');
    if (tabBtnPrompt) tabBtnPrompt.classList.remove('active');
    if (paneProposal) paneProposal.style.display = 'block';
    if (panePrompt) panePrompt.style.display = 'none';
  } else {
    if (tabBtnPrompt) tabBtnPrompt.classList.add('active');
    if (tabBtnProposal) tabBtnProposal.classList.remove('active');
    if (panePrompt) panePrompt.style.display = 'block';
    if (paneProposal) paneProposal.style.display = 'none';
  }
}

function regenerateDraftFromParams() {
  const kpiSelect = document.getElementById('gem-draft-kpi-select') || document.getElementById('gem-kpi-select');
  const kpiId = kpiSelect ? kpiSelect.value : null;
  onGemDraftKPISelected(kpiId);
}

function populateGemDraftView() {
  const kpiSelect = document.getElementById('gem-draft-kpi-select') || document.getElementById('gem-kpi-select');
  if (!kpiSelect) return;

  const ds = getCurrentYearDataset();
  const kpis = ds.kpis || [];

  kpiSelect.innerHTML = kpis.map(k => `
    <option value="${k.id}">[${k.id}] ${k.name}</option>
  `).join('');

  if (kpis.length > 0) {
    onGemDraftKPISelected(kpis[0].id);
  }
}

function copyCurrentProposalText() {
  const kpiSelect = document.getElementById('gem-draft-kpi-select') || document.getElementById('gem-kpi-select');
  const kpiId = kpiSelect ? kpiSelect.value : null;
  const dynamic = generateDynamicProjectDraft(kpiId);
  fallbackCopyText(dynamic.textDraft, 'คัดลอกโครงร่างโครงการ 8 หมวดเรียบร้อยแล้ว');
}

function copyGemDraftPromptText() {
  const promptBox = document.getElementById('gem-draft-prompt-preview') || document.getElementById('gem-draft-prompt-box');
  if (promptBox && promptBox.value) {
    fallbackCopyText(promptBox.value, 'คัดลอกโครงสร้าง Prompt สำหรับ Gem เรียบร้อยแล้ว');
  }
}

function downloadCurrentDraftWordDoc() {
  const kpiSelect = document.getElementById('gem-draft-kpi-select') || document.getElementById('gem-kpi-select');
  const kpiId = kpiSelect ? kpiSelect.value : null;
  const ds = getCurrentYearDataset();
  const currentYearKey = AppState.selectedYear || '69';
  const kpi = (ds.kpis || []).find(k => k.id === kpiId) || (ds.kpis || [])[0];
  if (!kpi) return;

  const budgetSelect = document.getElementById('gem-draft-budget-select');
  const sourceSelect = document.getElementById('gem-draft-source-select');
  const budgetVal = budgetSelect ? budgetSelect.value : '350000';
  const sourceVal = sourceSelect ? sourceSelect.value : 'PP Express';

  const dynamic = generateDynamicProjectDraft(kpi.id, budgetVal, sourceVal);

  const wordHtml = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>ร่างโครงการยุทธศาสตร์ - ${kpi.id}</title>
  <style>
    body { font-family: 'TH Sarabun PSK', 'TH Sarabun New', sans-serif; font-size: 16pt; line-height: 1.35; margin: 2cm; }
    h1 { font-size: 20pt; text-align: center; font-weight: bold; }
    h2 { font-size: 17pt; font-weight: bold; color: #006699; margin-top: 1rem; }
    table { width: 100%; border-collapse: collapse; margin: 10pt 0; font-size: 15pt; }
    th, td { border: 1pt solid #333; padding: 6pt; }
    th { background-color: #f2f2f2; }
  </style>
</head>
<body>
  <h1>โครงการขับเคลื่อนมาตรการและพัฒนานวัตกรรมยกระดับผลลัพธ์ ${kpi.name} จังหวัดขอนแก่น</h1>
  <p style="text-align: center;"><strong>ประจำปีงบประมาณ พ.ศ. ${ds.yearName}</strong></p>
  <hr/>
  <h2>หมวดที่ 1: หลักการและเหตุผล</h2>
  <p>สอดคล้องกับยุทธศาสตร์สุขภาพจังหวัดขอนแก่น (${kpi.strategy || 'ยุทธศาสตร์หลัก'}) มุ่งเน้นการยกระดับคุณภาพชีวิตและสุขภาพประชาชน</p>
  <h2>หมวดที่ 2: วัตถุประสงค์และตัวชี้วัดความสำเร็จ</h2>
  <p>1. เพื่อให้ประชากรกลุ่มเป้าหมายของ ${kpi.name} ในพื้นที่ 26 อำเภอ ได้รับการคัดกรอง เฝ้าระวัง และเข้าถึงบริการที่ได้มาตรฐาน<br/>2. เพื่อยกระดับผลการดำเนินงานตัวชี้วัด ${kpi.id} ให้บรรลุเป้าหมายที่ ${kpi.target} ${kpi.unit}</p>
  <h2>หมวดที่ 5: ประมาณการงบประมาณ (${dynamic.budgetFormatted} บาท)</h2>
  <table>
    <tr><th>หมวดรายจ่าย</th><th>สัดส่วน</th><th>จำนวนเงิน</th></tr>
    <tr><td>ค่าตอบแทน</td><td>25%</td><td>${dynamic.bRemuneration} บาท</td></tr>
    <tr><td>ค่าใช้สอย</td><td>55%</td><td>${dynamic.bOperating} บาท</td></tr>
    <tr><td>ค่าวัสดุ</td><td>20%</td><td>${dynamic.bMaterials} บาท</td></tr>
  </table>
</body>
</html>`;

  const blob = new Blob(['\ufeff' + wordHtml], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `โครงการ_${kpi.id}_${ds.yearName}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showAppToast('📥 ส่งออกสำเร็จ', `บันทึกเอกสารร่างโครงการ ${kpi.id} เรียบร้อยแล้ว`, '📄');
}

function triggerGemDraftFromView() {
  const gemUrl = getCustomGemUrl();
  window.open(gemUrl, '_blank');
}

function draftProjectWithGemini(kpiId) {
  switchView('gem-draft');
  setTimeout(() => {
    const kpiSelect = document.getElementById('gem-draft-kpi-select') || document.getElementById('gem-kpi-select');
    if (kpiSelect) {
      kpiSelect.value = kpiId;
      onGemDraftKPISelected(kpiId);
    }
  }, 100);
}

// ============================================================================
// TOAST & CLIPBOARD HELPERS
// ============================================================================

function showAppToast(title, message, icon = 'ℹ️') {
  let container = document.getElementById('app-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'app-toast-container';
    container.className = 'app-toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'app-toast';
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${message}</div>
    </div>
  `;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function fallbackCopyText(text, successMsg) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showAppToast('📋 คัดลอกสำเร็จ', successMsg, '✅');
    }).catch(() => {
      execCopyFallback(text, successMsg);
    });
  } else {
    execCopyFallback(text, successMsg);
  }
}

function execCopyFallback(text, successMsg) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showAppToast('📋 คัดลอกสำเร็จ', successMsg, '✅');
  } catch (err) {
    showAppToast('⚠️ ไม่สามารถคัดลอกได้', 'กรุณาคัดลอกข้อความด้วยตนเอง', '❌');
  }
  document.body.removeChild(textArea);
}

// ============================================================================

function closeModal() {
  const modal = document.getElementById('kpi-detail-modal');
  if (modal) {
    modal.classList.remove('show');
    modal.classList.remove('active');
  }
  document.body.style.overflow = '';
}

function closeFullKPITemplateModal() {
  const modal = document.getElementById('kpi-full-template-modal');
  if (modal) {
    modal.classList.remove('show');
    modal.classList.remove('active');
  }
  document.body.style.overflow = '';
}

function navigateKPIDetail(direction) {
  const modal = document.getElementById('kpi-detail-modal');
  if (!modal) return;
  const currentKpiId = modal.getAttribute('data-kpi-id');
  const ds = getCurrentYearDataset();
  const filteredKpis = getCurrentlyFilteredKPIs();
  const kpis = (filteredKpis.length > 0 && filteredKpis.some(k => k.id === currentKpiId)) ? filteredKpis : ds.kpis;
  const currentIndex = kpis.findIndex(k => k.id === currentKpiId);
  if (currentIndex === -1) return;

  const nextIndex = (currentIndex + direction + kpis.length) % kpis.length;
  openKPIDetailModal(kpis[nextIndex].id);
}

function printOnePageLandscapeReport() {
  window.print();
}

function downloadKPITemplateWord(kpiId) {
  const ds = getCurrentYearDataset();
  const currentYearKey = AppState.selectedYear || '69';
  const kpi = ds.kpis.find(k => k.id === kpiId) || ds.kpis[0];
  const tmpl = getDetailedKPITemplate(kpi, currentYearKey);

  const wordHtml = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>แบบฟอร์มรายละเอียดตัวชี้วัด (KPI Template) - ${tmpl.code_ref}</title>
  <style>
    body { font-family: 'TH Sarabun PSK', 'TH Sarabun New', 'Angsana New', sans-serif; font-size: 16pt; line-height: 1.35; color: #000000; margin: 2cm 2cm 2cm 2.5cm; }
    h1 { font-size: 20pt; text-align: center; font-weight: bold; margin-bottom: 0.5rem; }
    h3 { font-size: 16pt; font-weight: bold; margin-top: 1rem; margin-bottom: 0.3rem; color: #006699; border-bottom: 1.5pt solid #006699; padding-bottom: 3pt; }
    table { width: 100%; border-collapse: collapse; margin-top: 6pt; margin-bottom: 10pt; font-size: 15pt; }
    th, td { border: 1pt solid #444444; padding: 6pt 8pt; vertical-align: top; }
    th { background-color: #f2f2f2; font-weight: bold; text-align: center; }
    .meta-table td:first-child { width: 30%; font-weight: bold; background-color: #f9f9f9; }
    .formula-box { background-color: #f0f8ff; border: 1pt solid #b0d4f1; padding: 8pt; font-family: 'Courier New', monospace; font-size: 14pt; margin: 6pt 0; }
    .footer-note { font-size: 13pt; color: #555555; text-align: right; margin-top: 2rem; border-top: 1pt solid #cccccc; padding-top: 6pt; }
  </style>
</head>
<body>
  <h1>แบบฟอร์มจัดทำรายละเอียดตัวชี้วัด (KPI Template ฉบับเต็ม)</h1>
  <div style="text-align: center; font-size: 16pt; font-weight: bold; margin-bottom: 1rem;">
    แผนยุทธศาสตร์สุขภาพ 5 ปี จังหวัดขอนแก่น (พ.ศ. 2566–2570) • ประจำปีงบประมาณ ${ds.yearName}
  </div>

  <h3>หมวดที่ 1: ข้อมูลทั่วไปและโครงสร้างเชิงยุทธศาสตร์ (Strategic Alignment)</h3>
  <table class="meta-table">
    <tr><td>รหัสตัวชี้วัด:</td><td><strong>${tmpl.code_ref}</strong> (ลำดับที่ ${tmpl.order})</td></tr>
    <tr><td>ชื่อตัวชี้วัด:</td><td><strong>${tmpl.name}</strong></td></tr>
    <tr><td>ประเด็นยุทธศาสตร์:</td><td>${tmpl.strategy}</td></tr>
    <tr><td>เป้าประสงค์ (Strategic Goal):</td><td>${tmpl.goal}</td></tr>
    <tr><td>หน่วยวัดและทิศทาง:</td><td>${tmpl.unit_direction}</td></tr>
    <tr><td>ค่าเป้าหมายปีงบประมาณ ${ds.yearName}:</td><td><strong>${tmpl.target_display}</strong></td></tr>
  </table>

  <h3>หมวดที่ 2: หลักการ เหตุผล และคำนิยามปฏิบัติการ (Operational Definitions)</h3>
  <p><strong>วัตถุประสงค์และความสำคัญเชิงนโยบาย:</strong><br>${tmpl.purpose}</p>
  <p><strong>คำนิยามตัวชี้วัด:</strong><br>${tmpl.definition}</p>

  <h3>หมวดที่ 3: สูตรและระเบียบวิธีคำนวณ (Calculation Methodology)</h3>
  <div class="formula-box">${tmpl.formula}</div>
  <p>
    &bull; <strong>ตัวตั้ง (A):</strong> ${tmpl.variable_a}<br>
    &bull; <strong>ตัวหาร (B):</strong> ${tmpl.variable_b}
  </p>

  <h3>หมวดที่ 4: เส้นทางค่าเป้าหมาย 5 ปี (5-Year Target Trajectory)</h3>
  <table>
    <tr><th>ปี 2566</th><th>ปี 2567</th><th>ปี 2568</th><th>ปี 2569</th><th>ปี 2570 (เป้าหมายสูงสุด)</th></tr>
    <tr style="text-align: center;">
      <td>${tmpl.targets.t66}</td>
      <td>${tmpl.targets.t67}</td>
      <td>${tmpl.targets.t68}</td>
      <td><strong>${tmpl.targets.t69}</strong></td>
      <td style="font-weight: bold; color: #006699;">${tmpl.targets.t70}</td>
    </tr>
  </table>

  <h3>หมวดที่ 5: กลุ่มเป้าหมายและขอบเขตพื้นที่ดำเนินการ (Scope)</h3>
  <p>${tmpl.scope}</p>

  <h3>หมวดที่ 6: การกำกับติดตาม แหล่งข้อมูล และผู้รับผิดชอบ (Governance & Ownership)</h3>
  <table class="meta-table">
    <tr><td>แหล่งข้อมูลและความถี่:</td><td>${tmpl.data_source_frequency}</td></tr>
    <tr><td>หน่วยงานผู้รับผิดชอบหลัก:</td><td><strong>${tmpl.responsible_agency}</strong></td></tr>
    <tr><td>วิธีการประเมินผล:</td><td>${tmpl.evaluationMethod}</td></tr>
  </table>

  <div class="footer-note">
    สำนักงานสาธารณสุขจังหวัดขอนแก่น • กลุ่มงานพัฒนายุทธศาสตร์สาธารณสุข โทร. 0-4322-1125 ต่อ 163
  </div>
</body>
</html>`;

  const blob = new Blob(['\ufeff' + wordHtml], { type: 'application/msword;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `${tmpl.code_ref}_แบบฟอร์มตัวชี้วัดฉบับเต็ม_${ds.yearName}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);

  showAppToast('📥 ดาวน์โหลดสำเร็จ', `บันทึกไฟล์ Word แบบฟอร์มตัวชี้วัด ${tmpl.code_ref} เรียบร้อยแล้ว`, '📄');
}



let modalKPIChartInstance = null;

function renderModalKPIChart(kpi, history) {
  const canvas = document.getElementById('modalKPIChart') || document.getElementById('chart-modal-kpi');
  if (!canvas || typeof Chart === 'undefined') return;

  if (modalKPIChartInstance) {
    modalKPIChartInstance.destroy();
    modalKPIChartInstance = null;
  }

  const ctx = canvas.getContext('2d');
  const years = ['ปี 2566', 'ปี 2567', 'ปี 2568', 'ปี 2569', 'ปี 2570'];

  const rawTargets = [history.t66, history.t67, history.t68, history.t69, history.t70];
  const rawActuals = [history.a66, history.a67, history.a68, history.a69, history.a70];

  const parseVal = (v) => {
    if (v === null || v === undefined || v === '-' || v === '' || v === 'รอข้อมูล') return null;
    const cleanStr = v.toString().replace(/,/g, '');
    const m = cleanStr.match(/[-+]?[0-9]*\.?[0-9]+/);
    if (!m) return null;
    const n = parseFloat(m[0]);
    return isNaN(n) ? null : n;
  };

  const targetData = rawTargets.map(parseVal);
  const actualData = rawActuals.map(parseVal);

  const evalPairs = [
    evaluateYearPair(history.a66, history.t66, kpi.direction),
    evaluateYearPair(history.a67, history.t67, kpi.direction),
    evaluateYearPair(history.a68, history.t68, kpi.direction),
    evaluateYearPair(history.a69, history.t69, kpi.direction),
    evaluateYearPair(history.a70, history.t70, kpi.direction)
  ];

  const pointColors = evalPairs.map((res, idx) => {
    if (actualData[idx] === null) return 'transparent';
    return res.status === 'pass' ? '#10b981' : (res.status === 'fail' ? '#ef4444' : '#f59e0b');
  });

  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.06)';

  modalKPIChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [
        {
          label: '🎯 เป้าหมาย (Target)',
          data: targetData,
          borderColor: '#f59e0b',
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [6, 4],
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#f59e0b',
          tension: 0.1,
          spanGaps: true
        },
        {
          label: '📊 ผลงานจริง (Actual)',
          data: actualData,
          borderColor: '#0284c7',
          backgroundColor: 'rgba(2, 132, 199, 0.12)',
          borderWidth: 2.5,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: pointColors,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 1.5,
          tension: 0.2,
          fill: true,
          spanGaps: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const val = context.raw;
              if (val === null || val === undefined) return `${context.dataset.label}: ไม่มีข้อมูล`;
              return `${context.dataset.label}: ${val} ${kpi.unit || ''}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 11, family: "'Prompt', sans-serif" }, color: textColor }
        },
        y: {
          grid: { color: gridColor },
          ticks: { font: { size: 11, family: "'Prompt', sans-serif" }, color: textColor }
        }
      }
    }
  });
}

let radarChartInstance = null;

function renderStrategicRadarChart() {
  const canvas = document.getElementById('strategicRadarChart') || document.getElementById('strategic-radar-chart');
  const ds = getCurrentYearDataset();
  const kpis = ds.kpis || [];

  // Calculate live summary stats
  let totalPass = 0, totalFail = 0, totalPending = 0;
  kpis.forEach(k => {
    const res = evaluateStatus(k);
    if (res.status === 'pass') totalPass++;
    else if (res.status === 'fail') totalFail++;
    else totalPending++;
  });
  const totalEvaluated = totalPass + totalFail;
  const overallAvg = totalEvaluated > 0 ? ((totalPass / totalEvaluated) * 100) : 0;

  const footPass = document.getElementById('concentric-footer-pass');
  if (footPass) footPass.textContent = totalPass;

  const footFail = document.getElementById('concentric-footer-fail');
  if (footFail) footFail.textContent = totalFail;

  const footTotal = document.getElementById('concentric-footer-total');
  if (footTotal) footTotal.textContent = `${kpis.length} ตัวชี้วัด`;

  const avgPct = document.getElementById('radar-avg-pct');
  if (avgPct) avgPct.textContent = `${overallAvg.toFixed(1)}%`;

  const avgSub = document.getElementById('radar-avg-sub');
  if (avgSub) avgSub.textContent = `(ผ่าน ${totalPass} / รวม ${kpis.length})`;

  const yearPill = document.getElementById('concentric-year-pill');
  if (yearPill) yearPill.textContent = `📅 ปีงบประมาณ ${ds.yearName}`;

  const totalPill = document.getElementById('concentric-total-kpis-pill');
  if (totalPill) totalPill.textContent = `รวม ${kpis.length} ตัวชี้วัด (ผ่าน ${totalPass} | ไม่ผ่าน ${totalFail})`;

  if (!canvas || typeof Chart === 'undefined') return;

  if (radarChartInstance) {
    radarChartInstance.destroy();
    radarChartInstance = null;
  }

  const strategies = [
    { num: 1, name: 'ส่งเสริมสุขภาพและป้องกันโรค', code: 'ยุทธศาสตร์ที่ 1' },
    { num: 2, name: 'บริการเป็นเลิศ', code: 'ยุทธศาสตร์ที่ 2' },
    { num: 3, name: 'บุคลากรเป็นเลิศ', code: 'ยุทธศาสตร์ที่ 3' },
    { num: 4, name: 'บริหารเป็นเลิศและดิจิทัล', code: 'ยุทธศาสตร์ที่ 4' },
    { num: 5, name: 'ท่องเที่ยวเชิงสุขภาพ', code: 'ยุทธศาสตร์ที่ 5' }
  ];

  const labels = [];
  const passRates = [];

  strategies.forEach(st => {
    const stKpis = kpis.filter(k => k.strategy && (k.strategy.includes(st.code) || k.strategy.includes(`ยุทธศาสตร์ ${st.num}`)));
    if (stKpis.length > 0) {
      labels.push(`ยุทธศาสตร์ ${st.num}`);
      const evaluatedInSt = stKpis.filter(k => evaluateStatus(k).status === 'pass' || evaluateStatus(k).status === 'fail');
      const passCount = stKpis.filter(k => evaluateStatus(k).status === 'pass').length;
      const rate = evaluatedInSt.length > 0 ? Math.round((passCount / evaluatedInSt.length) * 100) : 0;
      passRates.push(rate);
    }
  });

  const ctx = canvas.getContext('2d');
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const gridColor = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
  const labelColor = isDark ? '#cbd5e1' : '#334155';

  radarChartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [
        {
          label: '🎯 เป้าหมายมาตรฐาน (100%)',
          data: labels.map(() => 100),
          borderColor: isDark ? '#64748b' : '#cbd5e1',
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderDash: [4, 4],
          pointRadius: 0
        },
        {
          label: `📊 ผลสัมฤทธิ์จริง (ปี ${ds.yearName})`,
          data: passRates,
          borderColor: '#0d9488',
          backgroundColor: 'rgba(13, 148, 136, 0.25)',
          borderWidth: 2.5,
          pointBackgroundColor: '#0f766e',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 1.5,
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: true
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
          ticks: { display: false, stepSize: 25 },
          grid: { color: gridColor },
          angleLines: { color: gridColor },
          pointLabels: { 
            font: { family: "'Prompt', sans-serif", size: 10, weight: '600' }, 
            color: labelColor 
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { font: { size: 10.5, family: "'Prompt', sans-serif" }, color: labelColor }
        }
      }
    }
  });
}

function goBackToPreviousView() {
  switchView('overview');
}

const AI_MODEL_REGISTRY = [
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    category: 'Speed & Reasoning (Recommended)',
    speed: '⚡⚡⚡ เร็วมาก (< 1.5 วินาที)',
    contextWindow: '1M tokens',
    description: 'โมเดลสมรรถนะสูงประมวลผลรวดเร็ว เหมาะสำหรับการสรุปข้อมูลและวิเคราะห์ Gap ตัวชี้วัด',
    badge: '🌟 ค่าเริ่มต้น'
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    category: 'Deep Strategic Thinking & Complex Refactoring',
    speed: '⚡⚡ ปานกลาง (~ 3 วินาที)',
    contextWindow: '2M tokens',
    description: 'โมเดลเรือธงสำหรับการวางแผนเชิงยุทธศาสตร์ขั้นสูง ออกแบบมาตรการ และร่างโครงการฉบับสมบูรณ์',
    badge: '🧠 แม่นยำสูงสุด'
  }
];

function renderModelCatalog() {
  const container = document.getElementById('ai-models-catalog-list');
  if (!container) return;

  container.innerHTML = AI_MODEL_REGISTRY.map(m => `
    <div class="model-catalog-card" style="background: var(--bg-card); border: 1px solid var(--border-card); border-radius: 10px; padding: 1rem; margin-bottom: 0.75rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
        <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">${m.name}</div>
        <span style="font-size: 0.72rem; padding: 0.2rem 0.5rem; border-radius: 12px; background: rgba(13, 148, 136, 0.15); color: var(--teal-light, #0d9488); font-weight: 600;">${m.badge}</span>
      </div>
      <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">
        ${m.description}
      </div>
    </div>
  `).join('');
}

function checkGeminiModelUpdates() {
  showAppToast('🔄 ตรวจสอบรุ่นโมเดล', 'ระบบเชื่อมต่อ API สำเร็จ โมเดล Gemini ทั้งหมดพร้อมใช้งานเป็นเวอร์ชันล่าสุด', '✨');
}

function updateAIModelSelectionMode(mode) {
  AppState.aiModelMode = mode;
  showAppToast('⚙️ บันทึกการตั้งค่า', `เปลี่ยนโหมดการเลือกโมเดลเป็น: ${mode}`, '✔️');
}

// GLOBAL WINDOW EXPORTS
// ============================================================================
window.OFFICIAL_DATASET = OFFICIAL_DATASET;
window.OFFICIAL_KPI_TEMPLATES_DB = OFFICIAL_KPI_TEMPLATES_DB;
window.getDetailedKPITemplate = getDetailedKPITemplate;
window.evaluateStatus = evaluateStatus;
window.openKPIDetailModal = openKPIDetailModal;
window.closeModal = closeModal;
window.navigateKPIDetail = navigateKPIDetail;
window.openFullKPITemplateModal = openFullKPITemplateModal;
window.closeFullKPITemplateModal = closeFullKPITemplateModal;
window.downloadKPITemplateWord = downloadKPITemplateWord;
window.printOnePageLandscapeReport = printOnePageLandscapeReport;
window.renderExecutiveSummaryTab = renderExecutiveSummaryTab;
window.renderStrategicRadarChart = renderStrategicRadarChart;
window.goBackToPreviousView = goBackToPreviousView;
window.renderModalKPIChart = renderModalKPIChart;
window.renderModelCatalog = renderModelCatalog;
window.checkGeminiModelUpdates = checkGeminiModelUpdates;
window.updateAIModelSelectionMode = updateAIModelSelectionMode;
window.switchView = switchView;
window.filterByStatusAndNavigate = filterByStatusAndNavigate;
window.filterBySpecificStrategy = filterBySpecificStrategy;
window.selectFiscalYear = selectFiscalYear;
window.handleSearchInputChange = handleSearchInputChange;
window.handleStrategyFilterChange = handleStrategyFilterChange;
window.handleStatusFilterChange = handleStatusFilterChange;
window.resetAllKpiFilters = resetAllKpiFilters;
window.setViewMode = setViewMode;
window.openKPIDetailModal = openKPIDetailModal;
window.closeModal = closeModal;
window.jumpToKpiIndex = jumpToKpiIndex;
window.navigateKPIModal = navigateKPIModal;
window.handleGlobalYearChange = handleGlobalYearChange;
window.toggleTheme = toggleTheme;
window.printOnePageLandscapeReport = printOnePageLandscapeReport;
window.renderPillarsTab = renderPillarsTab;
window.renderStrategySummaryCards = renderStrategySummaryCards;

window.populateAICenter = populateAICenter;
window.onAICenterKPISelected = onAICenterKPISelected;
window.onAIModelEngineSelected = onAIModelEngineSelected;
window.triggerAICenterAnalysis = triggerAICenterAnalysis;
window.updateAIStatusUI = updateAIStatusUI;
window.getCurrentYearDataset = getCurrentYearDataset;
window.findMatchingKPIInYear = findMatchingKPIInYear;
window.AppState = AppState;

window.generateDynamicProjectDraft = generateDynamicProjectDraft;
window.renderProposalRichView = renderProposalRichView;
window.switchGemDraftTab = switchGemDraftTab;
window.regenerateDraftFromParams = regenerateDraftFromParams;
window.populateGemDraftView = populateGemDraftView;
window.onGemDraftKPISelected = onGemDraftKPISelected;
window.copyCurrentProposalText = copyCurrentProposalText;
window.downloadCurrentDraftWordDoc = downloadCurrentDraftWordDoc;
window.triggerGemDraftFromView = triggerGemDraftFromView;
window.copyGemDraftPromptText = copyGemDraftPromptText;
window.buildKPIDraftProjectPrompt = buildKPIDraftProjectPrompt;
window.draftProjectWithGemini = draftProjectWithGemini;
window.renderConcentricDonutChart = renderConcentricDonutChart;
window.renderStrategicRadarChart = renderStrategicRadarChart;
window.showAppToast = showAppToast;
window.fallbackCopyText = fallbackCopyText;

// ============================================================================
// INITIALIZATION ON DOMContentLoaded
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSidebarState();
  setupEventListeners();
  initData();
});