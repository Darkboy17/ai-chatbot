import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function Portal({ children }) {
    
    // State to keep track of whether the component is mounted
    const [mounted, setMounted] = useState(false);

    // Set mounted to true after the component mounts
    useEffect(() => {
        setMounted(true); // Set mounted to true after the component mounts
        return () => setMounted(false); // Cleanup on unmount
    }, []);

    // Render the children into a portal if mounted
    return mounted
        ? createPortal(children, document.getElementById('portal-root'))
        : null;
}