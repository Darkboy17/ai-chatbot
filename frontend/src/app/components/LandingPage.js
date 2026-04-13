import React, { useState, useEffect } from "react";
import Login from "./Login";
import Signup from "./SignUp";

const LandingPage = () => {
    // State to toggle the auth overlay
    const [showAuth, setShowAuth] = useState(false);

    // State to toggle between login and signup
    const [isLogin, setIsLogin] = useState(true);

    // Check if the user has seen the tour
    useEffect(() => {
        const hasSeenTour = localStorage.getItem("hasSeenTour");

        if (hasSeenTour) {
            localStorage.setItem("hasSeenTour", false);
            localStorage.setItem("isTourEnabled", true);
        }
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 relative">
            {/* Landing Page Content */}
            <div className="text-center p-5">
                {/* Title */}
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                    Welcome to the AI Chatbot
                </h1>

                {/* Subtitle */}
                <p className="text-lg text-gray-600 mb-8">
                    Experience the future of conversational AI.
                </p>

                {/* Start Chatting Button */}
                <button
                    onClick={() => setShowAuth(true)}
                    className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300"
                >
                    Start Chatting
                </button>
            </div>

            {/* Auth Overlay */}
            {showAuth && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 w-full max-w-md">
                        {isLogin ? (
                            <Login onSwitch={() => setIsLogin(false)} />
                        ) : (
                            <Signup onSwitch={() => setIsLogin(true)} />
                        )}
                        {/* Close Button */}
                        <button
                            onClick={() => setShowAuth(false)}
                            className="mt-4 w-full text-center text-gray-600 hover:text-gray-900"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LandingPage;