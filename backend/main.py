from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

# Pydantic models for request/response structures
class CompanyInfo(BaseModel):
    name: str
    industry: str
    primaryColor: str
    secondaryColor: str
    logoDesc: str
    reportPeriod: str


class InputData(BaseModel):
    fleetScores: dict
    hosViolations: dict
    safetyEvents: dict
    unassignedDriving: dict
    speedingEvents: dict
    personalConveyance: dict
    missedDVIR: dict
    contacts: List[str]


class GenerateRequest(BaseModel):
    companyInfo: CompanyInfo
    inputData: InputData


class Section(BaseModel):
    title: str
    markdown: str


class GenerateResponse(BaseModel):
    sections: List[Section]


app = FastAPI(title="DOT Fleet Compliance Report Generator")


@app.post("/generate", response_model=GenerateResponse)
async def generate_report(payload: GenerateRequest):
    # For now return a single stub section as placeholder
    return GenerateResponse(
        sections=[Section(title="Stub", markdown="Work in progress")]
    )
