import { createConversationPayload } from "@/utils/conversation";

import { fetchWithToken, getErrorMessage } from "./apiClient";


/**
 * Saves the current conversation history to the backend.
 */
export async function saveConversation(history, conversationId) {
    const response = await fetchWithToken("/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createConversationPayload(history, conversationId))
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, "Failed to save conversation"));
    }

    return response.json();
}


/**
 * Loads a single conversation by its stable identifier.
 */
export async function getConversation(conversationId) {
    const response = await fetchWithToken(`/conversations/${conversationId}`);

    if (!response.ok) {
        throw new Error("Failed to load conversation");
    }

    return response.json();
}


/**
 * Loads one page of conversations for the authenticated user.
 */
export async function listConversations({ skip = 0, limit = 25 } = {}) {
    const response = await fetchWithToken(`/conversations?skip=${skip}&limit=${limit}`);

    if (!response.ok) {
        throw new Error("Failed to fetch conversations");
    }

    return response.json();
}


/**
 * Deletes one conversation for the authenticated user.
 */
export async function deleteConversation(conversationId) {
    const response = await fetchWithToken(`/conversations/${conversationId}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Failed to delete conversation");
    }

    return true;
}


/**
 * Updates the display title for one conversation.
 */
export async function updateConversationTitle(conversationId, title) {
    const response = await fetchWithToken(`/conversations/${conversationId}/title`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
    });

    if (!response.ok) {
        throw new Error("Failed to update title");
    }

    return response.json();
}
