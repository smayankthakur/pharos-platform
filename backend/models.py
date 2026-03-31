from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    company = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    alerts = relationship("Alert", back_populates="user")
    insights = relationship("AIInsight", back_populates="user")

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    plant_location = Column(String(255), nullable=True)
    compliance_score = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    detail = Column(Text, nullable=True)
    severity = Column(String(50), nullable=False)  # critical, warning, info, ok
    icon = Column(String(10), nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    is_resolved = Column(Boolean, default=False)

    user = relationship("User", back_populates="alerts")

class AIInsight(Base):
    __tablename__ = "ai_insights"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    recommendations = Column(Text, nullable=True)  # JSON string of recommendations
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    analysis_type = Column(String(100), nullable=True)  # procurement, compliance, risk

    user = relationship("User", back_populates="insights")

class InventoryItem(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String(100), nullable=False)
    name = Column(String(255), nullable=False)
    batch = Column(String(100), nullable=False)
    stock = Column(Float, nullable=False)
    expiry = Column(String(20), nullable=False)
    status = Column(String(100), nullable=False)
    trend_data = Column(Text, nullable=True)  # JSON string of trend data
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
