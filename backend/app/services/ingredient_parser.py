from typing import List


def parse_ingredients(text: str) -> List[str]:
    if not text:
        return []

    # normalize only whitespace, do NOT alter words
    cleaned = text.replace("\n", " ").strip()

    parts = []
    for seg in cleaned.split(","):
        name = seg.strip()
        if name:
            parts.append(name)

    # dedupe while preserving order
    seen = set()
    result = []
    for p in parts:
        key = p.lower()
        if key not in seen:
            seen.add(key)
            result.append(p)

    return result
