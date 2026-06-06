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
        ? "bg-[#10141c] text-[#eef3f8]"
        : "bg-[#f8fafc] text-[#172033]";
    const headerTheme = isDarkMode
        ? "border-[#252d3a] bg-[#10141c]/95"
        : "border-transparent bg-[#f8fafc]/95";
    const subtleButtonTheme = isDarkMode
        ? "border-[#2a3442] bg-[#171d27] text-[#eef3f8] hover:bg-[#202838] focus:ring-[#3f5561]"
        : "border-[#dce6ef] bg-white text-[#263244] hover:bg-[#edf4f7] focus:ring-[#b8d5db]";
    const chatAreaTheme = isDarkMode ? "bg-[#10141c]" : "bg-[#f8fafc]";
    const assistantTextTheme = isDarkMode ? "text-[#eef3f8]" : "text-[#172033]";
    const userBubbleTheme = isDarkMode
        ? "rounded-[20px] bg-[#1f2a36] text-[#eef3f8]"
        : "rounded-[20px] bg-[#e8f3f4] text-[#172033] shadow-sm ring-1 ring-[#d4e7ea]";
    const userEditBubbleTheme = isDarkMode
        ? "rounded-[24px] border border-[#2b3747] bg-[#171d27] text-[#eef3f8] shadow-[0_10px_30px_rgba(0,0,0,0.16)]"
        : "rounded-[24px] border border-[#dce6ef] bg-[#f8fafc] text-[#172033] shadow-sm";
    const messageActionTheme = isDarkMode
        ? "border-[#2a3442] bg-[#171d27] text-[#c5d0dc] hover:bg-[#202838]"
        : "border-[#dce6ef] bg-white text-[#647187] hover:bg-[#edf4f7]";
    const composerWrapTheme = isDarkMode ? "bg-[#10141c]" : "bg-[#f8fafc]";
    const composerTheme = isDarkMode
        ? "border-[#2b3747] bg-[#171d27] focus-within:border-[#41636a] focus-within:shadow-[0_18px_60px_rgba(0,0,0,0.28)]"
        : "border-[#dce6ef] bg-white focus-within:border-[#9ecbd1] focus-within:shadow-[0_18px_48px_rgba(36,107,112,0.13)]";
    const inputTheme = isDarkMode
        ? "text-[#eef3f8] placeholder:text-[#8997a8]"
        : "text-[#172033] placeholder:text-[#8390a2]";

    const handleLogout = () => {
        logout({ manual: true });
        window.location.href = "/";
    };

    return (
        <div className={`flex h-screen w-full max-w-full overflow-hidden ${pageTheme}`}>
            <Sidebar
                onConversationSelect={chat.loadConversation}
                currentConversationId={chat.currentConversationId}
                isDark={isDarkMode}
                onStartTour={handleStartTour}
                onNewChat={chat.resetChat}
                refreshKey={chat.historyRefreshKey}
            />

            <main className={`flex w-0 min-w-0 flex-1 justify-center overflow-x-hidden ${chatAreaTheme}`}>
                <div className="flex h-full w-full min-w-0 flex-col overflow-hidden">
                    {isTourEnabled && <TourGuide isOpen={true} onClose={handleTourClose} isDark={isDarkMode} />}

                    <ChatHeader
                        headerTheme={headerTheme}
                        isDarkMode={isDarkMode}
                        onLogoutClick={() => setShowLogoutConfirm(true)}
                        onToggleTheme={() => setIsDarkMode(prev => !prev)}
                        subtleButtonTheme={subtleButtonTheme}
                    />

                    <ChatMessages
                        assistantTextTheme={assistantTextTheme}
                        cancelEditingMessage={chat.cancelEditingMessage}
                        chatContainerRef={chat.chatContainerRef}
                        chatHistory={chat.chatHistory}
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
                        onPromptSelect={(content) => chat.sendMessage({ content })}
                    />

                    <ChatComposer
                        isDarkMode={isDarkMode}
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
