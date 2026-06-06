"use client";

import Image from "next/image";
import { FaMoon, FaSignOutAlt, FaSun } from "react-icons/fa";

import { CHAT_LANE_MAX_WIDTH } from "@/features/chat/constants/layout";
import logo from "../../../../public/robot.png";


/**
 * Renders the chat toolbar, model label, theme toggle, and logout action.
 */
export default function ChatHeader({
    headerTheme,
    isDarkMode,
    onLogoutClick,
    onToggleTheme,
    subtleButtonTheme
}) {
    return (
        <div className={`w-full min-w-0 max-w-full overflow-x-hidden border-b px-4 py-3 backdrop-blur-xl ${headerTheme}`}>
            <div className="mx-auto flex w-full min-w-0 items-center justify-between" style={{ maxWidth: CHAT_LANE_MAX_WIDTH }}>
                <div className="flex min-w-0 items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-2xl border ${isDarkMode ? "border-[#2b3747] bg-[#171d27]" : "border-[#dce6ef] bg-white shadow-sm"}`}>
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
                        <div className={`truncate text-sm font-semibold tracking-normal ${isDarkMode ? "text-[#eef3f8]" : "text-[#172033]"}`}>AI Chatbot</div>
                        <div className={`text-xs font-medium ${isDarkMode ? "text-[#8997a8]" : "text-[#647187]"}`}>llama-3.3-70b-versatile</div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onToggleTheme}
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border focus:outline-none focus:ring-2 ${subtleButtonTheme}`}
                        aria-label="Toggle dark mode"
                        title="Toggle dark mode"
                    >
                        {isDarkMode ? <FaSun className="h-4 w-4" /> : <FaMoon className="h-4 w-4" />}
                    </button>
                    <button
                        onClick={onLogoutClick}
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border focus:outline-none focus:ring-2 ${subtleButtonTheme}`}
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
