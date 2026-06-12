# AI Chatbot

[Live demo](https://ai-chatbot-gilt-six.vercel.app)

AI Chatbot is a full-stack conversational web app with account-based access, streamed model responses, persisted chat history, editable prompts, and a responsive Next.js interface. The frontend is built with Next.js and Tailwind CSS, while the backend is a FastAPI service that authenticates users with JWTs, stores accounts and conversations in MongoDB, and calls Groq for chat completions.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Repository Layout](#repository-layout)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Backend API](#backend-api)
- [Frontend Behavior](#frontend-behavior)
- [Data Model](#data-model)
- [Deployment](#deployment)
- [Quality Checks](#quality-checks)
- [Troubleshooting](#troubleshooting)
- [Security Notes](#security-notes)

## Features

- User signup and login with hashed passwords.
- JWT bearer-token authentication for protected API routes.
- Authenticated chat workspace at `/chat`.
- Streaming AI responses over Server-Sent Events.
- Conversation persistence in MongoDB.
- Sidebar history with paginated conversation loading.
- Conversation title generation using the model, with deterministic fallback metadata.
- Manual conversation title editing.
- Conversation deletion.
- Prompt editing and resend support.
- Markdown rendering with GitHub-flavored Markdown, code highlighting, and math support.
- Light and dark chat themes stored locally.
- Guided product tour for the chat workspace.
- Responsive landing and chat layouts.
- Dockerized backend runtime for deployment behind a reverse proxy.

## Architecture

The application is split into two deployable projects:

1. `frontend/` contains the Next.js app. It renders the landing page, authentication forms, and authenticated chat workspace. Browser-side services call the backend API using `NEXT_PUBLIC_API_BASE_URL`.
2. `backend/` contains the FastAPI app. It validates credentials, issues JWTs, protects chat and conversation routes, streams Groq completions, and stores user data in MongoDB.

Typical request flow:

1. A visitor signs up or logs in from the Next.js UI.
2. The frontend sends credentials to `POST /signup` or `POST /login`.
3. The backend stores hashed credentials or returns an access token.
4. The frontend stores the token and uses it as a bearer token for authenticated calls.
5. Chat prompts are sent to `POST /ask/stream`.
6. FastAPI builds the model message history from the request or saved conversation data.
7. Groq streams completion chunks back to FastAPI.
8. FastAPI forwards chunks to the browser as Server-Sent Events.
9. The frontend appends streamed chunks into the current assistant message.
10. Completed conversations are saved through `POST /conversations`.

## Tech Stack

### Frontend

- Next.js 15
- React 19
- Tailwind CSS 3
- Axios
- React Toastify
- React Markdown
- Remark GFM
- Remark Math
- Rehype Katex
- React Syntax Highlighter
- Shepherd.js

### Backend

- Python 3.10+
- FastAPI
- Uvicorn
- PyMongo
- MongoDB Atlas or another MongoDB-compatible deployment
- python-jose for JWT handling
- passlib and bcrypt for password hashing
- Groq Python SDK
- python-dotenv

## Repository Layout

```text
.
|-- README.md
|-- backend/
|   |-- Dockerfile
|   |-- deploy-backend.ps1
|   |-- main.py
|   |-- requirements.txt
|   |-- core/
|   |   |-- config.py
|   |   `-- cors.py
|   |-- database/
|   |   `-- mongodb.py
|   |-- dependencies/
|   |   `-- auth.py
|   |-- models/
|   |   |-- auth.py
|   |   |-- chat.py
|   |   `-- conversation.py
|   |-- routes/
|   |   |-- auth.py
|   |   |-- chat.py
|   |   |-- conversations.py
|   |   `-- health.py
|   |-- services/
|   |   |-- auth_service.py
|   |   |-- chat_service.py
|   |   |-- conversation_service.py
|   |   `-- groq_service.py
|   `-- utils/
|       |-- sse.py
|       `-- text.py
`-- frontend/
    |-- package.json
    |-- next.config.mjs
    |-- tailwind.config.mjs
    |-- middleware.ts
    |-- public/
    `-- src/
        |-- app/
        |   |-- page.js
        |   |-- chat/page.js
        |   `-- components/
        |-- config/
        |   `-- api.js
        |-- features/chat/
        |   |-- components/
        |   `-- hooks/
        |-- services/
        `-- utils/
```

## Prerequisites

- Node.js 20 or newer for the Next.js frontend.
- npm, included with Node.js.
- Python 3.10 or newer for the FastAPI backend.
- MongoDB Atlas, local MongoDB, or any reachable MongoDB-compatible URI.
- A Groq API key.
- Git.

## Environment Variables

### Backend

Create `backend/.env`:

```env
APP_NAME=AI Chatbot API
GROQ_API_KEY=your-groq-api-key
SECRET_KEY=replace-with-a-long-random-secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=300
MONGODB_URI=mongodb+srv://user:password@cluster.example.mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE=chatbot_db
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

Required backend variables:

- `GROQ_API_KEY`: API key used by the Groq SDK.
- `SECRET_KEY`: Secret used to sign JWT access tokens.
- `MONGODB_URI`: MongoDB connection string.

Optional backend variables:

- `APP_NAME`: FastAPI application title. Defaults to `AI Chatbot API`.
- `JWT_ALGORITHM`: JWT signing algorithm. Defaults to `HS256`.
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Access-token lifetime in minutes. Defaults to `300`.
- `MONGODB_DATABASE`: Database name. Defaults to `chatbot_db`.
- `ALLOWED_ORIGINS`: Comma-separated CORS allowlist. Defaults include the production Vercel URLs and localhost ports `3000` and `3001`.

### Frontend

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

For production, set `NEXT_PUBLIC_API_BASE_URL` to the public backend URL.

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/Darkboy17/ai-chatbot.git
cd ai-chatbot
```

### 2. Set up the backend

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment:

```bash
# Windows PowerShell
.\.venv\Scripts\Activate.ps1

# macOS/Linux
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `backend/.env` using the backend environment variable reference above.

Start the API:

```bash
uvicorn main:app --reload
```

The local API will be available at:

- `http://localhost:8000`
- `http://localhost:8000/docs` for the generated Swagger UI
- `http://localhost:8000/redoc` for ReDoc

### 3. Set up the frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env.local` using the frontend environment variable reference above.

Start the web app:

```bash
npm run dev
```

Open `http://localhost:3000`.

### 4. Use the app locally

1. Visit the landing page.
2. Create an account with the signup form.
3. Log in with that account.
4. Start a chat.
5. Watch the assistant stream its response.
6. Refresh or revisit the chat workspace to confirm conversation history is stored.

## Backend API

All protected endpoints require:

```http
Authorization: Bearer <access-token>
```

### Health

#### `GET /`

Returns a lightweight welcome response.

Example response:

```json
{
  "message": "Welcome to the AI Chatbot API!"
}
```

### Authentication

#### `POST /signup`

Creates a user account.

Request body:

```json
{
  "email": "user@example.com",
  "password": "strong-password"
}
```

Example response:

```json
{
  "message": "User created successfully"
}
```

#### `POST /login`

Validates credentials and returns a bearer token.

Request body:

```json
{
  "email": "user@example.com",
  "password": "strong-password"
}
```

Example response:

```json
{
  "access_token": "jwt-token",
  "token_type": "bearer"
}
```

### Chat

#### `POST /ask`

Returns a complete non-streaming assistant response.

Request body:

```json
{
  "user_input": "Explain binary search in simple terms.",
  "conversation_id": "conversation-123",
  "messages": [
    {
      "role": "user",
      "content": "Explain binary search in simple terms."
    }
  ]
}
```

Example response:

```json
{
  "assistant_response": "Binary search is a way to find an item in a sorted list..."
}
```

#### `POST /ask/stream`

Streams assistant response chunks as Server-Sent Events.

Request body:

```json
{
  "user_input": "Write a short haiku about databases.",
  "conversation_id": "conversation-123",
  "messages": [
    {
      "role": "user",
      "content": "Write a short haiku about databases."
    }
  ]
}
```

Streaming message event:

```text
data: {"content":"Rows hum softly"}
```

Done event:

```text
event: done
data: {"assistant_response":"Rows hum softly..."}
```

Error event:

```text
event: error
data: {"detail":"Error message"}
```

### Conversations

#### `POST /conversations`

Creates or updates a conversation for the authenticated user.

Request body:

```json
{
  "conversation_id": "conversation-123",
  "created_at": "2026-06-12T10:00:00.000Z",
  "messages": [
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant",
      "content": "Hi! How can I help?"
    }
  ]
}
```

Example response:

```json
{
  "message": "Conversation saved successfully",
  "conversation_id": "conversation-123",
  "title": "Friendly Greeting",
  "description": "A brief greeting and assistant introduction."
}
```

#### `GET /conversations?skip=0&limit=25`

Lists conversations for the authenticated user. Results are newest first.

Query parameters:

- `skip`: Number of records to skip. Minimum `0`. Default `0`.
- `limit`: Number of records to return. Minimum `1`, maximum `50`. Default `25`.

Example response:

```json
{
  "items": [],
  "next_skip": 0,
  "has_more": false,
  "total": 0
}
```

#### `GET /conversations/{conversation_id}`

Returns one conversation owned by the authenticated user.

#### `PATCH /conversations/{conversation_id}/title`

Renames a conversation and marks the title as user-customized.

Request body:

```json
{
  "title": "My Planning Notes"
}
```

#### `DELETE /conversations/{conversation_id}`

Deletes a conversation owned by the authenticated user. Returns `204 No Content` on success.

## Frontend Behavior

- `/` renders the landing page and authentication entry points.
- `/chat` is session-aware through `useAuthenticatedSession`, which validates the JWT stored in `localStorage`.
- `frontend/middleware.ts` also contains a cookie-based `/chat` guard that looks for a `token` cookie. The current login flow stores the token in `localStorage`, so align token storage with the middleware strategy before relying on the middleware as the primary production gate.
- The API base URL is read from `NEXT_PUBLIC_API_BASE_URL`.
- Login and signup requests are sent with Axios.
- Authenticated API requests use `fetch` with a bearer token.
- A `401` response logs the user out, stores a session-expired marker, and redirects to `/`.
- Chat responses stream through `ReadableStream.getReader()`.
- SSE payloads are parsed in `src/services/chatApi.js`.
- Conversation saves are triggered after a completed assistant response.
- Conversation metadata is generated by the backend so the sidebar can show readable titles and descriptions.
- Markdown messages support code blocks, GitHub-flavored Markdown, and math notation.

## Data Model

### Users

Stored in the `users` collection:

```json
{
  "email": "user@example.com",
  "hashed_password": "bcrypt-hash"
}
```

### Conversations

Stored in the `chats` collection:

```json
{
  "user_email": "user@example.com",
  "title": "Conversation Title",
  "description": "Short conversation description.",
  "messages": [
    {
      "role": "user",
      "content": "Question"
    },
    {
      "role": "assistant",
      "content": "Answer"
    }
  ],
  "created_at": "2026-06-12T10:00:00.000Z",
  "conversation_id": "conversation-123",
  "is_title_custom": false
}
```

Every conversation query includes `user_email`, so users can only fetch, rename, or delete their own conversations.

## Deployment

### Frontend

The frontend is designed for Vercel or another Next.js host.

Minimum production setting:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend.example.com
```

Build locally:

```bash
cd frontend
npm run build
npm run start
```

Notes:

- `next.config.mjs` currently sets `eslint.ignoreDuringBuilds` to `true`.
- Production auth behavior depends on token storage. The current client flow uses `localStorage`, while `middleware.ts` checks for a `token` cookie.
- The backend URL must be included in the backend `ALLOWED_ORIGINS`.

### Backend with Docker

The backend includes a Dockerfile that runs:

```bash
uvicorn main:app --host 0.0.0.0 --port 3003 --proxy-headers --forwarded-allow-ips *
```

Build the backend image:

```bash
cd backend
docker build -t ai-chatbot-backend .
```

Run it locally:

```bash
docker run --env-file .env -p 3003:3003 ai-chatbot-backend
```

The API will be available at `http://localhost:3003`.

### Backend VM Deployment Script

`backend/deploy-backend.ps1` can build, push, and deploy the Dockerized backend to a Linux VM over SSH. It supports:

- Docker image build and push.
- Environment file upload.
- Container replacement.
- Optional firewall configuration.
- Optional Nginx site generation.
- Optional Certbot certificate issuance.
- HTTP to HTTPS redirect configuration.

Example:

```powershell
cd backend
.\deploy-backend.ps1 `
  -ImageRepository your-dockerhub-user/ai-chatbot-api `
  -Tag arm64 `
  -Platform linux/arm64 `
  -SshHost 203.0.113.10 `
  -SshUser ubuntu `
  -SshKeyPath "$env:USERPROFILE\.ssh\your-key" `
  -Domain api.example.com `
  -SiteName ai-chatbot-api `
  -ContainerName ai-chatbot-api-container `
  -HostPort 4004 `
  -ContainerPort 3003 `
  -LocalEnvFile .env `
  -RequiredEnvKeys GROQ_API_KEY,SECRET_KEY,MONGODB_URI `
  -CertbotMode nginx
```

## Quality Checks

Frontend lint:

```bash
cd frontend
npm run lint
```

Frontend production build:

```bash
cd frontend
npm run build
```

Backend import/startup check:

```bash
cd backend
python -m compileall .
```

Run the backend locally:

```bash
cd backend
uvicorn main:app --reload
```

There is no dedicated automated test suite in the repository yet. When adding one, good starting points are:

- Backend route tests for auth, chat, and conversation ownership.
- Service tests for conversation metadata fallback behavior.
- Frontend component tests for streaming state updates and message editing.
- End-to-end tests for signup, login, streaming chat, history reload, rename, and delete.

## Troubleshooting

### Backend fails during startup with a missing environment variable

`backend/core/config.py` requires `GROQ_API_KEY`, `SECRET_KEY`, and `MONGODB_URI`. Confirm those keys exist in `backend/.env` or in the process environment.

### Browser cannot call the backend

Check:

- `frontend/.env.local` has `NEXT_PUBLIC_API_BASE_URL`.
- The backend is running.
- The backend `ALLOWED_ORIGINS` includes the frontend origin.
- The browser devtools network tab does not show a CORS rejection.

### Login succeeds but protected requests fail

Check that the frontend is sending:

```http
Authorization: Bearer <access-token>
```

Also confirm `SECRET_KEY` and `JWT_ALGORITHM` are stable between token creation and token validation.

### Streaming response starts but never completes

Check:

- The Groq API key is valid.
- The backend process can reach Groq.
- Reverse proxy buffering is disabled for streaming routes.
- Long-running HTTP connections are allowed by the hosting provider.

### Conversations do not appear in the sidebar

Check:

- `POST /conversations` succeeds after a chat response finishes.
- MongoDB is reachable.
- The same authenticated user is making both the save and list requests.
- The frontend is calling `GET /conversations?skip=0&limit=25`.

### MongoDB connection errors

Check:

- The connection string is assigned to `MONGODB_URI`, not `MONGO_URI`.
- The database user has read/write permissions.
- The client IP or server IP is allowed by the MongoDB network access settings.

## Security Notes

- Never commit `.env`, `.env.local`, `.env.prod`, or other secret files.
- Use a long random value for `SECRET_KEY`.
- Rotate `SECRET_KEY` if it is ever exposed. Existing tokens signed with the old key will become invalid after rotation.
- Restrict `ALLOWED_ORIGINS` in production to known frontend domains.
- Store production MongoDB credentials in the deployment platform or VM environment, not in source control.
- Use HTTPS for production frontend and backend deployments.
- Keep dependencies current and rerun build/lint checks after upgrades.

## License

No license file is currently included. Add one before distributing or accepting outside contributions.
