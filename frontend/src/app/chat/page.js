"use client";

import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

import Sidebar from "../components/Sidebar";
import TourGuide from "../components/TourGuide";
import ChatComposer from "@/features/chat/components/ChatComposer";
import ChatHeader from "@/features/chat/components/ChatHeader";
import ChatMessages from "@/features/chat/components/ChatMessages";
import LoadingScreen from "@/features/chat/components/LoadingScreen";
import LogoutConfirmModal from "@/features/chat/components/LogoutConfirmModal";
import { useAuthenticatedSession } from "@/features/chat/hooks/useAuthenticatedSession";
import { useChatController } from "@/features/chat/hooks/useChatController";
import { usePersistentTheme } from "@/features/chat/hooks/usePersistentTheme";
import { useTourState } from "@/features/chat/hooks/useTourState";
import { logout } from "@/utils/authToken";


/**
 * Coordinates the authenticated chat workspace route.
 */
export default function Chatbot() {
    const router = useRouter();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const { isDarkMode, setIsDarkMode } = usePersistentTheme();
    const { isAuthenticated, isCheckingAuth } = useAuthenticatedSession(router);
    const { isTourEnabled, handleTourClose, handleStartTour } = useTourState(isAuthenticated);
    const chat = useChatController();

    if (isCheckingAuth) {
        return <LoadingScreen />;
    }

    if (!isAuthenticated) {
        return null;
    }

    const pageTheme = isDarkMode
        ? "bg-[#0f172a] text-[#eef4ff]"
        : "bg-[#f7f8fb] text-[#101828]";
    const headerTheme = isDarkMode
        ? "border-[#23314d] bg-[#0f172a]/95"
        : "border-[#e6e9f0] bg-[#f7f8fb]/95";
    const subtleButtonTheme = isDarkMode
        ? "border-[#2f3d5f] bg-[#17223a] text-[#dbe7ff] hover:bg-[#1f2d4b] focus:ring-[#3b5fa8]"
        : "border-[#d8e0ef] bg-white text-[#344054] hover:bg-[#f1f5ff] focus:ring-[#b9cdfc]";
    const chatAreaTheme = isDarkMode ? "bg-[#0f172a]" : "bg-[#f7f8fb]";
    const assistantTextTheme = isDarkMode ? "text-[#dbe7ff]" : "text-[#1f2937]";
    const userBubbleTheme = isDarkMode
        ? "rounded-3xl bg-[#22365f] text-[#eef4ff] shadow-sm"
        : "rounded-3xl bg-[#eaf1ff] text-[#101828] shadow-sm";
    const userEditBubbleTheme = isDarkMode
        ? "rounded-3xl border border-[#2f3d5f] bg-[#111c31] text-[#eef4ff] shadow-sm"
        : "rounded-3xl border border-[#d8e0ef] bg-white text-[#101828] shadow-sm";
    const messageActionTheme = isDarkMode
        ? "border-[#2f3d5f] bg-[#17223a] text-[#dbe7ff] hover:bg-[#1f2d4b]"
        : "border-[#d8e0ef] bg-white text-[#475467] hover:bg-[#f1f5ff]";
    const editTextAreaTheme = isDarkMode
        ? "text-[#eef4ff] placeholder:text-[#7f8ca6]"
        : "text-[#101828] placeholder:text-[#98a2b3]";
    const composerWrapTheme = isDarkMode ? "bg-[#0f172a]" : "bg-[#f7f8fb]";
    const composerTheme = isDarkMode
        ? "border-[#2f3d5f] bg-[#111c31] focus-within:border-[#6f95ff] focus-within:shadow-[0_18px_60px_rgba(79,124,255,0.2)]"
        : "border-[#d8e0ef] bg-white focus-within:border-[#aac2ff] focus-within:shadow-[0_18px_60px_rgba(79,124,255,0.16)]";
    const inputTheme = isDarkMode
        ? "text-[#eef4ff] placeholder:text-[#7f8ca6]"
        : "text-[#101828] placeholder:text-[#98a2b3]";

    const handleLogout = () => {
        logout({ manual: true });
        window.location.href = "/";
    };

    return (
        <div className={`flex h-screen overflow-hidden ${pageTheme}`}>
            <Sidebar
                onConversationSelect={chat.loadConversation}
                currentConversationId={chat.currentConversationId}
                isDark={isDarkMode}
                onStartTour={handleStartTour}
                refreshKey={chat.historyRefreshKey}
            />

            <main className={`flex min-w-0 flex-1 ${chatAreaTheme}`}>
                <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
                    {isTourEnabled && <TourGuide isOpen={true} onClose={handleTourClose} isDark={isDarkMode} />}

                    <ChatHeader
                        headerTheme={headerTheme}
                        isDarkMode={isDarkMode}
                        onLogoutClick={() => setShowLogoutConfirm(true)}
                        onNewChat={chat.resetChat}
                        onToggleTheme={() => setIsDarkMode(prev => !prev)}
                        subtleButtonTheme={subtleButtonTheme}
                    />

                    <ChatMessages
                        assistantTextTheme={assistantTextTheme}
                        cancelEditingMessage={chat.cancelEditingMessage}
                        chatContainerRef={chat.chatContainerRef}
                        chatHistory={chat.chatHistory}
                        editTextAreaTheme={editTextAreaTheme}
                        editingMessageContent={chat.editingMessageContent}
                        editingMessageIndex={chat.editingMessageIndex}
                        isDarkMode={isDarkMode}
                        loading={chat.loading}
                        messageActionTheme={messageActionTheme}
                        resendEditedMessage={chat.resendEditedMessage}
                        setEditingMessageContent={chat.setEditingMessageContent}
                        startEditingMessage={chat.startEditingMessage}
                        userBubbleTheme={userBubbleTheme}
                        userEditBubbleTheme={userEditBubbleTheme}
                    />

                    <ChatComposer
                        loading={chat.loading}
                        onSend={(content) => chat.sendMessage({ content })}
                        composerWrapTheme={composerWrapTheme}
                        composerTheme={composerTheme}
                        inputTheme={inputTheme}
                    />
                    <ToastContainer position="top-center" newestOnTop />
                </div>
            </main>

            {showLogoutConfirm && (
                <LogoutConfirmModal
                    isDarkMode={isDarkMode}
                    onCancel={() => setShowLogoutConfirm(false)}
                    onConfirm={handleLogout}
                />
            )}
        </div>
    );
}
