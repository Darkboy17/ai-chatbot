"use client";

import { FaSpinner } from "react-icons/fa";


/**
 * Displays the full-screen loading state while auth is checked.
 */
export default function LoadingScreen() {
    return (
        <div className="flex h-screen items-center justify-center bg-[#f7f8fb]">
            <FaSpinner className="animate-spin text-4xl text-[#4f7cff]" />
        </div>
    );
}
