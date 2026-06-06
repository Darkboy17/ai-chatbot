"use client";

import React, { useState } from "react";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";


/**
 * Captures and submits the user's next chat message.
 */
function ChatComposer({ loading, onSend, composerWrapTheme, composerTheme, inputTheme }) {
    const [draft, setDraft] = useState("");

    const submitDraft = () => {
        const nextMessage = draft.trim();
        if (!nextMessage || loading) return;

        setDraft("");
        onSend(nextMessage);
    };

    return (
        <div className={`chat-input px-4 pb-5 pt-3 md:px-6 ${composerWrapTheme}`}>
            <div className={`mx-auto flex w-full max-w-4xl items-center gap-2 rounded-[28px] border p-2 shadow-[0_16px_50px_rgba(16,24,40,0.08)] transition-all duration-200 ${composerTheme}`}>
                <input
                    type="text"
                    placeholder="Message AI Chatbot"
                    className={`min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-sm outline-none ${inputTheme}`}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => event.key === "Enter" && submitDraft()}
                    disabled={loading}
                />
                <button
                    onClick={submitDraft}
                    className={`flex h-11 w-11 items-center justify-center rounded-full bg-[#4f7cff] text-white shadow-sm ${loading ? "cursor-not-allowed opacity-50" : "hover:bg-[#356dff] focus:outline-none focus:ring-2 focus:ring-[#b9cdfc]"}`}
                    disabled={loading}
                    aria-label="Send message"
                >
                    {loading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                </button>
            </div>
        </div>
    );
}

export default React.memo(ChatComposer);
