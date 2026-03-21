from typing import Annotated, Any

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from firebase_admin.auth import InvalidIdTokenError, verify_id_token
from firebase_admin.firestore_async import client as create_firestore_client

from core.firebase import AsyncFirestore

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


async def get_async_firestore() -> AsyncFirestore:
    return create_firestore_client()


async def decode_firebase_token(
    token: Annotated[str, Depends(oauth2_scheme)],
) -> dict[str, Any]:
    try:
        decoded_token = verify_id_token(id_token=token, check_revoked=True)
        return decoded_token
    except InvalidIdTokenError:
        raise HTTPException(
            detail="Invalid token", status_code=status.HTTP_401_UNAUTHORIZED
        )
