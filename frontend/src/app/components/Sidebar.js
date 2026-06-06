import { FaBars, FaBrain, FaBriefcase, FaCalculator, FaCheck, FaCode, FaComment, FaDatabase, FaLightbulb, FaPalette, FaPen, FaSearch, FaTimes, FaTrash } from 'react-icons/fa';
import { getIconAndColor, groupConversationsByRecency } from '@/utils/chatUtils';
import { deleteConversation, listConversations, updateConversationTitle } from '@/services/conversationApi';
import closesvg from '../../../public/close.svg';
import opensvg from '../../../public/open.svg';
import { useCallback, useEffect, useRef, useState } from 'react';
import ProfileSection from './Profile';
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import Image from 'next/image';
import Portal from './Portal';

const PAGE_SIZE = 25;

const conversationIconComponents = {
    business: FaBriefcase,
    chat: FaComment,
    code: FaCode,
    database: FaDatabase,
    design: FaPalette,
    idea: FaLightbulb,
    math: FaCalculator,
    research: FaSearch,
    writing: FaPen
};

/**
 * Resolves the icon component for a sidebar conversation category.
 */
const ConversationIcon = ({ type }) => {
    const Icon = conversationIconComponents[type] || FaBrain;

    return <Icon className="h-3.5 w-3.5" />;
};

/**
 * Renders saved chat history, title editing, deletion, and profile controls.
 */
const Sidebar = ({ onConversationSelect, currentConversationId, isDark = false, onStartTour, refreshKey = 0 }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [nextSkip, setNextSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [totalCount, setTotalCount] = useState(null);
    const [isLoadingConversations, setIsLoadingConversations] = useState(false);
    const [deletingConversationId, setDeletingConversationId] = useState(null);
    const [editingConversationId, setEditingConversationId] = useState(null);
    const [editingTitle, setEditingTitle] = useState('');
    const [savingTitleId, setSavingTitleId] = useState(null);
    const isLoadingConversationsRef = useRef(false);
    const hasMoreRef = useRef(true);
    const nextSkipRef = useRef(0);

    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const email = decoded.sub;

    const chatItems = [...conversations]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .map(conversation => ({
            ...conversation,
            ...getIconAndColor(conversation)
        }));
    const chatSections = groupConversationsByRecency(chatItems);

    const sidebarTheme = isDark
        ? "border-[#23314d] bg-[#111c31] shadow-black/20"
        : "border-[#e6e9f0] bg-[#f1f4f9] shadow-sm";
    const headerTheme = isDark ? "border-[#23314d]" : "border-[#e6e9f0]";
    const titleTheme = isDark ? "text-[#eef4ff]" : "text-[#101828]";
    const mutedTheme = isDark ? "text-[#8fa2c9]" : "text-[#667085]";
    const itemTheme = isDark ? "hover:bg-[#17223a]" : "hover:bg-white/80";
    const activeItemTheme = isDark
        ? "bg-[#17223a] shadow-sm ring-1 ring-[#34538a]"
        : "bg-white shadow-sm ring-1 ring-[#d8e6ff]";

    useEffect(() => {
        /**
         * Tracks mobile layout and default collapsed state.
         */
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setIsOpen(false);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    useEffect(() => {
        isLoadingConversationsRef.current = isLoadingConversations;
        hasMoreRef.current = hasMore;
        nextSkipRef.current = nextSkip;
    }, [hasMore, isLoadingConversations, nextSkip]);

    /**
     * Loads the next page of conversations and merges it with current state.
     */
    const fetchConversations = useCallback(async ({ reset = false } = {}) => {
        if (isLoadingConversationsRef.current) return;
        if (!reset && !hasMoreRef.current) return;

        try {
            isLoadingConversationsRef.current = true;
            setIsLoadingConversations(true);

            const skip = reset ? 0 : nextSkipRef.current;
            const data = await listConversations({ skip, limit: PAGE_SIZE });
            const items = Array.isArray(data) ? data : data.items || [];
            const nextTotal = Array.isArray(data) ? null : data.total;

            setConversations(prev => {
                const merged = reset ? items : [...prev, ...items];
                const unique = new Map();

                merged.forEach((conversation, index) => {
                    const key = conversation.conversation_id || conversation._id || `${conversation.created_at}-${conversation.title}-${index}`;
                    unique.set(key, conversation);
                });

                return Array.from(unique.values());
            });
            const nextSkipValue = Array.isArray(data) ? skip + items.length : data.next_skip;
            const hasMoreValue = Array.isArray(data) ? items.length === PAGE_SIZE : data.has_more;

            nextSkipRef.current = nextSkipValue;
            hasMoreRef.current = hasMoreValue;
            setNextSkip(nextSkipValue);
            setHasMore(hasMoreValue);
            setTotalCount(nextTotal);

        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            isLoadingConversationsRef.current = false;
            setIsLoadingConversations(false);
        }
    }, []);

    useEffect(() => {
        nextSkipRef.current = 0;
        hasMoreRef.current = true;
        setConversations([]);
        setNextSkip(0);
        setHasMore(true);
        setTotalCount(null);
        fetchConversations({ reset: true });
    }, [fetchConversations, refreshKey]);

    /**
     * Requests more history when the scroll position nears the bottom.
     */
    const handleHistoryScroll = (event) => {
        const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 120;

        if (isNearBottom) {
            fetchConversations();
        }
    };

    /**
     * Deletes a conversation after confirmation and removes it locally.
     */
    const handleDeleteConversation = async (conversationId) => {
        try {
            await deleteConversation(conversationId);

            setConversations(prevConversations =>
                prevConversations.filter(chat => chat.conversation_id !== conversationId)
            );
            toast.success('Conversation deleted successfully');
        } catch (error) {
            console.error('Error deleting conversation:', error);
            toast.error('Failed to delete conversation');
        } finally {
            setDeletingConversationId(null);
        }
    };

    /**
     * Opens inline editing for a conversation title.
     */
    const startEditingTitle = (conversation) => {
        setEditingConversationId(conversation.conversation_id);
        setEditingTitle(conversation.title || '');
    };

    /**
     * Closes inline title editing and discards draft text.
     */
    const cancelEditingTitle = () => {
        setEditingConversationId(null);
        setEditingTitle('');
    };

    /**
     * Persists a custom conversation title to the backend.
     */
    const saveConversationTitle = async (conversationId) => {
        const nextTitle = editingTitle.trim();

        if (!nextTitle) {
            toast.error('Please enter a title');
            return;
        }

        try {
            setSavingTitleId(conversationId);

            const data = await updateConversationTitle(conversationId, nextTitle);

            setConversations(prevConversations => (
                prevConversations.map(conversation => (
                    conversation.conversation_id === conversationId
                        ? { ...conversation, title: data.title || nextTitle, is_title_custom: true }
                        : conversation
                ))
            ));
            cancelEditingTitle();
            toast.success('Chat title updated');
        } catch (error) {
            console.error('Error updating conversation title:', error);
            toast.error('Failed to update title');
        } finally {
            setSavingTitleId(null);
        }
    };

    return (
        <>
            {isMobile && (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`fixed left-4 top-4 z-20 rounded-full border p-2 shadow-sm ${isDark ? "border-[#2f3d5f] bg-[#17223a] text-[#dbe7ff] hover:bg-[#1f2d4b]" : "border-[#d8e0ef] bg-white text-[#667085] hover:bg-[#f1f5ff]"}`}
                >
                    <FaBars className="h-4 w-4" />
                </button>
            )}

            <div className={`
                fixed left-0 top-0 h-screen border-r ${sidebarTheme}
                transition-all duration-300 ease-out z-10
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                ${isOpen ? 'w-80' : 'w-0'}
                md:relative md:translate-x-0
                ${isOpen ? 'md:w-80' : 'md:w-14'}
            `}>
                <div className={`flex items-center justify-between border-b px-4 py-3 ${headerTheme}`}>
                    <div className={`flex items-center ${isOpen ? "space-x-3" : "space-x-2"} `}>
                        {isOpen && (
                            <>
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4f7cff] text-white shadow-sm">
                                    <FaComment className="h-4 w-4" />
                                </div>
                                <div>
                                    <span className={`block text-sm font-semibold ${titleTheme}`}>Your Chats</span>
                                    <span className={`block text-xs font-medium ${mutedTheme}`}>
                                        {totalCount === null ? `${chatItems.length} loaded` : `${chatItems.length} of ${totalCount} loaded`}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                    {!isMobile && (
                        <div
                            className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border shadow-sm ${isDark ? "border-[#2f3d5f] bg-[#17223a] hover:bg-[#1f2d4b]" : "border-[#d8e0ef] bg-white hover:bg-[#f1f5ff]"} ${isOpen ? '' : 'mx-auto'}`}
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <Image
                                src={isOpen ? closesvg : opensvg}
                                alt={isOpen ? "Close sidebar" : "Open sidebar"}
                                width={20}
                                height={20}
                                className="h-4 w-4 object-contain opacity-60"
                                priority
                            />
                        </div>
                    )}
                </div>

                <div
                    className={`
                        sidebar h-[calc(100vh-120px)] overflow-y-auto px-3 py-3
                        transition-opacity duration-200
                        ${isOpen ? 'opacity-100' : 'opacity-0'}
                        ${isOpen ? 'block' : 'hidden'}
                    `}
                    onScroll={handleHistoryScroll}
                >
                    {chatItems.length === 0 ? (
                        <p className={`mt-4 rounded-2xl border border-dashed px-3 py-5 text-center text-sm ${isDark ? "border-[#2f3d5f] bg-[#17223a]/70 text-[#8fa2c9]" : "border-[#d8e0ef] bg-white/70 text-[#667085]"}`}>
                            New chats will appear here.
                        </p>
                    ) : (
                        <div className="space-y-5">
                            {chatSections.map(section => (
                                <section key={section.label} className="space-y-1">
                                    <div className={`px-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${isDark ? "text-[#7186ad]" : "text-[#8a94a6]"}`}>
                                        {section.label}
                                    </div>
                                    {section.items.map((chat, chatIndex) => {
                                        const isEditingTitle = editingConversationId === chat.conversation_id;

                                        return (
                                            <div
                                                key={chat.conversation_id || chat._id || `${section.label}-${chatIndex}`}
                                                className={`group cursor-pointer rounded-2xl px-3 py-3 transition-colors duration-150 ${itemTheme} ${currentConversationId === chat.conversation_id ? activeItemTheme : ''}`}
                                                onClick={() => {
                                                    if (!isEditingTitle) {
                                                        onConversationSelect(chat.conversation_id);
                                                    }
                                                }}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${chat.color} shadow-sm`}>
                                                        <ConversationIcon type={chat.iconType} />
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        {isEditingTitle ? (
                                                            <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                                                                <input
                                                                    value={editingTitle}
                                                                    onChange={(e) => setEditingTitle(e.target.value)}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Escape') {
                                                                            cancelEditingTitle();
                                                                        }

                                                                        if (e.key === 'Enter') {
                                                                            saveConversationTitle(chat.conversation_id);
                                                                        }
                                                                    }}
                                                                    className={`w-full rounded-xl border px-3 py-2 text-sm font-semibold outline-none focus:ring-2 ${isDark ? "border-[#2f3d5f] bg-[#0f172a] text-[#eef4ff] focus:ring-[#3b5fa8]" : "border-[#d8e0ef] bg-white text-[#101828] focus:ring-[#b9cdfc]"}`}
                                                                    autoFocus
                                                                    disabled={savingTitleId === chat.conversation_id}
                                                                />
                                                                <div className="flex justify-end gap-2">
                                                                    <button
                                                                        className={`inline-flex h-8 w-8 items-center justify-center rounded-full border ${isDark ? "border-[#2f3d5f] bg-[#17223a] text-[#dbe7ff] hover:bg-[#1f2d4b]" : "border-[#d8e0ef] bg-white text-[#475467] hover:bg-[#f1f5ff]"}`}
                                                                        onClick={cancelEditingTitle}
                                                                        disabled={savingTitleId === chat.conversation_id}
                                                                        aria-label="Cancel title edit"
                                                                        title="Cancel"
                                                                    >
                                                                        <FaTimes className="h-3.5 w-3.5" />
                                                                    </button>
                                                                    <button
                                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#4f7cff] text-white shadow-sm hover:bg-[#356dff] disabled:cursor-not-allowed disabled:opacity-50"
                                                                        onClick={() => saveConversationTitle(chat.conversation_id)}
                                                                        disabled={savingTitleId === chat.conversation_id}
                                                                        aria-label="Save title"
                                                                        title="Save"
                                                                    >
                                                                        <FaCheck className="h-3.5 w-3.5" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <h3 className={`truncate text-sm font-semibold ${titleTheme}`}>{chat.title}</h3>
                                                                <p className={`truncate text-xs leading-5 ${mutedTheme}`}>{chat.description}</p>
                                                            </>
                                                        )}
                                                    </div>

                                                    {!isEditingTitle && (
                                                        <div className="flex flex-shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                            <button
                                                                className={`rounded-full p-2 transition-colors ${isDark ? "text-[#8fa2c9] hover:bg-[#1f2d4b] hover:text-[#eef4ff]" : "text-[#98a2b3] hover:bg-[#f1f5ff] hover:text-[#344054]"}`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    startEditingTitle(chat);
                                                                }}
                                                                aria-label="Edit chat title"
                                                                title="Edit title"
                                                            >
                                                                <FaPen className="h-3.5 w-3.5" />
                                                            </button>
                                                            <button
                                                                className="rounded-full p-2 text-[#98a2b3] transition-colors hover:bg-red-50 hover:text-red-600"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setDeletingConversationId(chat.conversation_id);
                                                                }}
                                                                aria-label="Delete conversation"
                                                                title="Delete"
                                                            >
                                                                <FaTrash className="h-3.5 w-3.5" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                            {deletingConversationId === chat.conversation_id && (
                                                <Portal>
                                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101828]/45 px-4 backdrop-blur-sm">
                                                        <div className={`w-full max-w-sm rounded-3xl border p-5 shadow-2xl ${isDark ? "border-[#2f3d5f] bg-[#111c31]" : "border-[#e6e9f0] bg-white"}`}>
                                                            <div className="mb-4 flex items-center justify-between">
                                                                <h3 className={`text-base font-semibold ${titleTheme}`}>Delete Conversation</h3>
                                                                <button
                                                                    className="rounded-full p-2 text-[#98a2b3] hover:bg-[#f2f4f7] hover:text-[#101828]"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setDeletingConversationId(null);
                                                                    }}
                                                                >
                                                                    <FaTimes className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                            <p className={`text-sm leading-6 ${mutedTheme}`}>Are you sure you want to delete this conversation?</p>
                                                            <div className="mt-4 flex justify-end gap-2">
                                                                <button
                                                                    className="rounded-full border border-[#d8e0ef] bg-white px-4 py-2 text-sm font-semibold text-[#344054] hover:bg-[#f2f4f7]"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setDeletingConversationId(null);
                                                                    }}
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDeleteConversation(chat.conversation_id);
                                                                    }}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Portal>
                                            )}
                                        </div>
                                    );
                                    })}
                                </section>
                            ))}
                        </div>
                    )}

                    {isLoadingConversations && (
                        <div className="px-3 py-4 text-center text-xs font-medium text-[#667085]">
                            Loading more chats...
                        </div>
                    )}

                    {!hasMore && conversations.length > 0 && (
                        <div className="px-3 py-4 text-center text-xs font-medium text-[#98a2b3]">
                            You reached the end.
                        </div>
                    )}
                </div>

                <div className='profile flex items-center justify-center'>
                    <ProfileSection
                        isOpen={isOpen}
                        isMobile={isMobile}
                        email={email}
                        isDark={isDark}
                        onStartTour={onStartTour}
                    />
                </div>

                {!isOpen && !isMobile && (
                    <div className="space-y-2 py-4">
                        {chatItems.map((chat, index) => (
                            <div
                                key={chat.conversation_id || chat._id || index}
                                className="cursor-pointer px-2 py-1"
                                title={chat.title}
                            >
                                <div className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full ${chat.color} shadow-sm transition-transform duration-150 hover:scale-105`}>
                                    <ConversationIcon type={chat.iconType} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 z-0 bg-[#101828]/45 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;
