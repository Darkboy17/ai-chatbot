import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Mounts children into the shared portal root after client hydration.
 */
export default function Portal({ children }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    return mounted
        ? createPortal(children, document.getElementById('portal-root'))
        : null;
}
