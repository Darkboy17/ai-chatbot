import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { streamAssistantResponse, parseStreamEvent } from "@/services/chatApi";
import { getConversation, saveConversation } from "@/services/conversationApi";
import { generateConversationId } from "@/utils/conversation";


const INITIAL_CHAT = [
    { role: "assistant", content: "Hey there! How can I help you today?" }
];


/**
 * Displays a warning toast with consistent styling.
 */
function warn(message) {
    toast(message, {
        icon: "!",
        style: {
            borderRadius: "10px",
            background: "#f9c22e",
            color: "#000"
        }
    });
}


/**
 * Owns chat state, streaming, editing, persistence, and history loading.
 */
export function useChatController() {
    const [chatHistory, setChatHistory] = useState(INITIAL_CHAT);
    const [loading, setLoading] = useState(false);
    const [currentConversationId, setCurrentConversationId] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
    const [editingMessageIndex, setEditingMessageIndex] = useState(null);
    const [editingMessageContent, setEditingMessageContent] = useState("");
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (currentConversationId) return;
        setCurrentConversationId(generateConversationId());
    }, [currentConversationId]);

    useEffect(() => {
        if (!chatContainerRef.current) return;

        const messages = chatContainerRef.current.children;
        if (messages.length > 0) {
            messages[messages.length - 1].scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [chatHistory]);

    const saveCurrentConversation = async (history = chatHistory) => {
        if (history.length < 2) return false;

        try {
            const conversationId = currentConversationId || generateConversationId();
            await saveConversation(history, conversationId);
            setCurrentConversationId(conversationId);
            setHistoryRefreshKey(prev => prev + 1);
            setHasChanges(false);
            return true;
        } catch (error) {
            console.error("Error saving conversation:", error);
            return false;
        }
    };

    const loadConversation = async (conversationId) => {
        try {
            setLoading(true);
            const conversation = await getConversation(conversationId);
            setChatHistory(conversation.messages);
            setCurrentConversationId(conversation.conversation_id);
            setHasChanges(false);
        } catch (error) {
            console.error("Error loading conversation:", error);
            toast.error("Failed to load conversation");
        } finally {
            setLoading(false);
        }
    };

    const appendStreamContent = (content) => {
        setChatHistory(prev => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;

            if (updated[lastIndex]?.role === "assistant") {
                updated[lastIndex] = {
                    ...updated[lastIndex],
                    content: updated[lastIndex].content + content
                };
            }

            return updated;
        });
    };

    const replaceLastAssistantMessage = (content) => {
        setChatHistory(prev => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;

            if (updated[lastIndex]?.role === "assistant") {
                updated[lastIndex] = {
                    ...updated[lastIndex],
                    content
                };
            }

            return updated;
        });
    };

    const sendMessage = async (options = {}) => {
        if (loading) return;

        const userMessage = (options.content ?? "").trim();
        if (!userMessage) return;

        const newChat = options.nextChat || [...chatHistory, { role: "user", content: userMessage }];
        setChatHistory(newChat);
        setEditingMessageIndex(null);
        setEditingMessageContent("");
        setLoading(true);

        try {
            const response = await streamAssistantResponse({
                userMessage,
                conversationId: currentConversationId,
                history: newChat
            });

            setChatHistory(prev => [...prev, { role: "assistant", content: "" }]);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            let streamedResponse = "";
            let isDone = false;

            while (!isDone) {
                const { value, done } = await reader.read();
                if (done) isDone = true;

                buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
                const events = buffer.split("\n\n");
                buffer = events.pop() || "";

                for (const eventBlock of events) {
                    if (!eventBlock.trim()) continue;

                    const streamEvent = parseStreamEvent(eventBlock);
                    if (!streamEvent) continue;

                    if (streamEvent.type === "error") {
                        throw new Error(streamEvent.data.detail || "Failed to stream response");
                    }

                    if (streamEvent.type === "done") {
                        streamedResponse = streamEvent.data.assistant_response || streamedResponse;
                        replaceLastAssistantMessage(streamedResponse);
                        isDone = true;
                        break;
                    }

                    if (streamEvent.data.content) {
                        streamedResponse += streamEvent.data.content;
                        appendStreamContent(streamEvent.data.content);
                    }
                }
            }

            const completedChat = [...newChat, { role: "assistant", content: streamedResponse }];
            const saved = await saveCurrentConversation(completedChat);

            if (!saved) {
                setHasChanges(true);
                warn("Chat updated locally, but could not be saved yet.");
            }
        } catch (error) {
            warn(`Error: ${error.message}`);
            setChatHistory(prev => {
                const updated = [...prev];
                const lastIndex = updated.length - 1;
                const errorMessage = "Sorry, I encountered an error. Please try again.";

                if (updated[lastIndex]?.role === "assistant" && !updated[lastIndex].content) {
                    updated[lastIndex] = {
                        ...updated[lastIndex],
                        content: errorMessage
                    };
                    return updated;
                }

                return [...prev, { role: "assistant", content: errorMessage }];
            });
        } finally {
            setLoading(false);
        }
    };

    const startEditingMessage = (index, content) => {
        if (loading) return;
        setEditingMessageIndex(index);
        setEditingMessageContent(content);
    };

    const cancelEditingMessage = () => {
        setEditingMessageIndex(null);
        setEditingMessageContent("");
    };

    const resendEditedMessage = async () => {
        if (editingMessageIndex === null) return;

        const editedMessage = editingMessageContent.trim();
        if (!editedMessage) {
            warn("Please enter a message before resending.");
            return;
        }

        const nextChat = chatHistory
            .slice(0, editingMessageIndex + 1)
            .map((chat, index) => (
                index === editingMessageIndex
                    ? { ...chat, content: editedMessage }
                    : chat
            ));

        await sendMessage({
            content: editedMessage,
            nextChat
        });
    };

    const resetChat = async () => {
        if (hasChanges) {
            await saveCurrentConversation();
        }

        setCurrentConversationId(generateConversationId());
        setChatHistory([{ role: "assistant", content: "Hi! I'm your AI assistant. How can I help?" }]);
        setHasChanges(false);
    };

    return {
        cancelEditingMessage,
        chatContainerRef,
        chatHistory,
        currentConversationId,
        editingMessageContent,
        editingMessageIndex,
        historyRefreshKey,
        loadConversation,
        loading,
        resendEditedMessage,
        resetChat,
        sendMessage,
        setEditingMessageContent,
        startEditingMessage
    };
}
