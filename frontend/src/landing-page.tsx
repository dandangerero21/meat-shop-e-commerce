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

        // Process steak image to create transparent background with smooth edge anti-aliasing
        const img = new Image();
        img.src = "/hero_steak_isolated.png";
        img.onload = () => {
            try {
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

                        // Filter dark background and plate border
                        if (maxVal < 68 && saturationDiff < 20) {
                            data[i + 3] = 0;
                        } else if (maxVal < 22) {
                            data[i + 3] = 0;
                        } else if (maxVal < 50) {
                            const alpha = ((maxVal - 22) / (50 - 22)) * 255;
                            data[i + 3] = Math.min(data[i + 3], alpha);
                        }
                    }
                    ctx.putImageData(imgData, 0, 0);
                    setTransparentSteakSrc(canvas.toDataURL());
                }
            } catch (err) {
                console.warn("Steak transparency canvas fallback", err);
            }
        };

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

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
            } else if (parsed.role === "SELLER") {
                onNavigate('seller-dashboard');
            } else {
                onNavigate('login');
            }
        } catch {
            onNavigate('login');
        }
    };

    const handleScrollTo = (e: React.MouseEvent, targetId: string) => {
        e.preventDefault();
        const el = document.getElementById(targetId);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Parallax depth calculations (clamped within hero scroll threshold)
    const heroScroll = isMobile ? 0 : Math.min(scrollY, 800);
    const bgTranslate = heroScroll * 0.15;
    const textTranslate = -heroScroll * 0.28;
    const textOpacity = Math.max(0, 1 - heroScroll / 550);
    const steakTranslate = -heroScroll * 0.09;
    const steakScale = Math.max(0.9, 1 - heroScroll * 0.0002);
    
    // Independent floating badge offsets
    const badge1Translate = -heroScroll * 0.38;
    const badge2Translate = -heroScroll * 0.22;
    const badge3Translate = -heroScroll * 0.32;
    const heroContentOpacity = Math.max(0, 1 - heroScroll / 450);

    return (
        <div className="landing-layout">
            <Header currentPage="landing" onNavigate={onNavigate} />

            {/* --- 1. HERO PARALLAX SECTION --- */}
            <section id="hero" className="hero-parallax-section">
                <div className="parallax-stage">
                    {/* Background Layer: Atmospheric Studio */}
                    <div 
                        className="parallax-layer layer-bg"
                        style={{ transform: `translate3d(0, ${bgTranslate}px, 0)` }}
                    >
                        <img src="/hero_bg.png" alt="Butcher Studio" className="parallax-bg-img" />
                        <div className="parallax-radial-spotlight"></div>
                    </div>

                    {/* Behind-Cut Typography Layer: PRIME */}
                    <div 
                        className="parallax-layer layer-text"
                        style={{ 
                            transform: `translate3d(0, ${textTranslate}px, 0)`,
                            opacity: textOpacity
                        }}
                    >
                        <h1 className="parallax-title">PRIME</h1>
                    </div>

                    {/* Center Cut Layer: Fresh Ribeye Steak */}
                    <div 
                        className="parallax-layer layer-fg"
                        style={{ 
                            transform: `translate3d(0, ${steakTranslate}px, 0) scale(${steakScale})` 
                        }}
                    >
                        <img 
                            src={transparentSteakSrc || "/hero_steak_isolated.png"} 
                            alt="Fresh USDA Prime Ribeye Cut" 
                            className="parallax-fg-img" 
                        />
                    </div>

                    {/* Floating 3D Badge Chips */}
                    <div 
                        className="hero-floating-chip chip-left"
                        style={{ transform: `translate3d(0, ${badge1Translate}px, 0)` }}
                    >
                        <span className="chip-indicator"></span>
                        <div className="chip-content">
                            <span className="chip-label">USDA PRIME CERTIFIED</span>
                            <span className="chip-value">Dry-Aged 28 Days</span>
                        </div>
                    </div>

                    <div 
                        className="hero-floating-chip chip-right"
                        style={{ transform: `translate3d(0, ${badge2Translate}px, 0)` }}
                    >
                        <span className="chip-indicator active"></span>
                        <div className="chip-content">
                            <span className="chip-label">PASTURE-RAISED</span>
                            <span className="chip-value">100% Grass-Finished</span>
                        </div>
                    </div>

                    <div 
                        className="hero-floating-chip chip-bottom"
                        style={{ transform: `translate3d(0, ${badge3Translate}px, 0)` }}
                    >
                        <svg className="chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <div className="chip-content">
                            <span className="chip-label">SUB-38°F COLD-CHAIN</span>
                            <span className="chip-value">Guaranteed Fresh Delivery</span>
                        </div>
                    </div>

                    {/* Fixed Hero Social Anchors */}
                    <div className="hero-social-anchors">
                        <a href="#instagram" onClick={(e) => e.preventDefault()}>Instagram.</a>
                        <a href="#facebook" onClick={(e) => e.preventDefault()}>Facebook.</a>
                        <a href="#youtube" onClick={(e) => e.preventDefault()}>Youtube.</a>
                    </div>
                </div>

                {/* Hero Foreground Content Overlay */}
                <div 
                    className="hero-content-overlay"
                    style={{ opacity: heroContentOpacity }}
                >
                    <div className="hero-statement-container">
                        <div className="hero-eyebrow-badge">
                            <span className="eyebrow-dot"></span>
                            <span>EST. 2026 • REGENERATIVE AMERICAN RANCHING</span>
                        </div>
                        <h2 className="hero-headline">
                            Peak Flavor. Cut To Order. Delivered Peak Fresh.
                        </h2>
                        <p className="hero-subtext">
                            Pure pasture-raised beef, heritage breed pork, and organic poultry hand-portioned daily by master butchers and dispatched under unbroken sub-38°F cold-chain parameters.
                        </p>
                        <div className="hero-actions-row">
                            <a href="#shop" className="hero-btn-primary" onClick={handleShopClick}>
                                <span>Shop Fresh Cuts</span>
                                <svg className="btn-arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </a>
                            <a href="#farms" className="hero-btn-secondary" onClick={(e) => handleScrollTo(e, 'farms')}>
                                <span>Our Sourcing Story</span>
                                <svg className="btn-arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Animated Scroll Prompt */}
                    <div className="hero-scroll-cue" onClick={(e) => handleScrollTo(e, 'cuts')}>
                        <span className="scroll-cue-text">SCROLL TO EXPLORE</span>
                        <div className="scroll-cue-indicator">
                            <span className="scroll-cue-dot"></span>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 2. LIVE BRAND TRUST RIBBON --- */}
            <section className="brand-trust-ribbon">
                <div className="ribbon-outer">
                    <div className="trust-item">
                        <span className="trust-icon">🌿</span>
                        <span className="trust-title">100% Pasture-Raised</span>
                        <span className="trust-desc">Restorative clover grazing</span>
                    </div>
                    <div className="trust-separator"></div>
                    <div className="trust-item">
                        <span className="trust-icon">🥩</span>
                        <span className="trust-title">Master Butcher Cuts</span>
                        <span className="trust-desc">Portioned fresh daily</span>
                    </div>
                    <div className="trust-separator"></div>
                    <div className="trust-item">
                        <span className="trust-icon">❄️</span>
                        <span className="trust-title">Sub-38°F Cold-Chain</span>
                        <span className="trust-desc">Insulated dry-ice transit</span>
                    </div>
                    <div className="trust-separator"></div>
                    <div className="trust-item">
                        <span className="trust-icon">🚫</span>
                        <span className="trust-title">Zero Added Hormones</span>
                        <span className="trust-desc">No sub-therapeutic antibiotics</span>
                    </div>
                    <div className="trust-separator"></div>
                    <div className="trust-item">
                        <span className="trust-icon">🏡</span>
                        <span className="trust-title">Family Ranch Direct</span>
                        <span className="trust-desc">Full supply traceability</span>
                    </div>
                </div>
            </section>

            {/* --- 3. SIGNATURE CUTS SHOWCASE (ID: CUTS) --- */}
            <section id="cuts" className="featured-cuts-section">
                <div className="section-container">
                    <div className="section-header-block">
                        <span className="section-eyebrow">THE BUTCHER'S SELECTION</span>
                        <h2 className="section-title">Curated Cuts For The Discerning Table</h2>
                        <p className="section-subtitle">
                            Sourced from small family pastures, trimmed to exacting steakhouse specifications, and instantly vacuum-sealed at peak flavor.
                        </p>
                    </div>

                    <div className="cuts-grid">
                        {/* Product Card 1: Ribeye */}
                        <div className="cut-card">
                            <div className="cut-card-media">
                                <img src="/ribeye.png" alt="USDA Prime Bone-In Ribeye" className="cut-card-img" />
                                <span className="cut-badge primary">USDA PRIME</span>
                                <span className="cut-aging-badge">28-Day Dry Aged</span>
                            </div>
                            <div className="cut-card-body">
                                <div className="cut-card-meta">
                                    <span className="cut-origin">Black Angus • Grass-Fed</span>
                                    <span className="cut-portion">16 oz • Thick Cut</span>
                                </div>
                                <h3 className="cut-name">Dry-Aged Bone-In Ribeye</h3>
                                <p className="cut-description">
                                    Intense marbling paired with nutty, buttery depth developed through four weeks of humidity-controlled Himalayan salt chamber aging.
                                </p>
                                <div className="cut-card-footer">
                                    <button className="cut-order-btn" onClick={handleShopClick}>
                                        <span>Order In Shop</span>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Product Card 2: Pork Chops */}
                        <div className="cut-card">
                            <div className="cut-card-media">
                                <img src="/porkchops.png" alt="Heritage Breed Pork Chops" className="cut-card-img" />
                                <span className="cut-badge">HERITAGE BREED</span>
                                <span className="cut-aging-badge">Pasture Foraged</span>
                            </div>
                            <div className="cut-card-body">
                                <div className="cut-card-meta">
                                    <span className="cut-origin">Berkshire • Woodland Grazed</span>
                                    <span className="cut-portion">14 oz • Bone-In Cut</span>
                                </div>
                                <h3 className="cut-name">Heritage Thick Pork Chops</h3>
                                <p className="cut-description">
                                    Naturally marbled Berkshire pork with tender, juicy grain and a delicate fat cap that renders to golden perfection on the grill.
                                </p>
                                <div className="cut-card-footer">
                                    <button className="cut-order-btn" onClick={handleShopClick}>
                                        <span>Order In Shop</span>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Product Card 3: Chicken */}
                        <div className="cut-card">
                            <div className="cut-card-media">
                                <img src="/chicken.png" alt="Pasture-Raised Whole Organic Chicken" className="cut-card-img" />
                                <span className="cut-badge">100% FREE RANGE</span>
                                <span className="cut-aging-badge">Air-Chilled</span>
                            </div>
                            <div className="cut-card-body">
                                <div className="cut-card-meta">
                                    <span className="cut-origin">Clover Pasture • Non-GMO</span>
                                    <span className="cut-portion">4.5 lbs • Whole Bird</span>
                                </div>
                                <h3 className="cut-name">Pasture-Raised Whole Chicken</h3>
                                <p className="cut-description">
                                    Raised outdoors on open pastures with complete dietary freedom. 100% air-chilled without water bath absorption for ultra-crisp skin.
                                </p>
                                <div className="cut-card-footer">
                                    <button className="cut-order-btn" onClick={handleShopClick}>
                                        <span>Order In Shop</span>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Product Card 4: Ground Beef */}
                        <div className="cut-card">
                            <div className="cut-card-media">
                                <img src="/groundbeef.png" alt="Artisanal Prime Ground Beef" className="cut-card-img" />
                                <span className="cut-badge primary">WHOLE MUSCLE</span>
                                <span className="cut-aging-badge">80 / 20 Ratio</span>
                            </div>
                            <div className="cut-card-body">
                                <div className="cut-card-meta">
                                    <span className="cut-origin">100% Grass-Fed • Single Source</span>
                                    <span className="cut-portion">1 lb Vacuum Pack</span>
                                </div>
                                <h3 className="cut-name">Artisanal Prime Ground Beef</h3>
                                <p className="cut-description">
                                    Coarsely ground exclusively from whole prime chuck and brisket cuts — never trimmings. Incredible flavor for burgers, meatballs, and ragù.
                                </p>
                                <div className="cut-card-footer">
                                    <button className="cut-order-btn" onClick={handleShopClick}>
                                        <span>Order In Shop</span>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Storefront Banner */}
                    <div className="cuts-storefront-banner">
                        <div className="banner-left">
                            <span className="banner-tag">FULL ARTISAN CATALOG</span>
                            <h4>Looking for specialty steaks, custom roasts, or curated butcher boxes?</h4>
                            <p>Explore our complete inventory of prime steaks, ribs, and seasonal specialty butcher cuts.</p>
                        </div>
                        <button className="btn-primary banner-cta" onClick={handleShopClick}>
                            <span>Browse Complete Storefront</span>
                            <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </section>

            {/* --- 4. OUR HERITAGE & REGENERATIVE GRAZING (ID: FARMS) --- */}
            <section id="farms" className="farms-heritage-section">
                <div className="section-container">
                    <div className="farms-grid-row">
                        {/* Editorial Narrative */}
                        <div className="farms-narrative-col">
                            <span className="section-eyebrow">OUR HERITAGE & SOURCING</span>
                            <h2 className="section-title text-left">Regenerative Grazing. Exceptional Quality.</h2>
                            
                            <p className="farms-lead-paragraph">
                                We partner exclusively with multi-generational, family-owned ranches committed to restorative soil ecology and humane animal husbandry. Our herds roam freely across open clover pastures, never confined to industrial feedlots or grain-finished.
                            </p>

                            <p className="farms-body-paragraph">
                                This natural, rotational grazing lifestyle allows animals to mature slowly at their own natural pace. The result is pure beef with deeper crimson coloration, higher concentrations of healthy Omega-3s and CLA, and an authentic, savory flavor profile that factory-farmed cuts simply cannot replicate.
                            </p>

                            {/* Stat Counters Grid */}
                            <div className="farms-metrics-grid">
                                <div className="metric-box">
                                    <div className="metric-number">100%</div>
                                    <div className="metric-label">Pasture-Raised & Finished</div>
                                    <div className="metric-sub">Zero feedlot confinement</div>
                                </div>
                                <div className="metric-box">
                                    <div className="metric-number">Zero</div>
                                    <div className="metric-label">Hormones & Antibiotics</div>
                                    <div className="metric-sub">Pure biological integrity</div>
                                </div>
                                <div className="metric-box">
                                    <div className="metric-number">28 Days</div>
                                    <div className="metric-label">Natural Dry-Aging</div>
                                    <div className="metric-sub">In cedar-lined rooms</div>
                                </div>
                                <div className="metric-box">
                                    <div className="metric-number">4.98★</div>
                                    <div className="metric-label">Chef Quality Rating</div>
                                    <div className="metric-sub">Verified restaurant score</div>
                                </div>
                            </div>
                        </div>

                        {/* Visual Col */}
                        <div className="farms-visual-col">
                            <div className="farms-photo-frame">
                                <img src="/pasture.png" alt="Cattle grazing on restorative clover pasture" className="farms-photo" />
                                <div className="farms-photo-overlay"></div>
                                <div className="farms-photo-chip chip-top">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <span>Ecologically Certified Pastures</span>
                                </div>
                                <div className="farms-photo-chip chip-bottom">
                                    <span>Pacific Northwest Ranch Partners</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 5. THE COLD-CHAIN JOURNEY (ID: PROCESS) --- */}
            <section id="process" className="cold-chain-section">
                <div className="section-container">
                    <div className="section-header-block">
                        <span className="section-eyebrow">THE UNBROKEN CHAIN</span>
                        <h2 className="section-title">The Sub-Zero Cold-Chain Journey</h2>
                        <p className="section-subtitle">
                            Freshness is not a marketing promise — it is an unbroken thermodynamic commitment maintained at sub-38°F from the butcher's block directly to your doorstep.
                        </p>
                    </div>

                    <div className="cold-chain-stepper">
                        {/* Step 1 */}
                        <div className="stepper-card">
                            <div className="stepper-index">01</div>
                            <div className="stepper-icon-wrap">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879a3 3 0 11-4.242-4.242L10.758 4.88a3 3 0 014.242 0l4.242 4.242a3 3 0 010 4.242l-5.121 5.121z" />
                                </svg>
                            </div>
                            <span className="stepper-temp-badge">MONITORED AT 34°F</span>
                            <h3 className="stepper-step-title">Precision Cut & Trim</h3>
                            <p className="stepper-step-desc">
                                Every selection is portion-cut and hand-trimmed to order inside our sterile clean facility, strictly held at 34°F to halt oxidation.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="stepper-card">
                            <div className="stepper-index">02</div>
                            <div className="stepper-icon-wrap">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <span className="stepper-temp-badge">OXYGEN ZERO BARRIER</span>
                            <h3 className="stepper-step-title">High-Barrier Vacuum Seal</h3>
                            <p className="stepper-step-desc">
                                Cuts are sealed instantly in medical-grade copolymer barrier pouches. Eliminates oxygen, locking in all natural juices and preventing freezer burn.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="stepper-card">
                            <div className="stepper-index">03</div>
                            <div className="stepper-icon-wrap">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3m15.364-6.364l-12.728 12.728m0-12.728l12.728 12.728" />
                                </svg>
                            </div>
                            <span className="stepper-temp-badge">SOLID DRY ICE PACKING</span>
                            <h3 className="stepper-step-title">Thermal Insulated Transit</h3>
                            <p className="stepper-step-desc">
                                We pack each order inside heavy-duty thermal insulated box liners surrounded by calculated solid dry ice slabs engineered for 48 hours of transit.
                            </p>
                        </div>

                        {/* Step 4 */}
                        <div className="stepper-card">
                            <div className="stepper-index">04</div>
                            <div className="stepper-icon-wrap">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="stepper-temp-badge">GUARANTEED SUB-38°F</span>
                            <h3 className="stepper-step-title">Doorstep Arrival</h3>
                            <p className="stepper-step-desc">
                                Dispatched via express cold-chain courier directly to your kitchen. Arrives chilled or frozen solid, ready for immediate sear or freezer storage.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 6. THE REL'S STANDARD VS SUPERMARKET TABLE --- */}
            <section className="comparison-section">
                <div className="section-container">
                    <div className="section-header-block">
                        <span className="section-eyebrow">THE PURVEYOR'S DIFFERENCE</span>
                        <h2 className="section-title">The Rel's Standard vs. Supermarket Meat</h2>
                        <p className="section-subtitle">
                            Why our pasture-raised craft cuts deliver vastly superior flavor, tenderness, and nutritional density.
                        </p>
                    </div>

                    <div className="comparison-table-wrapper">
                        <table className="comparison-table">
                            <thead>
                                <tr>
                                    <th>Standard Quality Criteria</th>
                                    <th className="highlight-col">Rel's Meat Co. Standard</th>
                                    <th>Industrial Supermarket Meat</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="criteria-name">Animal Diet & Sourcing</td>
                                    <td className="highlight-cell">
                                        <div className="cell-check">
                                            <span className="check-badge">✓</span>
                                            <span>100% pasture-grazed on natural clover & grasses</span>
                                        </div>
                                    </td>
                                    <td className="muted-cell">Confined grain feedlots with byproduct mixes</td>
                                </tr>
                                <tr>
                                    <td className="criteria-name">Growth Hormones & Additives</td>
                                    <td className="highlight-cell">
                                        <div className="cell-check">
                                            <span className="check-badge">✓</span>
                                            <span>Strictly Zero hormones, steroids, or fillers</span>
                                        </div>
                                    </td>
                                    <td className="muted-cell">Routine growth promoters & prophylactic antibiotics</td>
                                </tr>
                                <tr>
                                    <td className="criteria-name">Butcher Craft</td>
                                    <td className="highlight-cell">
                                        <div className="cell-check">
                                            <span className="check-badge">✓</span>
                                            <span>Portion-cut daily by master artisan butchers</span>
                                        </div>
                                    </td>
                                    <td className="muted-cell">Industrial automated central processing plants</td>
                                </tr>
                                <tr>
                                    <td className="criteria-name">Dry-Aging & Flavor</td>
                                    <td className="highlight-cell">
                                        <div className="cell-check">
                                            <span className="check-badge">✓</span>
                                            <span>Up to 28-day humidity controlled aging</span>
                                        </div>
                                    </td>
                                    <td className="muted-cell">Rapid wet-aged in transport with no flavor development</td>
                                </tr>
                                <tr>
                                    <td className="criteria-name">Packaging & Transit</td>
                                    <td className="highlight-cell">
                                        <div className="cell-check">
                                            <span className="check-badge">✓</span>
                                            <span>Medical-grade vacuum seal & sub-zero dry ice</span>
                                        </div>
                                    </td>
                                    <td className="muted-cell">Open polystyrene foam trays flushed with preservative gas</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* --- 7. CHEF & PITMASTER REVIEWS --- */}
            <section className="testimonials-section">
                <div className="section-container">
                    <div className="section-header-block">
                        <span className="section-eyebrow">TESTED BY CULINARY EXPERTS</span>
                        <h2 className="section-title">Endorsed by Chefs & Pitmasters</h2>
                        <p className="section-subtitle">
                            Hear from professional grill masters and executive chefs who trust Rel's Meat Co. for their tables.
                        </p>
                    </div>

                    <div className="testimonials-grid">
                        <div className="testimonial-card">
                            <div className="stars-row">★★★★★</div>
                            <p className="testimonial-quote">
                                "The dry-aged bone-in ribeye marbling is exceptional. The density of flavor and hazelnut crust development rival the finest dry-aging rooms in the country. Unmatched quality."
                            </p>
                            <div className="testimonial-author">
                                <div className="author-avatar">MS</div>
                                <div className="author-info">
                                    <span className="author-name">Chef Marcus Sterling</span>
                                    <span className="author-role">Executive Chef, Hearth & Timber</span>
                                </div>
                            </div>
                        </div>

                        <div className="testimonial-card featured">
                            <div className="stars-row">★★★★★</div>
                            <p className="testimonial-quote">
                                "The unbroken cold-chain transit is genuine. The cuts arrive colder than any supermarket butcher display case. The air-chilled pasture chicken has completely transformed my Sunday roasts."
                            </p>
                            <div className="testimonial-author">
                                <div className="author-avatar">EV</div>
                                <div className="author-info">
                                    <span className="author-name">Elena Vance</span>
                                    <span className="author-role">James Beard Award Author</span>
                                </div>
                            </div>
                        </div>

                        <div className="testimonial-card">
                            <div className="stars-row">★★★★★</div>
                            <p className="testimonial-quote">
                                "Real whole-muscle coarse ground beef with zero gristle or commercial water soak. When you sear a burger from Rel's, it forms a genuine Maillard crust and retains every drop of juice."
                            </p>
                            <div className="testimonial-author">
                                <div className="author-avatar">DC</div>
                                <div className="author-info">
                                    <span className="author-name">David Chen</span>
                                    <span className="author-role">Cascades Championship Pitmaster</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 8. CLOSING BUTCHER'S TABLE CTA --- */}
            <section className="closing-cta-section">
                <div className="closing-cta-card">
                    <div className="closing-cta-glow"></div>
                    <span className="closing-eyebrow">TASTE THE PURVEYOR'S CRAFT</span>
                    <h2 className="closing-title">Elevate Your Kitchen Table Tonight.</h2>
                    <p className="closing-subtitle">
                        Experience the difference of 100% pasture-raised cattle, heritage pork, and air-chilled poultry portioned fresh daily by master butchers.
                    </p>
                    <div className="closing-actions-row">
                        <button className="btn-primary closing-primary-btn" onClick={handleShopClick}>
                            <span>Explore The Butcher's Cuts</span>
                            <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </div>
                    <div className="closing-guarantees">
                        <span className="guarantee-item">✓ 100% Freshness Guarantee</span>
                        <span className="guarantee-item">✓ Express Insulated Cold-Chain Shipping</span>
                        <span className="guarantee-item">✓ Pasture-Raised Certified</span>
                    </div>
                </div>
            </section>

            <Footer onNavigate={onNavigate} />
        </div>
    );
}

export default LandingPage;