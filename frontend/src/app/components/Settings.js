import Portal from './Portal';

export default function Settings({ isOpen, onClose, isTourEnabled, toggleTour, isDark = false }) {
    
    if (!isOpen) return null; // Don't render if the modal is closed

    return (
        <Portal>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 backdrop-blur-sm">
                <div className={`w-full max-w-sm rounded-2xl border p-5 shadow-2xl ${isDark ? "border-[#2b3747] bg-[#171d27]" : "border-[#dce6ef] bg-white"}`}>
                    <div className="mb-5 flex items-center justify-between">
                        <h3 className={`text-base font-semibold ${isDark ? "text-[#eef3f8]" : "text-[#172033]"}`}>Settings</h3>
                        <button
                            onClick={onClose}
                            className={`rounded-xl px-3 py-1.5 text-sm font-medium ${isDark ? "text-[#8997a8] hover:bg-[#202838] hover:text-white" : "text-[#647187] hover:bg-[#edf4f7] hover:text-[#172033]"}`}
                        >
                            Close
                        </button>

                    </div>

                    {/* Toggle Tour Option */}
                    <div className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${isDark ? "border-[#2b3747] bg-[#10141c]" : "border-[#dce6ef] bg-[#f8fafc]"}`}>
                        <div>
                            <span className={`block text-sm font-medium ${isDark ? "text-[#eef3f8]" : "text-[#172033]"}`}>Tour guide</span>
                            <span className={`block text-xs ${isDark ? "text-[#8997a8]" : "text-[#647187]"}`}>Turn on to start the guided tour.</span>
                        </div>
                        <button
                            onClick={toggleTour}
                            className={`relative h-6 w-11 rounded-full p-1 transition-colors ${isTourEnabled ? isDark ? 'bg-[#dce8ef]' : 'bg-[#246b70]' : isDark ? 'bg-[#2b3747]' : 'bg-[#cfdce5]'
                                }`}
                            aria-label="Toggle tour guide"
                        >
                            <span
                                className={`block h-4 w-4 rounded-full shadow-md transition-transform ${isTourEnabled && isDark ? 'bg-[#10141c]' : 'bg-white'} ${isTourEnabled ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </Portal>
    );
}
