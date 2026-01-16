from fastapi import APIRouter, HTTPException
from pydantic import ValidationError
from app.schemas.analyze import AnalyzeRequest, AnalyzeResponse
from app.services.ingredient_parser import parse_ingredients
from app.services.ai_analyzer import analyze_ingredients_ai
from app.services.scoring import compute_scores

router = APIRouter()


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(req: AnalyzeRequest):
    try:
        ingredients = parse_ingredients(req.ingredients_text)
        print(f"[ANALYZE_API] Parsed ingredients: {ingredients}")
        ai_result = await analyze_ingredients_ai(ingredients, req.product_type, req.user_profile.dict())
        print(ai_result)
        overall = compute_scores(ai_result.get("parsed_ingredients", []), req.user_profile)
        response = {**ai_result, "overall_score": overall}
        return response
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
