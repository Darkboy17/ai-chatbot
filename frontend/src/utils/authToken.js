import { jwtDecode } from "jwt-decode";


/**
 * Reads the current bearer token from browser storage.
 */
export function getStoredToken() {
    return localStorage.getItem("token");
}


/**
 * Classifies a JWT as valid, expired, or invalid for client-side routing.
 */
export function getTokenStatus(token) {
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime ? "expired" : "valid";
    } catch (error) {
        console.error("Error decoding token:", error);
        return "invalid";
    }
}


/**
 * Schedules a client-side logout for the token expiration time.
 */
export function setAutoLogoutTimer(token, onExpire) {
    if (!token) return undefined;

    try {
        const decoded = jwtDecode(token);
        const expirationTime = decoded.exp * 1000;
        const timeUntilExpiration = expirationTime - Date.now();

        if (timeUntilExpiration <= 0) return undefined;
        return window.setTimeout(onExpire, timeUntilExpiration);
    } catch (error) {
        return undefined;
    }
}


/**
 * Clears authentication state and records why the user is leaving.
 */
export function logout({ manual = false, expired = false } = {}) {
    localStorage.removeItem("token");
    localStorage.removeItem("sessionExpired");

    if (manual) {
        localStorage.setItem("manualLogout", "true");
    }

    if (expired) {
        localStorage.setItem("sessionExpired", "true");
    }
}
