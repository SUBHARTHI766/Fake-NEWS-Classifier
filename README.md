# 🔍 TruthLens — AI Fake News Detector

An AI Project — A web-based fake news detector that uses **Gemini AI** and **live web search** to analyze news claims and give a verdict with full reasoning.

---

## 🚀 Features

- **3 Verdicts** — Real ✅, Fake ❌, or Partially True ⚠️
- **Confidence Score** — AI confidence percentage with animated bar
- **Detailed Analysis** — 3–5 sentence explanation with specific evidence
- **Sources Checked** — Shows which web sources support or contradict the claim
- **"Could it become real?"** — If the news is fake, predicts the future possibility score with reasoning and tags
- **Live Web Search** — AI searches the internet in real time before giving a verdict
- **Clean Dark UI** — Modern dark-themed responsive design

---

## 📁 Project Structure

```
truthlens/
├── index.html    ← Main HTML page
├── style.css     ← All styles (dark theme)
├── app.js        ← All JavaScript + API logic
└── README.md     ← This file
```

---

## 🧠 How It Works

```
User pastes news
       ↓
JavaScript sends request to Claude AI (Anthropic API)
       ↓
Claude uses web_search tool to find related articles
       ↓
Claude cross-references facts from multiple sources
       ↓
Claude returns JSON verdict: REAL / FAKE / PARTIALLY_TRUE
       ↓
Website renders verdict, confidence score, sources, and future possibility
```

---

## 🎓 Tech Stack

| Technology | Purpose |
|---|---|
| HTML / CSS / JavaScript | Frontend UI |
| Gemini API | AI analysis + reasoning |
| Gemini Web Search Tool | Live internet fact-checking |
| Google Fonts (Syne + DM Sans) | Typography |

---

## 📸 Verdicts Explained

| Verdict | Meaning |
|---|---|
| ✅ **Likely Real** | AI found strong evidence supporting the claim |
| ❌ **Likely Fake** | AI found evidence contradicting or debunking the claim |
| ⚠️ **Partially True** | The claim has some truth but is misleading or incomplete |

---

## 👨‍💻 Made By

Aniruddha Dutta & Subharthi Bose
