from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="E-Wallet Sentiment Analysis API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "e-wallet-sentiment-ai"}


@app.post("/predict")
async def predict(text: str = ""):
    # Placeholder - akan diisi dengan model prediction nanti
    return {"text": text, "sentiment": "positive", "confidence": 0.0, "note": "model not loaded yet"}
