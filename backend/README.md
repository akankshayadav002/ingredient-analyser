# AI Product Ingredient Analyzer - Backend

Run server:

```bash
python -m pip install -r backend/requirements.txt
export OPENAI_API_KEY=your_key_here
uvicorn app.main:app --reload --port 8000
```

The analyze endpoint is `POST /analyze`.
