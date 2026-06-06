"use client";

import Image from "next/image";
import { FaMoon, FaPlus, FaSignOutAlt, FaSun } from "react-icons/fa";

import logo from "../../../../public/robot.png";


/**
 * Renders the chat toolbar, model label, theme toggle, and logout action.
 */
export default function ChatHeader({
    headerTheme,
    isDarkMode,
    onLogoutClick,
    onNewChat,
    onToggleTheme,
    subtleButtonTheme
}) {
    return (
        <div className={`border-b px-4 py-3 backdrop-blur ${headerTheme}`}>
            <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
                <div className="flex min-w-0 items-center gap-2">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm ${isDarkMode ? "border-[#2f3d5f] bg-[#17223a]" : "border-[#e1e7f5] bg-white"}`}>
                        <Image
                            src={logo}
                            alt="Logo"
                            width={26}
                            height={26}
                            style={{ objectFit: "contain" }}
                            priority
                        />
                    </div>
                    <div className="min-w-0">
                        <div className={`truncate text-sm font-semibold tracking-normal ${isDarkMode ? "text-[#eef4ff]" : "text-[#111827]"}`}>AI Chatbot</div>
                        <div className={`text-xs font-medium ${isDarkMode ? "text-[#8fa2c9]" : "text-[#667085]"}`}>llama-3.3-70b-versatile</div>
                    </div>
                </div>

                <div className="reset-chat flex items-center gap-2">
                    <button
                        onClick={onNewChat}
                        className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 ${subtleButtonTheme}`}
                    >
                        <FaPlus className="h-3.5 w-3.5 text-[#4f7cff]" />
                        New Chat
                    </button>
                    <button
                        onClick={onToggleTheme}
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-full border shadow-sm focus:outline-none focus:ring-2 ${subtleButtonTheme}`}
                        aria-label="Toggle dark mode"
                        title="Toggle dark mode"
                    >
                        {isDarkMode ? <FaSun className="h-4 w-4" /> : <FaMoon className="h-4 w-4" />}
                    </button>
                    <button
                        onClick={onLogoutClick}
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-full border shadow-sm focus:outline-none focus:ring-2 ${subtleButtonTheme}`}
                        aria-label="Logout"
                        title="Logout"
                    >
                        <FaSignOutAlt className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
