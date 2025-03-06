"use client";

import { FaPaperPlane, FaSpinner } from 'react-icons/fa';
import { ToastContainer, toast } from "react-toastify";
import { useState, useRef, useEffect } from 'react';
import TourGuide from '../components/TourGuide';
import { FaUser, FaRobot } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import logo from '../../../public/robot.png';
import { useRouter } from "next/navigation";
import Sidebar from '../components/Sidebar';
import ReactMarkdown from 'react-markdown';
import { jwtDecode } from "jwt-decode";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import Image from 'next/image';
import React from 'react';



export default function Chatbot() {

    // Message state
    const [message, setMessage] = useState('');

    // Chat history state
    const [chatHistory, setChatHistory] = useState([
        { role: 'assistant', content: "Hey there! 👋 How can I help you today?" }
    ]);

    // Loading state
    const [loading, setLoading] = useState(false);

    // Authentication state
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check authentication state
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // Add state for conversation ID
    const [currentConversationId, setCurrentConversationId] = useState(null);

    // State for tracking changes in the chat history
    const [hasChanges, setHasChanges] = useState(false);

    // Ref for the chat container
    const chatContainerRef = useRef(null);

    // Track initial mount
    const isMounted = useRef(false);

    // Initialize the router
    const router = useRouter();


    // API URL
    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    // Track whether the tour has been seen
    const [isTourEnabled, setIsTourEnabled] = useState(false);

    // Check if the tour has been seen
    useEffect(() => {
        const hasSeenTour = localStorage.getItem("hasSeenTour");
        const isTourEnabled = localStorage.getItem("isTourEnabled");
        if (!hasSeenTour) {
            setIsTourEnabled(true); // Show the tour only once
            localStorage.setItem("hasSeenTour", "true");
            localStorage.setItem("isTourEnabled", "false");
        } else if (isTourEnabled === "true") {
            setIsTourEnabled(true);
        }
    }, []);


    // Check if the user is logged in
    useEffect(() => {
        if (isMounted.current) return; // Skip if already mounted
        isMounted.current = true; // Mark as mounted

        const token = localStorage.getItem("token");
        if (!token || isTokenExpired(token)) {
            router.push("/"); // Redirect to the login page if not logged in
        } else {
            setIsAuthenticated(true); // User is authenticated
        }
        setIsCheckingAuth(false); // Authentication check is complete
        setAutoLogoutTimer(token);
    }, []);

    // Scroll to the latest message when the chat history changes
    useEffect(() => {
        if (chatContainerRef.current) {
            const messages = chatContainerRef.current.children;
            if (messages.length > 0) {
                const latestMessage = messages[messages.length - 1];
                latestMessage.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    }, [chatHistory]);

    // Generate a new conversation ID when component mounts
    useEffect(() => {

        if (!currentConversationId) {

            setCurrentConversationId(generateConversationId());

        }

    }, []);

    // Function to set an auto-logout timer based on the token's expiration time
    const setAutoLogoutTimer = (token) => {
        if (!token) return;

        const decoded = jwtDecode(token);

        const expirationTime = decoded.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();

        const timeUntilExpiration = expirationTime - currentTime;

        if (timeUntilExpiration > 0) {
            setTimeout(() => {
                localStorage.removeItem("token");
                setIsCheckingAuth(true);
                setTimeout(() => {
                    // router.push("/"); // Navigate to the chat page
                    window.location.href = "/";
                }, 500);
            }, timeUntilExpiration);
        }
    }

    // Function to check if the token has expired
    const isTokenExpired = (token) => {
        try {
            const decoded = jwtDecode(token); // Decode the token
            const currentTime = Date.now() / 1000; // Get current time in seconds

            // Check if the token's expiration time is less than the current time
            if (decoded.exp < currentTime) {
                return true; // Token has expired
            }
            return false; // Token is still valid
        } catch (error) {
            console.error('Error decoding token:', error);
            return true; // Treat invalid tokens as expired
        }
    };

    // Function to save the conversation to the server
    const saveConversation = async () => {
        if (chatHistory.length < 2) return;

        try {
            const userMessage = chatHistory.find(msg => msg.role === 'user')?.content;
            const aiResponse = chatHistory.find(msg => msg.role === 'assistant')?.content;

            const conversationData = {
                title: userMessage?.substring(0, 50) || 'New Conversation',
                description: aiResponse?.substring(0, 100) || 'No description',
                messages: chatHistory.map(msg => ({
                    role: msg.role,
                    content: msg.content
                })),
                created_at: new Date().toISOString(),
                conversation_id: currentConversationId || uuidv4()
            };


            // console.log('Sending conversation data:', conversationData); // Debug log

            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/conversations`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(conversationData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server error:', errorData); // Debug log
                throw new Error(errorData.detail || 'Failed to save conversation');
            }

            const data = await response.json();
            // console.log('Conversation saved:', data);
            setHasChanges(false); // Reset changes after saving
        } catch (error) {
            console.error('Error saving conversation:', error);
        }
    };

    // Function to fetch data from the server with the token
    const fetchWithToken = async (url, options = {}) => {

        try {

            const token = localStorage.getItem('token');

            if (!token) {

                throw new Error('No token found');

            }


            const response = await fetch(url, {

                ...options,

                headers: {

                    ...options.headers,

                    'Authorization': `Bearer ${token}`

                }

            });


            if (response.status === 401) {

                // Handle token expiration

                window.location.href = '/';

                return null;

            }


            return response;

        } catch (error) {

            console.error('API call error:', error);

            throw error;

        }
    }

    // Function to load a conversation from the server
    const loadConversation = async (conversationId) => {

        try {

            setLoading(true);

            const response = await fetchWithToken(`${API_URL}/conversations/${conversationId}`);


            if (!response.ok) {

                throw new Error('Failed to load conversation');

            }


            const conversation = await response.json();

            setChatHistory(conversation.messages);

            setCurrentConversationId(conversation.conversation_id);

            setHasChanges(false); // Reset changes when loading a conversation

        } catch (error) {

            console.error('Error loading conversation:', error);

            toast.error('Failed to load conversation');

        } finally {

            setLoading(false);

        }

    };

    // Function to handle conversation selection
    const handleConversationSelect = (conversationId) => {

        loadConversation(conversationId);

    };

    // Function to display a warning toast
    const warn = (message) => {
        toast(message, {
            icon: '⚠️',
            style: {
                borderRadius: '10px',
                background: '#f9c22e',
                color: '#000'
            }
        });
    };

    // Function to generate a unique conversation ID
    const generateConversationId = () => {

        const timestamp = Date.now();

        const randomString = Math.random().toString(36).substring(2, 15);

        return `${timestamp}-${randomString}`;

    };

    // Function to send a message to the AI assistant
    const sendMessage = async () => {
        if (!message.trim()) return;
        const userMessage = message.trim();
        const newChat = [...chatHistory, { role: 'user', content: userMessage }];
        setChatHistory(newChat);
        setMessage('');
        setLoading(true);

        try {

            // Get AI response
            const response = await fetchWithToken(`${API_URL}/ask`, {

                method: 'POST',

                headers: { 'Content-Type': 'application/json' },

                body: JSON.stringify({

                    user_input: userMessage,

                    conversation_id: currentConversationId  // Include conversation_id

                })

            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to get response');
            }

            const data = await response.json();
            const aiResponse = data.assistant_response;




            setChatHistory(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: data.assistant_response
                }
            ]);
            setHasChanges(true); // Mark changes when a new message is added
        } catch (error) {
            warn(`Error: ${error.message}`);
            setChatHistory(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: "Sorry, I encountered an error. Please try again."
                }
            ]);
        } finally {
            setLoading(false);
        }
    }

    // Function to reset the chat
    const resetChat = async () => {
        if (hasChanges) {
            await saveConversation(); // Save the conversation before resetting if there are changes
        }

        setCurrentConversationId(generateConversationId())
        setChatHistory([{
            role: 'assistant',
            content: "Hi! I'm your AI assistant. How can I help?"
        }]);
        setHasChanges(false);
    };

    // Show a loading spinner while checking authentication
    if (isCheckingAuth) {
        return (
            <div className="flex justify-center items-center h-screen">
                <FaSpinner className="animate-spin text-4xl text-blue-500" />
            </div>
        );
    }

    // Redirect or show the chat page based on authentication
    if (!isAuthenticated) {
        return null; // Or you can return a redirect component
    }

    // Render the chat page
    return (
        <div className="flex overflow-y-hidden">

            <Sidebar
                onConversationSelect={handleConversationSelect}

                currentConversationId={currentConversationId}
            />

            <main className="flex-1">
                <div className="flex flex-col h-screen mx-auto shadow-lg rounded-lg bg-white">
                    {isTourEnabled && <TourGuide isOpen={true} onClose={() => setIsTourEnabled(false)} />}

                    {/* Header */}
                    <div className="flex flex-row bg-gray-200 text-black justify-between items-center py-2 px-4  shadow-md">
                        <div className="w-full flex items-center justify-center gap-2">
                            <Image
                                src={logo}
                                alt="Logo"
                                width={50}
                                height={100}
                                style={{ objectFit: 'contain' }}
                                priority
                            />
                            <div className='p-2 font-bold'>AI Chatbot</div>
                        </div>

                    </div>

                    {/* New Chat */}
                    <div className="p-4 border-b bg-gray-100 flex justify-between items-center">

                        <div className='reset-chat p-1 items-right'>
                            <button
                                onClick={resetChat}
                                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-red-600 text-sm"
                            >
                                New Chat
                            </button>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div
                        ref={chatContainerRef}
                        className="chat-container flex-1 p-4 md:p-6 overflow-y-auto space-y-3 bg-gray-50"
                        style={{ maxHeight: 'calc(100vh - 200px)' }} // Adjust height dynamically
                    >
                        {chatHistory.map((chat, index) => (
                            <div key={index} className={`flex items-start ${chat.role === "assistant" ? "justify-start" : "justify-end"}`}>
                                {chat.role === "assistant" && (
                                    <div>
                                        <FaRobot className="text-gray-600 w-7 h-6 mr-2 mt-1" /></div>
                                )}
                                <div className={`px-4 py-2 rounded-lg  text-sm shadow 
                            ${chat.role === "assistant" ? "text-gray-600" : "bg-yellow-500 text-white"}`}
                                >
                                    <div className="prose prose-sm max-w-full break-words">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkMath]}
                                            rehypePlugins={[rehypeKatex]}
                                            components={{
                                                p: ({ node, ...props }) => <p className="m-0" {...props} />,
                                                a: ({ node, ...props }) => (
                                                    <a className="text-blue-200 hover:text-blue-100" {...props} />
                                                ),
                                                code: ({ node, inline, ...props }) =>
                                                    inline ? (
                                                        <code className="bg-gray-100 text-gray-900 px-1 rounded" {...props} />
                                                    ) : (
                                                        <code className="block bg-gray-100 text-gray-900 p-2 rounded whitespace-pre-wrap" {...props} />
                                                    ),
                                            }}
                                        >
                                            {chat.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                                {chat.role === "user" && (
                                    <FaUser className="text-yellow-600 w-7 h-6 ml-2 mt-1" />
                                )}
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="px-4 py-2 rounded-lg max-w-xs text-sm shadow bg-blue-500 text-white flex items-center">
                                    <FaSpinner className="animate-spin mr-2" /> Thinking...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Message Input */}
                    <div className="w-full p-4 flex gap-2 border-t chat-input">
                        <input
                            type="text"
                            placeholder="Ask your questions here..."
                            className="flex-1 p-2 border rounded-md outline-none"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
                            disabled={loading}
                        />
                        <button
                            onClick={sendMessage}
                            className={`bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2 
                                ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                            disabled={loading}
                        >
                            {loading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                        </button>
                    </div>
                    <ToastContainer />
                </div>
            </main>
        </div>
    );
}