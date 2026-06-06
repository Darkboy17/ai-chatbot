"use client";

import { useEffect, useRef } from "react";
import { FaCheck, FaPen, FaRobot, FaSpinner, FaTimes, FaUser } from "react-icons/fa";

import { CHAT_LANE_MAX_WIDTH } from "@/features/chat/constants/layout";
import MarkdownMessage from "./MarkdownMessage";

const starterPrompts = [
    "Explain a topic",
    "Debug an error",
    "Draft a plan",
    "Summarize text"
];

/**
 * Renders the scrollable chat timeline and inline user-message editor.
 */
export default function ChatMessages({
    assistantTextTheme,
    cancelEditingMessage,
    chatContainerRef,
    chatHistory,
    editingMessageContent,
    editingMessageIndex,
    isDarkMode,
    loading,
    messageActionTheme,
    resendEditedMessage,
    setEditingMessageContent,
    startEditingMessage,
    userBubbleTheme,
    userEditBubbleTheme,
    onPromptSelect
}) {
    const editingTextAreaRef = useRef(null);
    const hasUserMessages = chatHistory.some(chat => chat.role === "user");
    const contentLaneStyle = { maxWidth: CHAT_LANE_MAX_WIDTH };
    const visibleHistory = hasUserMessages
        ? chatHistory
            .map((chat, index) => ({ chat, index }))
            .filter(({ chat, index }) => !(
            index === 0
            && chat.role === "assistant"
            && (
                chat.content.startsWith("Hey there!")
                || chat.content.startsWith("Hi! I'm your AI assistant.")
            )
        ))
        : [];

    useEffect(() => {
        if (!editingTextAreaRef.current) return;

        editingTextAreaRef.current.style.height = "0px";
        editingTextAreaRef.current.style.height = `${Math.min(editingTextAreaRef.current.scrollHeight, 288)}px`;
    }, [editingMessageContent, editingMessageIndex]);

    return (
        <div
            ref={chatContainerRef}
            className={`chat-container flex w-full min-w-0 flex-1 flex-col overflow-y-auto px-4 md:px-6 ${hasUserMessages ? "space-y-7 pb-8 pt-10 md:pb-10 md:pt-12" : "justify-center pb-5 pt-12 md:pt-16"}`}
        >
            {!hasUserMessages && (
                <div className="mx-auto flex w-full min-w-0 flex-col items-center text-center" style={{ maxWidth: "min(760px, 100%)" }}>
                    <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border ${isDarkMode ? "border-[#2b3747] bg-[#171d27] text-[#dce8ef]" : "border-[#dce6ef] bg-white text-[#246b70] shadow-sm"}`}>
                        <FaRobot className="h-4 w-4" />
                    </div>
                    <h1 className={`text-[28px] font-semibold tracking-normal ${isDarkMode ? "text-[#eef3f8]" : "text-[#172033]"}`}>
                        How can I help you today?
                    </h1>
                    <p className={`mt-2 max-w-lg text-sm leading-6 ${isDarkMode ? "text-[#8997a8]" : "text-[#647187]"}`}>
                        Ask a question, explore an idea, or continue building something.
                    </p>
                    {/* <div
                        className="mt-8 grid w-full"
                        style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}
                    >
                        {starterPrompts.map(prompt => (
                            <button
                                key={prompt}
                                type="button"
                                onClick={() => onPromptSelect?.(prompt)}
                                className={`min-h-[54px] rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-colors ${isDarkMode ? "border-[#2b3747] bg-[#171d27] text-[#dce8ef] hover:border-[#41636a] hover:bg-[#202838]" : "border-[#dce6ef] bg-white text-[#263244] shadow-sm hover:border-[#bcd7dd] hover:bg-[#f2f8fa]"}`}
                                style={{ borderRadius: 16 }}
                            >
                                {prompt}
                            </button>
                        ))}
                    </div> */}
                </div>
            )}

            {visibleHistory.map(({ chat, index }) => {
                const isUserMessage = chat.role === "user";
                const isEditing = editingMessageIndex === index;

                return (
                    <div
                        key={`${chat.role}-${index}`}
                        className={`group mx-auto flex w-full min-w-0 items-start gap-3 ${chat.role === "assistant" ? "justify-start" : "justify-end"}`}
                        style={contentLaneStyle}
                    >
                        {chat.role === "assistant" && (
                            <div className={`mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-2xl border ${isDarkMode ? "border-[#2b3747] bg-[#171d27] text-[#dce8ef]" : "border-[#dce6ef] bg-white text-[#647187]"}`}>
                                <FaRobot className="h-4 w-4" />
                            </div>
                        )}

                        {isUserMessage && !isEditing && (
                            <button
                                onClick={() => startEditingMessage(index, chat.content)}
                                className={`mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100 ${messageActionTheme}`}
                                disabled={loading}
                                aria-label="Edit and resend message"
                                title="Edit and resend"
                            >
                                <FaPen className="h-3.5 w-3.5" />
                            </button>
                        )}

                        <div className={`${chat.role === "assistant" ? "min-w-0 flex-1 px-0 py-1" : isEditing ? "ml-auto min-w-0 w-full px-4 py-4 md:px-5" : "ml-auto min-w-0 max-w-[min(820px,78vw)] px-4 py-3 text-left md:px-5"} text-[15px] leading-7 transition-all duration-200 ${chat.role === "assistant" ? `${assistantTextTheme} w-full` : isEditing ? userEditBubbleTheme : userBubbleTheme}`}
                            style={isEditing ? { maxWidth: CHAT_LANE_MAX_WIDTH } : undefined}
                        >
                            {isEditing ? (
                                <div className="w-full min-w-0">
                                    <textarea
                                        ref={editingTextAreaRef}
                                        value={editingMessageContent}
                                        onChange={(event) => setEditingMessageContent(event.target.value)}
                                        onKeyDown={(event) => {
                                            if (event.key === "Escape") {
                                                cancelEditingMessage();
                                            }

                                            if ((event.metaKey || event.ctrlKey) && event.key === "Enter" && !loading) {
                                                resendEditedMessage();
                                            }
                                        }}
                                        className={`max-h-72 min-h-[56px] w-full resize-none overflow-y-auto rounded-2xl border px-4 py-3 text-[15px] leading-7 outline-none transition-colors ${isDarkMode ? "border-[#2b3747] bg-[#10141c] text-[#eef3f8] placeholder:text-[#8997a8] focus:border-[#41636a] focus:ring-2 focus:ring-[#41636a]/30" : "border-[#dce6ef] bg-white text-[#172033] placeholder:text-[#8390a2] focus:border-[#9ecbd1] focus:ring-2 focus:ring-[#b8d5db]/50"}`}
                                        autoFocus
                                        disabled={loading}
                                    />
                                    <div className="mt-3 flex justify-end gap-2">
                                        <button
                                            onClick={cancelEditingMessage}
                                            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border ${messageActionTheme}`}
                                            disabled={loading}
                                            aria-label="Cancel editing"
                                            title="Cancel"
                                        >
                                            <FaTimes className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            onClick={resendEditedMessage}
                                            className={`inline-flex h-9 w-9 items-center justify-center rounded-full disabled:cursor-not-allowed disabled:opacity-50 ${isDarkMode ? "bg-[#246b70] text-white hover:bg-[#2b7d83] focus:outline-none focus:ring-2 focus:ring-[#41636a]" : "bg-[#246b70] text-white hover:bg-[#1d5b60] focus:outline-none focus:ring-2 focus:ring-[#b8d5db]"}`}
                                            disabled={loading}
                                            aria-label="Resend edited message"
                                            title="Resend"
                                        >
                                            {loading ? <FaSpinner className="animate-spin" /> : <FaCheck className="h-3.5 w-3.5" />}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <MarkdownMessage content={chat.content} isDarkMode={isDarkMode} />
                            )}
                        </div>

                        {chat.role === "user" && (
                            <div className={`mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-2xl ${isDarkMode ? "bg-[#2b3747] text-[#eef3f8]" : "bg-[#d7ebee] text-[#246b70]"}`}>
                                <FaUser className="h-4 w-4" />
                            </div>
                        )}
                    </div>
                );
            })}

            {loading && visibleHistory[visibleHistory.length - 1]?.chat?.role !== "assistant" && (
                <div className="mx-auto flex w-full justify-start" style={contentLaneStyle}>
                    <div className={`flex max-w-xs items-center rounded-2xl border px-4 py-3 text-sm font-medium ${isDarkMode ? "border-[#2b3747] bg-[#171d27] text-[#dce8ef]" : "border-[#dce6ef] bg-white text-[#647187]"}`}>
                        <FaSpinner className="animate-spin mr-2" /> Thinking...
                    </div>
                </div>
            )}
        </div>
    );
}
