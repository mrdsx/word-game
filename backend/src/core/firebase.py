import os

import firebase_admin
from dotenv import load_dotenv
from firebase_admin.credentials import Certificate

load_dotenv()


fake_private_key = (
    "-----BEGIN PRIVATE KEY-----\nfake-private-key\n-----END PRIVATE KEY-----\n"
)
fake_client_email = "fake-client-email"

service_account = {  # pyright: ignore[reportUnknownVariableType]
    "type": "service_account",
    "project_id": "classic-word-game",
    "private_key": os.getenv(
        "FIREBASE_PRIVATE_KEY",
        fake_private_key,  #! firebase don't work with fake private key
    ).replace("\\n", "\n"),
    "client_email": os.getenv("FIREBASE_CLIENT_EMAIL", fake_client_email),
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40classic-word-game.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com",
}


def initialize_firebase() -> None:
    firebase_admin.initialize_app(  # pyright: ignore[reportUnknownMemberType]
        credential=Certificate(service_account)
    )
