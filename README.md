# AI Chatbot with User Authentication and Chat History

[AI Chatbot Demo](https://ai-chatbot-gilt-six.vercel.app)

An AI-powered chatbot application that allows users to interact with a conversational AI model. The app features **user authentication** (login/signup), **chat history storage**, and a responsive user interface. Users can securely log in, start conversations, and view their chat history in a sidebar. The backend ensures data isolation, so each user can only access their own chat history.

---

## Features

- **User Authentication**: Secure login and signup with password hashing using **bcrypt**.
- **Real-Time Chat**: Interact with an AI model to get responses to user queries.
- **Chat History**: All conversations are stored in MongoDB and displayed in a sidebar.
- **Protected Routes**: Only authenticated users can access the chat functionality.
- **Responsive Design**: Seamless experience on both desktop and mobile devices.

---

## Tech Stack

- **Frontend**: 
  - **Next.js** (React framework for server-side rendering and routing)
  - **Tailwind CSS** (Utility-first CSS framework for responsive design)
  - **Axios** (HTTP client for API communication)
- **Backend**:
  - **FastAPI** (High-performance Python web framework for API endpoints)
  - **MongoDB Atlas** (Cloud-based NoSQL database for scalable data storage)
  - **JWT (JSON Web Tokens)** (Secure user authentication)
  - **bcrypt** (Password hashing for secure authentication)
- **AI Integration**:
  - Conversational AI model (e.g., OpenAI GPT, Groq, or similar) for generating responses.

---

## Getting Started

### Prerequisites

- Node.js (for frontend)
- Python 3.8+ (for backend)
- MongoDB Atlas account (for database)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/ai-chatbot.git
   cd ai-chatbot
   ```

2. **Set up the Frontend**:
   ```bash
   cd frontend
   npm install
   ```

3. **Set up the Backend**:
   ```bash
   cd ../backend
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**:
   
   - Create a `.env` file in the backend directory:
     ```env
     MONGO_URI=your-mongodb-atlas-connection-string
     SECRET_KEY=your-secret-key
     ```
   
   - Create a `.env.local` file in the frontend directory:
     ```env
     NEXT_PUBLIC_API_URL=http://localhost:8000
     ```

5. **Run the Backend**:
   ```bash
   uvicorn main:app --reload
   ```

6. **Run the Frontend**:
   ```bash
   cd ../frontend
   npm run dev
   ```

7. **Access the App**:
   - Open your browser and navigate to [http://localhost:3000](http://localhost:3000).
