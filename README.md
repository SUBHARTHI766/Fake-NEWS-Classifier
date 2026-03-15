# 🔍 TruthLens — AI Fake News Detector

A 4th Semester AI Subject Project — A web-based fake news detector that uses **Claude AI** and **live web search** to analyze news claims and give a verdict with full reasoning.

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

## ⚙️ Setup Instructions

### Step 1 — Get a Free API Key
1. Go to [https://console.anthropic.com](https://console.anthropic.com)
2. Sign up for a free account
3. Go to **API Keys** → **Create Key**
4. Copy your API key

### Step 2 — Add Your API Key
Open `app.js` and replace line 9:
```js
const API_KEY = "YOUR_ANTHROPIC_API_KEY_HERE";
```
with your actual key:
```js
const API_KEY = "sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxx";
```

### Step 3 — Run the Project
Since the app calls an external API, you need to run it through a local server (not just open the HTML file directly).

**Option A — VS Code Live Server (easiest)**
1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code
2. Right-click `index.html` → **Open with Live Server**

**Option B — Python**
```bash
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

**Option C — Node.js**
```bash
npx serve .
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

## 🛡️ Important Notes

- **Never commit your API key to GitHub.** If you push to a public repo, remove or hide the key first.
- For a production deployment, move the API call to a backend server (Node.js/Python) so the key is not exposed in the browser.
- The Anthropic API has a free tier — check [https://console.anthropic.com](https://console.anthropic.com) for usage limits.

---

## 🎓 Tech Stack

| Technology | Purpose |
|---|---|
| HTML / CSS / JavaScript | Frontend UI |
| Anthropic Claude API | AI analysis + reasoning |
| Claude Web Search Tool | Live internet fact-checking |
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

4th Semester AI Subject Project  
Powered by [Claude AI](https://anthropic.com) by Anthropic
