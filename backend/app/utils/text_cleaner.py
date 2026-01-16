import re


def clean_text(text: str) -> str:
    # Normalize separators and strip excessive whitespace
    if not text:
        return ""
    txt = text.replace(';', ',')
    # remove parenthetical notes common in ingredient lists
    txt = re.sub(r"\([^)]*\)", "", txt)
    # normalize whitespace
    txt = re.sub(r"\s+", " ", txt)
    # keep original line breaks if any
    txt = txt.strip()
    return txt
