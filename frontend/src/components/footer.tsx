import '../styles/footer.css';

interface FooterProps {
    onNavigate: (page: 'landing' | 'shop' | 'login') => void;
}

function Footer({ onNavigate }: FooterProps) {
    const handleHomeClick = (e: React.MouseEvent, hash?: string) => {
        e.preventDefault();
        onNavigate('landing');
        if (hash) {
            setTimeout(() => {
                const el = document.getElementById(hash);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    const handleShopClick = (e: React.MouseEvent) => {
        e.preventDefault();
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            onNavigate('login');
            return;
        }
        try {
            const parsed = JSON.parse(storedUser);
            if (parsed.role === "BUYER") {
                onNavigate('shop');
            } else {
                onNavigate('login');
            }
        } catch {
            onNavigate('login');
        }
    };

    return (
        <footer className="global-footer">
            <div className="footer-outer">
                <div className="footer-grid">
                    {/* Brand column */}
                    <div className="footer-brand-col">
                        <a href="/" className="footer-logo" onClick={(e) => handleHomeClick(e)}>
                            <svg className="footer-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="12" cy="12" r="9" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v10M9 10l3-3 3 3M15 14l-3 3-3-3" />
                            </svg>
                            <div className="footer-logo-text">
                                <span className="footer-logo-primary">REL'S</span>
                                <span className="footer-logo-secondary">MEAT CO.</span>
                            </div>
                        </a>
                        <p className="footer-tagline">
                            Grass-fed beef, heritage pork, and pasture poultry portioned daily. Cold-chain secure shipping directly from the farm.
                        </p>
                    </div>

                    {/* Navigation directories */}
                    <div className="footer-links-col">
                        <h4 className="footer-title">Directory</h4>
                        <div className="footer-links">
                            <a href="/" className="footer-link-item" onClick={(e) => handleHomeClick(e)}>Home</a>
                            <a href="#cuts" className="footer-link-item" onClick={handleShopClick}>Browse cuts</a>
                            <a href="#farms" className="footer-link-item" onClick={(e) => handleHomeClick(e, 'farms')}>Our Sourcing</a>
                            <a href="#process" className="footer-link-item" onClick={(e) => handleHomeClick(e, 'process')}>Our Process</a>
                        </div>
                    </div>

                    {/* Support details */}
                    <div className="footer-links-col">
                        <h4 className="footer-title">Support</h4>
                        <div className="footer-links">
                            <a href="#shipping" className="footer-link-item" onClick={handleShopClick}>Shipping Parameters</a>
                            <a href="#faq" className="footer-link-item" onClick={(e) => handleHomeClick(e)}>FAQ Guide</a>
                            <a href="#returns" className="footer-link-item" onClick={(e) => handleHomeClick(e)}>Portion Policy</a>
                            <a href="#contact" className="footer-link-item" onClick={(e) => handleHomeClick(e)}>Contact Office</a>
                        </div>
                    </div>

                    {/* Location and Opening hours */}
                    <div className="footer-links-col">
                        <h4 className="footer-title">Market Office</h4>
                        <div className="footer-details">
                            <p><strong>Butcher Row:</strong> 544 Market District, Seattle, WA</p>
                            <p><strong>Supply Inquiries:</strong> supply@relsmeat.com</p>
                            <p><strong>Butcher Desk:</strong> Mon - Sat: 7 AM - 6 PM</p>
                        </div>
                    </div>
                </div>

                {/* Bottom row copyrights and USDA certifications badges */}
                <div className="footer-bottom">
                    <span className="footer-copyright">
                        © 2026 Rel's Meat Co. All rights reserved. Vacuum-sealed at source.
                    </span>
                    <div className="footer-certifications">
                        <div className="footer-cert-badge">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span>USDA Prime Certified</span>
                        </div>
                        <div className="footer-cert-badge">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span>Cold-Chain Secure</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
