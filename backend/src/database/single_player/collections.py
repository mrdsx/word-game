from core.firebase import AsyncFirestore


def single_player_words(db: AsyncFirestore, user_uid: str):
    return db.collection("singlePlayerWordGames", user_uid, "words")
