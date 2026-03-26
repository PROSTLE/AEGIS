"""Pydantic Schemas for AEGIS API"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CityBase(BaseModel):
    name: str
    state: str
    latitude: float
    longitude: float

class CityResponse(CityBase):
    id: int
    ecosystem_score: float
    updated_at: datetime

    class Config:
        from_attributes = True

class StartupInput(BaseModel):
    idea: str
    startup_type: str
    city: str
    team_size: Optional[int] = 1
    funding_stage: Optional[str] = "pre-seed"

class HeatmapRequest(BaseModel):
    sector: Optional[str] = None
    year: Optional[int] = 2025

class SurvivalPredictionResponse(BaseModel):
    survival_probability: float
    risk_factors: List[str]
    strengths: List[str]
    similar_failures: List[str]

class LogisticsScoreResponse(BaseModel):
    overall_score: float
    delivery_density: float
    supplier_proximity: float
    port_highway_access: float
    cold_chain_availability: float

class WorkforceResponse(BaseModel):
    workforce_score: float
    required_roles: List[str]
    density_per_10k: float
    average_wages: dict
    hiring_channels: List[str]

class LocationRecommendation(BaseModel):
    zone_name: str
    price_per_sqft: float
    zoning_type: str
    proximity_score: float

class InvestorMatch(BaseModel):
    investor_id: int
    name: str
    compatibility_score: float
    sector_focus: str
    cheque_size: dict

class LaunchReadinessRequest(BaseModel):
    city: str
    startup_idea: str
    startup_type: str
    team_size: Optional[int] = 1

class LaunchReadinessResponse(BaseModel):
    launch_readiness_score: float
    narrative: str
    strengths: List[str]
    risks: List[str]
    alternative_cities: List[dict]
    investor_matches: List[InvestorMatch]
