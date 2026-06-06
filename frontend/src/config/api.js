export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


/**
 * Builds an absolute backend URL from an API path.
 */
export function buildApiUrl(path) {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE_URL}${normalizedPath}`;
}
