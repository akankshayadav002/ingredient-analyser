import os
import json
from typing import List, Dict, Any

from starlette.concurrency import run_in_threadpool
from groq import Groq

from app.core import prompts
from app.core.config import settings


# Initialize OpenAI client (v1.x)
client = Groq()
GROQ_API_KEY = settings.OPENAI_API_KEY

def _local_fallback(
    ingredients: List[str],
    product_type: str,
    user_profile: Dict[str, Any],
) -> Dict:
    """
    Conservative heuristic fallback if OpenAI is unavailable.
    """
    parsed = []

    avoid_keywords = ["lead", "mercury"]
    caution_keywords = ["paraben", "phenoxyethanol", "fragrance", "perfume"]

    for name in ingredients:
        lname = name.lower()
        safety = "safe"
        explanation = "No major safety concerns based on limited heuristic analysis."

        if any(k in lname for k in avoid_keywords):
            safety = "avoid"
            explanation = "Flagged due to potential toxicity concerns."
        elif any(k in lname for k in caution_keywords):
            safety = "caution"
            explanation = "May cause irritation or sensitivity in some individuals."

        parsed.append(
            {
                "name": name,
                "category": None,
                "safety_level": safety,
                "explanation": explanation,
            }
        )

    return {
        "parsed_ingredients": parsed,
        "warnings": [],
        "alternative_suggestions": [],
    }


async def analyze_ingredients_ai(
    ingredients: List[str],
    product_type: str,
    user_profile: Dict[str, Any],
) -> Dict:
    if not ingredients:
        return {
            "parsed_ingredients": [],
            "warnings": [],
            "alternative_suggestions": [],
        }

    # If API key is missing, fallback immediately
    print("Groq loaded:", GROQ_API_KEY[:6] if GROQ_API_KEY else None)
    if not GROQ_API_KEY:
        print("[AI_ANALYZER] Groq missing, using local fallback")
        return _local_fallback(ingredients, product_type, user_profile)

    prompt = prompts.build_prompt(ingredients, product_type, user_profile)

    def call_groq():
        model = "openai/gpt-oss-120b"
        print(f"[AI_ANALYZER] Calling Groq model: {model}")

        return client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": "You are a strict ingredient safety reviewer. "
                            "You must return ONLY valid JSON. No markdown."
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0.0,
            max_completion_tokens=1200,
            reasoning_effort="low"
        )


    try:
        raw = await run_in_threadpool(call_groq)
        print(raw);
        text = raw.choices[0].message.content

        payload = json.loads(text)

        if "parsed_ingredients" not in payload:
            raise ValueError("Invalid response structure")

        # ✅ Post-model deterministic guardrails
        for ing in payload["parsed_ingredients"]:
            name = ing.get("name", "").lower()

            if name in ["perfume", "fragrance"]:
                ing["safety_level"] = "caution"
                ing["explanation"] = (
                    "Fragrance is a common irritant and may trigger sensitivity reactions."
                )

        return payload

    except Exception as e:
        print("[AI_ANALYZER] Groq error, falling back:", str(e))
        return _local_fallback(ingredients, product_type, user_profile)
