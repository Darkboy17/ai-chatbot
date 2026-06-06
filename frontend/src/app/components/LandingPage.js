"use client";

import { FaBolt, FaMoon, FaSun } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import Login from "./Login";
import Signup from "./SignUp";

/**
 * Renders the public authentication landing page and theme toggle.
 */
const LandingPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [hasLoadedTheme, setHasLoadedTheme] = useState(false);

    useEffect(() => {
        setIsDarkMode(localStorage.getItem("theme") === "dark");
        setHasLoadedTheme(true);
    }, []);

    useEffect(() => {
        if (!hasLoadedTheme) return;
        localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    }, [hasLoadedTheme, isDarkMode]);

    const pageTheme = isDarkMode ? "bg-[#0f172a]" : "bg-[#f7f8fb]";
    const panelTheme = isDarkMode
        ? "border-[#23314d] bg-[#111c31]/92 shadow-[0_24px_80px_rgba(0,0,0,0.26)]"
        : "border-[#e1e7f5] bg-white/85 shadow-[0_24px_80px_rgba(16,24,40,0.08)]";
    const splitTheme = isDarkMode ? "border-[#23314d] bg-[#0f172a]/28" : "border-[#e1e7f5] bg-white/70";
    const titleTheme = isDarkMode ? "text-[#eef4ff]" : "text-[#101828]";
    const mutedTheme = isDarkMode ? "text-[#8fa2c9]" : "text-[#667085]";
    const subtleButtonTheme = isDarkMode
        ? "border-[#2f3d5f] bg-[#17223a] text-[#dbe7ff] hover:bg-[#1f2d4b]"
        : "border-[#d8e0ef] bg-white text-[#344054] hover:bg-[#f1f5ff]";
    const inactiveTabTheme = isDarkMode ? "text-[#8fa2c9] hover:text-white" : "text-[#667085] hover:text-[#101828]";

    return (
        <div className={`relative min-h-screen overflow-hidden ${pageTheme}`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(79,124,255,0.16),transparent_30%),radial-gradient(circle_at_86%_10%,rgba(145,187,255,0.14),transparent_28%)]" />
            <button
                onClick={() => setIsDarkMode(prev => !prev)}
                className={`absolute right-5 top-5 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-colors ${subtleButtonTheme}`}
                aria-label="Toggle dark mode"
                title="Toggle dark mode"
            >
                {isDarkMode ? <FaSun className="h-4 w-4" /> : <FaMoon className="h-4 w-4" />}
            </button>
            <div className="relative mx-auto flex min-h-screen max-w-5xl items-center justify-center px-5 py-6">
                <section className={`grid w-full overflow-hidden rounded-[32px] border backdrop-blur lg:grid-cols-[1.05fr_0.95fr] ${panelTheme}`}>
                    <div className="flex flex-col justify-center p-7 md:p-10">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#4f7cff] text-white shadow-lg shadow-[#4f7cff]/20">
                            <FaBolt className="h-4 w-4" />
                        </div>
                        <div>
                            <div className={`text-sm font-semibold ${titleTheme}`}>AI Chatbot</div>
                            <div className={`text-xs font-medium ${mutedTheme}`}>Leveraging the Groq API</div>
                        </div>
                    </div>

                    <div className="mt-14 max-w-2xl">
                        <div className="mb-3 inline-flex rounded-full border border-[#d8e0ef] bg-[#f1f5ff] px-3 py-1 text-xs font-semibold text-[#356dff]">
                            Ask, reason, continue
                        </div>
                        <h1 className={`text-4xl font-semibold leading-tight tracking-normal md:text-5xl ${titleTheme}`}>
                            A calmer workspace for every conversation.
                        </h1>
                        <p className={`mt-5 max-w-xl text-base leading-7 ${mutedTheme}`}>
                            Sign in and land directly in a centered, lightweight chat surface with streaming replies and organized history.
                        </p>
                    </div>
                    </div>

                    <div className={`flex flex-col justify-center border-t p-5 md:p-7 lg:border-l lg:border-t-0 ${splitTheme}`}>
                    <div className={`mb-3 grid grid-cols-2 rounded-full border p-1 ${isDarkMode ? "border-[#2f3d5f] bg-[#17223a]" : "border-[#d8e0ef] bg-[#f7f8fb]"}`}>
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors ${isLogin ? (isDarkMode ? "bg-[#22365f] text-white shadow-sm" : "bg-white text-[#101828] shadow-sm") : inactiveTabTheme}`}
                        >
                            Log in
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors ${!isLogin ? (isDarkMode ? "bg-[#22365f] text-white shadow-sm" : "bg-white text-[#101828] shadow-sm") : inactiveTabTheme}`}
                        >
                            Sign up
                        </button>
                    </div>

                    {isLogin ? (
                        <Login onSwitch={() => setIsLogin(false)} isDark={isDarkMode} />
                    ) : (
                        <Signup onSwitch={() => setIsLogin(true)} isDark={isDarkMode} />
                    )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default LandingPage;
