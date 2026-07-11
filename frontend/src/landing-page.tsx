import { useState, useEffect } from 'react';
import './styles/landing-page.css';
import Header from "./components/header.tsx";
import Footer from "./components/footer.tsx";

interface LandingPageProps {
    onNavigate: (page: 'landing' | 'shop' | 'login' | 'seller-dashboard') => void;
}

function LandingPage({ onNavigate }: LandingPageProps) {
    const [scrollY, setScrollY] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [transparentSteakSrc, setTransparentSteakSrc] = useState("");

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleResize);

        // Process steak image to make black background transparent
        const img = new Image();
        img.src = "/hero_steak_isolated.png";
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imgData.data;
                
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    
                    const maxVal = Math.max(r, g, b);
                    const minVal = Math.min(r, g, b);
                    const saturationDiff = maxVal - minVal;
                    
                    // Filter near-black background and dark-gray slate base plate
                    if (maxVal < 68 && saturationDiff < 20) {
                        data[i + 3] = 0; // Erase slate base plate
                    } else if (maxVal < 18) {
                        data[i + 3] = 0; // 100% transparent
                    } else if (maxVal < 45) {
                        // Smooth feathering for anti-aliasing edges
                        const alpha = ((maxVal - 18) / (45 - 18)) * 255;
                        data[i + 3] = Math.min(data[i + 3], alpha);
                    }
                }
                ctx.putImageData(imgData, 0, 0);
                setTransparentSteakSrc(canvas.toDataURL());
            }
        };

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // Calculate parallax offsets
    const bgOffset = isMobile ? 0 : scrollY * 0.15;
    const textOffset = isMobile ? 0 : scrollY * 0.35;
    const fgOffset = isMobile ? 0 : scrollY * 0.05;

    const handleExploreClick = (e: React.MouseEvent) => {
        e.preventDefault();
        const el = document.getElementById("farms");
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="landing-layout">
            <Header currentPage="landing" onNavigate={onNavigate} />

            {/* Section 1: Parallax Hero */}
            <section className="hero-parallax-section">
                {/* Background Layer */}
                <div 
                    className="parallax-layer layer-bg"
                    style={{ transform: `translateY(${bgOffset}px)` }}
                >
                    <img src="/hero_bg.png" alt="Butcher Studio Background" className="parallax-bg-img" />
                </div>

                {/* Text Layer */}
                <div 
                    className="parallax-layer layer-text"
                    style={{ transform: `translateY(${textOffset}px)` }}
                >
                    <h1 className="parallax-title">PRIME</h1>
                </div>

                {/* Foreground Layer (Steak) */}
                <div 
                    className="parallax-layer layer-fg"
                    style={{ transform: `translateY(${fgOffset}px)` }}
                >
                    <img src={transparentSteakSrc || "/hero_steak_isolated.png"} alt="Fresh Raw Ribeye Steak" className="parallax-fg-img" />
                </div>

                {/* Static Content Overlay */}
                <div className="hero-content-overlay">
                    <div className="hero-top-info">
                        <span className="eyebrow-badge">DAILY FRESH CUSTOM CUTS</span>
                    </div>

                    <div className="hero-bottom-container">
                        <div className="hero-desc-col">
                            <p className="hero-description">
                                100% grass-fed beef, heritage breed pork, and free-range poultry hand-cut daily by master butchers.
                            </p>
                            <div className="hero-actions-row">
                                <a href="#farms" className="btn-primary" onClick={handleExploreClick}>
                                    Explore Our Sourcing
                                    <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Page Indicator matching Hiker's 10/15 */}
                        <div className="hero-pagination">
                            01<span>/04</span>
                        </div>

                        {/* Social Anchors matching Hiker's visual */}
                        <div className="hero-social-anchors">
                            <a href="#instagram">Instagram.</a>
                            <a href="#facebook">Facebook.</a>
                            <a href="#youtube">Youtube.</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: Sourcing & Our Farms */}
            <section id="farms" className="farms-section">
                <div className="farms-content-row">
                    <div className="farms-text-col">
                        <span className="section-eyebrow">OUR HERITAGE</span>
                        <h2 className="section-title text-left">Regenerative Grazing. Sustainable Quality.</h2>
                        <p className="farms-desc">
                            We partner exclusively with small, family-owned farms committed to restorative ecology. 
                            Our cattle roam free on natural clover pastures, and our herds are never confined or grain-finished.
                        </p>
                        <p className="farms-desc">
                            This traditional, grass-fed approach yields beef with superior marbling, deeper color, and rich, 
                            authentic flavor profile that grain-fed alternatives simply cannot match.
                        </p>
                        <div className="farms-stats-grid">
                            <div className="stat-box">
                                <h3>100%</h3>
                                <p>Pasture Raised</p>
                            </div>
                            <div className="stat-box">
                                <h3>Zero</h3>
                                <p>Hormones / Antibiotics</p>
                            </div>
                            <div className="stat-box">
                                <h3>USDA</h3>
                                <p>Prime Certified Grade</p>
                            </div>
                        </div>
                    </div>
                    <div className="farms-image-col">
                        <div className="farms-img-frame">
                            <img src="/pasture.png" alt="Cattle Pasture" className="farms-showcase-img" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: Cold-Chain Logistics Stepper */}
            <section id="process" className="stepper-section">
                <div className="section-header">
                    <span className="section-eyebrow">OUR PROCESS</span>
                    <h2 className="section-title">The Cold-Chain Journey</h2>
                    <p className="section-subtitle">
                        How we maintain sub-38°F temperatures from the butcher's knife directly to your doorstep.
                    </p>
                </div>

                <div className="stepper-container">
                    <div className="step-item">
                        <div className="step-num-col">
                            <div className="step-number">01</div>
                            <div className="step-line"></div>
                        </div>
                        <div className="step-content">
                            <h3>Portion Cut & Trimmed</h3>
                            <p>
                                Upon receiving your order, our master butchers portion cut, trim, and package your selections 
                                in a sterile facility monitored at exactly 34°F to halt bacterial oxidation.
                            </p>
                        </div>
                    </div>
                    
                    <div className="step-item">
                        <div className="step-num-col">
                            <div className="step-number">02</div>
                            <div className="step-line"></div>
                        </div>
                        <div className="step-content">
                            <h3>High-Barrier Vacuum Sealing</h3>
                            <p>
                                Cuts are sealed instantly in thick, food-grade copolymer bags. This oxygen-deprived 
                                environment preserves natural juices, prevents freezer burn, and locks in freshness.
                            </p>
                        </div>
                    </div>

                    <div className="step-item">
                        <div className="step-num-col">
                            <div className="step-number">03</div>
                        </div>
                        <div className="step-content">
                            <h3>Insulated Dry Ice Transit</h3>
                            <p>
                                We package your box in heavy-duty insulated liners filled with calculated slabs of dry ice. 
                                It is shipped express under complete cold-chain parameters to guarantee sub-38°F delivery.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 4: Quality Standard Bar */}
            <section className="standards-banner">
                <div className="standard-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <h4>100% Certified Sourcing</h4>
                    <p>Hormone-free, antibiotic-free cattle raised on regenerative pastures.</p>
                </div>
                <div className="standard-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <h4>Cold-Chain Secure</h4>
                    <p>Packed with dry ice in insulated boxes. Delivered frozen or sub-38°F.</p>
                </div>
                <div className="standard-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 0A18.015 18.015 0 0110 14.88M8 21h4M5 10a9 9 0 1115.898 6.097" />
                    </svg>
                    <h4>Master Craft Cuts</h4>
                    <p>Expertly trimmed, portioned, and clean-packaged on order.</p>
                </div>
            </section>

            <Footer onNavigate={onNavigate} />
        </div>
    );
}

export default LandingPage;