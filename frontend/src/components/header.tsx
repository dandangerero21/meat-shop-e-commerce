import { useState, useEffect } from 'react';
import '../styles/header.css';

interface HeaderProps {
    currentPage?: 'landing' | 'shop' | 'login' | 'seller-dashboard';
    onNavigate?: (page: 'landing' | 'shop' | 'login' | 'seller-dashboard') => void;
}

interface UserSession {
    username: string;
    email: string;
    role: string;
    profilePictureUrl?: string;
}

function Header({ currentPage = 'landing', onNavigate }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState<UserSession | null>(null);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [avatarError, setAvatarError] = useState(false);

    useEffect(() => {
        setAvatarError(false);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        // Check for active user session in localStorage
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (storedToken && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (err) {
                console.error("Failed to parse user session", err);
            }
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, [currentPage]); // re-run check when view transitions

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        if (!isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
        document.body.style.overflow = 'unset';
    };

    const handleLogoClick = (e: React.MouseEvent) => {
        e.preventDefault();
        closeMenu();
        if (onNavigate) {
            onNavigate('landing');
        }
    };

    const handleShopClick = (e: React.MouseEvent) => {
        e.preventDefault();
        closeMenu();
        if (onNavigate) {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) {
                onNavigate('login');
                return;
            }
            try {
                const parsed = JSON.parse(storedUser);
                if (parsed.role === "BUYER") {
                    onNavigate('shop');
                } else if (parsed.role === "SELLER") {
                    onNavigate('seller-dashboard');
                } else {
                    onNavigate('login');
                }
            } catch (err) {
                onNavigate('login');
            }
        }
    };

    const handleLoginClick = (e: React.MouseEvent) => {
        e.preventDefault();
        closeMenu();
        if (onNavigate) {
            onNavigate('login');
        }
    };

    const handleLogoutClick = (e: React.MouseEvent) => {
        e.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setIsProfileDropdownOpen(false);
        closeMenu();
        if (onNavigate) {
            onNavigate('landing');
        }
    };

    const handleHomeLinkClick = (e: React.MouseEvent, targetHash?: string) => {
        e.preventDefault();
        closeMenu();
        if (onNavigate) {
            onNavigate('landing');
            if (targetHash) {
                setTimeout(() => {
                    const el = document.getElementById(targetHash);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    };

    const getInitials = (name: string) => {
        if (!name) return "U";
        return name.slice(0, 2).toUpperCase();
    };

    return (
        <>
            <header className={`header-island ${isScrolled ? 'scrolled' : ''} ${currentPage === 'login' ? 'auth-transparent' : ''}`}>
                <div className="header-outer">
                    <div className="header-inner">
                        {/* Logo */}
                        <a href="/" className="logo-link" onClick={handleLogoClick}>
                            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="12" cy="12" r="9" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v10M9 10l3-3 3 3M15 14l-3 3-3-3" />
                            </svg>
                            <div className="logo-text">
                                <span className="logo-primary">REL'S</span>
                                <span className="logo-secondary">MEAT CO.</span>
                            </div>
                        </a>

                        {/* Desktop Nav Links */}
                        <nav className="desktop-nav">
                            {currentPage === 'landing' ? (
                                <>
                                    <a 
                                        href="/" 
                                        className="nav-link active"
                                        onClick={handleLogoClick}
                                    >
                                        Home
                                    </a>
                                    <a 
                                        href="#farms" 
                                        className="nav-link"
                                        onClick={(e) => handleHomeLinkClick(e, 'farms')}
                                    >
                                        Our Farms
                                    </a>
                                    <a 
                                        href="#process" 
                                        className="nav-link"
                                        onClick={(e) => handleHomeLinkClick(e, 'process')}
                                    >
                                        Our Process
                                    </a>
                                </>
                            ) : (
                                <>
                                    <a 
                                        href="/" 
                                        className="nav-link"
                                        onClick={handleLogoClick}
                                    >
                                        Home
                                    </a>
                                    <a 
                                        href="#cuts" 
                                        className={`nav-link ${currentPage === 'shop' ? 'active' : ''}`}
                                        onClick={handleShopClick}
                                    >
                                        The Cuts
                                    </a>
                                </>
                            )}
                            {user && user.role === 'SELLER' && (
                                <a 
                                    href="#seller-dashboard" 
                                    className={`nav-link ${currentPage === 'seller-dashboard' ? 'active' : ''}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (onNavigate) onNavigate('seller-dashboard');
                                    }}
                                >
                                    Seller Console
                                </a>
                            )}
                        </nav>

                        {/* Right Hand Actions */}
                        <div className="header-actions">
                            {user ? (
                                /* Authenticated User Profile Dropdown */
                                <div className="user-profile-menu-container">
                                    <button 
                                        className="profile-badge-btn"
                                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                        aria-label="User profile settings"
                                    >
                                        {user.profilePictureUrl && !avatarError ? (
                                            <img 
                                                src={user.profilePictureUrl} 
                                                alt={user.username} 
                                                className="user-avatar-img" 
                                                onError={() => setAvatarError(true)} 
                                            />
                                        ) : (
                                            <div className="user-initials-badge">{getInitials(user.username)}</div>
                                        )}
                                    </button>

                                    {isProfileDropdownOpen && (
                                        <div className="profile-dropdown-card">
                                            <div className="dropdown-user-header">
                                                <div className="dropdown-username">{user.username}</div>
                                                <div className="dropdown-user-email">{user.email}</div>
                                                <span className="dropdown-user-role-badge">{user.role}</span>
                                            </div>
                                            <div className="dropdown-actions-list">
                                                <a href="#shop" className="dropdown-action-item" onClick={handleShopClick}>
                                                    Go to Shop
                                                </a>
                                                <button className="dropdown-action-item logout-btn" onClick={handleLogoutClick}>
                                                    Log Out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Guest Login Link */
                                <a 
                                    href="/login" 
                                    className={`nav-link login-nav-link ${currentPage === 'login' ? 'active' : ''}`}
                                    onClick={handleLoginClick}
                                >
                                    Log In
                                </a>
                            )}

                            <a href="#shop" className="cta-button" onClick={handleShopClick} style={{ pointerEvents: 'auto' }}>
                                <span className="cta-text">
                                    {user && user.role === 'SELLER' ? 'Seller Console' : 'Shop Fresh Cuts'}
                                </span>
                                <span className="cta-icon-wrapper">
                                    <svg className="cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </span>
                            </a>

                            <button
                                className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
                                onClick={toggleMenu}
                                aria-label="Toggle Menu"
                            >
                                <span className="line line-1"></span>
                                <span className="line line-2"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <div className={`mobile-overlay ${isMenuOpen ? 'active' : ''}`}>
                <div className="mobile-overlay-bg" onClick={closeMenu}></div>
                <div className="mobile-menu-container">
                    <nav className="mobile-nav">
                        {currentPage === 'landing' ? (
                            <>
                                <a 
                                    href="/" 
                                    className="mobile-nav-link"
                                    onClick={handleLogoClick}
                                >
                                    <span className="mobile-link-num">01</span>
                                    <span className="mobile-link-text">Home</span>
                                </a>
                                <a 
                                    href="#farms" 
                                    className="mobile-nav-link"
                                    onClick={(e) => handleHomeLinkClick(e, 'farms')}
                                >
                                    <span className="mobile-link-num">02</span>
                                    <span className="mobile-link-text">Our Farms</span>
                                </a>
                                <a 
                                    href="#process" 
                                    className="mobile-nav-link"
                                    onClick={(e) => handleHomeLinkClick(e, 'process')}
                                >
                                    <span className="mobile-link-num">03</span>
                                    <span className="mobile-link-text">Our Process</span>
                                </a>
                            </>
                        ) : (
                            <>
                                <a 
                                    href="/" 
                                    className="mobile-nav-link"
                                    onClick={handleLogoClick}
                                >
                                    <span className="mobile-link-num">01</span>
                                    <span className="mobile-link-text">Home</span>
                                </a>
                                <a 
                                    href="#cuts" 
                                    className="mobile-nav-link"
                                    onClick={handleShopClick}
                                >
                                    <span className="mobile-link-num">02</span>
                                    <span className="mobile-link-text">The Cuts</span>
                                </a>
                            </>
                        )}
                        {user && user.role === 'SELLER' && (
                            <a 
                                href="#seller-dashboard" 
                                className="mobile-nav-link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    closeMenu();
                                    if (onNavigate) onNavigate('seller-dashboard');
                                }}
                            >
                                <span className="mobile-link-num">04</span>
                                <span className="mobile-link-text">Seller Console</span>
                            </a>
                        )}
                        {!user && (
                            <a 
                                href="/login" 
                                className="mobile-nav-link"
                                onClick={handleLoginClick}
                            >
                                <span className="mobile-link-num">05</span>
                                <span className="mobile-link-text">Log In</span>
                            </a>
                        )}
                    </nav>
                    <div className="mobile-menu-footer">
                        {user && (
                            <div className="mobile-user-profile-header">
                                <span className="mobile-username-badge">{user.username} ({user.role})</span>
                                <button className="mobile-logout-btn" onClick={handleLogoutClick}>Log Out</button>
                            </div>
                        )}
                        <a href="#shop" className="cta-button mobile-cta" onClick={handleShopClick}>
                            <span className="cta-text">
                                {user && user.role === 'SELLER' ? 'Seller Console' : 'Shop Fresh Cuts'}
                            </span>
                            <span className="cta-icon-wrapper">
                                <svg className="cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </span>
                        </a>
                        <div className="mobile-contact-info">
                            <p>Daily vacuum-sealed shipping under cold-chain standards.</p>
                            <p>Direct Orders: supply@relsmeat.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Header;