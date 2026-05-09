import React from 'react';

const Footer = () => {
    return (
        <footer className="text-center p-4 text-brand-muted text-sm border-t border-brand-card mt-auto">
            &copy; {new Date().getFullYear()} Nexora Health. "Track. Analyze. Thrive."
        </footer>
    );
};

export default Footer;
