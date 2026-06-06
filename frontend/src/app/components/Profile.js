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
        <div className={`profile absolute bottom-0 w-full border-t p-3 ${isDark ? "border-[#23314d] bg-[#111c31]" : "border-[#e6e9f0] bg-[#f1f4f9]"}`}>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`flex min-w-0 items-center gap-2 rounded-full px-2 py-2 text-left focus:outline-none focus:ring-2 ${isDark ? "hover:bg-[#17223a] focus:ring-[#3b5fa8]" : "hover:bg-white/80 focus:ring-[#b9cdfc]"}`}
            >
              <FaUserCircle className={`h-8 w-8 flex-shrink-0 ${isDark ? "text-[#8fa2c9]" : "text-[#667085]"}`} />
              {isOpen && <span className={`truncate text-sm font-semibold ${isDark ? "text-[#eef4ff]" : "text-[#101828]"}`}>My Profile</span>}
            </button>

            {/* Settings */}
            <div>
              {/* Button to open settings modal */}
              {isOpen && (
                <button
                  onClick={() => setShowSettings(true)}
                  className={`rounded-full border px-3 py-2 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 ${isDark ? "border-[#2f3d5f] bg-[#17223a] text-[#dbe7ff] hover:bg-[#1f2d4b] focus:ring-[#3b5fa8]" : "border-[#d8e0ef] bg-white text-[#344054] hover:bg-[#f1f5ff] focus:ring-[#b9cdfc]"}`}
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
            <div className={`absolute bottom-16 left-4 w-64 overflow-hidden rounded-3xl border shadow-xl ${isDark ? "border-[#2f3d5f] bg-[#111c31]" : "border-[#e6e9f0] bg-white"}`}>
              <div className={`truncate p-3 text-sm font-semibold ${isDark ? "text-[#eef4ff]" : "text-[#101828]"}`}>{email}</div>
            </div>
          )}
        </div>
      )}

    </>
  );
};

export default ProfileSection;
