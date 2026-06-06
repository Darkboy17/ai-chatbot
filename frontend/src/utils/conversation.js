/**
 * Creates a browser-local conversation identifier for new chats.
 */
export function generateConversationId() {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${randomString}`;
}


/**
 * Removes non-chat records before sending context back to the backend.
 */
export function getMessagesForRequest(history) {
    return history
        .filter(chat => ["user", "assistant"].includes(chat.role) && chat.content?.trim())
        .map(chat => ({
            role: chat.role,
            content: chat.content
        }));
}


/**
 * Converts visible chat history into the backend conversation save payload.
 */
export function createConversationPayload(history, conversationId) {
    return {
        title: "Generating title...",
        description: "Generating summary...",
        messages: history.map(message => ({
            role: message.role,
            content: message.content
        })),
        created_at: new Date().toISOString(),
        conversation_id: conversationId
    };
}
