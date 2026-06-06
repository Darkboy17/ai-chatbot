"use client";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState } from "react";
import { loginUser } from "@/services/authApi";

/**
 * Renders the login form and stores the returned access token.
 */
const Login = ({ onSwitch, isDark = false }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Submits credentials and redirects the user into the chat workspace.
   */
  const handleLogin = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const response = await loginUser({
        email,
        password,
      });
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("hasLoggedInOnce", true);
      localStorage.setItem("showWelcomeMessage", "true");
      if (localStorage.getItem("hasSeenTour") !== "true") {
        localStorage.setItem("showTourOnLogin", "true");
      }
      window.location.assign("/chat");
    } catch (error) {
      toast.error(error.response?.data?.detail || error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-2 py-6">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h2 className={`text-2xl font-semibold ${isDark ? "text-[#eef4ff]" : "text-[#101828]"}`}>Log in to AI Chatbot</h2>
          <p className={`mt-2 text-sm leading-6 ${isDark ? "text-[#8fa2c9]" : "text-[#667085]"}`}>Open your workspace and continue your conversations.</p>
        </div>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-3">
            <div>
              <label className={`mb-1.5 block text-xs font-semibold ${isDark ? "text-[#c8d7f2]" : "text-[#344054]"}`}>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`relative block w-full rounded-2xl border px-3 py-2.5 text-sm placeholder:text-[#98a2b3] focus:border-[#aac2ff] focus:outline-none focus:ring-4 focus:ring-[#4f7cff]/10 ${isDark ? "border-[#2f3d5f] bg-[#17223a] text-[#eef4ff]" : "border-[#d8e0ef] bg-[#f7f8fb] text-[#101828]"}`}
              />
            </div>
            <div>
              <label className={`mb-1.5 block text-xs font-semibold ${isDark ? "text-[#c8d7f2]" : "text-[#344054]"}`}>Password</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`relative block w-full rounded-2xl border px-3 py-2.5 text-sm placeholder:text-[#98a2b3] focus:border-[#aac2ff] focus:outline-none focus:ring-4 focus:ring-[#4f7cff]/10 ${isDark ? "border-[#2f3d5f] bg-[#17223a] text-[#eef4ff]" : "border-[#d8e0ef] bg-[#f7f8fb] text-[#101828]"}`}
              />
            </div>
          </div>

          <div>
            <button
              onClick={handleLogin}
              className={`group relative flex w-full justify-center rounded-full border border-[#4f7cff] bg-[#4f7cff] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#4f7cff]/10 focus:outline-none focus:ring-4 focus:ring-[#4f7cff]/20 ${isSubmitting ? "cursor-not-allowed opacity-70" : "hover:bg-[#356dff]"}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Continue"}
            </button>
          </div>
        </form>
        <p className={`text-center text-sm ${isDark ? "text-[#8fa2c9]" : "text-[#667085]"}`}>
          Don&apos;t have an account?{" "}
          <button
            onClick={onSwitch}
            className="font-semibold text-[#356dff] hover:text-[#1f55d6]"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
