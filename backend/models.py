from pydantic import BaseModel
from typing import Dict, List

class ScoreChange(BaseModel):
    score: int
    change: int

class InputData(BaseModel):
    fleetScores: Dict[str, ScoreChange]
    hosViolations: Dict[str, int]
    safetyEvents: Dict[str, int]
    unassignedDriving: Dict[str, int]
    speedingEvents: Dict[str, int]
    personalConveyance: Dict[str, int]
    missedDVIR: Dict[str, int]
    contacts: List[str]
