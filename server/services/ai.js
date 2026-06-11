const MOCK_ANALYSES = {
  Plumbing: {
    issue: 'Leaking Faucet Cartridge',
    confidence: 87,
    severity: 'Moderate',
    canDIY: false,
    estimatedCost: { min: 140, max: 200 },
    estimatedTime: '1–2 hours',
    risks: ['Water damage if left untreated', 'Mold growth within 24–48 hours'],
    immediateSteps: ['Turn off water supply valve under sink', 'Place bucket to catch drips'],
    maintenanceTips: ['Replace cartridges every 5–7 years', 'Check for mineral buildup annually'],
    fixedPrice: 170,
  },
  HVAC: {
    issue: 'Clogged Air Filter & Reduced Airflow',
    confidence: 92,
    severity: 'Low',
    canDIY: true,
    estimatedCost: { min: 80, max: 160 },
    estimatedTime: '1–3 hours',
    risks: ['Reduced efficiency increases energy bill by 15–20%', 'Potential motor burnout'],
    immediateSteps: ['Check filter condition', 'Clear any debris around outdoor unit'],
    maintenanceTips: ['Replace filter every 60–90 days', 'Schedule annual tune-up'],
    fixedPrice: 95,
  },
  Electrical: {
    issue: 'Faulty GFCI Outlet or Tripped Breaker',
    confidence: 84,
    severity: 'High',
    canDIY: false,
    estimatedCost: { min: 110, max: 180 },
    estimatedTime: '1–2 hours',
    risks: ['Risk of electric shock', 'Potential fire hazard — do not use outlet'],
    immediateSteps: ['Do not touch damaged outlet', 'Reset breaker if safe to do so'],
    maintenanceTips: ['Test GFCI outlets monthly', 'Have panel inspected every 10 years'],
    fixedPrice: 140,
  },
  Appliance: {
    issue: 'Worn Door Gasket / Drain Pump Obstruction',
    confidence: 79,
    severity: 'Low',
    canDIY: false,
    estimatedCost: { min: 95, max: 250 },
    estimatedTime: '1–3 hours',
    risks: ['Leaking water could damage flooring', 'Electrical hazard if water reaches wiring'],
    immediateSteps: ['Unplug appliance', 'Check for visible blockages in drain'],
    maintenanceTips: ['Clean door seal monthly', 'Run cleaning cycle every 30 days'],
    fixedPrice: 125,
  },
  Roofing: {
    issue: 'Missing Shingles / Flashing Damage',
    confidence: 81,
    severity: 'High',
    canDIY: false,
    estimatedCost: { min: 200, max: 600 },
    estimatedTime: '3–6 hours',
    risks: ['Active leak can cause structural damage', 'Mold risk within 24 hours of water intrusion'],
    immediateSteps: ['Place buckets inside if actively leaking', 'Do not attempt roof access in wet conditions'],
    maintenanceTips: ['Inspect roof twice yearly', 'Clear gutters each fall and spring'],
    fixedPrice: 350,
  },
};

async function analyzeIssue(category, description) {
  if (process.env.OPENAI_API_KEY) {
    try {
      const OpenAI = require('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const prompt = `You are an expert home repair AI. Analyze this home repair issue.

Category: ${category}
User Description: ${description || 'No description provided'}

Return ONLY valid JSON with this exact structure (no markdown):
{
  "issue": "specific problem name",
  "confidence": 85,
  "severity": "Low|Moderate|High|Critical",
  "canDIY": false,
  "estimatedCost": { "min": 100, "max": 200 },
  "estimatedTime": "1-2 hours",
  "risks": ["risk 1", "risk 2"],
  "immediateSteps": ["step 1", "step 2"],
  "maintenanceTips": ["tip 1", "tip 2"],
  "fixedPrice": 150
}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.3,
      });

      const text = response.choices[0].message.content.trim();
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}') + 1;
      return JSON.parse(text.slice(start, end));
    } catch (err) {
      console.error('OpenAI error, falling back to mock:', err.message);
    }
  }

  const base = MOCK_ANALYSES[category] || MOCK_ANALYSES.Plumbing;
  if (description && description.length > 10) {
    return { ...base, confidence: Math.min(95, base.confidence + 5) };
  }
  return base;
}

module.exports = { analyzeIssue };
