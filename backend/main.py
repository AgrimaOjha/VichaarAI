from fastapi import FastAPI
from pydantic import BaseModel
from groq import Groq
from agents import EssaySystem
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# ✅ Load env variables
load_dotenv()

app = FastAPI()

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔐 Secure API key
API_KEY = os.getenv("GROQ_API_KEY")

if not API_KEY:
    raise ValueError("❌ GROQ_API_KEY not found in .env")

client = Groq(api_key=API_KEY)
system = EssaySystem(client, "llama-3.3-70b-versatile")


class Request(BaseModel):
    topic: str


@app.post("/generate")
def generate(req: Request):
    essay, score, history = system.run(req.topic)

    return {
        "essay": essay,
        "score": score,
        "history": history
    }