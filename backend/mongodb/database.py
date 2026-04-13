from urllib.parse import quote_plus
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi


# Escape the username and password
username = quote_plus("darkboy25")
password = quote_plus("AnsieversarY25")

uri = f"mongodb+srv://{username}:{password}@cluster0.xop3g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Create a new client and connect to the server
client = MongoClient(uri)

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
    
db = client.chatbot_db
users_collection = db.users
chats_collection = db.chats