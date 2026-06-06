from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.database import Database
from pymongo.server_api import ServerApi

from core.config import get_settings


settings = get_settings()
client = MongoClient(settings.mongodb_uri, server_api=ServerApi("1"))
db: Database = client[settings.mongodb_database]
users_collection: Collection = db.users
chats_collection: Collection = db.chats


def ping_database() -> bool:
    """Verify that MongoDB is reachable during startup diagnostics."""
    client.admin.command("ping")
    return True
