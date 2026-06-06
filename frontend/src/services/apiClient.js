import { buildApiUrl } from "@/config/api";
import { getStoredToken, logout } from "@/utils/authToken";


/**
 * Performs an authenticated fetch and redirects on expired sessions.
 */
export async function fetchWithToken(path, options = {}) {
    const token = getStoredToken();

    if (!token) {
        throw new Error("No token found");
    }

    const response = await fetch(buildApiUrl(path), {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`
        }
    });

    if (response.status === 401) {
        logout({ expired: true });
        window.location.href = "/";
        return null;
    }

    return response;
}


/**
 * Reads a JSON error message when the backend returns a failed response.
 */
export async function getErrorMessage(response, fallback) {
    try {
        const errorData = await response.json();
        return errorData.detail || fallback;
    } catch (error) {
        return fallback;
    }
}
