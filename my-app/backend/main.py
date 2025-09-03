import os
import random
import string
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from supabase import create_client
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()

# ---------- Models ----------
class SignupRequest(BaseModel):
    real_name: str
    email: str
    password: str
    role: str  # beneficiary | volunteer
    profile_text: str  # skills (volunteer) or needs (beneficiary)


class MatchRequest(BaseModel):
    user_id: str  # Beneficiary ID


class MessageRequest(BaseModel):
    match_id: str
    sender_id: str
    receiver_id: str
    text: str


# ---------- Utility ----------
def generate_alias(role: str) -> str:
    prefix = "BEN" if role == "beneficiary" else "VOL"
    return prefix + "-" + "".join(random.choices(string.digits, k=4))


def get_embedding(text: str):
    response = openai_client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding


# ---------- Routes ----------
@app.post("/signup")
def signup(user: SignupRequest):
    alias = generate_alias(user.role)
    embedding = get_embedding(user.profile_text)

    # Insert into Supabase users table
    result = supabase.table("users").insert({
        "alias": alias,
        "role": user.role,
        "real_name": user.real_name,
        "email": user.email,
        "password_hash": user.password,  # NOTE: hash properly in production
        "embedding": embedding
    }).execute()

    if result.error:
        raise HTTPException(status_code=400, detail=result.error.message)

    return {"message": "Signup successful", "alias": alias}


@app.post("/match")
def match(req: MatchRequest):
    # Get beneficiary embedding
    user = supabase.table("users").select("embedding").eq("id", req.user_id).single().execute()
    if not user.data:
        raise HTTPException(status_code=404, detail="Beneficiary not found")

    beneficiary_embedding = user.data["embedding"]

    # Query top 5 volunteers by similarity
    query = f"""
    with b as (
      select embedding from users where id = '{req.user_id}'
    )
    select id, alias, 1 - (b.embedding <=> u.embedding) as similarity
    from users u, b
    where u.role = 'volunteer'
    order by similarity desc
    limit 5;
    """

    # results = supabase.rpc("exec_sql", {"query": query}).execute()  # needs Postgres function OR use psycopg2 directly
    # return {"matches": results.data}

    results = supabase.rpc(
        "match_volunteers",
        {"beneficiary_id": req.user_id, "match_limit": 5}
    ).execute()

    return {"matches": results.data}


@app.post("/message")
def send_message(msg: MessageRequest):
    result = supabase.table("messages").insert({
        "match_id": msg.match_id,
        "sender_id": msg.sender_id,
        "receiver_id": msg.receiver_id,
        "text": msg.text
    }).execute()

    if result.error:
        raise HTTPException(status_code=400, detail=result.error.message)

    return {"message": "Sent"}


@app.get("/messages/{match_id}")
def get_messages(match_id: str):
    result = supabase.table("messages").select("*").eq("match_id", match_id).order("created_at").execute()
    return {"messages": result.data}
