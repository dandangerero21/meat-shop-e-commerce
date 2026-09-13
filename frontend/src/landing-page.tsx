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

    return (
        <div className="landing-layout">
            <Header currentPage="landing" onNavigate={onNavigate} />

            {/* Extended Parallax Section */}
            <section className="hero-parallax-section">
                {/* Background Layer */}
                <div 
                    className="parallax-layer layer-bg"
                    style={{ transform: `translateY(${bgOffset}px)` }}
                >
                    <img src="/hero_bg.png" alt="Butcher Studio Background" className="parallax-bg-img" />
                </div>

                {/* Text Layer - Title */}
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

                {/* Parallax Content Layer - scrolls naturally but sits in front of parallax elements */}
                <div className="parallax-content-layer">
                    <div className="hero-spacer"></div>

                    {/* New Parallax-integrated Features */}
                    <div className="parallax-features-container">
                        <div className="feature-card" id="farms">
                            <img src="/pasture.png" alt="Pasture" className="feature-card-img" />
                            <div className="feature-card-text">
                                <h3>Regenerative Grazing</h3>
                                <p>We partner exclusively with small, family-owned farms committed to restorative ecology. 100% pasture-raised with zero hormones.</p>
                            </div>
                        </div>

                        <div className="feature-card offset-card">
                            <div className="feature-card-text">
                                <h3>Master Craft Cuts</h3>
                                <p>Prepared daily by our expert butchers for optimal flavor and tenderness. Custom cuts designed for your needs.</p>
                            </div>
                        </div>

                        <div className="feature-card" id="process">
                            <div className="feature-card-text">
                                <h3>Fast & Fresh</h3>
                                <p>Delivered securely packaged in cold-chain logistics to maintain peak freshness upon arrival to your doorstep.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fixed Social Footer Overlays */}
                <div className="hero-social-anchors">
                    <a href="#instagram">Instagram.</a>
                    <a href="#facebook">Facebook.</a>
                    <a href="#youtube">Youtube.</a>
                </div>
            </section>

            <Footer onNavigate={onNavigate} />
        </div>
    );
}

export default LandingPage;