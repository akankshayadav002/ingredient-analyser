from typing import List, Dict, Any


def build_prompt(
    ingredients: List[str],
    product_type: str,
    user_profile: Dict[str, Any],
) -> str:
    """
    Build a strict, token-safe prompt for ingredient safety analysis.
    Designed for LLMs like Groq GPT-OSS that require strong output constraints.
    """

    ingredient_list = ", ".join(ingredients)

    return f"""
You are a product ingredient safety reviewer with expertise in skincare and food formulation.

Analyze ingredients CONSERVATIVELY from a consumer-safety perspective.

IMPORTANT RULES (MUST FOLLOW):
- Do NOT assume ingredients are safe by default
- If an ingredient is controversial, debated, or commonly irritating → mark as "caution"
- Fragrance / perfume must NEVER be marked "safe"
- Preservatives, UV filters, solvents, and penetration enhancers are usually "caution"
- Fatty alcohols (e.g., cetyl alcohol) are NOT denatured alcohol
- If safety depends on concentration or formulation → use "caution"
- Do NOT give medical advice
- Explanation MUST be ≤ 15 words

OUTPUT RULES (STRICT):
- Return ONLY valid minified JSON
- No markdown
- No commentary
- No extra text
- warnings: MAX 3 items
- alternative_suggestions: MAX 3 items

JSON SCHEMA (MUST MATCH EXACTLY):
{{
  "parsed_ingredients": [
    {{
      "name": "string",
      "category": "solvent|humectant|emollient|preservative|uv_filter|vitamin|fragrance|chelator|ph_adjuster|other",
      "safety_level": "safe|caution|avoid",
      "explanation": "string"
    }}
  ],
  "warnings": ["string"],
  "alternative_suggestions": ["string"]
}}

CONTEXT:
- Product type: {product_type}
- Ingredients: {ingredient_list}
- User profile: {user_profile}
""".strip()
