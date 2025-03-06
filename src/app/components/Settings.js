import Portal from './Portal';

export default function Settings({ isOpen, onClose, isTourEnabled, toggleTour }) {
    
    if (!isOpen) return null; // Don't render if the modal is closed

    return (
        <Portal>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-4 rounded-lg shadow-lg w-96">
                    <div className="flex justify-between items-center mb-4 rounded-md bg-blue-400 p-2">
                        <h3 className="text-lg font-semibold">Settings</h3>

                    </div>

                    {/* Toggle Tour Option */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Enable Tour</span>
                        <button
                            onClick={() => toggleTour(!isTourEnabled)}
                            className={`relative w-10 h-6 rounded-full p-1 transition-colors ${isTourEnabled ? 'bg-blue-500' : 'bg-gray-300'
                                }`}
                        >
                            <span
                                className={`block w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${isTourEnabled ? 'translate-x-4' : 'translate-x-0'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Save/Cancel Buttons */}
                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </Portal>
    );
}