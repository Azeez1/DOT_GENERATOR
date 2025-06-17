import json
import openai
from backend.config import OPENAI_API_KEY, OPENAI_MODEL, OPENAI_TIMEOUT
from .main import GenerateRequest, Section


def _build_prompt(req_json: dict) -> str:
    company = req_json["companyInfo"]
    data = req_json["inputData"]
    template = """You are an expert fleet compliance analyst tasked with creating weekly DOT Fleet Compliance Snapshot reports.
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
Colour palette & chart‑type guidance (see PDF for details)."""

    filled = (
        template.replace("[COMPANY_NAME]", company["name"]).replace(
            "[INDUSTRY_TYPE]", company["industry"]).replace(
                "[PRIMARY_COLOR]", company["primaryColor"]).replace(
                    "[SECONDARY_COLOR]", company["secondaryColor"]).replace(
                        "[LOGO_DETAILS]",
                        company["logoDesc"]).replace(
                            "[REPORT_PERIOD]",
                            company["reportPeriod"]))

    # Log the final prompt for debugging
    print(filled)

    return filled




def get_completion(payload: GenerateRequest) -> list[Section]:
    api_key = OPENAI_API_KEY
    if not api_key:
        raise ValueError("OPENAI_API_KEY not set")
    model = OPENAI_MODEL

    client = openai.OpenAI(api_key=api_key, timeout=OPENAI_TIMEOUT/1000)
    messages = [{
        "role": "user",
        "content": _build_prompt(payload.model_dump())
    }]

    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=0.2,
    )

    content = response.choices[0].message.content
    data = json.loads(content)
    return [Section(**section) for section in data.get("sections", [])]
