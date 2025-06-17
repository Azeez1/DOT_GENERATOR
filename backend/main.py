from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from backend.models import InputData
from backend.config import OPENAI_API_KEY, OPENAI_MODEL, OPENAI_TIMEOUT

# Pydantic models for request/response structures
class CompanyInfo(BaseModel):
    name: str
    industry: str
    primaryColor: str
    secondaryColor: str
    logoDesc: str
    reportPeriod: str


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
    # Build the prompt to verify placeholder data
    from backend import openai_client
    openai_client._build_prompt(payload.model_dump())

    # For now return a single stub section as placeholder
    return GenerateResponse(
        sections=[Section(title="Stub", markdown="Work in progress")]
    )
