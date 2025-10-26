import os
import random
import string
import json
from datetime import datetime
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple JSON file database
DB_FILE = Path("local_db.json")

def load_db():
    if DB_FILE.exists():
        with open(DB_FILE, 'r') as f:
            return json.load(f)
    return {"users": [], "matches": [], "messages": [], "flagged_messages": []}

def save_db(data):
    with open(DB_FILE, 'w') as f:
        json.dump(data, f, indent=2)

# Content filter words - identity and location revealing patterns
FILTER_PATTERNS = {
    "name_questions": [
        "what's your name", "what is your name", "your name", "my name is",
        "i'm called", "call me", "i am called", "my real name", "actual name",
        "full name", "first name", "last name", "surname"
    ],
    "location_questions": [
        "where do you live", "where are you from", "what city", "what town",
        "where you live", "your location", "your address", "my address",
        "i live in", "i live at", "live in", "located in", "from",
        "neighborhood", "street", "zip code", "postal code", "area code"
    ],
    "contact_info": [
        "phone number", "phone", "cell", "mobile", "telephone", "whatsapp",
        "email", "e-mail", "facebook", "instagram", "twitter", "snapchat",
        "social media", "contact me", "reach me", "call me", "text me"
    ],
    "meetup": [
        "meet up", "meet in person", "see you", "coffee", "lunch", "dinner",
        "hang out", "get together", "visit me", "come over", "meet at"
    ],
    "personal_identifiers": [
        "work at", "i work", "school", "university", "college", "company",
        "employer", "age", "birthday", "birth date", "how old"
    ]
}

def check_message_for_filters(text: str) -> dict:
    """Check if message contains filtered content"""
    text_lower = text.lower()
    flagged_patterns = []

    for category, patterns in FILTER_PATTERNS.items():
        for pattern in patterns:
            if pattern in text_lower:
                flagged_patterns.append({
                    "category": category,
                    "pattern": pattern,
                    "matched_in": text
                })

    return {
        "is_flagged": len(flagged_patterns) > 0,
        "flagged_patterns": flagged_patterns,
        "category_summary": list(set([p["category"] for p in flagged_patterns]))
    }

# ---------- Models ----------
class SignupRequest(BaseModel):
    real_name: str
    email: str
    password: str
    role: str  # beneficiary | volunteer
    profile_text: str


class MatchRequest(BaseModel):
    user_id: str  # Beneficiary ID


class MessageRequest(BaseModel):
    match_id: str
    sender_id: str
    receiver_id: str
    text: str


class LoginRequest(BaseModel):
    email: str
    password: str


# ---------- Utility ----------
def generate_alias(role: str) -> str:
    prefix = "BEN" if role == "beneficiary" else "VOL"
    return prefix + "-" + "".join(random.choices(string.digits, k=4))


def generate_id() -> str:
    return "".join(random.choices(string.ascii_lowercase + string.digits, k=20))


# ---------- Routes ----------
@app.post("/signup")
def signup(user: SignupRequest):
    db = load_db()

    # Check if email already exists
    if any(u['email'] == user.email for u in db['users']):
        raise HTTPException(status_code=400, detail="Email already registered")

    alias = generate_alias(user.role)
    user_id = generate_id()

    new_user = {
        "id": user_id,
        "alias": alias,
        "role": user.role,
        "real_name": user.real_name,
        "email": user.email,
        "password_hash": user.password,  # NOTE: hash properly in production
        "verified": False,  # New users are unverified by default
        "verification_status": "pending",  # pending, approved, rejected
        "created_at": datetime.now().isoformat()
    }

    db['users'].append(new_user)
    save_db(db)

    return {"message": "Signup successful", "alias": alias}


@app.post("/match")
def match(req: MatchRequest):
    db = load_db()

    # Find beneficiary
    beneficiary = next((u for u in db['users'] if u['id'] == req.user_id), None)
    if not beneficiary:
        raise HTTPException(status_code=404, detail="Beneficiary not found")

    # Get all volunteers (simple matching - just return all volunteers)
    volunteers = [u for u in db['users'] if u['role'] == 'volunteer']

    return {"matches": volunteers[:5]}


@app.post("/message")
def send_message(msg: MessageRequest):
    db = load_db()

    # Check message for filtered content
    filter_result = check_message_for_filters(msg.text)

    message_id = generate_id()
    new_message = {
        "id": message_id,
        "match_id": msg.match_id,
        "sender_id": msg.sender_id,
        "receiver_id": msg.receiver_id,
        "text": msg.text,
        "created_at": datetime.now().isoformat(),
        "status": "pending_review" if filter_result["is_flagged"] else "sent",
        "flagged_info": filter_result if filter_result["is_flagged"] else None
    }

    if filter_result["is_flagged"]:
        # Store in flagged_messages for admin review
        if "flagged_messages" not in db:
            db["flagged_messages"] = []
        db['flagged_messages'].append(new_message)
    else:
        # Send message normally
        db['messages'].append(new_message)

    save_db(db)

    return {
        "message": "Sent" if not filter_result["is_flagged"] else "Pending review",
        "status": new_message["status"],
        "is_flagged": filter_result["is_flagged"],
        "flagged_categories": filter_result.get("category_summary", []) if filter_result["is_flagged"] else []
    }


@app.get("/messages/{match_id}")
def get_messages(match_id: str):
    db = load_db()
    # Get both sent and pending messages for this match
    sent_messages = [m for m in db['messages'] if m['match_id'] == match_id]
    pending_messages = [m for m in db.get('flagged_messages', []) if m['match_id'] == match_id]

    all_messages = sent_messages + pending_messages
    all_messages.sort(key=lambda x: x['created_at'])
    return {"messages": all_messages}


@app.post("/login")
def login(req: LoginRequest):
    db = load_db()

    # Find user by email
    user = next((u for u in db['users'] if u['email'] == req.email), None)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # NOTE: In production, use proper password hashing (bcrypt)
    if user["password_hash"] != req.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "user": {
            "id": user["id"],
            "alias": user["alias"],
            "role": user["role"],
            "real_name": user["real_name"],
            "email": user["email"]
        }
    }


@app.get("/user/{user_id}/matches")
def get_user_matches(user_id: str):
    db = load_db()

    # Find user
    user = next((u for u in db['users'] if u['id'] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get matches based on role
    if user['role'] == "beneficiary":
        matches = [m for m in db['matches'] if m.get('beneficiary_id') == user_id]
    else:
        matches = [m for m in db['matches'] if m.get('volunteer_id') == user_id]

    return {"matches": matches}


@app.post("/create-match")
def create_match(beneficiary_id: str, volunteer_id: str):
    """Helper endpoint to manually create a match for testing"""
    db = load_db()

    match_id = generate_id()

    # Find users
    beneficiary = next((u for u in db['users'] if u['id'] == beneficiary_id), None)
    volunteer = next((u for u in db['users'] if u['id'] == volunteer_id), None)

    if not beneficiary or not volunteer:
        raise HTTPException(status_code=404, detail="User not found")

    new_match = {
        "id": match_id,
        "beneficiary_id": beneficiary_id,
        "volunteer_id": volunteer_id,
        "beneficiary": beneficiary,
        "volunteer": volunteer,
        "status": "active",
        "image_sharing_enabled": False,  # Admin must enable
        "video_calls_enabled": False,    # Admin must enable
        "created_at": datetime.now().isoformat()
    }

    db['matches'].append(new_match)
    save_db(db)

    return {"match": new_match}


# ---------- Admin Endpoints ----------
@app.get("/admin/users")
def get_all_users():
    """Get all users in the system"""
    db = load_db()
    return {"users": db['users']}


@app.get("/admin/matches")
def get_all_matches():
    """Get all matches with user details"""
    db = load_db()
    return {"matches": db['matches']}


@app.get("/admin/stats")
def get_admin_stats():
    """Get dashboard statistics"""
    db = load_db()

    beneficiaries = [u for u in db['users'] if u['role'] == 'beneficiary']
    volunteers = [u for u in db['users'] if u['role'] == 'volunteer']

    # Count pending (unverified) users
    pending_beneficiaries = [b for b in beneficiaries if b.get('verification_status') == 'pending']
    pending_volunteers = [v for v in volunteers if v.get('verification_status') == 'pending']

    matched_beneficiary_ids = set(m['beneficiary_id'] for m in db['matches'])
    matched_volunteer_ids = set(m['volunteer_id'] for m in db['matches'])

    vacant_beneficiaries = [b for b in beneficiaries if b['id'] not in matched_beneficiary_ids]
    vacant_volunteers = [v for v in volunteers if v['id'] not in matched_volunteer_ids]

    return {
        "matched": len(db['matches']),
        "vacantVolunteers": len(vacant_volunteers),
        "vacantBeneficiaries": len(vacant_beneficiaries),
        "totalUsers": len(db['users']),
        "totalBeneficiaries": len(beneficiaries),
        "totalVolunteers": len(volunteers),
        "pendingVolunteers": len(pending_volunteers),
        "pendingBeneficiaries": len(pending_beneficiaries)
    }


@app.get("/admin/vacant-users")
def get_vacant_users():
    """Get unmatched users"""
    db = load_db()

    matched_beneficiary_ids = set(m['beneficiary_id'] for m in db['matches'])
    matched_volunteer_ids = set(m['volunteer_id'] for m in db['matches'])

    vacant_beneficiaries = [u for u in db['users'] if u['role'] == 'beneficiary' and u['id'] not in matched_beneficiary_ids]
    vacant_volunteers = [u for u in db['users'] if u['role'] == 'volunteer' and u['id'] not in matched_volunteer_ids]

    return {
        "vacantBeneficiaries": vacant_beneficiaries,
        "vacantVolunteers": vacant_volunteers
    }


@app.get("/admin/pending-users")
def get_pending_users():
    """Get users pending verification"""
    db = load_db()

    pending_beneficiaries = [u for u in db['users'] if u['role'] == 'beneficiary' and u.get('verification_status') == 'pending']
    pending_volunteers = [u for u in db['users'] if u['role'] == 'volunteer' and u.get('verification_status') == 'pending']

    return {
        "pendingBeneficiaries": pending_beneficiaries,
        "pendingVolunteers": pending_volunteers
    }


@app.post("/admin/verify-user")
def verify_user(user_id: str, approved: bool):
    """Verify or reject a user"""
    db = load_db()

    user = next((u for u in db['users'] if u['id'] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if approved:
        user['verified'] = True
        user['verification_status'] = 'approved'
    else:
        user['verified'] = False
        user['verification_status'] = 'rejected'

    save_db(db)

    return {"message": f"User {'approved' if approved else 'rejected'} successfully", "user": user}


@app.post("/admin/migrate-users")
def migrate_users():
    """Add verification fields to existing users who don't have them"""
    db = load_db()

    updated_count = 0
    for user in db['users']:
        if 'verified' not in user or 'verification_status' not in user:
            user['verified'] = False
            user['verification_status'] = 'pending'
            updated_count += 1

    save_db(db)

    return {"message": f"Updated {updated_count} users with verification fields"}


@app.post("/admin/match/{match_id}/toggle-image-sharing")
def toggle_image_sharing(match_id: str):
    """Toggle image sharing permission for a match"""
    db = load_db()

    match = next((m for m in db['matches'] if m['id'] == match_id), None)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    # Toggle the setting
    current_value = match.get('image_sharing_enabled', False)
    match['image_sharing_enabled'] = not current_value

    save_db(db)

    return {
        "message": f"Image sharing {'enabled' if match['image_sharing_enabled'] else 'disabled'}",
        "image_sharing_enabled": match['image_sharing_enabled']
    }


@app.post("/admin/match/{match_id}/toggle-video-calls")
def toggle_video_calls(match_id: str):
    """Toggle video call permission for a match"""
    db = load_db()

    match = next((m for m in db['matches'] if m['id'] == match_id), None)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    # Toggle the setting
    current_value = match.get('video_calls_enabled', False)
    match['video_calls_enabled'] = not current_value

    save_db(db)

    return {
        "message": f"Video calls {'enabled' if match['video_calls_enabled'] else 'disabled'}",
        "video_calls_enabled": match['video_calls_enabled']
    }


@app.get("/admin/match/{match_id}/messages")
def get_match_messages(match_id: str):
    """Get all messages for a specific match"""
    db = load_db()

    match = next((m for m in db['matches'] if m['id'] == match_id), None)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    messages = [m for m in db['messages'] if m['match_id'] == match_id]
    messages.sort(key=lambda x: x['created_at'])

    return {
        "match": match,
        "messages": messages,
        "message_count": len(messages)
    }


@app.post("/admin/migrate-matches")
def migrate_matches():
    """Add image_sharing_enabled and video_calls_enabled fields to existing matches"""
    db = load_db()

    updated_count = 0
    for match in db['matches']:
        if 'image_sharing_enabled' not in match or 'video_calls_enabled' not in match:
            match['image_sharing_enabled'] = False
            match['video_calls_enabled'] = False
            updated_count += 1

    save_db(db)

    return {"message": f"Updated {updated_count} matches with permission fields"}


@app.get("/admin/flagged-messages")
def get_flagged_messages():
    """Get all messages pending admin review"""
    db = load_db()
    flagged = db.get('flagged_messages', [])

    # Enrich with user info
    enriched_messages = []
    for msg in flagged:
        # Find the match to get user details
        match = next((m for m in db['matches'] if m['id'] == msg['match_id']), None)
        if match:
            enriched_msg = {
                **msg,
                "match": match,
                "sender": match['beneficiary'] if msg['sender_id'] == match['beneficiary_id'] else match['volunteer'],
                "receiver": match['volunteer'] if msg['sender_id'] == match['beneficiary_id'] else match['beneficiary']
            }
            enriched_messages.append(enriched_msg)

    enriched_messages.sort(key=lambda x: x['created_at'], reverse=True)
    return {"flagged_messages": enriched_messages, "count": len(enriched_messages)}


@app.post("/admin/message/{message_id}/approve")
def approve_message(message_id: str):
    """Approve a flagged message and move it to regular messages"""
    db = load_db()

    # Find message in flagged list
    flagged_msg = next((m for m in db.get('flagged_messages', []) if m['id'] == message_id), None)
    if not flagged_msg:
        raise HTTPException(status_code=404, detail="Flagged message not found")

    # Update status and move to regular messages
    flagged_msg['status'] = 'approved'
    flagged_msg['approved_at'] = datetime.now().isoformat()

    db['messages'].append(flagged_msg)
    db['flagged_messages'] = [m for m in db['flagged_messages'] if m['id'] != message_id]

    save_db(db)

    return {"message": "Message approved and sent", "message_id": message_id}


@app.post("/admin/message/{message_id}/reject")
def reject_message(message_id: str):
    """Reject a flagged message"""
    db = load_db()

    # Find message in flagged list
    flagged_msg = next((m for m in db.get('flagged_messages', []) if m['id'] == message_id), None)
    if not flagged_msg:
        raise HTTPException(status_code=404, detail="Flagged message not found")

    # Update status and remove from flagged list
    flagged_msg['status'] = 'rejected'
    flagged_msg['rejected_at'] = datetime.now().isoformat()

    # Remove from flagged messages (rejected messages are not sent)
    db['flagged_messages'] = [m for m in db['flagged_messages'] if m['id'] != message_id]

    save_db(db)

    return {"message": "Message rejected", "message_id": message_id}
