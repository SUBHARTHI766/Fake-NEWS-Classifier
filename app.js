// ===========================
//   TruthLens — app.js
//   AI Fake News Detector
// ===========================

// ---- CONFIG ----
// API key is loaded from config.js (generated from your .env file)
// See config.example.js for setup instructions
const API_KEY = window.ENV?.GEMINI_API_KEY || "";

const EXAMPLES = [
  "Scientists at MIT have invented a pill that can completely replace the need for sleep, requiring only one tablet per week to stay fully alert.",
  "NASA confirms the moon is slowly drifting away from Earth at 3.8 cm per year and may eventually escape Earth's gravitational pull.",
  "The WHO has officially declared that 5G towers are causing COVID-19 mutations and has called for an immediate global shutdown of all 5G networks.",
  "A new Stanford study proves that eating chocolate daily improves memory and IQ scores by up to 30 percent.",
  "Scientists have discovered a species of jellyfish that is biologically immortal and can reverse its aging process indefinitely.",
];

const STEPS = [
  "Reading and understanding the claim",
  "Searching the web for related sources",
  "Cross-referencing facts and evidence",
  "Generating AI verdict and analysis",
];

let stepInterval = null;
let currentStep = -1;

// ---- Utility Functions ----

function loadExample() {
  const random = EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)];
  document.getElementById("newsInput").value = random;
}

function clearAll() {
  document.getElementById("newsInput").value = "";
  document.getElementById("resultArea").innerHTML = "";
}

function setButtonLoading(loading) {
  const btn = document.getElementById("analyzeBtn");
  btn.disabled = loading;
  btn.innerHTML = loading
    ? `<div class="btn-spinner"></div> Analyzing...`
    : `🧠&nbsp; Analyze News`;
}

// ---- Step Animation ----

function startSteps() {
  clearInterval(stepInterval);
  currentStep = 0;
  renderLoadingCard();
  updateStep(0);

  stepInterval = setInterval(() => {
    currentStep++;
    if (currentStep < STEPS.length) {
      updateStep(currentStep);
    } else {
      clearInterval(stepInterval);
    }
  }, 2400);
}

function updateStep(active) {
  STEPS.forEach((_, i) => {
    const el = document.getElementById("step-" + i);
    if (!el) return;
    el.className = "step-item";
    if (i < active) el.classList.add("done");
    else if (i === active) el.classList.add("active");
  });
}

function renderLoadingCard() {
  const stepsHTML = STEPS.map(
    (s, i) => `
    <div class="step-item" id="step-${i}">
      <div class="step-dot"></div>
      <span>${s}</span>
    </div>
  `,
  ).join("");

  document.getElementById("resultArea").innerHTML = `
    <div class="loading-card">
      <div class="spinner"></div>
      <h3>Analyzing your claim...</h3>
      <p>Searching the web and cross-referencing sources</p>
      <div class="steps-list">${stepsHTML}</div>
    </div>
  `;
}

// ---- Main Analyze Function ----

async function analyze() {
  const text = document.getElementById("newsInput").value.trim();
  if (!text) {
    alert("Please paste a news headline or article first.");
    return;
  }

  if (!API_KEY) {
    document.getElementById("resultArea").innerHTML = `
      <div class="error-box">
        ⚠️ <strong>API Key not found.</strong> Make sure <code>config.js</code> is in the same 
        folder as <code>index.html</code> and loaded before <code>app.js</code>.<br><br>
        Get a key at: <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color:#00e5ff">aistudio.google.com</a>
      </div>`;
    return;
  }

  setButtonLoading(true);
  startSteps();

  const prompt = `You are an expert fact-checker and AI journalist. Analyze the following news claim and determine if it is REAL, FAKE, or PARTIALLY_TRUE. Use known verified knowledge and cite realistic sources.

NEWS CLAIM:
"${text}"

Respond ONLY with a valid JSON object in this exact structure (no markdown, no extra text):
{
  "verdict": "REAL" or "FAKE" or "PARTIALLY_TRUE",
  "confidence": <number 0-100>,
  "headline_verdict": "<one punchy sentence verdict>",
  "analysis": "<3-5 sentence detailed explanation with specific evidence>",
  "sources": [
    {"title": "<source name>", "finding": "<what this source says>", "supports": true or false},
    {"title": "<source name>", "finding": "<what this source says>", "supports": true or false}
  ],
  "possibility_score": <0-100 if FAKE, the likelihood this could become true in future — else null>,
  "possibility_reasoning": "<if FAKE: conditions that might make it true in future — else null>",
  "possibility_tags": ["<tag1>","<tag2>","<tag3>"] or null
}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1500,
          },
        }),
      },
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || "API error");
    }

    const fullText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!fullText) {
      const blockReason = data.candidates?.[0]?.finishReason || data.promptFeedback?.blockReason;
      throw new Error(`Empty response from Gemini${blockReason ? ` (reason: ${blockReason})` : ""}. Try rephrasing your input.`);
    }

    const clean = fullText.replace(/```json|```/g, "").trim();
    const jsonStart = clean.indexOf("{");
    const jsonEnd = clean.lastIndexOf("}") + 1;

    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error("Gemini did not return valid JSON. Raw response: " + clean.slice(0, 200));
    }

    const parsed = JSON.parse(clean.slice(jsonStart, jsonEnd));

    clearInterval(stepInterval);
    renderResult(parsed);
  } catch (err) {
    clearInterval(stepInterval);
    document.getElementById("resultArea").innerHTML = `
      <div class="error-box">
        ⚠️ Analysis failed: ${err.message || "Unknown error. Please try again."}
      </div>`;
  }

  setButtonLoading(false);
}

// ---- Render Result ----

function renderResult(data) {
  const map = {
    REAL: { label: "Likely Real", icon: "✓", cls: "real", color: "#00e676" },
    FAKE: { label: "Likely Fake", icon: "✕", cls: "fake", color: "#ff1744" },
    PARTIALLY_TRUE: {
      label: "Partially True",
      icon: "~",
      cls: "partial",
      color: "#ffab00",
    },
  };

  const v = map[data.verdict] || map["PARTIALLY_TRUE"];
  const confColor = v.color;

  const sourcesHTML = (data.sources || [])
    .map(
      (src) => `
    <div class="source-chip">
      <div class="source-dot" style="background: ${src.supports ? "#00e676" : "#ff1744"}"></div>
      <div>
        <div class="source-title">${src.title}</div>
        <div class="source-finding">${src.finding}</div>
      </div>
      <span class="source-badge ${src.supports ? "supports" : "contradicts"}">
        ${src.supports ? "SUPPORTS" : "CONTRADICTS"}
      </span>
    </div>
  `,
    )
    .join("");

  let possibilityHTML = "";
  if (data.verdict === "FAKE" && data.possibility_score !== null) {
    const tags = (data.possibility_tags || [])
      .map((t) => `<span class="poss-tag">${t}</span>`)
      .join("");

    possibilityHTML = `
      <div class="possibility-box">
        <div class="section-label">🔮 Could it become real?</div>
        <div class="poss-bar-header">
          <span>Possibility Score</span>
          <span class="poss-score">${data.possibility_score}%</span>
        </div>
        <div class="conf-track" style="margin-bottom:1rem">
          <div class="conf-fill" style="width:${data.possibility_score}%; background:#ffab00"></div>
        </div>
        <div class="poss-reasoning">${data.possibility_reasoning || ""}</div>
        ${tags ? `<div class="poss-tags">${tags}</div>` : ""}
      </div>`;
  }

  document.getElementById("resultArea").innerHTML = `
    <div class="result-card">
      <div class="verdict-banner ${v.cls}">
        <div class="verdict-icon">${v.icon}</div>
        <div>
          <div class="verdict-label">${v.label}</div>
          <div class="verdict-sub">${data.headline_verdict || ""}</div>
        </div>
        <div class="verdict-confidence">
          <div class="conf-number">${data.confidence}%</div>
          <div class="conf-unit">Confidence</div>
        </div>
      </div>
      <div class="result-body">
        <div class="conf-bar-wrap">
          <div class="conf-bar-header">
            <span>Confidence Level</span>
            <span>${data.confidence}%</span>
          </div>
          <div class="conf-track">
            <div class="conf-fill" style="width:${data.confidence}%; background:${confColor}"></div>
          </div>
        </div>
        <div>
          <div class="section-label">📋 Analysis</div>
          <div class="analysis-text">${data.analysis || ""}</div>
        </div>
        ${sourcesHTML ? `
        <div>
          <div class="section-label">🌐 Sources Checked</div>
          <div class="sources-list">${sourcesHTML}</div>
        </div>` : ""}
        ${possibilityHTML}
      </div>
    </div>`;
}

// ---- Inline spinner style ----
const style = document.createElement("style");
style.textContent = `
  .btn-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(0,0,0,.3);
    border-top-color: #000;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    display: inline-block;
  }
`;
document.head.appendChild(style);