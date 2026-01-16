from typing import List, Optional
from enum import Enum
from pydantic import BaseModel


class ProductType(str, Enum):
    skincare = "skincare"
    food = "food"


class SkinType(str, Enum):
    oily = "oily"
    dry = "dry"
    sensitive = "sensitive"
    acne_prone = "acne_prone"
    normal = "normal"


class UserProfile(BaseModel):
    skin_type: Optional[SkinType] = None
    allergies: Optional[List[str]] = []
    dietary_preferences: Optional[List[str]] = []


class AnalyzeRequest(BaseModel):
    product_type: ProductType
    ingredients_text: str
    user_profile: Optional[UserProfile] = UserProfile()


class ParsedIngredient(BaseModel):
    name: str
    category: Optional[str]
    safety_level: str
    explanation: Optional[str]


class OverallScore(BaseModel):
    safety_score: float
    suitability_score: float
    summary: str


class AnalyzeResponse(BaseModel):
    parsed_ingredients: List[ParsedIngredient]
    overall_score: OverallScore
    warnings: List[str] = []
    alternative_suggestions: List[str] = []
