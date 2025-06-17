# DOT Fleet Compliance Report Generator — **AI Agent Specification**

## 1  Purpose

This agent converts raw fleet‑compliance data into a polished, multi‑page **DOT Fleet Compliance Snapshot**. It receives a JSON payload from the React front‑end, builds an advanced prompt, calls the OpenAI Chat Completions API, and returns analytically rich Markdown blocks that the UI renders and later exports to PDF.

---

## 2  Responsibilities

| Phase              | Agent Duty                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------ |
| **Validate**       | Reject incomplete / malformed fields and respond with `status:error`                       |
| **Prompt Build**   | Inject payload into the *DOT Fleet Compliance Report Generation Prompt* (see § 4)          |
| **AI Call**        | `POST https://api.openai.com/v1/chat/completions`, model =`gpt‑4o‑mini`, temperature = 0.2 |
| **Package Return** | JSON `{ "sections": [ {"title","markdown"}, … ] }` matching the front‑end expectation      |
| **Errors**         | Include `detail` & `suggested_fix` so UI can display human‑readable messages               |

---

## 3  Request → Response Contract

### `POST /generate`

```jsonc
{
  "companyInfo": {
    "name": "ACME Logistics",
    "industry": "Construction",
    "primaryColor": "#2563EB",
    "secondaryColor": "#DC2626",
    "logoDesc": "Blue shield with white road icon",
    "reportPeriod": "06/02/2025 – 06/08/2025"
  },
  "inputData": {
    "fleetScores": { "corporate": {"score":87,"change":-3}, "greatLakes":{…} },
    "hosViolations": { /* … */ },
    "safetyEvents":   { /* … */ },
    "unassignedDriving": { /* … */ },
    "speedingEvents": { /* … */ },
    "personalConveyance": { /* … */ },
    "missedDVIR": { /* … */ },
    "contacts": [ "alice@example.com", "bob@example.com" ]
  }
}
```

### Success

```jsonc
{
  "sections": [
    { "title": "Visual Dashboard", "markdown": "…" },
    { "title": "Overall Fleet Safety Summary",        "markdown": "…" },
    { "title": "HOS Violations Summary",               "markdown": "…" },
    { "title": "4‑Week Trend Analysis",                "markdown": "…" },
    { "title": "Safety Events Analysis",               "markdown": "…" },
    { "title": "Personal Conveyance Usage",            "markdown": "…" },
    { "title": "Unassigned Driving Segments",          "markdown": "…" },
    { "title": "Driver Behaviour & Speeding Analysis", "markdown": "…" },
    { "title": "Missed DVIRs",                         "markdown": "…" },
    { "title": "Overall DOT Risk Assessment",          "markdown": "…" }
  ]
}
```

---

## 4  Prompt Template (verbatim from the client’s specification) fileciteturn2file0

Paste **exactly** the following text into the `messages[0].content` field, replacing bracketed placeholders with real data. Keep line‑breaks and markdown headers intact so the AI returns ready‑to‑render Markdown.

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
* **[COMPANY_NAME]**  – *DOT Fleet Compliance Snapshot*
* Date range [REPORT_PERIOD]

## Fleet Score Widget
* Show scores & Δ for each region, colour‑coded
* Target line = 90 ("Fleet Safety Score Goal: 90")

## HOS Violations Chart
* Stacked bar by region (GL, OV, SE)
* Colour key: Missing Certifications (cyan), Shift Duty Limit (orange), Shift Driving Limit (yellow), Cycle Limit (white)

## 4‑Week Trend Analysis
* Line graph per violation type, X = last 4 weeks, Y = 0‑200

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

The agent **must** preserve section order and produce Markdown that the UI can render directly.

---

## 5  Environment Variables (Backend)

| Name             | Description                              |
| ---------------- | ---------------------------------------- |
| `OPENAI_API_KEY` | Secret for Chat Completions API          |
| `OPENAI_MODEL`   | default `gpt‑4o-mini` – override allowed |
| `OPENAI_TIMEOUT` | request timeout ms (default 30 000)      |

---

## 6  Rate‑Limiting & Resilience

- In‑memory token bucket ‑ 60 req/min.
- Exponential back‑off for transient `5xx` or `rate_limit_exceeded`.

---

## 7  Future Enhancements

1. Stream responses for faster UX
2. Auto‑ingest telematics via webhook
3. Multi‑language support
4. RAG enrichment with historical reports

