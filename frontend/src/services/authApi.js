import axios from "axios";

import { buildApiUrl } from "@/config/api";


/**
 * Requests a login token from the backend.
 */
export function loginUser(credentials) {
    return axios.post(buildApiUrl("/login"), credentials);
}


/**
 * Creates a new user account through the backend.
 */
export function signupUser(credentials) {
    return axios.post(buildApiUrl("/signup"), credentials);
}
