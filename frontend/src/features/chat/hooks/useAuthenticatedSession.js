import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { getStoredToken, getTokenStatus, logout, setAutoLogoutTimer } from "@/utils/authToken";


/**
 * Validates the browser token and keeps the chat route session-aware.
 */
export function useAuthenticatedSession(router) {
    const [dashboardToast, setDashboardToast] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const isMounted = useRef(false);

    useEffect(() => {
        if (isMounted.current) return undefined;
        isMounted.current = true;

        const token = getStoredToken();
        if (!token) {
            router.push("/");
            setIsCheckingAuth(false);
            return undefined;
        }

        const tokenStatus = getTokenStatus(token);
        if (tokenStatus === "expired") {
            logout({ expired: true });
            router.push("/");
        } else if (tokenStatus === "invalid") {
            logout();
            router.push("/");
        } else {
            setIsAuthenticated(true);
            if (localStorage.getItem("showWelcomeMessage") === "true") {
                setDashboardToast({ type: "success", message: "Successfully logged in. Welcome back!" });
                localStorage.removeItem("showWelcomeMessage");
            }
        }

        setIsCheckingAuth(false);
        const timerId = setAutoLogoutTimer(token, () => {
            logout({ expired: true });
            setIsCheckingAuth(true);
            window.setTimeout(() => {
                window.location.href = "/";
            }, 500);
        });

        return () => {
            if (timerId) window.clearTimeout(timerId);
        };
    }, [router]);

    useEffect(() => {
        if (!isAuthenticated || !dashboardToast) return;
        toast[dashboardToast.type](dashboardToast.message);
        setDashboardToast(null);
    }, [dashboardToast, isAuthenticated]);

    return { isAuthenticated, isCheckingAuth };
}
