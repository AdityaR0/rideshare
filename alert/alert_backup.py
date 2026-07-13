import sys
import io
import os
from dotenv import load_dotenv
from twilio.rest import Client

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Load .env file from alert folder
load_dotenv("C:/carpoolproject/server/.env")

# ======================
# Twilio credentials
# ======================
account_sid = os.getenv("TWILIO_ACCOUNT_SID")
auth_token  = os.getenv("TWILIO_AUTH_TOKEN")

client = Client(account_sid, auth_token)

# Twilio number from .env
TWILIO_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")

# Recipient number (must be verified in trial mode)
TO_NUMBER = "+919608554339"

# ======================
# SOS message info
# ======================
user_name = "Aditya Raj"
current_location = "Ballygunge to Dum Dum route"

# SMS message (trial account will append "Sent from your Twilio trial account")
sms_body = f"""
🚨 SOS ALERT 🚨
User: {user_name}
Location: {current_location}
This is an emergency! Please respond immediately.
"""

# Voice message (trial account requires key press to start call)
voice_message = f"""
<Response>
    <Say voice="alice">
        🚨 Emergency Alert! {user_name} is in danger on the {current_location} route.
        Immediate assistance required!
    </Say>
    <Pause length="1"/>
    <Say voice="alice">Please acknowledge by pressing any key to confirm.</Say>
</Response>
"""

try:
    # ======================
    # 1. Send SMS
    # ======================
    sms = client.messages.create(
        body=sms_body,
        from_=TWILIO_NUMBER,
        to=TO_NUMBER
    )
    print(f"✅ SOS SMS sent! SID: {sms.sid}")
    print("ℹ️ Note: 'Sent from your Twilio trial account' will appear in trial mode.")

    # ======================
    # 2. Make Voice Call
    # ======================
    call = client.calls.create(
        twiml=voice_message,
        from_=TWILIO_NUMBER,
        to=TO_NUMBER
    )
    print(f"✅ SOS Call initiated! SID: {call.sid}")
    print("ℹ️ Note: In trial mode, recipient must press a key to start the call.")

except Exception as e:
    print(f"❌ Error sending SOS alert: {e}")
