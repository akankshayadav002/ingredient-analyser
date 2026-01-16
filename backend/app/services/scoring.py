from typing import List, Dict


def _safety_value(level: str) -> float:
    lvl = (level or "").lower()
    if lvl == "safe":
        return 1.0
    if lvl == "caution":
        return 0.5
    return 0.0


def compute_scores(parsed_ingredients: List[Dict], user_profile) -> Dict:
    if not parsed_ingredients:
        return {"safety_score": 0.0, "suitability_score": 0.0, "summary": "No ingredients provided"}

    vals = [_safety_value(i.get("safety_level")) for i in parsed_ingredients]
    avg = sum(vals) / len(vals)
    safety_score = round(avg * 10, 2)

    # suitability: start with safety, reduce for allergies/dietary conflicts
    suitability = avg
    allergies = set([a.lower() for a in (getattr(user_profile, "allergies", []) or [])])
    prefs = set([p.lower() for p in (getattr(user_profile, "dietary_preferences", []) or [])])

    # simple reductions
    for ing in parsed_ingredients:
        name = (ing.get("name") or "").lower()
        if any(a in name for a in allergies) and allergies:
            suitability -= 0.2
        if any(p in name for p in prefs) and prefs:
            suitability -= 0.15

    suitability = max(0.0, suitability)
    suitability_score = round(suitability * 10, 2)

    summary = "Generally safe" if safety_score >= 7 else "Exercise caution" if safety_score >= 4 else "Potentially unsafe"

    return {"safety_score": safety_score, "suitability_score": suitability_score, "summary": summary}
