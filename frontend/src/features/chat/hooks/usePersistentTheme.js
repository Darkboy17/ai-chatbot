import { useEffect, useState } from "react";


/**
 * Persists the selected color theme in localStorage.
 */
export function usePersistentTheme() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [hasLoadedTheme, setHasLoadedTheme] = useState(false);

    useEffect(() => {
        setIsDarkMode(localStorage.getItem("theme") === "dark");
        setHasLoadedTheme(true);
    }, []);

    useEffect(() => {
        if (!hasLoadedTheme) return;
        localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    }, [hasLoadedTheme, isDarkMode]);

    return { isDarkMode, setIsDarkMode };
}
