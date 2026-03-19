def single_player_words(db, user_uid: str):
    return db.collection("singlePlayerWordGames", user_uid, "words")
