from src.core.firebase.types import AsyncFirestore


def single_player_words_collection(db: AsyncFirestore, user_uid: str):
    return db.collection("singlePlayerWordGames", user_uid, "words")
