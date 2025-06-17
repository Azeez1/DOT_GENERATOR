# DOT Fleet Compliance Report Generator — **AI Agent Specification**

> **Version 1.1 · 17 Jun 2025**  — aligns the agent logic with the full prompt in *DOT Fleet Compliance Report Automation Prompt.pdf*.

---

## 1  Purpose

Turn a weekly snapshot of fleet‑compliance metrics into a polished **DOT Fleet Compliance Snapshot** (Markdown → rendered to PDF).  The agent lives in the FastAPI backend, hiding the OpenAI key from the browser.

---

## 2  Agent Responsibilities

| Phase                                    | Duty (Success ⇢ Error)                                                   |
| ---------------------------------------- | ------------------------------------------------------------------------ |
| **Validate**                             | Check required keys present & numeric; else `{status:"error", detail,…}` |
| **Prompt Build**                         | Inject payload into **canonical prompt** (§ 4)                           |
| **AI Call**                              | `POST https://api.openai.com/v1/chat/completions`                        |
| model =`gpt‑4o-mini` · `temperature=0.2` |                                                                          |
| **Package**                              | Return `{ "sections": [ {title, markdown}, … ] }` (order strict)         |
| **Errors**                               | Surface `detail`, `suggested_fix`; map OpenAI errors to 4xx/5xx          |
| **Rate Limit**                           | In‑mem token bucket 60 req/min; retry exponential back‑off on 429/5xx    |

---

## 3  Request ⇢ Response Contract

### Endpoint

```
POST /generate   (JSON)
```

### Payload (example)

```jsonc
{
  "companyInfo": {
    "name": "ACME Logistics",
    "industry": "Construction",
    "primaryColor": "#2563EB",
    "secondaryColor": "#DC2626",
    "logoDesc": "Blue shield with white road icon",
    "reportPeriod": "06/02/2025 – 06/08/2025"
  },
  "inputData": {
    "fleetScores": {
      "corporate":   { "score": 87, "change": -3 },
      "greatLakes":  { "score": 92, "change":  +4 },
      "ohioValley":  { "score": 81, "change":  -1 },
      "southeast":   { "score": 79, "change":  +5 }
    },
    "hosViolations":        { /* … */ },
    "safetyEvents":         { /* … */ },
    "unassignedDriving":    { /* … */ },
    "speedingEvents":       { /* … */ },
    "personalConveyance":   { /* … */ },
    "missedDVIR":           { /* … */ },
    "contacts": ["ops@acme.com", "fleet@acme.com"]
  }
}
```

### Success

```jsonc
{
  "sections": [
    { "title": "Visual Dashboard",                       "markdown": "…" },
    { "title": "Overall Fleet Safety Summary",            "markdown": "…" },
    { "title": "HOS Violations Summary",                  "markdown": "…" },
    { "title": "4‑Week Trend Analysis",                   "markdown": "…" },
    { "title": "Safety Events Analysis",                  "markdown": "…" },
    { "title": "Personal Conveyance Usage",               "markdown": "…" },
    { "title": "Unassigned Driving Segments",             "markdown": "…" },
    { "title": "Driver Behaviour & Speeding Analysis",    "markdown": "…" },
    { "title": "Missed DVIRs",                            "markdown": "…" },
    { "title": "Overall DOT Risk Assessment",             "markdown": "…" }
  ]
}
```

### Failure (pattern)

```jsonc
{
  "status": "error",
  "detail": "OpenAI quota exceeded",
  "suggested_fix": "Check billing or retry after reset"
}
```

---

## 4  Canonical Prompt Template  fileciteturn2file0

Paste the **verbatim** text below into `messages[0].content`, then replace bracketed placeholders with real data.  **Do not alter headings, order, or markdown syntax**—the UI depends on it.

```
You are an expert fleet compliance analyst tasked with creating weekly DOT Fleet Compliance Snapshot reports.
Generate a comprehensive report following this exact structure and format.

---
COMPANY INFORMATION REQUIRED
Company Name: [COMPANY_NAME]
Company Type/Industry: [INDUSTRY_TYPE]
Brand Colors: Primary [PRIMARY_COLOR], Secondary [SECONDARY_COLOR]
Logo Description: [LOGO_DETAILS]
Reporting Week: [REPORT_PERIOD]

INPUT DATA REQUIRED
Fleet safety scores (Corporate, Great Lakes, Ohio Valley, Southeast)
HOS violations (by type & region)
Safety events
Unassigned driving segments
Speeding events breakdown
Personal conveyance per driver
Missed DVIR data
Contacted individuals list

---
# 1 VISUAL DASHBOARD (Page 1)
## Header
* **[COMPANY_NAME]** – *DOT Fleet Compliance Snapshot*
* Date range [REPORT_PERIOD]

## Fleet Score Widget
* Show scores & Δ for each region, colour‑coded
* Target line = 90 ("Fleet Safety Score Goal: 90")

## HOS Violations Chart
* Stacked bar by region (GL, OV, SE)
* Colour key: Missing Certifications (cyan), Shift Duty Limit (orange), Shift Driving Limit (yellow), Cycle Limit (white)

## 4‑Week Trend Analysis
* Line graph per violation type, X = last 4 weeks, Y = 0‑200

## Safety Events Bar Chart
* Following Distance, Harsh Turn, Harsh Brake / Defensive Driving per region

## Unassigned Driving Segments
* Visual of segments & top contributors (vehicle ID + driver)

## Speeding Events Pie
* Light / Moderate / Heavy / Severe percentages & total

---
# 2 DETAILED ANALYSIS (Pages 2‑6)
### Overall Fleet Safety Summary
• Current fleet score vs goal  
• Regional changes  
• Key concerns / improvements

### HOS Violations Summary
• Total & WoW change  
• Regional breakdown, top violation types  
• **Insights:** paragraph

### HOS 4‑Week Trend Analysis
Describe persistent issues & improvements.

### Safety Events Analysis
Totals, dismissal rate, patterns, recommendations.

### Personal Conveyance Usage
Goal ≤ 3 h per driver. List violators, analyse compliance.

### Unassigned Driving Segments
Totals, breakdown, root causes & recommendations.

### Driver Behaviour & Speeding Analysis
High‑risk counts, severities, regional split, recommendations.

### Missed DVIRs
Pre‑trip vs post‑trip totals, offenders, compliance impact.

### Overall DOT Risk Assessment
Summarise compliance posture, key risk areas, trend, audit prep.

---
## 3 FORMATTING REQUIREMENTS
* Use brand colours & logo
* Bold key metrics, bullet lists, "Insights:" headers
* Tables with clear headers, totals, WoW arrows
* Percentages rounded 1 dp

## 4 TONE & STYLE
Professional, improvement‑focused, use DOT terms.

## 5 KEY METRICS TO CALCULATE
1. Fleet Safety Score (avg.)
2. HOS Violation Rate
3. Safety Event Dismissal Rate
4. Personal Conveyance Compliance Rate
5. DVIR Compliance Rate
6. Speeding Severity Distribution

## 6 VISUAL RECREATION INSTRUCTIONS
Colour palette & chart‑type guidance (see PDF for details).
```

---

## 5  Environment Variables

| Variable         | Default       | Notes                            |
| ---------------- | ------------- | -------------------------------- |
| `OPENAI_API_KEY` | —             | **Required**                     |
| `OPENAI_MODEL`   | `gpt‑4o-mini` | Override for gpt‑4o if available |
| `OPENAI_TIMEOUT` | `30000` (ms)  | Request timeout                  |

---

## 6  Future Enhancements

- **Streaming** partial responses for faster UX.
- **Webhook ingestion** of ELD/telematics to auto‑populate metrics.
- **Multi‑language** support (Spanish, French…).
- **RAG** with historical snapshots for longitudinal insights.

