from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, status

from src.api.dependencies import decode_firebase_token, get_async_firestore
from src.core.firebase.types import AsyncFirestore
from src.database.single_player.collections import single_player_words_collection
from src.schemas.api import APIResponse

router = APIRouter(prefix="/single-player")


@router.delete(path="/", status_code=status.HTTP_200_OK)
async def delete_words(
    payload: Annotated[dict[str, Any], Depends(decode_firebase_token)],
    db: Annotated[AsyncFirestore, Depends(get_async_firestore)],
) -> APIResponse:
    uid = payload.get("uid")
    if uid is None:
        raise HTTPException(
            detail="Invalid token", status_code=status.HTTP_401_UNAUTHORIZED
        )

    email_verified = payload.get("email_verified")
    if not email_verified:
        raise HTTPException(
            detail="Email not verified", status_code=status.HTTP_403_FORBIDDEN
        )

    await db.recursive_delete(single_player_words_collection(db, uid))

    return APIResponse(data="Successfully deleted words")
