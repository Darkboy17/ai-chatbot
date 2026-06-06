"use client";

import { FaTimes } from "react-icons/fa";

import Portal from "@/app/components/Portal";


/**
 * Shows a confirmation dialog before clearing the user's session.
 */
export default function LogoutConfirmModal({ isDarkMode, onCancel, onConfirm }) {
    return (
        <Portal>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101828]/45 px-4 backdrop-blur-sm">
                <div className={`w-full max-w-sm rounded-3xl border p-5 shadow-2xl ${isDarkMode ? "border-[#2f3d5f] bg-[#111c31]" : "border-[#e6e9f0] bg-white"}`}>
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className={`text-base font-semibold ${isDarkMode ? "text-[#eef4ff]" : "text-[#101828]"}`}>Log out?</h3>
                        <button
                            onClick={onCancel}
                            className={`rounded-full p-2 ${isDarkMode ? "text-[#8fa2c9] hover:bg-[#17223a] hover:text-white" : "text-[#98a2b3] hover:bg-[#f2f4f7] hover:text-[#101828]"}`}
                            aria-label="Close logout confirmation"
                        >
                            <FaTimes className="h-4 w-4" />
                        </button>
                    </div>
                    <p className={`text-sm leading-6 ${isDarkMode ? "text-[#8fa2c9]" : "text-[#667085]"}`}>
                        You will return to the sign-in page. Your saved conversations will remain available next time you log in.
                    </p>
                    <div className="mt-5 flex justify-end gap-2">
                        <button
                            onClick={onCancel}
                            className={`rounded-full border px-4 py-2 text-sm font-semibold ${isDarkMode ? "border-[#2f3d5f] bg-[#17223a] text-[#dbe7ff] hover:bg-[#1f2d4b]" : "border-[#d8e0ef] bg-white text-[#344054] hover:bg-[#f2f4f7]"}`}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </div>
        </Portal>
    );
}
