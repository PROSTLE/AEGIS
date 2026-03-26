"""Database Models for AEGIS"""
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class City(Base):
    __tablename__ = "cities"

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, index=True)
    state = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    ecosystem_score = Column(Float, default=0.0)
    updated_at = Column(DateTime, default=datetime.utcnow)

class Startup(Base):
    __tablename__ = "startups"

    id = Column(Integer, primary_key=True)
    name = Column(String, index=True)
    city = Column(String)
    sector = Column(String)
    founded_year = Column(Integer)
    funding_stage = Column(String)
    team_size = Column(Integer)
    survival_prediction = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

class Investor(Base):
    __tablename__ = "investors"

    id = Column(Integer, primary_key=True)
    name = Column(String, index=True)
    sector_focus = Column(String)
    city_preference = Column(String)
    cheque_size_min = Column(Float)
    cheque_size_max = Column(Float)
    stage_preference = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class CachedScore(Base):
    __tablename__ = "cached_scores"

    id = Column(Integer, primary_key=True)
    city = Column(String, index=True)
    sector = Column(String, nullable=True)
    score_type = Column(String)  # e.g., "ecosystem", "logistics", "workforce"
    score_value = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime)
