import { useEffect, useState } from "react";


/**
 * Persists the selected color theme in localStorage.
 */
export function usePersistentTheme() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [hasLoadedTheme, setHasLoadedTheme] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        setIsDarkMode(savedTheme ? savedTheme === "dark" : false);
        setHasLoadedTheme(true);
    }, []);

    useEffect(() => {
        if (!hasLoadedTheme) return;
        localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    }, [hasLoadedTheme, isDarkMode]);

    return { isDarkMode, setIsDarkMode };
}
