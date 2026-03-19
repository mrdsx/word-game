from typing import Any

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from firebase_admin import auth, firestore_async
from firebase_admin.auth import InvalidIdTokenError


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


async def get_firestore():
    return firestore_async.client()


async def get_firebase_token(token: str = Depends(oauth2_scheme)) -> dict[str, Any]:
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except InvalidIdTokenError:
        raise HTTPException(
            detail="Invalid token", status_code=status.HTTP_401_UNAUTHORIZED
        )
