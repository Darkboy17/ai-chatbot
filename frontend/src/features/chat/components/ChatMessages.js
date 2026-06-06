"use client";

import { FaCheck, FaPen, FaRobot, FaSpinner, FaTimes, FaUser } from "react-icons/fa";

import MarkdownMessage from "./MarkdownMessage";


/**
 * Renders the scrollable chat timeline and inline user-message editor.
 */
export default function ChatMessages({
    assistantTextTheme,
    cancelEditingMessage,
    chatContainerRef,
    chatHistory,
    editTextAreaTheme,
    editingMessageContent,
    editingMessageIndex,
    isDarkMode,
    loading,
    messageActionTheme,
    resendEditedMessage,
    setEditingMessageContent,
    startEditingMessage,
    userBubbleTheme,
    userEditBubbleTheme
}) {
    return (
        <div
            ref={chatContainerRef}
            className="chat-container mx-auto flex w-full max-w-4xl flex-1 flex-col space-y-6 overflow-y-auto px-4 py-8 md:px-6 md:py-10"
        >
            {chatHistory.map((chat, index) => {
                const isUserMessage = chat.role === "user";
                const isEditing = editingMessageIndex === index;

                return (
                    <div key={`${chat.role}-${index}`} className={`group flex items-start gap-3 ${chat.role === "assistant" ? "justify-start" : "justify-end"}`}>
                        {chat.role === "assistant" && (
                            <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[#e1e7f5] bg-white shadow-sm">
                                <FaRobot className="h-4 w-4 text-[#4f7cff]" />
                            </div>
                        )}

                        {isUserMessage && !isEditing && (
                            <button
                                onClick={() => startEditingMessage(index, chat.content)}
                                className={`mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border opacity-0 shadow-sm transition-opacity focus:opacity-100 group-hover:opacity-100 ${messageActionTheme}`}
                                disabled={loading}
                                aria-label="Edit and resend message"
                                title="Edit and resend"
                            >
                                <FaPen className="h-3.5 w-3.5" />
                            </button>
                        )}

                        <div className={`max-w-[min(760px,82vw)] px-4 py-3 text-sm leading-7 transition-all duration-200 md:px-5 ${chat.role === "assistant" ? assistantTextTheme : isEditing ? userEditBubbleTheme : userBubbleTheme}`}>
                            {isEditing ? (
                                <div className="w-[min(700px,72vw)] max-w-full">
                                    <textarea
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
                                        className={`max-h-56 min-h-24 w-full resize-y border-0 bg-transparent text-sm leading-7 outline-none ${editTextAreaTheme}`}
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
                                            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#4f7cff] text-white shadow-sm hover:bg-[#356dff] focus:outline-none focus:ring-2 focus:ring-[#b9cdfc] disabled:cursor-not-allowed disabled:opacity-50"
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
                            <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#4f7cff] text-white shadow-sm">
                                <FaUser className="h-4 w-4" />
                            </div>
                        )}
                    </div>
                );
            })}

            {loading && chatHistory[chatHistory.length - 1]?.role !== "assistant" && (
                <div className="flex justify-start">
                    <div className="flex max-w-xs items-center rounded-3xl border border-[#e1e7f5] bg-white px-4 py-3 text-sm font-medium text-[#667085] shadow-sm">
                        <FaSpinner className="animate-spin mr-2" /> Thinking...
                    </div>
                </div>
            )}
        </div>
    );
}
