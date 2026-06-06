import { FaUserCircle } from 'react-icons/fa';
import Settings from './Settings';
import { useState } from 'react';


const ProfileSection = ({ isOpen, isMobile, email, isDark = false, onStartTour }) => {

  // State to control dropdown visibility
  const [showDropdown, setShowDropdown] = useState(false);

  // State to control settings visibility
  const [showSettings, setShowSettings] = useState(false);

  // State to manage tour toggle
  const [isTourEnabled, setIsTourEnabled] = useState(() => {
    // Load the default state from localStorage
    const savedTourState = localStorage.getItem('isTourEnabled') || 'false';
    return savedTourState === 'true';
  });

  // Toggle tour on/off
  const toggleTour = () => {
    const nextTourState = !isTourEnabled;

    setIsTourEnabled(nextTourState);

    // Save the preference to localStorage or send it to the backend
    localStorage.setItem('isTourEnabled', nextTourState.toString());

    if (nextTourState) {
      setShowSettings(false);
      onStartTour?.();
    }

  };

  return (
    <>
      {/* Profile Section */}
      {(isOpen || !isMobile) && (
        <div className={`profile absolute bottom-0 w-full border-t ${isOpen ? "p-3" : "px-2 py-3"} ${isDark ? "border-[#252d3a] bg-[#0f141d]" : "border-[#dce6ef] bg-[#eef3f8]"}`}>
          <div className={`flex items-center ${isOpen ? "justify-between" : "justify-center"}`}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`flex min-w-0 items-center rounded-2xl text-left focus:outline-none focus:ring-2 ${isOpen ? "gap-2 px-2 py-2" : "h-10 w-10 justify-center p-0"} ${isDark ? "hover:bg-[#171d27] focus:ring-[#41636a]" : "hover:bg-white focus:ring-[#b8d5db]"}`}
              aria-label="Open profile"
            >
              <FaUserCircle className={`h-8 w-8 flex-shrink-0 ${isDark ? "text-[#8997a8]" : "text-[#647187]"}`} />
              {isOpen && <span className={`truncate text-sm font-medium ${isDark ? "text-[#eef3f8]" : "text-[#172033]"}`}>My Profile</span>}
            </button>

            {/* Settings */}
            <div>
              {/* Button to open settings modal */}
              {isOpen && (
                <button
                  onClick={() => setShowSettings(true)}
                  className={`rounded-2xl border px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 ${isDark ? "border-[#2b3747] bg-[#171d27] text-[#eef3f8] hover:bg-[#202838] focus:ring-[#41636a]" : "border-[#dce6ef] bg-white text-[#263244] hover:bg-[#edf4f7] focus:ring-[#b8d5db]"}`}
                >
                  Settings
                </button>
              )}

              {/* Render the Settings component conditionally */}
              <Settings
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                isTourEnabled={isTourEnabled}
                toggleTour={toggleTour}
                isDark={isDark}
              />
            </div>
          </div>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className={`absolute bottom-16 left-4 w-64 overflow-hidden rounded-2xl border shadow-xl ${isDark ? "border-[#2b3747] bg-[#171d27]" : "border-[#dce6ef] bg-white"}`}>
              <div className={`truncate p-3 text-sm font-medium ${isDark ? "text-[#eef3f8]" : "text-[#172033]"}`}>{email}</div>
            </div>
          )}
        </div>
      )}

    </>
  );
};

export default ProfileSection;
