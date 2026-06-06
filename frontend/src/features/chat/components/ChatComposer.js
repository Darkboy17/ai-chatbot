"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";

import { CHAT_LANE_MAX_WIDTH } from "@/features/chat/constants/layout";


/**
 * Captures and submits the user's next chat message.
 */
function ChatComposer({ isDarkMode, loading, onSend, composerWrapTheme, composerTheme, inputTheme }) {
    const [draft, setDraft] = useState("");
    const textareaRef = useRef(null);

    useEffect(() => {
        if (!textareaRef.current) return;

        textareaRef.current.style.height = "0px";
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 176)}px`;
    }, [draft]);

    const submitDraft = () => {
        const nextMessage = draft.trim();
        if (!nextMessage || loading) return;

        setDraft("");
        onSend(nextMessage);
    };

    return (
        <div className={`chat-input w-full min-w-0 max-w-full overflow-x-hidden px-4 pb-6 pt-3 md:px-6 ${composerWrapTheme}`}>
            <div
                className={`mx-auto w-full min-w-0 border px-3 py-3 shadow-[0_18px_52px_rgba(31,74,82,0.12)] transition-all duration-200 ${composerTheme}`}
                style={{ borderRadius: 24, maxWidth: CHAT_LANE_MAX_WIDTH }}
            >
                <div className="flex min-w-0 items-end gap-3">
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        placeholder="Message AI Chatbot"
                        className={`max-h-40 min-h-12 min-w-0 flex-1 resize-none appearance-none overflow-y-auto border-0 !bg-transparent px-2 py-2 text-[15px] leading-6 outline-none ${inputTheme}`}
                        style={{ backgroundColor: "transparent", resize: "none" }}
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" && !event.shiftKey) {
                                event.preventDefault();
                                submitDraft();
                            }
                        }}
                        disabled={loading}
                    />
                    <button
                        onClick={submitDraft}
                        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-colors ${loading || !draft.trim()
                            ? isDarkMode ? "cursor-not-allowed bg-[#2b3747] text-[#728091]" : "cursor-not-allowed bg-[#dce6ef] text-white"
                            : isDarkMode ? "bg-[#dce8ef] text-[#10141c] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#41636a]" : "bg-[#246b70] text-white hover:bg-[#1d5b60] focus:outline-none focus:ring-2 focus:ring-[#b8d5db]"
                            } ${loading ? "opacity-70" : ""}`}
                        disabled={loading || !draft.trim()}
                        aria-label="Send message"
                    >
                        {loading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                    </button>
                </div>
            </div>
            <p
                className={`mx-auto mt-2 text-center text-[11px] leading-5 ${isDarkMode ? "text-[#728091]" : "text-[#8390a2]"}`}
                style={{ maxWidth: CHAT_LANE_MAX_WIDTH }}
            >
                AI Chatbot can make mistakes. Check important information.
            </p>
        </div>
    );
}

export default React.memo(ChatComposer);
