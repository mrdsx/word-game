from dotenv import load_dotenv
from firebase_admin import auth
from firebase_admin._auth_utils import UidAlreadyExistsError
from src.core.firebase import initialize_firebase

# def main():
load_dotenv()

initialize_firebase()

userdata: list[dict[str, str | bool]] = [{"uid": "1", "display_name": "user1", "email": "m@m.com", "password": "12345678", "email_verified":True},
                                         {"uid": "2", "display_name": "user2", "email": "t@t.com", "password": "12345678", "email_verified": False}]

for user in userdata:
    try:
        auth.create_user(**user)
        print("user created sususufully")
    except UidAlreadyExistsError:
        print("unfortunately this user exists already")