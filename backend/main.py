from JWT.auth import authenticate_user, create_access_token, get_password_hash, verify_password, SECRET_KEY, ALGORITHM
from fastapi.security import OAuth2PasswordBearer
from mongodb.database import users_collection, chats_collection
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pymongo.errors import PyMongoError
from dotenv import load_dotenv
from jose import JWTError, jwt
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from typing import List
from groq import Groq
import uvicorn
import os

# Define request models
class ChatRequest(BaseModel):
    user_input: str
    conversation_id: Optional[str] = None  # Add conversation_id to request

class ChatResponse(BaseModel):
    assistant_response: str

class ModeRequest(BaseModel):
    mode: str

class SignupRequest(BaseModel):
    email: str
    password: str

class Message(BaseModel):

    role: str

    content: str

class Conversation(BaseModel):

    title: str

    description: str
    
    messages: List[Message]  # Store full conversation
    
    conversation_id: Optional[str] = None

    created_at: datetime

class ConversationCreate(BaseModel):    

    title: str

    description: str

    messages: List[dict]  # Change to dict since we're sending raw objects

    conversation_id: Optional[str] = None

    created_at: str  # Change to str since we're sending ISO string 

# Load environment variables
load_dotenv()

# Get the GROQ API key from the environment variables
groq_api_key = os.getenv("GROQ_API_KEY")
if not groq_api_key:
    raise ValueError("GROQ_API_KEY is not set in the environment variables.")

# Initialize Groq client
client = Groq(api_key=groq_api_key)

# Initialize FastAPI app
app = FastAPI()

# Define OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Add CORS middleware
origins = [
    "https://ai-chatbot-a2hbisee6-darkboy17s-projects.vercel.app",
    "http://localhost:3000",  # For local development
]

# Add CORS middleware to allow requests from the specified origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define system prompts
system_prompts = {
    "content": """You are a helpful AI assistant that generates responses in Markdown format. Follow these guidelines when generating responses:

1. **Code Blocks**:
   - For inline code, wrap the code in single backticks: `code`.
   - For code blocks, wrap the code in triple backticks and specify the language (if applicable):
     ```javascript
     function example() {
       console.log("Hello, world!");
     }
     ```

2. **Math Expressions**:
   - Use `$` for inline math expressions: `$E = mc^2$`.
   - Use `$$` for block math expressions:
     $$
     \int_a^b f(x) \, dx
     $$

3. **Lists**:
   - Use `-` for unordered lists:
     - Item 1
     - Item 2
   - Use numbers for ordered lists:
     1. First item
     2. Second item

4. **Headings**:
   - Use `#` for headings:
     # Heading 1
     ## Heading 2
     ### Heading 3

5. **Links**:
   - Use `[text](url)` for links: [OpenAI](https://openai.com).

6. **Bold and Italics**:
   - Use `**text**` for bold: **bold text**.
   - Use `*text*` for italics: *italic text*.

7. **Line Breaks**:
   - Use two spaces at the end of a line to create a line break.

8. **Avoid Unnecessary Whitespace**:
   - Do not add extra spaces or newlines unless explicitly required for formatting.

9. **Responses**:
   - Always ensure your responses are clear, concise, and well-formatted for Markdown rendering.

Example Response:

```markdown
Here is an example of a response:

- This is a list item.
- Here is some inline code: `console.log("Hello, world!")`.

And here is a code block:

```javascript
function example() {
  console.log("This is a code block.");
}"""
}

chat_history = [system_prompts]  # Initialize chat history with the default system prompt

# Welcome endpoint
@app.get("/")
def welcome():
    return {"message": "Welcome to the AI Chatbot API!"}

# Ask question endpoint
@app.post("/ask", response_model=ChatResponse)
async def ask(request: ChatRequest, token: str = Depends(oauth2_scheme)):

    try:

        # Decode token to get user email

        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        user_email = payload.get("sub")


        # Initialize chat history

        chat_history = []


        # If conversation_id is provided, load existing conversation

        if request.conversation_id:

            conversation = chats_collection.find_one({

                "conversation_id": request.conversation_id,

                "user_email": user_email

            })

            

            if conversation:

                chat_history = conversation.get("messages", [])


        # Append the new user input

        user_message = {"role": "user", "content": request.user_input}

        chat_history.append(user_message)


        try:

            response = client.chat.completions.create(

                model="llama-3.3-70b-versatile",

                messages=chat_history,

                temperature=1.2

            )

        except Exception as e:

            raise HTTPException(status_code=500, detail=str(e))


        # Append the assistant's response

        assistant_message = {

            "role": "assistant", 

            "content": response.choices[0].message.content

        }

        chat_history.append(assistant_message)

        return ChatResponse(assistant_response=assistant_message["content"])


    except JWTError:

        raise HTTPException(status_code=401, detail="Invalid token")

    except Exception as e:

        raise HTTPException(status_code=500, detail=str(e))

# Signup endpoint
@app.post("/signup")
async def signup(request: SignupRequest):
    email = request.email
    password = request.password

    # Check if email is already registered
    if users_collection.find_one({"email": email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    try:
        # Hash the password
        hashed_password = get_password_hash(password)

        # Insert the new user into the database
        users_collection.insert_one({"email": email, "hashed_password": hashed_password})

        return {"message": "User created successfully"}

    except PyMongoError as e:
        # Handle database errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error during signup",
        )

# Login endpoint
@app.post("/login")
async def login(request: SignupRequest):
    email = request.email
    password = request.password

    # Check if the email exists in the database
    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(
            status_code=400,
            detail="Email not registered yet",
        )


    # Verify the password
    if not verify_password(password, user["hashed_password"]):
        raise HTTPException(
            status_code=400,
            detail="Incorrect email or password",
        )

    # Generate an access token
    access_token = create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}

# Save conversation endpoint
@app.post("/conversations")
async def save_conversation(
    conversation: ConversationCreate,
    token: str = Depends(oauth2_scheme)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email = payload.get("sub")
        
        conversation_doc = {
            "user_email": user_email,
            "title": conversation.title,
            "description": conversation.description,
            "messages": conversation.messages,
            "created_at": datetime.fromisoformat(conversation.created_at.replace('Z', '+00:00')),
            "conversation_id": conversation.conversation_id
        }
        
        # Update if conversation exists, create if it doesn't
        result = chats_collection.update_one(
            {
                "conversation_id": conversation.conversation_id,
                "user_email": user_email
            },
            {"$set": conversation_doc},
            upsert=True
        )
        
        return {
            "message": "Conversation saved successfully",
            "conversation_id": conversation.conversation_id
        }
        
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        print(f"Error saving conversation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Get all conversations endpoint
@app.get("/conversations")
async def get_conversations(token: str = Depends(oauth2_scheme)):

    try:

        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        user_email = payload.get("sub")        

        # Get all conversations for this user

        conversations = list(chats_collection.find(

            {"user_email": user_email},

            {

                "title": 1,

                "description": 1,

                "created_at": 1,

                "conversation_id": 1,

                "_id": 0,
                
                "messages": 1

            }

        ).sort("created_at", -1))  # Sort by newest first

        

        return conversations

        

    except Exception as e:

        raise HTTPException(status_code=500, detail=str(e))

# Get conversation by ID endpoint
@app.get("/conversations/{conversation_id}")
async def get_conversation(conversation_id: str, token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email = payload.get("sub")
        
        conversation = chats_collection.find_one(
            {
                "conversation_id": conversation_id,
                "user_email": user_email
            }
        )
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
            
        # Convert ObjectId to string for JSON serialization
        conversation["_id"] = str(conversation["_id"])
        
        return conversation
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Update conversation by ID endpoint
@app.delete("/conversations/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_conversation(conversation_id: str, token: str = Depends(oauth2_scheme)):
    """
    Delete a conversation by its ID.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        user_email = payload.get("sub") 
        
        # Delete the conversation from MongoDB
        result = chats_collection.delete_one(
            {
                "conversation_id": conversation_id,
                "user_email": user_email
            }
        )

        # Check if the conversation was found and deleted
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found"
            )

        return {"message": "Conversation deleted successfully"}

    except PyMongoError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while deleting the conversation: {str(e)}"
        )