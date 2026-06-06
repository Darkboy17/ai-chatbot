import { getMessagesForRequest } from "@/utils/conversation";

import { fetchWithToken, getErrorMessage } from "./apiClient";


/**
 * Parses one Server-Sent Events block emitted by the backend.
 */
export function parseStreamEvent(eventBlock) {
    const event = { type: "message", data: "" };

    eventBlock.split("\n").forEach((line) => {
        if (line.startsWith("event:")) {
            event.type = line.slice(6).trim();
        }

        if (line.startsWith("data:")) {
            event.data += line.slice(5).trimStart();
        }
    });

    if (!event.data) return null;

    return {
        type: event.type,
        data: JSON.parse(event.data)
    };
}


/**
 * Opens a streaming chat request and returns the browser response object.
 */
export async function streamAssistantResponse({ userMessage, conversationId, history }) {
    const response = await fetchWithToken("/ask/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_input: userMessage,
            conversation_id: conversationId,
            messages: getMessagesForRequest(history)
        })
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, "Failed to get response"));
    }

    if (!response.body) {
        throw new Error("Streaming is not supported by this browser");
    }

    return response;
}
