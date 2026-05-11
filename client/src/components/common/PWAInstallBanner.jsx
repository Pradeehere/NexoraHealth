import { useState, useEffect } from 'react';

const PWAInstallBanner = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault(); // CRITICAL: must preventDefault first
            setDeferredPrompt(e); // save the event
            setShowBanner(true);  // now show banner
            console.log('PWA install prompt captured');
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) {
            console.log('No install prompt available');
            return;
        }
        try {
            await deferredPrompt.prompt(); // call prompt() only here on user click
            const result = await deferredPrompt.userChoice;
            console.log('PWA install result:', result.outcome);
            setDeferredPrompt(null);
            setShowBanner(false);
        } catch (err) {
            console.error('PWA install error:', err);
            setShowBanner(false);
        }
    };

    const handleDismiss = () => {
        setShowBanner(false);
        setDeferredPrompt(null);
    };

    // Don't render anything if no prompt available
    if (!showBanner || !deferredPrompt) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#000',
            color: '#fff',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            zIndex: 9999,
            border: '1px solid #C9A84C',
            fontFamily: 'Jost, sans-serif',
            minWidth: '320px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.3)'
        }}>
            <span style={{ flex: 1, fontSize: '14px', letterSpacing: '0.05em' }}>
                Install Nexora Health on your device
            </span>
            <button
                onClick={handleInstall}
                style={{
                    background: '#C9A84C',
                    color: '#000',
                    border: 'none',
                    padding: '8px 20px',
                    cursor: 'pointer',
                    fontFamily: 'Tenor Sans, sans-serif',
                    fontSize: '12px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase'
                }}
            >
                INSTALL
            </button>
            <button
                onClick={handleDismiss}
                style={{
                    background: 'transparent',
                    color: '#fff',
                    border: '1px solid #555',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontFamily: 'Jost, sans-serif',
                    fontSize: '12px'
                }}
            >
                ✕
            </button>
        </div>
    );
};

export default PWAInstallBanner;
