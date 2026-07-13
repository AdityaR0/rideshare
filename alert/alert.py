import sys
import os
from dotenv import load_dotenv
from twilio.rest import Client

# Load .env
load_dotenv("C:/carpoolproject/server/.env")

# Twilio Client
client = Client(
    os.getenv("TWILIO_ACCOUNT_SID"),
    os.getenv("TWILIO_AUTH_TOKEN")
)

TWILIO_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")
TO_NUMBER = "+919608554339"   # Emergency Contact

# -----------------------------
# Safe argument reading
# -----------------------------
passenger_name = sys.argv[1] if len(sys.argv) > 1 else "Passenger"
driver_name = sys.argv[2] if len(sys.argv) > 2 else "Driver"
vehicle_name = sys.argv[3] if len(sys.argv) > 3 else "Vehicle"
vehicle_number = sys.argv[4] if len(sys.argv) > 4 else "Unknown"
origin = sys.argv[5] if len(sys.argv) > 5 else "Unknown"
destination = sys.argv[6] if len(sys.argv) > 6 else "Unknown"

# -----------------------------
# SHORT SMS (Trial Friendly)
# -----------------------------
sms_body = (
    f"SOS!\n"
    f"{passenger_name}\n"
    f"{vehicle_number}\n"
    f"{origin} -> {destination}"
)

# -----------------------------
# Voice Call
# -----------------------------
voice_message = f"""
<Response>
    <Say voice="alice">

    Emergency Alert.

    Passenger {passenger_name}
    has pressed the RideShare emergency button.

    Driver is {driver_name}.

    Vehicle number {vehicle_number}.

    The ride is from {origin}
    to {destination}.

    Please provide immediate assistance.

    </Say>
</Response>
"""

try:

    # Send SMS
    sms = client.messages.create(
        body=sms_body,
        from_=TWILIO_NUMBER,
        to=TO_NUMBER
    )

    print("SMS SID:", sms.sid)
    print("SMS Status:", sms.status)

    # Make Call
    call = client.calls.create(
        twiml=voice_message,
        from_=TWILIO_NUMBER,
        to=TO_NUMBER
    )

    print("Call SID:", call.sid)

except Exception as e:
    print("ERROR:", e)