import { FaComment, FaBars, FaTrash, FaTimes } from 'react-icons/fa';
import { groupConversationsByDate } from '../utils/chatUtils';
import closesvg from '../../../public/close.svg'
import opensvg from '../../../public/open.svg'
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';
import ProfileSection from './Profile';
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import Image from 'next/image';
import Portal from './Portal';




const Sidebar = ({ onConversationSelect, currentConversationId }) => {

    // Initialize useRouter
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [chats, setChats] = useState([]);
    const [deletingConversationId, setDeletingConversationId] = useState(null);
    const [collapsedSections, setCollapsedSections] = useState({});


    // Load the backend API URL from the .env file
    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    // Get the email from the token
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const email = decoded.sub;


    // Check for mobile screen size
    useEffect(() => {

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

    // Fetch conversations from the API
    useEffect(() => {

        const fetchConversations = async () => {

            try {

                const token = localStorage.getItem('token');

                const response = await fetch(`${API_URL}/conversations`, {

                    headers: {

                        'Authorization': `Bearer ${token}`

                    }

                });


                if (!response.ok) {

                    throw new Error('Failed to fetch conversations');

                }


                const conversations = await response.json();

                const groupedChats = groupConversationsByDate(conversations);

                setChats(groupedChats);

            } catch (error) {

                console.error('Error fetching conversations:', error);

            }

        };


        fetchConversations();

    }, [currentConversationId]);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/");
    };

    // Toggle collapse for a section
    const toggleSectionCollapse = (index) => {
        setCollapsedSections((prev) => ({
            ...prev,
            [index]: !prev[index], // Toggle the collapsed state for the section
        }));
    };

    // Handle conversation deletion
    const handleDeleteConversation = async (conversationId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/conversations/${conversationId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete conversation');
            }

            // Remove deleted conversation from state
            setChats(prevChats =>
                prevChats.map(section => ({
                    ...section,
                    items: section.items.filter(chat => chat.conversation_id !== conversationId)
                })).filter(section => section.items.length > 0) // Remove empty sections
            );
            toast.success('Conversation deleted successfully');
        } catch (error) {
            console.error('Error deleting conversation:', error);
            toast.error('Failed to delete conversation');
        } finally {
            setDeletingConversationId(null); // Reset the deleting state
        }
    };

    return (

        <>

            {/* Mobile Menu Button */}
            {isMobile && (

                <button

                    onClick={() => setIsOpen(!isOpen)}

                    className="fixed top-3 left-4 z-20 p-2 rounded-md bg-gray-100 hover:bg-gray-200"

                >

                    <FaBars className="text-gray-600" />

                </button>

            )}


            {/* Sidebar */}
            <div className={`

                fixed left-0 top-0 h-screen bg-gray-50 shadow-lg

                transition-all duration-300 ease-in-out z-10

                ${isOpen ? 'translate-x-0' : '-translate-x-full'}

                ${isOpen ? 'w-80' : 'w-0'}

                md:relative md:translate-x-0

                ${isOpen ? 'md:w-80' : 'md:w-14'}

            `}>

                {/* Header */}
                <div className="flex justify-between items-center px-4 py-4 border-b">

                    <div className={`flex items-center  ${isOpen ? "space-x-8" : "space-x-2"} `}>

                        {/* Only show FaComment when sidebar is open */}
                        {isOpen && (

                            <>

                                <FaComment className="text-gray-600" />

                                <span className='font-large'>Your Chats</span>

                            </>

                        )}

                    </div>

                    {/* Sidebar Toggle Button */}
                    {!isMobile && <div className={`cursor-pointer ${isOpen ? '' : 'mx-auto'}`}

                        onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? (
                            <Image
                                src={closesvg}
                                alt="Sidebar Close SVG"
                                width={20}
                                height={20}
                                className="object-contain filter grayscale" // Apply grayscale filter                                             
                                priority
                            />
                        ) : (
                            <Image
                                src={opensvg}
                                alt="Sidebar Open SVG"
                                width={20}
                                height={20}
                                className="object-contain filter grayscale" // Apply grayscale filter
                                priority
                            />
                        )}
                    </div>}

                </div>

                {/* Chat List - Only visible when sidebar is open */}
                <div className={`

                    sidebar overflow-y-auto h-[calc(100vh-120px)]

                    transition-opacity duration-200

                    ${isOpen ? 'opacity-100' : 'opacity-0'}

                    ${isOpen ? 'block' : 'hidden'}

                `}>

                    {chats.length === 0 ? <p className='text-center text-gray-400 mt-4'>
                        New chats will appear here.
                    </p> : chats.map((section, index) => (

                        <div key={index} className="mb-1">

                            {/* Section Header */}
                            <div className="px-4 py-2 flex items-center justify-between bg-gray-100 rounded-b-md shadow-md"
                                onClick={() => toggleSectionCollapse(index)}>

                                <span className="text-sm text-gray-600">{section.section}</span>

                                <span className="text-gray-400 text-sm transform transition-transform">
                                    {collapsedSections[index] ? '▼' : '▲'} {/* Rotate arrow based on collapse state */}
                                </span>
                            </div>


                            {/* Chat Items (Conditionally Rendered) */}
                            {!collapsedSections[index] && ( // Only render if section is not collapsed
                                section.items.map((chat, chatIndex) => (
                                    <div
                                        key={chatIndex}
                                        className={`group px-4 py-2 hover:bg-gray-100 cursor-pointer ${currentConversationId === chat.conversation_id ? 'bg-blue-50' : ''
                                            }`}
                                        onClick={() => onConversationSelect(chat.conversation_id)}
                                    >
                                        <div className="flex items-start space-x-3">
                                            {/* Icon and Color */}
                                            <div
                                                className={`w-8 h-8 rounded-full ${chat.color} flex items-center justify-center flex-shrink-0`}
                                            >
                                                <span className="text-sm">{chat.icon}</span>
                                            </div>

                                            {/* Title and Description */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-medium text-gray-900 truncate">{chat.title}</h3>
                                                <p className="text-sm text-gray-500 truncate">{chat.description}</p>
                                            </div>

                                            {/* Delete Button (Visible on Hover) */}
                                            <button
                                                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-3 rounded-full transition-opacity"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent the parent onClick from firing
                                                    setDeletingConversationId(chat.conversation_id); // Set the conversation to delete
                                                }}
                                            >
                                                <FaTrash className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Confirmation UI (Displayed when deletingConversationId matches) */}
                                        {deletingConversationId === chat.conversation_id && (
                                            <Portal>
                                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                                    <div className="bg-white p-6 rounded-lg shadow-lg">
                                                        <div className="flex justify-between items-center mb-4">
                                                            <h3 className="text-lg font-semibold">Delete Conversation</h3>
                                                            <button
                                                                className="text-gray-500 hover:text-gray-700"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setDeletingConversationId(null); // Close the confirmation UI
                                                                }}
                                                            >
                                                                <FaTimes className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                        <p>Are you sure you want to delete this conversation?</p>
                                                        <div className="flex justify-end gap-2 mt-4">
                                                            <button
                                                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setDeletingConversationId(null); // Close the confirmation UI
                                                                }}
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteConversation(chat.conversation_id); // Confirm deletion
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
                                ))
                            )}

                        </div>

                    ))}

                </div>

                {/* Profile Section  */}
                <div className='profile flex items-center justify-center'>
                    <ProfileSection
                        isOpen={isOpen}
                        isMobile={isMobile}
                        email={email}
                        handleLogout={() => handleLogout()}
                    />
                </div>

                {/* Collapsed View - Only visible when sidebar is collapsed on desktop */}

                {!isOpen && !isMobile && (

                    <div className="py-4">

                        {chats.map((section) => (

                            section.items.map((chat, index) => (

                                <div

                                    key={index}

                                    className="px-2 py-2 hover:bg-gray-100 cursor-pointer"

                                    title={chat.title}

                                >

                                    <div className={`w-8 h-8 rounded-full ${chat.color} flex items-center justify-center mx-auto`}>

                                        <span className="text-sm">{chat.icon}</span>

                                    </div>

                                </div>

                            ))

                        ))}

                    </div>

                )}

            </div>


            {/* Overlay for mobile */}
            {isMobile && isOpen && (

                <div

                    className="fixed inset-0 bg-black bg-opacity-50 z-0"

                    onClick={() => setIsOpen(false)}

                />

            )}

        </>

    );

};

export default Sidebar;