"use client";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState } from "react";
import { signupUser } from "@/services/authApi";


/**
 * Renders the signup form and switches back to login after success.
 */
const Signup = ({ onSwitch, isDark = false }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /**
   * Creates an account through the backend auth service.
   */
  const handleSignup = async () => {
    try {
      await signupUser({
        email,
        password,
      });

      toast.success("Account created. Please log in.");
      onSwitch();
    } catch (error) {
      toast.error(error.response?.data?.detail || error.message);
    }
  };

  return (
    <div className="flex items-center justify-center px-2 py-6">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h2 className={`text-2xl font-semibold ${isDark ? "text-[#eef4ff]" : "text-[#101828]"}`}>Create your workspace</h2>
          <p className={`mt-2 text-sm leading-6 ${isDark ? "text-[#8fa2c9]" : "text-[#667085]"}`}>Set up an account to save chats and reopen previous work.</p>
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
              onClick={handleSignup}
              className="group relative flex w-full justify-center rounded-full border border-[#4f7cff] bg-[#4f7cff] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#4f7cff]/10 hover:bg-[#356dff] focus:outline-none focus:ring-4 focus:ring-[#4f7cff]/20"
            >
              Create account
            </button>
          </div>
        </form>
        <p className={`text-center text-sm ${isDark ? "text-[#8fa2c9]" : "text-[#667085]"}`}>
          Already have an account?{" "}
          <button
            onClick={onSwitch}
            className="font-semibold text-[#356dff] hover:text-[#1f55d6]"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
