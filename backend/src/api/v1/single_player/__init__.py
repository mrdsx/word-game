from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status

from api.dependencies.firebase import get_firebase_token, get_firestore
from database.single_player.collections import single_player_words
from schemas.api import APIResponse

router = APIRouter()


@router.delete(path="/", status_code=status.HTTP_200_OK)
async def delete_words(
    token: dict[str, Any] = Depends(get_firebase_token),
    db=Depends(get_firestore),
):
    uid = token.get("uid")
    if uid is None:
        raise HTTPException(
            detail="Invalid token", status_code=status.HTTP_401_UNAUTHORIZED
        )

    email_verified = token.get("email_verified")
    if not email_verified:
        raise HTTPException(
            detail="Email not verified", status_code=status.HTTP_403_FORBIDDEN
        )

    await db.recursive_delete(single_player_words(db, uid))

    return APIResponse(data="Successfully deleted words")
