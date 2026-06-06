import { useCallback, useEffect, useState } from "react";


/**
 * Controls onboarding tour visibility and persistence.
 */
export function useTourState(isAuthenticated) {
    const [isTourEnabled, setIsTourEnabled] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) return;

        const shouldShowFirstLoginTour =
            localStorage.getItem("showTourOnLogin") === "true" &&
            localStorage.getItem("hasSeenTour") !== "true";
        const shouldShowManualTour = localStorage.getItem("isTourEnabled") === "true";

        if (shouldShowFirstLoginTour || shouldShowManualTour) {
            setIsTourEnabled(true);
        }

        if (shouldShowFirstLoginTour) {
            localStorage.removeItem("showTourOnLogin");
        }
    }, [isAuthenticated]);

    const handleTourClose = useCallback(() => {
        localStorage.setItem("hasSeenTour", "true");
        localStorage.setItem("isTourEnabled", "false");
        setIsTourEnabled(false);
    }, []);

    const handleStartTour = useCallback(() => {
        localStorage.setItem("isTourEnabled", "true");
        setIsTourEnabled(true);
    }, []);

    return { isTourEnabled, handleTourClose, handleStartTour };
}
