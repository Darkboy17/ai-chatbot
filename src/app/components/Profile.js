import { FaUserCircle, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import Settings from './Settings';
import { useState } from 'react';
import Portal from './Portal';


const ProfileSection = ({ isOpen, isMobile, email, handleLogout }) => {

  // State to control dropdown visibility
  const [showDropdown, setShowDropdown] = useState(false);

  // State to control settings visibility
  const [showSettings, setShowSettings] = useState(false);

  // State to control logout confirmation modal
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  // State to manage tour toggle
  const [isTourEnabled, setIsTourEnabled] = useState(() => {
    // Load the default state from localStorage
    const savedTourState = localStorage.getItem('isTourEnabled') || 'true';
    return savedTourState === 'true';
  });

  // Toggle tour on/off
  const toggleTour = () => {

    setIsTourEnabled((prev) => !prev);

    // Save the preference to localStorage or send it to the backend
    localStorage.setItem('isTourEnabled', (!isTourEnabled).toString());

  };

  // Handle logout confirmation
  const confirmLogout = () => {
    setShowLogoutConfirmation(true);
  };

  // Handle logout cancellation
  const cancelLogout = () => {
    setShowLogoutConfirmation(false);
  };

  // Handle logout confirmation
  const proceedWithLogout = () => {
    setShowLogoutConfirmation(false);
    handleLogout();
  };

  return (
    <>
      {/* Profile Section */}
      {(isOpen || !isMobile) && (
        <div className="profile absolute bottom-0 w-full bg-gray-200 border-t p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <FaUserCircle className="text-gray-600 w-8 h-8" />
              {isOpen && <span className="text-sm font-medium text-gray-700">My Profile</span>}
            </button>

            {/* Settings */}
            <div>
              {/* Button to open settings modal */}
              {isOpen && (
                <button
                  onClick={() => setShowSettings(true)}
                  className="p-2 bg-gray-300 text-gray-600 hover:text-gray-800 shadow-lg focus:outline-none"
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
              />
            </div>
          </div>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute bottom-16 left-4 w-auto bg-white rounded-md shadow-lg">
              <div className="p-3 text-gray-600 border-b text-sm font-bold">{email}</div>
              <button
                onClick={confirmLogout} // Show the logout confirmation modal
                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <FaSignOutAlt className="mr-2 w-auto" /> Logout
              </button>
            </div>
          )}
        </div>
      )}

      {/* Logout Confirmation Modal (Rendered via Portal) */}
      {showLogoutConfirmation && (
        <Portal>
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Confirm Logout</h3>
                <button
                  onClick={cancelLogout} // Close the confirmation modal
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-gray-700">Are you sure you want to log out?</p>

              {/* Confirmation Buttons */}
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={cancelLogout} // Cancel logout
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={proceedWithLogout} // Proceed with logout
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}

    </>
  );
};

export default ProfileSection;