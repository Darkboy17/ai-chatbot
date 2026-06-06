import Portal from './Portal';

export default function Settings({ isOpen, onClose, isTourEnabled, toggleTour, isDark = false }) {
    
    if (!isOpen) return null; // Don't render if the modal is closed

    return (
        <Portal>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101828]/45 px-4 backdrop-blur-sm">
                <div className={`w-full max-w-sm rounded-3xl border p-5 shadow-2xl ${isDark ? "border-[#2f3d5f] bg-[#111c31]" : "border-[#e6e9f0] bg-white"}`}>
                    <div className="mb-5 flex items-center justify-between">
                        <h3 className={`text-base font-semibold ${isDark ? "text-[#eef4ff]" : "text-[#101828]"}`}>Settings</h3>
                        <button
                            onClick={onClose}
                            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${isDark ? "text-[#8fa2c9] hover:bg-[#17223a] hover:text-white" : "text-[#667085] hover:bg-[#f2f4f7] hover:text-[#101828]"}`}
                        >
                            Close
                        </button>

                    </div>

                    {/* Toggle Tour Option */}
                    <div className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${isDark ? "border-[#2f3d5f] bg-[#17223a]" : "border-[#d8e0ef] bg-[#f7f8fb]"}`}>
                        <div>
                            <span className={`block text-sm font-semibold ${isDark ? "text-[#eef4ff]" : "text-[#101828]"}`}>Tour guide</span>
                            <span className={`block text-xs ${isDark ? "text-[#8fa2c9]" : "text-[#667085]"}`}>Turn on to start the guided tour.</span>
                        </div>
                        <button
                            onClick={toggleTour}
                            className={`relative h-6 w-11 rounded-full p-1 transition-colors ${isTourEnabled ? 'bg-[#4f7cff]' : isDark ? 'bg-[#2f3d5f]' : 'bg-[#d0d5dd]'
                                }`}
                            aria-label="Toggle tour guide"
                        >
                            <span
                                className={`block h-4 w-4 rounded-full bg-white shadow-md transition-transform ${isTourEnabled ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </Portal>
    );
}
